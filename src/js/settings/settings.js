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

function UpdateStyle(value) {
    document.getElementById("letter_grid_page").className = "page style_" + value;
}

function UpdateSettingsCheckbox(id, value) {
    
}