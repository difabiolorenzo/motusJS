function initLetterGrid() {
	function proceed() {
        wordInit();
		changeLetterGrid();
		game.state.letter_grid_created = true;
		displayLetterGrid()	
    }

    if (game.word_to_find_list.length == 0) {
        if (settings.always_ask == false) {
			wordListAddRowRandom(settings.always_ask_length).then((added) => {
                if (added) { proceed(); } else { abortGameStart(); }
            });
            return;
        }
        
        // Longueur choisie dans la page (fenêtre #word_length_dialog)
        displayPage("game_page");
        askNextWordLength()
            .then((word_length) => wordListAddRowRandom(word_length))
            .then((added) => {
                if (added) { proceed(); } else { abortGameStart(); }
            });
        return;
    }

    proceed();
}

// Demande la longueur du prochain mot (5 à 10) dans une fenêtre de la page.
// Pas d'annulation possible : la partie a besoin d'un mot. La promesse se résout au choix.
function askNextWordLength() {
	return new Promise((resolve) => {
		const dialog = document.getElementById("word_length_dialog");
		game.word_length_choice = (word_length) => {
			game.word_length_choice = undefined;
			dialog.close();
			resolve(word_length);
		};
		dialog.showModal();
		// Focus sur la longueur habituelle
		const default_button = dialog.querySelectorAll(".word_length_choices button")[settings.always_ask_length - 5];
		if (default_button) { default_button.focus(); }
		announce("Choisissez le nombre de lettres du prochain mot, de 5 à 10.");
	});
}

function chooseNextWordLength(word_length) {
	if (game.word_length_choice) {
		game.word_length_choice(Number(word_length));
	}
}

// Aucun mot n'a pu être tiré (dictionnaire introuvable) : retour au menu, « Jouer » permet de réessayer
function abortGameStart() {
	console.error("Partie annulée : aucun mot à trouver.");
	resetGame();
}

function wordReinit() {
	if (game.focus_on != "letter") {
		playsound("error");
		return;
	}

	// Mot abandonné sans être trouvé ni affiché : noté « passé » dans l'historique
	if (game.word_found != true && game.word_displayed != true) { recordWordResult("passé"); }
	game.word_to_find_list.splice(0, 1);
	if (game.word_to_find_list.length == 0) {
		if (settings.always_ask == false) {
			wordListAddRowRandom(settings.always_ask_length).then((added) => {
				if (added) { proceed() }
			});
		} else {
			// Longueur choisie dans la page (fenêtre #word_length_dialog)
			askNextWordLength()
				.then((word_length) => wordListAddRowRandom(word_length))
				.then((added) => {
					if (added) { proceed() }
				});
		}
	} else {
		proceed()
	}

	function proceed() {
		wordInit();
		changeLetterGrid();
	}
}

function createLetterGrid(hided) {
	document.getElementById("letter_grid_placeolder").innerHTML = createHTMLGrid(game.try_number_max, game.word_length, "letter", "letter_grid", hided)
	
	game.try_count_index = 0;
	game.word_length = game.word_to_find_list[0].length;

	newWordLine();
	placeFirstLetter();
	placeHelpingLetter();

	resetTypingIndicator();
}

function changeLetterGrid() {
	createLetterGrid();

	// if (document.getElementById("letter_grid") == null) {
	// 	createLetterGrid(true);
	// } else {
	// 	setTimeout(function() {
	// 		createLetterGrid()
	// 	}, 250);
	// }
}

