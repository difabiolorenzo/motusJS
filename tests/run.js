// Vérifications hors navigateur, sans dépendance : node tests/run.js
// Code de sortie 1 si une vérification échoue.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const LENGTHS = [5, 6, 7, 8, 9, 10];
let failures = 0;
let checks = 0;

function check(condition, message) {
    checks++;
    if (!condition) {
        failures++;
        console.error("ÉCHEC : " + message);
    }
}

function same(actual, expected, message) {
    check(JSON.stringify(actual) === JSON.stringify(expected), `${message}\n    obtenu  : ${JSON.stringify(actual)}\n    attendu : ${JSON.stringify(expected)}`);
}

// Contexte minimal qui imite le navigateur pour charger les scripts du jeu
function createContext() {
    const noop = () => {};
    const storage = {};
    const context = {
        console: { log: noop, warn: noop, error: noop },
        localStorage: {
            getItem: key => (key in storage ? storage[key] : null),
            setItem: (key, value) => { storage[key] = String(value); },
            removeItem: key => { delete storage[key]; },
        },
        document: { querySelector: () => null, querySelectorAll: () => [], addEventListener: noop, getElementById: () => null },
        window: {},
        setTimeout: noop,
    };
    vm.createContext(context);
    return context;
}

function load(context, file) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), context, { filename: file });
}

// 1. Dictionnaires : format, longueur, majuscules sans accents, doublons
function loadDictionaries(type) {
    const context = createContext();
    vm.runInContext(`game = { dictionnaire_${type}: {} };`, context);
    const dictionaries = {};
    for (const length of LENGTHS) {
        const file = `src/js/dictionary/${type}/${length}_lettres.js`;
        load(context, file);
        const words = vm.runInContext(`game.dictionnaire_${type}.length_${length}`, context);
        check(Array.isArray(words) && words.length > 0, `${file} : doit assigner un tableau non vide à game.dictionnaire_${type}.length_${length}`);
        if (!Array.isArray(words)) { continue; }

        const bad_words = words.filter(word => typeof word !== "string" || word.length !== length || !/^[A-Z]+$/.test(word));
        check(bad_words.length === 0, `${file} : ${bad_words.length} mot(s) mal formé(s) (longueur ou caractères), ex. ${bad_words.slice(0, 5).join(", ")}`);

        const duplicates = words.filter((word, index) => words.indexOf(word) !== index);
        check(duplicates.length === 0, `${file} : ${duplicates.length} doublon(s), ex. ${[...new Set(duplicates)].slice(0, 5).join(", ")}`);

        dictionaries[length] = words;
    }
    return dictionaries;
}

const to_find = loadDictionaries("mot_a_trouver");
const verification = loadDictionaries("verification");

// 2. Chaque mot à trouver doit être accepté par la vérification
for (const length of LENGTHS) {
    if (!to_find[length] || !verification[length]) { continue; }
    const accepted = new Set(verification[length]);
    const missing = to_find[length].filter(word => !accepted.has(word));
    check(missing.length === 0, `mot_a_trouver/${length}_lettres.js : ${missing.length} mot(s) absent(s) de verification, ex. ${missing.slice(0, 10).join(", ")}`);
}

// 3. Coloration d'une proposition (computeLetterPlacement)
{
    const context = createContext();
    load(context, "src/js/letter_grid.js");
    const placement = (to_find_word, proposed) => vm.runInContext(`computeLetterPlacement(${JSON.stringify(to_find_word)}, ${JSON.stringify(proposed)})`, context);
    const C = "correct", W = "wrong", M = "missing";

    same(placement("TABLE", "TABLE"), [C, C, C, C, C], "mot trouvé : tout est bien placé");
    same(placement("TABLE", "TUILE"), [C, M, M, C, C], "lettres absentes");
    same(placement("TABLE", "TALBE"), [C, C, W, W, C], "lettres inversées : mal placées");
    same(placement("TABLE", "EEEEE"), [M, M, M, M, C], "une lettre bien placée n'est pas comptée une seconde fois comme mal placée");
    same(placement("ELEVE", "EEEEE"), [C, M, C, M, C], "lettre répétée : autant de couleurs que d'occurrences");
    same(placement("ELEVE", "EVEEL"), [C, W, C, W, W], "lettre répétée mal placée");
    same(placement("ARBRE", "AAAAA"), [C, M, M, M, M], "une seule occurrence disponible");
    same(placement("RADAR", "RRRRR"), [C, M, M, M, C], "occurrences toutes bien placées");
    same(placement("ROUTE", "RETTT"), [C, W, M, C, M], "la lettre bien placée est servie avant une mal placée plus tôt dans le mot");
    same(placement("TABLE", "TAB"), [C, C, C, M, M], "proposition trop courte : lettres manquantes absentes");
}

