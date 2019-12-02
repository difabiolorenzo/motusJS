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
		} else if (event.keyCode == 48) { // à
			console.log('Key 0');
		} else if (event.keyCode == 49) { // &
			console.log('Key 1');
			nouvelleLigne();
		} else if (event.keyCode == 50) { // é
			console.log('Key 2');
			ajoutLettreBonus();
		} else if (event.keyCode == 51) { // "
			console.log('Key 3');
			reinitWord();
		} else if (event.keyCode == 52) { // '
			console.log("Key 4");
			affichageSolution();
		} else if (event.keyCode == 53) { // (
			console.log("Key 5");
			suppressionLigne();
		} else if (event.keyCode == 54) { // -
			console.log("Key 6");
		} else if (event.keyCode == 55) { // è
			console.log('Key 7');
		} else if (event.keyCode == 56) { // _
			console.log('Key 8');
		} else if (event.keyCode == 57) { // ç
			console.log('Key 9');
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
						ajoutLettre(String.fromCharCode(i + 65));
						console.log(event.keyCode + " " + String.fromCharCode(i + 65));
					}
				}
			}
		}
		
		word_proposed = word_proposed_tab.join('');
	}
})