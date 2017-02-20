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
            $(id).css('background-color', 'fuchsia');
            break;
        case TILE_PATH:
            $(id).css('background-color', 'chartreuse');
            break;
    }

}

/* Create Corresponding Array of Map */
let arr = new Array(120);
for(j=0; j < arr.length; j++){
    arr[j] = new Array(160);
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
            arr[i][j] = new tile(TILE_EMPTY, j, i);
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
                    arr[k][j] = new tile(TILE_HARD, j, k);
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
            

            if(arr[y][x].type === TILE_HARD){
                arr[y][x] = new tile(TILE_HARD_RIVER, x, y)
            } else if (arr[y][x].type === TILE_RIVER || arr[y][x].type === TILE_HARD_RIVER) {
                backtrackRiver(riverCells, riverLength); 
                return false; // Failed, hit another river
            } else {
                arr[y][x] = new tile(TILE_RIVER, x, y)
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

        if (arr[y][x].type === TILE_HARD_RIVER) {
            arr[y][x] = new tile(TILE_HARD, x, y);
        } else {
            arr[y][x] = new tile(TILE_EMPTY, x, y);
        }
    }

}

function generateBlocks() {
    for (let i = 0; i < 3840; i++) { // 20% of 160*120
        let x = Math.floor((Math.random() * 160));
        let y = Math.floor((Math.random() * 120));

        if (arr[y][x].type !== TILE_EMPTY) {
            i--;
        } else {
            arr[y][x] = new tile(TILE_BLOCKED, x, y);
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
    arr[startY][startX] = new tile(TILE_START, startX, startY);

    startCoord = {'x': startX, 'y': startY};
    
    let endX = 21;
    let endY = 21;
    while (endX > 20 && endX <= 140) {
        endX = Math.floor(Math.random() * 160);
    }
    while (endY > 20 && endY <= 100) {
        endY = Math.floor(Math.random() * 120);
    }
    arr[endY][endX] = new tile(TILE_GOAL, endX, endY);

    goalCoord = {'x':endX, 'y': endY};
}

$(document).ready(function() {
    
    createGrid(160, 120);
    getRandomCoords();

    // Four rivers
    for (let i = 0; i < 4; i++) {
        if (!generateHighway()) {
            i--;
        }
    }
    generateBlocks();
    setStartGoal();
    UCS();
    fillPath();

    $('.table').on('click', 'td', function () {
        console.log("Id: " + $(this).attr('id'));
        console.log("Row: " + $(this).attr('data-row'));
        console.log("Column: " + $(this).attr('data-column'));
        console.log("f: " + grid[$(this).attr('data-row')][$(this).attr('data-column')].f);
        console.log("g: " + grid[$(this).attr('data-row')][$(this).attr('data-column')].g);
        console.log("h: " + grid[$(this).attr('data-row')][$(this).attr('data-column')].h);
    });
    
    /* Import File Reader */
    document.getElementById('file').onchange = function(){

        var file = this.files[0];
        var newCenters = [];
        var reader = new FileReader();

        reader.onload = function(event){
            var lines = this.result.split('\n');
            for(var line = 0; line < lines.length; line++){
                // Start Coords
                if(line===0){
                    var obj = JSON.parse(lines[0]);
                    startCoord.x = obj.x;
                    startCoord.y = obj.y;
                    //console.log("startCoord: (" + startCoord.x + ", " + startCoord.y + ")");
                }
                // Goal Coords
                else if(line===1){
                    var obj = JSON.parse(lines[1]);
                    goalCoord.x = obj.x;
                    goalCoord.y = obj.y;
                    //console.log("goalCoord: (" + goalCoord.x + ", " + goalCoord.y + ")");
                }
                // Center Coords
                else if(line>1 && line<10){
                    var obj = JSON.parse(lines[line]);
                    newCenters.push(obj);
                }
                else {
                    // Fill in map
                    let row = line-10;
                    let str = lines[line];
                    let charArray = str.split("");
                    //console.log("charArray: " + charArray);
                    for(var k=0; k < 160; k++){
                        //console.log("String at line " + line + ": " + str);
                        arr[row][k] = new tile(charArray[k], k, row);
                    }
                }
        }

        // Set new center coords
        for(var i=0; i < 8; i++){
            centers[i] = newCenters[i];
            //console.log("centers["+i+"]"+centers[i]);
        }

        }

        reader.readAsText(file);
    }
    
    /* Choose Algorithm to Run */
    document.getElementById('search-btn').addEventListener('click', function(){
            
        if(document.getElementById('USC').checked){
            UCS();
        }
        else if(document.getElementById('astar').checked){
            astar(1);
        } else if(document.getElementById('weight-astar').checked){
            var weight = document.getElementById('weight').value;
            astar(weight);
        }
        
        fillPath();
    });
    
    $("#clearMapInfo").hide();
    
    /* Export File */
    $("#getMapInfo").on('click', function(){
        
        $("#getMapInfo").hide();
        $("div").append("<textarea rows='10' cols='100'></textarea>");
        $("textarea").append(JSON.stringify(startCoord) + "\n");
        $("textarea").append(JSON.stringify(goalCoord) + "\n");
        
        for(var i=0; i < 8; i++){
            var tmp = centers[i];
            tmp = JSON.stringify(tmp);
            $("textarea").append(tmp + "\n");
        }
        
        for(var j=0; j < 120; j++){
            var rowString = "";
            for(var k=0; k < 160; k++){
                var tmp = arr[j][k].type;
                //console.log("arr[k][j].type = " + tmp);
                rowString += tmp;
            } 
            //console.log("iteration: " + j + "rowString: " + rowString);
            $("textarea").append(rowString + "\n");
        }
        
        $("#clearMapInfo").show(); 
    });
    
    $("#clearMapInfo").on('click', function(){
        $("#clearMapInfo").hide();
        $("textarea").remove();
        $("#getMapInfo").show();
    });
});


/*
 * BEGIN BINARY HEAP
 * Binary Heap from a javascript library on github
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

let grid = [];
for (let row = 0; row < 120; row++) {
    grid.push([]);
    for (let col = 0; col < 160; col++) {
        grid[row].push({
            'x': col,
            'y': row,
            'g': Number.MAX_SAFE_INTEGER,
            'parent': {
                'x': null,
                'y': null
            }
        });
    }
}
let closed = [];

// Uniform Cost Search
function UCS() {
    
    var startTime = window.performance.now();
    
    fringe = new BinaryHeap(function(cell) { return cell.g; });

    grid = [];
    for (let row = 0; row < 120; row++) {
        grid.push([]);
        for (let col = 0; col < 160; col++) {
            grid[row].push({
                'x': col,
                'y': row,
                'g': Number.MAX_SAFE_INTEGER,
                'parent': {
                    'x': null,
                    'y': null
                }
            });
        }
    }
    closed = [];
    
    let start = {
        'x' : startCoord.x, 
        'y' : startCoord.y,
        'g' : 0,
        'parent' : {
            'x': startCoord.x,
            'y': startCoord.y
        }
    }
    grid[start.y][start.x].parent = start.parent;
    grid[start.y][start.x].g = 0;

    let goal = {
        'x' : goalCoord.x,
        'y' : goalCoord.y
    }

    fringe.push(start);

    let expanded = 0;

    while(fringe.size() > 0) {
        expanded++;
        //console.log(fringe.size());
        let s = fringe.pop();
        if (s.x === goal.x && s.y === goal.y) {
            console.log("Path found!");
            var endTime = window.performance.now();
            var time = endTime-startTime;
            console.log("Runtime: " + time);
            console.log("Nodes Expanded: " + expanded);
            return;
        }
        closed.push(s);

        let succ = getNeighbors(s);
        for (let i = 0; i < succ.length; i++) {
            let sp = succ[i];
            if (arr[sp.y][sp.x].type === TILE_BLOCKED) {
                closed.push(sp);
            } else if (closed.indexOf(sp) < 0) {
                if(fringe.content.indexOf(sp) < 0) {
				    sp.g = Number.MAX_SAFE_INTEGER;
                    sp.parent.x = null;
                    sp.parent.y = null;
                }
                updateVertex(s, sp, goal.x, goal.y, 1);
            }
        }
    }
    console.log("No path found.");
}

// A-Star: w=1
// Weighted-A*: w > 1
function astar(w){
    
    var startTime = window.performance.now();
    
    fringe = new BinaryHeap(function(cell) { return cell.f; });

    grid = [];
    for (let row = 0; row < 120; row++) {
        grid.push([]);
        for (let col = 0; col < 160; col++) {
            grid[row].push({
                'x': col,
                'y': row,
                'f': 0,
                'g': Number.MAX_SAFE_INTEGER,
                'parent': {
                    'x': null,
                    'y': null
                }
            });
        }
    }
    closed = [];
    
    // f: estimate of distance from start vertex via current vertex s to the goal
    // g: distance from start to vertex x
    let start = {
        'x' : startCoord.x, 
        'y' : startCoord.y,
        'f' : 0,
        'g' : 0,
        'parent' : {
            'x': startCoord.x,
            'y': startCoord.y
        }
    }
    
    
    grid[start.y][start.x].parent = start.parent;
    grid[start.y][start.x].f = 0;
    grid[start.y][start.x].g = 0;

    let goal = {
        'x' : goalCoord.x,
        'y' : goalCoord.y
    }

    let h = manhattanDistance(start.x, start.y, goal.x, goal.y);
    start.f = (start.g) + (w*h);
    
    fringe.push(start);

    let expanded = 0;

    while(fringe.size() > 0) {
        expanded++;
        // console.log(fringe.size());
        let s = fringe.pop();
        s.f = s.g + (w * manhattanDistance(s.x, s.y, goal.x, goal.y));
        if (s.x === goal.x && s.y === goal.y) {
            console.log("Path found!");
            var endTime = window.performance.now();
            var time = endTime-startTime;
            console.log("Runtime: " + time);
            console.log("Nodes Expanded: " + expanded);
            return;
        }
        closed.push(s);

        let succ = getNeighbors(s);
        for (let i = 0; i < succ.length; i++) {
            let sp = succ[i];
            if (arr[sp.y][sp.x].type === TILE_BLOCKED) {
                closed.push(sp);
            } else if (closed.indexOf(sp) < 0) {
                if(fringe.content.indexOf(sp) < 0) {
				    sp.g = Number.MAX_SAFE_INTEGER;
                    sp.parent.x = null;
                    sp.parent.y = null;
                }
                updateVertex(s, sp, goal.x, goal.y, w);
            }
        }
    }
    console.log("No path found.");
}

function sequentialAStar(){
    
    open = new BinaryHeap(function(cell) { return cell.f; });
    closed = new BinaryHeap(function(cell) { return cell.g; });

    grid = [];
    for (let row = 0; row < 120; row++) {
        grid.push([]);
        for (let col = 0; col < 160; col++) {
            grid[row].push({
                'x': col,
                'y': row,
                'f': 0,
                'g': Number.MAX_SAFE_INTEGER,
                'parent': {
                    'x': null,
                    'y': null
                }
            });
        }
    }
    
    for(var i=0; i<n; i++){
        
    }
}

function keys(s, i){
    var f = s.g + w1 * s.h;
    return f;
}

function expandStates(s, i){
    open.remove(s);
    
    let succ = getNeighbors(s);
    for (let i = 0; i < succ.length; i++) {
        let sp = succ[i];
        if (arr[sp.y][sp.x].type === TILE_BLOCKED) {
            closed.push(sp);
        } else if (closed.indexOf(sp) < 0) {
            if(fringe.content.indexOf(sp) < 0) {
                sp.g = Number.MAX_SAFE_INTEGER;
                sp.parent.x = null;
                sp.parent.y = null;
            }
            updateVertex(s, sp, goal.x, goal.y, w);
        }
    }
}

function updateVertex(s, sp, g1, g2, w) {
    if ((s.g + getCost(s, sp)) < sp.g) {
        sp.g = s.g + getCost(s, sp);
        sp.parent.x = s.x;
        sp.parent.y = s.y;

        if (fringe.content.indexOf(sp) < 0) {
            fringe.remove(sp);
        }
        sp.f = sp.g + (w * manhattanDistance(sp.x, sp.y, g1, g2));
        fringe.push(sp);
    }
}

function euclideanDistance(s1, s2, g1, g2){
    var d1 = s1 - g1,
        d2 = s2 - g2;
    var estimate = Math.sqrt(d1*d1 + d2*d2);
    //console.log("Estimate: " + estimate);
    return estimate;
}

function manhattanDistance(s1, s2, g1, g2){
    var d1 = Math.abs(s1-g1);
    var d2 = Math.abs(s2-g2);
    var estimate = d1 + d2;
    //console.log("Estimate: " + estimate);
    return estimate;
}

function akriteanDistance(s1, s2, g1, g2){
    let d1 = euclideanDistance(s1, s2, g1, g2) * (1-2.5);
    let d2 = manhattanDistance(s1, s2, g1, g2) * 2.5;
    let estimate = d1 + d2;
    //console.log("Estimate: " + estimate);
    return estimate;
}

function chebyshevDistance(s1, s2, g1, g2){
    let d1 = Math.abs(g1 - s1);
    let d2 = Math.abs(g2 - s2);
    let estimate = Math.max(d1, d2);
    //console.log("Estimate: " + estimate);
    return estimate;
}

function exampleHeuristic(s1, s2, g1, g2){
    let absX = Math.abs(s1 - g1);
    let absY = Math.abs(s2 - g2);
    let estimate = Math.sqrt(2) * Math.min(absX, absY) + Math.max(absX, absY) - Math.min(absX, absY);
    //console.log("Estimate: " + estimate);
    return estimate;
}

function getNeighbors(s) {
    let x = s.x;
    let y = s.y;
    let neighbors = [];

	// NSEW
	if (grid[y - 1] && grid[y - 1][x]) {
		neighbors.push(grid[y - 1][x]);
	}
	if (grid[y + 1] && grid[y + 1][x]) {
		neighbors.push(grid[y + 1][x]);
	}
	if (grid[y] && grid[y][x - 1]) {
		neighbors.push(grid[y][x - 1]);
	}
	if (grid[y] && grid[y][x + 1]) {
		neighbors.push(grid[y][x + 1]);
	}

	// Diagonals
	if (grid[y - 1] && grid[y - 1][x - 1]) {
		neighbors.push(grid[y - 1][x - 1]);
	}
	if (grid[y + 1] && grid[y + 1][x - 1]) {
		neighbors.push(grid[y + 1][x - 1]);
	}
	if (grid[y - 1] && grid[y - 1][x + 1]) {
		neighbors.push(grid[y - 1][x + 1]);
	}
	if (grid[y + 1] && grid[y + 1][x + 1]) {
		neighbors.push(grid[y + 1][x + 1]);
	}
    return neighbors;
}

function fillPath() {
    let x = grid[goalCoord.y][goalCoord.x].parent.x;
    let y = grid[goalCoord.y][goalCoord.x].parent.y;
    let pathLength = 0;
    
    var id = '#' + x + '-' + y;
    $(id).css('background-color', 'chartreuse');

    do {
        let parent = grid[y][x].parent;
        pathLength++;
        x = parent.x;
        y = parent.y;
        id = '#' + x + '-' + y;
        $(id).css('background-color', 'chartreuse');
    } while (!(x === startCoord.x && y === startCoord.y))
    console.log("Path Length: " + pathLength);
    $(id).css('background-color', 'red');
}

function getCost(s, sp) {
    let sType = arr[s.y][s.x].type;
    let spType = arr[sp.y][sp.x].type;
    let cost = 0;
    if (s.x == sp.x || s.y == sp.y) { // Orthogonal
        if (sType === TILE_EMPTY) {
            if (spType === TILE_HARD) {
                cost = 1.5;
            } else {
                cost = 1.0;
            }
        } else if (sType === TILE_HARD) {
            if (spType === TILE_HARD) {
                cost = 2.0;
            } else {
                cost = 1.5;
            }
        } else if (sType === TILE_RIVER) {
            if (spType === TILE_RIVER) {
                cost = 0.25;
            } else if (spType === TILE_HARD_RIVER) {
                cost = 0.375;
            } else {
                cost = 1.0;
            }
        } else if (sType === TILE_HARD_RIVER) {
            if (spType === TILE_RIVER) {
                cost = 0.375;
            } else if (spType === TILE_HARD_RIVER) {
                cost = 0.5;
            } else {
                cost = 2;
            }
        }
    } else { // Diagonal
        if (sType === TILE_EMPTY) {
            if (spType === TILE_HARD) {
                cost = (Math.sqrt(2) + Math.sqrt(8)) / 2.0;
            } else {
                cost = Math.sqrt(2);
            }
        } else if (sType === TILE_HARD) {
            if (spType === TILE_HARD) {
                cost = Math.sqrt(8);
            } else {
                cost = (Math.sqrt(2) + Math.sqrt(8)) / 2.0;
            }
        }
    }
    return cost;
}
