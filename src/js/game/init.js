    function initVariables() {
        timer = 300;
        game_started = false;
        game_paused = false;

        // SETTINGS
        display_animation = true;

        //GAME
        try_number_max = 6;
        lettre_plus_amount = 1;

        word_to_find_list = [];

        //SOUND
        playsound_letter_ok = new Audio('src/sound/lettre_ok.mp3');
        playsound_letter_bad = new Audio('src/sound/lettre_mauvaise.mp3');
        playsound_letter_missing = new Audio('src/sound/lettre_absente.mp3');
        playsound_letter_bonus = new Audio('src/sound/lettre_bonus.mp3');
        playsound_wrong = new Audio('src/sound/erreur.mp3');
        playsound_victory = new Audio('src/sound/victory.mp3');
        playsound_temps_ecoule = new Audio('src/sound/temps_ecoule.mp3');
        
        playsound_grille_creation = new Audio('src/sound/grille_creation.mp3');
        playsound_grille_numero = new Audio('src/sound/grille_numero.mp3');
        playsound_grille_boule_noire = new Audio('src/sound/grille_boule_noire.mp3');
        playsound_grille_numero_tire = new Audio('src/sound/grille_numero_tire.mp3');
        playsound_motus = new Audio('src/sound/motus.mp3');
    
        sound_volume = 1;
    
        playsound_letter_ok.volume = sound_volume;
        playsound_letter_bad.volume = sound_volume;
        playsound_letter_missing.volume = sound_volume;
        playsound_letter_bonus.volume = sound_volume;
        playsound_wrong.volume = sound_volume;
        playsound_victory.volume = sound_volume;
        playsound_temps_ecoule.volume = sound_volume;
        
        playsound_grille_creation.volume = sound_volume;
        playsound_grille_numero.volume = sound_volume;
        playsound_grille_boule_noire.volume = sound_volume;
        playsound_grille_numero_tire.volume = sound_volume;
        playsound_motus.volume = sound_volume;
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