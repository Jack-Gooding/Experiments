let ch = 150;
let cw = 150;
let hueInterval = 50;
let highCount = 0;
let board = {};
let timeTracker = [];
let canvas;
let ctx;
$(document).ready(function() {
  $("#canvas-target").html(`<canvas id="canvas" width="${cw}px" height="${ch}px" style="border: solid 1px black"></canvas>`);
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  id = ctx.getImageData(0, 0, 1, 1);

  for (let i = 0; i < cw; i++) { //create board object
    board["x"+i] = {};
    for (let j = 0; j < cw; j++) {
      board["x"+i]["y"+j] = {x: i, y: j, count: 0, avalanches: 0,};
    }
  }

  $("#canvas").click(function(e){
      var xMouse = e.pageX - this.offsetLeft;
      var yMouse = e.pageY - this.offsetTop;
      console.log(xMouse+","+yMouse+","+board["x"+xMouse]["y"+yMouse].count);
      $("#onMouse").html(xMouse+","+yMouse+","+board["x"+xMouse]["y"+yMouse].count+","+board["x"+xMouse]["y"+yMouse].avalanches+","+Math.log(board["x"+xMouse]["y"+yMouse].avalanches+1));
  });


  let placementInterval = setInterval(preparePlacement, 50); //place sand every 50ms
});

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

function displayCountStats(lowestCount, highestCount) {
  $("#count-stats").html("Highest: "+highestCount+"  Lowest: "+lowestCount+"  hueInterval: "+hueInterval);
};


function stopPlacement() {
  console.log("attempted to stop placement");
  clearInterval(placementInterval); //stop placing sand
  completed = true;
};

function iterateCascade(x, y) {
  let xy = board[`x${x}`][`y${y}`].count;
  //Get counts for x+-, y+-
  let xPlus =  x+1 < cw ? board[`x${x+1}`][`y${y}`].count : 0;
  let yPlus =  y+1 < ch ? board[`x${x}`][`y${y+1}`].count : 0;
  let xMinus =  x-1 >= 0 ? board[`x${x-1}`][`y${y}`].count : 0;
  let yMinus =  y-1 >= 0 ? board[`x${x}`][`y${y-1}`].count : 0;

  let xyPlusPlus = x+1 < cw && y+1 < ch ? board[`x${x+1}`][`y${y+1}`].count : 0;
  let xyPlusMinus = x+1 < cw &&  y-1 >= 0 ? board[`x${x+1}`][`y${y-1}`].count : 0;
  let xyMinusPlus = x-1 >= 0 && y+1 < ch ? board[`x${x-1}`][`y${y+1}`].count : 0;
  let xyMinusMinus = x-1 >= 0 && y-1 >= 0 ? board[`x${x-1}`][`y${y-1}`].count : 0;

  if (xy > Math.floor((xPlus + yPlus + xMinus + yMinus + xyPlusPlus + xyPlusMinus + xyMinusPlus + xyMinusMinus)/8)) { //If current location is >4 sand taller than neighbours combined
    board[`x${x}`][`y${y}`].avalanches++;
    //console.log("spread out");
    let direction = Math.random()*2.2; //Approximation of how often the sand will fall in a cardinal direction instead of sub-cardinal. Increase the number for a more diamond like shape.
    if (direction > 1) {
    if (xPlus+1 < xy) { //if pile is 2 taller than right neighbour
      if (x+1 < cw) {
        board[`x${x+1}`][`y${y}`].count++;
        iterateCascade(x+1, y);
      }
      board[`x${x}`][`y${y}`].count--;
    }
    if (yPlus+1 < xy) { //if pile is 2 taller than lower neighbour
      if (y+1 < ch) {
        board[`x${x}`][`y${y+1}`].count++;
        iterateCascade(x, y+1);
      }
      board[`x${x}`][`y${y}`].count--;
    }
    if (xMinus+1 < xy) {  //if pile is 2 taller than left neighbour
      if (x-1 >= 0) {
        board[`x${x-1}`][`y${y}`].count++;
        iterateCascade(x-1, y);
      }
      board[`x${x}`][`y${y}`].count--;
    }
    if (yMinus+1 < xy) {  //if pile is 2 taller than upper neighbour
      if (y-1 >= 0) {
        board[`x${x}`][`y${y-1}`].count++;
        iterateCascade(x, y-1);
      }
      board[`x${x}`][`y${y}`].count--;
    }
  } else {
    if (xyPlusPlus+1 < xy) { //if pile is 2 taller than right neighbour
      if (x+1 < cw && y+1 < ch) {
        board[`x${x+1}`][`y${y+1}`].count++;
        iterateCascade(x+1, y+1);
      }
      board[`x${x}`][`y${y}`].count--;
    }
    if (xyPlusMinus+1 < xy) { //if pile is 2 taller than lower neighbour
      if (x+1 < cw && y-1 >= 0) {
        board[`x${x+1}`][`y${y-1}`].count++;
        iterateCascade(x+1, y-1);
      }
      board[`x${x}`][`y${y}`].count--;
    }
    if (xyMinusPlus+1 < xy) {  //if pile is 2 taller than left neighbour
      if (x-1 >= 0 && y+1 < ch) {
        board[`x${x-1}`][`y${y+1}`].count++;
        iterateCascade(x-1, y+1);
      }
      board[`x${x}`][`y${y}`].count--;
    }
    if (xyMinusMinus+1 < xy) {  //if pile is 2 taller than upper neighbour
      if (x-1 >= 0 && y-1 >= 0) {
        board[`x${x-1}`][`y${y-1}`].count++;
        iterateCascade(x-1, y-1);
      }
      board[`x${x}`][`y${y}`].count--;
    }
  }
  }
  renderPixel(x,y); //Draw pixel once position is certain
};

