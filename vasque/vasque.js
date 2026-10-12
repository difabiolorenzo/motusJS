const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Events } = Matter;
let vasque_team_focus = "blue";

// Initialisation du moteur et du rendu
function initEngineAndRender() {
    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 600,
            height: 600,
            background: '#c2f4ff',
            wireframes: false,
        }
    });

    Render.run(render);
    Engine.run(engine);

    return { engine, world, render };
}

// Création de la vasque et des boules
function createVasqueAndBalls(world, render) {
    const centerX = 300;
    const centerY = 300;
    const vasqueRadius = 250;
    const ballRadius = 35;

    const numbers = [
        1, 3, 5, 7, 9, 11, 13, 15, 17,
        19, 21, 23, 25, 27, 29, 31, 33,
        -1, -1, -1
    ];

    const balls = [];

    // Placement aléatoire des boules dans la vasque
    numbers.forEach((num) => {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * (vasqueRadius - ballRadius);

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        let ball_color = "#FFD700";
        if (vasque_team_focus == "blue") { ball_color = "#0045c5"; }

        const ball = Bodies.circle(x, y, ballRadius, {
            restitution: 0.9,
            label: num.toString(),
            render: {
                fillStyle: num > 0 ? ball_color : '#000',
                strokeStyle: '#fff',
                lineWidth: 1,
                text: {
                    content: num > 0 ? num.toString() : '',
                    color: '#fff',
                    size: 20,
                }
            }
        });

        balls.push(ball);
        World.add(world, ball);
    });

    // Paroi circulaire invisible autour de la vasque
    const numSegments = 60;
    const wallRadius = vasqueRadius + ballRadius;

    for (let i = 0; i < numSegments; i++) {
        const angle = (i / numSegments) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * wallRadius;
        const y = centerY + Math.sin(angle) * wallRadius;

        const wall = Bodies.rectangle(x, y, 10, 40, {
            isStatic: true,
            angle: angle,
            render: { visible: false }
        });

        World.add(world, wall);
    }

    return { balls, centerX, centerY, vasqueRadius, ballRadius };
}

// Gestion des collisions et des limites de la vasque
function handleVasqueCollisions(engine, balls, centerX, centerY, vasqueRadius, ballRadius) {
    Events.on(engine, 'beforeUpdate', () => {
        balls.forEach(ball => {
            const dx = ball.position.x - centerX;
            const dy = ball.position.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist - 100 > vasqueRadius - ballRadius) {
                const angle = Math.atan2(dy, dx);
                const newX = centerX + Math.cos(angle) * (vasqueRadius - ballRadius);
                const newY = centerY + Math.sin(angle) * (vasqueRadius - ballRadius);

                Matter.Body.setPosition(ball, { x: newX, y: newY });
                Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                Matter.Body.setAngularVelocity(ball, 0);
            }
        });
    });
}

// Gestion des interactions avec la souris
function setupMouseInteraction(render, balls, ballRadius) {
    const mouse = Mouse.create(render.canvas);
    let startX, startY;

    render.canvas.addEventListener('mousedown', (e) => {
        startX = e.offsetX;
        startY = e.offsetY;
    });

    render.canvas.addEventListener('mouseup', (e) => {
        const endX = e.offsetX;
        const endY = e.offsetY;

        const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

        if (distance < 5) {
            const clickedBall = balls.find(ball => {
                const dx = ball.position.x - endX;
                const dy = ball.position.y - endY;
                return Math.sqrt(dx * dx + dy * dy) < ballRadius;
            });

            if (clickedBall && !clickedBall.selected) {
                clickedBall.selected = true;
                clickedBall.render.lineWidth = 10;
                console.log("Boule sélectionnée :", clickedBall.label);
                document.getElementById("info-panel").innerHTML =
                    "Boule sélectionnée : " + (clickedBall.label === "-1" ? "Boule noire" : clickedBall.label);
            }
        }
    });

    const mouseConstraint = MouseConstraint.create(render.engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    World.add(render.engine.world, mouseConstraint);
}

// Fonction pour appliquer une force externe
function appliquerForceExterne(balls, intensite) {
    balls.forEach(ball => {
        Matter.Body.applyForce(ball, ball.position, {
            x: (Math.random() - 0.5) * intensite,
            y: -intensite
        });
    });
}

// Fonction pour réinitialiser la vasque
function resetVasque(engine, world, render, balls) {
    // Suppression des boules existantes
    balls.forEach(ball => {
        World.remove(world, ball);
    });

    // Recréation des boules
    const { balls: newBalls } = createVasqueAndBalls(world, render);
    return newBalls;
}

// Initialisation
const { engine, world, render } = initEngineAndRender();
let { balls, centerX, centerY, vasqueRadius, ballRadius } = createVasqueAndBalls(world, render);
handleVasqueCollisions(engine, balls, centerX, centerY, vasqueRadius, ballRadius);
setupMouseInteraction(render, balls, ballRadius);
