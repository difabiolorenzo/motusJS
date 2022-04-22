document.addEventListener("keydown", function (event) {
	switch (event.key) {
		case 27:	// escape
			if (game_paused == true) { returnGame() } else { returnMenu(); }
			break;
	}
	if (global.game_started == true && global.game_paused == false) {
		switch (event.code) {
			case "Escape":
				if (global.game_paused == true) { returnGame() } else { returnMenu(); }
				break;
			case "Digit6":
				switchGridType()
				break;
		}
		if (global.displayed_grid_type == "letter_grid") {
			switch (event.code) {
				case "Backspace":
					removeLetter();
					break;
				case "Enter":
					submitWord();
					break;
				case "Digit0":
					displaySolution();
					break;
				case "Digit1":
					newWordLine();
					break;
				case "Digit2":
					addBonusLetter();
					break;
				case "Digit3":
					removeWordLine();
					break;
				case "Digit5":
					switchTeamFocus();
					break;
				case "Digit9":
					wordReinit();
					break;
				case "BracketRight":
					timesUp();
					break;
				case "Backslash":
					wordFoundInformation();
					break;
			}
			if (game.word_proposed.length < game.word_length) {
				if ((event.key >= "a" && event.key <= "z" || event.key >= "A" && event.key <= "Z") && event.key != "Backspace" && event.key != "Enter") { //if between a & z OR A & Z
					addLetter(event.key.toUpperCase());
				}
			}
		} else {
			if (event.code == "Enter") {
				pickBall();
			}
		}
	}
})


function createKeyboard() {
	var keyPlacement = [["A","Z","E","R","T","Y","U","I","O","P","ERASE"],["Q","S","D","F","G","H","J","K","L","M","ENTER"],["W","X","C","V","B","N"]]
	var keyboard = document.getElementById("keyboard");
	var keyboard_row_head = "<div class='keyboard_layer'>";
	var keyboard_row_foot = "</div>";

	for (layer=0;layer<keyPlacement.length;layer++) {
		var keyboard_row_content = "";
		for (keyPosition=0;keyPosition<keyPlacement[layer].length;keyPosition++) {
			var key = keyPlacement[layer][keyPosition];
			switch (key) {
				case "ENTER":
					keyboard_row_content += "<div class='keyboard_key' onclick='submitWord()' data-keyboard='" + key + "'>↲</div>";
					break;
				case "ERASE":
					keyboard_row_content += "<div class='keyboard_key' onclick='removeLetter()' data-keyboard='" + key + "'>🡰</div>";
					break;
				default:
					keyboard_row_content += "<div class='keyboard_key' onclick='keyboardInput(this)' data-keyboard='" + key + "'>" + key + "</div>";
					break;
			}
		}
		keyboard.innerHTML += keyboard_row_head + keyboard_row_content + keyboard_row_foot;
	}
}

function keyboardInput(element) {
	addLetter(element.getAttribute("data-keyboard"))
}
