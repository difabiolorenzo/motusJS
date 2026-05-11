document.addEventListener("keydown", function (event) {
	switch (event.key) {
		case 27:	// escape
			if (game.pause == true) { returnGame() } else { returnMenu(); }
			break;
	}
	if (game.started == true && game.pause == false) {
		switch (event.code) {
			case "Digit6":
				switchGameGridFocusOn()
				break;
			case "Digit5":
				switchTeamFocus();
				break;
		}
		if (game.focus_on == "letter") {
			switch (event.code) {
				case "Backspace":
					// cancelWordSubmission();
					removeLetter();
					updateCursor()
					break;
				case "Enter":
					submitWord();
					break;
				case "Digit1":
					// confirmWordSubmission();
					newWordLine();
					break;
				case "Digit2":
					addBonusLetter();
					break;
				case "Digit3":
					removeWordLine();
					break;
				case "Digit4":
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
				if ((event.key >= "a" && event.key <= "z" || event.key >= "A" && event.key <= "Z") && event.key != "Backspace" && event.key != "Enter") { //if between a & z OR A & Z
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
	
	for (let row=0; row<rows.length; row++) {
		const header = `<div class="keyboard_layer">`;
		const footer = `</div>`;
		let letter = undefined
		let letter_element = undefined
		let row_line_element = "";

		for (let letter_key=0; letter_key<rows[row].length; letter_key++) {
			if (row == 2 && letter_key == 0) {row_line_element += `<div style="grid-column: 1 / 3;" class="btn keyboard_key keyboard_key_submit" onclick="removeLetter()" data-keyboard="ERASE">←</div>`}
			row_line_element += `<div class="btn keyboard_key" onclick="keyboardInput(this)" data-keyboard="${rows[row][letter_key]}">${rows[row][letter_key]}</div>`
			if (row == 2 && letter_key == 5) {row_line_element += `<div style="grid-column: 11 / 9;" class="btn keyboard_key keyboard_key_remove" onclick="submitWord()" data-keyboard="ENTER">↲</div>`}

		}
		keyboard_placeholder.innerHTML += `${header}${row_line_element}${footer}`;
	}
}

function keyboardInput(element) {
	addLetter(element.getAttribute("data-keyboard"))
}
