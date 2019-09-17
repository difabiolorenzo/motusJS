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
	var number_grid_displayed = false;

	var use_magic_ball = false;
	var team_yellow_magic_ball = false;
	var team_blue_magic_ball = false;

	var picked_ball_random_index = 0;
	var picked_ball_placement = 0;
	var picked_ball = 0;
	var picked_ball_blue_index = 0;
	var picked_ball_yellow_index = 0;
	var motus_engaged = false;

	var motus_letter_m_placement = 0;
	var motus_letter_o_placement = 0;
	var motus_letter_t_placement = 0;
	var motus_letter_u_placement = 0;
	var motus_letter_s_placement = 0;

	var grid_i_index = 0;
	var grid_j_index = 0;

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

	function pickBall() {							// Tire au hasard une boule du tableau grid_complete de l'équipe ayant la main
		if (motus_engaged == false) {
			if (team_turn == "yellow") {
				picked_ball_random_index = Math.floor(Math.random() * yellow_grid_complete.length);
				picked_ball = yellow_grid_complete[picked_ball_random_index];
			} else if (team_turn == "blue") {
				picked_ball_random_index = Math.floor(Math.random() * blue_grid_complete.length);
				picked_ball = blue_grid_complete[picked_ball_random_index]
			}
			console.log("Boule tirée: "+picked_ball);
	
			if (picked_ball == "X") {
				console.log("Boule Noire!")
				if (team_turn == "yellow") {
					yellow_grid_complete.splice(picked_ball_random_index, 1);
				} else if (team_turn == "blue") {
					blue_grid_complete.splice(picked_ball_random_index, 1);
				}
				playsound_grille_boule_noire.play()
			} else {
				if (team_turn == "yellow") {
					for (i = 0 ; i < yellow_grid[grid_index].length ; i++ ) {
						if (picked_ball == yellow_grid[grid_index][i]) {
							grid_i_index = (i - ( i % 5 )) / 5;
							grid_j_index = i % 5;
							yellow_grid_placement_complete[i] = "0";
						}
					}
					yellow_grid_complete.splice(picked_ball_random_index, 1);
				} else if (team_turn == "blue") {
					for (i = 0 ; i < blue_grid[grid_index].length ; i++ ) {
						if (picked_ball == blue_grid[grid_index][i]) {
							grid_i_index = (i - ( i % 5 )) / 5;
							grid_j_index = i % 5;
							blue_grid_placement_complete[i] = "0";
						}
					}
					blue_grid_complete.splice(picked_ball_random_index, 1);
				}
				
				if (display_animation == "true") {
					animationNumeroTireInterval = setInterval(function() {animationNumeroTire()}, 100);
				} else {
					if (team_turn == "yellow") {
						document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = yellow_grid[grid_index][grid_i_index*5+grid_j_index];
						document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_yellow_number"
						document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
					} else if (team_turn == "blue") {
						document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).innerHTML = blue_grid[grid_index][grid_i_index*5+grid_j_index];
						document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_blue_number"
						document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
					}
				}
				checkMotus();
			}
			displayBigNumber();
		} else {
			playsound_letter_missing.play();
		}
	}

	function displayBigNumber() {
		if (picked_ball == "X") {
			document.getElementById("big_number").innerHTML = " ";
			document.getElementById("big_number").className = "big_black_number";
		} else {
			if (team_turn == "yellow") {
				document.getElementById("big_number").innerHTML = picked_ball;
				document.getElementById("big_number").className = "big_yellow_number"
			} else if (team_turn == "blue") {
				document.getElementById("big_number").innerHTML = picked_ball;
				document.getElementById("big_number").className = "big_blue_number"
			}			
		}
	}

	function animationNumeroTire() {
		if ((animation_index % 2) == 1) {
			if (team_turn == "yellow") {
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = yellow_grid[grid_index][grid_i_index*5+grid_j_index];
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_yellow_number"
			} else if (team_turn == "blue") {
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).innerHTML = blue_grid[grid_index][grid_i_index*5+grid_j_index];
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_blue_number"
			}
		} else {
			if (team_turn == "yellow") {
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_yellow_number"
			} else if (team_turn == "blue")  {
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

	function checkMotus() { // Verifie pour les deux grilles si les numéros sont alignés
		if (team_turn == "yellow") {
			for (i=0;i<5;i++) {	//boucle verification grille jaune horizontalement
				if (yellow_grid_placement_complete[i*5] == "0" && yellow_grid_placement_complete[(i*5)+1] == "0" && yellow_grid_placement_complete[(i*5)+2] == "0" && yellow_grid_placement_complete[(i*5)+3] == "0" && yellow_grid_placement_complete[(i*5)+4] == "0") {
					console.log ("Motus Horizontal Jaune");
					playsound_motus.play();
					motus_letter_m_placement = i*5;
					motus_letter_o_placement = (i*5)+1;
					motus_letter_t_placement = (i*5)+2;
					motus_letter_u_placement = (i*5)+3;
					motus_letter_s_placement = (i*5)+4;
					displayMotusAnimationInterval = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (yellow_grid_placement_complete[i] == "0" && yellow_grid_placement_complete[i+5] == "0" && yellow_grid_placement_complete[i+(5*2)] == "0" && yellow_grid_placement_complete[i+(5*3)] == "0" && yellow_grid_placement_complete[i+(5*4)] == "0") {
					console.log ("Motus Vertical Jaune");
					playsound_motus.play();
					motus_letter_m_placement = i;
					motus_letter_o_placement = i+5;
					motus_letter_t_placement = i+(5*2);
					motus_letter_u_placement = i+(5*3);
					motus_letter_s_placement = i+(5*4);
					displayMotusAnimationInterval = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (yellow_grid_placement_complete[0] == "0" && yellow_grid_placement_complete[6] == "0" && yellow_grid_placement_complete[12] == "0" && yellow_grid_placement_complete[18] == "0" && yellow_grid_placement_complete[20] == "0") {
					console.log ("Motus Diagonale Jaune");
					playsound_motus.play();
					motus_letter_m_placement = 0;
					motus_letter_o_placement = 6;
					motus_letter_t_placement = 12;
					motus_letter_u_placement = 18;
					motus_letter_s_placement = 24
					displayMotusAnimationInterval = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (yellow_grid_placement_complete[4] == "0" && yellow_grid_placement_complete[8] == "0" && yellow_grid_placement_complete[12] == "0" && yellow_grid_placement_complete[16] == "0" && yellow_grid_placement_complete[20] == "0") {
					console.log ("Motus Diagonale Jaune");
					playsound_motus.play();
					motus_letter_m_placement = 20;
					motus_letter_o_placement = 16;
					motus_letter_t_placement = 12;
					motus_letter_u_placement = 8;
					motus_letter_s_placement = 4;
					displayMotusAnimationInterval = setInterval(function() {displayMotusAnimated();}, 100)
					break;
				} else {
					playsound_grille_numero_tire.play();
				}
			}		
		} else if (team_turn == "blue") {
			for (i=0;i<5;i++) {	//boucle verification grille jaune horizontalement
				if (blue_grid_placement_complete[i*5] == "0" && blue_grid_placement_complete[(i*5)+1] == "0" && blue_grid_placement_complete[(i*5)+2] == "0" && blue_grid_placement_complete[(i*5)+3] == "0" && blue_grid_placement_complete[(i*5)+4] == "0") {
					console.log ("Motus Horizontal Jaune");
					playsound_motus.play();
					motus_letter_m_placement = i*5;
					motus_letter_o_placement = (i*5)+1;
					motus_letter_t_placement = (i*5)+2;
					motus_letter_u_placement = (i*5)+3;
					motus_letter_s_placement = (i*5)+4;
					displayMotusAnimationInterval = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (blue_grid_placement_complete[i] == "0" && blue_grid_placement_complete[i+5] == "0" && blue_grid_placement_complete[i+(5*2)] == "0" && blue_grid_placement_complete[i+(5*3)] == "0" && blue_grid_placement_complete[i+(5*4)] == "0") {
					console.log ("Motus Vertical Jaune");
					playsound_motus.play();
					motus_letter_m_placement = i;
					motus_letter_o_placement = i+5;
					motus_letter_t_placement = i+(5*2);
					motus_letter_u_placement = i+(5*3);
					motus_letter_s_placement = i+(5*4);
					displayMotusAnimationInterval = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (blue_grid_placement_complete[0] == "0" && blue_grid_placement_complete[6] == "0" && blue_grid_placement_complete[12] == "0" && blue_grid_placement_complete[18] == "0" && blue_grid_placement_complete[20] == "0") {
					console.log ("Motus Diagonale Jaune");
					playsound_motus.play();
					motus_letter_m_placement = 0;
					motus_letter_o_placement = 6;
					motus_letter_t_placement = 12;
					motus_letter_u_placement = 18;
					motus_letter_s_placement = 24
					displayMotusAnimationInterval = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (blue_grid_placement_complete[4] == "0" && blue_grid_placement_complete[8] == "0" && blue_grid_placement_complete[12] == "0" && blue_grid_placement_complete[16] == "0" && blue_grid_placement_complete[20] == "0") {
					console.log ("Motus Diagonale Jaune");
					playsound_motus.play();
					motus_letter_m_placement = 20;
					motus_letter_o_placement = 16;
					motus_letter_t_placement = 12;
					motus_letter_u_placement = 8;
					motus_letter_s_placement = 4;
					displayMotusAnimationInterval = setInterval(function() {displayMotusAnimated();}, 100)
					break;
				} else {
					playsound_grille_numero_tire.play();
				}
			}		
		}
	}

	function displayMotusAnimated() {
		if (team_turn == "yellow") {
			if (animation_index == 0) {
				grid_i_index = ( (motus_letter_m_placement) - (motus_letter_m_placement % 5) ) / 5;
				grid_j_index = motus_letter_m_placement % 5;
						
				document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">M</div>';
			}
			if (animation_index == 1) {
				grid_i_index = ( (motus_letter_o_placement) - (motus_letter_o_placement % 5) ) / 5;
				grid_j_index = motus_letter_o_placement % 5;
				
				document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">O</div>';
			}
			if (animation_index == 2) {
				grid_i_index = ( (motus_letter_t_placement) - (motus_letter_t_placement % 5) ) / 5;
				grid_j_index = motus_letter_t_placement % 5;
				
				document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">T</div>';
			}
			if (animation_index == 3) {
				grid_i_index = ( (motus_letter_u_placement) - (motus_letter_u_placement % 5) ) / 5;
				grid_j_index = motus_letter_u_placement % 5;
				
				document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">U</div>';
			}
			if (animation_index == 4) {
				grid_i_index = ( (motus_letter_s_placement) - (motus_letter_s_placement % 5) ) / 5;
				grid_j_index = motus_letter_s_placement % 5;
				
				document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">S</div>';
			}
		} else if (team_turn == "blue") {
			
			if (animation_index == 0) {
				grid_i_index = ( (motus_letter_m_placement) - (motus_letter_m_placement % 5) ) / 5;
				grid_j_index = motus_letter_m_placement % 5;
						
				document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">M</div>';
			}
			if (animation_index == 1) {
				grid_i_index = ( (motus_letter_o_placement) - (motus_letter_o_placement % 5) ) / 5;
				grid_j_index = motus_letter_o_placement % 5;
				
				document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">O</div>';
			}
			if (animation_index == 2) {
				grid_i_index = ( (motus_letter_t_placement) - (motus_letter_t_placement % 5) ) / 5;
				grid_j_index = motus_letter_t_placement % 5;
				
				document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">T</div>';
			}
			if (animation_index == 3) {
				grid_i_index = ( (motus_letter_u_placement) - (motus_letter_u_placement % 5) ) / 5;
				grid_j_index = motus_letter_u_placement % 5;
				
				document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">U</div>';
			}
			if (animation_index == 4) {
				grid_i_index = ( (motus_letter_s_placement) - (motus_letter_s_placement % 5) ) / 5;
				grid_j_index = motus_letter_s_placement % 5;
				
				document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">S</div>';
			}
		}
		animation_index++;

		if (animation_index == 5) {
			motus_letter_m_placement = 0;
			motus_letter_o_placement = 0;
			motus_letter_t_placement = 0;
			motus_letter_u_placement = 0;
			motus_letter_s_placement = 0;
			grid_i_index = 0;
			grid_j_index = 0;
			
			motus_engaged = true;
			clearInterval(displayMotusAnimationInterval);
		}
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
			clearInterval(displayNumberAnimationInterval);
			hideNumberAnimationInterval = setInterval(function() {hideNumberAnimated();}, 335);
		} else {
			grid_j_index++;

			if (grid_j_index == 5) { //fin de la ligne
				grid_j_index = 0;
				grid_i_index++;
			}
		}
	}

	function displayNumber() {
		for (i=0; i<25; i++) {
			document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number yellow_number" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">' + yellow_grid[grid_index][grid_i_index*5+grid_j_index] + '</div>';
			document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number blue_number" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">' + blue_grid[grid_index][grid_i_index*5+grid_j_index] + '</div>';

			if (grid_j_index == 4 && grid_i_index == 4) { //fin de la grille
				grid_j_index = 0;
				grid_i_index = 0;
			} else {
				grid_j_index++;

				if (grid_j_index == 5) { //fin de la ligne
					grid_j_index = 0;
					grid_i_index++;
				}
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
			clearInterval(hideNumberAnimationInterval);
			grid_j_index = 0;
			grid_i_index = 0;			
		}
	}

	function hideNumberStart() {
		for (i=0; i<8; i++) {
			console.log(hided_number_spot.length)
			if (hided_number_spot.length > 0) {
				

				grid_i_index = ( (hided_number_spot[0]) - (hided_number_spot[0] % 5) ) / 5;
				grid_j_index = hided_number_spot[0] % 5;
				
				console.log("grid_i_index "+grid_i_index)
				console.log("grid_j_index "+grid_j_index)
	
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = " ";
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_yellow_number"
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).innerHTML = " ";
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_blue_number"
	
				hided_number_spot.shift();
				playsound_grille_numero.play();
			} else {
				grid_j_index = 0;
				grid_i_index = 0;
				break;	
			}
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
		if (grid_index == 5) {		//retourne à la première grille si les 6 ont deja été présentés
			grid_index = 0
		}
		if (grid_index > -1) {		//change la grille si elle n'est pas la première
			clearGrid();
		}

		document.getElementById("grid_number_yellow").style.display = "inline-table";				//affichage des deux grilles
		document.getElementById("grid_number_blue").style.display = "inline-table";

		team_yellow_magic_ball = false;
		team_blue_magic_ball = false;
		grid_index++;
		motus_engaged = false;		

		getNumberRaw();
		getAllBalls();
		if (display_animation == "true") {
			displayNumberAnimationInterval = setInterval(function() {displayNumberAnimated(); playsound_grille_creation.play()}, 120);
		} else {
			displayNumber();
			hideNumberStart();
		}
	}