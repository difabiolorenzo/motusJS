

function initVariables() {
    setDefaultVariables();
    loadSettingsByLocalStorage();
    setHTMLFromSettings()
    document.getElementById("checkbox_debug_logs").checked = game.debug;
    document.getElementById("version").innerHTML = "MotusJS " + game.version;
    preloadSounds();
    registerServiceWorker();
}

function setDefaultVariables() {
    game = {
        version: "2.6",
        displayed_grid_type: "letter_grid", // "number_grid"
        displayed_page: "main_menu",
        
        focus_on: undefined, // "letter" / "number"

        started: false,
        pause: false,
        debug: isDebugEnabled(),
        history: [],        // historique de la partie (voir recordWordResult)
        
        word_to_find_list: [],
        dictionnaire_mot_a_trouver: {
            length_5: [],
            length_6: [],
            length_7: [],
            length_8: [],
            length_9: [],
            length_10: []
        },
        dictionnaire_verification: {
            length_5: [],
            length_6: [],
            length_7: [],
            length_8: [],
            length_9: [],
            length_10: []
        },

        word_displayed: false,
        word_found: false,
        try_number_max: 6,

        number_grid_data: {
            yellow: {
                1: [
                    7, 17, 35, 49, 57,
                    11, 25, 29, 51, 59,
                    3, 19, 41, 43, 69,
                    5, 21, 33, 53, 63,
                    9, 23, 37, 45, 61
                ],
                2: [
                    1, 17, 39, 51, 59,
                    5, 21, 41, 53, 67,
                    11, 27, 29, 47, 69,
                    7, 15, 37, 43, 63,
                    13, 25, 33, 55, 61
                ],
                3: [
                    7, 27, 35, 51, 61,
                    1, 25, 37, 45, 69,
                    5, 17, 29, 55, 57,
                    11, 19, 41, 43, 63,
                    3, 15, 39, 49, 59
                ],
                4: [
                    1, 19, 41, 53, 67,
                    5, 25, 37, 55, 61,
                    13, 27, 29, 45, 63,
                    9, 15, 35, 51, 59,
                    11, 21, 31, 49, 69
                ],
                5: [
                    5, 27, 37, 55, 67,
                    1, 15, 41, 49, 69,
                    9, 21, 33, 43, 59,
                    13, 23, 29, 47, 65,
                    7, 19, 35, 51, 63
                ],
                6: [
                    1, 27, 41, 47, 69,
                    5, 21, 33, 51, 59,
                    11, 17, 29, 55, 57,
                    9, 15, 35, 45, 65,
                    13, 23, 31, 43, 63
                ]
            },
            blue: {
                1: [
                    12, 26, 40, 52, 60,
                    10, 22, 30, 46, 58,
                    8, 18, 32, 44, 70,
                    6, 16, 38, 54, 62,
                    2, 20, 36, 56, 66
                ],
                2: [
                    8, 26, 40, 50, 64,
                    2, 20, 32, 44, 66,
                    12, 18, 34, 56, 68,
                    14, 24, 30, 48, 60,
                    6, 28, 38, 54, 62
                ],
                3: [
                    14, 18, 32, 56, 58,
                    10, 16, 38, 46, 66,
                    2, 22, 36, 52, 62,
                    8, 26, 30, 54, 68,
                    6, 28, 40, 44, 70
                ],
                4: [
                    4, 24, 42, 56, 62,
                    8, 16, 40, 46, 64,
                    12, 18, 34, 44, 60,
                    10, 28, 32, 52, 70,
                    6, 26, 36, 50, 68
                ],
                5: [
                    14, 26, 40, 50, 60,
                    2, 20, 34, 44, 58,
                    10, 16, 30, 52, 70,
                    8, 18, 32, 54, 64,
                    6, 24, 38, 46, 66
                ],
                6: [
                    12, 28, 40, 54, 58,
                    2, 22, 34, 44, 62,
                    8, 16, 32, 50, 70,
                    6, 26, 30, 48, 64,
                    10, 20, 36, 46, 60
                ]
            },
            mask: {
                1: [
                    0, 1, 1, 0, 1,
                    1, 1, 0, 1, 0,
                    1, 0, 1, 1, 1,
                    1, 1, 0, 1, 0,
                    0, 1, 1, 1, 1
                ],
                2: [
                    1, 1, 1, 1, 0,
                    0, 1, 0, 1, 1,
                    1, 1, 1, 0, 1,
                    0, 0, 1, 1, 1,
                    1, 0, 1, 1, 0
                ],
                3: [
                    1, 0, 1, 1, 1,
                    1, 1, 0, 0, 1,
                    0, 1, 1, 1, 1,
                    1, 1, 0, 1, 0,
                    1, 0, 1, 1, 0
                ],
                4: [
                    1, 1, 1, 0, 0,
                    1, 0, 1, 1, 1,
                    0, 1, 1, 0, 1,
                    0, 1, 1, 1, 1,
                    1, 1, 0, 1, 0
                ],
                5: [
                    0, 1, 0, 1, 1,
                    1, 1, 1, 0, 1,
                    1, 0, 1, 1, 0,
                    1, 1, 0, 1, 1,
                    0, 1, 1, 0, 1
                ],
                6: [
                    1, 1, 0, 1, 1,
                    0, 1, 1, 0, 1,
                    0, 1, 1, 1, 0,
                    1, 0, 0, 1, 1,
                    1, 1, 1, 0, 1
                ]
            }
        },
        number_grid_possible: {
            yellow: [],
            blue: []
        },
        number_grid_index: 0,
        motus_aligned: false,

        score_yellow: 0,
        score_blue: 0,
        team_focus: "yellow", // ("yellow" || "blue")
        conditional_submit_confirmed: false,

    };
    settings = {
        verification_time_multiplier: 1,
        style: "2010",
        high_contrast: false,

        automatic_behaviour: true,
        automatic_behaviour_new_line_error: "add_bonus", //"replace_bonus" "replace_only" "add_bonus" "add_only" "none"
        automatic_behaviour_new_line_team_error: "replace_bonus",
        automatic_behaviour_redirect_number_grid: true,
        automatic_behaviour_redirect_letter_grid: false,
        automatic_behaviour_ask_new_word: true,

        display_soluce_on_last_row: false,
        reinit_line_if_unvalid_word: true,

        display_typing_indicator: false,
        keyboard_show_cursor: false,
        keyboard_start_typing_in_void: false,

        check_word_presence: true,
        check_word_duplication: true,
        check_word_length: true,
        check_word_first_letter: true,

        confirm_submit: false,       // Entrée met en attente, 1 / & confirme, Effacer annule.

        helping_letter_amount: 1,
        always_ask: false,
        always_ask_length: 8,

        number_grid_enabled: true,
        try_picking_ball: 2,
        use_saving_ball: true,
        limiting_saving_ball: true,
        black_ball_amount: 3,
        ball_picking_mode: "random",
        start_by_number_grid: false,
        number_grid_specific_display_blue_team: false,
        number_grid_creation_animation: false,      // seulement si la partie commence par la grille numérotée

        team_enabled: false,
        score_addition: 50,         // points par mot trouvé
        score_motus: 100,           // points par MOTUS
        change_turn_mode: "by_error", // ("by_error" || "by_proposition")
        playsound_enabled: true,
        play_extra_sounds: false,

        help_page_length: 8,
        show_tv_replay: false,

        timer_enabled: false,       // compte à rebours par proposition (expérimental)
        timer_duration: 10,         // secondes
        timer_behaviour: "sound"    // à zéro, après le son : "sound" (rien de plus) | "error" (proposition refusée)
    };
}

