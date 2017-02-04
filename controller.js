/* Javascript for A-Star */

function tile(color, path, cost){
    this.color = color;
    this.path = path;
    this.cost = cost;
};

/* Create Corresponding Array of Map */
var arr = new Array(160);

for(j=0; j < 120; j++){
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
            cell.attr('data-row', i);
            cell.attr('data-column', j)
            cell.attr('status', 'unblocked')
            row.append(cell);
        }
    }
}


/* Select Random Coordinates */
function getRandomCoords(){
    var xArray = [];
    var yArray = [];
    
    for(var i=0; i < 8; i++){
        var x = Math.random() * (161);
        xArray.push(x);
        
        for(var j=0; j < xArray.length; j++){
            if((xArray.length > 1) && (x=xArray[j])){
                x = Math.random() * (161);
                xArray.push(x);
            }
        }
        yArray.push(Math.random() * (121)); 
    }
    
    /* Get 31x31 region for coordinate pair and
    decide if cell is hard to traverse or not */
    for(var i=0; i < 8; i++){
        var left = xArray[i] - 15;
        var right = xArray[i] + 15;
        var lower = yArray[i] + 15;
        var upper = yArray[i] - 15;
        
        if(left < 0){
            left = 0;
        }
        if(right > 160){
            right = 160;
        }
        if(lower > 120){
            lower = 120;
        }
        if(upper < 0){
            upper = 0;
        }
        
        for(var j=left; left <= right; left++){
            for(var k=upper; upper <= lower; upper++){
                var tmp = getProbability();
                if(tmp==0){
                    arr[left][upper] = "unblocked";
                }
                else if(tmp==1){
                    arr[left][upper] = "hard";
                }
            }
        }
    }
}

function getProbability() {
    var probability = [0,1];
    var idx = Math.floor(Math.random() * 2);
    console.log(probability[idx]);
    return probability[idx];
}

$(document).ready(function() {
    createGrid(160, 120);
    
    $('.table').on('click', 'td', function () {
        console.log("Row: " + $(this).attr('data-row'));
        console.log("Column: " + $(this).attr('data-column'));
        console.log("Status: " + $(this).attr('status'));
    });
    
});