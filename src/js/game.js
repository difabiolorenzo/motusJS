

function initVariables() {
    setDefaultVariables();
    loadSettingsByLocalStorage();
    setHTMLFromSettings()
    document.getElementById("version").innerHTML = "MotusJS " + game.version;
}

function setDefaultVariables() {
    game = {
        version: "2.5",
        displayed_grid_type: "letter_grid", // "number_grid"
        displayed_page: "main_menu",
        
        focus_on: undefined, // "letter" / "number"

        started: false,
        pause: false,
        
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

        automatic_behaviour: true,
        automatic_behaviour_new_line_error: "add_bonus", //"replace_bonus" "replace_only" "add_bonus" "add_only" "none"
        automatic_behaviour_new_line_team_error: "replace_bonus",
        automatic_behaviour_redirect_number_grid: true,
        automatic_behaviour_redirect_letter_grid: false,
        automatic_behaviour_ask_new_word: true,

        display_soluce_on_last_row: false,      // pas d'option HTML
        reinit_line_if_unvalid_word: true,      // pas d'option HTML

        display_typing_indicator: false,
        keyboard_show_cursor: false,        // pas d'option HTML
        keyboard_start_typing_in_void: false,       // pas d'option HTML

        check_word_presence: true,
        check_word_duplication: true,
        check_word_length: true,
        check_word_first_letter: true,

        confirm_submit: false,       // pas d'option HTML, ne fonctionne pas.

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
        number_grid_creation_animation: false,      // pas d'option HTML
        // number_grid_manual_creation: true,       // pas d'option HTML

        team_enabled: false,
        score_addition: 50,
        change_turn_mode: "by_error", // ("by_error" || "by_proposition")
        playsound_enabled: true,
        play_extra_sounds: false,

        help_page_length: 8
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
	document.getElementById("keyboard").innerHTML = "";
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
    setDefaultVariables()
    setHTMLFromSettings()
}

function loadSettingsByLocalStorage() {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings != null) {
        console.log("Paramètres trouvés dans le stockage local");
        const parsedSettings = JSON.parse(savedSettings);

        // Fusionne les paramètres
        settings = { ...settings, ...parsedSettings };
    }
}

