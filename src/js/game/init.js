function initVariables() {
    setDefaultVariables();
    loadSettingsByLocalStorage();
    setHTMLFromSettings()

    global.version_name = "2.4 Dev 2";
    document.getElementById("version").innerHTML = global.version_name;
}

function setDefaultVariables() {
    game = {
        word_to_find_list: [],

        word_displayed: false,
        word_found: false,
        try_number_max: 6,
        number_grid_index: 0,

        score_yellow: 0,
        score_blue: 0,
        team_focus: "yellow: ", // ("yellow" || "blue")
    };
    settings = {
        verification_time_multiplier: 1,
        style: "2010",

        automatic_behaviour: true,
        automatic_behaviour_new_line_error: "replace_bonus", //"replace_bonus" "replace_only" "add_bonus" "add_only" "none"
        automatic_behaviour_redirect_number_grid: true,
        automatic_behaviour_redirect_letter_grid: false,
        automatic_behaviour_ask_new_word: true,

        check_word_presence: true,
        check_word_duplication: true,
        check_word_length: true,
        check_word_first_letter: true,

        bonus_letter_amount: 1,
        always_ask: false,
        always_ask_length: 8,

        use_number_grid: true,
        try_picking_ball: 2,
        use_saving_ball: true,
        limiting_saving_ball: true,
        black_ball_amount: 3,
        ball_selection_mode: undefined, // N'est pas utlisé

        team_enabled: false,
        score_addition: 50,
        change_turn_mode: "by_error", // ("by_error" || "by_proposition")
        playsound_enabled: true,
    };
    global = {
        displayed_grid_type: "letter_grid", // "number_grid"
        displayed_page: "main_menu",
        settings_group_displayed: false, //dropdown
        gamemode: "normal", // "normal" "one_word" "daily"
        
        game_panel_displayed: "letter",

        game_started: false,
        game_paused: false,

        // animation 	animationIntervalID_1 animationAfficheSolution
        // 			    global.animationIntervalID_2 animationLettreBonus
        // 			    animationIntervalID_3 animationVerificationProposition
        // 			    animationIntervalID_4 animationPickedBall
        // 			    animationIntervalID_5 animationMOTUS
    }
    // autoplay() //dev
}

function resetSettings() {
    setDefaultVariables()
    setHTMLFromSettings()
}

function loadSettingsByLocalStorage() {
    if (localStorage.getItem("settings") != null) {
        console.log("Paramètres trouvé dans le stockage local")
        const settings_values = JSON.parse(localStorage.getItem("settings"))
        settings = settings_values;
        
        console.log(settings)
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

function importSettings() {

}

function setHTMLFromSettings() {
    document.getElementById("verification_speed_select").value = settings.verification_time_multiplier;
    document.getElementById("grid_style").value = settings.style;
    UpdateStyle(settings.style);
    document.getElementById("check_automatic_behaviour").checked = settings.automatic_behaviour;
    document.getElementById("check_automatic_behaviour_new_line_error").value = settings.automatic_behaviour_new_line_error;
    document.getElementById("check_automatic_behaviour_redirect_number_grid").checked = settings.automatic_behaviour_redirect_number_grid;
    document.getElementById("check_automatic_behaviour_redirect_letter_grid").checked = settings.automatic_behaviour_redirect_letter_grid;
    document.getElementById("check_automatic_behaviour_new_word").checked = settings.automatic_behaviour_ask_new_word;

    document.getElementById("checkbox_check_word_presence").checked = settings.check_word_presence;
    document.getElementById("checkbox_check_word_duplication").checked = settings.check_word_duplication;
    document.getElementById("checkbox_check_word_length").checked = settings.check_word_length;
    document.getElementById("checkbox_check_first_letter").checked = settings.check_word_first_letter;

    document.getElementById("select_bonus_letter_amount").value = settings.bonus_letter_amount;
    
    document.getElementById("checkbox_always_ask_word_length").checked = settings.always_ask;
    UpdateAlwaysAskSettings(settings.always_ask);
    document.getElementById("always_ask_length_dropdown").checked = settings.always_ask_length;

    document.getElementById("use_number_grid_checkbox").checked = settings.use_number_grid;
    document.getElementById("try_picking_ball_input").value = settings.try_picking_ball;
    document.getElementById("use_saving_ball_checkbox").checked = settings.use_saving_ball;
    document.getElementById("limiting_saving_ball_checkbox").checked = settings.limiting_saving_ball;
    document.getElementById("black_ball_amount_input").value = settings.black_ball_amount;
    // document.getElementById("sort_mode_select").value = undefined;
    // UpdateNumberSelectMode(undefined);
    document.getElementById("team_enabled_checkbox").checked = settings.team_enabled;
    document.getElementById("score_addition_select").value = settings.score_addition;
    document.getElementById("settings_section_team").value = settings.change_turn_mode;
    document.getElementById("checkbox_sound_activated").checked = settings.playsound_enabled;

}

function autoplay() {
    global.gamemode = "normal"; // "one_word"
    initGame();
    // UpdateTeamSettings(true)
}


// function called by "Jouer" buttons
function initGame() {
    if (global.game_started == true) { //return to game_paused false state
        returnGame();
    } else { //create game
        if (game.word_to_find_list.length > 0) { //word inside word list
            createGame();
            displayPage("letter_grid_page");
        } else { //create word
            if (settings.always_ask == false) {
                WordListAddRowRandom(settings.always_ask_length);
                createGame();
                displayPage("letter_grid_page");
            } else { //ask word lenght
                var prompt_new_word = Number(window.prompt("Aucun mot n'est prédéfini dans les paramètres, veuillez entrer le nombre de lettres (compris entre 5 et 10) du prochain mot tiré au hasard:", "8"));
                if (prompt_new_word >= 5 && prompt_new_word <= 10 ) {
                    WordListAddRowRandom(prompt_new_word);
                    createGame();
                    displayPage("letter_grid_page");
                }
            }
        }
    }
}

function createGame() {
    global.game_started = true;
    global.game_paused = false;

    createLetterGrid();
    wordInit();
    lockNumberGridSettings();
    lockNumberGridSettings();
    createKeyboard();
}   