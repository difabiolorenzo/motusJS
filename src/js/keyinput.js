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
	if ((event.key === "Enter" || event.key === " ") && event.target.closest && event.target.closest("button, input, select, textarea, a")) {
		return;
	}

	switch (event.key) {
		case "Escape":
			// Retour menu / reprise uniquement si une partie est commencée
			if (game.started === true) {
				if (game.pause === true) { returnGame() } else { returnMenu(); }
			}
			break;
	}
	if (game.started === true && game.pause === false) {
		// Annuler la dernière action de l'animateur
		if ((event.ctrlKey || event.metaKey) && event.code === "KeyZ") {
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
			case "Digit8":
				// Vasque en mode « bouton Tirer » : tirage au hasard au clavier
				if (game.focus_on === "number" && settings.ball_picking_mode === "vasque" && settings.vasque_gesture === "random") {
					drawRandomFromVasque();
				}
				break;
		}
		if (game.focus_on === "letter") {
			switch (event.code) {
				case "Backspace":
					// Annulation d'une validation en attente de confirmation
					if (cancelWordSubmission()) { break; }
					removeLetter();
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
					animatorCommand("new_word");
					break;
				case "Digit0":
					animatorCommand("solution");
					break;
				case "BracketRight":
					timesUp();
					break;
			}
			if (game.word_proposed.length < game.word_length) {
				// Une seule lettre de a à z, sans Ctrl / Alt / Cmd (sinon « Shift », « Tab »… passaient le test)
				if (event.key.length === 1 && /[a-zA-Z]/.test(event.key) && !event.ctrlKey && !event.altKey && !event.metaKey) {
					addLetter(event.key.toUpperCase());
				}
			}
		}
	}
})

function createKeyboard() {
	const keyboard_placeholder = document.getElementById("keyboard_placeholder");
	const left_arrow = "";
	const right_arrow = "";

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
		const letter = undefined
		const letter_element = undefined
		let row_line_element = "";

		for (let letter_key=0; letter_key<rows[row].length; letter_key++) {
			if (row === 2 && letter_key === 0) {row_line_element += `<button type="button" style="grid-column: 1 / 3;" class="btn keyboard_key keyboard_key_submit" onclick="removeLetter()" data-keyboard="ERASE" aria-label="Effacer la lettre">←</button>`}
			row_line_element += `<button type="button" class="btn keyboard_key" onclick="keyboardInput(this)" data-keyboard="${rows[row][letter_key]}">${rows[row][letter_key]}</button>`
			if (row === 2 && letter_key === 5) {row_line_element += `<button type="button" style="grid-column: 11 / 9;" class="btn keyboard_key keyboard_key_remove" onclick="submitWord()" data-keyboard="ENTER" aria-label="Valider le mot">↲</button>`}

		}
		keyboard_placeholder.innerHTML += `${header}${row_line_element}${footer}`;
	}
	updateKeyboardLetterStatus();
}

// CLAVIER COLORÉ (réglage keyboard_letter_status, désactivé par défaut : absent du jeu télévisé)
// Chaque touche prend le meilleur résultat connu de sa lettre pour le mot en cours :
// bien placée > mal placée > absente. Les lettres révélées (première lettre, lettres d'aide, lettre bonus)
// comptent comme bien placées. Remis à zéro à chaque mot (createLetterGrid).
const KEYBOARD_STATUS_RANK = { missing: 1, wrong: 2, correct: 3 };
const KEYBOARD_STATUS_LABEL = { missing: "absente", wrong: "mal placée", correct: "bien placée" };

function resetKeyboardLetterStatus() {
	game.keyboard_letter_status = {};
	updateKeyboardLetterStatus();
}

function mergeKeyboardLetterStatus(letter, status) {
	if (!KEYBOARD_STATUS_RANK[status]) { return; }
	const known = game.keyboard_letter_status;
	if (!known[letter] || KEYBOARD_STATUS_RANK[status] > KEYBOARD_STATUS_RANK[known[letter]]) {
		known[letter] = status;
	}
}

// Proposition vérifiée : statut de chaque lettre (computeLetterPlacement)
function recordKeyboardLetterStatus(word, statuses) {
	if (!game.keyboard_letter_status) { game.keyboard_letter_status = {}; }
	for (let i = 0; i < word.length; i++) { mergeKeyboardLetterStatus(word[i], statuses[i]); }
	updateKeyboardLetterStatus();
}

function updateKeyboardLetterStatus() {
	if (!game.keyboard_letter_status) { game.keyboard_letter_status = {}; }
	const placement = game.letter_placement_status || [];
	const word = game.word_to_find || "";
	// Lettres révélées sur la grille
	for (let i = 0; i < placement.length; i++) {
		if (placement[i] === "correct" && word[i]) { mergeKeyboardLetterStatus(word[i], "correct"); }
	}
	const enabled = settings.keyboard_letter_status === true;
	document.querySelectorAll("#keyboard_placeholder .keyboard_key[data-keyboard]").forEach(key => {
		const letter = key.getAttribute("data-keyboard");
		if (letter.length !== 1) { return; }
		const status = enabled ? game.keyboard_letter_status[letter] : undefined;
		key.classList.toggle("key_correct", status === "correct");
		key.classList.toggle("key_wrong", status === "wrong");
		key.classList.toggle("key_missing", status === "missing");
		const label = status ? `${letter}, ${KEYBOARD_STATUS_LABEL[status]}` : null;
		if (label) { key.setAttribute("aria-label", label); } else { key.removeAttribute("aria-label"); }
	});
}

function updateKeyboardLetterStatusSettings(value = settings.keyboard_letter_status) {
	settings.keyboard_letter_status = value === true;
	document.getElementById("checkbox_keyboard_letter_status").checked = settings.keyboard_letter_status;
	document.getElementById("toggle_keyboard_letter_status").setAttribute("aria-pressed", settings.keyboard_letter_status ? "true" : "false");
	updateKeyboardLetterStatus();
}

// Interrupteur au-dessus du clavier visuel (même réglage que Paramètres > Jeu), enregistré aussitôt
function toggleKeyboardLetterStatus() {
	updateKeyboardLetterStatusSettings(settings.keyboard_letter_status !== true);
	saveSettingsIntoLocalStorage();
	announce(settings.keyboard_letter_status ? "Clavier coloré activé." : "Clavier coloré désactivé.");
}

function keyboardInput(element) {
	addLetter(element.getAttribute("data-keyboard"))
}
