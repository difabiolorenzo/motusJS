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
        a.filter(m => m.includes(l) && m[pos] != 1),
    this)
};

Array.prototype.malPlacees = function(chaine) {
    return chaine.split(",").reduce((a, l, k) => l != "" ? a.pasCettePosition(l, k) : a,
    this)
};

//
//
//

function helpPageSelectWordLength(word_length) {
    console.log(word_length)
    settings.help_page_length = word_length;
    const grid_element = document.getElementById("help_grid_placeholder");

    grid_element.innerHTML = "";
    for (let i=0; i < word_length; i++) {
        grid_element.innerHTML += `<div class="cellNEW"></div>`
    }
}

function helpPageVerification() {
    loadDictionaryAsync(settings.help_page_length, 'verification');
}

