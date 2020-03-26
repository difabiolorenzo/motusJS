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

            if (use_number_grid == true) {
                changeNumberGrid();
            }

        }

        displayPage("letter_grid_page");
        if (game_started == false) {
            game_started = true;
            if (play_jingle == true) { playsound("jingle"); }
            if (use_number_grid == false) { document.getElementById("number_grid_settings").style = "disaply:none" }

            //lock number_grid settings
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
        game_paused = false;
    }



        