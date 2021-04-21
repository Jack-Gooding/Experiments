let myCanvas;
let fps = 24;
let scaler = 1;
let gifLength = 4;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

// let cWidth = 800 * scaler;
// let cHeight = 1200 * scaler;

let cWidth = 200 * scaler;
let cHeight = 200 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let noise; //OpenSimplexNoise overwrites Perlin Noise
let noise1; //OpenSimplexNoise overwrites Perlin Noise
let noise2; //OpenSimplexNoise overwrites Perlin Noise

let noiseScale = 0.02;

let foamPatterns = [];

let noises = [];
let crosshatch;

class Crosshatch {
  constructor() {
    this.distance = 6;
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
    for (let x = 0; x < this.rows.length; x++) {
      let row = [];
      for (let y = 0; y < this.rows[x].length; y++) {
        // noiseVal = map(noiseVal, -1, 1, 0, 255);

        let theta = map(elapsedFrames,0,totalFrames,0,360);
        let uoff = cos(theta)*maxSize * gifLength/fps * gifLength/fps;
        let voff = sin(theta)*maxSize * gifLength/fps * gifLength/fps;


        // let noiseVal = this.noise.noise4D(x*noiseScale,y*noiseScale,uoff*noiseScale, voff*noiseScale);
        // noiseVal = noiseVal*5000;
        // noiseVal = noiseVal > 0 ? 255 : 0;

        if (this.i === 0) {
          let noiseVal = this.noise.noise4D(x*noiseScale,y*noiseScale,uoff*noiseScale, voff*noiseScale);
          noiseVal = (noiseVal > .2 && noiseVal < .4) ? 30 : 255;
          if (noiseVal === 255) {
            this.rows[x][y] = null;
          } else {
            this.rows[x][y] = color("#1f3747");
          }
        } else {
          let noiseVal = this.noise.noise4D(x*noiseScale,y *noiseScale,uoff*noiseScale, voff*noiseScale);
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

  noise1 = new OpenSimplexNoise(Math.floor(Math.random()*5000));
  noise2 = new OpenSimplexNoise(Math.floor(Math.random()*5000));
  $("#frame-counter").text(`Frame Count: 0/${totalFrames}`);
  createLoop({duration:gifLength, gif:true});
}

let drawLines = () => {
  stroke(0);
  let theta = map(elapsedFrames,0,totalFrames,0,360);
  let uoff = cos(theta)*maxSize/10;
  let voff = sin(theta)*maxSize/10;

  for (let x = 0; x < width; x++) {


    let noiseVal1 = noise1.noise3D(x * noiseScale, cHeight * 1/5 * noiseScale, uoff * noiseScale, voff * noiseScale);
    let noiseVal2 = noise2.noise3D(x * noiseScale, cHeight * 2/5 * noiseScale, uoff * noiseScale, voff * noiseScale);

    let noiseVal3 = noiseVal1+noiseVal2;
    noiseVal3 = map(noiseVal3, -2, 2, -1, 1);
    let noiseVal4 = noiseVal1*noiseVal2;

    point(x, cHeight * 1/5 + noiseVal1*30);
    point(x, cHeight * 2/5 + noiseVal2*30);
    point(x, cHeight * 3/5 + noiseVal3*30);
    point(x, cHeight * 4/5 + noiseVal4*30);
  }
};

let render = () => {
  angleMode(DEGREES);
  let mult = maxSize/6;
  let theta = map(elapsedFrames,0,totalFrames,0,360);
  let uoff = cos(theta)*mult*3;
  let voff = sin(theta)*mult*3;
  for (let x = 0; x < cWidth; x++) {
    let xDeg = map(x,0,cWidth-1,0,360);
    let a = sin(xDeg+theta)*mult+uoff;
    let b = cos(xDeg+theta)*mult;
    for (let y = 0; y < cHeight; y++) {
      let yDeg = map(y,0,cHeight-1,0,360);
      let c = sin(yDeg+theta)*mult+voff;
      let d = cos(yDeg+theta)*mult;
      let noiseVal1 = noise1.noise4D(a*noiseScale,b*noiseScale,c*noiseScale,d*noiseScale);
      // let noiseVal2 = noise2.noise2D(uoff*noiseScale, voff*noiseScale);
      let noiseVal2 = 0;
      let noiseVal3 = noiseVal1 + noiseVal2;
      let noiseVal4 = map(noiseVal3, -1, 1, -1, 1);
      let c2 = map(noiseVal4, -1, 1, 0, 100);
      // console.log(a,b,c,d,c2);
      stroke(c2);
      point(x,y);
    };
  };

};

function draw() {
  background(0);

  if (elapsedFrames >= totalFrames) {

  } else if (elapsedFrames === 0) { //first frame
    render();
    // saveCanvas(`Background - ${currentTime} - ${elapsedFrames}`, 'jpg');
  } else { //gif frames
    render();
    $("#frame-counter").text(`Frame Count: ${elapsedFrames+1}/${totalFrames}`);
    console.log(`Frame ${elapsedFrames}\\${totalFrames}`);
  };

  elapsedFrames++;
}
