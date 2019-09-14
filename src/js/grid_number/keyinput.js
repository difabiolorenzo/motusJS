	document.addEventListener("keydown", function(event) {
		if (event.keyCode == 27) { // echap
			console.log("Touche Echap");
		} else if (event.keyCode == 49) { // &
			console.log('Touche 1');
			displayNumberAnimation = setInterval(function() {displayNumberAnimated(); playsound_grille_creation.play()}, 120);
		} else if (event.keyCode == 50) { // &
			console.log('Touche 2');
			hideNumber()
		} else if (event.keyCode == 51) { // &
			console.log('Touche 3');
			changeGrid();
		} else if (event.keyCode == 52) { // &
			console.log('Touche 4');
		} else if (event.keyCode == 53) { // &
			console.log('Touche 5');
		} else if (event.keyCode == 54) { // &
			console.log('Touche 6');
		} else if (event.keyCode == 55) { // &
			console.log('Touche 7');
		} else if (event.keyCode == 56) { // &
			console.log('Touche 8');
		} else if (event.keyCode == 57) { // &
			console.log('Touche 9');
		} else if (event.keyCode == 58) { // &
			console.log('Touche 0');
		}
	}
)