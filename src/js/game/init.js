    function initVariables() {
        timer = 225;
        game_started = false;
        game_paused = false;

        // SETTINGS
        display_animation = true;
        check_word = true;

        //GAME
        try_number_max = 6;
        lettre_plus_amount = 1;
        player_count = 1;
        word_found = undefined;
        word_displayed = false;
        dictionary_list = [dictionary_5, dictionary_6, dictionary_7, dictionary_8, dictionary_9, dictionary_10];

        word_to_find_list = [];

        //SOUND
        playsound_grille_creation = 'src/sounds/grille_creation.mp3';
        playsound_grille_numero = 'src/sounds/grille_numero.mp3';
        playsound_grille_boule_noire = 'src/sounds/grille_boule_noire.mp3';
        playsound_grille_numero_tire = 'src/sounds/grille_numero_tire.mp3';
        playsound_motus = 'src/sounds/motus.mp3';
    
        sound_volume = 1;
        
        playsound_grille_creation.volume = sound_volume;
        playsound_grille_numero.volume = sound_volume;
        playsound_grille_boule_noire.volume = sound_volume;
        playsound_grille_numero_tire.volume = sound_volume;
        playsound_motus.volume = sound_volume;
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
    }

    function initGame() {
        if (game_started == false && game_paused == false) { // si le jeu commence mais n'est pas en pause > creation de la grille  

            if (word_to_find_list.length == 0) {
                console.log("aucun mot dans la liste");
                if (confirm("Vous n'avez pas selectionnez de mot dans les paramètres! Vous allez jouer avec 1 mot de 8 lettres")) {
                    WordListAddRowRandom(8);
                }
            }
        
            keyboardInput = document.getElementById("word_proposition_input");

            createLetterGrid();
            initialisationMot();
            nouvelleLigne();
        }

        displayPage("letter_grid_page");
        game_started = true;
        game_paused = false;

    }