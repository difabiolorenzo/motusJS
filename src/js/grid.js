	var try_number_max = 6; // Nombre de coups autorisés ; Hauteur de la grille
	var timer = 300; // Millisecondes de vérification par lettres
	
	var word_length = localStorage.getItem('word_length');
	var display_definitions = localStorage.getItem('display_definitions');
	var allow_duplication = localStorage.getItem('allow_duplication');
	var use_countdown = localStorage.getItem('use_countdown');
	var countdown_time = localStorage.getItem('countdown_time');

	var word_count = dictionary.length; // Nombre mots contenus dans la table dictionnaire
	var word_to_find = dictionary[Math.floor(Math.random() * word_count)]; // Stocker le word_to_find tiré
	var word_proposed_tab_list = new Array();
	var word_proposed_tab = new Array();
	console.log(word_to_find); // Affichage du word_to_find tiré dans la console
	var try_count_index = 0;
	var verification_index = 0;
	var already_proposed = false;
	var pause = true;
		
	var team_yellow_name = localStorage.getItem('team_yellow_name');
	var team_blue_name = localStorage.getItem('team_blue_name');
	var team_yellow_score = 0;
	var team_blue_score = 0;

	var sound_ok = new Audio('src/sound/lettre_ok.mp3');
	var sound_bad = new Audio('src/sound/lettre_mauvaise.mp3');
	var sound_missing = new Audio('src/sound/lettre_absente.mp3');
	var sound_wrong = new Audio('src/sound/erreur.mp3');
	sound_ok.volume = 0.5;
	sound_bad.volume = 0.5;
	sound_missing.volume = 0.5;
	sound_wrong.volume = 0.5;
				
	



	// score et nom d'equipes
	document.getElementById("team-yellow-name").innerHTML = team_yellow_name;
	document.getElementById("team-blue-name").innerHTML = team_blue_name;
	document.getElementById("team-yellow-score").innerHTML = team_yellow_score;
	document.getElementById("team-blue-score").innerHTML = team_blue_score;

	var word_tab = new Array(); // Mise dans le tableau mot_tab le mot_a_trouver
	for (var i = 0; i < word_length; i++) {
		word_tab[i] = word_to_find.substr(i, 1);
	}
	
	if (word_length == 7) {
		var lettre_ok = new Array(word_tab[0], '', '', '', '', '', '');
		var placing = new Array(1, 0, 0, 0, 0, 0, 0); //Vérification du placement des lettres proposées
	} else if (word_length == 8) {
		var lettre_ok = new Array(word_tab[0], '', '', '', '', '', '', '');
		var placing = new Array(1, 0, 0, 0, 0, 0, 0, 0); //Vérification du placement des lettres proposées
	} else if (word_length == 9) {
		var lettre_ok = new Array(word_tab[0], '', '', '', '', '', '', '', '');
		var placing = new Array(1, 0, 0, 0, 0, 0, 0, 0, 0); //Vérification du placement des lettres proposées
	} else if (word_length == 10) {
		var lettre_ok = new Array(word_tab[0], '', '', '', '', '', '', '', '', '');
		var placing = new Array(1, 0, 0, 0, 0, 0, 0, 0, 0, 0); //Vérification du placement des lettres proposées
	}
	var letter_plus = Math.floor(Math.random() * (word_length - 2) + 2); // Seconde lettre au premier word_to_find
	placing[letter_plus] = 1; // La seconde lettre est une lettre correcte

	// tableau HTML
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
	
	// Affichge du premier word_to_find
	for (var i = 0; i < word_length; i++) {
		document.getElementById(0 + '_' + i).innerHTML = ".";
	}
	document.getElementById(0 + '_' + 0).innerHTML = word_tab[0]; // Première lettre
	document.getElementById(0 + '_' + letter_plus).innerHTML = word_tab[letter_plus]; // Seconde lettre

	
	// Remplacement de chaque lettre par la proposition
	function affichageMot() {
		if (word_proposed_tab.length != 0) {
			document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = word_proposed_tab[word_proposed_tab.length-1];
		}
	}
	

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
	
	
	// Vérification de la présence du word_to_find proposé dans le dictionary
	function verifDuplication(word_proposed) {
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

	
	function lettreBonus() {
		for (var i = 0; i < word_length; i++) {
			if (placing[i] == 0) {
				document.getElementById(try_count_index + '_' + i).innerHTML = word_tab[i];
				placing[i] = 1;
				break;
			}
		}
	}

	
	function affichageSolution() {
		document.getElementById(try_number_max-1 + '_' + verification_index).innerHTML = word_tab[verification_index];
		document.getElementById(try_number_max-1 + '_' + verification_index).className = 'correct';
		sound_ok.play();
		verification_index++;

		if (verification_index == word_length) { // Fin de la vérification
			word_proposed_tab = [];
			verification_index = 0;
			clearInterval(solutionInterval);
		}
	}

	
	function suppressionLigne() {
		for (var i = 0; i < word_length; i++) {
				document.getElementById(try_count_index + '_' + i).innerHTML = "";
				document.getElementById(try_count_index + '_' + i).className = 'not_present';
			}

		if (word_length == 7) {
			var placing = new Array(0, 0, 0, 0, 0, 0, 0);
		} else if (word_length == 8) {
			var placing = new Array(0, 0, 0, 0, 0, 0, 0, 0);
		} else if (word_length == 9) {
			var placing = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
		} else if (word_length == 10) {
			var placing = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		}
		try_count_index--;
	}

	
	// Véfification de chaque lettre en fonction du word_to_find
	console.log(placing);
	function verifieLettre() {
		if (word_tab[verification_index] == word_proposed_tab[verification_index]) { //lettre bien placées
			lettre_ok[verification_index] = word_tab[verification_index];
			placing[verification_index] = 1;
			sound_ok.play();
			document.getElementById(try_count_index + '_' + verification_index).className = 'correct';
		}

		if (placing[verification_index] != 1) { //lettre pas coorespondante au placement du mot
			for (var i = 0; i < word_length; i++) {
				if ((word_proposed_tab[verification_index] == word_tab[i]) && (placing[j] != 1)) {
					placing[verification_index] = 2;
				}
			}
		}

		if (placing[verification_index] == 2) {
			sound_bad.play();
			document.getElementById(try_count_index + '_' + verification_index).className = 'not_in_place';
		} else if (placing[verification_index] == 0) {
			sound_missing.play();
		}
		

		
		verification_index++;

		
			
		if (verification_index == word_length) { // Fin de la vérification
			clearInterval(verificationInterval);
			verification_index = 0;
			word_proposed_tab = [];
			
			if (word_proposed == word_to_find) { // Mot trouvé
					setTimeout(function() { clear_grid() } , 2000); //rafraichissement de la page
			} else {
				nouvelleLigne();
			}			
		}
	}
	
	function clear_grid() {
		clearInterval(solutionInterval);
		
		for (var i = 0; i < word_length; i++) {  //reinit placing
			placing[i] = "0";
		}

		word_count = dictionary.length;
		word_random_index = Math.floor(Math.random() * word_count);
		word_to_find = dictionary[word_random_index];
		console.log(word_to_find);
		
		try_count_index = 0;
		verification_index = 0;

		for (i = 0; i < word_proposed_tab_list.length; i++) {
			word_proposed_tab_list.pop();
			
		}
				
		word_tab = new Array(); // Mise dans le tableau mot_tab le mot_a_trouver
		for (var i = 0; i < 8; i++) {
			word_tab[i] = word_to_find.substr(i, 1);
		}
		
		word_proposed_tab = [];
		
		if (word_length == 7) {
			lettre_ok = new Array(word_tab[0], '', '', '', '', '', '');
			placing = new Array(1, 0, 0, 0, 0, 0, 0);
		} else if (word_length == 8) {
			lettre_ok = new Array(word_tab[0], '', '', '', '', '', '', '');
			placing = new Array(1, 0, 0, 0, 0, 0, 0, 0);
		} else if (word_length == 9) {
			lettre_ok = new Array(word_tab[0], '', '', '', '', '', '', '', '');
			placing = new Array(1, 0, 0, 0, 0, 0, 0, 0, 0);
		} else if (word_length == 10) {
			lettre_ok = new Array(word_tab[0], '', '', '', '', '', '', '', '', '');
			placing = new Array(1, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		}
		
		letter_plus = Math.floor(Math.random() * (word_length - 2) + 2); // Seconde lettre au premier word_to_find
		placing[letter_plus] = 1; // La seconde lettre est une lettre correcte

		for (var j = 0; j <= try_number_max-1; j++) {
			for (var i = 0; i < word_length; i++) {
				document.getElementById(j + '_' + i).innerHTML = "";
				document.getElementById(j + '_' + i).className = 'not_present';
			}
		}
			
		// Affichge du premier word_to_find
		for (var i = 0; i < word_length; i++) {
			document.getElementById(0 + '_' + i).innerHTML = ".";
		}
		document.getElementById(0 + '_' + 0).innerHTML = word_tab[0]; // Première lettre
		document.getElementById(0 + '_' + letter_plus).innerHTML = word_tab[letter_plus]; // Seconde lettre
	}