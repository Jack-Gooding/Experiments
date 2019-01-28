let noFail = false;
let doColourTiles = true;
let doNumberBoard = true;
let doDrawGrid = true;
let doDrawCircles = true;
$(document).ready(function() {
  $("#doColourTiles").prop('checked', doColourTiles);
  $("#doNumberBoard").prop('checked', doNumberBoard);
  $("#doDrawGrid").prop('checked', doDrawGrid);
  $("#doDrawCircles").prop('checked', doDrawCircles);
  $("#doDrawCircles").prop('checked', doDrawCircles);
  $("#noFail").prop('checked', noFail);
});

function colourTilesChange() {
  if($("#doColourTiles").is(":checked")) {
    doColourTiles = true;
  } else {
    doColourTiles = false;
  }
  console.log(doColourTiles);
}

function numberBoardChange() {
  if($("#doNumberBoard").is(":checked")) {
    doNumberBoard = true;
  } else {
    doNumberBoard = false;
  }
  console.log(doNumberBoard);
}


function drawGridChange() {
  if($("#doDrawGrid").is(":checked")) {
    doDrawGrid = true;
  } else {
    doDrawGrid = false;
  }
  console.log(doDrawGrid);
}

function drawCirclesChange() {
  if($("#doDrawCircles").is(":checked")) {
    doDrawCircles = true;
  } else {
    doDrawCircles = false;
  }
  console.log(doDrawCircles);
}

function noFailChange() {
  if($("#noFail").is(":checked")) {
    noFail = true;
  } else {
    noFail = false;
  }
  console.log(doDrawCircles);
}

