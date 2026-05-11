function initNumberGrid() {
	if (settings.number_grid_enabled == false) {
		console.log("Grille numérotée non utilisée")
		return;
	}

	defaultNumberGridVariables()

	document.getElementById("number_grid_yellow_placeolder").innerHTML = createHTMLGrid(5, 5, "number_yellow", "number_grid_yellow", false);
	document.getElementById("number_grid_blue_placeolder").innerHTML = createHTMLGrid(5, 5, "number_blue", "number_grid_blue", false);

	// Remplissage des grille automatiquement ou manuellement
	fillNumberGrid("yellow", false);
	fillNumberGrid("blue", false);
	// fillNumberGrid("yellow", settings.number_grid_creation_animation);
	// fillNumberGrid("blue", settings.number_grid_creation_animation);

	game.state.number_grid_complete = true;
	game.state.number_grid_yellow_created = true;
	game.state.number_grid_blue_created = true;

	// if (settings.start_by_number_grid == true && settings.number_grid_manual_creation == true) {
	// 	displayNumberGridUserAction("create_yellow_grid_button", true)
	// 	if (settings.team_enabled == true) {
	// 		displayNumberGridUserAction("create_blue_grid_button", true);
	// 		document.getElementById("number_grid_create_blue_grid_button").disabled = true;
	// 	}
	// } else {
	// 	fillNumberGrid("yellow", false);
	// 	if (settings.team_enabled == true) {
	// 		fillNumberGrid("blue", false);
	// 	}

	// 	displayLetterGrid()
	// 	return;
	// }

	if (settings.start_by_number_grid == true) {
		displayNumberGrid();
	} else {
		initLetterGrid();
	}
}

function defaultNumberGridVariables() {
	// Boules possibles
	const grid_index = game.number_grid_index+1; 

	let data_mask = game.number_grid_data.mask[grid_index];
	let data_yellow = game.number_grid_data.yellow[grid_index];
	let data_blue = game.number_grid_data.blue[grid_index];

	let numbers_yellow = [];
	let numbers_blue = [];

	game.number_grid_dynamic_mask = {
		yellow: [],
		blue: []
	};

	for (let i = 0; i < data_mask.length; i++) {
		// Tri des boules possibles
		if (data_mask[i] == 1) {
			numbers_yellow.push(data_yellow[i]);
			numbers_blue.push(data_blue[i]);
		}

		// Etat de la grille pour motus possible
		game.number_grid_dynamic_mask.yellow.push(data_mask[i])
		game.number_grid_dynamic_mask.blue.push(data_mask[i])
	}
	
	// Boule magique
	if (settings.use_saving_ball == true && (settings.limiting_saving_ball == true && game.number_grid_index == 0)) {
		var random_yellow_saving_ball = numbers_yellow[Math.floor(Math.random() * (numbers_yellow.length - 1))];
		var random_blue_saving_ball = numbers_blue[Math.floor(Math.random() * (numbers_blue.length - 1))];
		
		var random_yellow_saving_ball_state = "available";
		var random_blue_saving_ball_state = "available";
	} else {
		var random_yellow_saving_ball_state = "unavailable";
		var random_blue_saving_ball_state = "unavailable";
	}
	
	game.number_grid_saving_ball = {
		yellow: random_yellow_saving_ball,
		blue: random_blue_saving_ball
	};

	game.number_grid_saving_ball_state = {
		yellow: random_blue_saving_ball_state,
		blue: random_blue_saving_ball_state
	};

	// Enregistrement des grilles possibles
	game.number_grid_possible = {
		yellow: numbers_yellow,
		blue: numbers_blue
	};

	// Définition des grilles purgatoires (boules tirées)
	game.number_grid_purgatory = {
		yellow: [],
		blue: []
	};

	// Boules noires
	for (var i = 0; i < settings.black_ball_amount; i++) {
		numbers_yellow.push("⚫");
		numbers_blue.push("⚫");
	}
}

function resetNumberGrids() {
	defaultNumberGridVariables()

	for (let j=0; j<5; j++) {
		for (let i=0; i<5; i++) {
			document.getElementById(`number_yellow_${j}_${i}`).innerHTML = "";
			if (settings.team_enabled == true) {
				document.getElementById(`number_blue_${j}_${i}`).innerHTML = "";
			}
		}
	}
}