function initGame() {
    // Pas d'initialisation du mot si la partie est commencée
    if (game.started == true) {
        returnGame();
        return;
    }

    game.state = {
        letter_grid_created: false,
        number_grid_complete: false,
        number_grid_yellow_created: false,
        number_grid_blue_created: false
    }
    
    game.started = true;
    game.pause = false;

    // Initialisation des scores
    setTeamScore("yellow", 0);
    setTeamScore("blue", 0);
    updateScores();

    // Creation du clavier    
    createKeyboard();


    // Creation initiale selon le parametre
    if (settings.number_grid_enabled == true) {
		displayNumberGridUserAction("change_grid_button", false)
		displayNumberGridUserAction("return_letter_grid", false)
		displayNumberGridUserAction("create_yellow_grid_button", false)
		displayNumberGridUserAction("create_blue_grid_button", false)
		displayNumberGridUserAction("pick_left_indicator", false)

        initNumberGrid();
    } else {
        initLetterGrid();
    }
}

function resetGame() {
    setDefaultVariables();
	resetNumberGrids();
    loadSettingsByLocalStorage();
    setHTMLFromSettings();

	updateScores();

	document.getElementById("letter_grid_placeolder").innerHTML = "";
	// Vider le conteneur interne : #keyboard_placeholder doit rester pour createKeyboard()
	document.getElementById("keyboard_placeholder").innerHTML = "";
	document.getElementById("word_list").innerHTML = "";
	displayPage("main_menu")
}

function displayLetterGrid() {
    if (game.state.letter_grid_created == false) {
        initLetterGrid();
    }

    game.focus_on = "letter";

    // Masquer la grille de numéro
    document.getElementById("letter_grid_section").classList.remove("d-none")

    document.getElementById("keyboard").classList.remove("hided");

    // Masquer la grille de numéro
    document.getElementById("number_grids").classList.add("d-none")

    // Affichage des options dans la barre haute
    document.getElementById("topbar_button_bonus_letter").classList.remove("d-none");
    document.getElementById("topbar_button_display_solution").classList.remove("d-none");
    document.getElementById("topbar_button_word_reinit").classList.remove("d-none");
    document.getElementById("topbar_button_display_number_grid").classList.remove("d-none");
    document.getElementById("topbar_button_display_letter_grid").classList.add("d-none");
    
    // Renouvellement du mot si le mot était trouvé
    if (settings.number_grid_enabled == true) {
        if (game.word_found == true) {
            wordReinit();
        }
    }
    
    displayPage("game_page");
}

function displayNumberGrid() {
    if (settings.number_grid_enabled == false) { 
        displayLetterGrid()
        return;
    }
    stopProposalTimer();

    if (game.motus_aligned == true) {
        changeNumberGrid();
    }

    game.focus_on = "number";

    // Masquer la grille de mot
    document.getElementById("letter_grid_section").classList.add("d-none")

    document.getElementById("keyboard").classList.add("hided");

    // Afficher la grille de numéro
    document.getElementById("number_grids").classList.remove("d-none")

    // Affichage des options dans la barre haute
    document.getElementById("topbar_button_bonus_letter").classList.add("d-none");
    document.getElementById("topbar_button_display_solution").classList.add("d-none");
    document.getElementById("topbar_button_word_reinit").classList.add("d-none");
    document.getElementById("topbar_button_display_number_grid").classList.add("d-none");
    
    document.getElementById("topbar_button_display_letter_grid").classList.remove("d-none");
	game.number_grid_try_left = settings.try_picking_ball;

    // Affichage du mode de séléction des boules si les grilles sont créées
    if (game.state.number_grid_complete == true) {
        UpdateNumberSelectMode();
    }

    displayPage("game_page");
}

function resetSettings() {
    // Réglages seulement : la partie en cours (game) est conservée
    setDefaultVariablesSettingsOnly()
    setHTMLFromSettings()
    saveSettingsIntoLocalStorage()
}

function loadSettingsByLocalStorage() {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings != null) {
        console.log("Paramètres trouvés dans le stockage local");
        const parsedSettings = JSON.parse(savedSettings);

        // Fusionne les paramètres
        settings = { ...settings, ...parsedSettings };
        normalizeSettingTypes();
    }
}

// Remet en nombre les réglages numériques enregistrés en texte par d'anciennes versions
// (un réglage est numérique si sa valeur par défaut l'est)
function normalizeSettingTypes() {
    const current_settings = settings;
    setDefaultVariablesSettingsOnly();
    const defaults = settings;
    settings = current_settings;

    for (const key in defaults) {
        if (typeof defaults[key] == "number" && typeof settings[key] == "string" && settings[key].trim() != "" && !isNaN(Number(settings[key]))) {
            settings[key] = Number(settings[key]);
        }
    }
}

// Valeurs par défaut de settings sans toucher à game
function setDefaultVariablesSettingsOnly() {
    const current_game = game;
    setDefaultVariables();
    game = current_game;
}

function saveSettingsIntoLocalStorage() {
    debugLog("Sauvegarde des paramètres dans le stockage local")
    const string_settings = JSON.stringify(settings);
    localStorage.removeItem("settings");
    localStorage.setItem("settings", string_settings);

    debugLog(string_settings)
}

