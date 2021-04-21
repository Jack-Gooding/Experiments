let myCanvas;
let fps = 12;
let scaler = 1;
let gifLength = 5;

let totalFrames = gifLength * fps;
let elapsedFrames = 0;

let cWidth = 600 * scaler;
let cHeight = 600 * scaler;

let visualWidth = cWidth * 1.2 * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(
  visualWidth * visualWidth + visualHeight * visualHeight
);

let noiseScale = 0.05;
let noiseScale2 = 0.05;

let openSimplexNoise = new OpenSimplexNoise(Math.floor(Math.random() * 5000));

let planeCount = 80;

class Plane {
  constructor(planeNumber = 0) {
    this.planeSize = planeSize;
    this.heightMod = 0;
  }

  generatePoints = function () {};

  show = () => {};
}

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

  background(200);

  let breakSize = 2;
  let fields = 2;
  let noiseMag = 10;

  let openSimplexNoiseX = new OpenSimplexNoise(
    Math.floor(Math.random() * 5000)
  );
  let openSimplexNoiseY = new OpenSimplexNoise(
    Math.floor(Math.random() * 5000)
  );
  let openSimplexNoiseX2 = new OpenSimplexNoise(
    Math.floor(Math.random() * 5000)
  );
  let openSimplexNoiseY2 = new OpenSimplexNoise(
    Math.floor(Math.random() * 5000)
  );
  let openSimplexNoiseX3 = new OpenSimplexNoise(
    Math.floor(Math.random() * 5000)
  );
  let openSimplexNoiseY3 = new OpenSimplexNoise(
    Math.floor(Math.random() * 5000)
  );

  for (let i = 0; i < fields; i++) {
    stroke(Math.random() * 255, 255, 160, 0.7);
    for (let y = noiseMag + 30; y + noiseMag + 30 < height; y += breakSize) {
      beginShape();
      for (let x = noiseMag + 30; x + noiseMag + 30 < width; x++) {
        let noiseValX = openSimplexNoiseX.noise2D(
          (x + i * width * 5) * noiseScale,
          y * noiseScale
        );
        let noiseValY = openSimplexNoiseY.noise2D(
          x * noiseScale,
          (y + i * height * 5) * noiseScale
        );

        let noiseValX2 = openSimplexNoiseX2.noise2D(
          (x + i * width * 100) * noiseScale2,
          y * noiseScale2
        );
        let noiseValY2 = openSimplexNoiseY2.noise2D(
          x * noiseScale2,
          (y + i * height * 100) * noiseScale2
        );

        let noiseValX3 = openSimplexNoiseX3.noise2D(
          ((x + i * width * 5) * noiseScale2) / 10,
          (y * noiseScale2) / 10
        );
        let noiseValY3 = openSimplexNoiseY3.noise2D(
          (x * noiseScale2) / 10,
          ((y + i * height * 5) * noiseScale2) / 10
        );
        vertex(
          x + (noiseValX + noiseValX2) * noiseMag * 0.8 + noiseValX3 * 30,
          y + (noiseValY + noiseValY2) * noiseMag * 0.8 + noiseValY3 * 30
        );
      }
      endShape();
    }
  }
}

function draw() {
  save("mySVG.svg"); // give file name
  // print("saved svg");
}