function changeNumberGrid() {
	if (game.motus_aligned == false) {
		console.log("La grille n'a pas besoin d'être changée")
		return;
	}

	displayNumberGridUserAction("change_grid_button", false)

	if (game.motus_aligned == true) {
		// Change l'index de la grille
		// Boucle entre les 6 grilles
		if (game.number_grid_index < 5) {
			game.number_grid_index++;
		} else {
			game.number_grid_index = 0;
		}
		game.motus_aligned = false;
	}

	resetNumberGrids();
	resetPurgatory();

	fillNumberGrid("yellow", true);
	if (settings.team_enabled == true) {
		fillNumberGrid("blue", true);
	}
}

function createNumberGrid(team) {
	// Creation de la grille pour l'équipe jaune
	if (team == "yellow") {
		document.getElementById("number_grid_yellow_placeolder").innerHTML = 
			createHTMLGrid(5, 5, "number_yellow", "number_grid_yellow")
	}
	if (team == "blue" && settings.team_enabled == true) {
		document.getElementById("number_grid_blue_placeolder").innerHTML = 
			createHTMLGrid(5, 5, "number_blue", "number_grid_blue")
	}
	
	if (team == "yellow") { 
		var used_grid = game.number_grid_placement_yellow;
		var saving_ball = game.saving_ball_yellow
	} else {
		var used_grid = game.number_grid_placement_blue;
		var saving_ball = game.saving_ball_blue
	}
	
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 5; j++) {
			var number = used_grid[(i*5)+j];
			var cell_id = i+"_"+j
			if (number == 0) {
				document.getElementById("number_cell_"+cell_id).innerHTML = '<div class="number hided_number" id="number_' + cell_id + '"></div>'
			} else if (number == saving_ball) {
				document.getElementById("number_cell_"+cell_id).innerHTML = '<div class="number yellow_number saving_ball" id="number_' + cell_id + '">' + number + '</div>'
			} else {
				document.getElementById("number_cell_"+cell_id).innerHTML = '<div class="number yellow_number" id="number_' + cell_id + '">' + number + '</div>'
			}
		}
	}
}

function fillNumberGrid(team, animation = false) {
	if (team == "yellow") { var data = game.number_grid_data.yellow[game.number_grid_index+1] }
	if (team == "blue") { var data = game.number_grid_data.blue[game.number_grid_index+1] }

	for (let j=0; j<5; j++) {
		for (let i=0; i<5; i++) {
			const animation_delay = 120;
			const animation_creation_delay_addition = 100;
			let num = data[j*5+i];
			let html_el = `<div class="numberNEW created">${num}</div>`;

			if (animation) {
				setTimeout(function() {
					playsound("grille_creation");
					document.getElementById(`number_${team}_${j}_${i}`).innerHTML = `<div class="numberNEW created">${num}</div>`;
				}, (j*5+i) * animation_delay);
				
				setTimeout(function() {
					document.getElementById(`number_${team}_${j}_${i}`).children[0].classList.remove("created");
				}, ((j*5+i) * animation_delay) + animation_creation_delay_addition);
			} else {
				document.getElementById(`number_${team}_${j}_${i}`).innerHTML = `<div class="numberNEW">${num}</div>`;
			}
		}
	}

	if (animation) {
		var mask_animation_delay = 5 * 5 * 120 + 500;
	} else {
		var mask_animation_delay = 0;
	}

		setTimeout(function() {
			fillNumberGridMask(team, animation)
		}, mask_animation_delay);

	function fillNumberGridMask(team, animation = false) {
		let mask_data = game.number_grid_data.mask[game.number_grid_index+1]
		let grid_data = game.number_grid_data[team][game.number_grid_index+1]
		let zero_indexes = [];
		let ones_indexes = [];

		// Coordonées des différents 0 (masques)
		for (let i = 0; i < mask_data.length; i++) {
			if (mask_data[i] == 0) {
				let x = (i % 5);
				let y = (i - (i % 5)) / 5;

				zero_indexes.push({y: y, x: x});
			}
			if (mask_data[i] == 1) {
				let x = (i % 5);
				let y = (i - (i % 5)) / 5;

				ones_indexes.push({y: y,x: x, number: grid_data[i]});
			}
		}

		for (let i = 0; i < zero_indexes.length; i++) {
			const animation_delay = 300;
			const animation_creation_delay_addition = 100;
			let x = zero_indexes[i].x;
			let y = zero_indexes[i].y;

			if (animation) {
				setTimeout(function() {
					playsound("grille_numero");
					document.getElementById(`number_${team}_${y}_${x}`).innerHTML = `<div class="numberNEW mask_created hided_number"></div>`;
					
					// Affichage de la boule magique à la fin de l'animation
					if (i == zero_indexes.length-1) { displaySavingBall(); }
				}, i * animation_delay);

				// Suppression CSS de creation
				setTimeout(function() {
					document.getElementById(`number_${team}_${y}_${x}`).children[0].classList.remove("mask_created");
				}, i * animation_delay + animation_creation_delay_addition);
			} else {
				document.getElementById(`number_${team}_${y}_${x}`).innerHTML = `<div class="numberNEW hided_number"></div>`;
				if (i == zero_indexes.length-1) { displaySavingBall(); }
			}
		}

		function displaySavingBall() {
			if (settings.use_saving_ball == true && (settings.limiting_saving_ball == true && game.number_grid_index != 0)) {
				return;
			}
			
			var current_grid = game.number_grid_data[team][game.number_grid_index+1]

			// Boule Magique
			var pos_id = current_grid.indexOf(game.number_grid_saving_ball[team]);

			let pos_x = (pos_id % 5);
			let pos_y = (pos_id - (pos_id % 5)) / 5;

			document.getElementById(`number_${team}_${pos_y}_${pos_x}`).children[0].classList.add("saving_ball")
		}

		// Bouton onclick pour mode de tirage par clique
		// Calcul des boule possible
		// Coordonées des différents 0 (masques)
		if (settings.ball_picking_mode == "direct_click") {
			for (let i = 0; i < ones_indexes.length; i++) {
				let x = ones_indexes[i].x;
				let y = ones_indexes[i].y;
				let number = ones_indexes[i].number;
				
				document.getElementById(`number_${team}_${y}_${x}`).onclick = function() { pickBall(number); }
			}
		}
	}
}