function exportSettings() {
    const exportName = "motusJS_settings";
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Lit un fichier JSON produit par exportSettings() : seules les clés connues de settings sont reprises
function importSettings(file) {
    if (!file) { return; }

    const reader = new FileReader();
    reader.onload = () => {
        let imported = null;
        try {
            imported = JSON.parse(reader.result);
        } catch (error) {
            imported = null;
        }
        if (imported == null || typeof imported != "object" || Array.isArray(imported)) {
            console.error("Fichier de paramètres invalide :", file.name);
            alert("Fichier de paramètres invalide.");
            return;
        }

        let imported_count = 0;
        for (const key in imported) {
            if (Object.prototype.hasOwnProperty.call(settings, key)) {
                settings[key] = imported[key];
                imported_count++;
            } else {
                console.warn(`Paramètre inconnu ignoré : ${key}`);
            }
        }

        normalizeSettingTypes();
        setHTMLFromSettings();
        saveSettingsIntoLocalStorage();
        console.log(`${imported_count} paramètres importés depuis ${file.name}`);
    };
    reader.onerror = () => {
        console.error("Lecture du fichier de paramètres impossible :", file.name);
    };
    reader.readAsText(file);
}

function setHTMLFromSettings() {
    document.getElementById("verification_speed_select").value = settings.verification_time_multiplier;
    document.getElementById("grid_style").value = settings.style;
    changeStyle(settings.style);
    document.getElementById("checkbox_high_contrast").checked = settings.high_contrast;
    document.getElementById("help_length_select").value = settings.help_page_length;
    document.getElementById("checkbox_show_tv_replay").checked = settings.show_tv_replay;
    document.getElementById("checkbox_timer_enabled").checked = settings.timer_enabled;
    document.getElementById("input_timer_duration").value = settings.timer_duration;
    if (settings.timer_behaviour != "error") { settings.timer_behaviour = "sound"; }    // ancienne valeur "none"
    document.getElementById("select_timer_behaviour").value = settings.timer_behaviour;
    updateTimerSettings(settings.timer_enabled);
    updateTvReplaySettings(settings.show_tv_replay);
    updateHighContrastSettings(settings.high_contrast);

    updateTypingIndicatorSettings(settings.display_typing_indicator);
    document.getElementById("checkbox_display_cursor").checked = settings.keyboard_show_cursor;
    document.getElementById("checkbox_start_typing_in_void").checked = settings.keyboard_start_typing_in_void;
    
    document.getElementById("check_automatic_behaviour").checked = settings.automatic_behaviour;
    document.getElementById("check_automatic_behaviour_new_line_error").value = settings.automatic_behaviour_new_line_error;
    document.getElementById("check_automatic_behaviour_new_line_team_error").value = settings.automatic_behaviour_new_line_team_error;
    document.getElementById("check_automatic_behaviour_redirect_number_grid").checked = settings.automatic_behaviour_redirect_number_grid;
    document.getElementById("check_automatic_behaviour_redirect_letter_grid").checked = settings.automatic_behaviour_redirect_letter_grid;
    document.getElementById("check_automatic_behaviour_new_word").checked = settings.automatic_behaviour_ask_new_word;
    document.getElementById("check_keyboard_show_cursor").checked = settings.keyboard_show_cursor;
    document.getElementById("check_keyboard_start_typing_in_void").checked = settings.keyboard_start_typing_in_void;

    document.getElementById("checkbox_check_word_presence").checked = settings.check_word_presence;
    document.getElementById("checkbox_check_word_duplication").checked = settings.check_word_duplication;
    document.getElementById("checkbox_check_word_length").checked = settings.check_word_length;
    document.getElementById("checkbox_check_first_letter").checked = settings.check_word_first_letter;

    document.getElementById("select_helping_letter_amount").value = settings.helping_letter_amount;
    
    document.getElementById("checkbox_always_ask_word_length").checked = settings.always_ask;
    updateAlwaysAskSettings(settings.always_ask);
    document.getElementById("select_always_ask_length").value = settings.always_ask_length;

    document.getElementById("checkbox_number_grid_enabled").checked = settings.number_grid_enabled;
    UpdateNumberGridSettings(settings.number_grid_enabled);

    updateTryPickingBall(settings.try_picking_ball);
    updateBlackBallAmount(settings.black_ball_amount);
    document.getElementById("checkbox_use_saving_ball").checked = settings.use_saving_ball;
    document.getElementById("checkbox_limiting_saving_ball").checked = settings.limiting_saving_ball;
    document.getElementById("checkbox_start_by_number_grid").checked = settings.start_by_number_grid;
    document.getElementById("select_ball_picking_mode").value = settings.ball_picking_mode;
    UpdateNumberSelectMode(settings.ball_picking_mode);
    document.getElementById("checkbox_number_grid_specific_display_blue_team").checked = settings.number_grid_specific_display_blue_team;
    document.getElementById("checkbox_number_grid_creation_animation").checked = settings.number_grid_creation_animation;
    document.getElementById("checkbox_reinit_line_if_unvalid_word").checked = settings.reinit_line_if_unvalid_word;
    document.getElementById("checkbox_display_soluce_on_last_row").checked = settings.display_soluce_on_last_row;
    document.getElementById("checkbox_confirm_submit").checked = settings.confirm_submit;

    updateTeamSettings(settings.team_enabled)
    document.getElementById("team_enabled_checkbox").checked = settings.team_enabled;
    document.getElementById("score_addition_select").value = settings.score_addition;
    document.getElementById("score_motus_input").value = settings.score_motus;
    updateMenuWordLength(settings.always_ask_length, false);
    document.getElementById("settings_section_team").value = settings.change_turn_mode;
    document.getElementById("checkbox_sound_activated").checked = settings.playsound_enabled;
}

function displayObjectInDOM(obj, elementId) {
    const el = document.getElementById(elementId);

    if (!el) {
        console.error("Élément DOM introuvable :", elementId);
        return;
    }

    el.textContent = JSON.stringify(obj, null, 4);
}

function displayLocalStorageInDOM() {
    const elementId = "stateViewerLocalStorage";
    const el = document.getElementById(elementId);

    if (!el) {
        console.error("Élément DOM introuvable :", elementId);
        return;
    }

    const storageObj = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
            const value = localStorage.getItem(key);
            // Tentative JSON
            storageObj[key] = JSON.parse(value);
        } catch (e) {
            // String simple
            storageObj[key] = localStorage.getItem(key);
        }
    }

    el.textContent = JSON.stringify(storageObj, null, 4);
}

function debug_random_sound_speed_change(value) {
    game.debug_random_sound_speed_change = value;
    document.getElementById("debug_ytp_speed_value").innerHTML = value
}

function updateAutomaticBehaviourSettings(value = settings.automatic_behaviour) {
    settings.automatic_behaviour = value;
    if (value == true) {
        document.getElementById("check_automatic_behaviour_new_line_error").disabled= false;
        document.getElementById("check_automatic_behaviour_new_line_team_error").disabled= false;
        document.getElementById("check_automatic_behaviour_redirect_number_grid").disabled= false;
        document.getElementById("check_automatic_behaviour_redirect_letter_grid").disabled= false;
        document.getElementById("check_automatic_behaviour_new_word").disabled= false;
    } else {
        document.getElementById("check_automatic_behaviour_new_line_error").disabled= true;
        document.getElementById("check_automatic_behaviour_new_line_team_error").disabled= true;
        document.getElementById("check_automatic_behaviour_redirect_number_grid").disabled= true;
        document.getElementById("check_automatic_behaviour_redirect_letter_grid").disabled= true;
        document.getElementById("check_automatic_behaviour_new_word").disabled= true;
    }
}

// Bouton « Rejouer une émission » du menu, masqué par défaut (paramètres expérimentaux)
function updateTvReplaySettings(value = settings.show_tv_replay) {
    settings.show_tv_replay = value;
    document.getElementById("menu_button_tv_replay").classList.toggle("d-none", value != true);
}

function updateHighContrastSettings(value = settings.high_contrast) {
    settings.high_contrast = value;
    document.body.classList.toggle("high_contrast", value == true);
}

// Longueur des mots tirés au hasard : rangée 5 à 10 du menu et liste des paramètres
function updateMenuWordLength(value = settings.always_ask_length, save = true) {
    settings.always_ask_length = Number(value);
    document.querySelectorAll("#menu_word_length button").forEach(button => {
        const selected = Number(button.dataset.length) == settings.always_ask_length;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-checked", selected ? "true" : "false");
        button.tabIndex = selected ? 0 : -1;
    });
    document.getElementById("select_always_ask_length").value = settings.always_ask_length;
    if (save) { saveSettingsIntoLocalStorage(); }
}

function updateAlwaysAskSettings(value = settings.always_ask) {
    settings.always_ask = value;
    // La rangée du menu ne sert pas si la longueur est demandée à chaque mot
    document.getElementById("menu_word_length").classList.toggle("d-none", value == true);
    if (value == false) {
        document.getElementById("select_always_ask_length").disabled = false;
    } else {
        document.getElementById("select_always_ask_length").disabled = true;
    }
}

function updateTeamSettings(value = settings.team_enabled) {
    settings.team_enabled = value;
    
    if (value == true) {
        document.getElementById("team_enabled_checkbox").checked = true;
        document.getElementById("settings_section_team").disabled = false;

        document.getElementById("score_yellow_panel").classList.remove("disabled")
        document.getElementById("score_blue_panel").classList.remove("disabled")
        document.getElementById("score_blue_panel").classList.remove("d-none")
    } else {
        document.getElementById("team_enabled_checkbox").checked = false;
        document.getElementById("settings_section_team").disabled = true;
        
        document.getElementById("score_yellow_panel").classList.remove("disabled")
        document.getElementById("score_blue_panel").classList.add("d-none")
    }
}

function UpdateNumberGridSettings(value = settings.number_grid_enabled) {
    settings.number_grid_enabled = value;
    if (value == true) {
        document.getElementById("checkbox_use_saving_ball").disabled = false;
        document.getElementById("input_black_ball_amount").disabled = false;
        document.getElementById("input_try_picking_ball").disabled = false;
        document.getElementById("select_ball_picking_mode").disabled = false;
        document.getElementById("checkbox_number_grid_specific_display_blue_team").disabled = false;
        document.getElementById("checkbox_start_by_number_grid").disabled = false;
        document.getElementById("checkbox_number_grid_creation_animation").disabled = false;
        
        if (settings.use_saving_ball == true) {
            document.getElementById("checkbox_limiting_saving_ball").disabled = false;
        }
    }
    if (value == false) {
        document.getElementById("checkbox_use_saving_ball").disabled = true;
        document.getElementById("input_black_ball_amount").disabled = true;
        document.getElementById("input_try_picking_ball").disabled = true;
        document.getElementById("select_ball_picking_mode").disabled = true;
        document.getElementById("checkbox_number_grid_specific_display_blue_team").disabled = true;
        document.getElementById("checkbox_start_by_number_grid").disabled = true;
        document.getElementById("checkbox_number_grid_creation_animation").disabled = true;

        document.getElementById("checkbox_limiting_saving_ball").disabled = true;
    }
}

