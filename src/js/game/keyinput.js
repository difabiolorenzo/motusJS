document.addEventListener("keydown", function (event) {
	if (game_started == true && game_paused == false) {
		if (event.keyCode == 27) { // escape
			console.log("Escape");
			displayPage("main_menu");
			game_paused = true;

		} else if (event.keyCode == 8) { // back
			console.log('Erase');
			suppressionLettre();
		} else if (event.keyCode == 13) { // enter
			console.log('Enter');
			submitWord();
		} else if (event.keyCode == 37) { // enter
			console.log('Flèche gauche');
			suppressionLettre();
		} else if (event.keyCode == 48 || event.keyCode == 96 ) { // à
			console.log('Key 0');
			affichageSolution();
		} else if (event.keyCode == 49 || event.keyCode == 97 ) { // &
			console.log('Key 1');
			nouvelleLigne();
		} else if (event.keyCode == 50 || event.keyCode == 98 ) { // é
			console.log('Key 2');
			ajoutLettreBonus();
		} else if (event.keyCode == 51 || event.keyCode == 99 ) { // "
			console.log('Key 3');
			suppressionLigne();
		} else if (event.keyCode == 52 || event.keyCode == 100 ) { // '
			console.log("Key 4");
			suppressionLigne();
			nouvelleLigne();
		} else if (event.keyCode == 53 || event.keyCode == 101 ) { // (
			console.log("Key 5");
			switchTeamFocus();
		} else if (event.keyCode == 54 || event.keyCode == 102 ) { // -
			console.log("Key 6");
		} else if (event.keyCode == 55 || event.keyCode == 103 ) { // è
			console.log('Key 7');
		} else if (event.keyCode == 56 || event.keyCode == 104 ) { // _
			console.log('Key 8');
		} else if (event.keyCode == 57 || event.keyCode == 105 ) { // ç
			console.log('Key 9');
			reinitWord();
		} else if (event.keyCode == 186) { // $ ¤ £
			console.log('Key $');
			playsound("temps_ecoule");
		} else if (event.keyCode == 220) { // * µ
			console.log('Key *')
			wordInformation();
			
		} else if (word_proposed_tab.length < word_length) {
			if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 97 && event.keyCode <= 122) { //if between a & z OR A & Z
				for (i = 0; i < 26; i++) {
					if (i == (event.keyCode - 65) || i == (event.keyCode - 97)) {
						letterAddFromKeyboard(String.fromCharCode(i + 65));	//convert keyboard input into letter
						// console.log(event.keyCode + " " + String.fromCharCode(i + 65));
					}
				}
			}
		}
		word_proposed = word_proposed_tab.join('');

	} else if (displayed_page == "number_grid_page" && sort_mode == "input_keyboard") {
		if (event.keyCode >= 48 && event.keyCode <= 57 <= 105 || event.keyCode >= 96 && event.keyCode) { //if between 0 & 9
			for (i = 0; i < 26; i++) {
				if (i == (event.keyCode - 48) || i == (event.keyCode - 96)) {
					numberAddFromKeyboard(String.fromCharCode(i + 48));	//convert keyboard input into number
				}
			}
		} else if (event.keyCode == 8) { // erase
			console.log('Erase');
			eraseProposedNumberFromKeyboard();
		} else if (event.keyCode == 13) { // enter
			console.log('Enter');
			validateProposedNumberFromKeyboard();
		} else if (event.keyCode == 46) { // suppr
			console.log('Delete');
			deleteProposedNumberFromKeyboard();
		}
	}
}
)