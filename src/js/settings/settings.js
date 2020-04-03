function initVariables() {

    // SETTINGS

    playsound_enabled = true;
    play_jingle = false;

    displayed_page = "main_menu";

    //GAME
    check_word_length = true;
    check_word_presence = true;
    check_word_duplication = true;
    check_word_first_letter = true;

    try_number_max = 6;
    lettre_plus_amount = 1;
    word_found = undefined;
    word_displayed = false;
    dictionary_list = [dictionary_5, dictionary_6, dictionary_7, dictionary_8, dictionary_9, dictionary_10];

    word_to_find_list = [];

    always_ask = false;
    always_ask_length = 8;
            
    keyboardInput = document.getElementById("word_proposition_input");

    timer = 225;
    game_started = false;
    game_paused = false;

    animationIntervalID_1 = undefined;
    animationIntervalID_2 = undefined;
    animationIntervalID_3 = undefined;
    animationIntervalID_4 = undefined;
    animationIntervalID_5 = undefined;

    automatic_behaviour = true
    automatic_behaviour_line_start = true;
    automatic_behaviour_new_line_error = "replace_bonus"; //"replace_bonus" "replace_only" "add_bonus" "add_only" "none"
    automatic_behaviour_redirect_number_grid = true;
    automatic_behaviour_redirect_letter_grid = false;
    automatic_behaviour_ask_new_word = true;

    //SCORE
    score_addition = 50;

    score_yellow = 0;
    score_blue = 0;

    //TEAM
    team_enabled = false;
    change_turn_mode = "by_error"; // ("by_error" || "by_proposition")
    team_focus = "yellow"; // ("yellow" || "blue")

    // DEBUG
    debug_index = 0;
    const version_name = "2.2 - Pre-release 11"; document.getElementById("version").innerHTML = version_name;
    const regularCharExpression  = /^[a-zA-Z\u00C0-\u00ff]+$/;
    godmod = false

    //NUMBERGRID
    use_number_grid = true;
    use_saving_ball = true; // Boule magique
    limiting_saving_ball = true // limiting magic ball for first grid

    black_ball_amount = 3;
    try_picking_ball = 2;
    try_picking_ball_left = try_picking_ball;

    sort_mode = "random"; // ("random" || "input_keyboard" || "input_touch")
    grid_index = -1;
    grid_j_index = 0;
    grid_i_index = 0;
    team_color_grid = [];

    motus_engaged = false; // MOTUS done or not, there is no more than 1 motus

    yellow_grid_raw = [];
    blue_grid_raw = [];
    hided_number_spot = [];

    motus_animation_index = 0;
    picked_ball_animation = 0;
    
	number_proposed_tab = [];
	number_proposed = undefined;

    yellow_purgatory = document.getElementById("yellow_purgatory");
    blue_purgatory = document.getElementById("blue_purgatory");

    yellow_saving_ball = undefined;
    blue_saving_ball = undefined;
    yellow_saving_ball_picked = false;
    blue_saving_ball_picked = false;
}

function lockNumberGridSettings() {    
    document.getElementById("use_number_grid_checkbox").disabled = true;;
    document.getElementById("use_number_grid_checkbox").setAttribute("title", "La partie est lancée.");            
    document.getElementById("use_saving_ball_checkbox").disabled = true;
    document.getElementById("use_saving_ball_checkbox").setAttribute("title", "La partie est lancée.");
    document.getElementById("limiting_saving_ball_checkbox").disabled = true;
    document.getElementById("limiting_saving_ball_checkbox").setAttribute("title", "La partie est lancée.");
    document.getElementById("black_ball_amount_input").disabled = true;
    document.getElementById("black_ball_amount_input").setAttribute("title", "La partie est lancée.");
    document.getElementById("try_picking_ball_input").disabled = true;
    document.getElementById("try_picking_ball_input").setAttribute("title", "La partie est lancée.");
    document.getElementById("sort_mode_select").disabled = true;
    document.getElementById("sort_mode_select").setAttribute("title", "La partie est lancée.");
}

function UpdateAutomaticBehaviourSettings(value) {
    automatic_behaviour = value;
    if (value == true) {
        document.getElementById("check_automatic_behaviour_line_start").disabled = false
        document.getElementById("check_automatic_behaviour_new_line_error").disabled = false
        document.getElementById("check_automatic_behaviour_redirect_number_grid").disabled = false
        document.getElementById("check_automatic_behaviour_redirect_letter_grid").disabled = false
        document.getElementById("check_automatic_behaviour_new_word").disabled = false
    } else {
        document.getElementById("check_automatic_behaviour_line_start").disabled = true
        document.getElementById("check_automatic_behaviour_new_line_error").disabled = true
        document.getElementById("check_automatic_behaviour_redirect_number_grid").disabled = true
        document.getElementById("check_automatic_behaviour_redirect_letter_grid").disabled = true
        document.getElementById("check_automatic_behaviour_new_word").disabled = true
    }
}

function UpdateScoreSettings(value) {
    score_enabled = value;
    if (value == true) { document.getElementById("score_placeolder").style = "display:flex" }
}