function updateLengthSelectionMode(value = settings.length_selection) {
    settings.length_selection = value;

    switch (value) {
        case "always_ask_length":
            break;
        case "custom_length_collection":
            break;
        case "always_ask":
            break;
    }
}

function updateTryPickingBall(value = settings.try_picking_ball) {
    settings.try_picking_ball = Number(value);
    document.getElementById("input_try_picking_ball_indicator").innerHTML = value;    
}

function updateBlackBallAmount(value = settings.black_ball_amount) {
    settings.black_ball_amount = Number(value);
    document.getElementById("input_black_ball_amount_indicator").innerHTML = value;
}

function UpdateSavingBallSettings(value = settings.use_saving_ball) {
    settings.use_saving_ball = value;
    if (value == true) {
        document.getElementById("checkbox_limiting_saving_ball").disabled = false;
    }
    if (value == false) {
        document.getElementById("checkbox_limiting_saving_ball").disabled = true;
    }
}

function UpdateNumberSelectMode(value = settings.ball_picking_mode) {
    settings.ball_picking_mode = value;

    // Cache autres modes
    document.getElementById("number_grid_random_selection_mode_section").classList.add("d-none");
    document.getElementById("number_grid_select_selection_mode_section").classList.add("d-none");

    

    if (game.word_found == false) {
        console.log("Pas de boule a tiré, le mot n'est pas trouvé.")
        return;
    }

    if (game.motus_aligned == true) {
        console.log("MOTUS aligné, pas de tirage.")
        return;
    }

    // Affichage du mode de séléction des boules
    if (value == "input_select") {
        setManuelHTMLSelectInputBallPicking(game.team_focus)
        document.getElementById("number_grid_select_selection_mode_section").classList.remove("d-none");
    }
    if (value == "direct_click") {
        document.getElementById("number_grid_random_selection_mode_section").classList.remove("d-none");
        
        updateNumberLeftIndicator();

        displayNumberGridUserAction("random_selection_mode_section", true)
        displayNumberGridUserAction("black_selection_button", true)
        displayNumberGridUserAction("random_selection_button", false)
		displayNumberGridUserAction("pick_left_indicator", true)
    }
    if (value == "random") {
        document.getElementById("number_grid_random_selection_mode_section").classList.remove("d-none");
        
        updateNumberLeftIndicator();

        displayNumberGridUserAction("random_selection_mode_section", true)
        displayNumberGridUserAction("black_selection_button", false)
        displayNumberGridUserAction("random_selection_button", true)
		displayNumberGridUserAction("pick_left_indicator", true)
    }
}

function updateTypingIndicatorSettings(value = settings.display_typing_indicator) {
    settings.display_typing_indicator = value;
    const indicator = document.getElementById("word_typing_indicator");

    if (value == true) {
        indicator.classList.remove("d-none")
    } else {
        indicator.classList.add("d-none")
    }
}

function WordListAddRow(word_list_selected_word) {

    var word_list_selected_word = word_list_selected_word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
    var word_list_table = document.getElementById("word_list");

    var word_list_rowCount = word_list_table.rows.length;
    var word_list_row = word_list_table.insertRow(word_list_rowCount);

    word_list_row.insertCell(0).innerHTML = word_list_selected_word;
    word_list_row.insertCell(1).innerHTML = `<input type="button" class="button" value = "Information sur ce mot" onclick="SearchWordInformations('${word_list_selected_word}')">`;
    word_list_row.insertCell(2).innerHTML = '<input type="button" class="button" value = "Supprimer" onClick="Javascript:WordListDeleteRow(this)">';

    document.getElementById('word_list_selected_word').value = "";

    // Ajout du mot dans la liste de mot à trouver
    game.word_to_find_list.push(word_list_selected_word);

    // Chargement du dictionnaire de vérification de cette longueur (sinon toute proposition est refusée)
    const word_length = word_list_selected_word.length;
    if (word_length >= 5 && word_length <= 10) {
        loadDictionaryAsync(word_length, 'verification').catch(() => {});
    }
}

// function wordListAddRowRandom(word_length) {
//     // Vérifie si la longueur du mot est valide
//     if (word_length < 5 || word_length > 10) {
//         console.error("Seuls les mots entre 5 et 10 lettres sont gérés.");
//         return Promise.reject("Longueur de mot invalide.");
//     }

//     const dictionary_index = `length_${word_length}`;

//     // Si le dictionnaire est déjà chargé, on utilise une promesse résolue
//     if (game.dictionnaire_mot_a_trouver[dictionary_index] && game.dictionnaire_mot_a_trouver[dictionary_index].length > 0) {
//         const word_list_random_word_index = Math.floor(Math.random() * game.dictionnaire_mot_a_trouver[dictionary_index].length);
//         const word_list_random_word = game.dictionnaire_mot_a_trouver[dictionary_index][word_list_random_word_index];
//         WordListAddRow(word_list_random_word);
//         return Promise.resolve();
//     }
//     // Sinon, on charge le dictionnaire et on attend sa disponibilité
//     else {
//         return new Promise((resolve, reject) => {
//             loadDictionary(word_length, 'mot_a_trouver', () => {
//                 // Une fois le dictionnaire chargé, on essaie à nouveau
//                 if (game.dictionnaire_mot_a_trouver[dictionary_index] && game.dictionnaire_mot_a_trouver[dictionary_index].length > 0) {
//                     const word_list_random_word_index = Math.floor(Math.random() * game.dictionnaire_mot_a_trouver[dictionary_index].length);
//                     const word_list_random_word = game.dictionnaire_mot_a_trouver[dictionary_index][word_list_random_word_index];
//                     WordListAddRow(word_list_random_word);
//                     resolve();
//                 } else {
//                     console.error(`Le dictionnaire pour les mots de ${word_length} lettres n'est toujours pas disponible.`);
//                     reject("Dictionnaire non disponible.");
//                 }
//             });
//         });
//     }
// }

async function wordListAddRowRandom(word_length) {
    // Vérifie la validité
    if (word_length < 5 || word_length > 10) {
        console.error("Seuls les mots entre 5 et 10 lettres sont gérés.");
        throw new Error("Longueur de mot invalide.");
    }

    const dictionary_index = `length_${word_length}`;

    try {
        // Attendre les deux dictionnaires
        await Promise.all([
            loadDictionaryAsync(word_length, 'mot_a_trouver'),
            loadDictionaryAsync(word_length, 'verification')
        ]);

        // À partir d'ici, les deux dictionnaires sont garantis chargés

        const dict_mot = game.dictionnaire_mot_a_trouver[dictionary_index];
        const dict_verif = game.dictionnaire_verification[dictionary_index];

        if (!dict_mot || dict_mot.length === 0) {
            throw new Error("Dictionnaire mot_a_trouver vide ou absent");
        }

        if (!dict_verif || dict_verif.length === 0) {
            throw new Error("Dictionnaire verification vide ou absent");
        }

        // Sélection aléatoire d’un mot
        const random_index = Math.floor(Math.random() * dict_mot.length);
        const random_word = dict_mot[random_index];

        // Ajout à la grille
        WordListAddRow(random_word);

        debugLog(`Mot ajouté (${word_length} lettres) :`, random_word);

        return true;

    } catch (err) {
        console.error("Erreur wordListAddRowRandom :", err);
        return false;
    }
}

function WordAddCustom() {
    var wordInput = document.getElementById('word_list_selected_word').value
    const regex = /^[a-zA-Z\u00C0-\u00ff]+$/;

    if (wordInput.length >= 5 && wordInput.length <= 10 && regex.test(wordInput) == true) {
        WordListAddRow(wordInput)
    }
}

function WordListDeleteRow(word) {
    var word_list_index = word.parentNode.parentNode.rowIndex;
    var word_list_table = document.getElementById("word_list");
    word_list_table.deleteRow(word_list_index);

    // Suppresion du mot de la liste de mot à trouver (le tableau n'a pas de ligne d'en-tête)
    game.word_to_find_list.splice(word_list_index, 1);
}

