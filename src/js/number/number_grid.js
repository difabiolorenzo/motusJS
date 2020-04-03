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

function getAllBalls() {
	yellow_grid_placement_complete = [];
	blue_grid_placement_complete = [];
	yellow_grid_complete = [];
	blue_grid_complete = [];

	//Copie des numéros de x_grid_raw vers x_grid_complete

	for (i=0; i < yellow_grid_raw.length; i++) {
		yellow_grid_complete.push(yellow_grid_raw[i]);
	}
	for (i=0; i < blue_grid_raw.length; i++) {
		blue_grid_complete.push(blue_grid_raw[i]);
	}

	yellow_grid_placement_complete = grid_placement[grid_index];
	blue_grid_placement_complete = grid_placement[grid_index];
	for (i = 0 ; i < black_ball_amount ; i++ ) {	// ajout de 3 boules noires à la fin du tableau
		yellow_grid_complete.push("X");
		blue_grid_complete.push("X");
	}
}

function createSavingBall() {
	yellow_saving_ball = yellow_grid_raw[Math.floor(Math.random() * yellow_grid_raw.length)];
	blue_saving_ball = blue_grid_raw[Math.floor(Math.random() * blue_grid_raw.length)];
}

function changeNumberGrid() {
	if (grid_index >= 0 && grid_index < 5) {
		grid_index++
	} else {
		grid_index = 0;
	}
	console.log("Affichage de la grille numérotée n° " + (grid_index+1));

	numberDisplay()
}

