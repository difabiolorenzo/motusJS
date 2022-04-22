function createNumberGrid() {
	if (game.motus_engaged == true) {
		changeNumberGridIndex()
	} else {
		initNumberGrid()
		changeNumberGrid()
	}
}

function changeNumberGridIndex() {
	if (game.number_grid_index < 5) {
		game.number_grid_index++;
	} else {
		game.number_grid_index = 0;
	}
	
	game.number_grid_placement_yellow = undefined;
	game.number_grid_possible_yellow = undefined;
	game.number_grid_placement_blue = undefined;
	game.number_grid_possible_blue = undefined;

	game.number_grid_yellow_saving_ball = undefined;
	game.number_grid_blue_saving_ball = undefined;
	game.number_grid_yellow_saving_ball_picked = undefined;
	game.number_grid_blue_saving_ball_picked = undefined;

	game.saving_ball_yellow = undefined;
	game.saving_ball_yellow_engaged = false;
	game.saving_ball_blue = undefined;
	game.saving_ball_blue_engaged = false;
	
	game.number_grid_yellow_purgatory = undefined;
	game.number_grid_blue_purgatory = undefined;

	game.saving_ball_yellow_engaged = false;
	game.saving_ball_blue_engaged = false;

	game.motus_engaged = undefined;

	createNumberGrid();
}

function initNumberGrid() {
	if (game.number_grid_placement_yellow == undefined || game.number_grid_placement_blue == undefined ) {
		game.number_grid_placement_yellow = [];
		game.number_grid_possible_yellow = [];
		game.number_grid_placement_blue = [];
		game.number_grid_possible_blue = [];
		game.number_grid_yellow_purgatory = [];
		game.number_grid_blue_purgatory = [];

		for (var i = 0; i < 25; i++) {
			if (grid_placement[game.number_grid_index][i] == 1) {
				game.number_grid_placement_yellow.push(yellow_grid[game.number_grid_index][i]);
				game.number_grid_possible_yellow.push(yellow_grid[game.number_grid_index][i]);

				game.number_grid_placement_blue.push(blue_grid[game.number_grid_index][i]);
				game.number_grid_possible_blue.push(blue_grid[game.number_grid_index][i]);
			} else {
				game.number_grid_placement_yellow.push(0);
				game.number_grid_placement_blue.push(0);
			}
		}

		if (game.use_saving_ball == true && (game.limiting_saving_ball == true && game.number_grid_index == 0)) {
			game.saving_ball_yellow = game.number_grid_possible_yellow[Math.round(Math.random() * (game.number_grid_possible_yellow.length-1))]
			game.saving_ball_blue = game.number_grid_possible_blue[Math.round(Math.random() * (game.number_grid_possible_blue.length-1))]
		}

		for (var i = 0; i < game.black_ball_amount; i++) {
			game.number_grid_possible_yellow.push("⚫");
			game.number_grid_possible_blue.push("⚫");
		}
	}
}

