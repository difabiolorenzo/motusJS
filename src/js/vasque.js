// VASQUE VIRTUELLE
// Tirage des boules dans une vasque simulée par Matter.js (src/js/lib/matter.min.js, licence MIT).
// La vasque ne décide de rien : son contenu vient de la liste du jeu (Vasque.sync) et un clic
// ne fait que proposer une boule au jeu (rappel onBallChosen, qui passe par pickBall()).
// Le monde physique a une taille fixe (WORLD_SIZE) : seul le dessin suit la taille du canvas.
// Fenêtre publique : mode « miroir » (initMirror), sans physique ; elle dessine les positions envoyées
// par la vue animateur (onChange → postMessage → applyRemote), environ 15 fois par seconde tant que
// des boules bougent, une fois à chaque changement, et plus rien au repos.
// Numéros cachés : le joueur qui pioche ne voit ni les numéros ni les boules noires (toutes les boules ont la
// couleur de l'équipe). Ils ne sont dessinés que dans la vue animateur (setRevealed, panneau animateur ouvert),
// jamais dans la fenêtre publique, qui ne reçoit d'ailleurs pas les valeurs des boules.
// Un seul objet global : Vasque.

const Vasque = (function () {
    const WORLD_SIZE = 600;
    const CENTER = WORLD_SIZE / 2;
    const BOWL_RADIUS = 280;         // rayon intérieur de la vasque
    const BALL_RADIUS = 40;
    const WALL_SEGMENTS = 64;
    const WALL_THICKNESS = 40;
    const REMOVE_DURATION = 250;     // ms : une boule tirée rétrécit avant de quitter la vasque
    const AWAKE_DURATION = 15000;    // ms : durée maximale d'animation après un événement
    const EMIT_INTERVAL = 66;        // ms : envoi des positions pendant le mouvement (environ 15 par seconde)
    const MIRROR_SMOOTHING = 45;     // ms : lissage des positions reçues (fenêtre publique)

    let engine = null;
    let mirror = false;              // fenêtre publique : pas de physique, positions reçues
    let container = null;
    let canvas = null;
    let context = null;
    let items = [];                  // { id, value, body, removing_since }
    let mirror_balls = new Map();    // fenêtre publique : id → { id, value, x, y, target_x, target_y, scale }
    let next_id = 1;
    let current_team = null;
    let on_ball_chosen = null;
    let change_listener = null;
    let last_emit = 0;
    let interactive = false;
    let revealed = false;            // numéros et boules noires visibles (vue animateur seulement)
    let running = false;             // vasque affichée (resume / pause)
    let frame_request = null;
    let last_time = 0;
    let awake_until = 0;
    let hovered = null;
    let pointer_down = null;
    let theme = null;

    const key = value => String(value);
    const reducedMotion = () => typeof prefersReducedMotion == "function" && prefersReducedMotion();

    // Différence entre les boules présentes et la liste du jeu ; les boules noires (« ⚫ ») existent en plusieurs exemplaires.
    // Renvoie { add: valeurs à ajouter (dans l'ordre de la liste du jeu), remove: index des boules présentes à retirer }.
    function diff(current_values, target_values) {
        const count = (values) => {
            const counts = new Map();
            values.forEach(value => counts.set(key(value), (counts.get(key(value)) || 0) + 1));
            return counts;
        };
        const needed = count(target_values);
        const remove = [];
        current_values.forEach((value, index) => {
            const k = key(value);
            if ((needed.get(k) || 0) > 0) { needed.set(k, needed.get(k) - 1); } else { remove.push(index); }
        });
        const available = count(current_values);
        const add = [];
        target_values.forEach(value => {
            const k = key(value);
            if ((available.get(k) || 0) > 0) { available.set(k, available.get(k) - 1); } else { add.push(value); }
        });
        return { add: add, remove: remove };
    }

    // INITIALISATION
    // Canvas, observation de la taille et thème : communs à la vasque simulée et au miroir
    function createCanvas(element) {
        container = element;
        canvas = document.createElement("canvas");
        canvas.className = "vasque_canvas";
        canvas.setAttribute("role", "img");
        canvas.setAttribute("aria-label", "Vasque vide");
        container.appendChild(canvas);
        context = canvas.getContext("2d");

        new ResizeObserver(() => {
            resizeCanvas();
            requestFrame();
        }).observe(container);

        refreshTheme();
        resizeCanvas();
    }

    function init(element, callback) {
        if (engine) { return true; }
        if (mirror) { return false; }
        if (typeof Matter == "undefined") {
            console.warn("Vasque indisponible : Matter.js n'est pas chargé.");
            return false;
        }
        on_ball_chosen = callback;

        engine = Matter.Engine.create({ enableSleeping: true });
        engine.gravity.y = 1;
        buildBowl();

        createCanvas(element);
        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerleave", () => { setHovered(null); });
        return true;
    }

    // Fenêtre publique : vasque dessinée d'après la vue animateur, sans Matter.js
    function initMirror(element) {
        if (mirror) { return true; }
        if (engine) { return false; }
        mirror = true;
        createCanvas(element);
        return true;
    }

    // Paroi circulaire : segments statiques tangents, sans espace entre eux
    function buildBowl() {
        const wall_radius = BOWL_RADIUS + WALL_THICKNESS / 2;
        const segment_length = (2 * Math.PI * wall_radius / WALL_SEGMENTS) * 1.2;
        const walls = [];
        for (let i = 0; i < WALL_SEGMENTS; i++) {
            const angle = (i / WALL_SEGMENTS) * Math.PI * 2;
            walls.push(Matter.Bodies.rectangle(
                CENTER + Math.cos(angle) * wall_radius,
                CENTER + Math.sin(angle) * wall_radius,
                segment_length, WALL_THICKNESS,
                { isStatic: true, angle: angle + Math.PI / 2, friction: 0.05, restitution: 0.4 }
            ));
        }
        Matter.Composite.add(engine.world, walls);
    }

    // BOULES
    function spawnPosition() {
        // Dans la moitié haute de la vasque : les boules tombent au fond
        const angle = Math.PI + Math.random() * Math.PI;
        const distance = Math.sqrt(Math.random()) * (BOWL_RADIUS - BALL_RADIUS - 20) * 0.8;
        return { x: CENTER + Math.cos(angle) * distance, y: CENTER + Math.sin(angle) * distance };
    }

    function addBall(value) {
        const position = spawnPosition();
        const body = Matter.Bodies.circle(position.x, position.y, BALL_RADIUS, {
            restitution: 0.55, friction: 0.02, frictionAir: 0.012, density: 0.002
        });
        Matter.Composite.add(engine.world, body);
        items.push({ id: next_id++, value: value, body: body, removing_since: null });
    }

    function removeItemNow(item) {
        Matter.Composite.remove(engine.world, item.body);
        items = items.filter(other => other !== item);
        if (hovered === item) { hovered = null; }
    }

    function wakeAll() {
        items.forEach(item => Matter.Sleeping.set(item.body, false));
    }

    // Boules posées immobiles au fond, par rangées, dans l'ordre donné (animations réduites)
    function staticPositions(count) {
        const positions = [];
        const gap = 4;
        let y = CENTER + BOWL_RADIUS - BALL_RADIUS - gap;
        while (positions.length < count && y > CENTER - BOWL_RADIUS + BALL_RADIUS) {
            // Centre d'une boule entièrement dans la vasque : à moins de BOWL_RADIUS - BALL_RADIUS du centre
            const inner_radius = BOWL_RADIUS - BALL_RADIUS - gap;
            const half_chord = Math.sqrt(Math.max(0, inner_radius * inner_radius - (y - CENTER) * (y - CENTER)));
            const per_row = Math.max(1, Math.floor((2 * half_chord) / (2 * BALL_RADIUS + gap)) + 1);
            const row_count = Math.min(per_row, count - positions.length);
            const width = (row_count - 1) * (2 * BALL_RADIUS + gap);
            for (let i = 0; i < row_count; i++) {
                positions.push({ x: CENTER - width / 2 + i * (2 * BALL_RADIUS + gap), y: y });
            }
            y -= 2 * BALL_RADIUS + gap;
        }
        return positions;
    }

    function layoutStatic() {
        const live = items.filter(item => item.removing_since === null);
        staticPositions(live.length).forEach((position, index) => {
            Matter.Body.setPosition(live[index].body, position);
            Matter.Body.setVelocity(live[index].body, { x: 0, y: 0 });
        });
    }

    // Aligne le contenu de la vasque sur la liste du jeu (idempotent). Changement d'équipe : vasque reconstruite.
    function sync(values, team) {
        if (!engine) { return; }
        if (team !== current_team) {
            items.slice().forEach(removeItemNow);
            current_team = team;
        }
        const live = items.filter(item => item.removing_since === null);
        const changes = diff(live.map(item => item.value), values);
        const now = performance.now();
        changes.remove.forEach(index => {
            if (reducedMotion() || !running) { removeItemNow(live[index]); } else { live[index].removing_since = now; }
        });
        changes.add.forEach(addBall);
        if (changes.add.length || changes.remove.length) {
            if (reducedMotion()) { layoutStatic(); }
            wakeAll();
            awake_until = now + AWAKE_DURATION;
        }
        updateLabel();
        emitChange(true);
        requestFrame();
    }

    function updateLabel() {
        if (!canvas) { return; }
        const live = mirror
            ? [...mirror_balls.values()].filter(ball => ball.scale >= 1)
            : items.filter(item => item.removing_since === null);
        // Nombre de boules noires annoncé seulement quand elles sont visibles (vue animateur)
        const black_balls = revealed ? live.filter(item => item.value === "⚫").length : 0;
        canvas.setAttribute("aria-label", live.length == 0 ? "Vasque vide"
            : `Vasque : ${live.length} boule(s)${black_balls ? `, dont ${black_balls} noire(s)` : ""}`);
    }

    function shake() {
        if (!engine || !running || reducedMotion()) { return; }
        items.forEach(item => {
            Matter.Sleeping.set(item.body, false);
            Matter.Body.setVelocity(item.body, { x: (Math.random() - 0.5) * 24, y: -(8 + Math.random() * 14) });
        });
        awake_until = performance.now() + AWAKE_DURATION;
        requestFrame();
    }

    // ENVOI À LA FENÊTRE PUBLIQUE (vue animateur)
    // État compact : équipe et, pour chaque boule, [id, x, y, échelle] en entiers (échelle < 1 : boule qui sort).
    // Pas de valeur : la fenêtre publique ne doit pas pouvoir montrer les numéros ni les boules noires.
    function remoteState() {
        const now = performance.now();
        return {
            team: current_team,
            balls: items.map(item => [
                item.id,
                Math.round(item.body.position.x), Math.round(item.body.position.y),
                item.removing_since === null ? 1 : Math.round(Math.max(0, 1 - (now - item.removing_since) / REMOVE_DURATION) * 100) / 100
            ])
        };
    }

    // force : changement de contenu ou retour au repos ; sinon limité à un envoi toutes les EMIT_INTERVAL ms
    function emitChange(force) {
        if (!change_listener || mirror) { return; }
        const now = performance.now();
        if (!force && now - last_emit < EMIT_INTERVAL) { return; }
        last_emit = now;
        change_listener(remoteState());
    }

    // RÉCEPTION (fenêtre publique)
    function applyRemote(state) {
        if (!mirror || !state || !Array.isArray(state.balls)) { return; }
        if (state.team !== current_team) {
            mirror_balls.clear();
            current_team = state.team;
        }
        const seen = new Set();
        state.balls.forEach(([id, x, y, scale]) => {
            seen.add(id);
            let ball = mirror_balls.get(id);
            if (!ball) {
                ball = { id: id, value: null, x: x, y: y };
                mirror_balls.set(id, ball);
            }
            ball.target_x = x;
            ball.target_y = y;
            ball.scale = scale;
        });
        [...mirror_balls.keys()].forEach(id => { if (!seen.has(id)) { mirror_balls.delete(id); } });

        // Animations réduites : boules posées au fond dans un ordre stable, sans suivre le mouvement
        if (reducedMotion()) {
            const live = [...mirror_balls.values()].filter(ball => ball.scale >= 1);
            staticPositions(live.length).forEach((position, index) => {
                live[index].x = live[index].target_x = position.x;
                live[index].y = live[index].target_y = position.y;
            });
        }
        updateLabel();
        requestFrame();
    }

    // BOUCLE : physique et dessin seulement pendant le mouvement ; au repos, plus aucune image calculée
    function requestFrame() {
        if (!running || frame_request !== null || !canvas) { return; }
        frame_request = requestAnimationFrame(frame);
    }

    function frame(time) {
        frame_request = null;
        if (!running) { return; }
        const delta = last_time ? Math.min(32, time - last_time) : 16.67;
        last_time = time;
        const now = performance.now();

        if (mirror) {
            const moving = stepMirror(delta);
            draw(now);
            if (moving) { frame_request = requestAnimationFrame(frame); } else { last_time = 0; }
            return;
        }

        items.filter(item => item.removing_since !== null && now - item.removing_since >= REMOVE_DURATION).forEach(item => {
            removeItemNow(item);
            wakeAll();
        });
        if (!reducedMotion()) { Matter.Engine.update(engine, delta); }
        draw(now);

        const removing = items.some(item => item.removing_since !== null);
        const moving = !reducedMotion() && now < awake_until && items.some(item => !item.body.isSleeping);
        if (removing || moving) {
            emitChange(false);
            frame_request = requestAnimationFrame(frame);
        } else {
            emitChange(true);    // positions de repos : dernier envoi
            last_time = 0;
        }
    }

    // Rapproche chaque boule de sa position reçue ; renvoie true tant qu'une boule n'y est pas
    function stepMirror(delta) {
        const factor = reducedMotion() ? 1 : 1 - Math.exp(-delta / MIRROR_SMOOTHING);
        let moving = false;
        mirror_balls.forEach(ball => {
            const dx = ball.target_x - ball.x;
            const dy = ball.target_y - ball.y;
            if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) {
                ball.x = ball.target_x;
                ball.y = ball.target_y;
            } else {
                ball.x += dx * factor;
                ball.y += dy * factor;
                moving = true;
            }
        });
        return moving;
    }

    // DESSIN (Matter.js ne fait que la physique)
    function refreshTheme() {
        if (!container) { return; }
        const style = getComputedStyle(container);
        const variable = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
        theme = {
            bowl_inner: variable("--vasque_bowl_inner", "#4a5b70"),
            bowl_outer: variable("--vasque_bowl_outer", "#1c2533"),
            bowl_edge: variable("--vasque_bowl_edge", "#c9d6e3"),
            ball_yellow: variable("--vasque_ball_yellow", "#f5c400"),
            ball_yellow_text: variable("--vasque_ball_yellow_text", "#000"),
            ball_blue: variable("--vasque_ball_blue", "#1681c7"),
            ball_blue_text: variable("--vasque_ball_blue_text", "#fff"),
            ball_black: variable("--vasque_ball_black", "#111"),
            hover: variable("--vasque_hover", "#fff"),
            font: variable("--vasque_font", "Helvetica, Arial, sans-serif"),
            font_weight: variable("--vasque_font_weight", "bold"),
            high_contrast: document.body.classList.contains("high_contrast")
        };
    }

    function resizeCanvas() {
        if (!canvas) { return; }
        const ratio = window.devicePixelRatio || 1;
        const size = Math.round(Math.min(container.clientWidth, container.clientHeight) * ratio);
        if (size > 0 && canvas.width !== size) {
            canvas.width = size;
            canvas.height = size;
        }
    }

    function draw(now) {
        const size = canvas.width;
        if (!size || !theme) { return; }
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, size, size);
        const scale = size / WORLD_SIZE;
        context.setTransform(scale, 0, 0, scale, 0, 0);

        const bowl = context.createRadialGradient(CENTER, CENTER - BOWL_RADIUS * 0.35, BOWL_RADIUS * 0.1, CENTER, CENTER, BOWL_RADIUS + 8);
        bowl.addColorStop(0, theme.bowl_inner);
        bowl.addColorStop(1, theme.bowl_outer);
        context.beginPath();
        context.arc(CENTER, CENTER, BOWL_RADIUS + 8, 0, Math.PI * 2);
        context.fillStyle = bowl;
        context.fill();
        context.lineWidth = 10;
        context.strokeStyle = theme.bowl_edge;
        context.stroke();

        if (mirror) {
            mirror_balls.forEach(ball => {
                if (reducedMotion() && ball.scale < 1) { return; }
                drawBall(ball.value, ball.x, ball.y, BALL_RADIUS * ball.scale, false);
            });
            return;
        }
        items.forEach(item => {
            let radius = BALL_RADIUS;
            if (item.removing_since !== null) {
                radius *= Math.max(0, 1 - (now - item.removing_since) / REMOVE_DURATION);
            }
            drawBall(item.value, item.body.position.x, item.body.position.y, radius, interactive && hovered === item);
        });
    }

    function drawBall(value, x, y, radius, is_hovered) {
        if (radius < 1) { return; }
        // Numéros cachés : boule noire dessinée comme les autres, sans numéro
        const black = revealed && value === "⚫";
        const blue = current_team == "blue";

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = black ? theme.ball_black : (blue ? theme.ball_blue : theme.ball_yellow);
        context.fill();

        // Reflet
        const highlight = context.createRadialGradient(x - radius * 0.35, y - radius * 0.4, radius * 0.05, x, y, radius);
        highlight.addColorStop(0, "rgba(255, 255, 255, 0.6)");
        highlight.addColorStop(0.5, "rgba(255, 255, 255, 0.08)");
        highlight.addColorStop(1, "rgba(0, 0, 0, 0.25)");
        context.fillStyle = highlight;
        context.fill();

        // Contour : léger et clair d'ordinaire (boule détachée du fond), net en contraste renforcé
        context.lineWidth = theme.high_contrast ? 3 : 1.5;
        context.strokeStyle = theme.high_contrast ? (black ? "#fff" : "#000") : "rgba(255, 255, 255, 0.55)";
        context.stroke();
        if (is_hovered) {
            context.lineWidth = 5;
            context.strokeStyle = theme.hover;
            context.stroke();
        }

        if (revealed && !black) {
            context.font = `${theme.font_weight} ${Math.round(radius * 1.0)}px ${theme.font}`;
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = blue ? theme.ball_blue_text : theme.ball_yellow_text;
            context.fillText(String(value), x, y + radius * 0.06);
        }
    }

    // POINTEUR : un clic (sans glisser) sur une boule la propose au jeu
    function toWorld(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * WORLD_SIZE / rect.width,
            y: (event.clientY - rect.top) * WORLD_SIZE / rect.height
        };
    }

    function ballAt(point) {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (item.removing_since !== null) { continue; }
            const dx = item.body.position.x - point.x;
            const dy = item.body.position.y - point.y;
            if (dx * dx + dy * dy <= BALL_RADIUS * BALL_RADIUS) { return item; }
        }
        return null;
    }

    function setHovered(item) {
        if (hovered === item) { return; }
        hovered = item;
        canvas.style.cursor = interactive && item ? "pointer" : "default";
        requestFrame();
    }

    function onPointerDown(event) {
        pointer_down = { x: event.clientX, y: event.clientY };
    }

    function onPointerUp(event) {
        const start = pointer_down;
        pointer_down = null;
        if (!interactive || !start) { return; }
        if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) { return; }
        const item = ballAt(toWorld(event));
        if (item && on_ball_chosen) { on_ball_chosen(item.value); }
    }

    function onPointerMove(event) {
        if (!interactive) { return; }
        setHovered(ballAt(toWorld(event)));
    }

    // AFFICHAGE
    // Vue animateur : numéros et boules noires visibles (jamais en mode miroir)
    function setRevealed(value) {
        revealed = value == true && !mirror;
        updateLabel();
        requestFrame();
    }

    function setInteractive(value) {
        interactive = value == true && !mirror;
        if (canvas) {
            canvas.classList.toggle("vasque_interactive", interactive);
            if (!interactive) { setHovered(null); }
        }
        requestFrame();
    }

    function pause() {
        running = false;
        if (frame_request !== null) {
            cancelAnimationFrame(frame_request);
            frame_request = null;
        }
        last_time = 0;
    }

    function resume() {
        if (!engine && !mirror) { return; }
        running = true;
        refreshTheme();
        resizeCanvas();
        if (engine && reducedMotion()) { layoutStatic(); }
        requestFrame();
    }

    return {
        init: init,
        initMirror: initMirror,
        sync: sync,
        shake: shake,
        pause: pause,
        resume: resume,
        setInteractive: setInteractive,
        setRevealed: setRevealed,
        isRevealed: () => revealed,
        refreshTheme: () => { refreshTheme(); requestFrame(); },
        // Vue animateur : rappel appelé à chaque changement et pendant le mouvement (état pour la fenêtre publique)
        onChange: (callback) => { change_listener = callback; },
        getRemoteState: () => engine ? remoteState() : null,
        applyRemote: applyRemote,
        isReady: () => engine !== null,
        isMirror: () => mirror,
        isRunning: () => running,
        isAnimating: () => frame_request !== null,
        // Boules présentes : numéro et position dans le monde (WORLD_SIZE × WORLD_SIZE), pour les tests
        getBalls: () => mirror
            ? [...mirror_balls.values()].filter(ball => ball.scale >= 1)
                .map(ball => ({ value: ball.value, x: Math.round(ball.x), y: Math.round(ball.y) }))
            : items.filter(item => item.removing_since === null)
                .map(item => ({ value: item.value, x: Math.round(item.body.position.x), y: Math.round(item.body.position.y) })),
        worldSize: WORLD_SIZE,
        diff: diff,
        staticPositions: staticPositions
    };
})();
