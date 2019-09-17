	document.addEventListener("keydown", function(event) {
		if (event.keyCode == 27) { // echap
			console.log("Touche Echap");
			displayMenu();
		}		
		if (pause == false) {
			if (word_proposed_tab.length < word_length ) {
				if (event.keyCode == 65 || event.keyCode == 97) {
					ajoutLettre("A");
				} else if (event.keyCode == 66 || event.keyCode == 98) {
					ajoutLettre("B");
				} else if (event.keyCode == 67 || event.keyCode == 99) {
					ajoutLettre("C");
				} else if (event.keyCode == 68 || event.keyCode == 100) {
					ajoutLettre("D");
				} else if (event.keyCode == 69 || event.keyCode == 101) {
					ajoutLettre("E");
				} else if (event.keyCode == 70 || event.keyCode == 102) {
					ajoutLettre("F");
				} else if (event.keyCode == 71 || event.keyCode == 103) {
					ajoutLettre("G");
				} else if (event.keyCode == 72 || event.keyCode == 104) {
					ajoutLettre("H");
				} else if (event.keyCode == 73 || event.keyCode == 105) {
					ajoutLettre("I");
				} else if (event.keyCode == 74 || event.keyCode == 106) {
					ajoutLettre("J");
				} else if (event.keyCode == 75 || event.keyCode == 107) {
					ajoutLettre("K");
				} else if (event.keyCode == 76 || event.keyCode == 108) {
					ajoutLettre("L");
				} else if (event.keyCode == 77 || event.keyCode == 109) {
					ajoutLettre("M");
				} else if (event.keyCode == 78 || event.keyCode == 110) {
					ajoutLettre("N");
				} else if (event.keyCode == 79 || event.keyCode == 111) {
					ajoutLettre("O");
				} else if (event.keyCode == 80 || event.keyCode == 112) {
					ajoutLettre("P");
				} else if (event.keyCode == 81 || event.keyCode == 113) {
					ajoutLettre("Q");
				} else if (event.keyCode == 82 || event.keyCode == 114) {
					ajoutLettre("R");
				} else if (event.keyCode == 83 || event.keyCode == 115) {
					ajoutLettre("S");
				} else if (event.keyCode == 84 || event.keyCode == 116) {
					ajoutLettre("T");
				} else if (event.keyCode == 85 || event.keyCode == 117) {
					ajoutLettre("U");
				} else if (event.keyCode == 86 || event.keyCode == 118) {
					ajoutLettre("V");
				} else if (event.keyCode == 87 || event.keyCode == 119) {
					ajoutLettre("W");
				} else if (event.keyCode == 88 || event.keyCode == 120) {
					ajoutLettre("X");
				} else if (event.keyCode == 89 || event.keyCode == 121) {
					ajoutLettre("Y");
				} else if (event.keyCode == 90 || event.keyCode == 122) {
					ajoutLettre("Z");
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
				changeGrid();
				
			} else if (event.keyCode == 56) { // _
				console.log('Touche 8');
				pickBall();

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
			affichageMot();
			}
		}
	)

	function displayMenu() {
		if (pause == true) {
			pause = false;
			document.getElementById("score").style.opacity = '0';
		} else {
			pause = true;
			document.getElementById("score").style.opacity = '1';
		}
	}

	function displayNumberGrid() {
		if (number_grid_displayed == true) {
			number_grid_displayed = false;
			document.getElementById("grid_number").style.opacity = '0';

		} else {
			number_grid_displayed = true;
			document.getElementById("grid_number").style.opacity = '1';
			if (team_turn == "yellow") {	//affichage uniquement la grille de l'équipe
				document.getElementById("grid_number_blue").style.display = "none";
			} else {
				document.getElementById("grid_number_yellow").style.display = "none";
			}
		}
	}