function setDefaultNumberGridValues() {
	game.number_grid_saving_ball = {
		yellow: undefined,
		blue: undefined
	}
	
	game.number_grid_possible.yellow = [];
	game.number_grid_possible.blue = [];

	game.try_picking_ball = settings.try_picking_ball;

	game.saving_ball_engaged = {
		yellow: false,
		blue: false
	}
	
	game.motus_aligned = false;
}

// function createRandomPickBallButtons() {
//     const placeholder = document.getElementById("number_grid_random_selection_mode_section")
//     const team = game.team_focus;

// 	placeholder.innerHTML = ""
	
//     for (let i=0; i<game.number_grid_try_left; i++) {
//         placeholder.innerHTML += `<div id="button_pick_ball_${i}" class="button_pick_ball pick_ball ${team} allow_click" role="button" data-id="${i}" onclick="randomPickBall(this)">?</div>`
//     }
// }

// function createBlackBallButton() {
// 	// Affichage boule noire
//     const placeholder = document.getElementById("number_grid_random_selection_mode_section")
// 	placeholder.innerHTML = `<div id="button_pick_ball" class="button_pick_ball pick_ball black_ball allow_click" role="button" onclick="pickBall('⚫')"></div>`
// }

function updateNumberLeftIndicator() {
	document.getElementById("number_grid_random_selection_left_indicator").innerHTML = `${game.number_grid_try_left} restant(s)`;
}

function randomPickBall() {
	if (game.number_grid_try_left == 0) {
		playsound("error");
		return;
	}

	const team = game.team_focus;

	if (game.motus_aligned == false && game.focus_on == "number") {
		let possible_grid = game.number_grid_possible[team]
		var random_ball = possible_grid[Math.floor(Math.random() * possible_grid.length)]
	}

	// element.classList.remove("allow_click");

	// Affichage sur les boutons
	// if (random_ball == "⚫") {
	// 	element.innerHTML = "";
	// 	element.classList.add("black_ball");
	// } else {
	// 	element.innerHTML = random_ball;
	// 	element.classList.remove("black_ball");
	// }

	pickBall(random_ball);
}

function setManuelHTMLSelectInputBallPicking(team) {
	// Copie du tableau des boules possibles pour éviter de le modifier
	let possible_grid = [...game.number_grid_possible[team]];

	// Séparer nombres et boules noires
	let numbers = possible_grid.filter(filter_numbers_only => filter_numbers_only !== "⚫");
	let blacks = possible_grid.filter(filter_black_ball_only => filter_black_ball_only === "⚫");

	// Tri numérique
	numbers.sort((a, b) => a - b);

	let element = "";
	for (let ball of numbers) {
		element += `<option value="${ball}">${ball}</option>`;
	}

	if (blacks.length > 0) {
		element += `<option value="⚫">Boule Noire !</option>`;
	}

	document.getElementById("select_pick_ball").innerHTML = element;
}

