    function initVariables() {
        timer = 250;
        game_started = false;
        game_paused = false;

        // SETTINGS
        display_animation = true;
        check_word = true;

        //GAME
        try_number_max = 6;
        lettre_plus_amount = 1;

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
    }

    function initGame() {
        if (game_started == false && game_paused == false) { // si le jeu commence mais n'est pas en pause > creation de la grille  

            if (word_to_find_list.length == 0) {
                console.log("aucun mot dans la liste");
                if (confirm("Vous n'avez pas selectionnez de mot dans les paramètres! Vous allez jouer avec 1 mot de 8 lettres")) {
                    WordListAddRowRandom(8);
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