    function letterAddFromKeyboard(letter) {
        if (word_proposed_tab.length == 0) {
            if (letter == word_to_find_tab[0]) {
                word_proposed_tab.push(letter);
            } else {
                playsound_letter_missing.play();
                displayMessage("La première lettre doit être un "+word_to_find_tab[0]+".", "#b11f0e")
            }
        } else {
            word_proposed_tab.push(letter);
        }
        document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = word_proposed_tab[word_proposed_tab.length-1];
    }