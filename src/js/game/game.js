    function displayPage(page_name) {        
        document.getElementById("main_menu").style = "display:none;"
        document.getElementById("settings_page").style = "display:none;"
        document.getElementById("letter_grid_page").style = "display:none;"
        document.getElementById("number_grid_page").style = "display:none;"
        document.getElementById("debug_page").style = "display:none;"
        document.getElementById("credit_page").style = "display:none;"

        document.getElementById(page_name).style = "display:block;"
    }

    function reinitWord() {
        word_to_find_list.splice(0, 1);
        if (word_to_find_list.length > 0) {
            createLetterGrid();
            initialisationMot();
            nouvelleLigne();
        } else {
            console.log("Aucun mot dans la liste");

            var prompt_new_word;

            while (prompt_new_word < 5 || prompt_new_word > 10 || prompt_new_word == undefined) {
                prompt_new_word = Number(window.prompt("Plus aucun mot n'est prédéfini dans les paramètres, veuillez entrez le nombre de lettres (compris entre 5 et 10) du prochain mot tiré au hasard:", "8"));
                if (prompt_new_word >= 5 || prompt_new_word <= 10) {
                    WordListAddRowRandom(prompt_new_word);
                    createLetterGrid();
                    initialisationMot();
                    nouvelleLigne();
                }
            }
        }
    }