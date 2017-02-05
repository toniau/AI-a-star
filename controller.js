/* Javascript for A-Star */

const TILE_BLOCKED = "0";
const TILE_EMPTY = "1";
const TILE_HARD = "2";
const TILE_RIVER = "a";
const TILE_HARD_RIVER = "b";


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
}

function getProbability() {
    let probability = [0,1];
    let idx = Math.floor(Math.random() * 2);
    //console.log("Probability: " + probability[idx]);
    return probability[idx];
}

let centers = [];

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
        
        console.log("x: " + x + " y: " + y);
        //console.log(coord);
        //console.log(centers[i]);
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
                console.log("arr[j][k]: " + arr[j][k].type);
                if(tmp===1 /*&& (arr[j][k].type===TILE_EMPTY)*/){
                    arr[j][k] = new tile(TILE_HARD, j, k);
                } 
            }
            
        }
        //console.log(i)
    }
    return;
}

function moveDirection(x, y, direction){
    switch(direction){
            case "N":
                return y--;
                break;
            case "E":
                return x++;
                break;
            case "S":
                return y++;
                break;
            case "W":
                return x--;
                break;
        }
}

function tryLeft(coord, direction){
    switch(direction){
            case "N":
                let x = coord.x - 1;
                return coord.x;
                break;
            case "E":
                return y++;
                break;
            case "S":
                return x++;
                break;
            case "W":
                return y--;
                break;
        }
}

function tryRight(coord, direction){
    switch(direction){
            case "N":
                return x++;
                break;
            case "E":
                return y--;
                break;
            case "S":
                return x--;
                break;
            case "W":
                return y++;
                break;
        }
}

function generateHighway(){
    
    let x = 0;
    let y = 0;
    let direction = "";
    let highwayPts = [];
    
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
    
    //let coord = {'x' : x, 'y': y};
    //highwayPts.push(coord);
    
    /* 20 spaces away */
    for(let i=0; i < 20; i++){
        
        //console.log("PLS LOOP " + i);
        
        if(arr[x][y].type === TILE_HARD){
            arr[x][y] = new tile(TILE_HARD_RIVER, x, y)
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
    
    /*coord.x = x;
    coord.y = y;
    console.log("Coord: " + coord);
    highwayPts.push(coord);
    
    /* Continue highway generation */
    
    let attempts = 0;
    let p = Math.random();
    /*for(let i=0; i < 20; i++){
        /* 60% Chance - move same direction
        if (p < 0.6) {
            moveDirection(x, y, direction);
            
            if(arr[x][y].type===TILE_HARD_RIVER || arr[x][y].type===TILE_RIVER){
                x = highwayPts[highwayPts.length-1].x;
                y = highwayPts[highwayPts.length-1].y;
                attempts++;
                let tmp = getProbability();
                if(tmp===0){
                    tryLeft(coord, direction);
                    moveDirection(x, y, )
                    attempts++;
                } else {
                    tryRight(coord, direction);
                }
            }
            
        } else if (p < 0.8) {
            //left
        } else {
            //right
        }
    }*/
    
    
    
    
}

$(document).ready(function() {
    createGrid(160, 120);
    
    $('.table').on('click', 'td', function () {
        console.log("Id: " + $(this).attr('id'));
        console.log("Row: " + $(this).attr('data-row'));
        console.log("Column: " + $(this).attr('data-column'));
    });
    
    getRandomCoords();
    generateHighway();
    
});