function SearchWordInformations(word) {
    if (confirm("Voulez-vous ouvrir une page wiktionary.org sur le mot " + word.toLowerCase() + "?")) {
        window.open("https://fr.wiktionary.org/w/index.php?search=" + word.toLowerCase(), "_blank");
    }
}

// SON
// Fichier de chaque son joué par playsound()
const SOUND_FILES = {
    letter_ok: "src/sounds/lettre_ok.mp3",
    letter_bad: "src/sounds/lettre_mauvaise.mp3",
    letter_missing: "src/sounds/lettre_absente.mp3",
    error: "src/sounds/lettre_absente.mp3",
    letter_bonus: "src/sounds/lettre_bonus.mp3",
    wrong: "src/sounds/erreur.mp3",
    victory: "src/sounds/victoire.mp3",
    temps_ecoule: "src/sounds/temps_ecoule.mp3",
    loose: "src/sounds/perdu.mp3",
    grille_creation: "src/sounds/grille_creation.mp3",
    grille_numero: "src/sounds/grille_numero.mp3",
    grille_boule_noire: "src/sounds/grille_boule_noire.mp3",
    grille_numero_tire: "src/sounds/grille_numero_tire.mp3",
    motus: "src/sounds/motus.mp3",
    boule_magique: "src/sounds/boule_magique.mp3",
    jingle: "src/sounds/jingle_motus.mp3"
};

// Un objet Audio par fichier, créé une fois et réutilisé (pas de délai à la lecture)
const audio_cache = {};

function preloadSounds() {
    for (const src of new Set(Object.values(SOUND_FILES))) {
        if (!audio_cache[src]) {
            audio_cache[src] = new Audio(src);
            audio_cache[src].preload = "auto";
        }
    }
}

function playAudio(src) {
    if (!audio_cache[src]) {
        audio_cache[src] = new Audio(src);
    }
    // Si le son joue déjà (lettres rapprochées), une copie le joue en parallèle
    const base = audio_cache[src];
    const audio = base.paused || base.ended ? base : base.cloneNode();
    audio.currentTime = 0;
    audio.play().catch(error => console.warn(`Lecture du son impossible (${src}) :`, error));
}

function playsound(sound) {
    if (settings.playsound_enabled == true && SOUND_FILES[sound]) {
        playAudio(SOUND_FILES[sound]);
    }
}

function changeStyle(value) {
    settings.style = value;

    const styles = ["1990", "2000", "2004", "2010", "2019"];

    for (let i = 0; i < styles.length; i++) {
        if (styles[i] != value) {
            document.getElementById("main_menu").classList.remove("style_" + styles[i]);
            document.getElementById("game_page").classList.remove("style_" + styles[i]);
        }
    }
    
    document.getElementById("main_menu").classList.add("style_" + value);
    document.getElementById("game_page").classList.add("style_" + value);

    var logo_img = document.getElementById("logo");

    //Même logo pour 2010-2019
    if (value != "2019") {
        logo_img.src = `src/textures/logo/motus_logo_${value}.png`
    } else {  
        logo_img.src = `src/textures/logo/motus_logo_2010.png`
    }

    logo_img.title = `Style ${value}`;
    document.getElementById("preview_img").src = `src/textures/grille/style_${value}.png`;
}

function displayPage(page_name) {
    document.getElementById("main_menu").classList.add("d-none");
    document.getElementById("help_page").classList.add("d-none");
    // document.getElementById("settings_page").classList.add("d-none");
    document.getElementById("game_page").classList.add("d-none");
    document.getElementById("debug_page").classList.add("d-none");
    document.getElementById("credit_page").classList.add("d-none");
    document.getElementById("tv_page").classList.add("d-none");
    document.getElementById("history_page").classList.add("d-none");

    game.displayed_page = page_name;

    if (page_name != "game_page") {
        game.pause = true;
    } else {
        game.pause = false;
    }

    document.getElementById(page_name).classList.remove("d-none");
}

function createGrid(placeolder_id, row, column, cell_id_prefix, id) {
    var grid_placeolder = document.getElementById(placeolder_id);

	grid_placeolder_inner = "<table id='" + id + "' class='grid'>";
    for (var j = 0; j <= row-1; j++) {
		grid_placeolder_inner += "<tr id='" + cell_id_prefix + "_line_" + j + "'>";
		for (var i = 0; i < column; i++) {
			grid_placeolder_inner += "<td id=" + cell_id_prefix + "_" + j + "_" + i + " class=\"background\"></td>";
		}
		grid_placeolder_inner += "</tr>";
	}
	grid_placeolder.innerHTML = grid_placeolder_inner + "</table>";
}

function createHTMLGrid(row, column, cell_id_prefix, grid_id, hided = false) {
    let display_none = ""
    if (hided == true) { display_none = 'display: none;' }
    
    // Taille calculée en CSS (grid.css) selon la place disponible : --columns / --rows
    // minmax(0, 1fr) : les cases peuvent rétrécir sous la taille de leur lettre
    let element = `<div class="gridNEW" id="${grid_id}" style="
            grid-template-columns: repeat(${column}, minmax(0, 1fr));
            grid-template-rows: repeat(${row}, minmax(0, 1fr));
            aspect-ratio: ${column} / ${row};
            --columns: ${column};
            --rows: ${row};
            ${display_none}
        ">`;

    for (var j = 0; j < row; j++) {
        for (var i = 0; i < column; i++) {
			element += `<div id="${cell_id_prefix}_${j}_${i}" class="cellNEW"></div>`;
		}
	}
	element += "</div>";
    return element;
}

// Ajoute des points à l'équipe qui a la main (ou à team) ; par défaut les points d'un mot trouvé
function addTeamScore(team, points = settings.score_addition) {
    if (team === undefined) { team = game.team_focus; }
    if (team == "yellow") {
        game.score_yellow += points;
        document.getElementById("score_yellow_panel").innerHTML = game.score_yellow;
        setTeamScore("yellow", game.score_yellow)
    }
    if (team == "blue") {
        game.score_blue += points;
        document.getElementById("score_blue_panel").innerHTML = game.score_blue;
        setTeamScore("blue", game.score_blue)
    }
}

function setTeamScore(team, score) {
    // Affichage des "0" avant le score
    let score_text = ""
    if (score.toString().length == 1) {score_text = "00" + score;} else
    if (score.toString().length == 2) {score_text = "0" + score;} else
	{score_text = score;}

    if (team == "yellow") {
        document.getElementById("score_yellow_panel").innerHTML = score_text;
        game.score_yellow = score;
    }
    if (team == "blue") {
        document.getElementById("score_blue_panel").innerHTML = score_text;
        game.score_blue = score;
    }
}

function updateScores() {
    if (game.team_focus == "yellow") {
        document.getElementById("score_yellow_panel").classList.add("active");
        document.getElementById("score_blue_panel").classList.remove("active");

        document.getElementById("number_grid_yellow_placeolder").classList.add("active");
        document.getElementById("number_grid_blue_placeolder").classList.remove("active");
    }
    if (game.team_focus == "blue") {
        document.getElementById("score_yellow_panel").classList.remove("active");
        document.getElementById("score_blue_panel").classList.add("active");

        document.getElementById("number_grid_yellow_placeolder").classList.remove("active");
        document.getElementById("number_grid_blue_placeolder").classList.add("active");
    }

    setTeamScore("yellow", game.score_yellow);
    setTeamScore("blue", game.score_blue);
}

function switchTeamFocus() {
    if (settings.team_enabled == true) {
        if (game.team_focus == "yellow") {
            game.team_focus = "blue"
        } else {
            game.team_focus = "yellow"
        }
        console.log("L'équipe " + game.team_focus + " a maintenant la main.");

        updateScores()
    } else {
        console.log("La fonction équipe n'est pas activée.");
    }
}

function wordFoundInformation() {
    if (game.word_displayed == true || game.word_displayed == true) {
        wordInformation(game.word_to_find);
    } else {
        alert("Vous devez trouver le mot ou l'afficher pour pouvoir avoir des informations dessus.");
    }
}

