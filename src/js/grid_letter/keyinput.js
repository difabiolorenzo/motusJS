	document.addEventListener("keydown", function(event) {
		if (event.keyCode == 27) { // echap
			console.log("Touche Echap");
			displayMenu();
		}		
		if (pause == false) {	//Proposition des lettres (conversion de code ascii en lettre capitale)
			if (word_proposed_tab.length < word_length ) {
				if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 97 && event.keyCode <= 122) {
					console.log(event.keyCode);
					for (i = 0 ; i < 26 ; i++) {
						if (i == (event.keyCode - 65) || i == (event.keyCode - 97)) {
							ajoutLettre( String.fromCharCode( i + 65 ) );
							console.log(String.fromCharCode( i + 65 ));
						}
					}
				}
			} 
			if (event.keyCode == 8) {  // Retour arrière
				console.log('Erase');
				suppressionLettre()
				
			} else if (event.keyCode == 13) { // Entrer
				console.log('Entrer');
				if (word_proposed_tab.length != word_length) {  //vérification de la longueur du word_to_find
					errorHandler(1); //La longueur du word_to_find n'est pas la bonne.
				} else {
					verifPresence(word_proposed);
					if (in_dictionary === false) {
						errorHandler(2); //Mot non présent dans le dictionary
					} else {
						verifDuplication(word_proposed);
						if (already_proposed === true) {
							errorHandler(3); //Mot déjà proposé
						} else {
							verificationProposition()
						}
					}
				}
			} else if (event.keyCode == 49) { // &
				console.log('Touche 1');
				nouvelleLigne();
				
			} else if (event.keyCode == 50) { // é
				console.log('Touche 2');
				ajoutLettreBonus();
	
			} else if (event.keyCode == 51) { // "
				console.log('Touche 3');
				affichageSolution();
	
			} else if (event.keyCode == 52) { // '
				console.log("Touche 4");
				reinit();
	
			} else if (event.keyCode == 53) { // (
				console.log("Touche 5");
				suppressionLigne();

			} else if (event.keyCode == 54) { // -
				console.log("Touche 6");
				changeTeamTurn();

			} else if (event.keyCode == 55) { // è
				console.log('Touche 7');
				if (use_number_grid == "true") {
					changeGrid();
				}
				
			} else if (event.keyCode == 56) { // _
				console.log('Touche 8');
				if (use_number_grid == "true") {
					pickBall();
				}

			} else if (event.keyCode == 57) { // ç
				console.log('Touche 9');

			} else if (event.keyCode == 48) { // à
				console.log('Touche 0');
				displayNumberGrid();
			}
			
			else if (event.keyCode == 186) { // $ ¤ £
				console.log('Touche $');
				playsound_temps_ecoule.play();
			}
	
			word_proposed = word_proposed_tab.join(''); // Affichage du word_to_find proposé
			}
		}
	)