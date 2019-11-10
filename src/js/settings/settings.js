// Tableau des mots à choisir

function WordListAddRow(word_list_selected_word) {
    var word_list_selected_word = word_list_selected_word.toUpperCase();
    var word_list_table = document.getElementById("word_list");
 
    var word_list_rowCount = word_list_table.rows.length;
    var word_list_row = word_list_table.insertRow(word_list_rowCount);
 
    word_list_row.insertCell(0).innerHTML= word_list_selected_word;
    word_list_row.insertCell(1).innerHTML= '<input type="button" value = "supprimer" onClick="Javacsript:WordListDeleteRow(this)">';

    document.getElementById('word_list_selected_word').value = "";

    // Ajout du mot dans la liste de mot à trouver
    word_to_find_list.push(word_list_selected_word);
}

function WordListAddRowRandom(letter_count) {
    var word_list_random_word_index = Math.floor(Math.random() * dictionary_list[letter_count-5].length);

    var word_list_random_word = dictionary_list[letter_count-5][word_list_random_word_index];

    WordListAddRow(word_list_random_word);
}
 
function WordListDeleteRow(obj) {
    var word_list_index = obj.parentNode.parentNode.rowIndex;
    var word_list_table = document.getElementById("word_list");
    word_list_table.deleteRow(word_list_index);
    
    // Suppresion du mot de la liste de mot à trouver
    word_to_find_list.splice(word_list_index-1, 1);
}

function WordListUpdateDropdown(value) {
    //si aucun choix du nombre de lettre, disparition des autres options sinon ...
    if (value == "" ) {
        
        document.getElementById("word_list_dropdown_first_letter").style = "display:none;";
        document.getElementById("word_list_button_random").style = "display:none;";
        document.getElementById("word_list_dropdown_word_selection").style = "display:none;";
    } else {
        document.getElementById("word_list_dropdown_first_letter").style = "display:inline-block;";
        document.getElementById("word_list_button_random").style = "display:inline-block;";
        var word_list_selected_dictionary = dictionary_list[value-5];

        document.getElementById("word_list_dropdown_word_selection").innerHTML = "<option value=\"\">choisir un mot</option>";

        for (i=0; i < word_list_selected_dictionary.length; i++) {  //affichage des mots qui commencent par la lettre choisie
            if (word_list_selected_dictionary[i].charAt(0) == word_list_dropdown_first_letter.value) {
                document.getElementById("word_list_dropdown_word_selection").innerHTML += "<option value=\"" + word_list_selected_dictionary[i] + "\">" + word_list_selected_dictionary[i] + "</option>";
            }
        }
    }

    // si aucune première lettre choisie, disparition du chois des mots
    if (word_list_dropdown_first_letter.value == "" ) {
        document.getElementById("word_list_dropdown_word_selection").style = "display:none;"
        document.getElementById("word_list_button_list").style = "display:none;"
    } else {
        document.getElementById("word_list_dropdown_word_selection").style = "display:inline-block;"
        document.getElementById("word_list_button_list").style = "display:inline-block;"
    }
}

function UpdateStyle(value) {
    document.getElementById("letter_grid_page").className = "page style_" + value;
}