function debug_pickball() {
	const value = document.getElementById("select_pick_ball").value
	if (value == "⚫") {
		pickBall(value);
	} else {
		pickBall(parseInt(value));
	}
}

function pickBall(forced_number) {
	if (game.focus_on != "number" ||
		game.number_grid_try_left == 0 ||
		game.motus_aligned == true ) {
		return;
	}

	const team = game.team_focus

	if (game.number_grid_possible[team].indexOf(forced_number) == -1) {
		console.log("La boule choisie n'est pas disponible dans cette grille");
		return;
	}

	var saving_ball = game.number_grid_saving_ball[team]
	var saving_ball_state = game.number_grid_saving_ball_state[team]

	// Boule noire
	if (forced_number == "⚫") {
		console.log('%cBoule Noire', 'background: black; color: gold');

		// Si boule magique
		if (saving_ball_state == "stored") {
			game.number_grid_saving_ball_state[team] = "used";
			setTimeout(function() { playsound("boule_magique"); }, 1750);
		} else {
			switchTeamFocus()
		}

		playsound('grille_boule_noire');

		game.number_grid_try_left = 0
		updateNumberLeftIndicator()
		
		// Afficher le bouton de retour à la grille de mot
		displayNumberGridUserAction("return_letter_grid", true)
	}

	// Boules normales
	if (forced_number != "⚫") {
		playsound('grille_numero_tire');
		
		// Boule Magique
		if (settings.use_saving_ball == true && (settings.limiting_saving_ball == true && game.number_grid_index == 0)) {
			if (forced_number == saving_ball) {
				game.number_grid_saving_ball_state[team] = "stored"
				playsound("boule_magique");
				console.log('%c' + `Boule magique : ${forced_number}`, 'background: black; color: cyan');
			}
		}

		console.log('%c' + forced_number, 'background: black; color: gold');

		// Animation
		var pos_index = game.number_grid_data[team][game.number_grid_index+1].indexOf(forced_number);
		var grid_pos_y_x_element = document.getElementById(`number_${team}_` + ((pos_index - (pos_index % 5)) / 5) + "_" + (pos_index % 5));
		var grid_number_element = grid_pos_y_x_element.children[0];

		for (var i=0; i<13; i++) {
			if ((i % 2) == 1) {
				setTimeout(function() {
					grid_number_element.innerHTML = forced_number;
					grid_number_element.className = "numberNEW";
				}, i * 100);
			} else {
				setTimeout(function() {	
					grid_number_element.innerHTML = "";
					grid_number_element.className = "numberNEW hided_number";
				}, i * 100);
			}
		}

		// Modification du masque dynamique pour motus
		game.number_grid_dynamic_mask[game.team_focus][pos_index] = 0;

		// Check MOTUS
		checkMotus();
	}

	// Purgatoire
	game.number_grid_purgatory[game.team_focus].push(forced_number);
	addNumberPurgatory(forced_number);

	// Suppression de la liste & reduction du nombre d'essai
	let forced_number_possible_grid_index = game.number_grid_possible[game.team_focus].indexOf(forced_number)
	game.number_grid_possible[game.team_focus].splice(forced_number_possible_grid_index,1)

	// si boule noire alors mis à 0
	if (game.number_grid_try_left > 0) {
		game.number_grid_try_left--;
		updateNumberLeftIndicator()

		if (game.number_grid_try_left == 0) {
			// Afficher le bouton de retour à la grille de mot
			displayNumberGridUserAction("return_letter_grid", true)
		}
	}

	// Mise à jour du mode de selection par liste
	if (settings.ball_picking_mode == "input_select") {
        setManuelHTMLSelectInputBallPicking(team)
	}

	// A AJOUTER : AFFICHAGE VASQUE DES BOULES TIREES
}

