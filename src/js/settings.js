function settings() {

	if (document.getElementById("letter_count_choise_7").checked == true) {
		var word_length = 7;
	} else if (document.getElementById("letter_count_choise_8").checked == true) {
		var word_length = 8;
	} else if (document.getElementById("letter_count_choise_9").checked == true) {
		var word_length = 9;
	} else if (document.getElementById("letter_count_choise_10").checked == true) {
		var word_length = 10;
	}
	console.log("word lenght: "+word_length);
	

	if (document.getElementById("display_definition_on").checked == true) {
		var display_definitions = true;
	} else if (document.getElementById("display_definition_off").checked == true) {
		var display_definitions = false;
	}
	console.log("displaying definitions: "+display_definitions);


	if (document.getElementById("fullscreen_on").checked == true) {
		var fullscreen = true;
	} else if (document.getElementById("fullscreen_off").checked == true) {
		var fullscreen = false;
	}
	console.log("displaying in fullscreen: "+fullscreen);

	
	if (document.getElementById("allow_duplication_on").checked == true) {
		var allow_duplication = true;
	} else if (document.getElementById("allow_duplication_off").checked == true) {
		var allow_duplication = false;
	}
	console.log("allow duplication: "+allow_duplication);
	

	if (document.getElementById("countdown_off").checked == true) {
		var use_countdown = false;
	} else if (document.getElementById("countdown_8sec").checked == true) {
		var use_countdown = true;
		var countdown_time = 8;
	} else if (document.getElementById("countdown_10sec").checked == true) {
		var use_countdown = true;
		var countdcountdown_timeown = 10;
	} else if (document.getElementById("countdown_15sec").checked == true) {
		var use_countdown = true;
		var countdown_time = 15;
	}
	console.log("use of countdown: "+use_countdown);
	console.log("time for countdown: "+countdown_time);
	

	if (document.getElementById("difficulty_choise_easy").checked == true) {
		var difficulty = 1;
	} else if (document.getElementById("difficulty_choise_normal").checked == true) {
		var difficulty = 2;
	} else if (document.getElementById("difficulty_choise_hard").checked == true) {
		var difficulty = 3;
	} else if (document.getElementById("difficulty_choise_off").checked == true) {
		var difficulty = 0;
	}
	console.log("difficulty: "+difficulty);


	var team_yellow_name = document.getElementById("team-yellow-name").value;
	var team_blue_name = document.getElementById("team-blue-name").value;
	console.log("team yellow name: "+team_yellow_name);
	console.log("team blue name: "+team_blue_name);
	console.log("---");

	localStorage.setItem('word_length', word_length);
	localStorage.setItem('display_definitions', display_definitions);
	localStorage.setItem('fullscreen', fullscreen);
	localStorage.setItem('allow_duplication', allow_duplication);
	localStorage.setItem('use_countdown', use_countdown);
	localStorage.setItem('countdown_time', countdown_time);
	localStorage.setItem('team_yellow_name', team_yellow_name);
	localStorage.setItem('team_blue_name', team_blue_name);

}