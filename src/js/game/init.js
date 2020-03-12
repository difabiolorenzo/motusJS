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
        animationIntervalID_5 = undefined

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
        version_name = "2.2 - Pre-release 1"; document.getElementById("version").innerHTML = version_name;
        regularCharExpression  = /^[a-zA-Z\u00C0-\u00ff]+$/;
        godmod = false

        //NUMBERGRID
        number_grid_enabled = true;
        use_saving_ball = true;

        black_ball_amount = 3;

        sort_mode = "random"; // soit "random" ou "input"
        grid_index = -1;
        grid_j_index = 0;
        grid_i_index = 0;
        team_color_grid = [];

        motus_engaged = false;	//il n'existe qu'un seul MOTUS par grille

        yellow_grid_raw = [];
        blue_grid_raw = [];
        hided_number_spot = [];

        motus_animation_index = 0;
        picked_ball_animation = 0;
        
        yellow_purgatory = document.getElementById("yellow_purgatory");
        blue_purgatory = document.getElementById("blue_purgatory");

        yellow_saving_ball = undefined;
        blue_saving_ball = undefined;
        yellow_saving_ball_picked = false;
        blue_saving_ball_picked = false;
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
                case "boule_magique":
                    $.playSound("src/sounds/boule_magique.mp3");
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

            if (number_grid_enabled == true) {
                numberDisplay();
            }

           
        }

        displayPage("letter_grid_page");
        game_started = true;
        game_paused = false;

    }