function checkMotus() {
	const dynamic_mask = game.number_grid_dynamic_mask[game.team_focus]

	// Calcul de la somme des placements
	var slash_sum = dynamic_mask[0] + dynamic_mask[6] + dynamic_mask[12] + dynamic_mask[18] + dynamic_mask[24];
	var backslash_sum = dynamic_mask[20] + dynamic_mask[16] + dynamic_mask[12] + dynamic_mask[8] + dynamic_mask[4];
	
	if (slash_sum == 0) {
		animation("slash", undefined);
		return;
	}
	if (backslash_sum == 0) {
		animation("backslash", undefined);
		return;
	}

	for (let i = 0; i < 5; i++) {
		let horizontal_sum = dynamic_mask[i*5] + dynamic_mask[(i*5)+1] + dynamic_mask[(i*5)+2] + dynamic_mask[(i*5)+3] + dynamic_mask[(i*5)+4];
		let vertical_sum = dynamic_mask[i] + dynamic_mask[i+5] + dynamic_mask[i+(5*2)] + dynamic_mask[i+(5*3)] + dynamic_mask[i+(5*4)];

		if (horizontal_sum == 0) {
			animation("horizontal", i);
			return;
		}
		if (vertical_sum == 0) {
			animation("vertical", i);
			return;
		}
	}

	// Animation par position
	function animation(position_name, offset) {
		const display_word = "MOTUS";
		const animation_delay = 3000;
		let animation_placement_coord = [];
		game.motus_aligned = true

		playsound('motus');
		game.number_grid_try_left = 0;

		switch (position_name) {
			case "slash" :
				// de haut en bas
				for (let i = 0; i < 5; i++) {
					animation_placement_coord.push({x:i, y:i})
				}
				break;
			case "backslash" :
				// de bas en haut
				for (let i = 0; i < 5; i++) {
					animation_placement_coord.push({x:i, y:4-i})
				}
				break;
			case "horizontal" :
				for (let i = 0; i < 5; i++) {
					animation_placement_coord.push({x:i, y:offset})
				}
				break;
			case "vertical" :
				for (let i = 0; i < 5; i++) {
					animation_placement_coord.push({x:offset, y:i})
				}
				break;
		}

		for (let i = 0; i < 5; i++) {
			let x = animation_placement_coord[i].x;
			let y = animation_placement_coord[i].y;
			let element_id = `number_${game.team_focus}_${y}_${x}`;
			setTimeout(function() {
				document.getElementById(element_id).children[0].className = "numberNEW motus";
				document.getElementById(element_id).children[0].innerHTML = display_word[i];
			}, i * 100 + animation_delay);
		}
		
		// Bouton changer de grille et retour vers mot
		setTimeout(function() {
			displayNumberGridUserAction("change_grid_button", true)
			displayNumberGridUserAction("return_letter_grid", true)
		}, 500 + animation_delay);
    }

		// Multiplication du nombre de points?
		for (let i = 0; i < 2; i++) {
			addTeamScore();
		}
		

		// Suppression de l'affichage de la boule magique (correspond à l'affichage en TV?)
		// const saving_ball_element = document.getElementsByClassName('saving_ball');
		// Array.from(saving_ball_element).forEach(element => {
		// 	element.classList.remove('saving_ball');
		// });
	}

function displayNumberGridUserAction(element_custom_name, display_bool) {
    var element_id = "";

    switch (element_custom_name) {
        case "return_letter_grid": element_id = "number_grid_return_to_letter_grid"; break;
        case "change_grid_button": element_id = "number_grid_change_grid_button"; break;
        case "create_yellow_grid_button": element_id = "number_grid_create_yellow_grid_button"; break;
        case "create_blue_grid_button": element_id = "number_grid_create_blue_grid_button"; break;
        case "random_selection_mode_section": element_id = "number_grid_random_selection_mode_section"; break;
        case "random_selection_button": element_id = "number_grid_random_selection_button"; break;
        case "black_selection_button": element_id = "number_grid_black_selection_button"; break;
        case "pick_left_indicator": element_id = "number_grid_random_selection_left_indicator"; break;
    }
    
    if (display_bool) {
        document.getElementById(element_id).classList.remove("d-none")
    } else {
        document.getElementById(element_id).classList.add("d-none")
    }
}

function resetPurgatory() {
	const yellow_purgatory = document.getElementById("number_grid_purgatory_yellow");
	const blue_purgatory = document.getElementById("number_grid_purgatory_blue");

	yellow_purgatory.innerHTML = "";
	blue_purgatory.innerHTML = "";

	game.number_grid_purgatory.yellow = [];
	game.number_grid_purgatory.blue = [];
}

function addNumberPurgatory(number) {
	let element = "";
	let black_ball_class_name = "";

	if (number == "⚫") {
		black_ball_class_name = "black";
		number = "";
	}

	document.getElementById(`number_grid_purgatory_${game.team_focus}`).innerHTML += `<span class='purgatory_number ${game.team_focus} ${black_ball_class_name}'>${number}<span>`;
}