function UpdateAlwaysAskSettings(value) {
    always_ask = value;
    if (value == true) { document.getElementById("always_ask_length_dropdown").disabled = false; } else {
        document.getElementById("always_ask_length_dropdown").disabled = true;
    }
}

function UpdateSoundSettings(value) {
    playsound_enabled = value;
    if (value == true) { document.getElementById("play_jingle_settings").disabled = false; } else {
        document.getElementById("play_jingle_settings").disabled = true;
    }
}

function UpdateTeamSettings(value) {
    team_enabled = value;
    if (value == true) {
        // team activated
        document.getElementById("settings_section_team").disabled = false;
        document.getElementById("score_1_panel").style = "display:block" // Le score de la seconde équipe s'affiche
        document.getElementById("change_team_letter_grid_button").style = "display:block" // Le bouton de changement d'équipe s'affiche
    } else {
        document.getElementById("settings_section_team").disabled = true;
        document.getElementById("change_team_letter_grid_button").style = "display:none" // Le bouton de changement d'équipe ne s'affiche pas
        document.getElementById("score_1_panel").style = "display:none" // Le score de la seconde équipe ne s'affiche pas
        document.getElementById("score_0_panel").className = "active_score" // Reinitialisation de l'ordre
        document.getElementById("score_1_panel").className = "score"
        document.getElementById("number_grid_placeolder_blue").style = "display:none";
        team_focus = "yellow";
    }
}

function UpdateNumberGridSettings(value) {
    use_number_grid = value;
    if (value == true) {
        document.getElementById("number_grid_button").style = "display:block"
        document.getElementById("use_saving_ball_checkbox").disabled = false
        document.getElementById("black_ball_amount_input").disabled = false
        document.getElementById("try_picking_ball_input").disabled = false
        if (use_saving_ball == true) {
            document.getElementById("limiting_saving_ball_checkbox").disabled = false
        }
        document.getElementById("sort_mode_select").disabled = false
    } else {
        document.getElementById("number_grid_button").style = "display:none"
        document.getElementById("use_saving_ball_checkbox").disabled = true
        document.getElementById("limiting_saving_ball_checkbox").disabled = true
        document.getElementById("black_ball_amount_input").disabled = true
        document.getElementById("try_picking_ball_input").disabled = true
        document.getElementById("sort_mode_select").disabled = true
    }
}

function UpdateSavingBallSettings(value) {
    use_saving_ball = value;
    if (value == true) {
        document.getElementById("limiting_saving_ball_checkbox").disabled = false
    } else {
        document.getElementById("limiting_saving_ball_checkbox").disabled = true
    }
}

function UpdateNumberSelectMode(mode) {
    sort_mode = mode;
    if (mode == "input_keyboard") {
        document.getElementById("keyboard_number_grid_input").style = "display:block";
    } else {
        document.getElementById("keyboard_number_grid_input").style = "display:none";
    }
}

function WordListAddRow(word_list_selected_word) {

    var word_list_selected_word = word_list_selected_word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
    var word_list_table = document.getElementById("word_list");

    var word_list_rowCount = word_list_table.rows.length;
    var word_list_row = word_list_table.insertRow(word_list_rowCount);

    word_list_row.insertCell(0).innerHTML = word_list_selected_word;
    word_list_row.insertCell(1).innerHTML = '<input type="button" value = "❌" onClick="Javascript:WordListDeleteRow(this)">';
    word_list_row.insertCell(2).innerHTML = '<input type="button" value = "Information sur ce mot" onClick="Javascript:SearchWordInformations(this)">';

    document.getElementById('word_list_selected_word').value = "";

    // Ajout du mot dans la liste de mot à trouver
    word_to_find_list.push(word_list_selected_word);
}

function WordListAddRowRandom(letter_count) {
    if (dictionary_list[letter_count - 5] != undefined) {
        var word_list_random_word_index = Math.floor(Math.random() * dictionary_list[letter_count - 5].length);
        var word_list_random_word = dictionary_list[letter_count - 5][word_list_random_word_index];

        WordListAddRow(word_list_random_word);
    }
}

function WordAddCustom() {
    wordInput = document.getElementById('word_list_selected_word').value
    if (wordInput.length >= 5 && wordInput.length <= 10 && regularCharExpression.test(wordInput) == true) {
        WordListAddRow(wordInput)
    }
}

function WordListDeleteRow(word) {
    var word_list_index = word.parentNode.parentNode.rowIndex;
    var word_list_table = document.getElementById("word_list");
    word_list_table.deleteRow(word_list_index);

    // Suppresion du mot de la liste de mot à trouver
    word_to_find_list.splice(word_list_index - 1, 1);
}

function SearchWordInformations(word) {
    word_list_index = word.parentNode.parentNode.rowIndex;
    console.log(word_to_find_list[word_list_index - 1])

    if (confirm("Voulez-vous ouvrir une page wiktionary.org sur le mot " + word_to_find_list[word_list_index - 1].toLowerCase() + "?")) {
        window.open("https://fr.wiktionary.org/w/index.php?search=" + word_to_find_list[word_list_index - 1].toLowerCase(), "_blank");
    }
}