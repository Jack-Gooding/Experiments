let sWidth = 128;
let sHeight = 128;

let canvas;

let grid = [];
let nextGrid = [];

let loopFrame = 10;


//DiffusionRates
let dA = 1;
let dB = .5;
//Feed rate of A in
let feedRate = 0.055;

//Kill rate of B out
let killRate = 0.063;

let timeScale = 1;

let bColour = "#297ca6";
let aColour = "#E5CB90";

function setup() {
  let p5canvas = createCanvas(sWidth,sHeight);
  canvas = p5canvas.canvas;

  for (let y = 0; y < sHeight; y++) {
    grid.push([]);
    nextGrid.push([]);

    for (let x = 0; x < sWidth; x++) {
      let a = 1;
      let b = 0;
      grid[y].push([a,b]);
      nextGrid[y].push([a,b]);

//      let col = lerpColor(aColour,bColour,(a/(a+b)));
      let col = 255*((a+b)/2);
      stroke(col);
      fill(col);
      rect(x,y,1,1);
    }
  }
 for (let k = 0; k < sWidth/4; k++) {
    x = Math.floor(Math.random()*(grid.length-2));
    y = Math.floor(Math.random()*(grid.length-2));
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      grid[Math.floor(x)+i][Math.floor(y)+j] = [0,1];
      nextGrid[Math.floor(x)+i][Math.floor(y)+j] = [0,1];
    }
  }
}


//capturer.start();
}

function swapGrids() {
  let temp = nextGrid;
  grid = nextGrid;
  nextGrid = temp;
}

function draw() {

  for (let y = 0; y < sHeight; y++) {

    for (let x = 0; x < sWidth; x++) {
      //c = convolution
      let cA = -grid[y][x][0];
      let cB = -grid[y][x][1];

      let cScale = 0.2;
      if (grid[y-1]) {
        cA += grid[y-1][x][0]*cScale;
        cB += grid[y-1][x][1]*cScale;
      } else {
        cA += grid[y][x][0]*cScale;
        cB += grid[y][x][1]*cScale;
      }
      if (grid[y][x-1]) {
        cA += grid[y][x-1][0]*cScale;
        cB += grid[y][x-1][1]*cScale;
      } else {
        cA += grid[y][x][0]*cScale;
        cB += grid[y][x][1]*cScale;
      }
      if (grid[y+1] && grid[y+1][x]) {
        cA += grid[y+1][x][0]*cScale;
        cB += grid[y+1][x][1]*cScale;
      } else {
        cA += grid[y][x][0]*cScale;
        cB += grid[y][x][1]*cScale;
      }
      if (grid[y][x+1]) {
        cA += grid[y][x+1][0]*cScale;
        cB += grid[y][x+1][1]*cScale;
      } else {
        cA += grid[y][x][0]*cScale;
        cB += grid[y][x][1]*cScale;
      }

      cScale = 0.05;
      if (grid[y-1] && grid[y][x-1]) {
        cA += grid[y-1][x-1][0]*cScale;
        cB += grid[y-1][x-1][1]*cScale;
      } else {
        cA += grid[y][x][0]*cScale;
        cB += grid[y][x][1]*cScale;
      }
      if (grid[y-1] && grid[y][x+1]) {
        cA += grid[y-1][x+1][0]*cScale;
        cB += grid[y-1][x+1][1]*cScale;
      } else {
        cA += grid[y][x][0]*cScale;
        cB += grid[y][x][1]*cScale;
      }
      if (grid[y+1] && grid[y+1][x-1]) {
        cA += grid[y+1][x-1][0]*cScale;
        cB += grid[y+1][x-1][1]*cScale;
      } else {
        cA += grid[y][x][0]*cScale;
        cB += grid[y][x][1]*cScale;
      }
      if (grid[y+1] && grid[y+1][x+1]) {
        cA += grid[y+1][x+1][0]*cScale;
        cB += grid[y+1][x+1][1]*cScale;
      } else {
        cA += grid[y][x][0]*cScale;
        cB += grid[y][x][1]*cScale;
      }

      let oldA = grid[y][x][0];
      let oldB = grid[y][x][1];

      let newA = oldA + (dA * cA - oldA*oldB*oldB + feedRate*(1-oldA))*timeScale;
      let newB = oldB + (dB * cB + oldA*oldB*oldB - (killRate + feedRate)*oldB)*timeScale;

      nextGrid[y][x] = [newA,newB];
    }
  }

  //console.log(nextGrid);
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (nextGrid[y][x]) {
        let valM = nextGrid[y][x][1]/nextGrid[y][x][0];
        let valC = constrain(valM,0,1);
        let col = lerpColor(color(aColour),color(bColour),valC)
        //let col = map(nextGrid[y][x][1], 0, 1, 255, 0);

        stroke(col);
        fill(col);
        rect(x,y,1,1);
      }
    }
  }

  swapGrids();
  console.log("Frame");
/*
  if (frameCount < loopFrame) {
            capturer.capture(canvas);
          } else if (frameCount === loopFrame) {
            capturer.stop();
            capturer.save();
          }
*/
}

function mouseClicked() {
  console.log(grid[mouseY][mouseX]);
}
