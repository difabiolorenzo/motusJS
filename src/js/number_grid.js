function initNumberGrid() {
	if (settings.number_grid_enabled === false) {
		console.log("Grille numérotée non utilisée")
		return;
	}

	defaultNumberGridVariables()
	createNumberGridsHTML();

	// Remplissage des grilles, animé seulement si elles sont affichées dès le début
	const creation_animation = settings.number_grid_creation_animation === true && settings.start_by_number_grid === true;
	fillNumberGrid("yellow", creation_animation);
	fillNumberGrid("blue", creation_animation);

	markNumberGridsCreated();

	if (settings.start_by_number_grid === true) {
		displayNumberGrid();
	} else {
		initLetterGrid();
	}
}

function createNumberGridsHTML() {
	document.getElementById("number_grid_yellow_placeholder").innerHTML = createHTMLGrid(5, 5, "number_yellow", "number_grid_yellow", false);
	document.getElementById("number_grid_blue_placeholder").innerHTML = createHTMLGrid(5, 5, "number_blue", "number_grid_blue", false);
}

function markNumberGridsCreated() {
	game.state.number_grid_complete = true;
	game.state.number_grid_yellow_created = true;
	game.state.number_grid_blue_created = true;
}

// Reprise d'une partie sauvegardée (save.js) : état des grilles remis, grilles et purgatoires redessinés sans animation
function restoreNumberGrids(saved) {
	game.number_grid_index = saved.index;
	game.number_grid_possible = saved.possible;
	game.number_grid_purgatory = saved.purgatory;
	game.number_grid_dynamic_mask = saved.dynamic_mask;
	game.number_grid_saving_ball = saved.saving_ball;
	game.number_grid_saving_ball_state = saved.saving_ball_state;
	game.motus_aligned = saved.motus_aligned === true;

	createNumberGridsHTML();
	["yellow", "blue"].forEach(team => {
		renderNumberGrid(team);
		document.getElementById(`number_grid_purgatory_${team}`).innerHTML = "";
		(game.number_grid_purgatory[team] || []).forEach(number => addNumberPurgatory(number, team));
	});
	markNumberGridsCreated();
	if (game.motus_aligned === true) { displayNumberGridUserAction("change_grid_button", true); }
}

// Grille d'une équipe d'après son masque dynamique : case remplie (au départ ou boule tirée) ou numéro à tirer
function renderNumberGrid(team) {
	const grid = game.number_grid_data[team][game.number_grid_index+1];
	const mask = game.number_grid_dynamic_mask[team];
	const saving_ball = game.number_grid_saving_ball ? game.number_grid_saving_ball[team] : undefined;
	const saving_visible = isSavingBallAllowed() && saving_ball !== undefined
		&& game.number_grid_saving_ball_state[team] === "available";

	for (let i = 0; i < grid.length; i++) {
		const y = (i - (i % 5)) / 5;
		const x = i % 5;
		const cell = document.getElementById(`number_${team}_${y}_${x}`);
		if (mask[i] === 0) {
			cell.innerHTML = `<div class="numberNEW hided_number"></div>`;
		} else {
			const saving_class = saving_visible && grid[i] === saving_ball ? " saving_ball" : "";
			cell.innerHTML = `<div class="numberNEW${saving_class}">${grid[i]}</div>`;
			if (settings.ball_picking_mode === "direct_click") {
				const number = grid[i];
				cell.onclick = function() { pickBall(number); };
			}
		}
	}
}