function saveSettingsIntoLocalStorage() {
    console.log("Sauvegarde des paramètres dans le stockage local")
    const string_settings = JSON.stringify(settings);
    localStorage.removeItem("settings");
    localStorage.setItem("settings", string_settings);

    console.log(string_settings)
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

function importSettings() {}

function setHTMLFromSettings() {
    document.getElementById("verification_speed_select").value = settings.verification_time_multiplier;
    document.getElementById("grid_style").value = settings.style;
    changeStyle(settings.style);

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
    document.getElementById("checkbox_number_grid_specific_display_blue_team").value = settings.number_grid_specific_display_blue_team;
    document.getElementById("checkbox_number_grid_creation_animation").value = settings.number_grid_creation_animation;

    updateTeamSettings(settings.team_enabled)
    document.getElementById("team_enabled_checkbox").checked = settings.team_enabled;
    document.getElementById("score_addition_select").value = settings.score_addition;
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

function updateAlwaysAskSettings(value = settings.always_ask) {
    settings.always_ask = value;
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
        case "always_ask_length":
            break;
    }
}

function updateTryPickingBall(value = settings.try_picking_ball) {
    settings.try_picking_ball = value;
    document.getElementById("input_try_picking_ball_indicator").innerHTML = value;    
}

function updateBlackBallAmount(value = settings.black_ball_amount) {
    settings.black_ball_amount = value;
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

        console.log(`Mot ajouté (${word_length} lettres) :`, random_word);

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

    // Suppresion du mot de la liste de mot à trouver
    game.word_to_find_list.splice(word_list_index - 1, 1);
}

function SearchWordInformations(word) {
    if (confirm("Voulez-vous ouvrir une page wiktionary.org sur le mot " + word.toLowerCase() + "?")) {
        window.open("https://fr.wiktionary.org/w/index.php?search=" + word.toLowerCase(), "_blank");
    }
}

// SON
function playsound(sound) {
    if (settings.playsound_enabled == true) {
        switch (sound) {
            case "letter_ok":
                $.playSound("src/sounds/lettre_ok.mp3");
                break;
            case "letter_bad":
                $.playSound("src/sounds/lettre_mauvaise.mp3");
                break;
            case "letter_missing":
                $.playSound("src/sounds/lettre_absente.mp3");
                break;
            case "error":
                $.playSound("src/sounds/lettre_absente.mp3");
                break;
            case "letter_bonus":
                $.playSound("src/sounds/lettre_bonus.mp3");
                break;
            case "wrong":
                $.playSound("src/sounds/erreur.mp3");
                break;
            case "victory":
                $.playSound("src/sounds/victoire.mp3");
                break;
            case "temps_ecoule":
                $.playSound("src/sounds/temps_ecoule.mp3");
                break;
            case "loose":
                $.playSound("src/sounds/perdu.mp3");
                break;
            case "grille_creation":
                $.playSound("src/sounds/grille_creation.mp3");
                break;
            case "grille_numero":
                $.playSound("src/sounds/grille_numero.mp3");
                break;
            case "grille_boule_noire":
                $.playSound("src/sounds/grille_boule_noire.mp3");
                break;
            case "grille_numero_tire":
                $.playSound("src/sounds/grille_numero_tire.mp3");
                break;
            case "motus":
                $.playSound("src/sounds/motus.mp3");
                break;
            case "boule_magique":
                $.playSound("src/sounds/boule_magique.mp3");
                break;
            case "jingle":
                $.playSound("src/sounds/jingle_motus.mp3");
                break;
            default:
                break;
        }
    }
}

function preloadsound(sound_file) {
    var sound_html = '<audio class="sound_player" autoplay="autoplay" style="display:none;">'
        + '<source src="' + sound_file + '" />'
        + '<embed src="' + sound_file + '" hidden="true" autostart="true" loop="false"/>'
        + '</audio>';
console.log(sound_html)
    document.body.appendChild(sound_html)
}

function editHTML(elementID, modifier, value) {
    alert("editHTML function")
    switch (modifier) {
        case "innerHTML":
            document.getElementById(elementID).innerHTML = value;
            break;
        case "className":
            document.getElementById(elementID).className = value;
            break;
        case "style":
            document.getElementById(elementID).style = value;
            break;
        case "disabled":
            document.getElementById(elementID).disabled = value;
            break;
        case "disabled":
            document.getElementById(elementID).disabled = value;
            break;
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
    
    let min_height = Math.floor(50 / (row/column) + 2);
    
    let element = `<div class="gridNEW" id="${grid_id}" style="
            grid-template-columns: repeat(${column}, 1fr);
            grid-template-rows: repeat(${row}, 1fr);
            aspect-ratio: ${column} / ${row};
            width: min(90vw, ${min_height}vh);
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

function addTeamScore(team) {
    if (game.team_focus == "yellow" || team == "yellow") {
        game.score_yellow += settings.score_addition;
        document.getElementById("score_yellow_panel").innerHTML = game.score_yellow;
        setTeamScore("yellow", game.score_yellow)
    }
    if (game.team_focus == "blue" || team == "blue") {
        game.score_blue += settings.score_addition;
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
    switch(errorCode) {
        case 1:
            console.log("La longueur du word_to_find n'est pas la bonne.");
            break;
        case 2:
            console.log("Mot absent du dictionnaire.");
            break;
        case 3:
            console.log("Mot déjà proposé.");
            break;
        case 4:
            console.log("Mot déjà affiché.");
            break;
        case 5:
            console.log("Boule non valide.");
            break;
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

function loadDictionaryAsync(word_length, type) {
    return new Promise((resolve, reject) => {
        loadDictionary(word_length, type, () => {
            resolve();
        });
    });
}

function loadDictionary(word_length, type, callback) {
    // type == mot_a_trouver ou verification

    if (word_length < 5 || word_length > 10) {
        console.error("Seuls les mots entre 5 et 10 lettres sont gérés.");
        return;
    }

    if (type == "mot_a_trouver" && game.dictionnaire_mot_a_trouver[`length_${word_length}`].length != 0) {
        console.log(`Le dictionnaire des mots à trouver de ${word_length} est déjà chargé.`);
        callback();
        return;
    }
    if (type == "verification" && game.dictionnaire_verification[`length_${word_length}`].length != 0) {
        console.log(`Le dictionnaire des mots proposables de ${word_length} est déjà chargé.`);
        callback();
        return;
    }

    const storageKey = `motus_${type}_${word_length}`;
    if (localStorage.getItem(storageKey) != null) {
        const dictionary = JSON.parse(localStorage.getItem(storageKey));
        if (type == "mot_a_trouver") {
            game.dictionnaire_mot_a_trouver[`length_${word_length}`] = dictionary;

            // Mise à jour des boutons de debug
            document.getElementById(`debug_button_add_dictionary_${word_length}`).disabled = true;
            document.getElementById(`debug_button_drop_dictionary_${word_length}`).disabled = false;
        console.log(`Le dictionnaire des mots à trouver de ${word_length} lettres est chargé depuis le stockage local.`);
        }
        if (type == "verification") {
            game.dictionnaire_verification[`length_${word_length}`] = dictionary;
            console.log(`Le dictionnaire des mots proposables de ${word_length} lettres est chargé depuis le stockage local.`);
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
            localStorage.setItem(storageKey, JSON.stringify(data));
            console.log(`Dictionnaire ${word_length} lettres (${type}) chargé et sauvegardé.`);


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
        };
        document.head.appendChild(script);
    }
}

function dropDictionary(word_length, type) {
    if (word_length < 5 || word_length > 10 ) {
        console.error("Seuls les mots entre 5 et 10 lettres sont gérés.")
        return
    }
    const storageKey = "motus_mot_a_trouver_" + word_length;

    game.dictionnaire_mot_a_trouver[`length_${word_length}`] = "";
    localStorage.removeItem(storageKey);

    document.getElementById(`debug_button_add_dictionary_${word_length}`).disabled = false;
    document.getElementById(`debug_button_drop_dictionary_${word_length}`).disabled = true;

    console.log(`Le dictionnaire des mots de ${word_length} lettres sont supprimés`);
}


const modal = document.querySelector('#settings-modal');

// Modal
document.addEventListener('click', (event) => {
    
    // 1. Ouverture (data-toggle="modal")
    const toggleBtn = event.target.closest('[data-toggle="modal"]');
    if (toggleBtn) {
        const targetSelector = toggleBtn.getAttribute('data-target');
        const modal = document.querySelector(targetSelector);
        if (modal) modal.showModal();
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

            // Affiche le contenu correspondant
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});



function debugListAllGridUniqueNumber() {
    for (let i=0; i<6; i++) {
        const grid_mask = game.number_grid_data.mask[i+1];
        const grid_yellow = game.number_grid_data.yellow[i+1];
        const grid_blue = game.number_grid_data.blue[i+1];
        var yellow = [];
        var blue = [];
        var unique_yellow = [];
        var unique_blue = [];

        for (number in grid_yellow) {
            if (grid_mask[number] == 1) {
                yellow.push(grid_yellow[number])
                if (!yellow.includes(number)) {
                    unique_yellow.push(grid_yellow[number])
                }
            }
        }

        for (number in grid_blue) {
            if (grid_mask[number] == 1) {
                blue.push(grid_blue[number])
                if (!blue.includes(number)) {
                    unique_blue.push(grid_blue[number])
                }
            }
        }

        console.log(i+1, yellow)
        console.log(i+1, blue)

        if (i==1) {
            console.log("unique", unique_yellow)
            console.log("unique", unique_blue)
        }
        if (i==5) {
            console.log("unique", unique_yellow)
            console.log("unique", unique_blue)
        }

    }
}