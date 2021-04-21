let myCanvas;
let fps = 30;
let scaler = 1;
let gifLength = 10;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;


let numRows = 240;
let numCols = 240;
let sizeSquares = 4;

let numParticles = 300;

let borderSize = 2;

let cWidth = (numRows * sizeSquares + borderSize) * scaler;
let cHeight = (numCols * sizeSquares + borderSize) * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let noise; //OpenSimplexNoise overwrites Perlin Noise
let noiseScale = 0.006;

let flowfields = [];
let particles = [];

let noises = [];
let crosshatch;

class Particle {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.lastx;
    this.lasty;
    this.vel = [-sizeSquares/2+Math.random()*sizeSquares,-sizeSquares/2+Math.random()*sizeSquares];
    this.acc = [0,0];
    this.maxVel = 5;
    this.hue = Math.random()*360;
  };

  update = () => {
    let force = flowfields[0].locate(this.x, this.y);

    let xDir = sizeSquares/2*Math.sin(force*TWO_PI*2);
    let yDir = sizeSquares/2*Math.cos(force*TWO_PI*2);

    this.lastx = this.x;
    this.lasty = this.y;

    let timeFactor = Math.pow(elapsedFrames/totalFrames,1.6);

    this.vel[0] += xDir*0.1+xDir*0.9*(Math.pow(timeFactor,8));
    this.vel[1] += yDir*0.1+yDir*0.9*(Math.pow(timeFactor,8));
    // this.vel[0] = this.vel[0]*(.95/(1-Math.pow(timeFactor,4)));
    // this.vel[1] = this.vel[1]*(.95/(1-Math.pow(timeFactor,4)));
    this.vel[0] = this.vel[0]*(0.9+(Math.pow(timeFactor,16)));
    this.vel[1] = this.vel[1]*(0.9+(Math.pow(timeFactor,16)));

    this.x += this.vel[0];
    this.y += this.vel[1];
  };

  show = () => {
    push();
    let relVel = 1 + Math.pow(Math.abs(this.vel[0]),1.1) + Math.pow(Math.abs(this.vel[1]),1.1);
    strokeWeight(borderSize*relVel/4);
    stroke(color(this.hue,100,100));
    line(this.x, this.y, this.lastx, this.lasty);
    pop();
  }
}

class Flowfield {
  constructor(noise, i) {
    this.noise = noise;
    this.i = i;
    this.rows = [];
    this.sizeSquares = sizeSquares;
    this.numRows = numRows;
    this.numCols = numCols;
  };

  generateStructure = () => {
    for (let x = 0; x < numRows; x++) {
      let row = [];
      for (let y = 0; y < numCols; y++) {
        row.push(null);
      }
      this.rows.push(row);
    };
  };



  generatePattern = () => {
    if (this.rows.length <= 1) {
      this.generateStructure();
    }

    for (let x = 0; x < this.rows.length; x++) {
      for (let y = 0; y < this.rows[x].length; y++) {
        let noiseVal = this.noise.noise2D(x*sizeSquares*noiseScale,y*sizeSquares*noiseScale);
        this.rows[x][y] = noiseVal;
      };
    };
  };



