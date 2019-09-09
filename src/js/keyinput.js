	document.addEventListener("keydown", function(event) {
		if (event.keyCode == 27) { // echap
			console.log("Touche Echap");
			displayMenu();
		}
		if (event.keyCode == 54) { // "
				console.log("Touche - (6)");
				changeTeamTurn();
		}
		
		if (pause == false) {
			if (word_proposed_tab.length < word_length ) {
				if (event.keyCode == 65 || event.keyCode == 97) {
					word_proposed_tab.push('A');
				} else if (event.keyCode == 66 || event.keyCode == 98) {
					word_proposed_tab.push('B');
				} else if (event.keyCode == 67 || event.keyCode == 99) {
					word_proposed_tab.push('C');
				} else if (event.keyCode == 68 || event.keyCode == 100) {
					word_proposed_tab.push('D');
				} else if (event.keyCode == 69 || event.keyCode == 101) {
					word_proposed_tab.push('E');
				} else if (event.keyCode == 70 || event.keyCode == 102) {
					word_proposed_tab.push('F');
				} else if (event.keyCode == 71 || event.keyCode == 103) {
					word_proposed_tab.push('G');
				} else if (event.keyCode == 72 || event.keyCode == 104) {
					word_proposed_tab.push('H');
				} else if (event.keyCode == 73 || event.keyCode == 105) {
					word_proposed_tab.push('I');
				} else if (event.keyCode == 74 || event.keyCode == 106) {
					word_proposed_tab.push('J');
				} else if (event.keyCode == 75 || event.keyCode == 107) {
					word_proposed_tab.push('K');
				} else if (event.keyCode == 76 || event.keyCode == 108) {
					word_proposed_tab.push('L');
				} else if (event.keyCode == 77 || event.keyCode == 109) {
					word_proposed_tab.push('M');
				} else if (event.keyCode == 78 || event.keyCode == 110) {
					word_proposed_tab.push('N');
				} else if (event.keyCode == 79 || event.keyCode == 111) {
					word_proposed_tab.push('O');
				} else if (event.keyCode == 80 || event.keyCode == 112) {
					word_proposed_tab.push('P');
				} else if (event.keyCode == 81 || event.keyCode == 113) {
					word_proposed_tab.push('Q');
				} else if (event.keyCode == 82 || event.keyCode == 114) {
					word_proposed_tab.push('R');
				} else if (event.keyCode == 83 || event.keyCode == 115) {
					word_proposed_tab.push('S');
				} else if (event.keyCode == 84 || event.keyCode == 116) {
					word_proposed_tab.push('T');
				} else if (event.keyCode == 85 || event.keyCode == 117) {
					word_proposed_tab.push('U');
				} else if (event.keyCode == 86 || event.keyCode == 118) {
					word_proposed_tab.push('V');
				} else if (event.keyCode == 87 || event.keyCode == 119) {
					word_proposed_tab.push('W');
				} else if (event.keyCode == 88 || event.keyCode == 120) {
					word_proposed_tab.push('X');
				} else if (event.keyCode == 89 || event.keyCode == 121) {
					word_proposed_tab.push('Y');
				} else if (event.keyCode == 90 || event.keyCode == 122) {
					word_proposed_tab.push('Z');
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
				console.log('Touche & (1)');
				nouvelleLigne();
				
			} else if (event.keyCode == 50) { // é
				console.log('Touche é (2)');
				ajoutLettreBonus();
	
			} else if (event.keyCode == 51) { // "
				console.log('Touche é (3)');
				solutionInterval = setInterval(function() {affichageSolution()}, timer);
	
			} else if (event.keyCode == 52) { // "
				console.log("Touche ' (4)");
				reinit();
	
			} else if (event.keyCode == 53) { // "
				console.log("Touche ( (5)");
				suppressionLigne();
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