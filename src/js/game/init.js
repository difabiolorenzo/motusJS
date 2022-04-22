function initVariables() {
    game = {
        word_to_find_list: [],
        check_word_length: true,
        check_word_presence: true,
        check_word_duplication: true,
        check_word_first_letter: true,


        word_displayed: false,
        word_found: false,

        always_ask: false,
        always_ask_length: 8,

        try_number_max: 6,
        lettre_plus_amount: 1,

        number_grid_index: 0,
        black_ball_amount: 3,
        try_picking_ball: 2,

        use_saving_ball: true,
        limiting_saving_ball: true,

        team_enabled: false,
        score_addition: 50,
        score_yellow: 0,
        score_blue: 0,
        change_turn_mode: "by_error: ", // ("by_error" || "by_proposition")
        team_focus: "yellow: ", // ("yellow" || "blue")
    };
    settings = {
        automatic_behaviour_new_line_error: "replace_bonus", //"replace_bonus" "replace_only" "add_bonus" "add_only" "none"
        playsound_enabled: true,
        automatic_behaviour: true,
        automatic_behaviour_redirect_number_grid: true,
        automatic_behaviour_redirect_letter_grid: false,
        automatic_behaviour_ask_new_word: true,
    };
    global = {
        verification_time_multiplier: 1,
        displayed_grid_type: "letter_grid", // "number_grid"
        displayed_page: "main_menu",
        settings_group_displayed: false, //dropdown
        gamemode: "normal", // "normal" "one_word" "daily"
        use_number_grid: true,
        game_panel_displayed: "letter",

        version_name: "2.4 Dev 1",
        game_started: false,
        game_paused: false,

        // animation 	animationIntervalID_1 animationAfficheSolution
        // 			    global.animationIntervalID_2 animationLettreBonus
        // 			    animationIntervalID_3 animationVerificationProposition
        // 			    animationIntervalID_4 animationPickedBall
        // 			    animationIntervalID_5 animationMOTUS
    }
    
    regularCharExpression = /^[a-zA-Z\u00C0-\u00ff]+$/; 
    document.getElementById("version").innerHTML = global.version_name;

    // autoplay() //dev
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
            if (game.always_ask == false) {
                WordListAddRowRandom(game.always_ask_length);
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