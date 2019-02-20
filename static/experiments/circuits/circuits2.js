let tileCount; //number of tiles per row / column
let grid = 2;

let ch;
let cw;
let tileSize;

//let tileSize = Math.ceil(cw/tileCount); //width of tile in px
//ch = ch - ch % (tileSize+grid); //fixing the width of the board to a mutltiple of the number of tiles.
//cw = cw  - cw % (tileSize+grid); //fixing the width of the board to a mutltiple of the number of tiles.

let board = {}; //board object. Stores all tile info.

let timeTracker = []; //stores performance stats. Kept at 10 long, updated every animation.

let canvas;
let ctx;

let animationInterval;


$(document).ready(function() {
  ch = $("canvas").width();
  cw = $("canvas").width();
  tileCount = ch/15;
  tileSize = Math.ceil(cw/tileCount); //width of tile in px

  ch = ch - ch % (tileSize+grid); //fixing the width of the board to a mutltiple of the number of tiles.

  cw = cw  - cw % (tileSize+grid); //fixing the width of the board to a mutltiple of the number of tiles.

  $("#canvas-target").html(`<canvas id="canvas" width="${cw}px" height="${ch}px" style="border: solid 2px black"></canvas>`);

  canvas = $("#canvas")[0];
  ctx = canvas.getContext("2d");
  id = ctx.getImageData(0, 0, 1, 1);

  //Creating board object and assigning initial values.
  for (let i = 0; i < tileCount; i++) {
    board["x"+i] = {};
    for (let j = 0; j < tileCount; j++) {
      board["x"+i]["y"+j] = {x: i, y: j, alive: false, aliveNext: false,};
    }
  }


  //Creating board grid.
  ctx.lineWidth = grid;
  for (let x = 0; x < tileCount; x++) { //drawing rows
      ctx.moveTo(x*(tileSize+grid), 0);
      ctx.lineTo(x*(tileSize+grid), cw);
  }

  for (let y = 0; y < tileCount; y++) { //drawing columns
      ctx.moveTo(0, y*(tileSize+grid));
      ctx.lineTo(ch, y*(tileSize+grid));
  }
  ctx.strokeStyle = "black";
  ctx.stroke();

  //Converts mouse clicks on canvas into x,y tile location, changes !board[x][y].xy
  $("#canvas").click(function(e){
      let xMouse = e.pageX - this.offsetLeft-grid;
      let yMouse = e.pageY - this.offsetTop-grid;
      let xTile = Math.floor(xMouse/(tileSize+grid));
      let yTile = Math.floor(yMouse/(tileSize+grid));

      board[`x${xTile}`][`y${yTile}`].alive = !board[`x${xTile}`][`y${yTile}`].alive;
      board[`x${xTile}`][`y${yTile}`].aliveNext = board[`x${xTile}`][`y${yTile}`].alive;
      console.log(xTile +","+ yTile);
      drawCell(xTile,yTile);
  });

  $('#animation-toggle').bootstrapToggle('off'); //Setting initial value for toggle switch.
  $('#animation-toggle').change(function() {
    if ($(this).prop('checked')) {
      animationInterval = setInterval(prepareAnimation, 100);
    } else {
      clearInterval(animationInterval);
    }
  })

});


function drawCell(xTile, yTile) {
  ctx.fillStyle = board[`x${xTile}`][`y${yTile}`].alive ? "#f4A460" : "#616161";
  ctx.fillRect(xTile*tileSize+grid*xTile+1, yTile*tileSize+grid*yTile+1, tileSize , tileSize );
};

function nextAnimation() {
  $('#animation-toggle').bootstrapToggle('off');
  prepareAnimation();
}

function clearBoard() {
  $('#animation-toggle').bootstrapToggle('off');
  for (let i = 0; i < tileCount; i++) { //create board object
    for (let j = 0; j < tileCount; j++) {
      board[`x${i}`][`y${j}`].alive = false;
      drawCell(i,j);
    }
  }
}

function prepareAnimation() {
  t0 = new Date().getTime(); //start timer

  for (let i = 0; i < tileCount; i++) { //for <all objects in board>
    for (let j = 0; j < tileCount; j++) { //for <all objects in board[i]>
      let neighbours = 0;

      if (i*tileSize+tileSize < ch) { //if board on an edge, do not check for a neighbour over the edge
        if (board[`x${i+1}`]["y"+j].alive) {  neighbours++; } //if neighbour tile is alive, ++neighbour var
      }
      if (j*tileSize+tileSize < cw) {
        if (board["x"+i][`y${j+1}`].alive) {  neighbours++; } //if neighbour tile is alive, ++neighbour var
      }
      if (i*tileSize-tileSize >= 0) {
        if (board[`x${i-1}`]["y"+j].alive) {  neighbours++; } //if neighbour tile is alive, ++neighbour var
      }
      if (j*tileSize-tileSize >= 0) {
        if (board["x"+i][`y${j-1}`].alive) {  neighbours++; } //if neighbour tile is alive, ++neighbour var
      }

      if (i*tileSize+tileSize < ch && j*tileSize+tileSize < cw) {
        if (board[`x${i+1}`][`y${j+1}`].alive) {  neighbours++; } //if neighbour tile is alive, ++neighbour var
      }
      if (i*tileSize+tileSize < ch && j*tileSize-tileSize >= 0) {
        if (board[`x${i+1}`][`y${j-1}`].alive) {  neighbours++; } //if neighbour tile is alive, ++neighbour var
      }
      if (i*tileSize-tileSize >= 0 && j*tileSize+tileSize < cw) {
        if (board[`x${i-1}`][`y${j+1}`].alive) {  neighbours++; } //if neighbour tile is alive, ++neighbour var
      }
      if (i*tileSize-tileSize >= 0 && j*tileSize-tileSize >= 0) {
        if (board[`x${i-1}`][`y${j-1}`].alive) {  neighbours++; } //if neighbour tile is alive, ++neighbour var
      }

      if (neighbours === 3) {
        board[`x${i}`][`y${j}`].aliveNext = true; //make changes once entire board has been assessed
      }

      if (neighbours>=4) {
        board[`x${i}`][`y${j}`].aliveNext = false;//make changes once entire board has been assessed
      }

      if (neighbours <= 1) {
        board[`x${i}`][`y${j}`].aliveNext = false;//make changes once entire board has been assessed
      }

    }
  }

  for (let i = 0; i < tileCount; i++) {
    for (let j = 0; j < tileCount; j++) {
      board[`x${i}`][`y${j}`].alive = board[`x${i}`][`y${j}`].aliveNext;
      drawCell(i,j);
  }
}

  t1 = new Date().getTime();
  displayPerfStats('Time to draw: ', (t1 - t0)/1000);
};

function displayPerfStats(outText,outValue) {
  timeTracker.push(outValue);

  let average = 0 ;
  timeTracker.slice(-50);
  timeTracker.forEach(function(time) {
    average += time;
  })
  average = average/timeTracker.length;
  $("#perf-stats").html(outText + Math.round((average)*1000)/1000 + " seconds, " +Math.round((1/average)*10)/10+"fps.");
};
