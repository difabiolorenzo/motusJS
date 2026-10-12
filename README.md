# motusJS

Le fameux jeu Motus de FranceTélévision en JavaScript

Ce projet est à but pédagogique. Tout les droits sont résérvés à FranceTV.

Ce projet n'a pas de développement très très actif. Vous pouvez voir les très bons autres sites :
- [WebGMotus](https://gregfresnel.pages-perso.free.fr/WebMotus/WebGMotus.php)
- [SUTOM](https://sutom.nocle.fr/)
- [motus.absolu-puzzle.com](https://motus.absolu-puzzle.com/)
- [tusmo.xyz](https://www.tusmo.xyz)

## Lancement

* Il est possible de jouer directement sur votre navigateur via ce site: https://difabiolorenzo.github.io/motusJS/

## Règles

Le jeu repose sur la recherche de mots d'un nombre fixé de lettres.
Un candidat propose un mot et doit épeler celui-ci. Le mot doit contenir le bon nombre de lettres et être correctement orthographié, sinon il est refusé. Le mot apparaît alors sur une grille :
- les lettres présentes et bien placées sont sur fond rouge
- les lettres présentes mais mal placées sont cerclées de jaune.
- les lettres absentes du mot coloriées sont sur fond bleu.

Pour les règles complètes, voir [la page wikipedia de Motus](https://fr.wikipedia.org/wiki/Motus\_%28jeu\_t%C3%A9l%C3%A9vis%C3%A9%29#R%C3%A8gles\_du\_jeu)

## Fonctionnement

### Raccourcis clavier

* Validation du mot avec la touche **Entrer**
* Suppression de la lettre avec la touche **Effacer** (**←**)

* Nouvelle ligne avec la touche **\&** / **1**
* Lettre bonus avec la touche **é** / **2**
* Suppression de la ligne avec la touche **"** / **3**
* Remplacement de la ligne avec la touche **'** / **4**
* Changement d'équipe ayant la main **(** / **5**
* Changement de grille **-** / **6**
* Nouveau mot avec la touche **ç** ou **9**
* Affichage du mot avec la touche **à** ou **0**
* Son du temps écoulé avec la touche **$** (**¤**)
* Panneau animateur avec la touche **è** / **7**
* Annuler la dernière action (lettre bonus, ligne) avec **Ctrl** + **Z**
* Retour au menu / reprise de la partie avec la touche **Échap**

Avec l'option « Confirmer chaque mot avant vérification », **Entrer** met le mot en attente : **\&** / **1** confirme, **Effacer** annule.

### Partie

* Le menu choisit le nombre de lettres des mots (5 à 10) sous « Jouer ».
* « Historique » liste les mots joués (trouvés, non trouvés, passés), les MOTUS et les points, avec un export CSV.
* Barème réglable dans Paramètres > Équipes et Scores : points par mot trouvé et par MOTUS.
* Chronomètre expérimental (Paramètres > Expérimental) : compte à rebours par proposition, avec durée et comportement à zéro réglables.
* Le jeu fonctionne hors ligne après une première visite en ligne.

### Vue animateur

La touche **7** (ou le bouton « Animateur ») ouvre un panneau réservé à l'animateur : mot à trouver, lignes utilisées, mots proposés, prochains mots, scores, boules restantes et boule magique, boutons pour chaque commande et annulation des dernières actions. Sur la grille de numéros, le panneau affiche une copie cliquable de la grille de l'équipe qui a la main : un clic tire la boule choisie (boule magique repérée), avec des boutons « Boule noire » et « Au hasard ». « Déverrouiller la pioche » permet de tirer même sans mot trouvé, ou de redonner des tirages. Le panneau est fermé à chaque nouvelle partie.

Depuis ce panneau, « Ouvrir la fenêtre publique » affiche la grille seule dans une seconde fenêtre (projecteur, second écran), synchronisée en direct, sans jamais montrer le mot avant qu'il soit révélé. Les sons y sont joués (réglable dans Paramètres > Sons). Fonctionne aussi en ouvrant `index.html` sans serveur.

### Aide

La page « Aide » du menu liste les mots possibles à partir de ce que montre la grille (lettres bien placées, mal placées, absentes) et rappelle les raccourcis clavier.

### Rejouer une émission

Option expérimentale, à activer dans Paramètres > Expérimental. Le bouton « Rejouer une émission » du menu lance une partie avec les mots réels d'une émission (dans l'ordre), puis continue avec des mots au hasard.

### Tests

`node tests/run.js` vérifie les dictionnaires, la coloration des lettres et la détection du MOTUS (Node seul, sans installation).

## Crédits et Inspiration

* https://www.france.tv/france-2/motus/
* http://www.anagrammeur.com/jeux/motus/motus.php
* Tous les sons et le principe du jeu sont sous les droits de France Télévisions
* Sur les bases du code de **Sogroo** avec son site http://www.anagrammeur.com/jeux/motus/motus.php
* Les dictionnaires de mots sont tirés du Motus de **Sogroo** et de l'ODS4 présent dans **XScrabble** ftp://ftp.ac-grenoble.fr/ge/educational\_games
* Icones sur https://www.flaticon.com/uicons
* Méthodes de tris par [@Schraf](https://www.youtube.com/@Schraf) : [youtube.com](https://www.youtube.com/watch?v=WOMYXTmE3jc)