function wordInit() {
	game.try_count_index = 0;
	game.verification_index = 0;
	game.word_displayed = false;
	game.word_found = false;
	game.word_proposed = "";
	game.word_proposed_modified = "";
	game.word_proposed_list = [];
	game.already_proposed = false;
	game.keyboard_cursor_position = {x: 0, y: 0}
	game.word_recorded = false;
	game.number_grid_unlocked = false;
	clearUndo();
	
	if (game.word_to_find_list.length == 0) {
		console.error("Aucun mot trouvé dans la liste")
		return;
	}

	game.word_to_find = game.word_to_find_list[0];
	game.word_length = game.word_to_find_list[0].length;

	breakdownWord();

	console.log('Mot à trouver: ' + '%c' + game.word_to_find, 'background: black; color: gold'); // Affichage du word_to_find tiré dans la console
	announce(`Nouveau mot de ${game.word_length} lettres, commençant par ${game.word_to_find[0]}.`);
	
	// console.log(game.word_to_find_details);
	// console.log('Nombre de lettres composant le mot: ' + '%c' + game.word_length, 'background: black; color: gold');

	// Initialisation du dictionnaire de mot à utliser
	// game.dictionnaire_verification = [];
	// if (settings.check_word_first_letter == true) {
	// 	game.dictionnaire_verification.concat(game.dictionnaire_verification.length_8.filter((mot => mot[0] == game.word_to_find[0])))
	// }
}

function breakdownWord() {
	// Mise dans le tableau word_composed_letter le word_to_find
	// word_composed_letter convertit "ELEVE" en "ELV"

	game.word_to_find_details = [];
	game.letter_placement_status = [];

	const word_to_find = game.word_to_find;
	let details = []

	for (let i=0; i<word_to_find.length; i++) {
		const checked_letter = word_to_find[i];
		let object_ckecked = details.find(object => object.letter === checked_letter)

		if (object_ckecked) {
			// Si l'objet existe alors on ajoute 1 au count
			object_ckecked.count += 1;
		} else {
			// AJout d'un objet avec la nouvelle lettre
			details.push({letter: checked_letter, count: 1})
		}

		// Sauvegarde des placements corrects
		game.letter_placement_status = Array(game.word_length).fill("missing")
	}

	game.word_to_find_details = details;
}

function newWordLine() {
	// Ajoute une nouvelle ligne avec les bonnes lettres proposées
	if (game.word_displayed == true) {
		console.log("Mot déjà affiché");
		return;
	}

	// Affichage
	if (game.try_count_index < game.try_number_max) {
		for (var i = 0; i < game.word_length; i++) {
			document.getElementById(`letter_${game.try_count_index}_${i}`).innerHTML = ".";

			if (game.letter_placement_status[i] == "correct") {
				document.getElementById(`letter_${game.try_count_index}_${i}`).innerHTML = game.word_to_find[i];
			}
		}
		game.word_proposed = "";
	}

	// Trop de tentatives
	if (game.try_count_index == game.try_number_max) {
		if (game.word_proposed_modified.length == game.word_length) {
			playsound("wrong");
			setTimeout(function() { displaySolution(); }, 1750);
		} else {
			displaySolution();
			game.word_displayed = true;
		}
		return;
	}
	game.try_count_index++;

	// Mise à jour du curseur
	updateCursorVoidPlacement();

	// Indicateur de frappe
	game.word_proposed_modified = ""
	resetTypingIndicator()

	// Compte à rebours de la nouvelle proposition
	startProposalTimer()
}

function removeWordLine() {		// Supprime la ligne
	if (game.try_count_index >= 1
		&& game.try_number_max 
		&& game.word_displayed == false
	){
		for (var i=0; i < game.word_length; i++) {
			document.getElementById(`letter_${game.try_count_index-1}_${i}`).innerHTML = "";
			document.getElementById(`letter_${game.try_count_index-1}_${i}`).className = "cellNEW";
		}

		game.try_count_index--;
		if (game.try_count_index == 0) { newWordLine(); }
	}

	// Mise à jour du curseur
	updateCursorVoidPlacement();
}

function reinitWordLine() {
	const need_new_line = game.try_count_index;

	removeWordLine();
	// Renouvellement automatique de la ligne si en dessous de 1
	if (need_new_line > 1) {
		newWordLine();
	}

	// Mise à jour du curseur
	updateCursorVoidPlacement();
}

