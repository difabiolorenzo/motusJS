document.addEventListener("keydown", function (event) {
	// Fenêtre publique : affichage seulement, le clavier ne pilote rien
	if (IS_PUBLIC_VIEW) { return; }

	// Choix de la longueur du prochain mot : 5 à 9, 0 pour 10 (rangée du haut ou pavé numérique)
	if (document.getElementById("word_length_dialog").open) {
		const length_keys = { Digit5: 5, Digit6: 6, Digit7: 7, Digit8: 8, Digit9: 9, Digit0: 10,
			Numpad5: 5, Numpad6: 6, Numpad7: 7, Numpad8: 8, Numpad9: 9, Numpad0: 10 };
		if (length_keys[event.code]) {
			event.preventDefault();
			chooseNextWordLength(length_keys[event.code]);
		}
		return;
	}

	// Fenêtre ouverte (paramètres) : les touches lui reviennent ; Échap la ferme sans quitter la partie
	if (document.querySelector("dialog[open]")) {
		return;
	}

	// Entrée / Espace sur un bouton ou un champ : le contrôle agit seul (pas de validation de mot)
	if ((event.key == "Enter" || event.key == " ") && event.target.closest && event.target.closest("button, input, select, textarea, a")) {
		return;
	}

	switch (event.key) {
		case "Escape":
			// Retour menu / reprise uniquement si une partie est commencée
			if (game.started == true) {
				if (game.pause == true) { returnGame() } else { returnMenu(); }
			}
			break;
	}
	if (game.started == true && game.pause == false) {
		// Annuler la dernière action de l'animateur
		if ((event.ctrlKey || event.metaKey) && event.code == "KeyZ") {
			event.preventDefault();
			animatorCommand("undo");
			return;
		}
		switch (event.code) {
			case "Digit6":
				animatorCommand("switch_grid");
				break;
			case "Digit5":
				animatorCommand("switch_team");
				break;
			case "Digit7":
				toggleAnimatorPanel();
				break;
		}
		if (game.focus_on == "letter") {
			switch (event.code) {
				case "Backspace":
					// Annulation d'une validation en attente de confirmation
					if (cancelWordSubmission()) { break; }
					removeLetter();
					updateCursor()
					break;
				case "Enter":
					submitWord();
					break;
				case "Digit1":
					// Confirmation d'une validation en attente, sinon nouvelle ligne
					if (confirmWordSubmission()) { break; }
					animatorCommand("new_line");
					break;
				case "Digit2":
					animatorCommand("bonus");
					break;
				case "Digit3":
					animatorCommand("remove_line");
					break;
				case "Digit4":
					animatorCommand("replace_line");
					break;
				case "Digit9":
					wordReinit();
					break;
				case "Digit0":
					displaySolution();
					break;
				case "BracketRight":
					timesUp();
					break;
				case "Backslash":
					// wordFoundInformation();
					break;
			}
			if (game.word_proposed.length < game.word_length) {
				// Une seule lettre de a à z, sans Ctrl / Alt / Cmd (sinon « Shift », « Tab »… passaient le test)
				if (event.key.length == 1 && /[a-zA-Z]/.test(event.key) && !event.ctrlKey && !event.altKey && !event.metaKey) {
					addLetter(event.key.toUpperCase());
				}
			}
		}
	}
})

function createKeyboard() {
	const keyboard_placeholder = document.getElementById("keyboard_placeholder");
	let left_arrow = "";
	let right_arrow = "";

	const rows = [
		["A","Z","E","R","T","Y","U","I","O","P"],
		["Q","S","D","F","G","H","J","K","L","M"],
		["W","X","C","V","B","N"]
	];

	keyboard_placeholder.innerHTML = "";
	
	keyboard_placeholder.setAttribute("role", "group");
	keyboard_placeholder.setAttribute("aria-label", "Clavier visuel");

	for (let row=0; row<rows.length; row++) {
		const header = `<div class="keyboard_layer">`;
		const footer = `</div>`;
		let letter = undefined
		let letter_element = undefined
		let row_line_element = "";

		for (let letter_key=0; letter_key<rows[row].length; letter_key++) {
			if (row == 2 && letter_key == 0) {row_line_element += `<button type="button" style="grid-column: 1 / 3;" class="btn keyboard_key keyboard_key_submit" onclick="removeLetter()" data-keyboard="ERASE" aria-label="Effacer la lettre">←</button>`}
			row_line_element += `<button type="button" class="btn keyboard_key" onclick="keyboardInput(this)" data-keyboard="${rows[row][letter_key]}">${rows[row][letter_key]}</button>`
			if (row == 2 && letter_key == 5) {row_line_element += `<button type="button" style="grid-column: 11 / 9;" class="btn keyboard_key keyboard_key_remove" onclick="submitWord()" data-keyboard="ENTER" aria-label="Valider le mot">↲</button>`}

		}
		keyboard_placeholder.innerHTML += `${header}${row_line_element}${footer}`;
	}
}

function keyboardInput(element) {
	addLetter(element.getAttribute("data-keyboard"))
}
