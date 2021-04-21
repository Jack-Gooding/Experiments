let myCanvas;
let fps = 3;
let scaler = 1;
let gifLength = 9;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

let cWidth = 400 * scaler;
let cHeight = 400 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let noiseScale = 0.02;

let numPlanes = 16;
let planeSize = 200;
let planes = [];
//  [
//  [0,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,0],
//  [0,1,1,0,0,0,0,1,1,1,1,1,0,0,1,1,1],
//  [0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0],
//  ...
//  ]

class Plane {
    constructor(planeHeight) {
      this.planeSize = planeSize;
      this.planeHeight = planeHeight;
      this.points = [];
      this.planeColour;
      this.planeNumber;
    }

    generatePoints = function() {
      this.planeNumber = planes.length-1;
      this.planeColour = map(this.planeNumber, 0, numPlanes-1, 0, 200);
      this.colourMod = map(this.planeNumber, 0 ,numPlanes-1, 0,1);
      for (let x = 0; x < this.planeSize; x++) {
        this.points.push([]);

        for (let y = 0; y < this.planeSize; y++) {

          //state = whether there's land in this point.
          let pointState = 0;

          //noiseVal is perlin noise map at specific location
          let noiseVal = noise(x*noiseScale,y*noiseScale,this.planeHeight*noiseScale);
          noiseVal = map(noiseVal,0 ,1, 0, 1);

          //stricter criteria for 'land' on each raised plane
          let acceptance = map(planes.length, 0, numPlanes, 0, .6);

          if (noiseVal > acceptance) {
            if (planes[this.planeNumber -1 ] != null) {
              if (planes[this.planeNumber -1 ].points[x][y] === false) {
                pointState = 0;
              } else {
                pointState = 1;
              }
            } else {
              pointState = 1;
            }
          }

          this.points[x].push(pointState);
        };
      };
    };

    edgeFind = () => {
      for (let x = 0; x < this.points.length; x++) {
        for (let y = 0; y < this.points[x].length; y++) {
          if (this.points[x][y]) {

            //left
            if (this.points[x-1]) {
              if (!this.points[x-1][y]) {
                this.points[x][y] = 2;
              };
            };

            //below
            if (!this.points[x][y+1] && this.points[x][y+1] != null) {
                this.points[x][y] = 2;
            };

            //right
            if (this.points[x+1]) {
              if (!this.points[x+1][y]) {
                this.points[x][y] = 2;
              };
            };

            //above
            if (!this.points[x][y-1] && this.points[x][y-1] != null) {
                this.points[x][y] = 2;
            };

          }
        };
      };
    };

    show = () => {
      let hue = map(290,0,360,0,255);
      for (let i = 0; i < this.points.length; i++) {
        let row = this.points[i];
        let x = i;
        row.forEach((state, y) => {
          if (state) {

            // stroke(this.planeColour,255,255);
            if (state == 2) {
              stroke(hue,125-110*this.colourMod,175+80*this.colourMod);

            } else {
              stroke(hue,125-110*this.colourMod,155+80*this.colourMod);
            }

            point(x - this.planeSize/2, y - this.planeSize/2, this.planeHeight);
          }
        })
      };
    };


};

class ExtraPlane extends Plane {
  createMoons = function() {
  };

  createPoints = function() {
  };
};

function setup() {


  $("#canvas-target").html("");
  myCanvas = createCanvas(cWidth, cHeight, WEBGL);
  myCanvas.parent("canvas-target");
  frameRate(fps);
  //translate(width / 2, height / 2);
  stroke(255);
  strokeWeight(1);
  noFill();
  noiseDetail(8, 0.3);
  background(0);
  colorMode(HSB, 255, 255, 255);
  //let rotation = map(Math.random(),0,1,0,TWO_PI);
  //Starts the gif
  //createLoop({duration:gifLength, gif:true});

  if (true) {

    angleMode(DEGREES);
    rotateX(90-35.264);
    rotateZ(45);

  }

    for (let i = 0; i < numPlanes; i++) {
      let z = i*4;

        let plane = new Plane(z);
        planes.push(plane);
        plane.generatePoints();
        plane.edgeFind();
        plane.show();
        console.log("new Plane");
    }
    noLoop();
}

function draw() {
  //background(20);



  if (elapsedFrames > totalFrames) {
  } else {
    console.log(`Frame ${elapsedFrames}\\${totalFrames}`);
  }
  elapsedFrames++;
}
