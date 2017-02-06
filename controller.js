/* Javascript for A-Star */

const TILE_BLOCKED = "0";
const TILE_EMPTY = "1";
const TILE_HARD = "2";
const TILE_RIVER = "a";
const TILE_HARD_RIVER = "b";
const TILE_START = "s";
const TILE_GOAL = "g";
const TILE_PATH = "p";

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
        case TILE_PATH:
            $(id).css('background-color', 'chartreuse');
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

    startCoord = {'x': startX, 'y': startY};
    
    let endX = 21;
    let endY = 21;
    while (endX > 20 && endX <= 140) {
        endX = Math.floor(Math.random() * 160);
    }
    while (endY > 20 && endY <= 100) {
        endY = Math.floor(Math.random() * 120);
    }
    arr[endX][endY] = new tile(TILE_GOAL, endX, endY);

    goalCoord = {'x':endX, 'y': endY};
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
        if (!generateHighway()) {
            i--;
        }
    }

    generateBlocks();
    setStartGoal();
    astar();
});

/*
 * BEGIN BINARY HEAP
 */
function BinaryHeap(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  remove: function(node) {
    var length = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < length; i++) {
      if (this.content[i] != node) continue;
      // When it is found, the process seen in 'pop' is repeated
      // to fill up the hole.
      var end = this.content.pop();
      // If the element we popped was the one we needed to remove,
      // we're done.
      if (i == length - 1) break;
      // Otherwise, we replace the removed element with the popped
      // one, and allow it to float up or sink down as appropriate.
      this.content[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  },

  size: function() {
    return this.content.length;
  },

  bubbleUp: function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n], score = this.scoreFunction(element);
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
      parent = this.content[parentN];
      // If the parent has a lesser score, things are in order and we
      // are done.
      if (score >= this.scoreFunction(parent))
        break;

      // Otherwise, swap the parent with the current element and
      // continue.
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  },

  sinkDown: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
    element = this.content[n],
    elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
        child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
        child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      // No need to swap further, we are done.
      if (swap == null) break;

      // Otherwise, swap and continue.
      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
};

/*
 * END BINARY HEAP
 */


let fringe = new BinaryHeap(function(cell) { return cell.g; });

// A-Star
function astar() {
    let start = {
        'x' : startCoord.x, 
        'y' : startCoord.y,
        'g' : 0
    }
    let goal = {
        'x' : goalCoord.x,
        'y' : goalCoord.y
    }

    fringe.push(start);

    let closed = new Set();
    console.log(start);
    console.log(goal);

    while(fringe.size() !== 0) {
        let s = fringe.pop();
        if (s.x === goal.x && s.y === goal.y) {
            console.log("Path found!");
            return;
        }
        closed.add(s);

        let succ = getNeighbors(s.x, s.y);
        for (let i = 0; i < succ.length; i++) {
            let sp = succ[i];
            if (!closed.has(sp)) {
                if(!fringe.content.includes(sp)) {
                    sp.g = Number.MAX_SAFE_INTEGER;
                }
                updateVertex(s, sp);
            }
        }
    }
    console.log("No path found.");
}

function updateVertex(s, sp) {
    if (s.g + getCost(s, sp) < sp.g) {
        sp.g = s.g + getCost(s, sp);
        
        if (fringe.content.includes(sp)) {
            fringe.remove(sp);
        }
        fringe.push(sp);
    }
}

function getNeighbors(x, y) {
    return [
        { 'x': x - 1, 'y': y + 1, 'g': null },
        { 'x': x - 1, 'y': y - 1, 'g': null },
        { 'x': x - 1, 'y': y, 'g': null },
        { 'x': x + 1, 'y': y + 1, 'g': null },
        { 'x': x + 1, 'y': y - 1, 'g': null },
        { 'x': x + 1, 'y': y, 'g': null },
        { 'x': x, 'y': y - 1, 'g': null },
        { 'x': x, 'y': y + 1, 'g': null }
    ];
}

function getCost(s, sp) {
    return 1;
}
