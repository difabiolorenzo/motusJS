sort_mode = "random"; // soit "random" ou "input"
grid_index = 0;
grid_j_index = 0;
grid_i_index = 0;
team_color_grid = [];

yellow_grid_raw = [];
blue_grid_raw = [];
hided_number_spot = [];

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

function getAllBalls() {							// Ajoute x boule noir à la fin du tableau
	yellow_grid_placement_complete = [];
	blue_grid_placement_complete = [];

	yellow_grid_complete = yellow_grid_raw;
	blue_grid_complete = blue_grid_raw;
	yellow_grid_placement_complete = grid_placement[grid_index];
	blue_grid_placement_complete = grid_placement[grid_index];
	for (i = 0 ; i < 3 ; i++ ) {	// ajout de 3 boules noires à la fin du tableau
		yellow_grid_complete.push("X");
		blue_grid_complete.push("X");
	}
}

function hideNumberGrid(team_color) {
	document.getElementById("number_grid_placeolder_" + team_color).innerHTML = "";
}

function initNumberDisplay(team_color) { 

	getNumberRaw()
	getAllBalls()

	displayNumberAnimationInterval = setInterval(function() {displayNumberAnimation(team_color);}, 120);

	if (team_color == "yellow") {
		team_color_grid = yellow_grid;
	} else {
		team_color_grid = blue_grid;
	}
}

function displayNumberAnimation(team_color) {
		playsound("grille_creation");
		document.getElementById(team_color + "_cell_" + grid_i_index + "_" + grid_j_index).innerHTML = "<div class=\"number " + team_color + "_number\" id=\"" + team_color + "_number_" + grid_i_index + "_" + grid_j_index + "\">" + team_color_grid[grid_index][grid_i_index*5+grid_j_index] + "</div>"

		if (grid_j_index == 4 && grid_i_index == 4) { //fin de la grille
			grid_j_index = 0;
			grid_i_index = 0;
			clearInterval(displayNumberAnimationInterval);
			hideNumberAnimationInterval = setInterval(function() {hideNumberAnimation();}, 335);
		} else {
			grid_j_index++;

			if (grid_j_index == 5) { //fin de la ligne
				grid_j_index = 0;
				grid_i_index++;
			}
		}
}

function hideNumberAnimation() {
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
		clearInterval(hideNumberAnimationInterval);
		grid_j_index = 0;
		grid_i_index = 0;			
	}
}
