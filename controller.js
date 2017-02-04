/* Javascript for A-Star */

function tile(color, path){
    this.color = color;
    this.path = path;
};

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
    
    for(var i=0; i < 8; i++){
        var TL = xArray[i] - 15;
        var TR = xArray[i] + 15;

    }
}

function getProbability() {
    var probability = [0,1];
    var idx = Math.floor(Math.random() * 2);
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