/*function iterateCascade(x, y) {
  if (x+1 < ch) {
    if (board[`x${x}`][`y${y}`].count -2 > board[`x${x+1}`][`y${y}`].count) {
      board[`x${x+1}`][`y${y}`].count++;
      board[`x${x}`][`y${y}`].count--;
      //console.log("shifted right");
      hue = 120-board[`x${x}`][`y${y}`].count*25;
      ctx.fillStyle = "hsl("+hue+", 99%, 50%)";
      ctx.fillRect(x+1, y, 1, 1);
      iterateCascade(x+1, y);
    }
  }
  if (y+1 < cw) {
    if (board[`x${x}`][`y${y}`].count -2 > board[`x${x}`][`y${y+1}`].count) {
      board[`x${x}`][`y${y+1}`].count++;
      board[`x${x}`][`y${y}`].count--;
      //console.log("shifted down");
      hue = 120-board[`x${x}`][`y${y}`].count*25;
      ctx.fillStyle = "hsl("+hue+", 99%, 50%)";
      ctx.fillRect(x, y+1, 1, 1);
      iterateCascade(x, y+1);
    }
  }
  if (x-1 >= 0) {
    if (board[`x${x}`][`y${y}`].count -2 > board[`x${x-1}`][`y${y}`].count) {
      board[`x${x-1}`][`y${y}`].count++;
      board[`x${x}`][`y${y}`].count--;
      //console.log("shifted left");
      hue = 120-board[`x${x}`][`y${y}`].count*25;
      ctx.fillStyle = "hsl("+hue+", 99%, 50%)";
      ctx.fillRect(x-1, y, 1, 1);
      iterateCascade(x-1, y);
    }
  }
  if (y-1 >= 0) {
    if (board[`x${x}`][`y${y}`].count -2 > board[`x${x}`][`y${y-1}`].count) {
      board[`x${x}`][`y${y-1}`].count++;
      board[`x${x}`][`y${y}`].count--;
      //console.log("shifted up");
      hue = 120-board[`x${x}`][`y${y}`].count*25;
      ctx.fillStyle = "hsl("+hue+", 99%, 50%)";
      ctx.fillRect(x, y-1, 1, 1);
      iterateCascade(x, y-1);

    }
  }
};*/


function renderPixel(x, y) {

/*
  //blueEffect
  if (board[`x${x}`][`y${y}`].count > highCount) {
    highCount = board[`x${x}`][`y${y}`].count;
  }
  let base = 130-(Math.abs(cw/2-x)+Math.abs(ch/2-y))/50;
  let hue = 130-board[`x${x}`][`y${y}`].count/highCount;
  ctx.fillStyle = "hsl("+hue+Math.random()*5+", 99%, 40%)";

*/

let base = 130-(Math.abs(cw/2-x)+Math.abs(ch/2-y))/50;
let hue = 120+Math.log(board[`x${x}`][`y${y}`].avalanches+1)*25;
ctx.fillStyle = "hsl("+hue+", 99%, 40%)";


/*
//Concentric Circles
if (board[`x${x}`][`y${y}`].count > highCount) {
  highCount = board[`x${x}`][`y${y}`].count;
}
let base = (Math.abs(cw/2-x)+Math.abs(ch/2-y))/2;
let hue = base-15*board[`x${x}`][`y${y}`].count;
ctx.fillStyle = "hsl("+hue+Math.random()*5+", 99%, 40%)";
*/
  ctx.fillRect(x, y, 1, 1);
}

