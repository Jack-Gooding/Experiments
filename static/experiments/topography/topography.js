let myCanvas;
let fps = 12;
let scaler = 1;
let gifLength = 5;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

let cWidth = 400 * scaler;
let cHeight = 400 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let noiseScale = 0.02;

let openSimplexNoise = new OpenSimplexNoise(Math.floor(Math.random()*5000));

let numPlanes = 16;
let planeSize = 180;
let perPlaneSize = Math.round((planeSize-40)/(numPlanes*2));
let planes = [];
//  [
//  [0,2,1,2,0,0,0,2,1,1,2,0,0,0,2,2,0],
//  [0,2,2,0,0,0,0,2,1,1,1,2,0,0,2,1,2],
//  [0,2,0,0,0,0,2,1,1,1,1,1,2,2,1,2,0],
//  ...
//  ]

class Plane {
    constructor(planeNumber = 0) {
      this.planeSize = planeSize;
      this.planeHeight = planeNumber * (planeSize-40)/(numPlanes*2);
      this.points = [];
      this.planeColour;
      this.planeNumber = planeNumber;
      this.heightMod = 0;
    }

    generatePoints = function() {
      this.planeColour = map(this.planeNumber, 0, numPlanes-1, 0, 200);
      this.colourMod = map(this.planeNumber, 0 ,numPlanes-1, 0,1);
      for (let x = 0; x < this.planeSize; x++) {
        this.points.push([]);
        for (let y = 0; y < this.planeSize; y++) {
          this.points[x].push(0);
        };
      };
    };

    calculatePoints = function() {

      let theta = map(elapsedFrames,0,totalFrames,0,360);
      let uoff = cos(theta)*maxSize * gifLength/fps * gifLength/fps * gifLength/fps;
      let voff = sin(theta)*maxSize * gifLength/fps * gifLength/fps * gifLength/fps;

      for (let x = 0; x < this.points.length; x++) {

        for (let y = 0; y < this.points[x].length; y++) {

          //state = whether there's land in this point.
          let newPointState = 0;


          //noiseVal is perlin noise map at specific location
          let noiseVal = openSimplexNoise.noise4D(x*noiseScale,y*noiseScale,uoff*noiseScale,voff*noiseScale);
          // let noiseVal = noise(x*noiseScale,y*noiseScale,this.planeHeight*noiseScale+this.heightMod*noiseScale);
          noiseVal = map(noiseVal,-1 ,1, 0, 1);

          //stricter criteria for 'land' on each raised plane
          let acceptance = map(this.planeNumber, 0, numPlanes, 0, 0.95);

          if (noiseVal > acceptance) {
            if (planes[this.planeNumber -1 ] != null) {
              if (planes[this.planeNumber -1 ].points[x][y] == false) {
                newPointState = 0;
              } else {
                newPointState = 1;
              }
            } else {
              newPointState = 1;
            }
          }

          this.points[x][y] = newPointState;
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

    modifyZ = (z) => {
      this.heightMod += z;
      console.log(this.heightMod);
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

    showEdges = () => {
      push();
      noFill();
      beginShape();
      vertex(-planeSize/2,planeSize/2);
      vertex(planeSize/2,planeSize/2);
      vertex(planeSize/2,-planeSize/2);
      vertex(-planeSize/2,-planeSize/2);
      endShape(CLOSE);
      pop();
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
  background(26,26,27);
  colorMode(HSB, 255, 255, 255);
  //let rotation = map(Math.random(),0,1,0,TWO_PI);
  //Starts the gif
  if (true) {

    angleMode(DEGREES);
    rotateX(90-35.264);
    rotateZ(45);

  }

    // for (let i = 0; i < numPlanes; i++) {
    //   let z = i*4;
    //
    //     let plane = new Plane(planes.length-1);
    //     plane.generatePoints();
    //     plane.calculatePoints();
    //     plane.edgeFind();
    //     plane.show();
    //
    //     planes.push(plane);
    //     console.log("new Plane");
    // }
    $("#frame-counter").text(`Frame Count: 0/${totalFrames}`);
    createLoop({duration:gifLength, gif:true});
}

function draw() {
  // background(20);
  push();
  colorMode(RGB);
  background(26,26,27);
  pop();
  if (true) {

    angleMode(DEGREES);
    rotateX(90-35.264);
    rotateZ(45);

  }
    if (elapsedFrames > totalFrames) {

    } else if (elapsedFrames === 0) {

      for (let i = 0; i < numPlanes; i++) {
        let z = i*4;

          let plane = new Plane(planes.length-1);
          plane.generatePoints();
          plane.calculatePoints();
          plane.edgeFind();
          plane.show();

          planes.push(plane);
          console.log("new Plane");
      };

    } else {

      for (let i = 0; i < planes.length; i++) {
      // console.log("Rendering plane "+i);
      let plane = planes[i];
      // plane.calculatePoints();
      // plane.edgeFind();
      // plane.showEdges();
      // plane.show();
      plane.modifyZ(Math.round(perPlaneSize*2/fps));
      plane.calculatePoints();
      plane.edgeFind();
      plane.show();
    }

    console.log(`Frame ${elapsedFrames}\\${totalFrames}`);
    $("#frame-counter").text(`Frame Count: ${elapsedFrames+1}/${totalFrames}`);
  }
  elapsedFrames++;
}
