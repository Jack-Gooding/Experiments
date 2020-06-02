let myCanvas;
let fps = 30;
let scaler = 1;
let gifLength = 12;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

let cWidth = 400 * scaler;
let cHeight = 400 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let numPoints = 2;
let numCircles = 30;

let numTwists = 1;

let baseCircle;

let circles = [];


class Circle {
    constructor(numPoints = 2, rotation = 0, r = maxSize/6,  x = 0, y = 0 ) {
      this.r = r;
      this.x = y;
      this.y = x;
      this.numPoints = numPoints;
      this.rotation = rotation;
      this.points = [];
    }


/*
*/
    show = function() {
      //point(this.x,this.y);
      push();
      strokeWeight(5);
      this.points.forEach(function(p) {
        //point(p.x,p.y,p.z);
      });
      //point(this.x,this.y);
      pop();
      //let p0 = this.points[0];
      //let p1 = this.points[Math.floor(this.numPoints/2)];
      //line(p0.x,p0.y,p0.z,p1.x,p1.y,p1.z);
    }


};

class BaseCircle extends Circle {
  createMoons = function() {

    for (let i = 0; i < this.points.length; i++) {
      let rotation = map(i,this.points.length,0,-PI,PI);
      //let theta = map(i, 0, this.points, -PI+rotation, PI+rotation);
      let moon = new Moon(totalFrames, rotation, this.r/3, this.points[i].x, this.points[i].y);
      moon.createPoints();
      circles.push(moon);


    };
  };

    createPoints = function() {
      //let rotation = map(Math.random(),0,1,0,TWO_PI);
      for (let i = 0; i < this.numPoints; i++) {
        let theta = map(i, 0, this.numPoints, this.rotation, TWO_PI+this.rotation);
        this.points.push(createVector(this.x + this.r*cos(theta), this.y + this.r*sin(theta)));
      }
    };
};

class Moon extends Circle {
  constructor(x,y,r,numPoints,rotation,points,activePoint = 0) {
    super(x,y,r,numPoints,rotation,points);
    this.activePoint = activePoint;
    this.circleIndex = circles.length;
    this.color1 = color(map(this.circleIndex,0,numCircles,0,255/2),255,255);
    this.color2 = color(map(this.circleIndex,0,numCircles,255/2,255),255,255);
  };

  createPoints = function() {

    //translate(this.x,this.y);
      let rotation = map(this.circleIndex, 0, numCircles, 0, -PI*numTwists);
      //rotate(this.rotation);
      for (let i = 0; i < this.numPoints; i++) {
        let theta = map(i, 0, this.numPoints, 0, TWO_PI);
        this.points.push(createVector(0, this.r*cos(theta+rotation), this.r*sin(theta+rotation)));
      };
      //circle.createPoints();
      //circle.show();
      //console.log("moon1", circle.x, circle.y);


  };

  show = function() {
    push();
    translate(this.x, this.y);
    rotateZ(this.rotation);

    let pActive = this.points[this.activePoint]
    let pOpposite = this.points[Math.floor((this.activePoint + this.numPoints/2)%this.numPoints)];
    strokeWeight(3);
    stroke(80);
    for (let i = 0; i < this.numPoints; i+=this.numPoints/30) {

      let p = this.points[i];
      point(p.x,p.y,p.z);

    };
    strokeWeight(2);
    stroke(255);
    line(pActive.x,pActive.y,pActive.z,pOpposite.x,pOpposite.y,pOpposite.z)
    strokeWeight(10);
    stroke(this.color1);
    point(pActive.x,pActive.y,pActive.z);
    stroke(this.color2);
    point(pOpposite.x,pOpposite.y,pOpposite.z);
    this.activePoint+=1;
    if (this.activePoint >= this.numPoints) {
      this.activePoint = 0;
    }
    pop();
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
  baseCircle = new BaseCircle(30);
  baseCircle.createPoints();
  baseCircle.createMoons();


  //Starts the gif
  createLoop({duration:gifLength, gif:true});
}

function draw() {
  background(20);

  push();
  rotateX(20);
  rotateZ(map(elapsedFrames,0,totalFrames,0,TWO_PI*2));
  circles.forEach(function(circle, index) {
    baseCircle.show();
    circle.show();
  });


  pop();
  if (elapsedFrames > totalFrames) {
    //capturer.stop();
    //capturer.save();
    circles.forEach(function() {
      circles.pop();
    });
  } else {
    console.log(`Frame ${elapsedFrames}\\${totalFrames}`);
  }
  elapsedFrames++;
}
