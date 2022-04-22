function displaySettingsGroup(settings_section) {
    editHTML("settings_section_number_grid", "style", "display:none");
    editHTML("settings_section_team_scores", "style", "display:none");
    editHTML("settings_section_gameplay", "style", "display:none");
    editHTML("settings_section_sounds", "style", "display:none");
    editHTML("settings_section_words", "style", "display:none");
    editHTML("settings_section_github", "style", "display:none");

    editHTML(settings_section, "style", "display:block");

    var navpanel_title = document.getElementById("navpanel_title")

    if (navpanel_title != null) { // when display: none
        switch (settings_section) {
            case "settings_section_number_grid":
                navpanel_title.innerHTML = "Grilles numérotées";
                break;
            case "settings_section_team_scores":
                navpanel_title.innerHTML = "Équipes et Scores";
                break;
            case "settings_section_gameplay":
                navpanel_title.innerHTML = "Gameplay";
                break;
            case "settings_section_sounds":
                navpanel_title.innerHTML = "Sons";
                break;
            case "settings_section_words":
                navpanel_title.innerHTML = "Mots";
                break;
            case "settings_section_gamemode":
                navpanel_title.innerHTML = "Modes de jeu";
                break;
            case "settings_section_github":
                navpanel_title.innerHTML = "GitHub";
                break;
            default:
                break;
        }
    }

    changeSettingsGroupDisplay() //close panel
}

function lockNumberGridSettings() {    
    editHTML("use_number_grid_checkbox", "disabled", true);
    document.getElementById("use_number_grid_checkbox").setAttribute("title", "La partie est lancée.");            
    editHTML("use_saving_ball_checkbox", "disabled", true);
    document.getElementById("use_saving_ball_checkbox").setAttribute("title", "La partie est lancée.");
    editHTML("limiting_saving_ball_checkbox", "disabled", true);
    document.getElementById("limiting_saving_ball_checkbox").setAttribute("title", "La partie est lancée.");
    editHTML("black_ball_amount_input", "disabled", true);
    document.getElementById("black_ball_amount_input").setAttribute("title", "La partie est lancée.");
    editHTML("try_picking_ball_input", "disabled", true);
    document.getElementById("try_picking_ball_input").setAttribute("title", "La partie est lancée.");
    editHTML("sort_mode_select", "disabled", true);
    document.getElementById("sort_mode_select").setAttribute("title", "La partie est lancée.");
}

function UpdateAutomaticBehaviourSettings(value) {
    automatic_behaviour = value;
    if (value == true) {
        editHTML("check_automatic_behaviour_new_line_error", "disabled", false);
        editHTML("check_automatic_behaviour_redirect_number_grid", "disabled", false);
        editHTML("check_automatic_behaviour_redirect_letter_grid", "disabled", false);
        editHTML("check_automatic_behaviour_new_word", "disabled", false);
    } else {
        editHTML("check_automatic_behaviour_new_line_error", "disabled", true);
        editHTML("check_automatic_behaviour_redirect_number_grid", "disabled", true);
        editHTML("check_automatic_behaviour_redirect_letter_grid", "disabled", true);
        editHTML("check_automatic_behaviour_new_word", "disabled", true);
    }
}

function UpdateScoreSettings(value) {
    score_enabled = value;
    if (value == true) { editHTML("score_placeolder", "style", "display:flex"); }
}

function UpdateAlwaysAskSettings(value) {
    game.always_ask = value;
    if (value == true) { editHTML("always_ask_length_dropdown", "disabled", false); } else {
        editHTML("always_ask_length_dropdown", "disabled", true);
    }
}

function UpdateTeamSettings(value) {
    game.team_enabled = value;
    if (value == true) {
        // team activated
        editHTML("settings_section_team", "disabled", false);
        editHTML("score_1_panel", "style", "display:block"); // Le score de la seconde équipe s'affiche
    } else {
        editHTML("settings_section_team", "disabled", true);
        editHTML("score_1_panel", "style", "display:none"); // Le score de la seconde équipe ne s'affiche pas
        editHTML("score_0_panel", "className", "active_score"); // Reinitialisation de l'ordre
        editHTML("score_1_panel", "className", "score");
        game.team_focus = "yellow";
    }
}

function UpdateNumberGridSettings(value) {
    global.use_number_grid = value;
    if (value == true) {
        editHTML("number_grid_button", "style", "display: block");
        editHTML("use_saving_ball_checkbox", "disabled", false);
        editHTML("black_ball_amount_input", "disabled", false);
        editHTML("try_picking_ball_input", "disabled", false);
        if (use_saving_ball == true) {
            editHTML("limiting_saving_ball_checkbox", "disabled", false);
        }
        editHTML("sort_mode_select", "disabled", false);
    } else {
        editHTML("number_grid_button", "style", "display:none");
        editHTML("use_saving_ball_checkbox", "disabled", true);
        editHTML("limiting_saving_ball_checkbox", "disabled", true);
        editHTML("black_ball_amount_input", "disabled", true);
        editHTML("try_picking_ball_input", "disabled", true);
        editHTML("sort_mode_select", "disabled", true);
    }
}

function UpdateSavingBallSettings(value) {
    use_saving_ball = value;
    if (value == true) {
        editHTML("limiting_saving_ball_checkbox", "disabled", false);
    } else {
        editHTML("limiting_saving_ball_checkbox", "disabled", true);
    }
}

function UpdateNumberSelectMode(mode) {
    sort_mode = mode;
    if (mode == "input_keyboard") {
        editHTML("keyboard_number_grid_input", "style", "display:block");
    } else {
        editHTML("keyboard_number_grid_input", "style", "display:none");
    }
}

function WordListAddRow(word_list_selected_word) {

    var word_list_selected_word = word_list_selected_word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
    var word_list_table = document.getElementById("word_list");

    var word_list_rowCount = word_list_table.rows.length;
    var word_list_row = word_list_table.insertRow(word_list_rowCount);

    word_list_row.insertCell(0).innerHTML = word_list_selected_word;
    word_list_row.insertCell(1).innerHTML = '<input type="button" class="button" value = "❌" onClick="Javascript:WordListDeleteRow(this)">';
    word_list_row.insertCell(2).innerHTML = '<input type="button" class="button" value = "Information sur ce mot" onClick="Javascript:SearchWordInformations(this)">';

    document.getElementById('word_list_selected_word').value = "";

    // Ajout du mot dans la liste de mot à trouver
    game.word_to_find_list.push(word_list_selected_word);
}

function WordListAddRowRandom(letter_count) {
    var dictionary_index = letter_count - 5; // 5 letters word is dict_0, 6 is dict_1
    var word_list_random_word_index = Math.floor(Math.random() * dictionary_list[dictionary_index].length);
    var word_list_random_word = dictionary_list[dictionary_index][word_list_random_word_index];

    WordListAddRow(word_list_random_word);
}

function WordAddCustom() {
    var wordInput = document.getElementById('word_list_selected_word').value
    if (wordInput.length >= 5 && wordInput.length <= 10 && regularCharExpression.test(wordInput) == true) {
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
    var word_list_index = word.parentNode.parentNode.rowIndex;
    console.log(game.word_to_find_list[word_list_index - 1])

    if (confirm("Voulez-vous ouvrir une page wiktionary.org sur le mot " + game.word_to_find_list[word_list_index - 1].toLowerCase() + "?")) {
        window.open("https://fr.wiktionary.org/w/index.php?search=" + game.word_to_find_list[word_list_index - 1].toLowerCase(), "_blank");
    }
}