        
		var mot_longueur = 8;
        var nombre_coups_max = 6; // Nombre de coups autorisés ; Hauteur de la grille
        var timer = 300; // Millisecondes de vérification par lettres
		
		var nombre_mots = dictionnaire_8.length; // Nombre mots contenus dans la table dico
		var mot_hasard_index = Math.floor(Math.random() * nombre_mots); // Tirer aléatoirement un nombre inférieur à dico.length
		var mot = dictionnaire_8[mot_hasard_index]; // Stocker le mot tiré
		console.log(mot); // Affichage du mot tiré dans la console
		
		var nombre_coups = 0;
		var verification_index = 0;
		var son_lettre_ok = new Audio('src/sound/lettre_ok.mp3');
		var son_lettre_mauvaise = new Audio('src/sound/lettre_mauvaise.mp3');
		var son_lettre_absente = new Audio('src/sound/lettre_absente.mp3');
		var son_erreur = new Audio('src/sound/erreur.mp3');
		son_lettre_ok.volume = 0.5;
		son_lettre_mauvaise.volume = 0.5;
		son_lettre_absente.volume = 0.5;
		son_erreur.volume = 0.5;
				
		var mot_tableau = new Array(); // Mise dans le tableau mot_tab le mot_a_trouver
        for (var i = 0; i < 8; i++) {
          mot_tableau[i] = mot.substr(i, 1);
        }
		
		var mot_propose_tableau = new Array();
		var lettre_ok = new Array(mot_tableau[0], '', '', '', '', '', '', '');
		var placements = new Array(1, 0, 0, 0, 0, 0, 0, 0); //Vérification du placement des lettres proposées
		//Placement
		//
		// 0 - lettre non présente
		// 1 - lettre bien placée
		// 2 - lettre mal placée
		var lettre_plus = Math.floor(Math.random() * (mot_longueur - 2) + 2); // Seconde lettre au premier mot
		placements[lettre_plus] = 1; // La seconde lettre est une lettre correcte


		// tableau HTML
		var table_html = "<table id=\"motus\">";
        for (var j = 0; j <= nombre_coups_max-1; j++) {
          table_html += "<tr>";
          for (var i = 0; i < mot_longueur; i++) {
            table_html += "<td id=" + j + "_" + i + " class='absent'></td>";
          }
          table_html += "</tr>";
        }
        table_html += "</table>";
        document.write(table_html);
		
	
		// Affichge du premier mot
		for (var i = 0; i < mot_longueur; i++) {
			document.getElementById(0 + '_' + i).innerHTML = ".";
		}
		document.getElementById(0 + '_' + 0).innerHTML = mot_tableau[0]; // Première lettre
		document.getElementById(0 + '_' + lettre_plus).innerHTML = mot_tableau[lettre_plus]; // Seconde lettre


		// Remplacement de chaque lettre par la proposition
		function affichageMot() {
			if (mot_propose_tableau.length != 0) {
				document.getElementById(nombre_coups + '_' + (mot_propose_tableau.length - 1)).innerHTML = mot_propose_tableau[mot_propose_tableau.length-1];
			}
		}
		
		// Vérification de la présence du mot proposé dans le dictionnaire
		function verifPresence(mot_propose) {
			
			existeDictionnaire = false;
			for (i = 0; i < dictionnaire_8.length; i++) {
				if (mot_propose == dictionnaire_8[i]) {
					existeDictionnaire = true;
				} else {
				}
			}
			return existeDictionnaire;
        }
		
		// Ajoute une nouvelle ligne avec les bonnes lettres proposées
		function nouvelleLigne() {
			nombre_coups++;
			if (nombre_coups != nombre_coups_max) {
				for (var i = 0; i < mot_longueur; i++) {
					document.getElementById(nombre_coups + '_' + i).innerHTML = ".";
					if (placements[i] == 1) {
						document.getElementById(nombre_coups + '_' + i).innerHTML = mot_tableau[i];
					}
				}
				mot_propose_tableau = [];
				mot_propose = "";

			} else {
				solutionInterval = setInterval(function() {affichageSolution()}, timer);
			}
		}

		function lettreBonus() {
			for (var i = 0; i < mot_longueur; i++) {
				if (placements[i] == 0) {
					document.getElementById(nombre_coups + '_' + i).innerHTML = mot_tableau[i];
					placements[i] = 1;
					break;
				}
			}
		}

		function affichageSolution() {
			document.getElementById(nombre_coups_max-1 + '_' + verification_index).innerHTML = mot_tableau[verification_index];
			document.getElementById(nombre_coups_max-1 + '_' + verification_index).className = 'correct';
			son_lettre_ok.play();

			if (verification_index == mot_longueur) { // Fin de la vérification
				clearInterval(solutionInterval);
				verification_index = 0;
				mot_propose_tableau = [];
				
			}
		}

		function reinitialisation() {
			nombre_coups = 0;
			mot_propose_tableau = [];
			mot_propose = "";

			for (var j = 0; j <= nombre_coups_max-1; j++) {
				for (var i = 0; i < mot_longueur; i++) {
					document.getElementById(j + '_' + i).innerHTML = "";
					document.getElementById(j + '_' + i).className = 'absent';
				}
					var placements = new Array(0, 0, 0, 0, 0, 0, 0, 0);
			}

			var nombre_mots = dictionnaire_8.length; // Nombre mots contenus dans la table dico
			var mot_hasard_index = Math.floor(Math.random() * nombre_mots); // Tirer aléatoirement un nombre inférieur à dico.length
			var mot = dictionnaire_8[mot_hasard_index]; // Stocker le mot tiré
			console.log(mot); // Affichage du mot tiré dans la console
				
			 // Mise dans le tableau mot_tab le mot_a_trouver
        	for (var i = 0; i < 8; i++) {
         		mot_tableau[i] = mot.substr(i, 1);
        	}
		
			var lettre_ok = new Array(mot_tableau[0], '', '', '', '', '', '', '');
			var placements = new Array(1, 0, 0, 0, 0, 0, 0, 0); //Vérification du placement des lettres proposées
			//Placement
			//
			// 0 - lettre non présente
			// 1 - lettre bien placée
			// 2 - lettre mal placée
			var lettre_plus = Math.floor(Math.random() * (mot_longueur - 2) + 2); // Seconde lettre au premier mot
			placements[lettre_plus] = 1; // La seconde lettre est une lettre correcte

			for (var i = 0; i < mot_longueur; i++) {
				document.getElementById(0 + '_' + i).innerHTML = ".";
			}
			document.getElementById(0 + '_' + 0).innerHTML = mot_tableau[0]; // Première lettre
			document.getElementById(0 + '_' + lettre_plus).innerHTML = mot_tableau[lettre_plus]; // Seconde lettre
		}





		
		// Véfification de chaque lettre en fonction du mot
		function verifieLettre() {
			
			if (mot_tableau[verification_index] == mot_propose_tableau[verification_index]) { //lettre bien placées
				lettre_ok[verification_index] = mot_tableau[verification_index];
				placements[verification_index] = 1;
				son_lettre_ok.play();
				document.getElementById(nombre_coups + '_' + verification_index).className = 'correct';
            }
			if (placements[verification_index] != 1) { //lettre au mauvais endroit
				for (var j = 0; j < mot_longueur; j++) { //boucle de vérification des lettres dans le mot pour la lettre proposition[i]
					if ((mot_propose_tableau[verification_index] == mot_tableau[j]) && (placements[j] == 0)) {
						placements[j] = 2;
						j = mot_longueur;
					}
				}
				
				if (placements[verification_index] == 2) {
					son_lettre_mauvaise.play();
					document.getElementById(nombre_coups + '_' + verification_index).className = 'incorrect';
				}
				
				if (placements[verification_index] == 0) {
					son_lettre_absente.play();
				}
			} 
			
			verification_index++;
				
			if (verification_index == mot_longueur) { // Fin de la vérification
				clearInterval(verificationInterval);
				verification_index = 0;
				mot_propose_tableau = [];
				
				if (mot_propose == mot) { // Mot trouvé
					 setTimeout(function() { location.reload(true); } , 2000); //rafraichissement de la page
				} else {
					nouvelleLigne();
				}
				
			}
			
		}
		
		// Touches tapées
		document.addEventListener("keydown", function(event) {
            if (mot_propose_tableau.length < mot_longueur ) {
				if (event.keyCode == 65 || event.keyCode == 97) {
					mot_propose_tableau.push('A');
				} else if (event.keyCode == 66 || event.keyCode == 98) {
					mot_propose_tableau.push('B');
				} else if (event.keyCode == 67 || event.keyCode == 99) {
					mot_propose_tableau.push('C');
				} else if (event.keyCode == 68 || event.keyCode == 100) {
					mot_propose_tableau.push('D');
				} else if (event.keyCode == 69 || event.keyCode == 101) {
					mot_propose_tableau.push('E');
				} else if (event.keyCode == 70 || event.keyCode == 102) {
					mot_propose_tableau.push('F');
				} else if (event.keyCode == 71 || event.keyCode == 103) {
					mot_propose_tableau.push('G');
				} else if (event.keyCode == 72 || event.keyCode == 104) {
					mot_propose_tableau.push('H');
				} else if (event.keyCode == 73 || event.keyCode == 105) {
					mot_propose_tableau.push('I');
				} else if (event.keyCode == 74 || event.keyCode == 106) {
					mot_propose_tableau.push('J');
				} else if (event.keyCode == 75 || event.keyCode == 107) {
					mot_propose_tableau.push('K');
				} else if (event.keyCode == 76 || event.keyCode == 108) {
					mot_propose_tableau.push('L');
				} else if (event.keyCode == 77 || event.keyCode == 109) {
					mot_propose_tableau.push('M');
				} else if (event.keyCode == 78 || event.keyCode == 110) {
					mot_propose_tableau.push('N');
				} else if (event.keyCode == 79 || event.keyCode == 111) {
					mot_propose_tableau.push('O');
				} else if (event.keyCode == 80 || event.keyCode == 112) {
					mot_propose_tableau.push('P');
				} else if (event.keyCode == 81 || event.keyCode == 113) {
					mot_propose_tableau.push('Q');
				} else if (event.keyCode == 82 || event.keyCode == 114) {
					mot_propose_tableau.push('R');
				} else if (event.keyCode == 83 || event.keyCode == 115) {
					mot_propose_tableau.push('S');
				} else if (event.keyCode == 84 || event.keyCode == 116) {
					mot_propose_tableau.push('T');
				} else if (event.keyCode == 85 || event.keyCode == 117) {
					mot_propose_tableau.push('U');
				} else if (event.keyCode == 86 || event.keyCode == 118) {
					mot_propose_tableau.push('V');
				} else if (event.keyCode == 87 || event.keyCode == 119) {
					mot_propose_tableau.push('W');
				} else if (event.keyCode == 88 || event.keyCode == 120) {
					mot_propose_tableau.push('X');
				} else if (event.keyCode == 89 || event.keyCode == 121) {
					mot_propose_tableau.push('Y');
				} else if (event.keyCode == 90 || event.keyCode == 122) {
					mot_propose_tableau.push('Z');
				}
			} 
			if (event.keyCode == 8) {  // Retour arrière
                console.log('Erase');
				document.getElementById(nombre_coups + '_' + (mot_propose_tableau.length - 1)).innerHTML = ".";
                mot_propose_tableau.pop();
				
			} else if (event.keyCode == 13) { // Entrer
                console.log('Entrer');
				
				if (mot_propose_tableau.length != mot_longueur) {  //vérification de la longueur du mot
					console.log("La longueur du mot n'est pas la bonne.");
					son_erreur.play();
				} else {
					verifPresence(mot_propose);
					
					if (existeDictionnaire === false) {
						console.log("Mot non présent dans le dictionnaire");
						son_erreur.play();
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
			}
			
			console.log(mot_propose_tableau);  // Affichage du tableau mot_propose_tableau
			mot_propose = mot_propose_tableau.join(''); // Affichage du mot proposé
			
			affichageMot();
		}
	)
		
