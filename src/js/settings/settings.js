

function getRadioVal(settingsForm, formSectionName) {
	var outputValue;
	var formSection = settingsForm.elements[formSectionName];
    for (var i=0; i<formSection.length; i++) {
        if(formSection[i].checked) {
			outputValue = formSection[i].value;
			break;
		}
    }
	return outputValue;
}

function settings() {

	var settingsForm = document.getElementById("settings");
	
	word_length = getRadioVal(settingsForm, "letter_count");
	try_count = getRadioVal(settingsForm, "try_count");
	display_definition = getRadioVal(settingsForm, "display_definition");
	display_animation = getRadioVal(settingsForm, "display_animation");
	fullscreen = getRadioVal(settingsForm, "fullscreen");
	display_debug_info = getRadioVal(settingsForm, "display_debug_info");
	allow_duplication = getRadioVal(settingsForm, "allow_duplication");
	countdown = getRadioVal(settingsForm, "countdown");
	magic_ball = getRadioVal(settingsForm, "magic_ball");
	difficulty = getRadioVal(settingsForm, "difficulty");
	team_yellow_name = document.getElementById("team-yellow-name").value;
	team_blue_name = document.getElementById("team-blue-name").value;
	team_turn = getRadioVal(settingsForm, "team_turn");
	grid_style = getRadioVal(settingsForm, "grid_style");

	localStorage.setItem('word_length', word_length);
	localStorage.setItem('try_count', try_count);
	localStorage.setItem('display_definition', display_definition);
	localStorage.setItem('display_animation', display_animation);
	localStorage.setItem('fullscreen', fullscreen);
	localStorage.setItem('display_debug_info', display_debug_info);
	localStorage.setItem('allow_duplication', allow_duplication);
	localStorage.setItem('countdown', countdown);
	localStorage.setItem('magic_ball', magic_ball);
	localStorage.setItem('difficulty', difficulty);
	localStorage.setItem('team_yellow_name', team_yellow_name);
	localStorage.setItem('team_blue_name', team_blue_name);
	localStorage.setItem('team_turn', team_turn);
	localStorage.setItem('grid_style', grid_style);

	window.location = "./motus.html";
}