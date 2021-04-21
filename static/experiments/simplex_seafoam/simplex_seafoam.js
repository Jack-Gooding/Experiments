let myCanvas;
let fps = 24;
let scaler = 1;
let gifLength = 2;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

// let cWidth = 800 * scaler;
// let cHeight = 1200 * scaler;

let cWidth = 730 * scaler;
let cHeight = 730 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let noise; //OpenSimplexNoise overwrites Perlin Noise
let noiseScale = 0.02;

let foamPatterns = [];

let noises = [];
let crosshatch;

class Crosshatch {
  constructor() {
    this.distance = 5;
    this.lines = [];
  };

  drawLines = () => {
    push();
    for (let y = 0; y < cHeight*2.1; y+=this.distance) {
      angleMode(DEGREES)
      let x = -2;
      let vx = -2 + cos(-45)*maxSize;
      let vy = y + sin(-45)*maxSize;

      this.lines.push([createVector(x,y), createVector(vx, vy)]);
    }
    pop();
  };

  show = () => {
    push();
    stroke(color("#8ab2cc"));
    strokeWeight(2);
    this.lines.forEach((l) => {
      line(l[0].x,l[0].y,l[1].x,l[1].y);
    });
    pop();
  };
};

class Seafoam {
  constructor(noise, i) {
    this.noise = noise;
    this.i = i;
    this.rows = [];
  };

  generateStructure = () => {
    for (let x = 0; x < cHeight; x++) {
      let row = [];
      for (let y = 0; y < cWidth; y++) {
        row.push(null);
      }
      this.rows.push(row);
    };
  };

  generatePattern = () => {
    if (this.rows.length <= 1) {
      this.generateStructure();
    }
    let theta = map(elapsedFrames,0,totalFrames,0,360);
    let uoff = cos(theta)*maxSize * gifLength/fps * gifLength/fps;
    let voff = sin(theta)*maxSize * gifLength/fps * gifLength/fps;

    let mult = maxSize * gifLength/fps * gifLength/fps * 10;

    for (let x = 0; x < this.rows.length; x++) {
      let row = [];

      let xDeg = map(x,0,cWidth-1,0,360);
      let a = sin(xDeg)*mult+uoff;
      let b = cos(xDeg)*mult+uoff;
      // circular motion + adjustment
      // let a = sin(xDeg-uoff)*mult+uoff;
      // let b = cos(xDeg-uoff)*mult+uoff;

      for (let y = 0; y < this.rows[x].length; y++) {
        // noiseVal = map(noiseVal, -1, 1, 0, 255);
        let yDeg = map(y,0,cHeight-1,0,360);
        let c = sin(yDeg)*mult+voff;
        let d = cos(yDeg)*mult+voff;
        // circular motion + adjustment
        // let c = sin(yDeg-voff)*mult+voff;
        // let d = cos(yDeg-voff)*mult+voff;

        // let noiseVal = this.noise.noise4D(x*noiseScale,y*noiseScale,uoff*noiseScale, voff*noiseScale);
        // noiseVal = noiseVal*5000;
        // noiseVal = noiseVal > 0 ? 255 : 0;
        let noiseVal = this.noise.noise4D(a*noiseScale,b*noiseScale,c*noiseScale, d*noiseScale);

        if (this.i === 0) {
          noiseVal = (noiseVal > .2 && noiseVal < .4) ? 30 : 255;
          if (noiseVal === 255) {
            this.rows[x][y] = null;
          } else {
            this.rows[x][y] = color("#1f3747");
          }
        } else {
          noiseVal = (noiseVal > 0 && noiseVal < .2) ? 255 : 30;
          if (noiseVal < 100) {
            this.rows[x][y] = null;
          } else {
            this.rows[x][y] = noiseVal;
          }
        }

      };
    };
  };

  show = () => {
    this.rows.forEach((row, x) => {
      row.forEach((val, y) => {
        if (val != null) {
          push();
          stroke(val);
          point(y,x);
          pop();
        };
      });
    });
  };
}


function setup() {

  $("#canvas-target").html("");
  myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");

  currentTime = `${hour()}:${minute()}`

  frameRate(fps);
  smooth();
  stroke(255);
  strokeWeight(1);
  angleMode(DEGREES);
  noFill();
  noiseDetail(8, 0.3);
  colorMode(HSB, 360, 100, 100, 1);

  crosshatch = new Crosshatch();
  crosshatch.drawLines();

  for (let i = 0; i < 2; i++) {
    let noise = new OpenSimplexNoise(Math.floor(Math.random()*5000));
    let seafoam = new Seafoam(noise, i);
    foamPatterns.push(seafoam);
  };

  $("#frame-counter").text(`Frame Count: 0/${totalFrames}`);
  createLoop({duration:gifLength, gif:true});
}

let render = () => {
  crosshatch.show();
  foamPatterns.forEach((pattern) => {
    pattern.generatePattern();
    pattern.show();
  });
};

function draw() {
  // background("#8ab2cc");
  background(255);

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