function defaultNumberGridVariables() {
	// Boules possibles
	const grid_index = game.number_grid_index+1; 

	const data_mask = game.number_grid_data.mask[grid_index];
	const data_yellow = game.number_grid_data.yellow[grid_index];
	const data_blue = game.number_grid_data.blue[grid_index];

	const numbers_yellow = [];
	const numbers_blue = [];

	game.number_grid_dynamic_mask = {
		yellow: [],
		blue: []
	};

	for (let i = 0; i < data_mask.length; i++) {
		// Tri des boules possibles
		if (data_mask[i] === 1) {
			numbers_yellow.push(data_yellow[i]);
			numbers_blue.push(data_blue[i]);
		}

		// Etat de la grille pour motus possible
		game.number_grid_dynamic_mask.yellow.push(data_mask[i])
		game.number_grid_dynamic_mask.blue.push(data_mask[i])
	}
	
	// Boule magique
	let random_yellow_saving_ball;
	let random_blue_saving_ball;
	let random_yellow_saving_ball_state = "unavailable";
	let random_blue_saving_ball_state = "unavailable";
	if (isSavingBallAllowed()) {
		random_yellow_saving_ball = numbers_yellow[Math.floor(Math.random() * numbers_yellow.length)];
		random_blue_saving_ball = numbers_blue[Math.floor(Math.random() * numbers_blue.length)];
		
		random_yellow_saving_ball_state = "available";
		random_blue_saving_ball_state = "available";
	}
	
	game.number_grid_saving_ball = {
		yellow: random_yellow_saving_ball,
		blue: random_blue_saving_ball
	};

	game.number_grid_saving_ball_state = {
		yellow: random_yellow_saving_ball_state,
		blue: random_blue_saving_ball_state
	};

	// Enregistrement des grilles possibles
	game.number_grid_possible = {
		yellow: numbers_yellow,
		blue: numbers_blue
	};

	// Définition des grilles purgatoires (boules tirées)
	game.number_grid_purgatory = {
		yellow: [],
		blue: []
	};

	// Boules noires
	for (let i = 0; i < settings.black_ball_amount; i++) {
		numbers_yellow.push("⚫");
		numbers_blue.push("⚫");
	}
}

function resetNumberGrids() {
	defaultNumberGridVariables()

	// Grilles jamais créées (partie sans grille de numéros) : rien à vider
	if (document.getElementById("number_yellow_0_0") == null) { return; }

	for (let j=0; j<5; j++) {
		for (let i=0; i<5; i++) {
			document.getElementById(`number_yellow_${j}_${i}`).innerHTML = "";
			if (settings.team_enabled === true) {
				document.getElementById(`number_blue_${j}_${i}`).innerHTML = "";
			}
		}
	}
}

function changeNumberGrid() {
	if (game.motus_aligned === false) {
		console.log("La grille n'a pas besoin d'être changée")
		return;
	}

	displayNumberGridUserAction("change_grid_button", false)

	if (game.motus_aligned === true) {
		// Change l'index de la grille
		// Boucle entre les 6 grilles
		if (game.number_grid_index < 5) {
			game.number_grid_index++;
		} else {
			game.number_grid_index = 0;
		}
		game.motus_aligned = false;
	}

	resetNumberGrids();
	resetPurgatory();

	fillNumberGrid("yellow", true);
	if (settings.team_enabled === true) {
		fillNumberGrid("blue", true);
	}
	updateVasque();
}