function retryLine() {
    if (settings.automatic_behaviour == true) {
		var automatic_behaviour = settings.automatic_behaviour_new_line_error
		if (settings.team_enabled) {automatic_behaviour = settings.automatic_behaviour_new_line_team_error}
		
        switch (automatic_behaviour) {
            case "replace_bonus": 
				reinitWordLine();
                addBonusLetter();
				updateCursorVoidPlacement();
				updateCursor();
            	break;
            case "replace_only": 
				reinitWordLine();
				updateCursorVoidPlacement();
				updateCursor();
            	break;
            case "add_bonus": 
                newWordLine();
                addBonusLetter();
				updateCursorVoidPlacement();
				updateCursor();
            	break;
            case "add_only": 
                newWordLine();
				updateCursorVoidPlacement();
				updateCursor();
            	break;
            case "shift_bonus": 
				shiftGridLineUp();
                newWordLine();
                addBonusLetter();
				updateCursorVoidPlacement();
				updateCursor();
            	break;
            case "shift_only":
				shiftGridLineUp();
                newWordLine();
				updateCursorVoidPlacement();
				updateCursor();
            	break;
        }
    }
}

function resetTypingIndicator() {
	const indicator = document.getElementById("word_typing_indicator");
	const placement = game.letter_placement_status;
	let pending = ""
	game.word_proposed_modified = "";

	// Affichage des bonnes positions déjà en place
	for(let i=0; i<game.word_length; i++) {
		if (placement[i] == "correct") {
			pending += game.word_to_find[i];
		} else {
			pending += ".";
		}
	}

	indicator.innerText = pending + ".".repeat(game.word_length - pending.length);
}

function updateTypingIndicator() {
	// Affichage du mot proposé et des lettres déjà placées correctement

	const indicator = document.getElementById("word_typing_indicator");
	let pending = ""
	game.word_proposed_modified = game.word_proposed;

	for(let i=game.word_proposed_modified.length; i<game.word_length; i++) {
		if (game.letter_placement_status[i] == "correct") {
			game.word_proposed_modified += game.word_to_find[i];
		} else {
			break;
		}
	}

	indicator.innerText = game.word_proposed_modified + ".".repeat(game.word_length - game.word_proposed_modified.length);
}

function shiftGridLineUp() {
	if (game.try_count_index>0) {
		for (let i=1; i<game.try_count_index; i++) {
			for (let j=0; j<game.word_length; j++) {
				// Copie du contenu
				document.getElementById(`letter_${i-1}_${j}`).className = document.getElementById(`letter_${i}_${j}`).className;
				// Copie du style
				document.getElementById(`letter_${i-1}_${j}`).innerHTML = document.getElementById(`letter_${i}_${j}`).innerHTML;
			
				// Nouvelle ligne
				if (i==game.try_count_index-1) {
					document.getElementById(`letter_${i}_${j}`).innerHTML = "";
					document.getElementById(`letter_${i}_${j}`).className = "cellNEW"
				}
			}
		}
		game.try_count_index--;
	}
}

function updateCursorVoidPlacement() {
	game.word_proposed = "";
	if (settings.keyboard_start_typing_in_void) {
		for (let i=0; i<game.letter_placement_status.indexOf("missing"); i++) {
			game.word_proposed += game.word_to_find[i]
		}
	}

	// Mise à jour
	updateCursor();
}

function updateCursor() {
	if (!settings.keyboard_show_cursor) {
		return;
	}

	// Suppression curseur
	removeCursor()

	// Mise à jour position curseur
	let x = game.word_proposed.length;
	if (x > game.word_proposed.length - 1 && x > 1) {
		x = game.word_proposed.length - 1;
	}
	let y = game.try_count_index-1;

	document.getElementById(`letter_${y}_${x}`).classList.add("cursor");
	debugLog(`letter_${y}_${x}`)

	game.keyboard_cursor_position = {x:x, y:y}
}

function removeCursor() {
	if (!settings.keyboard_show_cursor) {
		return;
	}
	
	// Suppression curseur
	let x = game.keyboard_cursor_position.x;
	let y = game.keyboard_cursor_position.y;
	document.getElementById(`letter_${y}_${x}`).classList.remove("cursor");
}

