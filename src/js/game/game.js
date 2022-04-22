

//SOUND
function playsound(sound) {
    if (settings.playsound_enabled == true) {
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

function preloadsound(sound_file) {
    var sound_html = '<audio class="sound_player" autoplay="autoplay" style="display:none;">'
        + '<source src="' + sound_file + '" />'
        + '<embed src="' + sound_file + '" hidden="true" autostart="true" loop="false"/>'
        + '</audio>';
console.log(sound_html)
    document.body.appendChild(sound_html)
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
    editHTML("debug_page", "style", "display:none;");
    editHTML("credit_page", "style", "display:none;");

    global.displayed_page = page_name;

    if (page_name != "letter_grid_page") {
        game_paused = true;
    } else {
        game_paused = false;
    }

    editHTML(page_name, "style", "display:block;");
}

function createGrid(placeolder_id, row, column, cell_id_prefix, id) {
    var grid_placeolder = document.getElementById(placeolder_id);

	grid_placeolder_inner = "<table id='" + id + "' class='grid'>";
    for (var j = 0; j <= row-1; j++) {
		grid_placeolder_inner += "<tr id='" + cell_id_prefix + "_line_" + j + "'>";
		for (var i = 0; i < column; i++) {
			grid_placeolder_inner += "<td id=" + cell_id_prefix + "_" + j + "_" + i + " class=\"background\"></td>";
		}
		grid_placeolder_inner += "</tr>";
	}
	grid_placeolder.innerHTML = grid_placeolder_inner + "</table>";
}

function addScoreTeamFocus() {
    if (global.gamemode == "normal") {
        if (game.team_focus == "yellow") {
            game.score_yellow += game.score_addition;
        } else {
            game.score_blue += game.score_addition;
        }
        editHTML("score_0_panel", "innerHTML", game.score_yellow);
        editHTML("score_1_panel", "innerHTML", game.score_blue);
    }
}

function switchTeamFocus() {
    if (game.team_enabled == true) {
        if (game.team_focus == "yellow") {
            game.team_focus = "blue"
        } else {
            game.team_focus = "yellow"
        }
        document.getElementById("score_0_panel").classList.toggle("active_score");
        document.getElementById("score_1_panel").classList.toggle("active_score");
        console.log("L'équipe " + game.team_focus + " a maintenant la main.");
    } else {
        console.log("Vous pouvez activer la fonction équipe dans le paramètres");
    }
}

function wordFoundInformation() {
    if (game.word_displayed == true || game.word_displayed == true) {
        wordInformation(game.word_to_find);
    } else {
        alert("Vous devez trouver le mot ou l'afficher pour pouvoir avoir des informations dessus.");
    }
}

function wordInformation(word_to_search) {
    if (confirm("Voulez-vous ouvrir une page wiktionary.org sur le mot " + word_to_search.toLowerCase() + "?")) {
        window.open("https://fr.wiktionary.org/w/index.php?search=" + word_to_search.toLowerCase(), "_blank");
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
        if (game.team_enabled == true) { switchTeamFocus(); }
        setTimeout(function () { retryLine(); }, 3000);
        playsound("wrong");
    }
}

function goLetterGrid() {
    if (game.word_displayed == true) { wordReinit(); }
    displayPage('letter_grid_page');
}

function timesUp() {
	playsound("temps_ecoule");
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
}

function switchGridType() {
    if (global.use_number_grid == true) {
        if (global.game_panel_displayed == "letter") {
            hideLetterGrid()
        } else {
            hideNumberGrid()
        }

        function hideLetterGrid() {
            global.game_panel_displayed = "number"
            document.getElementById("table_letter").classList.toggle("changing_grid")
            document.getElementById("letter_grid_page").classList.toggle("hided_keyboard");
            document.getElementById("letter_grid_page").classList.toggle("visible_keyboard");
            setTimeout(function() {
                createNumberGrid()
                document.getElementById("table_letter").style.display = "none";
                global.displayed_grid_type = "number_grid";
            }, 250)
        }

        function hideNumberGrid() {
            global.game_panel_displayed = "letter"
            document.getElementById("number_grid").classList.toggle("changing_grid");
            wordReinit();
            setTimeout(function() {
                document.getElementById("number_grid").style.display = "none";
                document.getElementById("letter_grid_page").classList.toggle("hided_keyboard");
                document.getElementById("letter_grid_page").classList.toggle("visible_keyboard");
                global.displayed_grid_type = "letter_grid";
            }, 250)
        }
    }    
}