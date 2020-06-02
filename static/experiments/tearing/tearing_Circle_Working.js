let myCanvas;

let scaler = 3;

let cWidth = 600 * scaler;
let cHeight = 600 * scaler;

let visualWidth = 200 * scaler;
let visualHeight = 200 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let numPoints = 360;

let noiseScale = 0.08;

let circle;
let tears = [];

let displacement = 0;

let img;

function Circle() {
    this.r = maxSize/2;
    this.x = 0;
    this.y = 0;

    this.points = [];

    this.createPoints = function() {
      for (let i = 0; i < numPoints; i++) {
        let theta = map(i, 0, numPoints, -PI, PI);
        this.points.push(createVector(this.x + this.r*cos(theta), this.y + this.r*sin(theta)));
      }
    }

    this.show = function() {
      point(this.x,this.y);
      this.points.forEach(function(p) {
        point(p.x,p.y);
      });

    }


};

function Tear() {
  this.p1;
  this.p2;

  //    find equation of line
  //
  //    y = mx + b
  //    0,0,tear.x,maxSize/2
  //
  //    m = y1 - y2 / x1 - x2

  this.m;
  this.angle;
  this.pAngle;
  this.points = [];
  this.prevPoints = [];

  this.spreadIterations = 0;
  this.maxIterations = Math.floor(Math.random()*80);

  this.noiseSeed;

  this.createPoints = function() {
    this.rGen = Math.floor(Math.random()*numPoints);
    this.p1 = circle.points[this.rGen]
    this.p2 = (this.rGen >= numPoints/2) ? circle.points[this.rGen-numPoints/2] : circle.points[this.rGen+numPoints/2];

    this.m = (this.p2.y-this.p1.y) / (this.p2.x - this.p1.x);
  }

  this.calculateNegativeReciprocal = function() {
    this.pm = -1/this.m;
    this.angle = Math.atan(1/this.m);
    this.pAngle = Math.atan(1/this.pm);
  }

  this.generateNoisePoints = function() {
    let zVal = Math.random()*maxSize*200;

    for (let i = 0; i < maxSize; i+=.25) {
      let xSize = this.p2.x-this.p1.x;
      let ySize = this.p2.y-this.p1.y;

      let x = this.p2.x-xSize*(i/maxSize);
      let y = this.p2.y-ySize*(i/maxSize);

      let b = y - this.pm * x;

      let noiseVal = (noise(x*noiseScale,y*noiseScale,zVal)-.5)*100;
      let x2 = x + Math.cos(this.angle)*noiseVal;
      let y2 = x2 * this.pm + b;

      this.points.push([x2,y2]);
    }
  };

  this.spread = function() {
    for (let i = 0; i < this.points.length; i++) {



      let p = this.points[i];
      let x2 = p[0] + Math.cos(this.angle)*this.spreadIterations;
      let x3 = p[0] - Math.cos(this.angle)*this.spreadIterations;
      let b = p[1] - this.pm * p[0];
      let y2 = x2 * this.pm + b;
      let y3 = x3 * this.pm + b;
      stroke(255);
      point(x2,y2);
      point(x3,y3);


      this.prevPoints.push([x2,y2]);
      this.prevPoints.push([x3,y3]);

    }

    if (this.spreadIterations > 0) {
      stroke(Math.random()*0);
      for (let i = 0; i < this.prevPoints.length; i++) {
        let p = this.prevPoints[i];
        point(p[0],p[1]);
      }
    }

    this.prevPoints = [];

    this.spreadIterations++;
    if (this.spreadIterations >= 40) {
      let t1 = new Tear();
      tears.push(t1);
      t1.createPoints();
      t1.calculateNegativeReciprocal();
      t1.generateNoisePoints();
      t1.show();
    }
  };

  this.convertToImg = function() {
  };

  this.showPerpendicularLine = function() {
    let b = 0 + 1*0/this.pm;

    for (let i = 0; i < maxSize; i++) {

      //THIS IS WRONG
      let x = -maxSize/2 + i;

      let y = x * this.pm + 0;

      //point(x,y);


    }

  };

  this.clearGap = function() {

  };


  this.show = function() {
    //line(this.p1.x,this.p1.y,this.p2.x,this.p2.y);
    for (let i = 0; i < maxSize; i++) {
      //let xSize = this.p2.x-this.p1.x;
      //let ySize = this.p2.y-this.p1.y;

      //point(this.p2.x-xSize*(i/maxSize),this.p2.y-ySize*(i/maxSize));
    }
    this.showPerpendicularLine();
    this.clearGap();
    stroke(255);
    console.log(this.points.length);
    this.points.forEach(function(p) {
      point(p[0],p[1]);
    });
  };




};


function setup() {
  img = createImage(visualHeight, visualHeight);
  img.loadPixels();
  $("#canvas-target").html("");
  var myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");
  frameRate(10);
  translate(width / 2, height / 2);
  stroke(255);
  strokeWeight(1);
  noFill();
  noiseDetail(8, 0.3);
  background(0);
  circle = new Circle();
  circle.createPoints();
  circle.show();
  rect(0-visualWidth/2,0-visualHeight/2,visualWidth,visualHeight);

  let t1 = new Tear();
  tears.push(t1);
  t1.createPoints();
  t1.calculateNegativeReciprocal();
  t1.generateNoisePoints();
  t1.show();
}

function draw() {
  translate(width / 2, height / 2);
  tears[tears.length-1].spread();
  //let t1 = new Tear();
  //t1.createPoints();
  //t1.show();
}
