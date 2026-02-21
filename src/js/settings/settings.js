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
    settings.always_ask = value;
    if (value == false) { editHTML("always_ask_length_dropdown", "disabled", false); } else {
        editHTML("always_ask_length_dropdown", "disabled", true);
    }
}

function UpdateTeamSettings(value) {
    settings.team_enabled = value;
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
    settings.use_number_grid = value;
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
    
    button_pick_ball.className = "d-none"

    if (mode == "random") {
        button_pick_ball.className = ""
    }

    if (mode == "input_touch") {
    }
    if (mode == "input_keyboard") {
    }
}

function WordListAddRow(word_list_selected_word) {

    var word_list_selected_word = word_list_selected_word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
    var word_list_table = document.getElementById("word_list");

    var word_list_rowCount = word_list_table.rows.length;
    var word_list_row = word_list_table.insertRow(word_list_rowCount);

    word_list_row.insertCell(0).innerHTML = word_list_selected_word;
    word_list_row.insertCell(1).innerHTML = `<input type="button" class="button" value = "Information sur ce mot" onclick="SearchWordInformations('${word_list_selected_word}')">`;
    word_list_row.insertCell(2).innerHTML = '<input type="button" class="button" value = "❌" onClick="Javascript:WordListDeleteRow(this)">';

    document.getElementById('word_list_selected_word').value = "";

    // Ajout du mot dans la liste de mot à trouver
    game.word_to_find_list.push(word_list_selected_word);
}

function WordListAddRowRandom(word_length) {
    // Vérifie si la longueur du mot est valide
    if (word_length < 5 || word_length > 10) {
        console.error("Seuls les mots entre 5 et 10 lettres sont gérés.");
        return Promise.reject("Longueur de mot invalide.");
    }

    const dictionary_index = `length_${word_length}`;

    // Si le dictionnaire est déjà chargé, on utilise une promesse résolue
    if (game.word_to_find_dictionary[dictionary_index] && game.word_to_find_dictionary[dictionary_index].length > 0) {
        const word_list_random_word_index = Math.floor(Math.random() * game.word_to_find_dictionary[dictionary_index].length);
        const word_list_random_word = game.word_to_find_dictionary[dictionary_index][word_list_random_word_index];
        WordListAddRow(word_list_random_word);
        return Promise.resolve();
    }
    // Sinon, on charge le dictionnaire et on attend sa disponibilité
    else {
        return new Promise((resolve, reject) => {
            addDictionaryPropositionWithCallback(word_length, () => {
                // Une fois le dictionnaire chargé, on essaie à nouveau
                if (game.word_to_find_dictionary[dictionary_index] && game.word_to_find_dictionary[dictionary_index].length > 0) {
                    const word_list_random_word_index = Math.floor(Math.random() * game.word_to_find_dictionary[dictionary_index].length);
                    const word_list_random_word = game.word_to_find_dictionary[dictionary_index][word_list_random_word_index];
                    WordListAddRow(word_list_random_word);
                    resolve();
                } else {
                    console.error(`Le dictionnaire pour les mots de ${word_length} lettres n'est toujours pas disponible.`);
                    reject("Dictionnaire non disponible.");
                }
            });
        });
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