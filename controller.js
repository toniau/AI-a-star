/* Javascript for A-Star */

const TILE_BLOCKED = "0";
const TILE_EMPTY = "1";
const TILE_HARD = "2";
const TILE_RIVER = "a";
const TILE_HARD_RIVER = "b";
const TILE_START = "s";
const TILE_GOAL = "g";

let startCoord, goalCoord;
let centers = [];

function tile(type, x, y){
    this.type = type;
    let id = '#'+x+'-'+y;
    switch(this.type){
        case TILE_EMPTY:
            $(id).css('background-color', '#FFF');
            break;
        case TILE_HARD: 
            $(id).css('background-color', '#F4A460');
            break;
        case TILE_RIVER:
            $(id).css('background-color', 'blue');
            break;
        case TILE_HARD_RIVER:
            $(id).css('background-color', 'navy');
            break;
        case TILE_BLOCKED:
            $(id).css('background-color', '#333');
            break;
        case TILE_START:
            $(id).css('background-color', 'red');
            break;
        case TILE_GOAL:
            $(id).css('background-color', 'yellow');
            break;
    }

}

/* Create Corresponding Array of Map */
let arr = new Array(160);
for(j=0; j < 160; j++){
    arr[j] = new Array(120);
}

/* Create Grid Map Function */
function createGrid(columns, rows) {
    let table = $('.table');

    for (let i = 0; i < rows; i++) {
        let row = $('<tr>');
        table.append(row)
        for (let j = 0; j < columns; j++) {
            let cell = $('<td>')
            cell.attr('id',j+'-'+i);
            cell.attr('data-row', i);
            cell.attr('data-column', j);
            row.append(cell);
            arr[j][i] = new tile(TILE_EMPTY, j, i);
        }
    }

    /*
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            console.log(arr[col][row].type);
        }
    }
    */
}

function getProbability() {
    let probability = [0,1];
    let idx = Math.floor(Math.random() * 2);
    return probability[idx];
}


/* Select Random Coordinates*/
function getRandomCoords(){
    
    for(let i=0; i<8; i++){
        let x = Math.floor(Math.random() * (160));
        let y = Math.floor(Math.random() * (120));
        
        let coord = {'x' : x, 'y': y};
        
        if(centers.includes(coord)) {
            i--;
        } else {
            centers.push(coord);
        }
        
    }
    
    /* Get 31x31 region for coordinate pair and
    decide if cell is hard to traverse or not*/
    for(let i=0; i < 8; i++){
        let left = centers[i].x - 15;
        let right = centers[i].x + 15;
        let lower = centers[i].y + 15;
        let upper = centers[i].y - 15;
        
        if(left < 0){
            left = 0;
        }
        if(right > 159){
            right = 159;
        }
        if(lower > 119){
            lower = 119;
        }
        if(upper < 0){
            upper = 0;
        }
        

        for(let j=left; j <= right; j++){
            for(let k=upper; k <= lower; k++){
                let tmp = getProbability();
                if(tmp===1){
                    arr[j][k] = new tile(TILE_HARD, j, k);
                } 
            }
            
        }
    }
    return;
}

function getNextRiverDirection(direction) {
    let p = Math.random();
    if (p < 0.2) { // Left
        switch(direction){
            case "N":
                return "W";
                break;
            case "E":
                return "N";
                break;
            case "S":
                return "W";
                break;
            case "W":
                return "S";
                break;
        }
    } else if (p < 0.4) { // Right
        switch(direction){
            case "N":
                return "E";
                break;
            case "E":
                return "S";
                break;
            case "S":
                return "W";
                break;
            case "W":
                return "N";
                break;
        }
    } else {
        return direction;
    }
}