function fillNumberGrid(team, animation = false) {
	const data = game.number_grid_data[team][game.number_grid_index+1];

	for (let j=0; j<5; j++) {
		for (let i=0; i<5; i++) {
			const animation_delay = 120;
			const animation_creation_delay_addition = 100;
			const num = data[j*5+i];
			const html_el = `<div class="numberNEW created">${num}</div>`;

			if (animation) {
				setTimeout(function() {
					playsound("grille_creation");
					document.getElementById(`number_${team}_${j}_${i}`).innerHTML = `<div class="numberNEW created">${num}</div>`;
				}, (j*5+i) * animation_delay);
				
				setTimeout(function() {
					document.getElementById(`number_${team}_${j}_${i}`).children[0].classList.remove("created");
				}, ((j*5+i) * animation_delay) + animation_creation_delay_addition);
			} else {
				document.getElementById(`number_${team}_${j}_${i}`).innerHTML = `<div class="numberNEW">${num}</div>`;
			}
		}
	}

	const mask_animation_delay = animation ? 5 * 5 * 120 + 500 : 0;

		setTimeout(function() {
			fillNumberGridMask(team, animation)
		}, mask_animation_delay);

	function fillNumberGridMask(team, animation = false) {
		const mask_data = game.number_grid_data.mask[game.number_grid_index+1]
		const grid_data = game.number_grid_data[team][game.number_grid_index+1]
		const zero_indexes = [];
		const ones_indexes = [];

		// Coordonées des différents 0 (masques)
		for (let i = 0; i < mask_data.length; i++) {
			if (mask_data[i] === 0) {
				const x = (i % 5);
				const y = (i - (i % 5)) / 5;

				zero_indexes.push({y: y, x: x});
			}
			if (mask_data[i] === 1) {
				const x = (i % 5);
				const y = (i - (i % 5)) / 5;

				ones_indexes.push({y: y,x: x, number: grid_data[i]});
			}
		}

		for (let i = 0; i < zero_indexes.length; i++) {
			const animation_delay = 300;
			const animation_creation_delay_addition = 100;
			const x = zero_indexes[i].x;
			const y = zero_indexes[i].y;

			if (animation) {
				setTimeout(function() {
					playsound("grille_numero");
					document.getElementById(`number_${team}_${y}_${x}`).innerHTML = `<div class="numberNEW mask_created hided_number"></div>`;
					
					// Affichage de la boule magique à la fin de l'animation
					if (i === zero_indexes.length-1) { displaySavingBall(); }
				}, i * animation_delay);

				// Suppression CSS de creation
				setTimeout(function() {
					document.getElementById(`number_${team}_${y}_${x}`).children[0].classList.remove("mask_created");
				}, i * animation_delay + animation_creation_delay_addition);
			} else {
				document.getElementById(`number_${team}_${y}_${x}`).innerHTML = `<div class="numberNEW hided_number"></div>`;
				if (i === zero_indexes.length-1) { displaySavingBall(); }
			}
		}

		function displaySavingBall() {
			if (!isSavingBallAllowed() || game.number_grid_saving_ball[team] === undefined) {
				return;
			}
			
			const current_grid = game.number_grid_data[team][game.number_grid_index+1]

			// Boule Magique
			const pos_id = current_grid.indexOf(game.number_grid_saving_ball[team]);

			const pos_x = (pos_id % 5);
			const pos_y = (pos_id - (pos_id % 5)) / 5;

			document.getElementById(`number_${team}_${pos_y}_${pos_x}`).children[0].classList.add("saving_ball")
		}

		// Bouton onclick pour mode de tirage par clique
		// Calcul des boule possible
		// Coordonées des différents 0 (masques)
		if (settings.ball_picking_mode === "direct_click") {
			for (let i = 0; i < ones_indexes.length; i++) {
				const x = ones_indexes[i].x;
				const y = ones_indexes[i].y;
				const number = ones_indexes[i].number;
				
				document.getElementById(`number_${team}_${y}_${x}`).onclick = function() { pickBall(number); }
			}
		}
	}
}

function updateNumberLeftIndicator() {
	document.getElementById("number_grid_random_selection_left_indicator").innerHTML = `${game.number_grid_try_left} restant(s)`;
	document.getElementById("vasque_left_indicator").innerHTML = `${game.number_grid_try_left} restant(s)`;
}

// RÈGLE DE TIRAGE (commune à tous les modes : bouton « Piocher », liste, panneau animateur, vasque)
// Phase de tirage ouverte : mot trouvé (ou pioche déverrouillée depuis le panneau animateur), pas de MOTUS aligné
function isBallPickingOpen() {
	return (game.word_found === true || game.number_grid_unlocked === true) && game.motus_aligned !== true;
}

// Une boule peut être tirée maintenant : grille de numéros affichée, phase ouverte, tirages restants
function canPickBall() {
	return game.started === true && game.focus_on === "number" && isBallPickingOpen() && game.number_grid_try_left > 0;
}

function randomPickBall() {
	if (game.number_grid_try_left === 0) {
		playsound("error");
		showGameMessage("Plus de boule à tirer.");
		announce("Plus de boule à tirer.");
		return false;
	}
	if (!canPickBall()) { return false; }

	const team = game.team_focus;

	let random_ball;
	if (game.motus_aligned === false && game.focus_on === "number") {
		const possible_grid = game.number_grid_possible[team]
		random_ball = possible_grid[Math.floor(Math.random() * possible_grid.length)]
	}

	return pickBall(random_ball);
}