function wordInformation(word_to_search) {
    if (confirm("Voulez-vous ouvrir une page wiktionary.org sur le mot " + word_to_search.toLowerCase() + "?")) {
        window.open("https://fr.wiktionary.org/w/index.php?search=" + word_to_search.toLowerCase(), "_blank");
    }
}

function wordErrorHandler(errorCode, catching_up) { // Affiche dans la console le terme de l'erreur
    const error_messages = {
        1: "Mot refusé : nombre de lettres incorrect.",
        2: "Mot refusé : absent du dictionnaire.",
        3: "Mot refusé : déjà proposé.",
        4: "Mot déjà affiché.",
        5: "Boule non valide.",
        6: "Temps écoulé : proposition refusée."
    };
    if (error_messages[errorCode]) {
        console.log(error_messages[errorCode]);
        announce(error_messages[errorCode]);
        showGameMessage(error_messages[errorCode]);
    }
    playsound("error");

    if (catching_up == true) {
        if (settings.team_enabled == true) { switchTeamFocus(); }
        setTimeout(function () {
            if (settings.reinit_line_if_unvalid_word == true) {
                reinitWordLine();
            }
            retryLine();
        }, 3000);
        playsound("wrong");
    }
}

function goLetterGrid() {
    if (game.word_displayed == true) { wordReinit(); }
    displayPage('game_page');
}

function timesUp() {
	playsound("temps_ecoule");
}

function DebugWordListDeleteRow(word) {
    var debug_word_list_index = word.parentNode.parentNode.rowIndex;
    var debug_word_list_table = document.getElementById("debug_word_list");
    debug_word_list_table.deleteRow(debug_word_list_index);
}

function returnMenu() {
    game.pause = true;
    displayPage("main_menu");
}

function returnGame() {
    game.pause = false;
    displayPage("game_page");
}

function switchGameGridFocusOn(forced_value, animation = true) {
    if (game.focus_on == "number" || forced_value == "letter" || settings.number_grid_enabled == false) {
        // Bascule vers grille de mot
        displayLetterGrid()
    } else if (game.focus_on == "letter" || forced_value == "number") {
        // Bascule vers grille de numéros        
        displayNumberGrid()
    }
}

// function animationGrid(grid_type, mode_direction, change) {
//     // grid_element_id == id de l'element
//     // mode_direction = in ou out
//     // change = add ou remove

//     let mode = undefined;

//     if (mode_direction == "in") { mode = "changing_grid_in"; }
//     if (mode_direction == "out") { mode = "changing_grid_out"; }

//     if (change == "add") {
//         if (grid_type == "letter") {
//             document.getElementById("letter_grid").classList.add(mode)
//             setTimeout(function() { document.getElementById("letter_grid").classList.remove(mode)}, 250)
//         }
//         if (grid_type == "number") {
//             document.getElementById("number_grid_yellow").classList.add(mode)
//             setTimeout(function() { document.getElementById("number_grid_yellow").classList.remove(mode)}, 250)
//             if (settings.team_enabled) { 
//                 document.getElementById("number_grid_blue").classList.add(mode)
//                 setTimeout(function() { document.getElementById("number_grid_blue").classList.remove(mode)}, 250)
//             }
//         }
//     }
//     if (change == "remove") {
//         if (grid_type == "letter") {
//             document.getElementById("letter_grid").classList.remove(mode);
//             setTimeout(function() { document.getElementById("letter_grid").classList.add(mode)}, 250)
//         }
//         if (grid_type == "number") {
//             document.getElementById("number_grid_yellow").classList.remove(mode)
//             setTimeout(function() { document.getElementById("number_grid_yellow").classList.add(mode)}, 250)
//             if (settings.team_enabled) {
//                 document.getElementById("number_grid_blue").classList.remove(mode)
//             setTimeout(function() { document.getElementById("number_grid_blue").classList.add(mode)}, 250)
//             }
//         }
//     }
// }

// Version des dictionnaires : à incrémenter à chaque modification de src/js/dictionary/mot_a_trouver/
// pour que les joueurs qui les ont en cache les rechargent
const DICTIONARY_VERSION = 1;

// Renvoie les mots en cache, ou null si absents, illisibles ou d'une autre version
function readCachedDictionary(storageKey) {
    let cached = null;
    try {
        cached = JSON.parse(localStorage.getItem(storageKey));
    } catch (error) {
        cached = null;
    }
    if (cached == null) { return null; }

    // Ancien format (tableau seul) ou autre version : cache invalidé
    if (Array.isArray(cached) || cached.version != DICTIONARY_VERSION || !Array.isArray(cached.mots)) {
        localStorage.removeItem(storageKey);
        console.log(`Cache ${storageKey} obsolète : rechargement du dictionnaire.`);
        return null;
    }
    return cached.mots;
}

function loadDictionaryAsync(word_length, type) {
    return new Promise((resolve, reject) => {
        loadDictionary(word_length, type, () => {
            resolve();
        }, (error) => {
            reject(error);
        });
    });
}

// callback : appelé une fois le dictionnaire chargé ; onError : appelé en cas d'échec (message déjà affiché)
function loadDictionary(word_length, type, callback = () => {}, onError = () => {}) {
    // type == mot_a_trouver ou verification
    word_length = Number(word_length);

    if (word_length < 5 || word_length > 10) {
        console.error("Seuls les mots entre 5 et 10 lettres sont gérés.");
        onError(new Error("Longueur de mot invalide."));
        return;
    }

    if (type == "mot_a_trouver" && game.dictionnaire_mot_a_trouver[`length_${word_length}`].length != 0) {
        debugLog(`Le dictionnaire des mots à trouver de ${word_length} est déjà chargé.`);
        callback();
        return;
    }
    if (type == "verification" && game.dictionnaire_verification[`length_${word_length}`].length != 0) {
        debugLog(`Le dictionnaire des mots proposables de ${word_length} est déjà chargé.`);
        callback();
        return;
    }

    const storageKey = `motus_${type}_${word_length}`;
    // Purge de l'ancien cache local des dictionnaires de vérification (plus mis en cache)
    if (type == "verification") { localStorage.removeItem(storageKey); }
    const dictionary = readCachedDictionary(storageKey);
    if (dictionary != null) {
        if (type == "mot_a_trouver") {
            game.dictionnaire_mot_a_trouver[`length_${word_length}`] = dictionary;

            // Mise à jour des boutons de debug
            document.getElementById(`debug_button_add_dictionary_${word_length}`).disabled = true;
            document.getElementById(`debug_button_drop_dictionary_${word_length}`).disabled = false;
        debugLog(`Le dictionnaire des mots à trouver de ${word_length} lettres est chargé depuis le stockage local.`);
        }
        if (type == "verification") {
            game.dictionnaire_verification[`length_${word_length}`] = dictionary;
            debugLog(`Le dictionnaire des mots proposables de ${word_length} lettres est chargé depuis le stockage local.`);
        }

        // Appel du callback
        callback();
    } else {
        var script = document.createElement('script');
        script.src = `./src/js/dictionary/${type}/${word_length}_lettres.js`;
        script.onload = () => {
            let data = [];
            if (type == "mot_a_trouver") { data = game.dictionnaire_mot_a_trouver[`length_${word_length}`] }
            if (type == "verification") { data = game.dictionnaire_verification[`length_${word_length}`]
                
            }
            if (!data) {
                console.error("Le dictionnaire n'a pas été injecté par le script.");
                return;
            }
            // Pas de cache local pour la vérification (2,8 Mo, risque de dépasser le quota) :
            // le navigateur met déjà le fichier .js en cache
            if (type == "mot_a_trouver") {
                try {
                    localStorage.setItem(storageKey, JSON.stringify({ version: DICTIONARY_VERSION, mots: data }));
                    debugLog(`Dictionnaire ${word_length} lettres (${type}) chargé et sauvegardé.`);
                } catch (error) {
                    console.warn(`Dictionnaire ${word_length} lettres (${type}) chargé mais non sauvegardé dans le stockage local :`, error);
                }
            } else {
                debugLog(`Dictionnaire ${word_length} lettres (${type}) chargé.`);
            }


            if (type == "mot_a_trouver") {
                // Mise à jour des boutons de debug
                document.getElementById(`debug_button_add_dictionary_${word_length}`).disabled = true;
                document.getElementById(`debug_button_drop_dictionary_${word_length}`).disabled = false;
            }

            // Appel du callback
            callback();
        };
        script.onerror = () => {
            console.error("Erreur chargement script dictionnaire :", script.src, type);
            script.remove();
            const message = `Impossible de charger le dictionnaire des mots de ${word_length} lettres. Vérifiez la connexion puis réessayez.`;
            announce(message);
            alert(message);
            onError(new Error(message));
        };
        document.head.appendChild(script);
    }
}

