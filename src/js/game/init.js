    function initVariables() {

        // SETTINGS
        display_animation = true;
        check_word_length = true;
        check_word_presence = true;
        check_word_duplication = true;
        check_word_first_letter = true;

        playsound_enabled = true;

        //GAME
        try_number_max = 6;
        lettre_plus_amount = 1;
        player_count = 1;
        word_found = undefined;
        word_displayed = false;
        dictionary_list = [dictionary_5, dictionary_6, dictionary_7, dictionary_8, dictionary_9, dictionary_10];

        word_to_find_list = [];
                
        keyboardInput = document.getElementById("word_proposition_input");

        timer = 225;
        game_started = false;
        game_paused = false;

        animationIntervalID_1 = undefined
        animationIntervalID_2 = undefined
        animationIntervalID_3 = undefined
        animationIntervalID_4 = undefined

        //SCORE
        score_addition = 50;
        
        score_yellow = 0;
        score_blue = 0;

        //TEAM
        team_enabled = false;
        change_turn_mode = "by_error"; // Change de main à chaque erreur ("by_error" || "by_proposition")
        team_focus = "yellow"; // L'équipe jaune à la main ("yellow" || "blue")

        // DEBUG
        debug_index = 0;
        version_name = "2.1 - Pre-release 5";
        version_id = "2.1-pre5"
        document.getElementById("version").innerHTML = version_name;
        regularCharExpression  = /^[a-z\u00C0-\u00ff]+$/;

        //NUMBERGRID
        number_grid_enabled = false;
        use_saving_ball = false;
    }



    //SOUND
    function playsound(sound) {
        if (playsound_enabled == true) {
            switch (sound) {
                case "letter_ok":
                    $.playSound("src/sounds/lettre_ok.mp3");
                    break;
                case "letter_bad":
                    $.playSound("src/sounds/lettre_mauvaise.mp3");
                    break;
                case "letter_missing":
                    $.playSound("src/sounds/lettre_absente.mp3");
                    break;
                case "letter_bonus":
                    $.playSound("src/sounds/lettre_bonus.mp3");
                    break;
                case "wrong":
                    $.playSound("src/sounds/erreur.mp3");
                    break;
                case "victory":
                    $.playSound("src/sounds/victory.mp3");
                    break;
                case "temps_ecoule":
                    $.playSound("src/sounds/temps_ecoule.mp3");
                    break;
                case "loose":
                    $.playSound("src/sounds/loose.mp3");
                    break;
                case "grille_creation":
                    $.playSound("src/sounds/grille_creation.mp3");
                    break;
                case "grille_numero":
                    $.playSound("src/sounds/grille_numero.mp3");
                    break;
                case "grille_boule_noire":
                    $.playSound("src/sounds/grille_boule_noire.mp3");
                    break;
                case "grille_numero_tire":
                    $.playSound("src/sounds/grille_numero_tire.mp3");
                    break;
                case "motus":
                    $.playSound("src/sounds/motus.mp3");
                    break;
                default:
                    break;
            }
        }
    }

    function initGame() {
        if (game_started == false && game_paused == false) { // si le jeu commence mais n'est pas en pause > creation de la grille  

            if (word_to_find_list.length == 0) {

                var prompt_new_word;

                while (prompt_new_word < 5 || prompt_new_word > 10 || prompt_new_word == undefined) {
                    prompt_new_word = Number(window.prompt("Aucun mot n'est prédéfini dans les paramètres, veuillez entrer le nombre de lettres (compris entre 5 et 10) du prochain mot tiré au hasard:", "8"));
                    if (prompt_new_word >= 5 || prompt_new_word <= 10) {
                        WordListAddRowRandom(prompt_new_word);
                    }
                }
            }        

            createLetterGrid();
            initialisationMot();
            nouvelleLigne();

           
        }

        displayPage("letter_grid_page");
        game_started = true;
        game_paused = false;

    }