function changeNumberGrid() {		
	createGrid("number_grid_placeolder", 5, 5, "number_cell", "number_grid");
	if (game.team_focus == "yellow") { 
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

	game.try_picking_ball_left = game.try_picking_ball;
}

function pickBall(forced_number) {
	if (game.try_picking_ball_left > 0 && game.motus_engaged == undefined && global.picked_ball_animation == undefined && global.displayed_grid_type == "number_grid") {
		game.try_picking_ball_left--;
		if (game.team_focus == "yellow") {
			var grid_possible = game.number_grid_possible_yellow;
			var saving_ball = game.saving_ball_yellow;
			var saving_ball_engaged = game.saving_ball_yellow_engaged;
			var grid_placement_raw = game.number_grid_placement_yellow;
		} else {
			var grid_possible = game.number_grid_possible_blue;
			var saving_ball = game.saving_ball_blue;
			var saving_ball_engaged = game.saving_ball_blue_engaged;
			var grid_placement_raw = game.number_grid_placement_blue;
		}

		if (forced_number == undefined) {
			var random_ball = grid_possible[Math.round(Math.random() * (grid_possible.length-1))];
			console.log('%c' + random_ball, 'background: black; color: gold');
		} else {
			var random_ball = forced_number;
			console.log('%c' + random_ball + " forced", 'background: black; color: gold');
		}

		if (random_ball == "⚫") {
			console.log('%cBoule Noire', 'background: black; color: gold');
			if (saving_ball_engaged == true) {
				console.log('%cBoule Magique ' + saving_ball, 'background: black; color: gold');
				saving_ball_engaged = false;
				setTimeout(function() { playsound("boule_magique"); }, 1750);
			} else {
				game.try_picking_ball_left = 0;
			}
			playsound('grille_boule_noire');
			switchTeamFocus()
		} else  {
			if (random_ball == saving_ball) {
				saving_ball_engaged = true;
				playsound('boule_magique');
			}

			var placement_id = grid_placement_raw.indexOf(random_ball);
			var grid_index = "number_" + ((placement_id - (placement_id % 5)) / 5) + "_" + (placement_id % 5);
		
			global.animationIntervalID_4 = setInterval(function() {
				animationNumeroTire(random_ball, grid_index)
			}, 100);
			grid_placement_raw[grid_placement_raw.indexOf(random_ball)] = 0;
			checkMotus()
		}
		addNumberPurgatory(random_ball)
		grid_possible.splice(grid_possible.indexOf(random_ball),1)
	} else if (game.try_picking_ball_left == 0){
		switchGridType()
	}
}

function animationNumeroTire(number, number_pos) {
	if (global.picked_ball_animation == undefined) {
		global.picked_ball_animation = 0;
	}

	if ((global.picked_ball_animation % 2) == 1) {
		editHTML(number_pos, "innerHTML", number);
		editHTML(number_pos, "className", "number");
	} else {
		editHTML(number_pos, "innerHTML", "")
		editHTML(number_pos, "className", "number hided_number");
	}

	global.picked_ball_animation++;
	if (global.picked_ball_animation == 11) {
		clearInterval(global.animationIntervalID_4);
		global.picked_ball_animation = undefined;
	}
}

function checkMotus() {
	if (game.team_focus == "yellow") {
		var grid_placement_raw = game.number_grid_placement_yellow;
	} else {
		var grid_placement_raw = game.number_grid_placement_blue;
	}
	
	for (var i = 0; i < 5; i++) { //boucle verification grille jaune horizontalement
		var horizontal_sum = grid_placement_raw[i * 5] + grid_placement_raw[(i * 5) + 1] + grid_placement_raw[(i * 5) + 2] + grid_placement_raw[(i * 5) + 3] + grid_placement_raw[(i * 5) + 4];
		var vertical_sum = grid_placement_raw[i] + grid_placement_raw[i + 5] + grid_placement_raw[i + (5 * 2)] + grid_placement_raw[i + (5 * 3)] + grid_placement_raw[i + (5 * 4)];
		var slash_sum = grid_placement_raw[0] + grid_placement_raw[6] + grid_placement_raw[12] + grid_placement_raw[18] + grid_placement_raw[24];
		var backslash_sum = grid_placement_raw[20] + grid_placement_raw[16] + grid_placement_raw[12] + grid_placement_raw[8] + grid_placement_raw[4];
		
		if (horizontal_sum == 0) {
			var verification_mode = "horizontal_sum";
			game.motus_engaged = true;
		} else if (vertical_sum == 0) {
			var verification_mode = "vertical_sum";
			game.motus_engaged = true;
		} else if (slash_sum == 0) {
			var verification_mode = "slash_sum";
			game.motus_engaged = true;
		} else if (backslash_sum == 0) {
			var verification_mode = "backslash_sum";
			game.motus_engaged = true;
		}
	
		if (game.motus_engaged == true) {
			setTimeout(function() { animationIntervalID_5 = setInterval(function() { displayMotusAnimated(verification_mode, i); }, 100) }, 1500);
			playsound('motus')
			break;
		}
	}
	
	if (game.motus_engaged == undefined) {
		playsound('grille_numero_tire');
	}
}

function displayMotusAnimated(mode, index) {
	if (global.motus_animation_index == undefined) {
		global.motus_animation_index = 0;
		global.motus_array = [["M"],["O"],["T"],["U"],["S"]]
		for (var i=0;i<5;i++) {
			if (mode == "horizontal_sum") {
				global.motus_array[i].push((index * 5) + i);
			} else if (mode == "vertical_sum") {
				global.motus_array[i].push(index + (5 * i));
			} else if (mode == "slash_sum") {
				global.motus_array[i].push((i * 5) + i);
			} else if (mode == "backslash_sum") {
				global.motus_array[i].push(24 - (4 * (i + 1)));
			}
		}
	}

	var cell_index = global.motus_array[global.motus_animation_index][1]
	var cell_id = "number_" + ((cell_index - (cell_index % 5)) / 5) + "_" + (cell_index % 5);
	console.log(global.motus_array, global.motus_animation_index, index, cell_id)

	editHTML(cell_id, "innerHTML", global.motus_array[global.motus_animation_index][0])
	editHTML(cell_id, "className", "number motus");

	global.motus_animation_index++;
	if (global.motus_animation_index == 5) {
		global.motus_animation_index = undefined;
		global.motus_array = undefined;
		clearInterval(animationIntervalID_5);
		addScoreTeamFocus(); addScoreTeamFocus();
	}
}

function displayPurgatory() {	//doit être refait pour être similaire au jeu TV
	if (game.team_focus == "yellow") {
		var purgatory = game.number_grid_yellow_purgatory;
	} else {
		var purgatory = game.number_grid_yellow_purgatory;
	}

	for (var i=0 ; i<purgatory.length ; i++) {
		addNumberPurgatoryHTML(purgatory[i])
	}

	console.log(purgatory)
}

function addNumberPurgatory(number) {
	if (game.team_focus == "yellow") {
		var purgatory = game.number_grid_yellow_purgatory;
		var saving_ball = game.saving_ball_yellow;
	} else {
		var purgatory = game.number_grid_yellow_purgatory;
		var saving_ball = game.saving_ball_blue;
	}

	if (number == saving_ball) { var is_saving_ball = true }

	purgatory.push(number);
	addNumberPurgatoryHTML(number, is_saving_ball);
}

function addNumberPurgatoryHTML(number, is_saving_ball) {
	var head = "<div class='purgatory_number"
	if (number == "⚫") {
		var end = " black_ball'></div>"
	} else {
		if (is_saving_ball == true) {
			var end = " saving_ball'>" + number + "</div>"
		} else {
			var end = "'>" + number + "</div>"
		}
	}
	purgatory.innerHTML += head + end
}