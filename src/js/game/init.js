    function initVariables() {

        // SETTINGS
        display_animation = true;
        check_word_length = true;
        check_word_presence = true;
        check_word_duplication = true;
        check_word_first_letter = true;

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

        // DEBUG
        debug_index = 0;
        version_name = "2.0.3 - Pre-release 6";
        document.getElementById("version").innerHTML = version_name;
    }



    //SOUND
    function playsound(sound) {
        if (sound == "letter_ok") {
            $.playSound("src/sounds/lettre_ok.mp3")
        }
        if (sound == "letter_bad") {
            $.playSound("src/sounds/lettre_mauvaise.mp3")
        }
        if (sound == "letter_missing") {
            $.playSound("src/sounds/lettre_absente.mp3")
        }
        if (sound == "letter_bonus") {
            $.playSound("src/sounds/lettre_bonus.mp3")
        }
        if (sound == "wrong") {
            $.playSound("src/sounds/erreur.mp3")
        }
        if (sound == "victory") {
            $.playSound("src/sounds/victory.mp3")
        }
        if (sound == "temps_ecoule") {
            $.playSound("src/sounds/temps_ecoule.mp3")
        }
        if (sound == "loose") {
            $.playSound("src/sounds/loose.mp3")
        }
        if (sound == "grille_creation") {
            $.playSound("src/sounds/grille_creation.mp3")
        }
        if (sound == "grille_numero") {
            $.playSound("src/sounds/grille_numero.mp3")
        }
        if (sound == "grille_boule_noire") {
            $.playSound("src/sounds/grille_boule_noire.mp3")
        }
        if (sound == "grille_numero_tire") {
            $.playSound("src/sounds/grille_numero_tire.mp3")
        }
        if (sound == "motus") {
            $.playSound("src/sounds/motus.mp3")
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