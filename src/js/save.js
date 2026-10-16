// SAUVEGARDE DE LA PARTIE (reprise « entre deux mots »)
// La partie en cours est gardée dans le navigateur (localStorage, clé SAVE_KEY) : scores, équipe qui a la main,
// historique, mots à venir et grilles de numéros (boules tirées, purgatoire, boule magique).
// Le mot en cours n'est pas gardé : à la reprise, un nouveau mot démarre (tirages restants perdus aussi).
// Enregistrement automatique après chaque changement visible de la zone de jeu (#game_grid), et à la fermeture.
// Pas de sauvegarde dans la fenêtre publique. Menu : « Reprendre la partie » et « Nouvelle partie » (updateMenuPlayButtons).

const SAVE_KEY = "motus_partie";
const SAVE_FORMAT = 1;          // à incrémenter si le contenu change : une sauvegarde d'un autre format est ignorée
let game_save_timer = null;

function initGameSave() {
    if (IS_PUBLIC_VIEW) { return; }
    const observer = new MutationObserver(scheduleGameSave);
    observer.observe(document.getElementById("game_grid"), { subtree: true, childList: true, attributes: true, characterData: true });
    // Fermeture de l'onglet, mise en veille du téléphone : dernier enregistrement immédiat
    window.addEventListener("pagehide", saveGame);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") { saveGame(); }
    });
    updateMenuPlayButtons();
}

function scheduleGameSave() {
    clearTimeout(game_save_timer);
    game_save_timer = setTimeout(saveGame, 400);
}

// Mots à venir, sans le mot en cours (game.word_to_find_list[0] tant qu'il est joué)
function upcomingWords() {
    const list = (game.word_to_find_list || []).slice();
    if (game.word_to_find && list[0] === game.word_to_find) { list.shift(); }
    return list;
}

function buildGameSave() {
    const words = (game.history || []).filter(entry => entry.resultat !== "MOTUS");
    const save = {
        format: SAVE_FORMAT,
        version: game.version,
        date: new Date().toISOString(),
        score_yellow: game.score_yellow || 0,
        score_blue: game.score_blue || 0,
        team_focus: game.team_focus,
        history: game.history || [],
        word_list: upcomingWords(),
        words_played: words.length,
        number_grid: null
    };
    if (game.state && game.state.number_grid_complete === true) {
        save.number_grid = {
            index: game.number_grid_index,
            possible: game.number_grid_possible,
            purgatory: game.number_grid_purgatory,
            dynamic_mask: game.number_grid_dynamic_mask,
            saving_ball: game.number_grid_saving_ball,
            saving_ball_state: game.number_grid_saving_ball_state,
            motus_aligned: game.motus_aligned === true
        };
    }
    return save;
}

function saveGame() {
    clearTimeout(game_save_timer);
    if (IS_PUBLIC_VIEW || game.started !== true) { return; }
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(buildGameSave()));
    } catch (error) {
        console.warn("Partie non sauvegardée :", error);
    }
}

// Sauvegarde lisible et du bon format, sinon null (une sauvegarde d'un autre format est supprimée)
function readGameSave() {
    let save = null;
    try {
        save = JSON.parse(localStorage.getItem(SAVE_KEY));
    } catch (error) {
        save = null;
    }
    if (!save) { return null; }
    if (save.format !== SAVE_FORMAT || !Array.isArray(save.history) || !Array.isArray(save.word_list)) {
        console.warn("Sauvegarde de partie ignorée : format différent ou illisible.");
        clearGameSave();
        return null;
    }
    return save;
}

function clearGameSave() {
    clearTimeout(game_save_timer);
    try {
        localStorage.removeItem(SAVE_KEY);
    } catch (error) {
        console.warn("Impossible d'effacer la sauvegarde de partie :", error);
    }
}

// Résumé affiché sous « Reprendre la partie »
function gameSaveSummary(save) {
    const parts = [`${save.words_played} mot(s) joué(s)`];
    if (settings.team_enabled === true) {
        parts.push(`Jaune ${save.score_yellow} · Bleue ${save.score_blue}`);
    } else {
        parts.push(`${save.score_yellow} point(s)`);
    }
    const date = new Date(save.date);
    if (!isNaN(date)) {
        parts.push(date.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }));
    }
    return parts.join(" · ");
}

