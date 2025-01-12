
const gameboard = document.querySelector('#gameboard');
const ctx = gameboard.getContext('2d');
const score_text = document.querySelector('#score');
const reset = document.querySelector('#reset_btn');
const game_width = gameboard.width;
const game_height = gameboard.height;
const board_bg = 'white';
const snake_color = 'lightgreen';
const snake_border = 'black';
const food_color = 'red';
const unit_size = 25;

//apple
const apple_img = new Image();
apple_img.src = 'img/apple_sus.png'; 

let game_running = false;
let x_velocity = unit_size;
let y_velocity = 0;
let food_x;
let food_y;
let score = 0;
let time_out_id;

let snake = [
    {x:unit_size * 4, y:0},
    {x:unit_size * 3, y:0},
    {x:unit_size * 2, y:0},
    {x:unit_size, y:0},
    {x:0, y:0}
];
window.addEventListener('keydown', change_direction);
reset.addEventListener('click', reset_game);
document.querySelector('#up_btn').addEventListener('click', () => change_direction_by_button('up'));
document.querySelector('#down_btn').addEventListener('click', () => change_direction_by_button('down'));
document.querySelector('#left_btn').addEventListener('click', () => change_direction_by_button('left'));
document.querySelector('#right_btn').addEventListener('click', () => change_direction_by_button('right'));
game_start();
function game_start(){
    game_running = true;
    score_text.textContent = score;
    create_food();
    draw_food();
    next_tick();

};
function next_tick(){
    if(game_running){
        time_out_id = setTimeout (()=>{
            clearboard();
            draw_food();
            move_snake();
            draw_snake();
            check_gameover();
            next_tick();
        }, 75) // gamespeed
    }
    else{
        display_gameover();
    }
};
function clearboard(){
    ctx.fillStyle = board_bg;
    ctx.fillRect(0,0, game_width, game_height);

};
function create_food(){
    function rand_food(min, max){
        const rand_num = Math.round((Math.random() * (max-min) + min) /unit_size ) * unit_size
        return rand_num
    }
    food_x = rand_food(0, game_width - unit_size)
    food_y = rand_food(0, game_width - unit_size)
    
};
function draw_food(){
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(apple_img, food_x, food_y, unit_size, unit_size); // Draw the apple at food_x, food_ys
};
function move_snake(){
    const head = {x: snake[0].x + x_velocity,
                    y:snake[0].y + y_velocity
    }
    snake.unshift(head);
    if(snake[0].x == food_x && snake[0].y == food_y){ // if food is eaten
        score+= 1;
        score_text.textContent = score;
        create_food();
    }else{
        snake.pop();
    }
};
function draw_snake(){
    ctx.fillStyle = snake_color;
    ctx.strokeStyle = snake_border;
    snake.forEach(snake_part =>{
        ctx.fillRect(snake_part.x, snake_part.y, unit_size, unit_size);
        ctx.strokeRect(snake_part.x, snake_part.y, unit_size, unit_size);
    })
};


function change_direction_by_button(direction) {
    // Avoid moving in the opposite direction
    const going_up = (y_velocity == -unit_size);
    const going_down = (y_velocity == unit_size);
    const going_right = (x_velocity == unit_size);
    const going_left = (x_velocity == -unit_size);

    switch (direction) {
        case 'left':
            if (!going_right) {
                x_velocity = -unit_size;
                y_velocity = 0;
            }
            break;
        case 'up':
            if (!going_down) {
                x_velocity = 0;
                y_velocity = -unit_size;
            }
            break;
        case 'right':
            if (!going_left) {
                x_velocity = unit_size;
                y_velocity = 0;
            }
            break;
        case 'down':
            if (!going_up) {
                x_velocity = 0;
                y_velocity = unit_size;
            }
            break;
    }
}

function change_direction(event) {
    const key_pressed = event.keyCode;
    const LEFT = 65;
    const RIGHT = 68;
    const DOWN = 83;
    const UP = 87;

    // Check if the snake is moving in the opposite direction
    const going_up = (y_velocity == -unit_size);
    const going_down = (y_velocity == unit_size);
    const going_right = (x_velocity == unit_size);
    const going_left = (x_velocity == -unit_size);

    switch (true) {
        case (key_pressed == LEFT && !going_right): // Can't move left if already moving right
            x_velocity = -unit_size;
            y_velocity = 0;
            break;
        case (key_pressed == UP && !going_down): // Can't move up if already moving down
            x_velocity = 0;
            y_velocity = -unit_size;
            break;
        case (key_pressed == RIGHT && !going_left): // Can't move right if already moving left
            x_velocity = unit_size;
            y_velocity = 0;
            break;
        case (key_pressed == DOWN && !going_up): // Can't move down if already moving up
            x_velocity = 0;
            y_velocity = unit_size;
            break;
    }
}

function check_gameover(){
    switch(true){
        case (snake[0].x < 0):
            game_running = false;
            break;
        case (snake[0].x >= game_width):
            game_running = false;
            break;
        case (snake[0].y < 0):
            game_running = false;
            break;
        case (snake[0].y >= game_height):
            game_running = false;
            break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            game_running = false;
        }
    }
};
function display_gameover(){
    ctx.font = "25px bold";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", game_width / 2, game_height / 2);
    game_running = false;
};
function reset_game(){
    score = 0;
    x_velocity = unit_size;
    y_velocity = 0;
    snake = [
        {x:unit_size * 4, y:0},
        {x:unit_size * 3, y:0},
        {x:unit_size * 2, y:0},
        {x:unit_size, y:0},
        {x:0, y:0}
    ]
    clearTimeout(time_out_id)
    game_start();
};


