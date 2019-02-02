let ch = 90;
let cw = 90;
let board = {};
let canvas;
let ctx;
let numPoints = Math.ceil(Math.random()*3)
let redPoints = {};
let greenPoints = {};
let bluePoints = {};

let timeTracker = [];
/*
let redX = Math.ceil(Math.random()*ch/3)+ch*2/6;
let redY = Math.ceil(Math.random()*cw/3)+ch*2/6;
let greenX = Math.ceil(Math.random()*ch/3)+ch*2/6;
let greenY = Math.ceil(Math.random()*cw/3)+ch*2/6;
let blueX = Math.ceil(Math.random()*ch/3)+ch*2/6;
let blueY = Math.ceil(Math.random()*cw/3)+ch*2/6;*/
$(document).ready(function() {

  $("#canvas-target").html(`<canvas id="canvas" width="${cw}px" height="${ch}px" style="border: solid 1px black"></canvas>`);
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  id = ctx.getImageData(0, 0, 1, 1);
  id.data[3] = 255;
  let t0 = new Date().getTime();
  for (let i = 0; i < cw; i++) {
    board["x"+i] = {};
    for (let j = 0; j < ch; j++) {
      board["x"+i]["y"+j] = {x: i, y: j, colour: "white", delay: false,};
      /*if (i == redX && j == redX) {
        ctx.fillStyle = 'red';
        ctx.fillRect(i, j, 1, 1);
        board["x"+i]["y"+j].colour = "red";
      }
      if (i == greenX && j == greenY) {
      ctx.fillStyle = "green";
      ctx.fillRect(i, j, 1, 1);
      board["x"+i]["y"+j].colour = "green";
      }
      if (i == blueX && j == blueY) {
        ctx.fillStyle = "blue";
        ctx.fillRect(i, j, 1, 1);
        board["x"+i]["y"+j].colour = "blue";
      }*/
      /* Fastest drawing method available
      r = Math.random()*256;
      g = Math.random()*256;
      b = Math.random()*256;
      ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
      ctx.fillRect(i, j, 1, 1);
      */
      /* This lineTo method is an alternative drawing option, but is MUCH slower.
      ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
      ctx.moveTo(i,j);
      ctx.lineTo(i+1,j); // one pixel long
      ctx.stroke();
      */
      /* This putImageDate method is another alternative drawing option, but is slower.
      id.data[0] = r;
      id.data[1] = g;
      id.data[2] = b;
      ctx.putImageData(id, i, j);*/
    }
  };
  for (let i=0; i < numPoints; i++) {
    let redX = Math.ceil(Math.random()*ch/3)+ch*2/6;
    let redY = Math.ceil(Math.random()*cw/3)+ch*2/6;
    let greenX = Math.ceil(Math.random()*ch/3)+ch*2/6;
    let greenY = Math.ceil(Math.random()*cw/3)+ch*2/6;
    let blueX = Math.ceil(Math.random()*ch/3)+ch*2/6;
    let blueY = Math.ceil(Math.random()*cw/3)+ch*2/6;
    ctx.fillStyle = "red";
    ctx.fillRect(redX, redY, 1, 1);
    board["x"+redX]["y"+redY].colour = "red";
    ctx.fillStyle = "green";
    ctx.fillRect(greenX, greenX, 1, 1);
    board["x"+greenX]["y"+greenX].colour = "green";
    ctx.fillStyle = "blue";
    ctx.fillRect(blueX, blueY, 1, 1);
    board["x"+blueX]["y"+blueY].colour = "blue";
  }
  let t1 = new Date().getTime();
  displayPerfStats('Time to draw: ', (t1 - t0)/1000);
  console.log(board);
  setInterval(function() {
    t0 = new Date().getTime();
    iterateBoard();
    t1 = new Date().getTime();
    displayPerfStats('Time to draw: ', (t1 - t0)/1000);
  },250);

});

