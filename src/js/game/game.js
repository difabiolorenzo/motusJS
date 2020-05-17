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

function editHTML(elementID, modifier, value) {
    switch (modifier) {
        case "innerHTML":
            document.getElementById(elementID).innerHTML = value;
            break;
        case "className":
            document.getElementById(elementID).className = value;
            break;
        case "style":
            document.getElementById(elementID).style = value;
            break;
        case "disabled":
            document.getElementById(elementID).disabled = value;
            break;
        case "disabled":
            document.getElementById(elementID).disabled = value;
            break;
    }
}

function UpdateStyle(value) {
    editHTML("letter_grid_page", "className", ("page style_" + value));
    editHTML("number_grid_page", "className", ("page style_" + value));
    editHTML("main_menu", "className", ("page style_" + value));

    var logo_img = document.getElementById("logo");

    if (value == 2010 ) {
        logo_img.src = "src/img/motus_logo_2010.png"
        logo_img.title = "Style des années 2010"
    } else if (value == 2019) {
        logo_img.src = "src/img/motus_logo_2010_black.png"
        logo_img.title = "Style de l'année 2019"
    } else if (value == 2000) {
        logo_img.src = "src/img/motus_logo_2000.png"
        logo_img.title = "Style des années 2000"
    } else if (value == 1990) {
        logo_img.src = "src/img/motus_logo_1990.png"
        logo_img.title = "Style des années 1990"
    }
}

function displayPage(page_name) {
    editHTML("main_menu", "style", "display:none;");
    editHTML("settings_page", "style", "display:none;");
    editHTML("letter_grid_page", "style", "display:none;");
    editHTML("number_grid_page", "style", "display:none;");
    editHTML("debug_page", "style", "display:none;");
    editHTML("credit_page", "style", "display:none;");
    editHTML("word_panel", "style", "display:none;");

    displayed_page = page_name;

    if (page_name != "letter_grid_page") {
        game_paused = true;
    } else {
        game_paused = false;
    }

    editHTML(page_name, "style", "display:block;");
}

function previewMode() {
    debug_index++;
    if (debug_index == 1) {
        UpdateStyle(2019);
    } else if (debug_index == 2) {
        UpdateStyle(2000);
    } else if (debug_index == 3) {
        editHTML("debug_menu_button", "style", "display: block");
        editHTML("number_grid_button", "style", "display: block");
        godmod = true;
        UpdateStyle(1990);
    } else if (debug_index == 4) {
        editHTML("debug_menu_button", "style", "display: none");
        editHTML("number_grid_button", "style", "display: none");
        godmod = false;
        UpdateStyle(2010);
        debug_index = 0;
    }
}

function addScoreTeamFocus() {
    if (gamemode == "finale") {
        word_found_count++;
        editHTML("word_found_count", "innerHTML", word_found_count)
    }

    if (gamemode == "normal") {
        if (team_focus == "yellow") {
            score_yellow += score_addition;
        } else {
            score_blue += score_addition;
        }
        editHTML("score_0_panel", "innerHTML", score_yellow);
        editHTML("score_1_panel", "innerHTML", score_blue);
    }
}

function switchTeamFocus() {
    if (team_enabled == true) {
        if (team_focus == "yellow") {
            team_focus = "blue"

            editHTML("score_0_panel", "className", "score");
            editHTML("score_1_panel", "className", "active_score");

            editHTML("number_grid_placeolder_blue", "style", "display:block");
            editHTML("number_grid_placeolder_yellow", "style", "display:none");
        } else {
            team_focus = "yellow"

            editHTML("score_0_panel", "className", "active_score");
            editHTML("score_1_panel", "className", "score");

            editHTML("number_grid_placeolder_yellow", "style", "display:block");
            editHTML("number_grid_placeolder_blue", "style", "display:none");
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

    editHTML("button_pick_number", "style", "display:block");	//affichage du bouton piocher
    editHTML("button_return_letter_grid", "style", "display:block");	//affichage du bouton piocher
    displayPage('number_grid_page');
}

function goLetterGrid() {
    if (word_found == true) { reinitWord(); }
    displayPage('letter_grid_page');
}

function timesUp() {
	playsound("temps_ecoule");
}

function startDico() {
    for (var i=0; i < dictionary_5.length; i++) {
        var word_list_selected_word = dictionary_5[i];

        var debug_word_list_table = document.getElementById("debug_word_list");
        var debug_word_list_rowCount = debug_word_list_table.rows.length;
        var debug_word_list = debug_word_list_table.insertRow(debug_word_list_rowCount);

        if (word_list_selected_word == dico_5_tri[0]) {
            var word_list_sorted_word = word_list_selected_word;
            dico_5_tri.shift();
        } else {
            var word_list_sorted_word = ""
        }

        debug_word_list.insertCell(0).innerHTML = '<input type="button" value = "❌" onClick="">';
        debug_word_list.insertCell(1).innerHTML = word_list_selected_word;
        debug_word_list.insertCell(2).innerHTML = '<input type="button" value = "➡" onClick="">';
        debug_word_list.insertCell(3).innerHTML = '<input type="button" value = "⬅" onClick="">';
        debug_word_list.insertCell(4).innerHTML = word_list_sorted_word;
    }
}

function DebugWordListDeleteRow(word) {
    var debug_word_list_index = word.parentNode.parentNode.rowIndex;
    var debug_word_list_table = document.getElementById("debug_word_list");
    debug_word_list_table.deleteRow(debug_word_list_index);
}

function returnMenu() {
    game_paused = true;
    displayPage("main_menu");
}

function returnGame() {
    game_paused = false;
    displayPage("letter_grid_page");
    setTimeout(function() { finalCountdown(); }, 1000);
}

function setFinalGamemode() {
    document.getElementById("letter_grid_page").className += " finale";
    editHTML("number_grid_button", "style", "display:none");
    editHTML("bonus_letter_button", "style", "display:none");
    editHTML("word_found_count", "innerHTML", "0");

    if (word_length == 5 || word_length == 6 ) {
        editHTML("finale_timer", "innerHTML", "4:00");
        finale_timer = 240;
    }
    if (word_length == 7 || word_length == 8 ) {
        editHTML("finale_timer", "innerHTML", "4:30");
        finale_timer = 270;
    }
    if (word_length == 9) {
        editHTML("finale_timer", "innerHTML", "4:30");
        finale_timer = 300;
    }
    if (word_length == 10) {
        editHTML("finale_timer", "innerHTML", "4:30");
        finale_timer = 330;
    }
    
    automatic_behaviour_new_line_error = "add_only"; //"replace_bonus" "replace_only" "add_bonus" "add_only" "none"
    always_ask = false;
    use_number_grid = false;

    setTimeout(function() { finalCountdown(); }, 1000);
}

function finalCountdown() {
    if (finale_timer > 0 && game_paused == false) {
        setTimeout(function() { finalCountdown(); }, 1000);
        finale_timer--;
        var finale_timer_seconds = Math.floor(finale_timer%60);
        var finale_timer_minutes = Math.floor(finale_timer/60);
        if (finale_timer_seconds >= 0 && finale_timer_seconds <= 9) {
            finale_timer_seconds = "0" + finale_timer_seconds;
        }
        editHTML("finale_timer", "innerHTML", finale_timer_minutes + ":" + finale_timer_seconds);
    }
    if (finale_timer == 0) {
        finale_timer--;
        timesUp();
        console.log(finale_timer);
    }
}