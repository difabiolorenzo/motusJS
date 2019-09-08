	var timer = 300; // Millisecondes de vérification par lettres
	
	var try_number_max = localStorage.getItem('try_count');
	var word_length = localStorage.getItem('word_length');
	var display_definitions = localStorage.getItem('display_definitions');
	var display_animation = localStorage.getItem('display_animation');
	var display_debug_info = localStorage.getItem('display_debug_info');
	var allow_duplication = localStorage.getItem('allow_duplication');
	var countdown_enabled = localStorage.getItem('countdown_enabled');
	var countdown_time = localStorage.getItem('countdown_time');

	var team_yellow_name = localStorage.getItem('team_yellow_name');
	var team_blue_name = localStorage.getItem('team_blue_name');
	var team_yellow_score = 0;
	var team_blue_score = 0;
	var team_turn = "yellow";		// L'équipe jaune commence la partie

	var try_count_index = -1;
	var verification_index = 0;
	var already_proposed = false;
	var pause = true;
	
	var sound_ok = new Audio('src/sound/lettre_ok.mp3');
	var sound_bad = new Audio('src/sound/lettre_mauvaise.mp3');
	var sound_missing = new Audio('src/sound/lettre_absente.mp3');
	var sound_wrong = new Audio('src/sound/erreur.mp3');
	sound_ok.volume = 0.5;
	sound_bad.volume = 0.5;
	sound_missing.volume = 0.5;
	sound_wrong.volume = 0.5;

	var lettre_ok = new Array();
	var placing = new Array();
	var placing_dup = new Array();

	var word_count = dictionary.length; // Nombre mots contenus dans la table dictionnaire
	var word_to_find = dictionary[Math.floor(Math.random() * word_count)]; // Stocker le word_to_find tiré
	var word_to_find_tab = new Array();

	var word_proposed_tab_list = new Array();
	var word_proposed_tab = new Array();
	var word_composed_letter = new Array();
	var word_composed_letter_exist = false;
	var word_composed_letter_amount = new Array();
	var word_composed_letter_amount_dup = new Array();
				
	// score et nom d'equipes
	document.getElementById("team-yellow-name").innerHTML = team_yellow_name;
	document.getElementById("team-blue-name").innerHTML = team_blue_name;
	document.getElementById("team-yellow-score").innerHTML = team_yellow_score;
	document.getElementById("team-blue-score").innerHTML = team_blue_score;

	if (team_turn == "yellow") {
		displayMessage(team_yellow_name+" commence!", "#FBC800");
	} else {
		displayMessage(team_blue_name+" commence!", "#1681C7");
	}


	function changeTeamTurn() {
		if (team_turn == "yellow") {
			team_turn = "blue";
			displayMessage("La main passe à "+team_blue_name, "#1681C7");
		} else {
			team_turn = "yellow";
			displayMessage("La main passe à "+team_yellow_name, "#FBC800");
		}
		clearInterval(changeTeamTurnInterval);
	}

	function ajoutScore(score, team) {
		if (team == "yellow") {
			displayMessage(score+" points ajouté à "+team_yellow_name, "#FBC800");
			team_yellow_score = (team_yellow_score + score);
		} else {
			displayMessage(score+" points ajouté à "+team_blue_name, "#1681C7");
			team_blue_score = (team_blue_score + score);
		}
		document.getElementById("team-yellow-score").innerHTML = team_yellow_score;
		document.getElementById("team-blue-score").innerHTML = team_blue_score;
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
		
		console.log("word_to_find " + word_to_find); // Affichage du word_to_find tiré dans la console
		console.log("word_composed_letter " + word_composed_letter);
		console.log("word_composed_letter_amount " + word_composed_letter_amount);
		
		var letter_plus = Math.floor(Math.random() * (word_length - 2) + 2); // Seconde lettre au premier word_to_find
		placing[letter_plus] = 1; // La seconde lettre est une lettre correcte
	}
	initialisationMot()

	function CreationTableauHTML() {
		var table_html = "<table id=\"motus\">";
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

	function affichageMot() {		// Remplacement de chaque lettre par la proposition
		if (word_proposed_tab.length != 0) {
			document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = word_proposed_tab[word_proposed_tab.length-1];
		}
	}

	function verifPresence(word_proposed) {		// Vérification de la présence du word_to_find proposé dans le dictionary
		in_dictionary = false;
		for (i = 0; i < dictionary.length; i++) {
			if (word_proposed == dictionary[i]) {
				in_dictionary = true;
			} else {
			}
		}
		return in_dictionary;
	}

	function verifDuplication(word_proposed) {		// Vérification de la présence du word_to_find proposé dans le dictionary
		for (i = 0; i < word_proposed_tab_list.length; i++) {
			if (word_proposed == word_proposed_tab_list[i]) {
				already_proposed = true;
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
			solutionInterval = setInterval(function() {affichageSolution()}, timer);
		}
	}

	
	nouvelleLigne();

	
	function ajoutLettreBonus() {		// Ajoute une lettre bonnus dans les emplacement non trouvés
		for (var i = 0; i < word_length; i++) {
			if (placing[i] != 1) {
				document.getElementById(try_count_index + '_' + i).innerHTML = word_to_find_tab[i];
				placing[i] = 1;
				break;
			}
		}
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
			console.log("Mot non présent dans le dictionary");
			displayMessage("Mot non présent dans le dictionnaire.", "#b11f0e");
		} else if (errorCode == 3) {
			console.log("Mot déjà proposé");
			displayMessage("Mot déjà proposé.", "#b11f0e");
		}
		sound_wrong.play();
		changeTeamTurnInterval = setInterval(function() {changeTeamTurn()}, 3000);
	}

	function displayMessage(message, colorHex) {	// Affiche une bannière
		document.getElementById("message").style.opacity = 1;
		document.getElementById("message").style.backgroundColor = colorHex;
		document.getElementById("messagePlaceolder").innerHTML = message;
		displayMessageInterval = setInterval(function() {hideMessage()}, 3000);
	}
	function hideMessage() {
		document.getElementById("message").style.opacity = 0;
		clearInterval(displayMessageInterval);
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
			animationInterval = setInterval(function() {animationVerificationProposition()}, timer); //oblgation d'utiliser ceci pour interval de X secondes par lettres
		}
	}
	
	function animationVerificationProposition() {		//Fonction nécéssitant une boucle en amont ; affiche par le code couleur, les cases
		if (placing_dup[verification_index] == 0) {
			sound_missing.play();
		} else if (placing_dup[verification_index] == 1) {
			sound_ok.play();
			document.getElementById(try_count_index + '_' + verification_index).className = 'correct';
		} else if (placing_dup[verification_index] == 2) {
			sound_bad.play();
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
					ajoutScore(50, team_turn)
					setTimeout(function() { reinit() } , 3000); //rafraichissement de la page
			} else {
				nouvelleLigne();
			}			
		}
	}

	function affichageSolution() {		// Affiche la solution à la dérnière ligne
		document.getElementById(try_number_max-1 + '_' + verification_index).innerHTML = word_to_find_tab[verification_index];
		document.getElementById(try_number_max-1 + '_' + verification_index).className = 'correct';
		sound_ok.play();
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
	
		try_count_index = -1;
		verification_index = 0;
		word_proposed_tab_list = [];
		word_proposed_tab = [];


		word_count = dictionary.length;
		word_random_index = Math.floor(Math.random() * word_count);
		word_to_find = dictionary[word_random_index];
						
        initialisationMot()
		reinitilisationTableau()


		nouvelleLigne();
	}