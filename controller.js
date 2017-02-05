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
            $(id).css('background-color', 'skyblue');
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
            cell.attr('id',i+'-'+j);
            cell.attr('data-row', i);
            cell.attr('data-column', j);
            row.append(cell);
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
                if(tmp===0){
                    arr[j][k] = new tile(TILE_EMPTY, j, k);
                }
                else if(tmp===1){
                    arr[j][k] = new tile(TILE_HARD, j, k);
                }
            }
            
        }
        console.log(i)
    }
    return;
}

function generateHighway(){
    
    let x = 0;
    let y = 0;
    
    switch(Math.floor(Math.random() * 4)){
            
        //North
        case 0:
            x = Math.floor(Math.random() * (160));
            y = 0;
            break;
        //East
        case 1:
            x = 159;
            y = Math.floor(Math.random() * (120));
            break;
        //South
        case 2:
            x = Math.floor(Math.random() * (160));
            y = 119;
            break;
        //West
        case 3:
            x = 0;
            y = Math.floor(Math.random() * (120));
            break;
    }
    
    /* 20 spaces away*/
    for(let i=0; i < 20; i++){
        
    }
    
    
}

$(document).ready(function() {
    createGrid(160, 120);
    
    $('.table').on('click', 'td', function () {
        console.log("Id: " + $(this).attr('id'));
        console.log("Row: " + $(this).attr('data-row'));
        console.log("Column: " + $(this).attr('data-column'));
    });
    
    getRandomCoords();
    
});