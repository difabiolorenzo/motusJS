    function createLetterGrid() {
        word_length = word_to_find_list[0].length;

        document.getElementById("letter_grid_placeolder").innerHTML = "";

        var letter_html_table = "<table id=\"table_letter\">";

        for (var j = 0; j <= try_number_max-1; j++) {
            letter_html_table += "<tr>";
            for (var i = 0; i < word_length; i++) {
                letter_html_table += "<td id=" + j + "_" + i + " class=\"not_present\"></td>";
            }
            letter_html_table += "</tr>";
        }
        letter_html_table += "</table>";

        document.getElementById("letter_grid_placeolder").innerHTML = letter_html_table;
    }

    function initialisationMot() {   // Mise dans le tableau word_to_find le word_to_find

        try_count_index = -1;
        verification_index = 0;
        
		placing = [];
		placing_dup = [];
        lettre_ok = [];
        already_proposed = false;
        word_to_find = word_to_find_list[0]; 
        word_to_find_tab = [];
        word_proposed_tab_list = [];
        word_proposed_tab = [];
        word_composed_letter = [];
        word_composed_letter_exist = false;
        word_composed_letter_amount = [];
        word_composed_letter_amount_dup = [];

        dictionary_used = dictionary_list[(word_to_find_list[0].length)-5];
		
		for (var i = 0; i < word_length; i++) { //Décomposition du mot vers word_to_find_tab
			word_to_find_tab[i] = word_to_find.substr(i, 1);
		}
		
		for (var i = 0; i < word_length; i++) { //Position x[0]
			if (i == 0) {
				lettre_ok.push(word_to_find_tab[0]);
				placing.push(1);
			} else {
				lettre_ok.push('');
				placing.push(0);
			}
        }
        
        breakDownWord();
		
		console.log("word_to_find " + word_to_find); // Affichage du word_to_find tiré dans la console
		console.log("word_composed_letter " + word_composed_letter);
		console.log("word_composed_letter_amount " + word_composed_letter_amount);
		
		for (i=0; i<lettre_plus_amount; i++) {
			var letter_plus = Math.floor(Math.random() * (word_length - 2) + 2); // Seconde lettre au premier word_to_find
            placing[letter_plus] = 1; // La seconde lettre est une lettre correcte
            lettre_ok[letter_plus] = word_to_find_tab[letter_plus];
		}
    }
    
    function breakDownWord() {
		// Mise dans le tableau word_composed_letter le word_to_find
		// word_composed_letter convertit "ELEVE" en "ELV"
		for (var i = 0; i < word_to_find_tab.length; i++) {
			word_composed_letter_exist = false;
			for (var j = 0; j < word_composed_letter.length; j++) {
				if (word_composed_letter[j] == word_to_find_tab[i]){
					word_composed_letter_exist = true;
					if (word_composed_letter_amount.length == 0) {
						word_composed_letter_amount.push(1);
					} else {
						if (word_composed_letter_amount[j] == undefined) {
							word_composed_letter_amount.push(1);
						} else {
							word_composed_letter_amount[j]++;
						}
					}
					break;
				}
			}
			if (word_composed_letter_exist == false) {
				word_composed_letter.push(word_to_find_tab[i]);
				if (word_composed_letter_amount.length == 0) {
					word_composed_letter_amount.push(1);
				} else {
					if (word_composed_letter_amount[i] == undefined) {
						word_composed_letter_amount.push(1);
					} else {
						word_composed_letter_amount[i]++;
					}
				}
			}
		}
    }

	function letterAddFromKeyboard(letter) {
        if (word_proposed_tab.length == 0) {
            if (letter == word_to_find_tab[0]) {
                word_proposed_tab.push(letter);
            } else {
                playsound_letter_missing.play();
                displayMessage("La première lettre doit être un "+word_to_find_tab[0]+".", "#b11f0e")
            }
        } else {
            word_proposed_tab.push(letter);
        }
        document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = word_proposed_tab[word_proposed_tab.length-1];
	}
	
    function nouvelleLigne() {		// Ajoute une nouvelle ligne avec les bonnes lettres proposées
		try_count_index++;
		if (try_count_index != try_number_max) {
			for (var i = 0; i < word_length; i++) {
				document.getElementById(try_count_index + '_' + i).innerHTML = ".";
				if (placing[i] == 1) {
					document.getElementById(try_count_index + '_' + i).innerHTML = word_to_find_tab[i];
				}
			}
			word_proposed_tab = [];
			word_proposed = "";

		} else {
			affichageSolution();
		}
    }

    function suppressionLigne() {		// Supprime la ligne
		for (var i = 0; i < word_length; i++) {
				document.getElementById(try_count_index + '_' + i).innerHTML = "";
				document.getElementById(try_count_index + '_' + i).className = 'not_present';
			}
		for (var i = 0; i < word_length; i++) { 
			lettre_ok.push('');
			placing.push(0);
		}
		try_count_index--;
    }
    
    function ajoutLettre(lettre) {
		if (word_proposed_tab.length == 0) {
			if (lettre == word_to_find_tab[0]) {
				word_proposed_tab.push(lettre);
			} else {
				playsound_letter_missing.play();
				displayMessage("La première lettre doit être un "+word_to_find_tab[0]+".", "#b11f0e")
			}
		} else {
			word_proposed_tab.push(lettre);
		}
		
		document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = word_proposed_tab[word_proposed_tab.length-1];
    }
    
    function suppressionLettre() {		// Supprime les lettre de droite à gauche
		document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = ".";
		word_proposed_tab.pop();
	}
    
    function affichageSolution() {		// Affiche la solution à la dérnière ligne, necessite une boucle en amont
		if (display_animation == true) {
			animationIntervalID_1 = setInterval(function() {animationAfficheSolution()}, timer);
		} else {
			for (i=0; i<word_length; i++) {
				document.getElementById(try_number_max-1 + '_' + i).innerHTML = word_to_find_tab[i];
				document.getElementById(try_number_max-1 + '_' + i).className = 'correct';
				playsound_letter_ok.play();
			}
			word_proposed_tab = [];
			verification_index = 0;
		}
    }
    
    function animationAfficheSolution() {
		document.getElementById(try_number_max-1 + '_' + verification_index).innerHTML = word_to_find_tab[verification_index];
		document.getElementById(try_number_max-1 + '_' + verification_index).className = 'correct';
		playsound_letter_ok.play();
		verification_index++;

		if (verification_index == word_length) { // Fin de la vérification
			word_proposed_tab = [];
			verification_index = 0;
			clearInterval(animationIntervalID_1);
		}
    }
    
    function ajoutLettreBonus() {		// Ajoute une lettre bonnus dans les emplacement non trouvés
		for (var i = 0; i < word_length; i++) {
			if (placing[i] != 1) {
				document.getElementById(try_count_index + '_' + i).innerHTML = word_to_find_tab[i];
				placing[i] = 1;
				playsound_letter_bonus.play();

				j = 0;
				letter_bonus_placement = i;
				if (display_animation == true) {
					animationIntervalID_2 = setInterval(function() {animationLettreBonus()}, 100);
				}

				break;
			}
		}
	}

	function animationLettreBonus() {
		if ((j%2) == 1) {
			document.getElementById(try_count_index + '_' + letter_bonus_placement).className = 'not_present';
		} else {
			document.getElementById(try_count_index + '_' + letter_bonus_placement).className = 'correct';
		}
		j++;

		if (j == 8) {
			clearInterval(animationIntervalID_2);
		}
    }
    
    function errorHandler(errorCode) {		// Affiche dans la console le terme de l'erreur
		if (errorCode == 1) {
			console.log("La longueur du word_to_find n'est pas la bonne.");
		} else if (errorCode == 2) {
			console.log("Mot non présent dans le dictionnaire");
		} else if (errorCode == 3) {
			console.log("Mot déjà proposé");
		}
		playsound_letter_missing.play();
		playsound_wrong.play();
    }
    
    function verifPresence(word_proposed) {		// Vérification de la présence du word_to_find proposé dans le dictionnaire
		in_dictionary = false;
		for (i = 0; i < dictionary_used.length; i++) {
			if (word_proposed == dictionary_used[i]) {
				in_dictionary = true;
			} else {
			}
		}
		return in_dictionary;
	}

	function verifDuplication(word_proposed) {		// Vérification de la présence du word_to_find proposé dans le dictionnaire
		for (i = 0; i < word_proposed_tab_list.length; i++) {
			if (word_proposed == word_proposed_tab_list[i]) {
				already_proposed = true;
				break;
			} else {
				already_proposed = false;
			}
		}
		word_proposed_tab_list.push(word_proposed);
		return in_dictionary;
    }
    
    function verificationProposition() {		// Vérifie par rapport à word_to_find le proposed_word
		placing_dup = [];
		word_composed_letter_amount_dup = [];
		for (var i = 0; i < placing.length; i++) {
			placing_dup.push(0);
		}
		for (var i = 0; i < word_composed_letter_amount.length; i++) {
			word_composed_letter_amount_dup[i] = word_composed_letter_amount[i];
		}
		for (var i = 0; i < word_to_find.length; i++) {
			if (word_proposed_tab[i] == word_to_find_tab[i]) {
				placing_dup[i] = 1;
				for (var j = 0; j < word_composed_letter.length; j++) {
					if (word_proposed_tab[i] == word_composed_letter[j]) {
						word_composed_letter_amount_dup[j]--;
					}
				}
			}
		}
		for (var i = 0; i < word_to_find.length; i++) {
			if (word_proposed_tab[i] != word_to_find_tab[i]) {
				for (var j = 0; j < word_composed_letter.length; j++) {
					if (word_proposed_tab[i] == word_composed_letter[j] && word_composed_letter_amount_dup[j] > 0) {
						word_composed_letter_amount_dup[j]--;
						placing_dup[i] = 2;
					}
				}
			}
		}
		for (var i = 0; i < placing.length; i++) {
			if (placing_dup[i] == 1) {
				placing[i] = placing_dup[i];
			}
		}

		if (i >= word_length) { // Fin de la vérification
			console.log(placing);
			console.log(placing_dup);
			console.log(word_proposed_tab);
			console.log(word_composed_letter);

			for (i=0; i < placing.length; i++) { //duplication de word_composed_letter_amount
				if (placing_dup[i] == 1) {
					placing[i] = placing_dup[i];
				}
			}
			if (typeof animationIntervalID_3 == 'undefined') {
			} else {	
				clearInterval(animationIntervalID_3);
			}
			if (display_animation == true) {
				animationIntervalID_3 = setInterval(function() {animationVerificationProposition()}, timer); //oblgation d'utiliser ceci pour interval de X secondes par lettres
			} else {
				for (i=0 ; i<word_length ; i++) {
					if (placing_dup[initialisationMot] == 0) {
						playsound_letter_missing.play();
					} else if (placing_dup[i] == 1) {
						playsound_letter_ok.play();
						document.getElementById(try_count_index + '_' + i).className = 'correct';
					} else if (placing_dup[i] == 2) {
						playsound_letter_bad.play();
						document.getElementById(try_count_index + '_' + i).className = 'not_in_place';
					}
				}
				word_proposed_tab = [];
				placing_dup = [];
		
				if (word_proposed == word_to_find) { // Mot trouvé
					playsound_victory.play();
				} else {
					nouvelleLigne();
				}
			}
		}
    }
    
    function animationVerificationProposition() {		//Fonction nécéssitant une boucle en amont ; affiche par le code couleur, les cases
		if (placing_dup[verification_index] == 0) {
			playsound_letter_missing.play();
		} else if (placing_dup[verification_index] == 1) {
			playsound_letter_ok.play();
			document.getElementById(try_count_index + '_' + verification_index).className = 'correct';
		} else if (placing_dup[verification_index] == 2) {
			playsound_letter_bad.play();
			document.getElementById(try_count_index + '_' + verification_index).className = 'not_in_place';
		}
		verification_index++;

		if (verification_index == word_length) { // Fin de la vérification
			if (typeof animationIntervalID_3 == 'undefined') {
			} else {	
				clearInterval(animationIntervalID_3);
			}
			verification_index = 0;
			word_proposed_tab = [];
			placing_dup = [];
			
			if (word_proposed == word_to_find) { // Mot trouvé
					playsound_victory.play();
					setTimeout(function() { reinitWord() } , 3000); //reinitialisation de la grille
			} else {
				nouvelleLigne();
			}			
		}
	}