function setManuelHTMLSelectInputBallPicking(team) {
	// Copie du tableau des boules possibles pour éviter de le modifier
	const possible_grid = [...game.number_grid_possible[team]];

	// Séparer nombres et boules noires
	const numbers = possible_grid.filter(filter_numbers_only => filter_numbers_only !== "⚫");
	const blacks = possible_grid.filter(filter_black_ball_only => filter_black_ball_only === "⚫");

	// Tri numérique
	numbers.sort((a, b) => a - b);

	let element = "";
	for (const ball of numbers) {
		element += `<option value="${ball}">${ball}</option>`;
	}

	if (blacks.length > 0) {
		element += `<option value="⚫">Boule Noire !</option>`;
	}

	document.getElementById("select_pick_ball").innerHTML = element;
}

function debug_pickball() {
	const value = document.getElementById("select_pick_ball").value
	if (value === "⚫") {
		pickBall(value);
	} else {
		pickBall(parseInt(value));
	}
}

// Tire une boule ; renvoie true si elle a été tirée (la vasque ne la retire qu'à cette condition)
function pickBall(forced_number) {
	if (game.focus_on !== "number" ||
		game.number_grid_try_left === 0 ||
		game.motus_aligned === true ) {
		return false;
	}

	// Équipe qui tire : fixée avant la boule noire, qui peut passer la main à l'autre équipe
	const team = game.team_focus

	if (game.number_grid_possible[team].indexOf(forced_number) === -1) {
		console.log("La boule choisie n'est pas disponible dans cette grille");
		showGameMessage("Cette boule n'est pas dans la grille.");
		announce("Cette boule n'est pas dans la grille.");
		return false;
	}

	const saving_ball = game.number_grid_saving_ball[team]
	const saving_ball_state = game.number_grid_saving_ball_state[team]

	// Boule noire
	if (forced_number === "⚫") {
		console.log('%cBoule Noire', 'background: black; color: gold');
		announce("Boule noire !");

		// Si boule magique
		if (saving_ball_state === "stored") {
			game.number_grid_saving_ball_state[team] = "used";
			setTimeout(function() { playsound("boule_magique"); }, 1750);
		} else {
			switchTeamFocus()
		}

		playsound('grille_boule_noire');

		game.number_grid_try_left = 0
		updateNumberLeftIndicator()
		
		// Afficher le bouton de retour à la grille de mot
		displayNumberGridUserAction("return_letter_grid", true)
	} else {
		// Boules normales
		playsound('grille_numero_tire');
		
		// Boule Magique
		if (isSavingBallAllowed()) {
			if (forced_number === saving_ball) {
				game.number_grid_saving_ball_state[team] = "stored"
				playsound("boule_magique");
				console.log('%c' + `Boule magique : ${forced_number}`, 'background: black; color: cyan');
			}
		}

		console.log('%c' + forced_number, 'background: black; color: gold');
		announce(`Boule ${forced_number}.`);

		// Animation
		const pos_index = game.number_grid_data[team][game.number_grid_index+1].indexOf(forced_number);
		const grid_pos_y_x_element = document.getElementById(`number_${team}_` + ((pos_index - (pos_index % 5)) / 5) + "_" + (pos_index % 5));
		const grid_number_element = grid_pos_y_x_element.children[0];

		// Clignotement, remplacé par l'état final si les animations sont réduites
		const blink_count = prefersReducedMotion() ? 0 : 13;
		if (blink_count === 0) {
			grid_number_element.innerHTML = "";
			grid_number_element.className = "numberNEW hided_number";
		}
		for (let i=0; i<blink_count; i++) {
			if ((i % 2) === 1) {
				setTimeout(function() {
					grid_number_element.innerHTML = forced_number;
					grid_number_element.className = "numberNEW";
				}, i * 100);
			} else {
				setTimeout(function() {	
					grid_number_element.innerHTML = "";
					grid_number_element.className = "numberNEW hided_number";
				}, i * 100);
			}
		}

		// Modification du masque dynamique pour motus
		game.number_grid_dynamic_mask[team][pos_index] = 0;

		// Check MOTUS
		checkMotus();
	}

	// Purgatoire et retrait de la liste : équipe qui a tiré (après une boule noire, game.team_focus est déjà l'autre équipe)
	game.number_grid_purgatory[team].push(forced_number);
	addNumberPurgatory(forced_number, team);

	// Suppression de la liste & reduction du nombre d'essai
	const forced_number_possible_grid_index = game.number_grid_possible[team].indexOf(forced_number)
	game.number_grid_possible[team].splice(forced_number_possible_grid_index,1)

	// si boule noire alors mis à 0
	if (game.number_grid_try_left > 0) {
		game.number_grid_try_left--;
		updateNumberLeftIndicator()

		if (game.number_grid_try_left === 0) {
			// Afficher le bouton de retour à la grille de mot
			displayNumberGridUserAction("return_letter_grid", true)
		}
	}

	// Mise à jour du mode de selection par liste
	if (settings.ball_picking_mode === "input_select") {
        setManuelHTMLSelectInputBallPicking(game.team_focus)
	}

	// Vasque : la boule tirée la quitte (et l'autre équipe s'affiche après une boule noire)
	updateVasque();
	return true;
}

