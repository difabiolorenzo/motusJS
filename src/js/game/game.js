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
        if (word_to_find_list.length >= 1) {
            createLetterGrid();
            initialisationMot();
            nouvelleLigne();
        } else {
            console.log("plus de mot dans la liste, fin du jeu");
            if (confirm("Il n'y a plus de mot dans la liste de mot à deviner. Voulez-vous continuer? (Vous allez rejouer avec 1 mot de 8 lettres)")) {
                WordListAddRowRandom(8);
                createLetterGrid();
                initialisationMot();
                nouvelleLigne();
            } else {
                displayPage("main_menu");
            }
        }
    }