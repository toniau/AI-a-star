/* Javascript for A-Star */

const TILE_BLOCKED = "0";
const TILE_EMPTY = "1";
const TILE_HARD = "2";
const TILE_RIVER = "a";
const TILE_HARD_RIVER = "b";


function tile(type, x, y){
    this.type = type;
    var id = '#'+x+'-'+y;
    switch(this.type){
        case TILE_EMPTY:
            $(id).css('color', '#FFF');
            break;
        case TILE_HARD: 
            $(id).css('color', '#F4A460');
            break;
        case TILE_RIVER:
            $(id).css('color', 'skyblue');
            break;
        case TILE_HARD_RIVER:
            $(id).css('color', 'navy');
            break;
        case TILE_BLOCKED:
            $(id).css('color', '#333');
            break;
    }
}

/* Create Corresponding Array of Map */
var arr = new Array(160);
for(j=0; j < 160; j++){
    arr[j] = new Array(120);
}

/* Create Grid Map Function */
function createGrid(columns, rows) {
    var table = $('.table');

    for (var i = 0; i < rows; i++) {
        var row = $('<tr>');
        table.append(row)
        for (var j = 0; j < columns; j++) {
            var cell = $('<td>')
            cell.attr('id',i+'-'+j);
            cell.attr('data-row', i);
            cell.attr('data-column', j);
            cell.attr('status', 'unblocked');
            row.append(cell);
        }
    }
}

function getProbability() {
    var probability = [0,1];
    var idx = Math.floor(Math.random() * 2);
    console.log("Probability: " + probability[idx]);
    return probability[idx];
}

var centers = [];

/* Select Random Coordinates*/
function getRandomCoords(){
    
    for(var i=0; i<8; i++){
        var x = Math.floor(Math.random() * (160));
        var y = Math.floor(Math.random() * (120));
        
        var coord = {'x' : x, 'y': y};
        
        if(centers.includes(coord)) {
            i--;
        } else {
            centers.push(coord);
        }
        
        //console.log("x: " + x + " y: " + y);
        //console.log(coord);
        //console.log(centers[i]);
    }
    
    /* Get 31x31 region for coordinate pair and
    decide if cell is hard to traverse or not*/
    for(var i=0; i < 8; i++){
        var left = centers[i].x - 15;
        var right = centers[i].x + 15;
        var lower = centers[i].y + 15;
        var upper = centers[i].y - 15;
        
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
        
        for(var j=left; left <= right; left++){
            for(var k=upper; upper <= lower; upper++){
                var tmp = getProbability();
                if(tmp==0){
                    arr[left][upper] = new tile(TILE_EMPTY, left, upper);
                }
                else if(tmp==1){
                    arr[left][upper] = new tile(TILE_HARD, left, upper);
                }
                //console.log(arr[left][upper]);
            }
        }
    }
    return;
}

function generateHighway(){
    
    var x = 0;
    var y = 0;
    
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
    for(var i=0; i < 20; i++){
        
    }
    
    
}

$(document).ready(function() {
    createGrid(160, 120);
    
    $('.table').on('click', 'td', function () {
        console.log("Id: " + $(this).attr('id'));
        console.log("Row: " + $(this).attr('data-row'));
        console.log("Column: " + $(this).attr('data-column'));
        console.log("Status: " + $(this).attr('status'));
    });
    
    getRandomCoords();
    
});