// 4. Détection du MOTUS (findMotusLine) : 0 = case remplie
{
    const context = createContext();
    load(context, "src/js/number_grid.js");
    const motus = mask => vm.runInContext(`findMotusLine(${JSON.stringify(mask)})`, context);
    const full = () => Array(25).fill(1);
    const with_zeros = indexes => { const mask = full(); indexes.forEach(i => { mask[i] = 0; }); return mask; };

    same(motus(full()), null, "grille vide : pas de MOTUS");
    same(motus(with_zeros([0, 1, 2, 3])), null, "ligne incomplète : pas de MOTUS");
    same(motus(with_zeros([10, 11, 12, 13, 14])), { position: "horizontal", offset: 2 }, "ligne horizontale");
    same(motus(with_zeros([3, 8, 13, 18, 23])), { position: "vertical", offset: 3 }, "colonne");
    same(motus(with_zeros([0, 6, 12, 18, 24])), { position: "slash" }, "diagonale haut-gauche / bas-droite");
    same(motus(with_zeros([4, 8, 12, 16, 20])), { position: "backslash" }, "diagonale bas-gauche / haut-droite");
}

// 5. Grilles numérotées de départ : 25 cases, numéros visibles uniques, pas de MOTUS déjà aligné
{
    const context = createContext();
    load(context, "src/js/game.js");
    load(context, "src/js/number_grid.js");
    vm.runInContext("setDefaultVariables();", context);
    const data = vm.runInContext("game.number_grid_data", context);
    for (const index of Object.keys(data.mask)) {
        const mask = data.mask[index];
        check(mask.length === 25 && mask.every(v => v === 0 || v === 1), `masque ${index} : 25 cases à 0 ou 1`);
        same(vm.runInContext(`findMotusLine(${JSON.stringify(mask)})`, context), null, `masque ${index} : aucun MOTUS au départ`);
        for (const team of ["yellow", "blue"]) {
            const grid = data[team][index];
            check(Array.isArray(grid) && grid.length === 25, `grille ${team} ${index} : 25 numéros`);
            const visible = grid.filter((num, i) => mask[i] === 1);
            check(new Set(visible).size === visible.length, `grille ${team} ${index} : numéros à tirer en double`);
        }
    }
}

// 6. Grilles télé : mots jouables (5 à 10 lettres, présents dans la vérification)
{
    const context = createContext();
    load(context, "src/data/grille_tele.js");
    const emissions = vm.runInContext("GRILLES_TELE.grille_tv", context);
    for (const emission of emissions) {
        for (const raw of emission.mots) {
            const word = raw.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
            const playable = word.length >= 5 && word.length <= 10 && verification[word.length] && verification[word.length].includes(word);
            // Non bloquant : le jeu ignore ces mots au lancement
            if (!playable) { console.log(`Avertissement : émission du ${emission.date}, mot ignoré en jeu : ${word}`); }
        }
    }
}