function render() {
  console.log("pressed");


  let canvasMax =$("#canvas-target").width();
  let squares = 67; //tiles per row
  if (noFail) {
  squares = 81; //tiles per row
  };
  console.log(squares);
  let interval = Math.floor(canvasMax/squares); //width/height of tile
  let bw = interval*squares; //canvas width
  let bh = interval*squares; //canvas height
  let p = 0; //padding for grid
  let board = {}; //empty board layout, to be filled as {"y1":{"x1": {"value": value}, "x2":{"value": value},...},"y2":{"x1": {"value": value}, "x2": {"value": value},...},...
  let visited = []; //array storing visited cells as objects [{"x1": x, "y1": y}, {"x2": x, "y2": y,}, ...]



$("#canvas-target").html(`<canvas id="canvas" width="${bw+squares}px" height="${bh+squares}px"></canvas>`);


let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
function colourTiles() {

  if(doColourTiles) {

  context.beginPath();
  for (let i = 0; i < bh; i+= interval*2) {

  for (let x = 0; x < bh; x+=interval*2) {
    context.fillStyle = "#f4A460";
    context.fillRect(p+x, p+i, interval+1, interval+1);
  }
  for (let x = 0; x <bh-interval && i < bh -interval; x+=interval*2) {
    context.fillStyle = "#f4A460";
    context.fillRect(p+x+interval, p+interval+i, interval+1, interval+1);
  }

}
  context.stroke();
  }
  };

function drawTiles(){
  if(doDrawGrid) {

  context.beginPath();

for (let x = 0; x <= bw; x += interval) {
    context.moveTo(0.5 + x + p, p);
    context.lineTo(0.5 + x + p, bh + p);
}

for (let x = 0; x <= bh; x += interval) {
    context.moveTo(p, 0.5 + x + p);
    context.lineTo(bw + p, 0.5 + x + p);
}

context.strokeStyle = "black";
context.stroke();
};

for (let i = 0; i <= bh+interval; i += interval) {
  let rowBuffer = {};
  for (let j = 0; j <= bw+interval; j += interval) {
    if (j == bw+interval) {
      rowBuffer[j/interval] = {"value": "undefined",};
    } else {
      rowBuffer[j/interval] = {"value": 0,};
    }

  }
  board[i/interval] = rowBuffer;
}
}

function drawPiece(xCoord, yCoord, lineColour) {
visited.slice(-1).forEach(function (object) {
  let xCoordCurrent = Object.keys(object)[0];
  let yCoordCurrent = Object.keys(object)[1];
  createLink(object[xCoordCurrent],object[yCoordCurrent],xCoord,yCoord, lineColour);
});
visited.push({"xCoord": xCoord, "yCoord": yCoord,});
if (doDrawCircles) {
  context.beginPath();
  context.arc(xCoord*interval-interval/2, yCoord*interval-interval/2, interval/3, 0, 2 * Math.PI);// 	context.arc(x,y,r,sAngle,eAngle,counterclockwise);
  context.strokeStyle = "#000";
  context.stroke();
}
}

function createLink(currentX, currentY, newX, newY, colour) {
context.beginPath();
context.moveTo(currentX*interval-interval/2, currentY*interval-interval/2);
context.lineTo(newX*interval-interval/2, newY*interval-interval/2);
context.strokeStyle = "hsl("+colour+", 100%, 50%)";
context.lineWidth = Math.ceil(squares / 20);
context.stroke();
}

function placeNumber(number, xCoord, yCoord) {
  if( doNumberBoard) {
    context.beginPath();
    context.font = `${interval/4}px Arial`;
    context.fillStyle = "green";
    context.textAlign = "center";
    context.fillText(number+1, xCoord*interval-interval/2, yCoord*interval-interval/2.5);
    context.stroke();
  }
};

function numberBoard() {
let tileCount = (bh/interval)*(bh/interval);
let lastTile = [];
for (let i = 0; i < (bh/interval)*(bh/interval); i++) {

  if (i<=0) {
    board[`${Math.ceil(bh/interval/2)}`][`${Math.ceil(bw/interval/2)}`].value = i+1;
    lastTile = [Math.ceil(bh/interval/2),Math.ceil(bw/interval/2)];
    placeNumber(i, Math.ceil(bh/interval/2), Math.ceil(bw/interval/2));

  } else if(i===1) {
    lastTile = [lastTile[0]+1,lastTile[1]];
    board[`${lastTile[0]}`][`${lastTile[1]}`].value = i+1;
    placeNumber(i, lastTile[0], lastTile[1]);
  } else {
    if (
      (board[`${lastTile[0]-1}`][`${lastTile[1]}`].value == 0 || board[`${lastTile[0]-1}`][`${lastTile[1]}`].value !== 0)  //left
      && board[`${lastTile[0]+1}`][`${lastTile[1]}`].value == 0  //right
      && board[`${lastTile[0]}`][`${lastTile[1]-1}`].value !== 0 //above
      && (board[`${lastTile[0]}`][`${lastTile[1]+1}`].value == 0 || board[`${lastTile[0]}`][`${lastTile[1]+1}`].value == "undefined")) { //below
        lastTile = [lastTile[0]+1,lastTile[1]];
        board[`${lastTile[0]}`][`${lastTile[1]}`].value = i+1;

    } else if(
      board[`${lastTile[0]-1}`][`${lastTile[1]}`].value !== 0 //left
      && (board[`${lastTile[0]+1}`][`${lastTile[1]}`].value == 0 || board[`${lastTile[0]+1}`][`${lastTile[1]}`].value == "undefined") //right
      && board[`${lastTile[0]}`][`${lastTile[1]-1}`].value == 0 // above
      && (board[`${lastTile[0]}`][`${lastTile[1]+1}`].value == 0 || board[`${lastTile[0]}`][`${lastTile[1]+1}`].value !== 0)) { //below
        lastTile = [lastTile[0],lastTile[1]-1];
        board[`${lastTile[0]}`][`${lastTile[1]}`].value = i+1;

    } else if(
      board[`${lastTile[0]-1}`][`${lastTile[1]}`].value == 0 //left
      && (board[`${lastTile[0]+1}`][`${lastTile[1]}`].value == 0 || board[`${lastTile[0]+1}`][`${lastTile[1]}`].value !== 0) //right
      && board[`${lastTile[0]}`][`${lastTile[1]-1}`].value == 0 // above
      && board[`${lastTile[0]}`][`${lastTile[1]+1}`].value !== 0) { //below
      lastTile = [lastTile[0]-1,lastTile[1]];
      board[`${lastTile[0]}`][`${lastTile[1]}`].value = i+1;

    } else if(
      board[`${lastTile[0]-1}`][`${lastTile[1]}`].value == 0 //left
      && board[`${lastTile[0]+1}`][`${lastTile[1]}`].value !== 0 //right
      && (board[`${lastTile[0]}`][`${lastTile[1]-1}`].value == 0 || board[`${lastTile[0]}`][`${lastTile[1]-1}`].value !== 0) // above
      && board[`${lastTile[0]}`][`${lastTile[1]+1}`].value == 0) { //below

        lastTile = [lastTile[0],lastTile[1]+1];
        board[`${lastTile[0]}`][`${lastTile[1]}`].value = i+1;


      }
      placeNumber(i, lastTile[0], lastTile[1]);
};


  }

}


colourTiles();
drawTiles();
numberBoard()
let completed = false;

let placementInterval = setInterval(preparePlacement, 1);
function stopPlacement() {
  console.log("attempted to stop placement");
  clearInterval(placementInterval);
  completed = true;
};

function preparePlacement() {

  let availableTiles = [];
  let lowestTile = 10000;
  let lineColour = (visited.length/2084)*2880;
  let stopAtEnd = false;
  let newX;
  let newY;

  if (visited.length === 0) { //If no piece put down, place at centre of board, value = 1
    newX = Math.ceil((bh/interval)/2);
    newY = Math.ceil((bw/interval)/2);
    drawPiece(newX, newY, lineColour);
  } else {
    visited.slice(-1).forEach(function (object) { //obtain most recent object keypairs for current coordinates
      let xCoordCurrent = object[Object.keys(object)[0]];
      let yCoordCurrent = object[Object.keys(object)[1]];
      if (typeof xCoordCurrent != "number" || typeof yCoordCurrent != "number") {
        console.log("invalid coords");
        stopPlacement();
      }
      //console.log(lastValue);
      for (let x = 1; x <= 2; x++) { //Iterate through 8 available moves, add to array
        if (x == 1) {
          availableTiles.push({"x": xCoordCurrent+x, "y": yCoordCurrent+2, "value": board[xCoordCurrent+x][yCoordCurrent+2].value});
          availableTiles.push({"x": xCoordCurrent+x, "y": yCoordCurrent-2, "value": board[xCoordCurrent+x][yCoordCurrent-2].value});
          availableTiles.push({"x": xCoordCurrent-x, "y": yCoordCurrent-2, "value": board[xCoordCurrent-x][yCoordCurrent-2].value});
          availableTiles.push({"x": xCoordCurrent-x, "y": yCoordCurrent+2, "value": board[xCoordCurrent-x][yCoordCurrent+2].value});
        } else if (x == 2) {
          availableTiles.push({"x": xCoordCurrent+x, "y": yCoordCurrent+1, "value": board[xCoordCurrent+x][yCoordCurrent+1].value});
          availableTiles.push({"x": xCoordCurrent+x, "y": yCoordCurrent-1, "value": board[xCoordCurrent+x][yCoordCurrent-1].value});
          availableTiles.push({"x": xCoordCurrent-x, "y": yCoordCurrent-1, "value": board[xCoordCurrent-x][yCoordCurrent-1].value});
          availableTiles.push({"x": xCoordCurrent-x, "y": yCoordCurrent+1, "value": board[xCoordCurrent-x][yCoordCurrent+1].value});
        }

      };
      availableTiles.forEach(function (object) { //iterate through array, determine lowest value, move to new coordinates
        let proceed = true;
        let lowestX = object[Object.keys(object)[0]];
        let lowestY = object[Object.keys(object)[1]];
        let value = object[Object.keys(object)[2]];
        let unavailableSquares = 0;
        for( let i = 0; i < visited.length; i++) {
          if (visited[i].xCoord == lowestX && visited[i].yCoord == lowestY) {
            proceed = false;
            //console.log(lowestX);
            //console.log(visited[i].xCoord+","+visited[i].yCoord);
            //console.log(lowestX+","+lowestY);
          };
        };
        if (value < lowestTile && lowestTile != "undefined" && proceed) { // if value is lower than current lowest, and is a number
          if (value == 2084) { /* also fails at || value == 2720 || value == 3325 || value == 3753 || value == 7776 || value == 5632 || value == 7411 || value == 8562*/
            if (noFail && value != 2720) {
              console.log(value);
            } else {
            console.log(value);
            lowestTile = value;
            }
          } else {
            lowestTile = value;
          };
        newX = lowestX;
        newY = lowestY;
      };
      });
    });
  }
  if (lowestTile == 2084) {
    console.log(newX+","+newY+":"+lowestTile);
    stopPlacement()
  };
  if (newX != "undefined" && newY != "undefined" && lowestTile != "undefined" ) {
    drawPiece(newX, newY, lineColour, lowestTile);
  }
  if (completed) {
    console.log("completed");
  };
};
};
