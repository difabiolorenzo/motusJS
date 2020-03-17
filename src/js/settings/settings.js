function initVariables() {

    // SETTINGS
    other_window_display = false;

    playsound_enabled = true;
    play_jingle = false;

    //GAME
    check_word_length = true;
    check_word_presence = true;
    check_word_duplication = true;
    check_word_first_letter = true;

    try_number_max = 6;
    lettre_plus_amount = 1;
    word_found = undefined;
    word_displayed = false;
    dictionary_list = [dictionary_5, dictionary_6, dictionary_7, dictionary_8, dictionary_9, dictionary_10];

    word_to_find_list = [];

    always_ask = false;
    always_ask_lenght = 8;
            
    keyboardInput = document.getElementById("word_proposition_input");

    timer = 225;
    game_started = false;
    game_paused = false;

    animationIntervalID_1 = undefined
    animationIntervalID_2 = undefined
    animationIntervalID_3 = undefined
    animationIntervalID_4 = undefined
    animationIntervalID_5 = undefined

    //SCORE
    score_addition = 50;
    
    score_yellow = 0;
    score_blue = 0;

    //TEAM
    team_enabled = false;
    change_turn_mode = "by_error"; // Change de main à chaque erreur ("by_error" || "by_proposition")
    team_focus = "yellow"; // L'équipe jaune à la main ("yellow" || "blue")

    // DEBUG
    debug_index = 0;
    version_name = "2.2 - Pre-release 6"; document.getElementById("version").innerHTML = version_name;
    regularCharExpression  = /^[a-zA-Z\u00C0-\u00ff]+$/;
    godmod = false

    //NUMBERGRID
    number_grid_enabled = true;
    use_saving_ball = true; // Boule magique

    black_ball_amount = 3;  // Nombre de boules noires
    try_picking_ball = 2; //peux piocher X balles par tour
    try_picking_ball_left = try_picking_ball;

    sort_mode = "random"; // soit "random" ou "input"
    grid_index = -1;
    grid_j_index = 0;
    grid_i_index = 0;
    team_color_grid = [];

    motus_engaged = false;	//il n'existe qu'un seul MOTUS par grille

    yellow_grid_raw = [];
    blue_grid_raw = [];
    hided_number_spot = [];

    motus_animation_index = 0;
    picked_ball_animation = 0;
    
    yellow_purgatory = document.getElementById("yellow_purgatory");
    blue_purgatory = document.getElementById("blue_purgatory");

    yellow_saving_ball = undefined;
    blue_saving_ball = undefined;
    yellow_saving_ball_picked = false;
    blue_saving_ball_picked = false;
}