// MENU : « Reprendre la partie » si une partie est en cours ou sauvegardée, « Jouer » devient « Nouvelle partie »
function updateMenuPlayButtons() {
    const resume_button = document.getElementById("menu_button_resume");
    const play_button = document.getElementById("menu_button_play");
    if (!resume_button || !play_button) { return; }
    const save = game.started === true ? buildGameSave() : readGameSave();
    const can_resume = save !== null;
    resume_button.classList.toggle("d-none", !can_resume);
    play_button.classList.toggle("menu_play_button", !can_resume);
    disarmNewGameButton(play_button);
    if (can_resume) {
        document.getElementById("menu_resume_summary").textContent = gameSaveSummary(save);
        // Focus sur « Reprendre » plutôt que sur « Nouvelle partie » (bouton au focus automatique)
        if (document.activeElement === play_button || document.activeElement === document.body) { resume_button.focus(); }
    }
}

function disarmNewGameButton(button) {
    clearTimeout(button._disarmTimer);
    button.dataset.armed = "false";
    button.textContent = document.getElementById("menu_button_resume").classList.contains("d-none") ? "Jouer" : "Nouvelle partie";
}

// « Reprendre la partie » : partie déjà en mémoire (retour du menu), sinon sauvegarde du navigateur
function resumeGame() {
    if (game.started === true) {
        returnGame();
        return;
    }
    restoreSavedGame();
}

// « Jouer » / « Nouvelle partie » : en deux temps s'il y a une partie à effacer (second clic dans les 4 s)
function newGame(button) {
    const has_game = game.started === true || readGameSave() !== null;
    if (has_game && button.dataset.armed !== "true") {
        button.dataset.armed = "true";
        button.textContent = "Confirmer : effacer la partie en cours";
        button._disarmTimer = setTimeout(() => disarmNewGameButton(button), 4000);
        return;
    }
    disarmNewGameButton(button);
    clearGameSave();
    if (game.started === true) { resetGame(); }
    initGame();
}

// Reprise : même départ qu'initGame(), puis données sauvegardées, grilles de numéros redessinées
// sans animation et nouveau mot sur la grille de mots
async function restoreSavedGame() {
    const save = readGameSave();
    if (!save) {
        updateMenuPlayButtons();
        return;
    }

    // Dictionnaires de vérification des mots à venir (liste personnelle, émission) : chargés avant le premier mot
    const lengths = [...new Set(save.word_list.map(word => word.length))].filter(length => length >= 5 && length <= 10);
    try {
        await Promise.all(lengths.map(length => loadDictionaryAsync(length, "verification")));
    } catch (error) {
        console.warn("Dictionnaire introuvable pour un mot à venir :", error);
    }

    toggleAnimatorPanel(false);
    clearUndo();
    game.state = {
        letter_grid_created: false,
        number_grid_complete: false,
        number_grid_yellow_created: false,
        number_grid_blue_created: false
    };
    game.started = true;
    game.pause = false;
    game.history = save.history;
    game.word_to_find_list = save.word_list.slice();
    game.team_focus = save.team_focus === "blue" && settings.team_enabled === true ? "blue" : "yellow";

    setTeamScore("yellow", save.score_yellow);
    setTeamScore("blue", save.score_blue);
    updateScores();
    createKeyboard();

    if (settings.number_grid_enabled === true) {
        displayNumberGridUserAction("change_grid_button", false);
        displayNumberGridUserAction("return_letter_grid", false);
        displayNumberGridUserAction("pick_left_indicator", false);
        if (save.number_grid) {
            restoreNumberGrids(save.number_grid);
        } else {
            // Partie sauvegardée sans grille de numéros (réglage activé depuis) : grilles neuves, sans animation
            defaultNumberGridVariables();
            createNumberGridsHTML();
            fillNumberGrid("yellow", false);
            fillNumberGrid("blue", false);
            markNumberGridsCreated();
        }
    }

    announce("Partie reprise : nouveau mot.");
    initLetterGrid();
}