function preparePlacement() {
  t0 = new Date().getTime(); //start timer

  let lowestCount = 100000;
  let highestCount = 0;
  let currentCount;
  let hue = 120; //Hue is used for colouring pixels. based on HSL, 120 = green.

  for (let i = 0; i < (ch*cw)/100; i++) { //place a new grain of sand on a ~11% of the board every interval

  //Do this for random placement all over the board
  //let x = Math.floor(Math.random()*cw);
  //let y = Math.floor(Math.random()*ch);

  //Do this for placement around 4 points, raise the integer for closer to centre
  //let x = Math.floor(cw/2 + (Math.round(Math.random()) ? (cw/8 + Math.random()*cw/20) : -(ch/8 +Math.random()*cw/20)));
  //let y = Math.floor(ch/2 + (Math.round(Math.random()) ? (ch/8 + Math.random()*ch/20) : -(ch/8 +Math.random()*ch/20)));

  //Do this for placement at centre of Board
  let x = Math.floor(cw/2);
  let y = Math.floor(ch/2);
  board[`x${x}`][`y${y}`].count++; //increase count for that location in board object
  /*
  if (x+1 < ch) {
    if (board[`x${x}`][`y${y}`].count -2 > board[`x${x+1}`][`y${y}`].count) {
      board[`x${x+1}`][`y${y}`].count++;
      board[`x${x}`][`y${y}`].count--;
      //console.log("shifted right");
      hue = hue-board[`x${x}`][`y${y}`].count*25;
      ctx.fillStyle = "hsl("+hue+", 99%, 50%)";
      ctx.fillRect(x+1, y, 1, 1);
    }
  }
  if (y+1 < cw) {
    if (board[`x${x}`][`y${y}`].count -2 > board[`x${x}`][`y${y+1}`].count) {
      board[`x${x}`][`y${y+1}`].count++;
      board[`x${x}`][`y${y}`].count--;
      //console.log("shifted down");
      hue = hue-board[`x${x}`][`y${y}`].count*25;
      ctx.fillStyle = "hsl("+hue+", 99%, 50%)";
      ctx.fillRect(x, y+1, 1, 1);
    }
  }
  if (x-1 >= 0) {
    if (board[`x${x}`][`y${y}`].count -2 > board[`x${x-1}`][`y${y}`].count) {
      board[`x${x-1}`][`y${y}`].count++;
      board[`x${x}`][`y${y}`].count--;
      //console.log("shifted left");
      hue = hue-board[`x${x}`][`y${y}`].count*25;
      ctx.fillStyle = "hsl("+hue+", 99%, 50%)";
      ctx.fillRect(x-1, y, 1, 1);
    }
  }
  if (y-1 >= 0) {
    if (board[`x${x}`][`y${y}`].count -2 > board[`x${x}`][`y${y-1}`].count) {
      board[`x${x}`][`y${y-1}`].count++;
      board[`x${x}`][`y${y}`].count--;
      //console.log("shifted up");
      hue = hue-board[`x${x}`][`y${y}`].count*25;
      ctx.fillStyle = "hsl("+hue+", 99%, 50%)";
      ctx.fillRect(x, y-1, 1, 1);
    }
  }*/
  iterateCascade(x, y);
  //console.log(board[`x${x}`][`y${y}`]);
  //updates fps counter

};
/*
  for (let i = 0; i < cw; i++) {
    for (let j = 0; j < ch; j++) {
      currentCount = board[`x${i}`][`y${j}`].count;
      if (currentCount > highestCount) {
        highestCount = currentCount;
      }
      if (currentCount < lowestCount) {
        lowestCount = currentCount;
      }
      //hueInterval = 140/(highestCount - lowestCount);
    }
  }
*/
  t1 = new Date().getTime();
  displayPerfStats('Time to draw: ', (t1 - t0)/1000);
  displayCountStats(lowestCount, highestCount);

}
