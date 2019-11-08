	var timer = 300;															// Millisecondes de vérification par lettres
	
	var try_number_max = localStorage.getItem('try_count');						// Nombre de ligne dans la grille
	var word_length = localStorage.getItem('word_length');						// Nombre de lettres
	var display_definitions = localStorage.getItem('display_definitions');		//Inutilisé
	var display_animation = localStorage.getItem('display_animation');			//Inutilisé
	var display_debug_info = localStorage.getItem('display_debug_info');		//Inutilisé
	var allow_duplication = localStorage.getItem('allow_duplication');			//	Autoriation de la duplication des propositions
	var countdown_enabled = localStorage.getItem('countdown_enabled');			//Inutilisé
	var countdown_time = localStorage.getItem('countdown_time');				//Inutilisé
	
	var team_yellow_name = localStorage.getItem('team_yellow_name');			//	Nom de l'équipe jaune
	var team_blue_name = localStorage.getItem('team_blue_name');				//	Nom de l'équipe Bleue
	var team_turn = localStorage.getItem('team_turn');							//	Equipe qui commence la partie
	var team_yellow_score = 0;													// Score au début de la partie pour l'équipe jaune
	var team_blue_score = 0;													// Score au début de la partie pour l'équipe bleue		

	var try_count_index = -1;
	var lettre_plus_amount = 1;
	var verification_index = 0;
	var already_proposed = false;
	
	var lettre_ok = new Array();
	var placing = new Array();
	var placing_dup = new Array();

	var dictionary = new Array(dictionary_5, dictionary_6, dictionary_7, dictionary_8, dictionary_9, dictionary_10);
	dictionary_used = dictionary[word_length-5];

	var word_count = dictionary_used.length; // Nombre mots contenus dans la table dictionnaire

	var random_index = Math.floor(Math.random() * word_count); // Choix d'un nombre aleatoire <= au nombre de mots.
	var word_to_find = dictionary_used[random_index]; // Stocker le word_to_find tiré
	var word_to_find_tab = new Array();

	var word_proposed_tab_list = new Array();
	var word_proposed_tab = new Array();
	var word_composed_letter = new Array();
	var word_composed_letter_exist = false;
	var word_composed_letter_amount = new Array();
	var word_composed_letter_amount_dup = new Array();



				
	// // score et nom d'equipes
		document.getElementById("team-yellow-score").innerHTML = team_yellow_name + " - " + team_yellow_score;
		document.getElementById("team-blue-score").innerHTML = team_blue_name + " - " + team_blue_score;

	if (team_turn == "yellow") {
		displayMessage(team_yellow_name+" commence!", "#FBC800");
		document.getElementById("score-placeolder-yellow").style.border = "5px solid #ffffffff";
		document.getElementById("score-placeolder-blue").style.border = "5px solid #ffffff40";
	} else if (team_turn == "blue") {
		displayMessage(team_blue_name+" commence!", "#1681C7");
		document.getElementById("score-placeolder-yellow").style.border = "5px solid #ffffff40";
		document.getElementById("score-placeolder-blue").style.border = "5px solid #ffffffff";
	}



	function changeTeamTurn() {
		if (team_turn == "yellow") {
			team_turn = "blue";
			displayMessage("La main passe à "+team_blue_name, "#1681C7");
			document.getElementById("score-placeolder-yellow").style.border = "5px solid #ffffff40";
			document.getElementById("score-placeolder-blue").style.border = "5px solid #ffffffff";
			
			document.getElementById("grid_number_yellow").style.display = "none";
			document.getElementById("grid_number_blue").style.display = "inline-table";
		} else {
			team_turn = "yellow";
			displayMessage("La main passe à "+team_yellow_name, "#FBC800");
			document.getElementById("score-placeolder-yellow").style.border = "5px solid #ffffffff";
			document.getElementById("score-placeolder-blue").style.border = "5px solid #ffffff40";
			
			document.getElementById("grid_number_yellow").style.display = "inline-table";
			document.getElementById("grid_number_blue").style.display = "none";
		}
	}

	

	function ajoutScore(score, team) {
		if (team == "yellow") {
			displayMessage(score+" points ajoutés à "+team_yellow_name, "#FBC800");
			team_yellow_score = (team_yellow_score + score);
		} else {
			displayMessage(score+" points ajoutés à "+team_blue_name, "#1681C7");
			team_blue_score = (team_blue_score + score);
		}
		document.getElementById("team-yellow-score").innerHTML = team_yellow_name + " - " + team_yellow_score;
		document.getElementById("team-blue-score").innerHTML = team_blue_name + " - " + team_blue_score;
	}

	function initialisationMot() {		// Mise dans le tableau word_to_find le word_to_find
		placing = [];
		placing_dup = [];
		lettre_ok = [];
		word_composed_letter = [];
		word_composed_letter_amount = [];
		word_composed_letter_amount_dup = [];
		
		for (var i = 0; i < word_length; i++) {
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
		
		console.log("word_to_find " + word_to_find + ", index: " + random_index); // Affichage du word_to_find tiré dans la console
		console.log("word_composed_letter " + word_composed_letter);
		console.log("word_composed_letter_amount " + word_composed_letter_amount);
		
		for (i=0; i<lettre_plus_amount; i++) {
			var letter_plus = Math.floor(Math.random() * (word_length - 2) + 2); // Seconde lettre au premier word_to_find
			placing[letter_plus] = 1; // La seconde lettre est une lettre correcte
		}
	}
	initialisationMot()

	function CreationTableauHTML() {
		var table_html = "<table id=\"table_letter\">";
		for (var j = 0; j <= try_number_max-1; j++) {
			table_html += "<tr>";
			for (var i = 0; i < word_length; i++) {
			table_html += "<td id=" + j + "_" + i + " class='not_present'></td>";
			}
			table_html += "</tr>";
		}
		table_html += "</table>";
		document.write(table_html);
	}
	CreationTableauHTML()

	function reinitilisationTableau() {
		for (var j = 0; j <= try_number_max-1; j++) {
			for (var i = 0; i < word_length; i++) {
				document.getElementById(j + '_' + i).innerHTML = "";
				document.getElementById(j + '_' + i).className = 'not_present';
			}
		}
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
	
	function ajoutLettreBonus() {		// Ajoute une lettre bonnus dans les emplacement non trouvés
		for (var i = 0; i < word_length; i++) {
			if (placing[i] != 1) {
				document.getElementById(try_count_index + '_' + i).innerHTML = word_to_find_tab[i];
				placing[i] = 1;
				playsound_letter_bonus.play();

				j = 0;
				letter_bonus_placement = i;
				if (display_animation == "true") {
					animationLettreBonusInterval = setInterval(function() {animationLettreBonus()}, 100);
				} else {
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
			clearInterval(animationLettreBonusInterval);
		}
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

	function errorHandler(errorCode) {		// Affiche dans la console le terme de l'erreur
		if (errorCode == 1) {
			console.log("La longueur du word_to_find n'est pas la bonne.");
			displayMessage("La longueur du mot proposé n'est pas la bonne.", "#b11f0e");
		} else if (errorCode == 2) {
			console.log("Mot non présent dans le dictionnaire");
			displayMessage("Mot non présent dans le dictionnaire.", "#b11f0e");
		} else if (errorCode == 3) {
			console.log("Mot déjà proposé");
			displayMessage("Mot déjà proposé.", "#b11f0e");
		}
		playsound_letter_missing.play();
		playsound_wrong.play();
		changeTeamTurn();
	}

	function displayMessage(message, colorHex) {	// Affiche une bannière
		document.getElementById("message").style.backgroundColor = colorHex;
		document.getElementById("messagePlaceolder").innerHTML = message;
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
			if (typeof verificationInterval == 'undefined') {
			} else {	
				clearInterval(verificationInterval);
			}
			if (display_animation == "true") {
				animationInterval = setInterval(function() {animationVerificationProposition()}, timer); //oblgation d'utiliser ceci pour interval de X secondes par lettres
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
					ajoutScore(50, team_turn);
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
			if (typeof animationInterval == 'undefined') {
			} else {	
				clearInterval(animationInterval);
			}
			verification_index = 0;
			word_proposed_tab = [];
			placing_dup = [];
			
			if (word_proposed == word_to_find) { // Mot trouvé
					ajoutScore(50, team_turn);
					playsound_victory.play();
					
					setTimeout(function() { reinit() } , 3000); //reinitialisation de la grille
			} else {
				nouvelleLigne();
			}			
		}
	}

	function affichageSolution() {		// Affiche la solution à la dérnière ligne, necessite une boucle en amont
		if (display_animation == "true") {
			solutionInterval = setInterval(function() {animationAfficheSolution()}, timer);
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
			clearInterval(solutionInterval);
		}
	}

	function reinit() {		// Réinitialisation
		if (typeof solutionInterval == 'undefined') { //arret de l'animation de la solution
		} else {	
			clearInterval(solutionInterval);
		}
		
		if (typeof animationLettreBonusInterval == 'undefined') { //arret de l'animation de la solution
		} else {	
			clearInterval(animationLettreBonusInterval);
        }
	
		try_count_index = -1;
		verification_index = 0;
		word_proposed_tab_list = [];
		word_proposed_tab = [];


		word_count = dictionary_used.length;
		word_random_index = Math.floor(Math.random() * word_count);
		word_to_find = dictionary_used[word_random_index];
						
        initialisationMot()
		reinitilisationTableau()
	}