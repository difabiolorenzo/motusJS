function settings() {

	if (document.getElementById("letter_count_7").checked == true) {
		var word_length = 7;
	} else if (document.getElementById("letter_count_8").checked == true) {
		var word_length = 8;
	} else if (document.getElementById("letter_count_9").checked == true) {
		var word_length = 9;
	} else if (document.getElementById("letter_count_10").checked == true) {
		var word_length = 10;
	}
	console.log("word lenght: "+word_length);

	
	if (document.getElementById("try_count_4").checked == true) {
		var try_count = 4;
	} else if (document.getElementById("try_count_5").checked == true) {
		var try_count = 5;
	} else if (document.getElementById("try_count_6").checked == true) {
		var try_count = 6;
	} else if (document.getElementById("try_count_7").checked == true) {
		var try_count = 7;
	}
	console.log("try count: "+try_count);
	

	if (document.getElementById("display_definition_on").checked == true) {
		var display_definitions = true;
	} else if (document.getElementById("display_definition_off").checked == true) {
		var display_definitions = false;
	}
	console.log("displaying definitions: "+display_definitions);

	if (document.getElementById("display_animations_on").checked == true) {
		var display_animation = true;
	} else if (document.getElementById("display_animations_off").checked == true) {
		var display_animation = false;
	}
	console.log("displaying animations: "+display_animation);
	

	if (document.getElementById("display_debug_info_on").checked == true) {
		var display_debug_info = true;
	} else if (document.getElementById("display_debug_info_off").checked == true) {
		var display_debug_info = false;
	}
	console.log("displaying debug_info: "+display_debug_info);

	
	if (document.getElementById("allow_duplication_on").checked == true) {
		var allow_duplication = true;
	} else if (document.getElementById("allow_duplication_off").checked == true) {
		var allow_duplication = false;
	}
	console.log("allow duplication: "+allow_duplication);
	

	if (document.getElementById("countdown_off").checked == true) {
		var countdown_enabled = false;
	} else if (document.getElementById("countdown_8sec").checked == true) {
		var countdown_enabled = true;
		var countdown_time = 8;
	} else if (document.getElementById("countdown_10sec").checked == true) {
		var countdown_enabled = true;
		var countdcountdown_timeown = 10;
	} else if (document.getElementById("countdown_15sec").checked == true) {
		var countdown_enabled = true;
		var countdown_time = 15;
	}
	console.log("use of countdown: "+countdown_enabled);
	console.log("time for countdown: "+countdown_time);
	

	if (document.getElementById("difficulty_easy").checked == true) {
		var difficulty = 1;
	} else if (document.getElementById("difficulty_normal").checked == true) {
		var difficulty = 2;
	} else if (document.getElementById("difficulty_hard").checked == true) {
		var difficulty = 3;
	} else if (document.getElementById("difficulty_off").checked == true) {
		var difficulty = 0;
	}
	console.log("difficulty: "+difficulty);

	if (document.getElementById("team_turn_yellow").checked == true) {
		var team_turn = "yellow";
	} else if (document.getElementById("team_turn_blue").checked == true) {
		var team_turn = "blue";
	}
	console.log("team_turn: "+team_turn);

	var team_yellow_name = document.getElementById("team-yellow-name").value;
	var team_blue_name = document.getElementById("team-blue-name").value;
	console.log("team yellow name: "+team_yellow_name);
	console.log("team blue name: "+team_blue_name);
	console.log("---");

	if (document.getElementById("grid_style_1990").checked == true) {
		var grid_style = "1990";
	} else if (document.getElementById("grid_style_2010").checked == true) {
		var grid_style = "2010";
	} else if (document.getElementById("grid_style_2019").checked == true) {
		var grid_style = "2019";
	}
	console.log("grid_style: "+grid_style);

	localStorage.setItem('word_length', word_length);
	localStorage.setItem('try_count', try_count);
	localStorage.setItem('display_definitions', display_definitions);
	localStorage.setItem('display_animation', display_animation);
	localStorage.setItem('display_debug_info', display_debug_info);
	localStorage.setItem('allow_duplication', allow_duplication);
	localStorage.setItem('countdown_enabled', countdown_enabled);
	localStorage.setItem('countdown_time', countdown_time);
	localStorage.setItem('team_yellow_name', team_yellow_name);
	localStorage.setItem('team_blue_name', team_blue_name);
	localStorage.setItem('team_turn', team_turn);
	localStorage.setItem('grid_style', grid_style);

	window.location = "./grid.html";
}