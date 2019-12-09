function createNumberGrid(team_color) {

	document.getElementById("number_grid_placeolder_" + team_color).innerHTML = "";

	var number_html_table = "<table class=\"table_number\">";



	for (var j = 0; j <= 4; j++) {
		number_html_table += "<tr>";
		for (var i = 0; i < 5; i++) {
			number_html_table += "<td id=\"" + team_color + "_cell_" + j + "_" + i + "\" class=\"cell_team_" + team_color + "\"> <div class='number " + team_color + "_number' id='" + team_color + "_number_2_3'>" + Math.floor(Math.random() * 80); + "</div> </td>";
		}
		number_html_table += "</tr>";
	}
	number_html_table += "</table>";

	document.getElementById("number_grid_placeolder_" + team_color).innerHTML = number_html_table;
}