function dropDictionary(word_length, type) {
    if (word_length < 5 || word_length > 10 ) {
        console.error("Seuls les mots entre 5 et 10 lettres sont gérés.")
        return
    }
    const storageKey = `motus_${type}_${word_length}`;

    if (type == "mot_a_trouver") {
        game.dictionnaire_mot_a_trouver[`length_${word_length}`] = [];

        document.getElementById(`debug_button_add_dictionary_${word_length}`).disabled = false;
        document.getElementById(`debug_button_drop_dictionary_${word_length}`).disabled = true;
    } else if (type == "verification") {
        game.dictionnaire_verification[`length_${word_length}`] = [];
    } else {
        console.error(`Type de dictionnaire inconnu : ${type}`);
        return;
    }
    localStorage.removeItem(storageKey);

    console.log(`Le dictionnaire ${type} des mots de ${word_length} lettres est supprimé`);
}


const modal = document.querySelector('#settings-modal');

// Modal
document.addEventListener('click', (event) => {
    
    // 1. Ouverture (data-toggle="modal")
    const toggleBtn = event.target.closest('[data-toggle="modal"]');
    if (toggleBtn) {
        const targetSelector = toggleBtn.getAttribute('data-target');
        const modal = document.querySelector(targetSelector);
        if (modal) {
            // Jeu en pause tant que la fenêtre est ouverte (rétabli à sa fermeture, voir l'événement "close")
            if (!modal.open) {
                modal.dataset.pauseBefore = game.pause;
                game.pause = true;
            }
            modal.showModal();
        }
        return; // On arrête là pour ce clic
    }

    // Fermeture (data-dismiss="modal")
    const dismissBtn = event.target.closest('[data-dismiss="modal"]');
    if (dismissBtn) {
        const modal = dismissBtn.closest('dialog'); 
        if (modal) modal.close();
        return;
    }

    // 3. Fermeture sur backdrop (Arrière-plan)
    if (event.target.tagName === 'DIALOG') {
        event.target.close();
    }
});

// Fermeture d'une fenêtre, quelle que soit la façon (bouton, arrière-plan, Échap) : fin de la pause
document.addEventListener('DOMContentLoaded', function() {
    // Sauvegarde automatique : tout changement dans les paramètres est enregistré aussitôt
    // (le gestionnaire onchange du contrôle a déjà mis settings à jour : il s'exécute avant celui-ci)
    const settings_modal = document.getElementById("settings-modal");
    settings_modal.addEventListener('change', function(event) {
        if (event.target.closest("#word_list_section_text, #import_settings_file")) { return; }
        saveSettingsIntoLocalStorage();
        const status = document.getElementById("settings_save_status");
        status.textContent = "Modification enregistrée.";
        clearTimeout(status.resetTimer);
        status.resetTimer = setTimeout(() => { status.textContent = "Les modifications sont enregistrées automatiquement."; }, 2000);
    });

    // La fenêtre de longueur du prochain mot ne se ferme pas sans choix (Échap ignoré)
    document.getElementById("word_length_dialog").addEventListener('cancel', function(event) {
        event.preventDefault();
    });

    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('close', function() {
            if (this.dataset.pauseBefore !== undefined) {
                game.pause = this.dataset.pauseBefore == "true";
                delete this.dataset.pauseBefore;
            }
        });
    });
});


// Nav links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Retire la classe "active" de tous les onglets et contenus
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

            // Ajoute la classe "active" à l'onglet cliqué
            this.classList.add('active');

            // État des onglets pour les lecteurs d'écran : seul l'onglet actif est dans l'ordre de tabulation
            document.querySelectorAll('.nav-link').forEach(l => {
                l.setAttribute('aria-selected', l === this ? 'true' : 'false');
                l.setAttribute('tabindex', l === this ? '0' : '-1');
            });

            // Affiche le contenu correspondant
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });

        // Flèches gauche / droite, Début / Fin pour passer d'un onglet à l'autre
        link.addEventListener('keydown', function(event) {
            const links = Array.from(document.querySelectorAll('.nav-link'));
            const index = links.indexOf(this);
            let target = null;
            if (event.key == "ArrowRight") { target = links[(index + 1) % links.length]; }
            if (event.key == "ArrowLeft") { target = links[(index - 1 + links.length) % links.length]; }
            if (event.key == "Home") { target = links[0]; }
            if (event.key == "End") { target = links[links.length - 1]; }
            if (target) {
                event.preventDefault();
                target.click();
                target.focus();
            }
        });
    });
});

// Un clic souris sur la barre haute ou le clavier visuel ne garde pas le focus sur le bouton :
// sinon la touche Entrée suivante activerait ce bouton au lieu de valider le mot
document.addEventListener('mousedown', function(event) {
    if (event.target.closest && event.target.closest('.topbar_button_group, .keyboard_key')) {
        event.preventDefault();
    }
});



// Outil de debug, à lancer depuis la console : numéros visibles et numéros uniques de chaque grille
function debugListAllGridUniqueNumber() {
    for (let i=0; i<6; i++) {
        const grid_mask = game.number_grid_data.mask[i+1];
        for (const team of ["yellow", "blue"]) {
            const grid = game.number_grid_data[team][i+1];
            const visible = grid.filter((num, index) => grid_mask[index] == 1);
            const unique = [...new Set(visible)];
            console.log(`Grille ${i+1} (${team}) :`, visible, "uniques :", unique);
        }
    }
}

// DEBUG
// Logs de debug : activés depuis la page Debug, mémorisés dans ce navigateur
function isDebugEnabled() {
    try {
        return localStorage.getItem("motus_debug") == "true";
    } catch (error) {
        return false;
    }
}

function setDebugEnabled(value) {
    game.debug = value;
    try {
        localStorage.setItem("motus_debug", value);
    } catch (error) {
        console.warn("Impossible de mémoriser le drapeau de debug :", error);
    }
}

function debugLog(...args) {
    if (typeof game != "undefined" && game.debug == true) {
        console.log(...args);
    }
}

// ÉMISSIONS TÉLÉ
// Liste les émissions de GRILLES_TELE (src/data/grille_tele.js) sur la page dédiée
function displayTvPage() {
    const list = document.getElementById("tv_replay_list");
    list.innerHTML = "";

    GRILLES_TELE.grille_tv.forEach((emission, index) => {
        list.innerHTML += `<button class="button menu_button" onclick="startTvReplay(${index})">${emission.date} · ${emission.mots.length} mots</button>`;
    });

    displayPage("tv_page");
}

