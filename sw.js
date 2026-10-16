// Service worker de MotusJS : jeu hors ligne.
// Stratégie « réseau d'abord » : en ligne, toujours la dernière version (pas de cache périmé après une mise à jour) ;
// hors ligne, la copie mise en cache. Tous les fichiers du jeu sont mis en cache dès la première visite.
// Incrémenter CACHE_VERSION avec game.version (game.js) pour purger les anciennes copies.
const CACHE_VERSION = "2.6.1";
const CACHE_NAME = `motusjs-${CACHE_VERSION}`;

const PRECACHE_FILES = [
    "./",
    "index.html",
    "manifest.webmanifest",
    "src/css/base.css",
    "src/css/ui.css",
    "src/css/pages.css",
    "src/css/game.css",
    "src/css/grid.css",
    "src/js/game.js",
    "src/js/letter_grid.js",
    "src/js/number_grid.js",
    "src/js/aide.js",
    "src/js/keyinput.js",
    "src/js/animator.js",
    "src/js/lib/matter.min.js",
    "src/js/vasque.js",
    "src/js/save.js",
    "src/data/grille_tele.js",
    "src/js/dictionary/mot_a_trouver/5_lettres.js",
    "src/js/dictionary/mot_a_trouver/6_lettres.js",
    "src/js/dictionary/mot_a_trouver/7_lettres.js",
    "src/js/dictionary/mot_a_trouver/8_lettres.js",
    "src/js/dictionary/mot_a_trouver/9_lettres.js",
    "src/js/dictionary/mot_a_trouver/10_lettres.js",
    "src/js/dictionary/verification/5_lettres.js",
    "src/js/dictionary/verification/6_lettres.js",
    "src/js/dictionary/verification/7_lettres.js",
    "src/js/dictionary/verification/8_lettres.js",
    "src/js/dictionary/verification/9_lettres.js",
    "src/js/dictionary/verification/10_lettres.js",
    "src/sounds/boule_magique.mp3",
    "src/sounds/erreur.mp3",
    "src/sounds/grille_boule_noire.mp3",
    "src/sounds/grille_creation.mp3",
    "src/sounds/grille_numero.mp3",
    "src/sounds/grille_numero_tire.mp3",
    "src/sounds/jingle_motus.mp3",
    "src/sounds/lettre_absente.mp3",
    "src/sounds/lettre_bonus.mp3",
    "src/sounds/lettre_mauvaise.mp3",
    "src/sounds/lettre_ok.mp3",
    "src/sounds/motus.mp3",
    "src/sounds/perdu.mp3",
    "src/sounds/temps_ecoule.mp3",
    "src/sounds/victoire.mp3",
    "src/img/dice_20.svg",
    "src/img/dots.svg",
    "src/img/favicon.png",
    "src/img/grid.svg",
    "src/img/letter_grid.svg",
    "src/img/left_arrow.svg",
    "src/img/logo.png",
    "src/img/number_ball.svg",
    "src/img/refresh.svg",
    "src/img/settings.png",
    "src/img/sparkles.svg",
    "src/img/stats.svg",
    "src/img/time-past.svg",
    "src/textures/grille/style_1990.png",
    "src/textures/grille/style_2000.png",
    "src/textures/grille/style_2010.png",
    "src/textures/grille/style_2019.png",
    "src/textures/logo/motus_logo_1990.png",
    "src/textures/logo/motus_logo_2000.png",
    "src/textures/logo/motus_logo_2004.png",
    "src/textures/logo/motus_logo_2004_2.png",
    "src/textures/logo/motus_logo_2004_fond.png",
    "src/textures/logo/motus_logo_2010.png",
    "src/font/Gotham Bold.otf",
    "src/font/Gotham Medium.ttf"
];

self.addEventListener("install", (event) => {
    // Un fichier manquant (ex. non publié) ne bloque pas l'installation
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => Promise.allSettled(PRECACHE_FILES.map((file) => cache.add(file))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((key) => key.startsWith("motusjs-") && key != CACHE_NAME).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method != "GET" || new URL(request.url).origin != self.location.origin) { return; }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Copie fraîche gardée pour le hors-ligne
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return response;
            })
            .catch(() => caches.match(request, { ignoreSearch: true })
                .then((cached) => cached || (request.mode == "navigate" ? caches.match("index.html") : undefined))
                .then((cached) => cached || Response.error()))
    );
});
