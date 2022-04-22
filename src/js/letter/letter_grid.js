function createLetterGrid() {
	var table_letter = document.getElementById("table_letter");
	if (table_letter != null) {
		table_letter.classList.toggle("changing_grid");
	}
	setTimeout(function() {changeLetterGrid()}, 250)
}
function changeLetterGrid() {
	game.word_length = game.word_to_find_list[0].length;
	game.verification_timer = Math.floor((2000 / game.word_length) * (game.word_length/10) * global.verification_time_multiplier);

	createGrid("letter_grid_placeolder",game.try_number_max,game.word_length,"letter","table_letter")
	newWordLine();
	placeFirstLetter();
	placeHelpingLetter();
}

function wordInit() {
	game.try_count_index = 0;
	game.verification_index = 0;
	game.word_displayed = false;
	game.word_found = false;
	game.word_proposed_list = [];
	game.already_proposed = false;

	game.word_to_find = game.word_to_find_list[0];
	game.word_length = game.word_to_find_list[0].length;

	breakdownWord();

	console.log('Mot à trouver: ' + '%c' + game.word_to_find, 'background: black; color: gold'); // Affichage du word_to_find tiré dans la console
	// console.log('Lettres composant le mot: ' + '%c' + game.word_composed_letter, 'background: black; color: gold');
	// console.log('Lettres composant le mot: ' + '%c' + game.word_composed_letter_amount, 'background: black; color: gold');
	// console.log('Nombre de lettres composant le mot: ' + '%c' + game.word_length, 'background: black; color: gold');
}

function wordReinit() {
	if (global.game_panel_displayed == "letter") {
		game.word_to_find_list.splice(0, 1);
		if (game.word_to_find_list.length == 0) {
			if (game.always_ask == false) {
				WordListAddRowRandom(game.always_ask_length);
			} else {
				console.log("Aucun mot dans la liste");
	
				var prompt_new_word = Number(window.prompt("Plus aucun mot n'est prédéfini dans les paramètres, veuillez entrer le nombre de lettres (compris entre 5 et 10) du prochain mot tiré au hasard:", "8"));
				if (prompt_new_word >= 5 && prompt_new_word <= 10 ) {
					WordListAddRowRandom(prompt_new_word);
				} else if (prompt_new_word == "sutom" || prompt_new_word == "SUTOM") {
					getSUTOMDailyWord()
				}					
			}
		}
				
		createLetterGrid();
		wordInit();
	} else {
		playsound("error");
	}
}

function getSUTOMDailyWord() {
	
}

function breakdownWord() {
	// Mise dans le tableau word_composed_letter le word_to_find
	// word_composed_letter convertit "ELEVE" en "ELV"

	game.word_composed_letter = [];
	game.word_composed_letter_amount = [];
	game.letter_placement_status = [];

	for (var i = 0; i < game.word_length; i++) {
		//Placement is all 'none' (0)
		game.letter_placement_status = Array(game.word_length).fill(0)

		if (game.word_composed_letter.includes(game.word_to_find[i]) == false) {
			game.word_composed_letter.push(game.word_to_find[i]);
			game.word_composed_letter_amount.push(1);
		} else {
			game.word_composed_letter_amount[game.word_composed_letter.indexOf(game.word_to_find[i])]++;
		}
	}
}

function updateProposedWord() {

}

function newWordLine() {		// Ajoute une nouvelle ligne avec les bonnes lettres proposées
	if (game.word_displayed == false) {
		if (game.try_count_index < game.try_number_max) {
			for (var i = 0; i < game.word_length; i++) {
				editHTML("letter_" + game.try_count_index + '_' + i, "innerHTML", ".");
				if (game.letter_placement_status[i] == 1) {
					editHTML("letter_" + game.try_count_index + '_' + i, "innerHTML", game.word_to_find[i]);
				}
			}
			game.word_proposed = "";
		}
		if (game.try_count_index == game.try_number_max) {
			if (game.word_proposed.length == game.word_length) {
				playsound("wrong");
				setTimeout(function() { displaySolution(); }, 1750);
			} else {
				displaySolution();
			}
		}
		updateLetterIndicator();
		game.try_count_index++
	}
}

function removeWordLine() {		// Supprime la ligne
	if (game.try_count_index >= 1 && game.try_count_index <= game.try_number_max && game.word_displayed == false) {
		for (var i=0; i < game.word_length; i++) {
			editHTML("letter_" + (game.try_count_index-1) + '_' + i, "innerHTML", "");
			editHTML("letter_" + (game.try_count_index-1) + '_' + i, "className", 'background');
		}
		game.try_count_index--;

		if (game.try_count_index == 0) { newWordLine(); }
	}
}

function reinitWordLine() {
	if (game.try_count_index > 1) { removeWordLine(); } newWordLine();
}

function retryLine() {
    if (settings.automatic_behaviour == true) {
        switch (settings.automatic_behaviour_new_line_error) {
            case "replace_bonus": 
				reinitWordLine()
                addBonusLetter();
            break;
            case "replace_only": 
				reinitWordLine()
            break;
            case "add_bonus": 
				reinitWordLine()
            break;
            case "add_only": 
                newWordLine();
            break;
        }
    }
}

