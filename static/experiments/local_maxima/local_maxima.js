let myCanvas;
let fps = 30;
let scaler = 1;
let gifLength = 12;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

// let cWidth = 800 * scaler;
// let cHeight = 1200 * scaler;

let cWidth = 300 * scaler;
let cHeight = 300 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let noise; //OpenSimplexNoise overwrites Perlin Noise
let noiseScale = 0.02;

let noises = [];
let noiseField;

class NoiseField {
  constructor(noise) {
    this.noise = noise;
    this.points = [];
    this.maxima = [];
  };

  compareMaxima = () => {

    //Clearing the maxima arr is quite niave
      //It would be better to update an 'oldmaxima' arr,
      //  then compare new maxima against old maxima before deciding which to use
      //  this would help prevent large maxima splitting into two for a frame
    this.maxima  =  [];


    if (this.points.length <= 0) {
      this.calculatePoints();
    }

    let buffer = 1;
    for (let x = buffer; x < this.points.length-buffer; x++) {
      for (let y = buffer; y < this.points[x].length-buffer; y++) {

        let maxima = true;
        let pts = this.points
        let p = this.points[x][y];

        if (pts[x-1]) {
          if (p <= pts[x-1][y]) maxima = false;

          if (pts[x-1][y-1]) {
            if (p <= pts[x-1][y-1]) maxima = false;
          }
          if (pts[x-1][y+1]) {
            if (p <= pts[x-1][y+1]) maxima = false;
          }
        }

        if (pts[x+1]) {
          if (p <= pts[x+1][y]) maxima = false;

          if (pts[x+1][y-1]) {
            if (p <= pts[x+1][y-1]) maxima = false;
          }
          if (pts[x+1][[y-1]]) {
            if (p <= pts[x+1][y+1]) maxima = false;
          }
        }

        if (pts[x][y-1]) {
          if (p <= pts[x][y-1]) maxima = false;
        }
        if (pts[x][y-1]) {
          if (p <= pts[x][y+1]) maxima = false;
        }


        if (maxima) {
          this.maxima.push({
            x: x,
            y: y,
            value: p,
          });
        }
      };
    };

    this.maxima.forEach((m) => {
      let distance = maxSize;
      this.maxima.forEach((cM) => {
        if (m != cM) {
          let newDist = dist(m.x,m.y,cM.x,cM.y);
          if (newDist < distance) {
            distance = newDist;
          };
        };
      });
      m.distance = distance;
    });

  };

  calculatePoints = (z = 0, w = 0) => {
    this.points = [];
    for (let x = 0; x < cWidth; x++) {
      let xArr = [];
      for (let y = 0; y < cHeight; y++) {
        let noiseVal = noises[0].noise4D(x*noiseScale,y*noiseScale, z*noiseScale, w*noiseScale);
        let color = map(noiseVal, -1, 1, 0, 100);
        xArr.push(color);
      };
      this.points.push(xArr);
    };
  };

  show = () => {
    if (this.points.length <= 0) {
      this.calculatePoints();
    };

    for (let x = 0; x < this.points.length; x++) {
      for (let y = 0; y < this.points[x].length; y++) {
        stroke(this.points[x][y]);
        point(x,y);
      };
    };

    push();
    stroke(color(80,100,100));
    strokeWeight(2);
    this.maxima.forEach((maxima) => {
      circle(maxima.x,maxima.y,maxima.distance);
      let sqr = maxima.distance*Math.sqrt(2)/4;

      push();
      stroke(color(255,100,100));
      let p1 = [maxima.x-sqr,maxima.y-sqr];
      let p2 = [maxima.x+sqr,maxima.y-sqr];
      let p3 = [maxima.x+sqr,maxima.y+sqr];
      let p4 = [maxima.x-sqr,maxima.y+sqr];
      line(p1[0],p1[1],p2[0],p2[1]);
      line(p2[0],p2[1],p3[0],p3[1]);
      line(p3[0],p3[1],p4[0],p4[1]);
      line(p4[0],p4[1],p1[0],p1[1]);
      pop();

      point(maxima.x,maxima.y);
    });
    pop();
  };
};

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

  for (let i = 0; i < 1; i++) {
    let noise = new OpenSimplexNoise(Math.floor(Math.random()*5000));
    noises.push(noise);
    noiseField = new NoiseField(noise);
    //noiseField.compareMaxima();
  };

  $("#frame-counter").text(`Frame Count: 0/${totalFrames}`);
  createLoop({duration:gifLength, gif:true});
}

let render = () => {
  let deg = map(elapsedFrames, 0, totalFrames, 0, 360);
  let x = sin(deg)*cWidth/12;
  let y = cos(deg)*cWidth/12;

  push();
  stroke(color(180,100,100));
  strokeWeight(20);
  point(cWidth/2 + x*5, cHeight/2 + y*5);
  pop();

  noiseField.calculatePoints(x, y);
  noiseField.compareMaxima();
  noiseField.show();
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
