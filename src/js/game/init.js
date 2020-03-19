    function initGame() {
        if (game_started == false) { // si le jeu commence mais n'est pas en pause > creation de la grille  

            if (word_to_find_list.length == 0) {

               if (always_ask == true) {
                    WordListAddRowRandom(always_ask_length);
               } else {
                    var prompt_new_word;
                    while (prompt_new_word < 5 || prompt_new_word > 10 || prompt_new_word == undefined) {
                        prompt_new_word = Number(window.prompt("Aucun mot n'est prédéfini dans les paramètres, veuillez entrer le nombre de lettres (compris entre 5 et 10) du prochain mot tiré au hasard:", "8"));
                        if (prompt_new_word >= 5 || prompt_new_word <= 10) {
                            WordListAddRowRandom(prompt_new_word);
                        }
                    }
                }
            }        
            createLetterGrid();
            initialisationMot();
            if (other_window_display == false && automatic_behaviour == true && automatic_behaviour_line_start == true) {
                nouvelleLigne();
            }

            if (number_grid_enabled == true) {
                changeGrid();
            }

        }

        displayPage("letter_grid_page");
        if (game_started == false) {
            if (play_jingle == true) { playsound("jingle"); }
            game_started = true;
        }
        game_paused = false;
    }



        