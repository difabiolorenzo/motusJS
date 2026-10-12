// VUE ANIMATEUR
// - Panneau réservé à l'animateur (touche 7 / è) : mot à trouver, prochains mots, boules, actions rapides, annulation.
// - Fenêtre publique (index.html?vue=public) : n'affiche que la grille, synchronisée par postMessage
//   (fonctionne aussi sans serveur, en file://). Elle ne reçoit que ce qui est affiché, jamais le mot à trouver.

const IS_PUBLIC_VIEW = new URLSearchParams(location.search).get("vue") == "public";
const PUBLIC_WINDOW_NAME = "motus_public";
const UNDO_LIMIT = 5;

let public_window = null;           // fenêtre publique (côté animateur)
let public_sound_blocked = false;   // la fenêtre publique n'a pas encore le droit de jouer du son
let animator_refresh_timer = null;
let undo_stack = [];

function initAnimator() {
    if (IS_PUBLIC_VIEW) {
        initPublicView();
        return;
    }
    // Tout changement affiché dans la zone de jeu met à jour le panneau et la fenêtre publique
    const observer = new MutationObserver(scheduleAnimatorRefresh);
    observer.observe(document.getElementById("game_grid"), { subtree: true, childList: true, attributes: true, characterData: true });
    observer.observe(document.getElementById("game_page"), { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("message", onAnimatorMessage);
    setInterval(checkPublicWindow, 1000);
}

function scheduleAnimatorRefresh() {
    clearTimeout(animator_refresh_timer);
    animator_refresh_timer = setTimeout(function() {
        updateAnimatorPanel();
        sendPublicSnapshot();
    }, 40);
}

// PANNEAU
function toggleAnimatorPanel(open) {
    const panel = document.getElementById("animator_panel");
    const show = open === undefined ? panel.classList.contains("d-none") : open == true;
    panel.classList.toggle("d-none", !show);
    document.getElementById("game").classList.toggle("animator_open", show);
    document.getElementById("topbar_button_animator").setAttribute("aria-pressed", show ? "true" : "false");
    if (show) { updateAnimatorPanel(); }
}

function savingBallLabel(number, state) {
    switch (state) {
        case "available": return `${number} (pas encore tirée)`;
        case "stored": return `${number} (tirée : protège de la prochaine boule noire)`;
        case "used": return `${number} (utilisée)`;
        default: return "aucune";
    }
}

function updateAnimatorPanel() {
    const panel = document.getElementById("animator_panel");
    if (!panel || panel.classList.contains("d-none")) { return; }
    const set = (id, html) => {
        const element = document.getElementById(id);
        if (element.innerHTML !== html) { element.innerHTML = html; }
    };
    const has_word = game.started == true && !!game.word_to_find;

    // Grille de mots
    set("animator_word", has_word ? game.word_to_find : "—");
    let status = "";
    if (has_word) {
        status = `Ligne ${Math.min(game.try_count_index, game.try_number_max)} sur ${game.try_number_max}`;
        if (game.word_found) { status += " · trouvé"; } else if (game.word_displayed) { status += " · solution affichée"; }
    }
    set("animator_lines", status);
    const proposed = has_word ? (game.word_proposed_list || []) : [];
    set("animator_proposed", proposed.length ? proposed.join(", ") : "aucun");
    const next_words = (game.word_to_find_list || []).slice(has_word ? 1 : 0);
    set("animator_next", next_words.length ? next_words.join(", ")
        : (settings.always_ask ? "longueur demandée à chaque mot" : `au hasard, ${settings.always_ask_length} lettres`));

    // Équipes et scores
    const score_yellow = game.score_yellow || 0;
    const score_blue = game.score_blue || 0;
    set("animator_teams", settings.team_enabled
        ? `Main : <strong>${teamLabel(game.team_focus)}</strong> · Jaune ${score_yellow} · Bleue ${score_blue}`
        : `Score : ${score_yellow}`);

    // Grille de numéros
    const has_numbers = settings.number_grid_enabled == true && game.state && game.state.number_grid_complete == true && game.number_grid_possible;
    document.getElementById("animator_numbers_section").classList.toggle("d-none", !has_numbers);
    if (has_numbers) {
        const teams = settings.team_enabled ? ["yellow", "blue"] : ["yellow"];
        const lines = teams.map(team => {
            const possible = game.number_grid_possible[team] || [];
            const numbers = possible.filter(number => number !== "⚫").sort((a, b) => a - b);
            const black_balls = possible.length - numbers.length;
            const saving_ball = game.number_grid_saving_ball ? game.number_grid_saving_ball[team] : undefined;
            const saving_state = game.number_grid_saving_ball_state ? game.number_grid_saving_ball_state[team] : "unavailable";
            const summary = `Boules noires : ${black_balls} · Boule magique : ${savingBallLabel(saving_ball, saving_state)}`;
            // Équipe qui a la main : grille cliquable ; autre équipe : liste des numéros
            if (team == game.team_focus) {
                return `<p><strong>${teamLabel(team)}</strong> (a la main)</p>${buildAnimatorBallGrid(team)}<p>${summary}</p>`;
            }
            return `<p><strong>${teamLabel(team)}</strong> : ${numbers.join(" ") || "aucune boule"}<br>${summary}</p>`;
        });
        lines.push(`<p>Tirages restants : ${game.number_grid_try_left ?? "—"}${game.motus_aligned ? " · MOTUS aligné" : ""}</p>`);
        set("animator_numbers", lines.join(""));
    }

    // Annulation
    const undo_button = document.getElementById("animator_undo_button");
    undo_button.disabled = undo_stack.length == 0;
    set("animator_undo_count", undo_stack.length ? `(${undo_stack.length})` : "");

    updatePublicWindowStatus();
}

// Tirage depuis le panneau : possible sur la grille de numéros, après un mot trouvé (ou pioche déverrouillée),
// s'il reste des tirages
function canPickBallFromPanel() {
    return game.started == true && game.focus_on == "number" && (game.word_found == true || game.number_grid_unlocked == true)
        && game.number_grid_try_left > 0 && game.motus_aligned != true;
}

// L'animateur peut forcer la pioche : aucun mot trouvé, ou plus de tirage (pas après un MOTUS : il faut changer de grille)
function canUnlockBallPicking() {
    return game.started == true && game.focus_on == "number" && game.motus_aligned != true && !canPickBallFromPanel();
}

function unlockBallPicking() {
    if (!canUnlockBallPicking()) { return; }
    game.number_grid_unlocked = true;
    if (!(game.number_grid_try_left > 0)) {
        game.number_grid_try_left = Number(settings.try_picking_ball);
    }
    updateNumberLeftIndicator();
    UpdateNumberSelectMode();
    displayNumberGridUserAction("return_letter_grid", false);
    // Pas de bandeau : la décision de l'animateur n'est pas montrée au public
    announce(`Pioche déverrouillée : ${game.number_grid_try_left} tirage(s).`);
    updateAnimatorPanel();
}

// Copie de la grille de numéros de l'équipe : boules à tirer cliquables, boules déjà sorties ou masquées grisées
function buildAnimatorBallGrid(team) {
    const grid_index = game.number_grid_index + 1;
    const grid = game.number_grid_data[team][grid_index];
    const mask = game.number_grid_data.mask[grid_index];
    const possible = game.number_grid_possible[team] || [];
    const saving_ball = game.number_grid_saving_ball ? game.number_grid_saving_ball[team] : undefined;
    const saving_state = game.number_grid_saving_ball_state ? game.number_grid_saving_ball_state[team] : "unavailable";
    const enabled = canPickBallFromPanel();
    const disabled = enabled ? "" : " disabled";

    let cells = "";
    for (let i = 0; i < grid.length; i++) {
        const number = grid[i];
        if (mask[i] == 0) {
            // Case déjà remplie au départ
            cells += `<span class="animator_ball animator_ball_placed" aria-hidden="true"></span>`;
        } else if (!possible.includes(number)) {
            // Boule déjà tirée
            cells += `<span class="animator_ball animator_ball_drawn" title="Boule ${number} déjà tirée">${number}</span>`;
        } else {
            const is_saving = number === saving_ball && saving_state == "available";
            const label = is_saving ? `Tirer la boule ${number} (boule magique)` : `Tirer la boule ${number}`;
            cells += `<button type="button" class="animator_ball animator_ball_${team}${is_saving ? " animator_ball_saving" : ""}"`
                + ` onclick="pickBallFromPanel(${number})" aria-label="${label}" title="${label}"${disabled}>${number}</button>`;
        }
    }

    const black_balls = possible.filter(number => number === "⚫").length;
    let hint = "";
    if (!enabled) {
        if (game.focus_on != "number") { hint = "Passez sur la grille de numéros (touche 6) pour tirer."; }
        else if (game.word_found != true) { hint = "Tirage possible après un mot trouvé."; }
        else if (game.motus_aligned == true) { hint = "MOTUS aligné : changez de grille."; }
        else { hint = "Plus de tirage pour ce mot."; }
    }
    return `<div class="animator_ball_grid" role="group" aria-label="Grille de numéros de l'équipe ${teamLabel(team).toLowerCase()}">${cells}</div>`
        + `<div class="animator_ball_actions">`
        + `<button type="button" class="animator_black_ball" onclick="pickBallFromPanel('⚫')"${black_balls > 0 ? disabled : " disabled"}>Boule noire (${black_balls})</button>`
        + `<button type="button" onclick="pickBallFromPanel('random')"${disabled}>Au hasard</button>`
        + `</div>`
        + (hint ? `<p class="animator_hint">${hint}</p>` : "")
        + (canUnlockBallPicking()
            ? `<button type="button" class="animator_unlock_button" onclick="unlockBallPicking()">Déverrouiller la pioche (${game.number_grid_try_left > 0 ? game.number_grid_try_left : settings.try_picking_ball} tirage(s))</button>`
            : "");
}

function pickBallFromPanel(number) {
    if (!canPickBallFromPanel()) {
        showGameMessage("Tirage impossible pour l'instant.");
        return;
    }
    if (number === "random") { randomPickBall(); } else { pickBall(number); }
    updateAnimatorPanel();
}

// Commandes du panneau, des raccourcis clavier et de la barre haute : les actions de la grille de mots
// sont mémorisées pour pouvoir être annulées (Ctrl+Z)
function animatorCommand(command) {
    if (game.started != true) { return; }
    const letter_commands = ["new_line", "bonus", "remove_line", "replace_line", "new_word", "solution", "times_up"];
    if (letter_commands.includes(command) && game.focus_on != "letter") {
        showGameMessage("Action disponible sur la grille de mots.");
        return;
    }
    switch (command) {
        case "new_line": recordUndo(); newWordLine(); break;
        case "bonus": recordUndo(); addBonusLetter(); break;
        case "remove_line": recordUndo(); removeWordLine(); break;
        case "replace_line": recordUndo(); reinitWordLine(); updateCursor(); break;
        case "switch_team": recordUndo(); switchTeamFocus(); break;
        case "switch_grid": switchGameGridFocusOn(); break;
        case "new_word": wordReinit(); break;
        case "solution": displaySolution(); break;
        case "times_up": timesUp(); break;
        case "undo": undoLastAction(); break;
    }
    updateAnimatorPanel();
}

// ANNULATION
// Vrai pendant une vérification, l'affichage de la solution ou le délai après une erreur (voir markGameBusy)
function isGameBusy() {
    return Date.now() < (game.busy_until || 0);
}

function markGameBusy(duration) {
    game.busy_until = Math.max(game.busy_until || 0, Date.now() + duration);
}

const UNDO_FIELDS = ["try_count_index", "word_proposed", "word_proposed_modified", "word_proposed_list", "letter_placement_status",
    "word_displayed", "word_found", "team_focus", "score_yellow", "score_blue", "keyboard_cursor_position", "conditional_submit_confirmed"];

function recordUndo() {
    if (game.focus_on != "letter" || !game.word_to_find || isGameBusy()) { return; }
    const state = {};
    UNDO_FIELDS.forEach(field => { state[field] = structuredClone(game[field]); });
    undo_stack.push({
        word: game.word_to_find,
        state: state,
        grid: document.getElementById("letter_grid_placeolder").innerHTML,
        indicator: document.getElementById("word_typing_indicator").innerText
    });
    if (undo_stack.length > UNDO_LIMIT) { undo_stack.shift(); }
}

function clearUndo() {
    undo_stack = [];
}

function undoLastAction() {
    if (isGameBusy()) {
        showGameMessage("Impossible d'annuler pendant une vérification.");
        return;
    }
    const snapshot = undo_stack[undo_stack.length - 1];
    if (!snapshot || snapshot.word != game.word_to_find || game.focus_on != "letter") {
        showGameMessage("Rien à annuler.");
        return;
    }
    undo_stack.pop();
    UNDO_FIELDS.forEach(field => { game[field] = structuredClone(snapshot.state[field]); });
    document.getElementById("letter_grid_placeolder").innerHTML = snapshot.grid;
    document.getElementById("word_typing_indicator").innerText = snapshot.indicator;
    setTeamScore("yellow", game.score_yellow || 0);
    setTeamScore("blue", game.score_blue || 0);
    updateScores();
    startProposalTimer();
    showGameMessage("Dernière action annulée");
    announce("Dernière action annulée.");
}

// FENÊTRE PUBLIQUE (côté animateur)
function isPublicWindowOpen() {
    return public_window != null && !public_window.closed;
}

function publicViewUrl() {
    return location.href.split(/[?#]/)[0] + "?vue=public";
}

function togglePublicWindow() {
    if (isPublicWindowOpen()) {
        public_window.close();
        public_window = null;
        public_sound_blocked = false;
    } else {
        public_window = window.open(publicViewUrl(), PUBLIC_WINDOW_NAME, "popup=yes,width=1280,height=800");
        if (!public_window) {
            showGameMessage("Fenêtre bloquée par le navigateur : autorisez les fenêtres pop-up pour ce site.", 5000);
        }
    }
    updatePublicWindowStatus();
}

function checkPublicWindow() {
    if (public_window != null && public_window.closed) {
        public_window = null;
        public_sound_blocked = false;
        updatePublicWindowStatus();
    }
}

function updatePublicWindowStatus() {
    const status = document.getElementById("animator_public_status");
    const button = document.getElementById("animator_public_button");
    if (!status || !button) { return; }
    let text = "Fermée.";
    if (isPublicWindowOpen()) {
        text = public_sound_blocked
            ? "Ouverte. Son bloqué : cliquez une fois dans la fenêtre publique (les sons sont joués ici en attendant)."
            : "Ouverte.";
    }
    if (status.textContent != text) { status.textContent = text; }
    const label = isPublicWindowOpen() ? "Fermer la fenêtre publique" : "Ouvrir la fenêtre publique";
    if (button.textContent != label) { button.textContent = label; }
}

// Les sons partent vers la fenêtre publique si elle est ouverte et autorisée à jouer (réglage « public_window_sounds »)
function shouldPlaySoundInPublicWindow() {
    return !IS_PUBLIC_VIEW && settings.public_window_sounds == true && isPublicWindowOpen() && !public_sound_blocked;
}

function sendToPublicWindow(message) {
    if (isPublicWindowOpen()) {
        public_window.postMessage(message, "*");
    }
}

// État affiché de la zone de jeu : uniquement ce que voit le public (jamais game.word_to_find)
const PUBLIC_LEAF_SELECTOR = ".cellNEW, .score, #proposal_timer, #game_message, #word_typing_indicator";

function buildPublicSnapshot() {
    const root = document.getElementById("game_grid");
    const items = [...root.querySelectorAll("[id]")].map(element => ({
        id: element.id,
        className: element.getAttribute("class"),
        style: element.getAttribute("style"),
        html: element.matches(PUBLIC_LEAF_SELECTOR) ? element.innerHTML : null
    }));
    return {
        pageClass: document.getElementById("game_page").className,
        highContrast: document.body.classList.contains("high_contrast"),
        signature: items.map(item => item.id).join(","),
        html: root.innerHTML,
        items: items
    };
}

function sendPublicSnapshot() {
    if (isPublicWindowOpen()) {
        sendToPublicWindow({ type: "motus_state", snapshot: buildPublicSnapshot() });
    }
}

function onAnimatorMessage(event) {
    const data = event.data;
    if (!data || typeof data != "object") { return; }
    if (data.type == "motus_public_hello") {
        // Ouverture, rechargement de la fenêtre publique ou de cette page : la fenêtre publique se signale
        if (public_window !== event.source || data.first == true) {
            public_window = event.source;
            public_sound_blocked = false;
            sendPublicSnapshot();
            updatePublicWindowStatus();
        }
        return;
    }
    if (event.source !== public_window) { return; }
    if (data.type == "motus_sound_blocked") { public_sound_blocked = true; updatePublicWindowStatus(); }
    if (data.type == "motus_sound_ok") { public_sound_blocked = false; updatePublicWindowStatus(); }
}

// FENÊTRE PUBLIQUE (côté public)
function initPublicView() {
    document.body.classList.add("public_view");
    document.title = "MotusJS · écran public";
    displayPage("game_page");
    window.addEventListener("message", onPublicMessage);
    document.addEventListener("click", unlockPublicSound);

    if (!window.opener) {
        showGameMessage("Ouvrez cette fenêtre depuis le panneau animateur (touche 7 pendant une partie).", 0);
        return;
    }
    showGameMessage("En attente de la vue animateur…", 0);
    // Signalement régulier : la vue animateur retrouve cette fenêtre même après avoir été rechargée
    const hello = (first) => {
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: "motus_public_hello", first: first }, "*");
        }
    };
    hello(true);
    setInterval(() => hello(false), 2000);
}

function onPublicMessage(event) {
    if (event.source !== window.opener || !event.data || typeof event.data != "object") { return; }
    if (event.data.type == "motus_state") { applyPublicSnapshot(event.data.snapshot); }
    if (event.data.type == "motus_sound") { playPublicSound(event.data.sound); }
}

function applyPublicSnapshot(snapshot) {
    const page = document.getElementById("game_page");
    page.className = snapshot.pageClass.replace(/\bd-none\b/g, "").trim();
    document.body.classList.toggle("high_contrast", snapshot.highContrast == true);

    const root = document.getElementById("game_grid");
    // Structure différente (nouveau mot, nouvelle grille) : reconstruction complète
    if (root.dataset.signature !== snapshot.signature) {
        root.innerHTML = snapshot.html;
        root.dataset.signature = snapshot.signature;
        return;
    }
    // Même structure : seuls les éléments modifiés sont touchés (les animations en cours ne redémarrent pas)
    for (const item of snapshot.items) {
        const element = document.getElementById(item.id);
        if (!element) {
            root.innerHTML = snapshot.html;
            return;
        }
        if (element.getAttribute("class") !== item.className) {
            if (item.className === null) { element.removeAttribute("class"); } else { element.setAttribute("class", item.className); }
        }
        if (element.getAttribute("style") !== item.style) {
            if (item.style === null) { element.removeAttribute("style"); } else { element.setAttribute("style", item.style); }
        }
        if (item.html !== null && element.innerHTML !== item.html) {
            element.innerHTML = item.html;
        }
    }
}

function playPublicSound(sound) {
    if (!SOUND_FILES[sound]) { return; }
    playAudio(SOUND_FILES[sound]).then(played => {
        if (!played) {
            // Lecture refusée tant que personne n'a cliqué dans cette fenêtre (règle des navigateurs)
            document.getElementById("public_sound_notice").classList.remove("d-none");
            window.opener.postMessage({ type: "motus_sound_blocked" }, "*");
        }
    });
}

function unlockPublicSound() {
    const notice = document.getElementById("public_sound_notice");
    if (notice.classList.contains("d-none")) { return; }
    const audio = new Audio(SOUND_FILES.letter_ok);
    audio.volume = 0;
    audio.play().then(() => {
        notice.classList.add("d-none");
        if (window.opener) { window.opener.postMessage({ type: "motus_sound_ok" }, "*"); }
    }).catch(() => {});
}
