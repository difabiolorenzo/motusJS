    // animation 	animationIntervalID_1 animationAfficheSolution
    // 			    animationIntervalID_2 animationLettreBonus
    // 			    animationIntervalID_3 animationVerificationProposition
    // 			    animationIntervalID_4 animationPickedBall
    // 			    animationIntervalID_5 animationMOTUS

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
                case "error":
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
                case "jingle":
                    $.playSound("src/sounds/jingle_motus.mp3");
                    break;
                default:
                    break;
            }
        }
    }

    function UpdateStyle(value) {
        document.getElementById("letter_grid_page").className = "page style_" + value;
        document.getElementById("number_grid_page").className = "page style_" + value;
        document.getElementById("main_menu").className = "page style_" + value;

        var logo_img = document.getElementById("logo");

        if (value == 2010 ) {
            logo_img.src = "src/img/motus_logo_2010.png"
        } else if (value == 2019) {
            logo_img.src = "src/img/motus_logo_2010_black.png"
        } else if (value == 2000) {
            logo_img.src = "src/img/motus_logo_2000.png"
        } else if (value == 1990) {
            logo_img.src = "src/img/motus_logo_1990.png"
        }
    }

    function displayPage(page_name) {
        document.getElementById("main_menu").style = "display:none;"
        document.getElementById("settings_page").style = "display:none;"
        document.getElementById("letter_grid_page").style = "display:none;"
        document.getElementById("number_grid_page").style = "display:none;"
        document.getElementById("debug_page").style = "display:none;"
        document.getElementById("credit_page").style = "display:none;"

        displayed_page = page_name;

        if (page_name != "letter_grid_page") {
            game_paused = true;
        } else {
            game_paused = false;
        }


        document.getElementById(page_name).style = "display:block;"
    }

    function previewMode() {
        debug_index++;
        if (debug_index == 1) {
            UpdateStyle(2019);
        } else if (debug_index == 2) {
            UpdateStyle(2000);
        } else if (debug_index == 3) {
            document.getElementById("debug_menu_button").style = "display: block";
			document.getElementById("number_grid_button").style = "display:block";
            godmod = true;
            UpdateStyle(1990);
        } else if (debug_index == 4) {
            document.getElementById("debug_menu_button").style = "display: none";
			document.getElementById("number_grid_button").style = "display: none";
            godmod = false;
            UpdateStyle(2010);
            debug_index = 0;
        }
    }

    function addScoreTeamFocus() {
        if (team_focus == "yellow") {
            score_yellow += score_addition;
        } else {
            score_blue += score_addition;
        }

        document.getElementById("score_0_panel").innerHTML = score_yellow;
        document.getElementById("score_1_panel").innerHTML = score_blue;
    }

    function switchTeamFocus() {
        if (team_enabled == true) {
            if (team_focus == "yellow") {
                team_focus = "blue"

                document.getElementById("score_0_panel").className = "score"
                document.getElementById("score_1_panel").className = "active_score"

                document.getElementById("number_grid_placeolder_blue").style = "display:block";
                document.getElementById("number_grid_placeolder_yellow").style = "display:none";
            } else {
                team_focus = "yellow"

                document.getElementById("score_0_panel").className = "active_score"
                document.getElementById("score_1_panel").className = "score"

                document.getElementById("number_grid_placeolder_yellow").style = "display:block";
                document.getElementById("number_grid_placeolder_blue").style = "display:none";
            }
            console.log("L'équipe " + team_focus + " a maintenant la main.");
        } else {
            console.log("Vous pouvez activer la fonction équipe dans le paramètres");
        }
    }

    function wordFoundInformation() {
        if (word_displayed == true || word_found == true) {
            wordInformation(word_to_find);
        } else {
            alert("Vous devez trouver le mot ou l'afficher pour pouvoir avoir des informations dessus.");
        }
    }

    function wordInformation(word) {
        if (confirm("Voulez-vous ouvrir une page wiktionary.org sur le mot " + word.toLowerCase() + "?")) {
            window.open("https://fr.wiktionary.org/w/index.php?search=" + word.toLowerCase(), "_blank");
        }
    }

    function errorHandler(errorCode, catching_up) { // Affiche dans la console le terme de l'erreur
        if (errorCode == 1) {
            console.log("La longueur du word_to_find n'est pas la bonne.");
        } else if (errorCode == 2) {
            console.log("Mot non présent dans le dictionnaire");
        } else if (errorCode == 3) {
            console.log("Mot déjà proposé");
        } else if (errorCode == 4) {
            console.log("Mot déjà affiché");
        } else if (errorCode == 5) {
            console.log("Boule non valide");
        }
        playsound("error");

        if (catching_up == true) {
            if (team_enabled == true) { switchTeamFocus(); }
            setTimeout(function () { retryLine(); }, 3000);
            playsound("wrong");
        }
    }

    function retryLine() {
        if (automatic_behaviour == true) {
            if (automatic_behaviour_new_line_error == "replace_bonus") {
                suppressionLigne();
                newWordLine();
                ajoutLettreBonus();
            } else if (automatic_behaviour_new_line_error == "replace_only") {
                suppressionLigne();
                newWordLine();
            } else if (automatic_behaviour_new_line_error == "add_bonus") {
                newWordLine();
                ajoutLettreBonus();
            } else if (automatic_behaviour_new_line_error == "add_only") {
                newWordLine();
            }
        }
    }    

	function goNumberPicking() {
		try_picking_ball_left = try_picking_ball;

		document.getElementById("button_pick_number").style = "display:block";	//affichage du bouton piocher
		document.getElementById("button_return_letter_grid").style = "display:block";	//affichage du bouton piocher
		displayPage('number_grid_page');
    }
    
	function goLetterGrid() {
        if (word_found == true) {
            reinitWord();
        }
        displayPage('letter_grid_page');
	}