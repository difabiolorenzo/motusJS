function initVariables() {
// displayPage('settings_page');

// SETTINGS
playsound_enabled = true;
play_jingle = false;

displayed_page = "main_menu";
displayed_settings_section = "visual" //"visual" "number_grid" "team_scores" "gameplay" "sounds" "words"
settings_group_displayed = false; //dropdown

//GAME
gamemode = "normal"; // "normal" "one_word" "finale"
check_word_length = true;
check_word_presence = true;
check_word_duplication = true;
check_word_first_letter = true;
letter_grid_created = false;

try_number_max = 6;
try_count_index = -1;
lettre_plus_amount = 1;
word_found = undefined;
word_displayed = false;

word_to_find_list = [];

always_ask = true;
always_ask_length = 8;
        
keyboardInput = document.getElementById("word_proposition_input");

timer = 1;
game_started = false;
game_paused = false;

animationIntervalID_1 = undefined;
animationIntervalID_2 = undefined;
animationIntervalID_3 = undefined;
animationIntervalID_4 = undefined;
animationIntervalID_5 = undefined;

automatic_behaviour = true
automatic_behaviour_line_start = true;
automatic_behaviour_new_line_error = "replace_bonus"; //"replace_bonus" "replace_only" "add_bonus" "add_only" "none"
automatic_behaviour_redirect_number_grid = true;
automatic_behaviour_redirect_letter_grid = false;
automatic_behaviour_ask_new_word = true;

automatic_behaviour_load_new_word_finale = true;

//GAMEMODE FINALE
word_found_count = 0;

//SCORE
score_addition = 50;

score_yellow = 0;
score_blue = 0;

//TEAM
team_enabled = false;
change_turn_mode = "by_error"; // ("by_error" || "by_proposition")
team_focus = "yellow"; // ("yellow" || "blue")

// DEBUG
debug_index = 0;
var version_name = "2.3 Pre-release 2"; 
document.getElementById("version").innerHTML = version_name;
regularCharExpression = /^[a-zA-Z\u00C0-\u00ff]+$/;
godmod = false

//NUMBERGRID
use_number_grid = true;
use_saving_ball = true; // Boule magique
limiting_saving_ball = true // limiting magic ball for first grid

black_ball_amount = 3;
try_picking_ball = 2;
try_picking_ball_left = try_picking_ball;

sort_mode = "random"; // ("random" || "input_keyboard" || "input_touch")
grid_index = -1;
team_color_grid = [];

motus_engaged = false; // MOTUS done or not, there is no more than 1 motus

yellow_grid_raw = [];
blue_grid_raw = [];
hided_number_spot = [];

motus_animation_index = 0;
picked_ball_animation = 0;

number_proposed_tab = [];
number_proposed = undefined;

yellow_purgatory = document.getElementById("yellow_purgatory");
blue_purgatory = document.getElementById("blue_purgatory");

yellow_saving_ball = undefined;
blue_saving_ball = undefined;
yellow_saving_ball_picked = false;
blue_saving_ball_picked = false;


// autoplay() //dev
}

function autoplay() {
    always_ask = true;
    gamemode = "finale"; // "normal" "one_word" "finale"
    initGame();
}


// function called by "Jouer" buttons
function initGame() {
    if (game_started == true) { //return to game_paused false state
        returnGame();
    } else { //create game
        if (word_to_find_list.length > 0) { //word inside word list
            createGame();
            displayPage("letter_grid_page");
        } else { //create word
            if (always_ask == false) {
                WordListAddRowRandom(always_ask_length);
                createGame();
                displayPage("letter_grid_page");
            } else { //ask word lenght
                var prompt_new_word = Number(window.prompt("Aucun mot n'est prédéfini dans les paramètres, veuillez entrer le nombre de lettres (compris entre 5 et 10) du prochain mot tiré au hasard:", "8"));
                if (prompt_new_word >= 5 && prompt_new_word <= 10 ) {
                    WordListAddRowRandom(prompt_new_word);
                    createGame();
                    displayPage("letter_grid_page");
                }
            }
        }
    }
}

function createGame() {
    game_started = true;
    game_paused = false;

    initLetterGrid();
    wordInitialization();
    lockNumberGridSettings();
    lockNumberGridSettings();

    if (automatic_behaviour == true && automatic_behaviour_line_start == true && (gamemode == "normal" || gamemode == "finale")) { newWordLine(); }
    if (use_number_grid == true) { changeNumberGrid(); } 
    if (play_jingle == true) { playsound("jingle"); }
    if (use_number_grid == false) { editHTML("settings_section_number_grid", "style", "disaply:none"); }
    if (gamemode == "one_word") { displaySimilarWord(); }
    if (gamemode == "finale") { setFinalGamemode(); }
}   