function placeFirstLetter() {
	document.getElementById("letter_" + (game.try_count_index-1) + '_0').innerHTML = game.word_to_find[0];
	game.letter_placement_status[0] = "correct";
}

function placeHelpingLetter() {
	// Lettres ajoutée au premier affichage
	if (settings.helping_letter_amount > 0) {

		let posibility_placement = [];
		for (let i = 2; i < game.word_length; i++) {
			posibility_placement.push(i);
		}

		for (let i=0; i<settings.helping_letter_amount; i++) {
			let random_placement = Math.floor(Math.random() * posibility_placement.length);
			let helping_placement = posibility_placement[random_placement];

			document.getElementById(`letter_${game.try_count_index-1}_${helping_placement}`).innerHTML = game.word_to_find[helping_placement];
			game.letter_placement_status[helping_placement] = "correct";
			posibility_placement.splice(random_placement, 1);
		}
	}
}

function addBonusLetter() {
	if (game.word_displayed == false
		&& game.word_found == false
		&& game.try_count_index <= game.try_number_max) {

		let letter_left = game.letter_placement_status.filter(status => status === "missing").length;
		markGameBusy(900);
		
		if (letter_left <= 1 && settings.playsound_enabled && settings.play_extra_sounds) {
			// Pas assez de lettre à trouver
			// playsound("error");
			return;
		}

		// A changer, garder si erreur sans equipe, enlever si passage de main
		reinitWordLine() 
		var index = game.letter_placement_status.indexOf("missing");
		
		document.getElementById(`letter_${game.try_count_index-1}_${index}`).innerHTML = game.word_to_find[index];
		document.getElementById(`letter_${game.try_count_index-1}_${index}`).classList.add("bonus_letter");
		game.letter_placement_status[index] = "correct";
		announce(`Lettre bonus : ${game.word_to_find[index]} en position ${index + 1}.`);

		setTimeout(function() {
			document.getElementById(`letter_${game.try_count_index-1}_${index}`).classList.remove("bonus_letter");
		}, 800);

		playsound("letter_bonus");

		// Mise à jour du curseur
		updateCursorVoidPlacement();

		// Mise a jour de l'indicateur de frappe
		resetTypingIndicator()
	} else {
		if (settings.playsound_enabled && settings.play_extra_sounds) {
			playsound("error");
		}
	}
}

function displaySolution() {
// Affiche la solution
	if (game.focus_on == "number") { return; }
	if (game.word_displayed == true) {
		console.log("Mot déjà affiché")
		return;
	}

	announce(`Solution : ${game.word_to_find}.`);
	markGameBusy((game.word_length + 1) * Math.floor((2000 / game.word_length) * (game.word_length/10) * settings.verification_time_multiplier) + 2500);
	if (game.word_found != true) { recordWordResult("non trouvé"); }
	stopProposalTimer();

	let verification_timer = Math.floor((2000 / game.word_length) * (game.word_length/10) * settings.verification_time_multiplier)
	let y_display = settings.display_soluce_on_last_row ? game.try_number_max : game.try_count_index;

	for (let i = 0; i<game.word_length; i++) {
		setTimeout(function() {
			let cell_id = `letter_${y_display-1}_${i}`;
			document.getElementById(cell_id).innerHTML = game.word_to_find[i];
			document.getElementById(cell_id).classList.add("correct_placement");
			playsound("letter_ok");

			if (i == game.word_length-1) {
				if (game.word_found == false) { playsound("loose"); }

				game.verification_index = undefined;
				game.word_displayed = true;

				// Change l'équipe de main
				if (settings.team_enabled == true) { switchTeamFocus();  }

				setTimeout(function() {wordReinit()}, 2000)
			}
		}, (i+1) * verification_timer)
	}
}

