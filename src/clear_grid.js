
	
	function clear_grid() {		// Réinitialisation
		if (typeof solutionInterval == 'undefined') { //arret de l'animation de la solution
		} else {	
			clearInterval(solutionInterval);
        }
        
        initialisationMot()
		
		placing = [];							//reinit placing
		placing_dup = [];
		lettre_ok = [];
		for (var i = 0; i < word_length; i++) {  
			placing[i] = "0";
		}

		word_count = dictionary.length;
		word_random_index = Math.floor(Math.random() * word_count);
		word_to_find = dictionary[word_random_index];
		if (display_debug_info == true) { console.log(word_to_find); }
		
		try_count_index = -1;
		verification_index = 0;

		word_proposed_tab_list = [];
				
		word_to_find_tab = new Array(); // Mise dans le tableau mot_tab le mot_a_trouver
		
		letter_plus = Math.floor(Math.random() * (word_length - 2) + 2); // Seconde lettre au premier word_to_find
		placing[letter_plus] = 1; // La seconde lettre est une lettre correcte

		ReinitilisationTableau()


		
		word_proposed_tab = [];
		
		
		
	}