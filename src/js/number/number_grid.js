sort_mode = "random"; // soit "random" ou "input"
grid_index = 0;
grid_j_index = 0;
grid_i_index = 0;
team_color_grid = []


function createNumberGrid(team_color) {

	document.getElementById("number_grid_placeolder_" + team_color).innerHTML = "";
	var number_html_table = "<table class=\"table_number\">";

	for (var j = 0; j <= 4; j++) {
		number_html_table += "<tr>";
		for (var i = 0; i < 5; i++) {
			number_html_table += "<td id=\"" + team_color + "_cell_" + j + "_" + i + "\" class=\"cell_team_" + team_color + "\"></td>";
		}
		number_html_table += "</tr>";
	}
	number_html_table += "</table>";

	document.getElementById("number_grid_placeolder_" + team_color).innerHTML = number_html_table;
}


function initNumberDisplay(team_color) {
	playsound("grille_creation");
	displayNumberAnimationInterval = setInterval(function() {displayNumberAnimation(team_color);}, 120);

	if (team_color == "yellow") {
		team_color_grid = yellow_grid;
	} else {
		team_color_grid = blue_grid;
	}
}


function displayNumberAnimation(team_color) {
		document.getElementById(team_color + "_cell_" + grid_i_index + "_" + grid_j_index).innerHTML = "<div class=\"number " + team_color + "_number\" id=\"" + team_color + "_number_" + grid_i_index + "_" + grid_j_index + "\">" + team_color_grid[grid_index][grid_i_index*5+grid_j_index] + "</div>"

		if (grid_j_index == 4 && grid_i_index == 4) { //fin de la grille
			grid_j_index = 0;
			grid_i_index = 0;
			clearInterval(displayNumberAnimationInterval);
			// hideNumberAnimationInterval = setInterval(function() {hideNumberAnimated();}, 335);
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

for (var j = 0; j <= 4; j++) {
	number_html_table += "<tr>";
	for (var i = 0; i < 5; i++) {
		number_html_table += "<td id=\"" + team_color + "_cell_" + j + "_" + i + "\" class=\"cell_team_" + team_color + "\"> <div class='number " + team_color + "_number' id='" + team_color + "_number_2_3'>" + Math.floor(Math.random() * 80); + "</div> </td>";
	}
	number_html_table += "</tr>";
}
number_html_table += "</table>";

document.getElementById(team_color + "_cell_" + j + "_" + i).innerHTML = number_html_table;