function generateHighway(){
    
    let x = 0;
    let y = 0;
    let direction = "";
    
    switch(Math.floor(Math.random() * 4)){
            
        //North
        case 0:
            min = Math.ceil(1);
            max = Math.floor(159);
            x = Math.floor(Math.random() * (max-min) + min);
            y = 0;
            direction = "S";
            break;
        //East
        case 1:
            min = Math.ceil(1);
            max = Math.floor(119);
            x = 159;
            y = Math.floor(Math.random() * (max-min) + min);
            direction = "W";
            break;
        //South
        case 2:
            min = Math.ceil(1);
            max = Math.floor(159);
            x = Math.floor(Math.random() * (max-min) + min);
            y = 119;
            direction = "N";
            break;
        //West
        case 3:
            min = Math.ceil(1);
            max = Math.floor(119);
            x = 0;
            y = Math.floor(Math.random() * (max-min) + min);
            direction = "E";
            break;
    }

    let riverCells = [];
    let riverLength = 0;
    
    /* 20 spaces away */
    while (true) {
        for(let i=0; i < 20; i++){
            let coord = [x, y];
            riverCells.push(coord);
            riverLength++;
            if (x < 0 || x >= 160) {
                if (riverLength < 100) {
                    backtrackRiver(riverCells, riverLength);
                    return false;
                } else {
                    return true;
                }
            }
            if (y < 0 || y >= 120) {
                if (riverLength < 100) {
                    backtrackRiver(riverCells, riverLength);
                    return false;
                } else {
                    return true;
                }
            }
            

            if(arr[x][y].type === TILE_HARD){
                arr[x][y] = new tile(TILE_HARD_RIVER, x, y)
            } else if (arr[x][y].type === TILE_RIVER || arr[x][y].type === TILE_HARD_RIVER) {
                backtrackRiver(riverCells, riverLength); 
                return false; // Failed, hit another river
            } else {
                arr[x][y] = new tile(TILE_RIVER, x, y)
            }

            switch(direction){
              case "N":
                  y--;
                  break;
              case "E":
                  x++;
                  break;
              case "S":
                  y++;
                  break;
              case "W":
                  x--;
                  break;
            }
        }

        // Choose next direction
        direction = getNextRiverDirection(direction);
    }
}

function backtrackRiver(riverCells, riverLength, direction) {

    for (let i = 0; i < riverCells.length - 1; i++) {
        let x = riverCells[i][0];
        let y = riverCells[i][1];

        // console.log(riverCells[i]);

        if (arr[x][y].type === TILE_HARD_RIVER) {
            arr[x][y] = new tile(TILE_HARD, x, y);
        } else {
            arr[x][y] = new tile(TILE_EMPTY, x, y);
        }
    }

}

function generateBlocks() {
    for (let i = 0; i < 3840; i++) { // 20% of 160*120
        let x = Math.floor((Math.random() * 160));
        let y = Math.floor((Math.random() * 120));

        if (arr[x][y].type !== TILE_EMPTY) {
            i--;
        } else {
            arr[x][y] = new tile(TILE_BLOCKED, x, y);
        }
    }
}

function setStartGoal() {
    let startX = 21;
    let startY = 21;
    while (startX > 20 && startX <= 140) {
        startX = Math.floor(Math.random() * 160);
    }
    while (startY > 20 && startY <= 100) {
        startY = Math.floor(Math.random() * 120);
    }
    arr[startX][startY] = new tile(TILE_START, startX, startY);

    startCoord = {startX, startY};
    
    let endX = 21;
    let endY = 21;
    while (endX > 20 && endX <= 140) {
        endX = Math.floor(Math.random() * 160);
    }
    while (endY > 20 && endY <= 100) {
        endY = Math.floor(Math.random() * 120);
    }
    arr[endX][endY] = new tile(TILE_GOAL, endX, endY);

    goalCoord = {endX, endY};
}

$(document).ready(function() {
    createGrid(160, 120);
    
    $('.table').on('click', 'td', function () {
        console.log("Id: " + $(this).attr('id'));
        console.log("Row: " + $(this).attr('data-row'));
        console.log("Column: " + $(this).attr('data-column'));
    });
    
    getRandomCoords();

    // Four rivers
    for (let i = 0; i < 4; i++) {
        console.log("river #: " + i);
        if (!generateHighway()) {
            i--;
        }
    }

    generateBlocks();
    setStartGoal();
});
