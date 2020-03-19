    // animation 	animationIntervalID_1 animationAfficheSolution
    // 			    animationIntervalID_2 animationLettreBonus
    // 			    animationIntervalID_3 animationVerificationProposition
    // 			    animationIntervalID_4 animationPickedBall
    // 			    animationIntervalID_5 animationMOTUS

    // Tableau des mots à choisir





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
                case "jingle":
                    $.playSound("src/sounds/jingle_motus.mp3");
                    break;
                default:
                    break;
            }
        }
    }

    function WordListAddRow(word_list_selected_word) {

        var word_list_selected_word = word_list_selected_word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
        var word_list_table = document.getElementById("word_list");

        var word_list_rowCount = word_list_table.rows.length;
        var word_list_row = word_list_table.insertRow(word_list_rowCount);

        word_list_row.insertCell(0).innerHTML = word_list_selected_word;
        word_list_row.insertCell(1).innerHTML = '<input type="button" value = "❌" onClick="Javascript:WordListDeleteRow(this)">';
        word_list_row.insertCell(2).innerHTML = '<input type="button" value = "Information sur ce mot" onClick="Javascript:SearchInformationOnWord(this)">';

        document.getElementById('word_list_selected_word').value = "";

        // Ajout du mot dans la liste de mot à trouver
        word_to_find_list.push(word_list_selected_word);
    }

    function WordListAddRowRandom(letter_count) {
        if (dictionary_list[letter_count - 5] != undefined) {
            var word_list_random_word_index = Math.floor(Math.random() * dictionary_list[letter_count - 5].length);

            var word_list_random_word = dictionary_list[letter_count - 5][word_list_random_word_index];

            WordListAddRow(word_list_random_word);
        }
    }

    function WordAddCustom() {
        wordInput = document.getElementById('word_list_selected_word').value
        if (wordInput.length >= 5 && wordInput.length <= 10 && regularCharExpression.test(wordInput) == true) {
            WordListAddRow(wordInput)
        }
    }

    function WordListDeleteRow(obj) {
        var word_list_index = obj.parentNode.parentNode.rowIndex;
        var word_list_table = document.getElementById("word_list");
        word_list_table.deleteRow(word_list_index);

        // Suppresion du mot de la liste de mot à trouver
        word_to_find_list.splice(word_list_index - 1, 1);
    }

    function SearchInformationOnWord(obj) {
        word_list_index = obj.parentNode.parentNode.rowIndex;
        console.log(word_to_find_list[word_list_index - 1])

        if (confirm("Voulez-vous ouvrir une page wiktionary.org sur le mot " + word_to_find_list[word_list_index - 1].toLowerCase() + "?")) {
            window.open("https://fr.wiktionary.org/w/index.php?search=" + word_to_find_list[word_list_index - 1].toLowerCase(), "_blank");
        }
    }

    function UpdateStyle(value) {
        document.getElementById("letter_grid_page").className = "page style_" + value;
        document.getElementById("number_grid_page").className = "page style_" + value;
        document.getElementById("main_menu").className = "page style_" + value;
        classNameDisplayWindow("display_page", ("page style_" + value))

        if (value == 2010 || value == 2019) {
            document.getElementById("logo").src = "src/img/motus_logo_2010.png"
        } else if (value == 2000) {
            document.getElementById("logo").src = "src/img/motus_logo_2000.png"
        } else if (value == 1990) {
            document.getElementById("logo").src = "src/img/motus_logo_1990.png"
        }
    }

    function UpdateAutomaticBehaviourSettings(value) {
        automatic_behaviour = value;
        if (value == true) {
            document.getElementById("check_automatic_behaviour_settings").style = "display:block"
        } else {
            document.getElementById("check_automatic_behaviour_settings").style = "display:none"
        }
    }

    function UpdateScoreSettings(value) {
        score_enabled = value;
        if (value == true) {
            document.getElementById("score_placeolder").style = "display:flex"
        }
    }

    function UpdateAlwaysAskSettings(value) {
        always_ask = value;
        if (value == true) {
            document.getElementById("always_ask_length_dropdown").style = "opacity: 100;"
        } else {
            document.getElementById("always_ask_length_dropdown").style = "height: 0; opacity: 0;"
        }
    }

    function UpdateSoundSettings(value) {
        playsound_enabled = value;
        if (value == true) {
            document.getElementById("play_jingle_settings").style = "opacity: 100;"
        } else {
            document.getElementById("play_jingle_settings").style = "height: 0; opacity: 0;"
        }
    }

    function UpdateTeamSettings(value) {
        team_enabled = value;
        if (value == true) {
            // team activated
            document.getElementById("settings_section_team").style = "opacity: 100;"
            document.getElementById("score_1_panel").style = "display:block" // Le score de la seconde équipe s'affiche
            document.getElementById("change_team_letter_grid_button").style = "display:block" // Le bouton de changement d'équipe s'affiche

            // if (team_focus == "blue") { 
            //     document.getElementById("number_grid_placeolder_blue").style = "display:block";
            // }

        } else {

            document.getElementById("settings_section_team").style = "height: 0; opacity: 0;"
            document.getElementById("score_1_panel").style = "display:none" // Le score de la seconde équipe ne s'affiche pas
            document.getElementById("change_team_letter_grid_button").style = "display:none" // Le bouton de changement d'équipe ne s'affiche pas

            document.getElementById("score_0_panel").className = "active_score" // Reinitialisation de l'ordre
            document.getElementById("score_1_panel").className = "score"
            team_focus = "yellow";

            document.getElementById("number_grid_placeolder_blue").style = "display:none";
        }
    }

    function UpdateNumberGridSettings(value) {
        number_grid_enabled = value;
        if (value == true) {
            // number grid activated
            document.getElementById("use_saving_ball_checkbox").disabled = false //checkbox saving ball inside settings

        } else {
            // number grid desactivated
            document.getElementById("use_saving_ball_checkbox").disabled = true //checkbox saving ball inside settings
        }
    }

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
        if (word_to_find_list.length > 0) {} else {
            if (always_ask == true) {
                WordListAddRowRandom(always_ask_length);
            } else {
                console.log("Aucun mot dans la liste");

                var prompt_new_word;
                while (prompt_new_word < 5 || prompt_new_word > 10 || prompt_new_word == undefined) {
                    prompt_new_word = Number(window.prompt("Plus aucun mot n'est prédéfini dans les paramètres, veuillez entrer le nombre de lettres (compris entre 5 et 10) du prochain mot tiré au hasard:", "8"));
                    if (prompt_new_word >= 5 || prompt_new_word <= 10) {
                        WordListAddRowRandom(prompt_new_word);
                    }
                }
            }
        }
        createLetterGrid();
        initialisationMot();
        nouvelleLigne();
    }

    function previewMode() {
        debug_index++;
        //debug
        // if (debug_index == 1) {
        //     UpdateStyle(2019);
        // } else if (debug_index == 2) {
        //     UpdateStyle(2000);
        // } else if (debug_index == 3) {
        //     document.getElementById("debug_menu_button").style = "display: block";
		// 	document.getElementById("number_grid_button").style = "display:block";
        //     godmod = true;
        //     UpdateStyle(1990);
        // } else if (debug_index == 4) {
        //     document.getElementById("debug_menu_button").style = "display: none";
		// 	document.getElementById("number_grid_button").style = "display: none";
        //     godmod = false;
        //     UpdateStyle(2010);
        //     debug_index = 0;
        // }
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

    function errorHandler(errorCode) { // Affiche dans la console le terme de l'erreur
        if (errorCode == 1) {
            console.log("La longueur du word_to_find n'est pas la bonne.");
        } else if (errorCode == 2) {
            console.log("Mot non présent dans le dictionnaire");
        } else if (errorCode == 3) {
            console.log("Mot déjà proposé");
        }
        playsound("letter_missing");
        playsound("wrong");

        if (team_enabled == true) { switchTeamFocus(); }
        setTimeout(function () { ligneRattrapage(); }, 3000);
    }

    function ligneRattrapage() {
        if (automatic_behaviour == true) {
            if (automatic_behaviour_new_line_error == "replace_bonus") {
                suppressionLigne();
                nouvelleLigne();
                ajoutLettreBonus();
            } else if (automatic_behaviour_new_line_error == "replace_only") {
                suppressionLigne();
                nouvelleLigne();
            } else if (automatic_behaviour_new_line_error == "add_bonus") {
                nouvelleLigne();
                ajoutLettreBonus();
            } else if (automatic_behaviour_new_line_error == "add_only") {
                nouvelleLigne();
            }
        }
    }

    function createDisplayWindow() {
        displayWindow = window.open("", "MotusJS - Display Window", "width=1080,height=720");
		writeInDisplayWindow("<title>MotusJS</title>");
		writeInDisplayWindow("<meta charset=\"utf-8\">");
		writeInDisplayWindow("<link rel=\"stylesheet\" type=\"text/css\" title=\"css\" href=\"src/css/global.css\">");
		writeInDisplayWindow("<link rel=\"stylesheet\" type=\"text/css\" title=\"css\" href=\"src/css/letter_grid.css\">");
		writeInDisplayWindow("<link rel=\"stylesheet\" type=\"text/css\" title=\"css\" href=\"src/css/number_grid.css\">");
		writeInDisplayWindow("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
		writeInDisplayWindow("<link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"src/img/favicon.png\">");
		writeInDisplayWindow("<script type=\"text/javascript\" src=\"./src/js/game/keyinput.js\"></script>");
        writeInDisplayWindow("<div id=\"display_page\" class=\"style_2010\"><div class=\"display_page\" id=\"letter_grid_placeolder\"></div></div>");
    }

    function writeInDisplayWindow(arg) {
        if (other_window_display == true) { displayWindow.document.write(arg); }
    }

    function innerHTMLDisplayWindow(id, html) {
        if (other_window_display == true) { displayWindow.document.getElementById(id).innerHTML = html; }
    }

    function classNameDisplayWindow(id, html, mode) {
        if (other_window_display == true) {
            if (mode == "+=") {
                displayWindow.document.getElementById(id).className += html;
            } else {
                displayWindow.document.getElementById(id).className = html;
            }
        }
    }