// Lance une partie avec les mots réels de l'émission, dans l'ordre
async function startTvReplay(index) {
    const emission = GRILLES_TELE.grille_tv[index];
    if (!emission) {
        console.error(`Émission introuvable : ${index}`);
        return;
    }

    if (game.started == true) {
        if (!confirm("Une partie est en cours. L'abandonner pour rejouer cette émission ?")) { return; }
        resetGame();
    }

    // Mots en majuscules sans accents, comme les dictionnaires
    const words = emission.mots.map(word => word.normalize('NFD').replace(/[̀-ͯ]/g, "").toUpperCase());
    const lengths = [...new Set(words.map(word => word.length))].filter(length => length >= 5 && length <= 10);
    try {
        await Promise.all(lengths.map(length => loadDictionaryAsync(length, 'verification')));
    } catch (error) {
        return;
    }

    // Remplacement de la liste de mots à trouver
    game.word_to_find_list = [];
    document.getElementById("word_list").innerHTML = "";

    words.forEach(word => {
        const length_ok = word.length >= 5 && word.length <= 10;
        if (!length_ok || !game.dictionnaire_verification[`length_${word.length}`].includes(word)) {
            console.warn(`Mot de l'émission ignoré (absent du dictionnaire) : ${word}`);
            return;
        }
        WordListAddRow(word);
    });

    if (game.word_to_find_list.length == 0) {
        console.error(`Aucun mot jouable dans l'émission du ${emission.date}`);
        return;
    }

    console.log(`Émission du ${emission.date} : ${game.word_to_find_list.length} mots, puis mots au hasard.`);
    initGame();
}

// ACCESSIBILITÉ
// Annonce un message aux lecteurs d'écran (zone aria-live #screen_reader_announcer)
function announce(message) {
    const announcer = document.getElementById("screen_reader_announcer");
    if (!announcer) { return; }
    // Vidage puis réécriture : un message identique au précédent est relu
    announcer.textContent = "";
    setTimeout(function() { announcer.textContent = message; }, 50);
}

// Vrai si le système demande de réduire les animations
function prefersReducedMotion() {
    return typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// MESSAGES À L'ÉCRAN
// Bandeau bref sous la grille (#game_message). duration en ms, 0 = jusqu'à hideGameMessage().
// Les lecteurs d'écran passent par announce() : le bandeau est aria-hidden pour ne pas lire deux fois.
function showGameMessage(message, duration = 2500) {
    const element = document.getElementById("game_message");
    if (!element) { return; }
    element.textContent = message;
    element.classList.add("visible");
    clearTimeout(element.hideTimer);
    if (duration > 0) {
        element.hideTimer = setTimeout(hideGameMessage, duration);
    }
}

function hideGameMessage() {
    const element = document.getElementById("game_message");
    if (!element) { return; }
    clearTimeout(element.hideTimer);
    element.classList.remove("visible");
}

// Rangée « Lettres » du menu : flèches gauche / droite pour changer de longueur
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("menu_word_length").addEventListener('keydown', function(event) {
        let step = 0;
        if (event.key == "ArrowRight" || event.key == "ArrowUp") { step = 1; }
        if (event.key == "ArrowLeft" || event.key == "ArrowDown") { step = -1; }
        if (step == 0) { return; }
        event.preventDefault();
        const length = Math.min(10, Math.max(5, settings.always_ask_length + step));
        updateMenuWordLength(length);
        this.querySelector(`button[data-length="${length}"]`).focus();
    });
});

// CHRONOMÈTRE (expérimental)
// Compte à rebours d'une proposition : relancé à chaque nouvelle ligne (newWordLine), arrêté à la validation.
// Figé pendant une pause (menu, paramètres) ou une fenêtre ouverte.
function updateTimerSettings(value = settings.timer_enabled) {
    settings.timer_enabled = value;
    if (value != true) { stopProposalTimer(); }
}

function startProposalTimer() {
    stopProposalTimer();
    if (settings.timer_enabled != true || game.focus_on == "number" || game.word_found == true || game.word_displayed == true) {
        return;
    }
    game.timer_remaining = Number(settings.timer_duration) || 10;
    renderProposalTimer();
    document.getElementById("proposal_timer").classList.remove("d-none");
    game.timer_interval = setInterval(tickProposalTimer, 1000);
}

function stopProposalTimer() {
    clearInterval(game.timer_interval);
    game.timer_interval = undefined;
    const element = document.getElementById("proposal_timer");
    if (element) { element.classList.add("d-none"); }
}

function tickProposalTimer() {
    if (game.pause == true || document.querySelector("dialog[open]")) { return; }
    game.timer_remaining--;
    renderProposalTimer();
    if (game.timer_remaining <= 0) {
        clearInterval(game.timer_interval);
        game.timer_interval = undefined;
        proposalTimerEnded();
    }
}

function renderProposalTimer() {
    const element = document.getElementById("proposal_timer");
    element.textContent = Math.max(0, game.timer_remaining);
    element.classList.toggle("urgent", game.timer_remaining <= 3);
}

// À zéro : toujours le son « temps écoulé » ; selon le réglage, la proposition est aussi refusée
function proposalTimerEnded() {
    timesUp();
    if (settings.timer_behaviour == "error") {
        // Comme un mot refusé : bandeau, changement d'équipe et comportement après erreur
        wordErrorHandler(6, true);
    } else {
        // L'animateur décide de la suite
        showGameMessage("Temps écoulé");
        announce("Temps écoulé.");
    }
}

// HISTORIQUE DE LA PARTIE
function teamLabel(team) {
    return team == "blue" ? "Bleue" : "Jaune";
}

// Enregistre le sort du mot en cours : "trouvé", "non trouvé" (solution affichée) ou "passé" (nouveau mot demandé)
function recordWordResult(result) {
    if (!game.word_to_find || game.word_recorded == true) { return; }
    game.word_recorded = true;
    game.history.push({
        heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        mot: game.word_to_find,
        lettres: game.word_length,
        resultat: result,
        lignes: game.try_count_index,
        equipe: settings.team_enabled == true && result == "trouvé" ? teamLabel(game.team_focus) : "",
        points: result == "trouvé" ? settings.score_addition : 0
    });
}

function recordMotus() {
    game.history.push({
        heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        mot: "MOTUS",
        lettres: "",
        resultat: "MOTUS",
        lignes: "",
        equipe: settings.team_enabled == true ? teamLabel(game.team_focus) : "",
        points: settings.score_motus
    });
}

function displayHistoryPage() {
    const tbody = document.querySelector("#history_table tbody");
    const history = game.history || [];
    tbody.innerHTML = history.map((entry, index) => `<tr class="history_${entry.resultat.replace(/\s/g, "_")}">
        <td>${index + 1}</td><td>${entry.heure}</td><td class="history_word">${entry.mot}</td><td>${entry.lettres}</td>
        <td>${entry.resultat}</td><td>${entry.lignes}</td><td>${entry.equipe}</td><td>${entry.points}</td></tr>`).join("");

    const words = history.filter(entry => entry.resultat != "MOTUS");
    const found = words.filter(entry => entry.resultat == "trouvé").length;
    let summary = history.length == 0
        ? "Aucun mot joué pour l'instant."
        : `${words.length} mot(s) joué(s), ${found} trouvé(s). Score : ${settings.team_enabled ? `jaune ${game.score_yellow || 0}, bleue ${game.score_blue || 0}` : (game.score_yellow || 0)}.`;
    document.getElementById("history_summary").textContent = summary;
    document.getElementById("history_table").classList.toggle("d-none", history.length == 0);
    document.getElementById("history_export_button").disabled = history.length == 0;

    displayPage("history_page");
}

// Export CSV (séparateur « ; » et BOM UTF-8 pour une ouverture directe dans un tableur)
function exportHistory() {
    const history = game.history || [];
    if (history.length == 0) { return; }
    const columns = ["heure", "mot", "lettres", "resultat", "lignes", "equipe", "points"];
    const header = ["Heure", "Mot", "Lettres", "Résultat", "Lignes", "Équipe", "Points"];
    const escape = value => `"${String(value).replace(/"/g, '""')}"`;
    const lines = [header.map(escape).join(";")].concat(history.map(entry => columns.map(column => escape(entry[column])).join(";")));
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `motusJS_historique_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

// HORS LIGNE
// Service worker (sw.js) : met le jeu en cache pour jouer sans connexion. Inutile en file:// (non pris en charge).
function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) { return; }
    navigator.serviceWorker.register("sw.js").catch(error => console.warn("Mode hors ligne indisponible :", error));
}
