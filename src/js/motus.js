        
		//
		//	Configuraiton  //
		//


		var word_length = 8;
        var try_number_max = 6; // Nombre de coups autorisés ; Hauteur de la grille
		var timer = 300; // Millisecondes de vérification par lettres
		

		

		 
		//
		//	Initialisation  //
		//

		// creation de variables
		var word_count = dictionary.length; // Nombre mots contenus dans la table dico
		var word_random_index = Math.floor(Math.random() * word_count); // Tirer aléatoirement un nombre inférieur à dico.length
		var word_to_find = dictionary[word_random_index]; // Stocker le word_to_find tiré
		console.log(word_to_find); // Affichage du word_to_find tiré dans la console
		
		var try_count_index = 0;
		var verification_index = 0;
		var sound_ok = new Audio('src/sound/lettre_ok.mp3');
		var sound_bad = new Audio('src/sound/lettre_mauvaise.mp3');
		var sound_missing = new Audio('src/sound/lettre_absente.mp3');
		var son_wrong = new Audio('src/sound/erreur.mp3');
		sound_ok.volume = 0.5;
		sound_bad.volume = 0.5;
		sound_missing.volume = 0.5;
		son_wrong.volume = 0.5;
				
		var word_tab = new Array(); // Mise dans le tableau mot_tab le mot_a_trouver
        for (var i = 0; i < 8; i++) {
          word_tab[i] = word_to_find.substr(i, 1);
        }
		
		var word_proposed_tab = new Array();
		var lettre_ok = new Array(word_tab[0], '', '', '', '', '', '', '');
		var placing = new Array(1, 0, 0, 0, 0, 0, 0, 0); //Vérification du placement des lettres proposées
		//Placement
		//
		// 0 - lettre non présente
		// 1 - lettre bien placée
		// 2 - lettre mal placée
		var letter_plus = Math.floor(Math.random() * (word_length - 2) + 2); // Seconde lettre au premier word_to_find
		placing[letter_plus] = 1; // La seconde lettre est une lettre correcte


		// tableau HTML
		var table_html = "<table id=\"motus\">";
        for (var j = 0; j <= try_number_max-1; j++) {
          table_html += "<tr>";
          for (var i = 0; i < word_length; i++) {
            table_html += "<td id=" + j + "_" + i + " class='absent'></td>";
          }
          table_html += "</tr>";
        }
        table_html += "</table>";
        document.write(table_html);
		
	
		// Affichge du premier word_to_find
		for (var i = 0; i < word_length; i++) {
			document.getElementById(0 + '_' + i).innerHTML = ".";
		}
		document.getElementById(0 + '_' + 0).innerHTML = word_tab[0]; // Première lettre
		document.getElementById(0 + '_' + letter_plus).innerHTML = word_tab[letter_plus]; // Seconde lettre


		
		

		

		 
		//
		//	affichageMot  //
		//


		// Remplacement de chaque lettre par la proposition
		function affichageMot() {
			if (word_proposed_tab.length != 0) {
				document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = word_proposed_tab[word_proposed_tab.length-1];
			}
		}
		
		

		

		 
		//
		//	verifPrésence  //
		//


		// Vérification de la présence du word_to_find proposé dans le dictionary
		function verifPresence(word_proposed) {
			in_dictionary = false;
			for (i = 0; i < dictionary.length; i++) {
				if (word_proposed == dictionary[i]) {
					in_dictionary = true;
				} else {
				}
			}
			return in_dictionary;
        }
		
		

		

		 
		//
		//	nouvelleLigne  //
		//


		// Ajoute une nouvelle ligne avec les bonnes lettres proposées
		function nouvelleLigne() {
			try_count_index++;
			if (try_count_index != try_number_max) {
				for (var i = 0; i < word_length; i++) {
					document.getElementById(try_count_index + '_' + i).innerHTML = ".";
					if (placing[i] == 1) {
						document.getElementById(try_count_index + '_' + i).innerHTML = word_tab[i];
					}
				}
				word_proposed_tab = [];
				word_proposed = "";

			} else {
				solutionInterval = setInterval(function() {affichageSolution()}, timer);
			}
		}

		

		

		 
		//
		//	lettreBonus  //
		//


		function lettreBonus() {
			for (var i = 0; i < word_length; i++) {
				if (placing[i] == 0) {
					document.getElementById(try_count_index + '_' + i).innerHTML = word_tab[i];
					placing[i] = 1;
					break;
				}
			}
		}

		

		

		 
		//
		//	affichageSolution  //
		//


		function affichageSolution() {
			document.getElementById(try_number_max-1 + '_' + verification_index).innerHTML = word_tab[verification_index];
			document.getElementById(try_number_max-1 + '_' + verification_index).className = 'correct';
			sound_ok.play();

			if (verification_index == word_length) { // Fin de la vérification
				clearInterval(solutionInterval);
				verification_index = 0;
				word_proposed_tab = [];
				
			}
		}

		

		

		 
		//
		//	suppressionLigne  //
		//


		function suppressionLigne() {
			for (var i = 0; i < word_length; i++) {
					document.getElementById(try_count_index + '_' + i).innerHTML = "";
					document.getElementById(try_count_index + '_' + i).className = 'absent';
				}
			var placing = new Array(0, 0, 0, 0, 0, 0, 0, 0);
			try_count_index--;
		}

		

		

		 
		//
		//	verifieLettre  //
		//


		// Véfification de chaque lettre en fonction du word_to_find
		function verifieLettre() {

			
			console.log(placing);
			
			if (word_tab[verification_index] == word_proposed_tab[verification_index]) { //lettre bien placées
				lettre_ok[verification_index] = word_tab[verification_index];
				placing[verification_index] = 1;
				sound_ok.play();
				document.getElementById(try_count_index + '_' + verification_index).className = 'correct';
            }
			if (placing[verification_index] != 1) { //lettre au mauvais endroit
				for (var j = 0; j < word_length; j++) { //boucle de vérification des lettres dans le word_to_find pour la lettre proposition[i]
					if ((word_proposed_tab[verification_index] == word_tab[j]) && (placing[j] == 0)) {
						placing[j] = 2;
						j = word_length;
					}
				}
				
				if (placing[verification_index] == 2) {
					sound_bad.play();
					document.getElementById(try_count_index + '_' + verification_index).className = 'incorrect';
				}
				
				if (placing[verification_index] == 0) {
					sound_missing.play();
				}
			} 
			
			verification_index++;
				
			if (verification_index == word_length) { // Fin de la vérification
				clearInterval(verificationInterval);
				verification_index = 0;
				word_proposed_tab = [];
				
				if (word_proposed == word_to_find) { // Mot trouvé
					 setTimeout(function() { reinitialisation() } , 2000); //rafraichissement de la page
				} else {
					nouvelleLigne();
				}			
			}
		}
		
		

		

		 
		//
		//	toucheTapées  //
		//


		// Touches tapées
		document.addEventListener("keydown", function(event) {
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
				document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = ".";
                word_proposed_tab.pop();
				
			} else if (event.keyCode == 13) { // Entrer
                console.log('Entrer');
				
				if (word_proposed_tab.length != word_length) {  //vérification de la longueur du word_to_find
					console.log("La longueur du word_to_find n'est pas la bonne.");
					son_wrong.play();
				} else {
					verifPresence(word_proposed);
					
					if (in_dictionary === false) {
						console.log("Mot non présent dans le dictionary");
						son_wrong.play();
					} else {
						verificationInterval = setInterval(function() {verifieLettre()}, timer);
					}
				}
				
			} else if (event.keyCode == 49) { // &
                console.log('Touche & (1)');
                nouvelleLigne();
			} else if (event.keyCode == 50) { // é
				console.log('Touche é (2)');
				nouvelleLigne();
				lettreBonus();
			} else if (event.keyCode == 51) { // "
				console.log('Touche é (3)');
				solutionInterval = setInterval(function() {affichageSolution()}, timer);
			} else if (event.keyCode == 52) { // "
				console.log("Touche ' (4)");
				reinitialisation();
			} else if (event.keyCode == 53) { // "
				console.log("Touche ( (5)");
				suppressionLigne();
			}

			word_proposed = word_proposed_tab.join(''); // Affichage du word_to_find proposé
			affichageMot();
		}

	)

	

		

		 
		//
		//	reinitialisation  //
		//


		function reinitialisation() {

		for (var i = 0; i < word_length; i++) {  //reinit placing
			placing[i] = "0";
		}

		word_count = dictionary.length;
		word_random_index = Math.floor(Math.random() * word_count);
		word_to_find = dictionary[word_random_index];
		console.log(word_to_find);
		
		try_count_index = 0;
		verification_index = 0;
				
		word_tab = new Array(); // Mise dans le tableau mot_tab le mot_a_trouver
        for (var i = 0; i < 8; i++) {
          word_tab[i] = word_to_find.substr(i, 1);
        }
		
		word_proposed_tab = [];
		lettre_ok = new Array(word_tab[0], '', '', '', '', '', '', '');
		placing = new Array(1, 0, 0, 0, 0, 0, 0, 0); //Vérification du placement des lettres proposées
		letter_plus = Math.floor(Math.random() * (word_length - 2) + 2); // Seconde lettre au premier word_to_find
		placing[letter_plus] = 1; // La seconde lettre est une lettre correcte

		for (var j = 0; j <= try_number_max-1; j++) {
			for (var i = 0; i < word_length; i++) {
				document.getElementById(j + '_' + i).innerHTML = "";
				document.getElementById(j + '_' + i).className = 'absent';
			}
		}
			
		// Affichge du premier word_to_find
		for (var i = 0; i < word_length; i++) {
			document.getElementById(0 + '_' + i).innerHTML = ".";
		}
		document.getElementById(0 + '_' + 0).innerHTML = word_tab[0]; // Première lettre
		document.getElementById(0 + '_' + letter_plus).innerHTML = word_tab[letter_plus]; // Seconde lettre
	}