function numberDisplay() { 

	getNumberRaw();
	getAllBalls();
	emptyPurgatory();
	createSavingBall();

	motus_engaged = false;
	motus_animation_index = 0;
	picked_ball_animation = 0;
	yellow_saving_ball_picked = false;
	blue_saving_ball_picked = false;

	clearInterval(animationIntervalID_4);
	clearInterval(animationIntervalID_5);

		team_color_grid = yellow_grid;
		for (i=0 ; i<25; i++) {
			if (use_saving_ball == true && team_color_grid[grid_index][grid_i_index*5+grid_j_index] == yellow_saving_ball) {
				if ( (limiting_saving_ball == true && grid_index == 0) || (limiting_saving_ball == false) ) {
					document.getElementById("yellow_cell_" + grid_i_index + "_" + grid_j_index).innerHTML = "<div class=\"number yellow_number saving_ball\" id=\"" + "yellow_number_" + grid_i_index + "_" + grid_j_index + "\" onclick=\"manuallyPickBall('" + team_color_grid[grid_index][grid_i_index*5+grid_j_index] +"')\">" + team_color_grid[grid_index][grid_i_index*5+grid_j_index] + "</div>"
				}
			} else {
				document.getElementById("yellow_cell_" + grid_i_index + "_" + grid_j_index).innerHTML = "<div class=\"number yellow_number\" id=\"" + "yellow_number_" + grid_i_index + "_" + grid_j_index + "\" onclick=\"manuallyPickBall('" + team_color_grid[grid_index][grid_i_index*5+grid_j_index] +"')\">" + team_color_grid[grid_index][grid_i_index*5+grid_j_index] + "</div>"
			}

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
		
		team_color_grid = blue_grid;
		for (i=0 ; i<25; i++) {

			if (use_saving_ball == true && team_color_grid[grid_index][grid_i_index*5+grid_j_index] == blue_saving_ball) {
				if ( (limiting_saving_ball == true && grid_index == 0) || (limiting_saving_ball == false) ) {
					document.getElementById("blue_cell_" + grid_i_index + "_" + grid_j_index).innerHTML = "<div class=\"number blue_number saving_ball\" id=\"" + "blue_number_" + grid_i_index + "_" + grid_j_index + "\" onclick=\"manuallyPickBall('" + team_color_grid[grid_index][grid_i_index*5+grid_j_index] +"')\">" + team_color_grid[grid_index][grid_i_index*5+grid_j_index] + "</div>"
				}
			} else {
				document.getElementById("blue_cell_" + grid_i_index + "_" + grid_j_index).innerHTML = "<div class=\"number blue_number\" id=\"" + "blue_number_" + grid_i_index + "_" + grid_j_index + "\" onclick=\"manuallyPickBall('" + team_color_grid[grid_index][grid_i_index*5+grid_j_index] +"')\">" + team_color_grid[grid_index][grid_i_index*5+grid_j_index] + "</div>"
			}

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
		hideNumber();
	}

function hideNumber() {
	for (i=0; i<8; i++) {
		grid_i_index = ( (hided_number_spot[0]) - (hided_number_spot[0] % 5) ) / 5;
		grid_j_index = hided_number_spot[0] % 5;

		document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
		document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_yellow_number";
		document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
		document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_blue_number"

		hided_number_spot.shift();
	}
	grid_j_index = 0;
	grid_i_index = 0;	
}

function emptyPurgatory() {
	document.getElementById("yellow_purgatory").innerHTML = "<td></td>";
	document.getElementById("blue_purgatory").innerHTML = "<td></td>";
}

function pickBall(picked_ball, picked_ball_random_index) {							// Tire au hasard une boule du tableau grid_complete de l'équipe ayant la main
		if (motus_engaged == false && picked_ball_animation == 0 && motus_animation_index == 0 && try_picking_ball_left > 0) {
			try_picking_ball_left--;
			if (try_picking_ball_left == 0) {
				document.getElementById("button_pick_number").style = "display:none";	//affichage du bouton piocher
				
				if (automatic_behaviour == true && automatic_behaviour_redirect_letter_grid == true) {
					setTimeout(function() { displayPage('letter_grid_page'); reinitWord() } , 2000);
				}
			}

			if (picked_ball == undefined) {
				if (team_focus == "yellow") {
					var picked_ball_random_index = Math.floor(Math.random() * yellow_grid_complete.length);
					var picked_ball = yellow_grid_complete[picked_ball_random_index];
				} else if (team_focus == "blue") {
					var picked_ball_random_index = Math.floor(Math.random() * blue_grid_complete.length);
					var picked_ball = blue_grid_complete[picked_ball_random_index]
				}
			}
			console.log("Boule tirée: " + picked_ball);
	
			if (picked_ball == "X") {
				console.log("Boule Noire!")

				if (team_focus == "yellow") {

					if (yellow_saving_ball_picked == true) {
						yellow_saving_ball_picked = false;
						yellow_saving_ball = undefined;
						setTimeout(function() { playsound("boule_magique"); } , 970);
						console.log("Boule Noire déjouée! Vous avez toujours la main");

					} else {
						if ( team_enabled == true ) {
							console.log("La main passe!");
							setTimeout(function() { displayPage('letter_grid_page'); switchTeamFocus(); } , 2000);
						}
						
						try_picking_ball_left = 0;
							
						document.getElementById("button_pick_number").style = "display:none";	//affichage du bouton piocher
						
						if (automatic_behaviour == true && automatic_behaviour_redirect_letter_grid == true) {
							setTimeout(function() { displayPage('letter_grid_page'); reinitWord() } , 2000);
						}
					}
					yellow_purgatory.rows[0].insertCell().innerHTML += '<td class="cell_purgatory"> <div class="purgatory_number black_number"></div> </td>'
					yellow_grid_complete.splice(picked_ball_random_index, 1);

				} else if (team_focus == "blue") {

					if (blue_saving_ball_picked == true) {
						blue_saving_ball_picked = false
						blue_saving_ball = undefined;
						setTimeout(function() { playsound("boule_magique"); } , 970);
						console.log("Boule Noire déjouée! Vous avez toujours la main");

					} else {
						if ( team_enabled == true ) {
							console.log("La main passe!");
							setTimeout(function() { displayPage('letter_grid_page'); switchTeamFocus(); } , 2000);
						}
						
						try_picking_ball_left = 0;
							
						document.getElementById("button_pick_number").style = "display:none";	//affichage du bouton piocher
						document.getElementById("button_return_letter_grid").style = "display:none";	//affichage du bouton piocher

						if (automatic_behaviour == true && automatic_behaviour_redirect_letter_grid == true) {
							setTimeout(function() { displayPage('letter_grid_page'); reinitWord() } , 2000);
						}
					}
					blue_purgatory.rows[0].insertCell().innerHTML += '<td class="cell_purgatory"> <div class="purgatory_number black_number"></div> </td>'
					blue_grid_complete.splice(picked_ball_random_index, 1);
				}

				playsound('grille_boule_noire');
			} else {
				if (team_focus == "yellow") {
					for (i = 0 ; i < yellow_grid[grid_index].length ; i++ ) {
						if (picked_ball == yellow_grid[grid_index][i]) {
							grid_i_index = (i - ( i % 5 )) / 5;
							grid_j_index = i % 5;
							yellow_grid_placement_complete[i] = "0";
						}
					}
					yellow_grid_complete.splice(picked_ball_random_index, 1);

					if (picked_ball == yellow_saving_ball) {
						console.log("Boule Magique!");
						playsound("boule_magique");
						yellow_saving_ball_picked = true;

						yellow_purgatory.rows[0].insertCell().innerHTML += '<td class="cell_purgatory"> <div class="purgatory_number yellow_number saving_ball">' + picked_ball + '</div> </td>';
					} else {
						yellow_purgatory.rows[0].insertCell().innerHTML += '<td class="cell_purgatory"> <div class="purgatory_number yellow_number">' + picked_ball + '</div> </td>';
					}
				} else if (team_focus == "blue") {
					for (i = 0 ; i < blue_grid[grid_index].length ; i++ ) {
						if (picked_ball == blue_grid[grid_index][i]) {
							grid_i_index = (i - ( i % 5 )) / 5;
							grid_j_index = i % 5;
							blue_grid_placement_complete[i] = "0";
						}
					}
					blue_grid_complete.splice(picked_ball_random_index, 1);
					if (picked_ball == blue_saving_ball) {
						console.log("Boule Magique!");
						playsound("boule_magique");
						blue_saving_ball_picked = true;

						blue_purgatory.rows[0].insertCell().innerHTML += '<td class="cell_purgatory"> <div class="purgatory_number blue_number saving_ball">' + picked_ball + '</div> </td>';
					} else {
						blue_purgatory.rows[0].insertCell().innerHTML += '<td class="cell_purgatory"> <div class="purgatory_number blue_number">' + picked_ball + '</div> </td>';
					}
				}
				
				animationIntervalID_4 = setInterval(function() {animationNumeroTire()}, 100);	
				playsound('grille_numero_tire')	;			
			}
		} else {
			playsound('letter_missing');
		}
	}

	function animationNumeroTire() {
		if ((picked_ball_animation % 2) == 1) {
			if (team_focus == "yellow") {
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = yellow_grid[grid_index][grid_i_index*5+grid_j_index];
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_yellow_number"
			} else if (team_focus == "blue") {
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).innerHTML = blue_grid[grid_index][grid_i_index*5+grid_j_index];
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_blue_number"
			}
		} else {
			if (team_focus == "yellow") {
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
				document.getElementById('yellow_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_yellow_number"
			} else if (team_focus == "blue")  {
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).innerHTML = "";
				document.getElementById('blue_number_'+grid_i_index+'_'+grid_j_index).className = "number hided_blue_number"
			}
		}
		picked_ball_animation++;
		if (picked_ball_animation == 11) {
			clearInterval(animationIntervalID_4);
			picked_ball_animation = 0;
			checkMotus();
		}
	}

	function checkMotus() { // Verifie pour les deux grilles si les numéros sont alignés
		if (team_focus == "yellow") {
			for (i=0;i<5;i++) {	//boucle verification grille jaune horizontalement
				if (yellow_grid_placement_complete[i*5] == "0" && yellow_grid_placement_complete[(i*5)+1] == "0" && yellow_grid_placement_complete[(i*5)+2] == "0" && yellow_grid_placement_complete[(i*5)+3] == "0" && yellow_grid_placement_complete[(i*5)+4] == "0") {
					console.log ("Motus Horizontal Jaune");
					playsound('motus')
					motus_letter_m_placement = i*5;
					motus_letter_o_placement = (i*5)+1;
					motus_letter_t_placement = (i*5)+2;
					motus_letter_u_placement = (i*5)+3;
					motus_letter_s_placement = (i*5)+4;
					animationIntervalID_5 = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (yellow_grid_placement_complete[i] == "0" && yellow_grid_placement_complete[i+5] == "0" && yellow_grid_placement_complete[i+(5*2)] == "0" && yellow_grid_placement_complete[i+(5*3)] == "0" && yellow_grid_placement_complete[i+(5*4)] == "0") {
					console.log ("Motus Vertical Jaune");
					playsound('motus')
					motus_letter_m_placement = i;
					motus_letter_o_placement = i+5;
					motus_letter_t_placement = i+(5*2);
					motus_letter_u_placement = i+(5*3);
					motus_letter_s_placement = i+(5*4);
					animationIntervalID_5 = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (yellow_grid_placement_complete[0] == "0" && yellow_grid_placement_complete[6] == "0" && yellow_grid_placement_complete[12] == "0" && yellow_grid_placement_complete[18] == "0" && yellow_grid_placement_complete[20] == "0") {
					console.log ("Motus Diagonale Jaune");
					playsound('motus')
					motus_letter_m_placement = 0;
					motus_letter_o_placement = 6;
					motus_letter_t_placement = 12;
					motus_letter_u_placement = 18;
					motus_letter_s_placement = 24
					animationIntervalID_5 = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (yellow_grid_placement_complete[4] == "0" && yellow_grid_placement_complete[8] == "0" && yellow_grid_placement_complete[12] == "0" && yellow_grid_placement_complete[16] == "0" && yellow_grid_placement_complete[20] == "0") {
					console.log ("Motus Diagonale Jaune");
					playsound('motus')
					motus_letter_m_placement = 20;
					motus_letter_o_placement = 16;
					motus_letter_t_placement = 12;
					motus_letter_u_placement = 8;
					motus_letter_s_placement = 4;
					animationIntervalID_5 = setInterval(function() {displayMotusAnimated();}, 100)
					break;
				}
			}
		} else if (team_focus == "blue") {
			for (i=0;i<5;i++) {	//boucle verification grille jaune horizontalement
				if (blue_grid_placement_complete[i*5] == "0" && blue_grid_placement_complete[(i*5)+1] == "0" && blue_grid_placement_complete[(i*5)+2] == "0" && blue_grid_placement_complete[(i*5)+3] == "0" && blue_grid_placement_complete[(i*5)+4] == "0") {
					console.log ("Motus Horizontal Bleu");
					playsound('motus')
					motus_letter_m_placement = i*5;
					motus_letter_o_placement = (i*5)+1;
					motus_letter_t_placement = (i*5)+2;
					motus_letter_u_placement = (i*5)+3;
					motus_letter_s_placement = (i*5)+4;
					animationIntervalID_5 = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (blue_grid_placement_complete[i] == "0" && blue_grid_placement_complete[i+5] == "0" && blue_grid_placement_complete[i+(5*2)] == "0" && blue_grid_placement_complete[i+(5*3)] == "0" && blue_grid_placement_complete[i+(5*4)] == "0") {
					console.log ("Motus Vertical Bleu");
					playsound('motus')
					motus_letter_m_placement = i;
					motus_letter_o_placement = i+5;
					motus_letter_t_placement = i+(5*2);
					motus_letter_u_placement = i+(5*3);
					motus_letter_s_placement = i+(5*4);
					animationIntervalID_5 = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (blue_grid_placement_complete[0] == "0" && blue_grid_placement_complete[6] == "0" && blue_grid_placement_complete[12] == "0" && blue_grid_placement_complete[18] == "0" && blue_grid_placement_complete[20] == "0") {
					console.log ("Motus Diagonale Bleu");
					playsound('motus')
					motus_letter_m_placement = 0;
					motus_letter_o_placement = 6;
					motus_letter_t_placement = 12;
					motus_letter_u_placement = 18;
					motus_letter_s_placement = 24
					animationIntervalID_5 = setInterval(function() {displayMotusAnimated();}, 100);
					break;
				} else if (blue_grid_placement_complete[4] == "0" && blue_grid_placement_complete[8] == "0" && blue_grid_placement_complete[12] == "0" && blue_grid_placement_complete[16] == "0" && blue_grid_placement_complete[20] == "0") {
					console.log ("Motus Diagonale Bleu");
					playsound('motus')
					motus_letter_m_placement = 20;
					motus_letter_o_placement = 16;
					motus_letter_t_placement = 12;
					motus_letter_u_placement = 8;
					motus_letter_s_placement = 4;
					animationIntervalID_5 = setInterval(function() {displayMotusAnimated();}, 100)
					break;
				}
			}		
		}
	}

	function displayMotusAnimated() {
		if (team_focus == "yellow") {
			if (motus_animation_index == 0) {
				grid_i_index = ( (motus_letter_m_placement) - (motus_letter_m_placement % 5) ) / 5;
				grid_j_index = motus_letter_m_placement % 5;
						
				document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">M</div>';
			}
			if (motus_animation_index == 1) {
				grid_i_index = ( (motus_letter_o_placement) - (motus_letter_o_placement % 5) ) / 5;
				grid_j_index = motus_letter_o_placement % 5;
				
				document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">O</div>';
			}
			if (motus_animation_index == 2) {
				grid_i_index = ( (motus_letter_t_placement) - (motus_letter_t_placement % 5) ) / 5;
				grid_j_index = motus_letter_t_placement % 5;
				
				document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">T</div>';
			}
			if (motus_animation_index == 3) {
				grid_i_index = ( (motus_letter_u_placement) - (motus_letter_u_placement % 5) ) / 5;
				grid_j_index = motus_letter_u_placement % 5;
				
				document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">U</div>';
			}
			if (motus_animation_index == 4) {
				grid_i_index = ( (motus_letter_s_placement) - (motus_letter_s_placement % 5) ) / 5;
				grid_j_index = motus_letter_s_placement % 5;
				
				document.getElementById('yellow_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="yellow_number_' + grid_i_index + '_' + grid_j_index + '">S</div>';
			}
		} else if (team_focus == "blue") {
			
			if (motus_animation_index == 0) {
				grid_i_index = ( (motus_letter_m_placement) - (motus_letter_m_placement % 5) ) / 5;
				grid_j_index = motus_letter_m_placement % 5;
						
				document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">M</div>';
			}
			if (motus_animation_index == 1) {
				grid_i_index = ( (motus_letter_o_placement) - (motus_letter_o_placement % 5) ) / 5;
				grid_j_index = motus_letter_o_placement % 5;
				
				document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">O</div>';
			}
			if (motus_animation_index == 2) {
				grid_i_index = ( (motus_letter_t_placement) - (motus_letter_t_placement % 5) ) / 5;
				grid_j_index = motus_letter_t_placement % 5;
				
				document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">T</div>';
			}
			if (motus_animation_index == 3) {
				grid_i_index = ( (motus_letter_u_placement) - (motus_letter_u_placement % 5) ) / 5;
				grid_j_index = motus_letter_u_placement % 5;
				
				document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">U</div>';
			}
			if (motus_animation_index == 4) {
				grid_i_index = ( (motus_letter_s_placement) - (motus_letter_s_placement % 5) ) / 5;
				grid_j_index = motus_letter_s_placement % 5;
				
				document.getElementById('blue_cell_'+grid_i_index+'_'+grid_j_index).innerHTML = '<div class="number motus_cell" id="blue_number_' + grid_i_index + '_' + grid_j_index + '">S</div>';
			}
		}
		motus_animation_index++;

		if (motus_animation_index == 5) {
			motus_letter_m_placement = 0;
			motus_letter_o_placement = 0;
			motus_letter_t_placement = 0;
			motus_letter_u_placement = 0;
			motus_letter_s_placement = 0;
			grid_i_index = 0;
			grid_j_index = 0;
			
			motus_engaged = true;
			clearInterval(animationIntervalID_5);
			addScoreTeamFocus(); addScoreTeamFocus(); // ajoute 100 ou 2 points
			if (automatic_behaviour == true && automatic_behaviour_redirect_letter_grid == true) {
				setTimeout(function() { displayPage('letter_grid_page'); reinitWord(); changeNumberGrid();} , 5000);
			} else {
				setTimeout(function() { changeNumberGrid(); } , 3000);
			}
		}
	}
	
	function manuallyPickBall(number) {
		if (sort_mode == "input_touch") {
			arbitraryPickBall(number)
		}
	}
	
	function arbitraryPickBall(number) {
		for (i = 0; i<yellow_grid_complete.length; i++) {
			if ( team_focus == "yellow" && number == yellow_grid_complete[i]) {
				pickBall(number, i);
				break;
			} else if ( team_focus == "blue" && number == blue_grid_complete[i]) {
				pickBall(number, i);
				break;
			}

			//fin de la vérification, aucune boule valide trouvée
			if ( number != yellow_grid_complete[i] && i == yellow_grid_complete.length-1) {
				errorHandler(5, false)
			}
		}
	}

	function numberAddFromKeyboard(number) {
		if (number_proposed_tab.length < 2 ) {
			number_proposed_tab.push(number);
			number_proposed = number_proposed_tab.join('');
		} else {
			deleteProposedNumberFromKeyboard()

			number_proposed_tab.push(number);
			number_proposed = number_proposed_tab.join('');
		}
		checkProposedNumberFromKeyboard();
	}

	function checkProposedNumberFromKeyboard() {
		for (i=0 ; i<25; i++) {
			if (number_proposed != yellow_grid[grid_index][i]) {
				document.getElementById("yellow_cell_" + ((i)-(i % 5))/5 + "_" + i%5).className = "cell_team_yellow"
			} else if (number_proposed == yellow_grid[grid_index][i]) {
				console.log(i);
				
				document.getElementById("yellow_cell_" + ((i)-(i % 5))/5 + "_" + i%5).className = "cell_team_yellow selected_cell"
			}
		}
		document.getElementById("keyboard_number_grid_input").value = number_proposed;
	}

	function validateProposedNumberFromKeyboard() {
		arbitraryPickBall(number_proposed);
		deleteProposedNumberFromKeyboard();
	}

	function eraseProposedNumberFromKeyboard() {
		number_proposed_tab.pop();
		number_proposed = number_proposed_tab.join('');

		checkProposedNumberFromKeyboard();
	}
	
	function deleteProposedNumberFromKeyboard() {
		number_proposed_tab = [];
		number_proposed = "";

		checkProposedNumberFromKeyboard();
	}