function placeFirstLetter() {
	editHTML("letter_" + (game.try_count_index-1) + '_0', "innerHTML", game.word_to_find[0]);
	game.letter_placement_status[0] = 1;
}

function placeHelpingLetter() {
	//game.lettre_plus_amount
	var helping_letter_placement = Math.round(Math.random() * (game.word_length - 2) + 2);

	editHTML("letter_" + (game.try_count_index-1) + '_' + helping_letter_placement, "innerHTML", game.word_to_find[helping_letter_placement]);
	game.letter_placement_status[helping_letter_placement] = 1;
}

function addBonusLetter() {	// Ajoute une lettre bonnus dans les emplacement non trouvés
	if (global.animationIntervalID_2 == undefined && game.word_displayed == false && game.word_found == false && game.try_count_index < game.try_number_max) {
		var letter_left = game.word_length - game.letter_placement_status.reduce((a, b) => a + b);
		if (letter_left > 1) {
			reinitWordLine()
			var index = game.letter_placement_status.indexOf(0);
			
			editHTML("letter_" + (game.try_count_index-1) + '_' + index, "innerHTML", game.word_to_find[index]);
			game.letter_placement_status[index] = 1;
			if (global.animationIntervalID_2 == undefined) { global.animationIntervalID_2 = setInterval(function() {addBonusLetterAnimation(index)}, 100); }
			playsound("letter_bonus");
		} else {
			playsound("error");
		}
	} else {
		playsound("error");
	}
}

function addBonusLetterAnimation(index) {
	if (global.letter_bonus_animation == undefined) { global.letter_bonus_animation = 0; }

	if ((global.letter_bonus_animation % 2) == 1) {
		editHTML("letter_" + (game.try_count_index-1) + '_' + index, "className", 'background');
	} else {
		editHTML("letter_" + (game.try_count_index-1) + '_' + index, "className", 'correct');
	}
	global.letter_bonus_animation++;

	if (global.letter_bonus_animation == 8) {
		clearInterval(global.animationIntervalID_2);
		global.animationIntervalID_2 = undefined;
		global.letter_bonus_animation = undefined;
	}
}

function displaySolution(reinit_word) {		// Affiche la solution à la dérnière ligne, necessite une boucle en amont
	if (global.animationIntervalID_1 == undefined) {
		game.verification_index = 0;
		global.animationIntervalID_1 = setInterval(function() {
			displaySolutionAnimation(reinit_word);
		}, game.verification_timer);
		}
	}

function displaySolutionAnimation(reinit_word) {
	if (game.word_displayed == false) {
		editHTML("letter_" + (game.try_number_max-1) + '_' + game.verification_index, "innerHTML", game.word_to_find[game.verification_index]);
		editHTML("letter_" + (game.try_number_max-1) + '_' + game.verification_index, "className", 'correct');
		playsound("letter_ok");
		game.verification_index++;
	
		if (game.verification_index >= game.word_length) { // Fin de la vérification
			clearInterval(global.animationIntervalID_1);
			game.verification_index = undefined;
			global.animationIntervalID_1 = undefined;
	
			if (game.word_found == false) {playsound("loose");}
	
			if (game.team_enabled == true) {
				switchTeamFocus(); // Change l'équipe de main
			}
			game.word_displayed = true;
			if (reinit_word == true) { setTimeout(function() {wordReinit()}, 1750) }
		}
	}
}

function addLetter(letter) {
	if (game.check_word_first_letter == true && game.word_proposed.length == 0 ) {	//Check matching first letter
		if (letter == game.word_to_find[0]) {
			writeLetter();
		} else {
			playsound("error");
		}	
	} else {
		writeLetter();
	}
	function writeLetter() {
		game.word_proposed += letter;
		editHTML("letter_" + (game.try_count_index-1) + '_' + (game.word_proposed.length - 1), "innerHTML", "<a>" + letter + "</a>");
	}
}

function removeLetter() {
	if (game.word_proposed.length == 0 || (game.check_word_first_letter == true && game.word_proposed.length == 1)) {
		reinitWordLine();
	}
	if (game.word_proposed.length > 0) {
		editHTML("letter_" + (game.try_count_index-1) + '_' + (game.word_proposed.length - 1), "innerHTML", ".");
		game.word_proposed = game.word_proposed.slice(0, -1);
	}
}

function submitWord() {	
	if (game.try_count_index <= game.try_number_max) {
		if (game.word_proposed == game.word_to_find) {
			checkProposition()
		} else {
			if (game.check_word_length == true) {
				checkLength();
			} else {
				verifPresence();
			}
		}
	} else {
		if (game.word_displayed == false) {
			displaySolution();
		} else {
			wordReinit();
		}
	}
}

function OLDupdateProposedWordList() {
	editHTML("proposed_word_information_select", "disabled", false);
	editHTML("proposed_word_information_button", "disabled", false);

	word_proposed_tab_list.push(word_proposed);
	document.getElementById("proposed_word_information_select").innerHTML += "<option>" + word_proposed_tab_list[word_proposed_tab_list.length-1] + "</option>";
}