function grow(i, j, self, prey, predator) {
  ctx.fillStyle = self;
  let point = 0;
  let row = 1;
  if(board["x"+i]["y"+j].colour == self) {
    if (board[`x${i+1}`][`y${j}`].colour == self) {
      point++;
    }
    if (board[`x${i-1}`][`y${j}`].colour == self) {
      point++;
    }
    if (board[`x${i}`][`y${j+1}`].colour == self) {
      point++;
    }
    if (board[`x${i}`][`y${j-1}`].colour == self) {
      point++;
    }
    if(board[`x${i+1}`][`y${j}`].colour == self){
      row++;
    }
    if(board[`x${i-1}`][`y${j}`].colour == self){
      row++;
    }
    if(board[`x${i}`][`y${j+1}`].colour == self){
      row=1;
    }
    i++;
    if (i+1  < Object.keys(board).length && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator) {
      ctx.beginPath();
      board[["x"+i]]["y"+j].colour = self;
      board[["x"+i]]["y"+j].delay = true;
      ctx.fillRect(i, j, 1, 1);
    }
    i--;
    j++;
    if (j+1  < Object.keys(board).length && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator) {
      ctx.beginPath();
      board[["x"+i]]["y"+j].colour = self;
      board[["x"+i]]["y"+j].delay = true;
      ctx.fillRect(i, j, 1, 1);
    }
    j--;
    j--;
    if (j-1 >= 0 && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator) {
      ctx.beginPath();
      board[["x"+i]]["y"+j].colour = self;
      ctx.fillRect(i, j, 1, 1);
    }
    j++;
    i--;
    if (i-1 >= 0 && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator) {
      ctx.beginPath();
      board[["x"+i]]["y"+j].colour = self;
      ctx.fillRect(i, j, 1, 1);
    }
    i++;
    if (point <= 1) {

        i--;
        j--;
        if (i-1 >= 0 && j-1 >= 0 && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator) {
          ctx.beginPath();
          board[["x"+i]]["y"+j].colour = self;
          ctx.fillRect(i, j, 1, 1);
        }
        i++;
        j++;

        i--;
        j++;
        if (i-1 >= 0 && j+1 < Object.keys(board).length && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator) {
          ctx.beginPath();
          board[["x"+i]]["y"+j].colour = self;
          ctx.fillRect(i, j, 1, 1);
        }
        i++;
        j--;

        i++;
        j--;
        if (j-1 >= 0 && i+1 < Object.keys(board).length && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator) {
          ctx.beginPath();
          board[["x"+i]]["y"+j].colour = self;
          board[["x"+i]]["y"+j].delay = true;
          ctx.fillRect(i, j, 1, 1);
        }
        i--;
        j++;

        i++;
        j++;
        if (i+1 < Object.keys(board).length && j+1 < Object.keys(board).length && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator) {
          ctx.beginPath();
          board[["x"+i]]["y"+j].colour = self;
          board[["x"+i]]["y"+j].delay = true;
          ctx.fillRect(i, j, 1, 1);
        }
        i--;
        j--;
        /*
        i+=2;
        //j-=2;
        if (i+2 < Object.keys(board).length && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator && board[[`x${i+1}`]][`y${j}`].colour != self) {
          ctx.beginPath();
          board[["x"+i]]["y"+j].colour = self;
          board[["x"+i]]["y"+j].delay = true;
          ctx.fillRect(i, j, 1, 1);
        }
        i-=2;
        //+=2;*/

      }
      i+=2;
      j+=1;
      if (i+2 < Object.keys(board).length && j+1 < Object.keys(board).length && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator && row >=3) {
        ctx.beginPath();
        board[["x"+i]]["y"+j].colour = self;
        board[["x"+i]]["y"+j].delay = true;
        ctx.fillRect(i, j, 1, 1);
        console.log("row")
      }
      i-=2;
      j-=1;
      i-=2;
      j+=1;
      if (i-2 >= 0 && j+1 < Object.keys(board).length && board[["x"+i]]["y"+j].colour != self && board[["x"+i]]["y"+j].colour != predator && row >=3) {
        ctx.beginPath();
        board[["x"+i]]["y"+j].colour = self;
        board[["x"+i]]["y"+j].delay = true;
        ctx.fillRect(i, j, 1, 1);
        console.log("row")
      }
      i+=2;
      j-=1;
  }
  }

function iterateBoard() {
  for (let i = 0; i < Object.keys(board).length; i++) {
    for (let j = 0; j < Object.keys(board["x"+i]).length; j++) {
      //if (board[["x"+i]]["y"+j].delay == true) {
      //  board[["x"+i]]["y"+j].delay = false;
      //} else {
      if (board[["x"+i]]["y"+j].delay == true) {
        board[["x"+i]]["y"+j].delay = false;
      } else {
        grow(i, j, "red", "prey", "green");
        grow(i, j, "green", "red", "blue");
        grow(i, j, "blue", "green", "red");

}
}
console.log("done");
}
}


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
