    
    // function called by "Jouer" buttons
    function initGame() {
        if (game_started == false) { // if game isn't started, create letter grid, pick word, etc...
            if (word_to_find_list.length == 0) {
               if (always_ask == true) {
                    WordListAddRowRandom(always_ask_length);
               } else {
                    var prompt_new_word = Number(window.prompt("Aucun mot n'est prédéfini dans les paramètres, veuillez entrer le nombre de lettres (compris entre 5 et 10) du prochain mot tiré au hasard:", "8"));
                    if (prompt_new_word >= 5 && prompt_new_word <= 10 ) {
                        WordListAddRowRandom(prompt_new_word);

                        game_started = true;
                        game_paused = false;

                        createLetterGrid();
                        wordInitialization();
                        lockNumberGridSettings();

                        if (automatic_behaviour == true && automatic_behaviour_line_start == true) { newWordLine(); }
                        if (use_number_grid == true) { changeNumberGrid(); } 
                        if (play_jingle == true) { playsound("jingle"); }
                        if (use_number_grid == false) { document.getElementById("number_grid_settings").style = "disaply:none" }

                        displayPage("letter_grid_page");
                    }
                }
            }
        } else {
            game_paused = false;
            displayPage("letter_grid_page");
        }
    }



        