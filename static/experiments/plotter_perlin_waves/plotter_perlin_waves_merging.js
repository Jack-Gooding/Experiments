let myCanvas;
let fps = 12;
let scaler = 1;
let gifLength = 5;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

let cWidth = 600 * scaler;
let cHeight = 600 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let noiseScale = 0.012;

let openSimplexNoise = new OpenSimplexNoise(Math.floor(Math.random()*5000));


let planeCount = 80;

class Plane {
    constructor(planeNumber = 0) {
      this.planeSize = planeSize;
      this.heightMod = 0;
    }

    generatePoints = function() {
    };

    show = () => {
    };

};

function setup() {


  $("#canvas-target").html("");
  myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");
  frameRate(fps);
  //translate(width / 2, height / 2);
  strokeWeight(1);
  noFill();
  noiseDetail(8, 0.3);
  colorMode(HSB, 255, 255, 255, 1);
  smooth();
  noLoop();

  background(255);


  for (let y = 0; y < height; y += 2) {

    let noiseMag = (1-( Math.abs(height/2-y) / (height/2) ))*30;

    stroke(255,255,160,0.7);
    if (Math.random()*(height-y) > height*0.2) {
      beginShape();
      for (let x = 0; x < width; x++) {
        let noiseVal = openSimplexNoise.noise2D(x*noiseScale,y*noiseScale);
        vertex(x,y+noiseVal*noiseMag);
      }
      endShape();
      // line(0,y,width,y);
    }

    stroke(120,255,160,0.7);;
    if (Math.random()*y > height*0.2) {
      beginShape();
      for (let x = 0; x < width; x++) {
        let noiseVal = openSimplexNoise.noise2D(x*noiseScale,y*noiseScale);
        vertex(x,y+noiseVal*noiseMag);
      }
      endShape();
      // line(0,y,width,y);
    }
  }


}

function draw() {

};