function checkLength() {
	if (game.word_proposed.length != game.word_length) {	//Add to word_proposed correct letters displayed
		for (var i=game.word_proposed.length; i<game.word_length; i++) {
			if (game.letter_placement_status[i] == 1) {
				game.word_proposed += game.word_to_find[i]
			}
		}
	}

	if (game.word_proposed.length != game.word_length) {  //vérification de la longueur du word_to_find
		errorHandler(1, true); //La longueur du word_to_find n'est pas bonne.
	} else {
		checkPresence();
	}
}

function checkPresence() {		// Vérification de la présence du word_to_find proposé dans le dictionnaire
	if (game.check_word_presence == true) {
		if (dictionary_list[game.word_length-5].includes(game.word_proposed) == true) {
			checkDuplication();
		} else {
			errorHandler(2, true); //Mot non présent dans le dictionary
		}
	} else {
		checkDuplication();
	}	
}

function checkDuplication() {		// Vérification de la présence du word_to_find proposé dans le dictionnaire
	if (game.check_word_duplication == true) {
		if (game.word_proposed_list.includes(game.word_proposed) == false) {
			checkProposition();
		} else {
			errorHandler(3, true); //Mot déjà proposé
		}
	} else {
		checkProposition();
	}
}

function checkProposition() {		// Vérifie par rapport à word_to_find le proposed_word
	if (game.verification_index == 0) {
		game.proposed_letter_placement_status = [];
		game.proposed_letter_placement_status = Array(game.word_length).fill(0);
	
		var word_composed_letter_dup = [...game.word_composed_letter];
		var word_composed_letter_amount_dup = [...game.word_composed_letter_amount];
	
		function reduceComposedLetter() {
			word_composed_letter_amount_dup[word_composed_letter_dup.indexOf(game.word_proposed[i])]--;
			if (word_composed_letter_amount_dup[word_composed_letter_dup.indexOf(game.word_proposed[i])] == 0) {
				word_composed_letter_dup.splice(word_composed_letter_dup.indexOf(game.word_proposed[i]),1)
			}
		}
	
		for (var i=0;i<game.word_to_find.length;i++) {
			if (game.word_proposed[i] == game.word_to_find[i]) {
				reduceComposedLetter()
				game.proposed_letter_placement_status[i] = 1;
				game.letter_placement_status[i] = 1;
			} else if (word_composed_letter_dup.includes(game.word_proposed[i]) == true) {
				reduceComposedLetter()
				game.proposed_letter_placement_status[i] = 2;
			}
		}
		for (var i=0; i<game.word_length; i++) {
			var checkPropositionLoop = setTimeout(function() { checkPropositionAnimation(i); }, game.verification_timer*i);      
		}
		var resetCheckPropositionLoop = setTimeout(function() { game.verification_index=0; }, game.verification_timer*game.word_length); 
		var checkVictoryLoop = setTimeout(function() { checkVictory(); }, game.verification_timer*game.word_length);
	}   
}

function checkPropositionAnimation(i) {
	if (game.proposed_letter_placement_status[game.verification_index] == 1) {
		playsound("letter_ok");
		editHTML("letter_" + (game.try_count_index-1) + '_' + game.verification_index, "className", 'correct');
	} else if (game.proposed_letter_placement_status[game.verification_index] == 2) {
		playsound("letter_bad");
		var innerText = document.getElementById("letter_" + (game.try_count_index-1) + '_' + game.verification_index).innerText + "</div>";
		document.getElementById("letter_" + (game.try_count_index-1) + '_' + game.verification_index).innerHTML = "<a class='not_in_place'>" + innerText + "</a>"; //ajout d'un div dans la cellule
	} else {
		playsound("letter_missing");
	}
	game.verification_index++;
}

function checkVictory() {
	if (game.word_proposed == game.word_to_find) { // Mot trouvé
		game.word_found = true;
		game.word_displayed = true;

		playsound("victory");
		editHTML("letter_line_" + (game.try_count_index-1), "className", 'victory_line');

		for (var i=0 ; i<game.word_length ; i++) {
			document.getElementById("letter_" + (game.try_count_index-1) + '_' + i).className = "correct victory_line";
		}
		setTimeout(function() { addScoreTeamFocus(); }, 2250);

		if (global.use_number_grid == true) {
			if (settings.automatic_behaviour == true && settings.automatic_behaviour_redirect_number_grid == true) {
				setTimeout(function() { switchGridType() } , 4000); //reinitialisation de la grille
			}
		} else {
			if (settings.automatic_behaviour == true && settings.automatic_behaviour_ask_new_word == true) {
				setTimeout(function() { wordReinit() } , 4000); //reinitialisation de la grille
			}
		}
	} else {
		if (game.team_enabled == true && game.change_turn_mode == "by_proposition") {
			switchTeamFocus();
		}
		newWordLine();
	}
}

function updateLetterIndicator() {}