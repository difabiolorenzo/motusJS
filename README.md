# motusJS
Le fameux jeu Motus de FranceTélévision en JavaScript

## Installation

- Il est possible de jouer directement depuis votre navigateur via ce site: [https://difabiolorenzo.github.io/motusJS/]
- Pour jouer en local, télécharger le répertoire, puis lancer le fichier **index.html** dans un navigateur.

## Règles

Pour les règles complètes, voir ce lien: [https://fr.wikipedia.org/wiki/Motus_%28jeu_t%C3%A9l%C3%A9vis%C3%A9%29#R%C3%A8gles_du_jeu]

- Les lettres en rouge sont correctement placées.
- Les lettres dans un cercle jaune sont présentes dans le mot mais pas à leurs bonnes places.
- Les autres lettres ne sont pas présentes dans le mot à trouver.

Si le mot est trouvé, l'équipe rapporte 50 points, cette équipe a ensuite le droit de piocher deux boules:

- Le système de grilles numérotées fonctionne comme un loto
- Pour faire "MOTUS" et gagner 100 points, chaques joueurs doivent tirer une boule et réaliser une ligne horizontale, verticale ou diagonale de 5 cases.
- La main passe si une boule noire est attrapée (elles sont aux nombre de 3 par grille)

## Fonctionnement

### Raccourcis clavier
- Validation du mot avec la touche **Entrer**
- Suppression de la lettre avec la touche **erase** (**←**) ou **flèche gauche**

- Nouvelle ligne avec la touche **&** ou **1**
- Lettre bonus avec la touche **é** ou **2**
- Suppression de la ligne avec la touche **"** ou **3**
- Remplacement de la ligne avec la touche **'** ou **4**
- Changement d'équipe ayant la main **(** ou **5**

- Nouveau mot avec la touche **ç** ou **9**
- Affichage du mot avec la touche **à** ou **0**

- Son du temps écoulé avec la touche **$** (**¤**)

## Crédits et Inspiration
- [https://www.france.tv/france-2/motus/]
- [http://www.anagrammeur.com/jeux/motus/motus.php]
- Tous les sons et le principe du jeu sont sous les droits de France Télévisions
- Sur les base du code de **Sogroo** avec son site [http://www.anagrammeur.com/jeux/motus/motus.php]
- Les dictionnaires de mots sont tirés du Motus de **Sogroo** et de l'ODS4 présent dans **XScrabble** [ftp://ftp.ac-grenoble.fr/ge/educational_games]
- jQuery sous la license MIT [https://tldrlegal.com/license/mit-license]