// VASQUE (mode de tirage « vasque ») : affichage, contenu et clics alignés sur le jeu.
// Appelée après chaque tirage, changement d'équipe, de grille ou d'affichage. Renvoie true si la vasque est affichée.
function updateVasque() {
	if (typeof IS_PUBLIC_VIEW !== "undefined" && IS_PUBLIC_VIEW) { return false; }	// fenêtre publique : vasque recopiée (animator.js)
	const section = document.getElementById("number_grid_vasque_section");
	const shown = settings.number_grid_enabled === true && settings.ball_picking_mode === "vasque"
		&& game.started === true && game.focus_on === "number" && isBallPickingOpen();
	if (!shown || typeof Vasque === "undefined" || !Vasque.init(document.getElementById("vasque_container"), onVasqueBallChosen)) {
		section.classList.add("d-none");
		if (typeof Vasque !== "undefined" && Vasque.isReady()) { Vasque.pause(); }
		if (typeof sendVasqueToPublic === "function") { sendVasqueToPublic(); }
		return false;
	}

	section.classList.remove("d-none");
	const click_mode = settings.vasque_gesture !== "random";
	Vasque.setInteractive(click_mode && canPickBall());
	const draw_button = document.getElementById("vasque_draw_button");
	draw_button.classList.toggle("d-none", click_mode);
	draw_button.disabled = !canPickBall();
	updateNumberLeftIndicator();
	Vasque.resume();
	Vasque.sync(game.number_grid_possible[game.team_focus] || [], game.team_focus);
	if (typeof sendVasqueToPublic === "function") { sendVasqueToPublic(); }
	return true;
}

// Clic sur une boule de la vasque : le jeu décide (pickBall), la vasque suit
function onVasqueBallChosen(value) {
	if (!canPickBall()) {
		showGameMessage("Tirage impossible pour l'instant.");
		return;
	}
	pickBall(value);
}

// Bouton « Tirer » (ou touche 8) : boule au hasard parmi celles de la vasque
function drawRandomFromVasque() {
	if (!canPickBall()) {
		showGameMessage("Tirage impossible pour l'instant.");
		return;
	}
	randomPickBall();
}

// Cherche une ligne complète (5 cases à 0) dans un masque 5x5 ; renvoie {position, offset} ou null
function findMotusLine(dynamic_mask) {
	// Calcul de la somme des placements
	const slash_sum = dynamic_mask[0] + dynamic_mask[6] + dynamic_mask[12] + dynamic_mask[18] + dynamic_mask[24];
	const backslash_sum = dynamic_mask[20] + dynamic_mask[16] + dynamic_mask[12] + dynamic_mask[8] + dynamic_mask[4];

	if (slash_sum === 0) { return { position: "slash", offset: undefined }; }
	if (backslash_sum === 0) { return { position: "backslash", offset: undefined }; }

	for (let i = 0; i < 5; i++) {
		const horizontal_sum = dynamic_mask[i*5] + dynamic_mask[(i*5)+1] + dynamic_mask[(i*5)+2] + dynamic_mask[(i*5)+3] + dynamic_mask[(i*5)+4];
		const vertical_sum = dynamic_mask[i] + dynamic_mask[i+5] + dynamic_mask[i+(5*2)] + dynamic_mask[i+(5*3)] + dynamic_mask[i+(5*4)];

		if (horizontal_sum === 0) { return { position: "horizontal", offset: i }; }
		if (vertical_sum === 0) { return { position: "vertical", offset: i }; }
	}

	return null;
}