function addLetter(letter) {
	// Vérification si la première lettre doit correspondre
	if (settings.check_word_first_letter == true &&
		game.word_proposed.length == 0 &&
		letter != game.word_to_find[0]) {
			playsound("error");
			return;
	}

	writeLetter();
	updateCursor();
	updateTypingIndicator()

	function writeLetter() {
		game.word_proposed += letter;
		document.getElementById(`letter_${game.try_count_index-1}_${game.word_proposed.length-1}`).innerHTML = `<a>${letter}</a>`;
	}
}

function removeLetter() {
	if (game.word_proposed.length == 0 || (settings.check_word_first_letter == true && game.word_proposed.length == 1)) {
		reinitWordLine();
	}
	if (game.word_proposed.length > 0) {
		document.getElementById(`letter_${game.try_count_index-1}_${game.word_proposed.length-1}`).innerHTML = `.`;
		game.word_proposed = game.word_proposed.slice(0, -1);
	}

	updateCursor()
	updateTypingIndicator()
}

// Renvoie true si une validation était en attente et a été confirmée
function confirmWordSubmission() {
	if (settings.confirm_submit == true && game.conditional_submit_confirmed == true) {
		submitWord();
		return true;
	}
	return false;
}

// Renvoie true si une validation était en attente et a été annulée
function cancelWordSubmission() {
	if (settings.confirm_submit == true && game.conditional_submit_confirmed == true) {
		game.conditional_submit_confirmed = false;
		console.log("Validation annulée");
		showGameMessage("Validation annulée");
		updateCursor();
		return true;
	}
	return false;
}

function submitWord() {
	// En cas de confirmation requise : la première validation met en attente,
	// la touche 1 / & confirme, Effacer annule
	if (settings.confirm_submit == true && game.conditional_submit_confirmed == false) {
		game.conditional_submit_confirmed = true;
		console.log("Confirmation requise en tapant 1 ou &, Effacer pour annuler");
		showGameMessage("Valider ce mot ? 1 / & pour confirmer, Effacer pour annuler", 0);
		announce("Valider ce mot ? 1 pour confirmer, Effacer pour annuler.");
		return;
	}
	if (settings.confirm_submit == true) {
		hideGameMessage();
	}
	game.conditional_submit_confirmed = false;
	stopProposalTimer();

	// Suppression du curseur
	removeCursor()

	// Autocompletion
	game.word_proposed = game.word_proposed_modified

	// Si au delà de la limite alors affichage de la solution ou reinitialisation
	if (game.try_count_index > game.try_number_max) {
		if (game.word_displayed == false) {
			displaySolution();
			return;
		} else {
			wordReinit();
		}
		return;
	}

	// Si le mot proposé est le bon alors verification ??
	if (game.word_proposed == game.word_to_find) {
		checkProposition();
		return;
	}

	if (settings.check_word_length == true) {
		checkLength();
	} else {
		checkPresence();
	}
}

function checkLength() {
	//La longueur du word_to_find n'est pas bonne.
	if (game.word_proposed.length != game.word_length) {		
		wordErrorHandler(1, true);
		return;
	}
	
	checkPresence();
}

function checkPresence() {
	// Vérification de la présence du word_to_find proposé dans le dictionnaire
	if (settings.check_word_presence == true &&
		game.dictionnaire_verification[`length_${game.word_length}`].includes(game.word_proposed) == false) {
			//Mot non présent dans le dictionary
			wordErrorHandler(2, true);
			return;
	}

	checkDuplication();	
}

function checkDuplication() {
	// Vérification de la présence du word_to_find proposé dans le dictionnaire
	if (settings.check_word_duplication == true) {
		if (game.word_proposed_list.includes(game.word_proposed) == true) {
			// Mot déjà proposé
			wordErrorHandler(3, true);
			return;
		}
		// Ajout du mot dans la liste des propositions
		game.word_proposed_list.push(game.word_proposed)
	}

	checkProposition();
}