// 7. Vasque : synchronisation des boules présentes avec la liste du jeu (Vasque.diff, sans Matter.js)
{
    const context = createContext();
    load(context, "src/js/vasque.js");
    const diff = (current, target) => vm.runInContext(`Vasque.diff(${JSON.stringify(current)}, ${JSON.stringify(target)})`, context);
    const B = "⚫";

    same(diff([], [3, 5, B, B]), { add: [3, 5, B, B], remove: [] }, "vasque vide : toutes les boules ajoutées, dans l'ordre du jeu");
    same(diff([3, 5, B, B], [3, 5, B, B]), { add: [], remove: [] }, "même liste : rien ne change (synchronisation idempotente)");
    same(diff([3, 5, 17, B], [3, 5, B]), { add: [], remove: [2] }, "boule tirée : retirée de la vasque");
    same(diff([3, B, 5, B, B], [3, 5, B, B]), { add: [], remove: [4] }, "boule noire tirée : un seul exemplaire retiré");
    same(diff([3, 5, B], [8, 13, B, B]), { add: [8, 13, B], remove: [0, 1] }, "nouvelle grille : anciennes boules retirées, nouvelles ajoutées");
    same(diff([3, 5], []), { add: [], remove: [0, 1] }, "liste vide : vasque vidée");
    same(diff(["5"], [5]), { add: [], remove: [] }, "numéro en texte ou en nombre : même boule");

    // Boules posées au fond (animations réduites, fenêtre publique) : toutes dans la vasque, sans chevauchement
    const world = vm.runInContext("Vasque.worldSize", context);
    for (const count of [1, 20, 25]) {
        const positions = vm.runInContext(`Vasque.staticPositions(${count})`, context);
        check(positions.length === count, `boules posées au fond : ${count} position(s)`);
        check(positions.every(p => Math.hypot(p.x - world / 2, p.y - world / 2) <= 280 - 40 + 1), `boules posées au fond (${count}) : toutes dans la vasque`);
        check(positions.every((p, i) => positions.every((q, j) => i === j || Math.hypot(p.x - q.x, p.y - q.y) >= 80)), `boules posées au fond (${count}) : aucun chevauchement`);
    }
}

// 8. Dictionnaires en cache (readCachedDictionary) : seule une liste non vide de la version en cours est reprise
{
    const context = createContext();
    load(context, "src/js/game.js");
    const version = vm.runInContext("DICTIONARY_VERSION", context);
    const read = stored => {
        context.localStorage.setItem("cle_test", stored);
        return vm.runInContext(`readCachedDictionary("cle_test")`, context);
    };

    same(read(JSON.stringify({ version: version, mots: ["TABLE", "CHAISE"] })), ["TABLE", "CHAISE"], "cache valide : mots repris");
    same(read(JSON.stringify({ version: version, mots: [] })), null, "cache vide : rechargement du dictionnaire");
    check(context.localStorage.getItem("cle_test") === null, "cache vide : supprimé du stockage local");
    same(read(JSON.stringify({ version: version + 1, mots: ["TABLE"] })), null, "autre version : rechargement du dictionnaire");
    same(read(JSON.stringify(["TABLE"])), null, "ancien format (tableau seul) : rechargement du dictionnaire");
    same(read("{illisible"), null, "cache illisible : rechargement du dictionnaire");
}

// 9. Réglages enregistrés (loadSettingsByLocalStorage) : une sauvegarde illisible ne bloque pas le démarrage
{
    const context = createContext();
    load(context, "src/js/game.js");
    const load_settings = stored => {
        context.localStorage.setItem("settings", stored);
        vm.runInContext("setDefaultVariables(); loadSettingsByLocalStorage();", context);
        return vm.runInContext("settings", context);
    };

    let threw = false;
    try { load_settings("{illisible"); } catch (error) { threw = true; }
    check(!threw, "réglages illisibles : pas d'erreur au démarrage");
    same(load_settings("{illisible").score_addition, 50, "réglages illisibles : valeurs par défaut");
    same(load_settings(JSON.stringify(["x"])).score_addition, 50, "réglages qui ne sont pas un objet : valeurs par défaut");
    same(load_settings(JSON.stringify({ score_addition: "100" })).score_addition, 100, "réglage numérique enregistré en texte : remis en nombre");
}

console.log(`${checks - failures}/${checks} vérifications réussies.`);
process.exit(failures === 0 ? 0 : 1);
