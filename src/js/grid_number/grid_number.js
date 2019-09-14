	yellow_grid = new Array(yellow_grid_1, yellow_grid_2, yellow_grid_3, yellow_grid_4, yellow_grid_5, yellow_grid_6);
	blue_grid = new Array(blue_grid_1, blue_grid_2, blue_grid_3, blue_grid_4, blue_grid_5, blue_grid_6);
	grid_placement = new Array(grid_placement_1, grid_placement_2, grid_placement_3, grid_placement_4, grid_placement_5, grid_placement_6);
	hided_number_spot = new Array();											// Tableau emplacements masqués
	yellow_grid_raw = new Array();												// Tableau seulement numéro
	blue_grid_raw = new Array();												// Tableau seulement numéro
	yellow_grid_complete = new Array();											// Tableau des numéro avec boule noires
	blue_grid_complete = new Array();											// Tableau des numéro avec boule noires
	yellow_grid_placement_complete = new Array();								// Tableau des emplacements actuel
	blue_grid_placement_complete = new Array();									// Tableau des emplacements actuel

	var grid_index = -1;
	var animation_index = 0;

	var magic_ball = true;
	var black_ball_amount = 3;
	var pick_ball_index = 0;
	var pick_ball_placement = 0;
	var pick_ball = 0;

	var grid_i_index = 0;
	var grid_j_index = 0;

	var playsound_grille_creation = new Audio('src/sound/grille_creation.mp3');
	var playsound_grille_numero = new Audio('src/sound/grille_numero.mp3');
	var playsound_grille_boule_noire = new Audio('src/sound/grille_boule_noire.mp3');
	var playsound_grille_numero_tire = new Audio('src/sound/grille_numero_tire.mp3');
	playsound_grille_creation.volume = 0.5;
	playsound_grille_numero.volume = 0.5;
	playsound_grille_boule_noire.volume = 0.5;
	playsound_grille_numero_tire.volume = 0.5;

	function getAllBalls() {							// Ajoute x boule noir à la fin du tableau
		yellow_grid_complete = yellow_grid_raw;
		blue_grid_complete = blue_grid_raw;
		yellow_grid_placement_complete = grid_placement[animation_index];
		blue_grid_placement_complete = grid_placement[animation_index];
		for (i = 0 ; i < black_ball_amount ; i++ ) {
			yellow_grid_complete.push("X");
			blue_grid_complete.push("X");
		}
	}

	function pickBall() {							// Tire au hasard une boule du tableau grid_complete de l'équipe ayant la main
		if (team_turn == "yellow") {
			pick_ball_index = Math.floor(Math.random() * yellow_grid_complete.length);

			pick_ball = yellow_grid_complete[pick_ball_index];
		} else if (team_turn == "blue") {
			pick_ball_index = Math.floor(Math.random() * blue_grid_complete.length);

			pick_ball = blue_grid_complete[pick_ball_index]
		}
		console.log("Boule tirée: "+pick_ball);

		if (pick_ball == "X") {
			console.log("Boule Noire!")
			yellow_grid_complete.splice(pick_ball_index, 1);
			playsound_grille_boule_noire.play()
		} else {
			if (team_turn == "yellow") {
				for (i = 0 ; i < yellow_grid[grid_index].length ; i++ ) {
					if (pick_ball == yellow_grid[grid_index][i]) {
						grid_i_index = (i - ( i % 5 )) / 5;
						grid_j_index = i % 5;
						console.log(yellow_grid_placement_complete);
						yellow_grid_placement_complete[i] = "0";
						console.log(yellow_grid_placement_complete);
					}
				}
				yellow_grid_complete.splice(pick_ball_index, 1);
			} else if (team_turn == "blue") {
				for (i = 0 ; i < blue_grid[grid_index].length ; i++ ) {
					if (pick_ball == blue_grid[grid_index][i]) {
						grid_i_index = (i - ( i % 5 )) / 5;
						grid_j_index = i % 5;
						blue_grid_placement_complete[i] = "0";
					}
				}
				blue_grid_complete.splice(pick_ball_index, 1);
			}
			
			animationNumeroTireInterval = setInterval(function() {animationNumeroTire()}, 100);
			playsound_grille_numero_tire.play()
		}
	}

	function animationNumeroTire() {
		if ((animation_index % 2) == 1) {
			if (team_turn == "yellow") {
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = yellow_grid[grid_index][grid_i_index*5+grid_j_index];
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_yellow_number"
			} else {
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).innerHTML = blue_grid[grid_index][grid_i_index*5+grid_j_index];
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_blue_number"
			}
		} else {
			if (team_turn == "yellow") {
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_yellow_number"
			} else {
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_blue_number"
			}
		}
		animation_index++;
		if (animation_index == 11) {
			clearInterval(animationNumeroTireInterval);
			animation_index = 0
			checkMotus();
		}
	}

	function checkMotus() {
	}


	function getNumberRaw() {		// Ne met que dans un tableau les numéros correspondant à un 1 dans le tableau des placement
		yellow_grid_raw = [];
		blue_grid_raw = [];
		hided_number_spot = [];

		for (var i = 0 ; i < yellow_grid[grid_index].length ; i++ ) {
			if (grid_placement[grid_index][i] == 1) {
				yellow_grid_raw.push(yellow_grid[grid_index][i]);
			} else {
				hided_number_spot.push(i);
			}
		}

		for (var i = 0 ; i < blue_grid[grid_index].length ; i++ ) {
			if (grid_placement[grid_index][i] == 1) {
				blue_grid_raw.push(blue_grid[grid_index][i]);
			}
		}
		grid_i_index = 0;
		grid_j_index = 0;
	}

	function displayNumberAnimated() {
		document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number yellow_number" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">' + yellow_grid[grid_index][grid_i_index*5+grid_j_index] + '</div>';
		document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number blue_number" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">' + blue_grid[grid_index][grid_i_index*5+grid_j_index] + '</div>';

		if (grid_j_index == 4 && grid_i_index == 4) { //fin de la grille
			grid_j_index = 0;
			grid_i_index = 0;
			clearInterval(displayNumberAnimation);
			hideNumberAnimation = setInterval(function() {hideNumberAnimated();}, 335);
		} else {
			grid_j_index++;

			if (grid_j_index == 5) { //fin de la ligne
				grid_j_index = 0;
				grid_i_index++;
			}
		}
	}

	function hideNumberAnimated() {
		if (hided_number_spot.length > 0) {
			grid_i_index = ( (hided_number_spot[0]) - (hided_number_spot[0] % 5) ) / 5;
			grid_j_index = hided_number_spot[0] % 5;

			document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
			document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_yellow_number"
			document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
			document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_blue_number"

			hided_number_spot.shift();
			playsound_grille_numero.play();
		} else {
			clearInterval(hideNumberAnimation);
			grid_j_index = 0;
			grid_i_index = 0;			
		}

		
	}

	function hideNumber() {		//Chache les numéros
		for (var i = 0 ; i < 5 ; i++ ) {
			for (var j = 0 ; j < 5 ; j++ ) {
				if (grid_placement[grid_index][i*5+j] == 0) {
					document.getElementById('yellow_number_'+i+'_'+j).innerHTML = "";
					document.getElementById('yellow_number_'+i+'_'+j).className = "hided_yellow_number"
					document.getElementById('blue_number_'+i+'_'+j).innerHTML = "";
					document.getElementById('blue_number_'+i+'_'+j).className = "hided_blue_number"
				}
			}
		}
	}

	function clearGrid() {
		for (var i = 0 ; i < 5 ; i++ ) {		//Suppréssions des numéros
			for (var j = 0 ; j < 5 ; j++ ) {
				document.getElementById('yellow_number_'+i+'_'+j).innerHTML = "";
				document.getElementById('yellow_number_'+i+'_'+j).className = "";
				document.getElementById('blue_number_'+i+'_'+j).innerHTML = "";
				document.getElementById('blue_number_'+i+'_'+j).className = "";
			}
		}
	}

	function changeGrid() {
		if (grid_index > -1) {
			clearGrid();
		}

		document.getElementById("grid_number_yellow").style.display = "inline-table";				//affichage des deux grilles
		document.getElementById("grid_number_blue").style.display = "inline-table";

		grid_index++;
		getNumberRaw();
		getAllBalls();
		displayNumberAnimation = setInterval(function() {displayNumberAnimated(); playsound_grille_creation.play()}, 120);
	}