// Coloration d'une proposition, lettre par lettre : "correct" (bien placée), "wrong" (mal placée) ou "missing" (absente).
// Les lettres bien placées sont réservées d'abord ; ensuite chaque lettre mal placée consomme une occurrence restante du mot à trouver.
function computeLetterPlacement(word_to_find, word_proposed) {
	const remaining_letters = {};
	const status = [];

	for (let i=0;i<word_to_find.length;i++) {
		if (word_proposed[i] == word_to_find[i]) {
			status[i] = "correct";
		} else {
			remaining_letters[word_to_find[i]] = (remaining_letters[word_to_find[i]] || 0) + 1;
		}
	}

	for (let i=0;i<word_to_find.length;i++) {
		if (status[i] == "correct") { continue; }
		const letter = word_proposed[i];
		if (remaining_letters[letter] > 0) {
			remaining_letters[letter]--;
			status[i] = "wrong";
		} else {
			status[i] = "missing";
		}
	}

	return status;
}

function checkProposition() {
	const word_to_find = game.word_to_find;
	const word_proposed = game.word_proposed;
	const proposed_letter_placement_status = computeLetterPlacement(word_to_find, word_proposed);

	// Enregistrement des lettres bien placées
	for (let i=0;i<word_to_find.length;i++) {
		if (proposed_letter_placement_status[i] == "correct") {
			game.letter_placement_status[i] = "correct";
		}
	}

	// Annonce du résultat pour les lecteurs d'écran
	if (word_proposed != word_to_find) {
		const count = status => proposed_letter_placement_status.filter(s => s == status).length;
		announce(`${word_proposed} : ${count("correct")} bien placée(s), ${count("wrong")} mal placée(s), ${count("missing")} absente(s).`);
	}

	// Animation 
	const verification_timer = Math.floor((2000 / game.word_length) * (game.word_length/10) * settings.verification_time_multiplier);
	markGameBusy(verification_timer * word_to_find.length + 500);
	for (let i=0;i<word_to_find.length;i++) {
		setTimeout(function () {
			switch (proposed_letter_placement_status[i]) {
				case "correct":
					document.getElementById(`letter_${game.try_count_index-1}_${i}`).classList.add("correct_placement");
					playsound("letter_ok");
					break;
				case "wrong":
					document.getElementById(`letter_${game.try_count_index-1}_${i}`).children[0].classList.add("wrong_placement");
					playsound("letter_bad");
					break;
				case "missing":
					playsound("letter_missing");
					break;
			}
			
			// Fin d'animation
			if (i == word_to_find.length-1) {
				checkVictory();
			}
		}, verification_timer * i);
	}
}

function checkVictory() {
	// Mot trouvé
	if (game.word_proposed != game.word_to_find) {
		if (settings.team_enabled == true && settings.change_turn_mode == "by_proposition") {
			switchTeamFocus();
		}
		newWordLine();
		updateCursorVoidPlacement()
		return;
	} 

	game.word_found = true;
	game.word_displayed = true;
	markGameBusy(4500);
	announce(`Mot trouvé : ${game.word_to_find} !`);
	recordWordResult("trouvé");

	playsound("victory");

	for (var i=0 ; i<game.word_length ; i++) {
		document.getElementById("letter_" + (game.try_count_index-1) + '_' + i).classList.add("victory_cell");
		
		// Ajoute une donnée pour décaler l'animation
		const offset = i * (1/game.word_length);
		document.getElementById("letter_" + (game.try_count_index-1) + '_' + i).style = `--offset: ${offset}`;

	}
	setTimeout(function() {
		addTeamScore();

		// Supprime l'animation
		// for (var i=0 ; i<game.word_length ; i++) {
		// 	document.getElementById("letter_" + (game.try_count_index-1) + '_' + i).classList.remove("victory_cell");
		// }
	}, 2250);

	if (settings.number_grid_enabled == true) {
		if (settings.automatic_behaviour == true && settings.automatic_behaviour_redirect_number_grid == true) {
			setTimeout(function() { displayNumberGrid() } , 4000); //reinitialisation de la grille
		}
	} else {
		if (settings.automatic_behaviour == true && settings.automatic_behaviour_ask_new_word == true) {
			setTimeout(function() { wordReinit() } , 4000); //reinitialisation de la grille
		}
	}
}