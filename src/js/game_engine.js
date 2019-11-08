	
	var pause = true;

	var use_number_grid = localStorage.getItem('use_number_grid');						//Utilisation de la grille
	var grid_style = localStorage.getItem('grid_style');						//Thème de la grille
	var fullscreen = localStorage.getItem('fullscreen');						//Fullscreen
	document.getElementById("body").className = grid_style + " " + fullscreen;						

	var playsound_letter_ok = new Audio('src/sound/lettre_ok.mp3');
	var playsound_letter_bad = new Audio('src/sound/lettre_mauvaise.mp3');
	var playsound_letter_missing = new Audio('src/sound/lettre_absente.mp3');
	var playsound_letter_bonus = new Audio('src/sound/lettre_bonus.mp3');
	var playsound_wrong = new Audio('src/sound/erreur.mp3');
	var playsound_victory = new Audio('src/sound/victory.mp3');
	var playsound_temps_ecoule = new Audio('src/sound/temps_ecoule.mp3');
	
	var playsound_grille_creation = new Audio('src/sound/grille_creation.mp3');
	var playsound_grille_numero = new Audio('src/sound/grille_numero.mp3');
	var playsound_grille_boule_noire = new Audio('src/sound/grille_boule_noire.mp3');
	var playsound_grille_numero_tire = new Audio('src/sound/grille_numero_tire.mp3');
	var playsound_motus = new Audio('src/sound/motus.mp3');

	sound_volume = 1;

	playsound_letter_ok.volume = sound_volume;
	playsound_letter_bad.volume = sound_volume;
	playsound_letter_missing.volume = sound_volume;
	playsound_letter_bonus.volume = sound_volume;
	playsound_wrong.volume = sound_volume;
	playsound_victory.volume = sound_volume;
	playsound_temps_ecoule.volume = sound_volume;
	
	playsound_grille_creation.volume = sound_volume;
	playsound_grille_numero.volume = sound_volume;
	playsound_grille_boule_noire.volume = sound_volume;
	playsound_grille_numero_tire.volume = sound_volume;
	playsound_motus.volume = sound_volume;

	function initGame() {
		displayMenu();
	}

	function displayMenu() {
		if (pause == true) {
			pause = false;
			document.getElementById("score").style.opacity = '0';
		} else {
			pause = true;
			document.getElementById("score").style.opacity = '1';
		}
	}

	function displayNumberGrid() {
		if (use_number_grid == "true") {
			if (number_grid_displayed == true) {
				number_grid_displayed = false;
				document.getElementById("grid_number").style.opacity = '0';
	
			} else {
				number_grid_displayed = true;
				document.getElementById("grid_number").style.opacity = '1';
				if (team_turn == "yellow") {	//affichage uniquement la grille de l'équipe
					document.getElementById("grid_number_blue").style.display = "none";
				} else {
					document.getElementById("grid_number_yellow").style.display = "none";
				}
			}
		} else {
	}
}