  locate = (x, y) => {
    let row = Math.floor(x / this.sizeSquares);
    let col = Math.floor(y / this.sizeSquares);
    if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
      push();
        strokeWeight(1)
        fill("green");
        //square(row*sizeSquares+borderSize/2,col*sizeSquares+borderSize/2,sizeSquares,sizeSquares);
        let noiseVal = this.rows[row][col];
        //let xDir = x + sizeSquares/1.2*Math.sin(noiseVal*TWO_PI);
        //let yDir = y + sizeSquares/1.2*Math.cos(noiseVal*TWO_PI);

        // stroke("blue");
        // line(x,y,xDir,yDir);
        // stroke("green");
        // point(xDir, yDir);

      pop();

      return(noiseVal);
    }
  };

  showNoise = () => {

    for (let x = 0; x < cWidth; x++) {
      for (let y = 0; y < cHeight; y++) {
        let noiseVal = this.noise.noise2D(x*noiseScale,y*noiseScale);

        let hue = map(noiseVal, -1, 1, 0, 360);

        stroke(hue, 20, 100);
        point(x,y);
      };
    };

  };

  showGrid = () => {
    stroke(0);
    strokeWeight(borderSize);


    //shows grid
    push();
    // noStroke();
    strokeWeight(borderSize);
    for (let x = borderSize/2; x < cWidth; x += sizeSquares) {
      for (let y = borderSize/2; y < cHeight; y += sizeSquares) {

        //let noiseVal = this.rows[x][y];
        let noiseVal = this.noise.noise2D(x*noiseScale,y*noiseScale);
        let colour = map(noiseVal, -1, 1, 0, 100);
        fill(colour);
        square(x,y,sizeSquares,sizeSquares);
      };
    };
    pop();

    // shows force lines
    for (let x = borderSize/2 + sizeSquares/2; x < cWidth; x += sizeSquares) {
      for (let y = borderSize/2 + sizeSquares/2; y < cHeight; y += sizeSquares) {
        let noiseVal = this.noise.noise2D(x*noiseScale,y*noiseScale);

        let xDir = x + sizeSquares/2*Math.sin(noiseVal*TWO_PI);
        let yDir = y + sizeSquares/2*Math.cos(noiseVal*TWO_PI);

        point(x,y);
        stroke("red");
        line(x,y,xDir,yDir);
        stroke("green");
        point(xDir, yDir);
      };
    };


  };

  show = () => {
    this.rows.forEach((row, x) => {
      row.forEach((val, y) => {
        if (val != null && x % 20 === 0 && y % 20 === 0) {

          let xDir = 10*Math.sin(val*TWO_PI);
          let yDir = 10*Math.cos(val*TWO_PI);


          push();
          translate(x,y);
          strokeWeight(2);
          stroke("blue");
          point(0,0);
          strokeWeight(1);
          stroke("red");
          line(0, 0, xDir,yDir);
          pop();

        };
      });
    });
  };
}

let checkGrid = (arr, i, j) => {

  let xDir = 0;
  let yDir = 0;

  if (arr[x-1]) {
      if (arr[x-1][y-1]) {

      }
      if (arr[x-1][y+1]) {

      }
      if (arr[x-1][y]) {
        xDir += sizeMod*(2-Math.abs(arr[x-1][y] - nVal))*1;
      }
  }
  if (arr[x+1]) {
      if (arr[x+1][y-1]) {

      }
      if (arr[x+1][y+1]) {

      }
      if (arr[x+1][y]) {
        xDir += sizeMod*(2-Math.abs(arr[x+1][y] - nVal))*-1;
      }
  }
  if (arr[x][y-1]) {
    yDir += sizeMod*(2-Math.abs(arr[x][y-1] - nVal))*1;
  }
  if (arr[x][y+1]) {
    yDir += sizeMod*(2-Math.abs(arr[x][y+1] - nVal))*-1;
  }
};

function setup() {

  $("#canvas-target").html("");
  myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");

  currentTime = `${hour()}:${minute()}`
  background(255);

  frameRate(fps);
  smooth();
  stroke(120);
  strokeWeight(1);
  angleMode(DEGREES);
  noFill();
  noiseDetail(8, 0.3);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < 1; i++) {
    let noise = new OpenSimplexNoise(Math.floor(Math.random()*5000));
    let flowfield = new Flowfield(noise, i);
    flowfields.push(flowfield);
  };

  for (let i = 0; i < numParticles; i++) {
    let particle = new Particle(Math.random()*cWidth, Math.random()*cHeight);
    particles.push(particle);
  }

  $("#frame-counter").text(`Frame Count: 0/${totalFrames}`);

  flowfields.forEach((flowfield) => {
    flowfield.generatePattern();
    // flowfield.show();
    flowfield.showNoise();
    // flowfield.showGrid();
    // flowfield.locate(mouseX, mouseY);
  });

  createLoop({duration:gifLength, gif:true});
}

let render = () => {
  flowfields.forEach((flowfield) => {
    // flowfield.generatePattern();
    // flowfield.show();
    flowfield.showGrid();
    //flowfield.locate(mouseX, mouseY);
  });

  particles.forEach(particle => {
    particle.update();
    particle.show();
  });
};

function draw() {
  // background("#8ab2cc");
  // background(60);

  if (elapsedFrames >= totalFrames) {

  } else if (elapsedFrames === 0) { //first frame
    // saveCanvas(`Background - ${currentTime} - ${elapsedFrames}`, 'jpg');
    render();
  } else { //gif frames
    render();
    $("#frame-counter").text(`Frame Count: ${elapsedFrames+1}/${totalFrames}`);
    console.log(`Frame ${elapsedFrames}\\${totalFrames}`);
  };

  elapsedFrames++;
}
