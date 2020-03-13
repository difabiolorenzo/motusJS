// animation 	animationIntervalID_1 animationAfficheSolution
// 			    animationIntervalID_2 animationLettreBonus
// 			    animationIntervalID_3 animationVerificationProposition
// 			    animationIntervalID_4 animationPickedBall
// 			    animationIntervalID_5 animationMOTUS
    
    function displayPage(page_name) {        
        document.getElementById("main_menu").style = "display:none;"
        document.getElementById("settings_page").style = "display:none;"
        document.getElementById("letter_grid_page").style = "display:none;"
        document.getElementById("number_grid_page").style = "display:none;"
        document.getElementById("debug_page").style = "display:none;"
        document.getElementById("credit_page").style = "display:none;"

        if (page_name != "letter_grid_page") {
            game_paused = true;
        } else {
            game_paused = false;
        }


        document.getElementById(page_name).style = "display:block;"
    }

    function reinitWord() {

        word_to_find_list.splice(0, 1);
        if (word_to_find_list.length > 0) {
            createLetterGrid();
            initialisationMot();
            nouvelleLigne();
        } else {
            console.log("Aucun mot dans la liste");

            var prompt_new_word;

            while (prompt_new_word < 5 || prompt_new_word > 10 || prompt_new_word == undefined) {
                prompt_new_word = Number(window.prompt("Plus aucun mot n'est prédéfini dans les paramètres, veuillez entrer le nombre de lettres (compris entre 5 et 10) du prochain mot tiré au hasard:", "8"));
                if (prompt_new_word >= 5 || prompt_new_word <= 10) {

                    WordListAddRowRandom(prompt_new_word);
                    createLetterGrid();
                    initialisationMot();
                    nouvelleLigne();
                }
            }
        }
    }

    function previewMode() {
        debug_index++;

        if (debug_index == 3) {
            document.getElementById("grid_page_menu_button").style = "display: block";
        } else if (debug_index == 4) {
            document.getElementById("debug_menu_button").style = "display: block";
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

    function wordInformation() {
        if (word_displayed == true || word_found == true) {
            if (confirm("Voulez-vous ouvrir une page wiktionary.org sur le mot " + word_to_find.toLowerCase() + "?")) {
                window.open("https://fr.wiktionary.org/w/index.php?search=" + word_to_find.toLowerCase(), "_blank");
            }
        } else {
            alert("Vous devez trouver le mot ou l'afficher pour pouvoir avoir des informations dessus.");
        }
        
    }

    function errorHandler(errorCode) {		// Affiche dans la console le terme de l'erreur
        if (errorCode == 1) {
            console.log("La longueur du word_to_find n'est pas la bonne.");
        } else if (errorCode == 2) {
            console.log("Mot non présent dans le dictionnaire");
        } else if (errorCode == 3) {
            console.log("Mot déjà proposé");
        }
        playsound("letter_missing");
        playsound("wrong");

        if (team_enabled == true) {
            switchTeamFocus();
        }

        nouvelleLigne();
    }