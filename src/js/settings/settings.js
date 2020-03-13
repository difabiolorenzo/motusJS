// Tableau des mots à choisir

function WordListAddRow(word_list_selected_word) {

    var word_list_selected_word = word_list_selected_word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
    var word_list_table = document.getElementById("word_list");
 
    var word_list_rowCount = word_list_table.rows.length;
    var word_list_row = word_list_table.insertRow(word_list_rowCount);
 
    word_list_row.insertCell(0).innerHTML= word_list_selected_word;
    word_list_row.insertCell(1).innerHTML= '<input type="button" value = "❌" onClick="Javascript:WordListDeleteRow(this)">';
    word_list_row.insertCell(2).innerHTML= '<input type="button" value = "Information sur ce mot" onClick="Javascript:SearchInformationOnWord(this)">';

    document.getElementById('word_list_selected_word').value = "";

    // Ajout du mot dans la liste de mot à trouver
    word_to_find_list.push(word_list_selected_word);
}

function WordListAddRowRandom(letter_count) {
    if (dictionary_list[letter_count-5] != undefined) {
        var word_list_random_word_index = Math.floor(Math.random() * dictionary_list[letter_count-5].length);
    
        var word_list_random_word = dictionary_list[letter_count-5][word_list_random_word_index];
    
        WordListAddRow(word_list_random_word);
    }
}

function WordAddCustom() {
    wordInput = document.getElementById('word_list_selected_word').value
    if (wordInput.length >= 5 && wordInput.length <= 10 && regularCharExpression.test(wordInput) == true) {
        WordListAddRow(wordInput)
    }
}
 
function WordListDeleteRow(obj) {
    var word_list_index = obj.parentNode.parentNode.rowIndex;
    var word_list_table = document.getElementById("word_list");
    word_list_table.deleteRow(word_list_index);
    
    // Suppresion du mot de la liste de mot à trouver
    word_to_find_list.splice(word_list_index-1, 1);
}

function SearchInformationOnWord(obj) {
    word_list_index = obj.parentNode.parentNode.rowIndex;
    console.log(word_to_find_list[word_list_index - 1])

    if (confirm("Voulez-vous ouvrir une page wiktionary.org sur le mot " + word_to_find_list[word_list_index - 1].toLowerCase() + "?")) {
			window.open("https://fr.wiktionary.org/w/index.php?search=" + word_to_find_list[word_list_index - 1].toLowerCase(), "_blank");
	}
}

function UpdateStyle(value) {
    document.getElementById("letter_grid_page").className = "page style_" + value;
    document.getElementById("number_grid_page").className = "page style_" + value;
}

function UpdateScoreSettings(value) {
    score_enabled = value;
    if (value == true) {
        document.getElementById("").style = "display:block"
        document.getElementById("score_placeolder").style = "display:flex"
    }
}

function UpdateTeamSettings(value) {
    team_enabled = value;
    if (value == true) {
        // team activated
        document.getElementById("settings_section_team").style = "display:block"
        document.getElementById("score_1_panel").style = "display:block" // Le score de la seconde équipe s'affiche
        document.getElementById("change_team_letter_grid_button").style = "display:block" // Le bouton de changement d'équipe s'affiche
        
        // if (team_focus == "blue") { 
        //     document.getElementById("number_grid_placeolder_blue").style = "display:block";
        // }
        
    } else {

        document.getElementById("settings_section_team").style = "display:none"
        document.getElementById("score_1_panel").style = "display:none" // Le score de la seconde équipe ne s'affiche pas
        document.getElementById("change_team_letter_grid_button").style = "display:none" // Le bouton de changement d'équipe ne s'affiche pas

        document.getElementById("score_0_panel").className = "active_score" // Reinitialisation de l'ordre
        document.getElementById("score_1_panel").className = "score"
        team_focus = "yellow";

        document.getElementById("number_grid_placeolder_blue").style = "display:none";
    }
}

function UpdateNumberGridSettings(value) {
    number_grid_enabled = value;
    if (value == true) {
        // number grid activated
        document.getElementById("use_saving_ball_checkbox").disabled = false //checkbox saving ball inside settings
        
    } else {
        // number grid desactivated
        document.getElementById("use_saving_ball_checkbox").disabled = true //checkbox saving ball inside settings
    }
}