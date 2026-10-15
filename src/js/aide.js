// Merci à la chaine `Schraf : Maths-info`
// https://www.youtube.com/watch?v=WOMYXTmE3jc

// Cherche via un expression regulière les lettres bien placées d'un mot d'une liste
// ex : list.bienPlacees("T..E...")
Array.prototype.bienPlacees = function(mot) {
    return this.filter(m => new RegExp(mot.toUpperCase()).test(m))
};

//
Array.prototype.exclure = function(lettres) {
    if (lettres == "") return this;
    return this.filter(m => !new RegExp([...lettres].join('|')).test(m))
};

Array.prototype.pasCettePosition = function(lettres, pos) {
    return [...lettres].reduce((a,l) =>
        a.filter(m => m.includes(l) && m[pos] != l),
    this)
};

Array.prototype.malPlacees = function(chaine) {
    return chaine.split(",").reduce((a, l, k) => l != "" ? a.pasCettePosition(l, k) : a,
    this)
};

//
//
//

// Page d'aide : recherche des mots possibles à partir de ce que montre la grille
const HELP_PAGE_MAX_RESULTS = 300;

async function helpPageSearch() {
    const word_length = Number(document.getElementById("help_length_select").value);
    const count_element = document.getElementById("help_result_count");
    const list_element = document.getElementById("help_result_list");
    settings.help_page_length = word_length;

    // Saisie en majuscules sans accents, réduite aux caractères utiles
    const clean = value => value.normalize('NFD').replace(/[̀-ͯ]/g, "").toUpperCase();
    const well_placed = clean(document.getElementById("help_well_placed").value).replace(/[^A-Z.]/g, "").padEnd(word_length, ".").slice(0, word_length);
    const misplaced = clean(document.getElementById("help_misplaced").value).replace(/[^A-Z,]/g, "");
    // Une lettre déjà placée (bien ou mal) n'est pas exclue, même si elle a été vue absente ailleurs
    const known_letters = (well_placed + misplaced).replace(/[^A-Z]/g, "");
    const excluded = [...new Set(clean(document.getElementById("help_excluded").value).replace(/[^A-Z]/g, ""))]
        .filter(letter => !known_letters.includes(letter)).join("");

    list_element.innerHTML = "";
    count_element.textContent = "Chargement du dictionnaire…";
    try {
        await loadDictionaryAsync(word_length, 'verification');
    } catch (error) {
        count_element.textContent = "Dictionnaire indisponible.";
        return;
    }

    let words = game.dictionnaire_verification[`length_${word_length}`].bienPlacees("^" + well_placed + "$");
    if (misplaced.replace(/,/g, "") != "") { words = words.malPlacees(misplaced); }
    words = words.exclure(excluded);

    if (words.length == 0) {
        count_element.textContent = "Aucun mot ne correspond.";
        return;
    }
    count_element.textContent = words.length > HELP_PAGE_MAX_RESULTS
        ? `${words.length} mots possibles (${HELP_PAGE_MAX_RESULTS} premiers affichés).`
        : `${words.length} mot(s) possible(s).`;
    list_element.innerHTML = words.slice(0, HELP_PAGE_MAX_RESULTS).map(word => `<li>${word}</li>`).join("");
}

// Bouton « Effacer » : vide aussi les résultats (le formulaire remet les champs à zéro de lui-même)
function helpPageReset() {
    document.getElementById("help_result_count").textContent = "";
    document.getElementById("help_result_list").innerHTML = "";
    // La longueur choisie est conservée
    setTimeout(() => { document.getElementById("help_length_select").value = settings.help_page_length; });
}