// Boule magique en jeu sur la grille actuelle : activée, et soit non limitée, soit sur la première grille
function isSavingBallAllowed() {
	return settings.use_saving_ball === true && (settings.limiting_saving_ball === false || game.number_grid_index === 0);
}

function checkMotus() {
	const dynamic_mask = game.number_grid_dynamic_mask[game.team_focus]

	const motus_line = findMotusLine(dynamic_mask);
	if (motus_line != null) {
		animation(motus_line.position, motus_line.offset);
		return;
	}

	// Animation par position
	function animation(position_name, offset) {
		const display_word = "MOTUS";
		const animation_delay = 3000;
		const animation_placement_coord = [];
		game.motus_aligned = true

		playsound('motus');
		announce("MOTUS !");
		recordMotus();

		// Points du MOTUS (barème réglable)
		addTeamScore(undefined, settings.score_motus);
		game.number_grid_try_left = 0;

		switch (position_name) {
			case "slash" :
				// de haut en bas
				for (let i = 0; i < 5; i++) {
					animation_placement_coord.push({x:i, y:i})
				}
				break;
			case "backslash" :
				// de bas en haut
				for (let i = 0; i < 5; i++) {
					animation_placement_coord.push({x:i, y:4-i})
				}
				break;
			case "horizontal" :
				for (let i = 0; i < 5; i++) {
					animation_placement_coord.push({x:i, y:offset})
				}
				break;
			case "vertical" :
				for (let i = 0; i < 5; i++) {
					animation_placement_coord.push({x:offset, y:i})
				}
				break;
		}

		for (let i = 0; i < 5; i++) {
			const x = animation_placement_coord[i].x;
			const y = animation_placement_coord[i].y;
			const element_id = `number_${game.team_focus}_${y}_${x}`;
			setTimeout(function() {
				document.getElementById(element_id).children[0].className = "numberNEW motus";
				document.getElementById(element_id).children[0].innerHTML = display_word[i];
			}, i * 100 + animation_delay);
		}
		
		// Bouton changer de grille et retour vers mot
		setTimeout(function() {
			displayNumberGridUserAction("change_grid_button", true)
			displayNumberGridUserAction("return_letter_grid", true)
		}, 500 + animation_delay);
    }

	}

function displayNumberGridUserAction(element_custom_name, display_bool) {
    const element_ids = {
        return_letter_grid: "number_grid_return_to_letter_grid",
        change_grid_button: "number_grid_change_grid_button",
        random_selection_mode_section: "number_grid_random_selection_mode_section",
        random_selection_button: "number_grid_random_selection_button",
        black_selection_button: "number_grid_black_selection_button",
        pick_left_indicator: "number_grid_random_selection_left_indicator"
    };
    document.getElementById(element_ids[element_custom_name] || "").classList.toggle("d-none", !display_bool);
}

function resetPurgatory() {
	const yellow_purgatory = document.getElementById("number_grid_purgatory_yellow");
	const blue_purgatory = document.getElementById("number_grid_purgatory_blue");

	yellow_purgatory.innerHTML = "";
	blue_purgatory.innerHTML = "";

	game.number_grid_purgatory.yellow = [];
	game.number_grid_purgatory.blue = [];
}

function addNumberPurgatory(number, team = game.team_focus) {
	let black_ball_class_name = "";

	if (number === "⚫") {
		black_ball_class_name = "black";
		number = "";
	}

	document.getElementById(`number_grid_purgatory_${team}`).innerHTML += `<span class='purgatory_number ${team} ${black_ball_class_name}'>${number}</span>`;
}
