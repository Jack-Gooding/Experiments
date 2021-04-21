let myCanvas;
let fps = 24;
let scaler = 1;
let gifLength = 20;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

// let cWidth = 800 * scaler;
// let cHeight = 1200 * scaler;

let cWidth = 800 * scaler;
let cHeight = 800 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let noise; //OpenSimplexNoise overwrites Perlin Noise
let noiseScale = 0.02;

let shapes = [];

class Shape {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r; //safe bounds
    this.points = [];
    this.acceptablePadding = r;
    this.jiggleFactor = (Math.round(Math.random()) ? Math.random()*40 : -Math.random()*40);
    this.colour = color(Math.random()*360, Math.random()*Math.random()*40, 80+Math.random()*20, 0.8+Math.random()*.2);
  };

  checkOverlap = () => {
    let clear = true;
    for (let shape of shapes) {
      if (dist(this.x, this.y, shape.x, shape.y) < this.r + shape.r + this.acceptablePadding*2) {
        clear = false;
        break;
      };
    };
    return clear;
  };

  show = () => {
    push();
    stroke(this.colour);
    translate(this.x,this.y);
    // circle(0,0,this.r*2);
    let r = Math.sin(elapsedFrames*20/totalFrames)*this.jiggleFactor;
    rotate(r);
    angleMode(DEGREES);
    beginShape();
    this.points.forEach((p) => {
      vertex(p.x,p.y);
    });
    endShape(CLOSE);
    pop();
  };


};

class Square extends Shape {
  constructor(x, y, r, points) {
    super(x, y, r, points);
    this.numPoints = 4;
  };

  generate = () => {
    push();
    angleMode(RADIANS);
    let angleMod = Math.random()*PI;
    for (let i = 0; i < this.numPoints; i++) {
      let theta = map(i, 0, this.numPoints, -PI, PI);
      this.points.push(createVector(this.r*cos(theta + angleMod), this.r*sin(theta + angleMod)));
    };
    pop();
  };
};

class SineSqiggle extends Shape {
  constructor(x, y, r, points) {
    super(x, y, r, points);
    this.resolution = 200;
  };

  generate = () => {
    push();
    for (let i = 0; i < 1; i+=(1/this.resolution)) {
    // this.points.push(createVector(0,0));
    this.points.push(createVector(-this.r + i*this.r*2, this.r/8 + Math.sin(i*PI*6)*this.r/8));
    }
    for (let i = 1; i >= 0; i-=(1/this.resolution)) {
    // this.points.push(createVector(0,0));
    this.points.push(createVector(-this.r + i*this.r*2,-this.r/8 + Math.sin(i*PI*6)*this.r/8));
    }
    pop();
  };
};

class Star extends Shape {
  constructor(x, y, r, points) {
    super(x, y, r, points);
    this.numPoints = 4 + Math.floor(Math.random()*4)*2;
  };

  generate = () => {
      push();
      angleMode(RADIANS);
      let angleMod = Math.random()*PI;
      for (let i = 0; i < this.numPoints; i++) {
        let theta = map(i, 0, this.numPoints, -PI, PI);

        if (i%2) {
          this.points.push(createVector(this.r/2.8*cos(theta + angleMod), this.r/2.8*sin(theta + angleMod)));
        } else {
          this.points.push(createVector(this.r*cos(theta + angleMod), this.r*sin(theta + angleMod)));
        }
      };
      pop();
  };
};

class RegularPolygon extends Shape {
  constructor(x, y, r, points) {
    super(x, y, r, points);
    this.numPoints = Math.ceil(Math.random()*6)+2;
  };

  generate = () => {
      push();
      angleMode(RADIANS);
      let angleMod = Math.random()*PI;
      for (let i = 0; i < this.numPoints; i++) {
        let theta = map(i, 0, this.numPoints, -PI, PI);
        this.points.push(createVector(this.r*cos(theta + angleMod), this.r*sin(theta + angleMod)));
      };
      pop();
  };
};

class Circle extends Shape {
  constructor(x, y, r, points) {
    super(x, y, r, points);
  };

  generate = () => {

  };

  show = () => {
    circle(this.x,this.y,this.r*2);
  }
};

class LightningBolt extends Shape {
  constructor(x, y, r, points) {
    super(x, y, r, points);
  };

  generate = () => {
    let constructionLines = [];
    let constructionLineMagnitudes = [this.r/3,this.r/4,this.r/4,this.r/4,this.r/3];
    let constructionLineAngles = [80+Math.random()*20,-10+Math.random()*20,80+Math.random()*20,-10+Math.random()*20,80+Math.random()*20];
    let jagCount = 3;


    let x = 0;
    let y = 0;

    let px = 0;
    let py = 0;

    push();
    angleMode(DEGREES);
    for (let i = 0; i < constructionLineAngles.length; i++) {
      x = px + constructionLineMagnitudes[i]*cos(constructionLineAngles[i]);
      y = py + constructionLineMagnitudes[i]*sin(constructionLineAngles[i]);

      constructionLines.push(createVector(x, y));

      px = x;
      py = y;
    };

    let v = constructionLines[constructionLines.length-1];

    let distToPoint = dist(0,0,v.x,v.y);
    for (let i = 0; i < constructionLines.length; i++) {
      let v = constructionLines[constructionLines.length-1];
      // constructionLines[i] = createVector();
    };

    v = constructionLines[constructionLines.length-1];

    this.points.push(createVector(-this.r/8,0));
    this.points.push(createVector(this.r/8,0));

    //r-handside
    for (let i = 0; i < constructionLines.length-1; i++) {
      let v = constructionLines[i];
      this.points.push(createVector(v.x+this.r/10, v.y-this.r/10));
    }

    //tip
    this.points.push(createVector(v.x, v.y));

    //l-handside
    for (let i = constructionLines.length-2; i >= 0; i--) {
      let v = constructionLines[i];
      this.points.push(createVector(v.x-this.r/10, v.y+this.r/10));
    }
    pop();

  };
};

class SqiggleCircle extends Shape {
  constructor(x, y, r, points) {
    super(x, y, r, points);
    this.numPoints = 360;
    this.sqiggleFactor = 0.5+Math.random()*.3;
  };

  generate = () => {
    noise = new OpenSimplexNoise(Math.floor(Math.random()*3000));
    for (let i = 0; i < this.numPoints; i++) {
      let theta = map(i, 0, this.numPoints, -PI, PI);

      let x = cos(theta);
      let y = sin(theta);

      let n = noise.noise2D(x,y);
      n = map(n, -1, 1, this.sqiggleFactor, 1);

      x = x * n * this.r;
      y = y * n * this.r;


      this.points.push(createVector(x,y));
    }
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
  noise = new OpenSimplexNoise(Date.now());
  //Starts the gif

  let failedPlacements = 0;
  for (let i = 0; i < 60; i++) {

    let newShape;
    let shapeRadius = 15+Math.random()*Math.random()*320;
    let widthBoundary = width - shapeRadius*4;
    let heightBoundary = height - shapeRadius*4;

    switch (Math.ceil(Math.random()*6)) {
      // case 0:
      //   newShape = new Square(shapeRadius*1.5 + Math.random()*widthBoundary, shapeRadius*1.5 + Math.random()*heightBoundary, shapeRadius);
      //   break;
      case 1:
        newShape = new SineSqiggle(shapeRadius*1.5 + Math.random()*widthBoundary, shapeRadius*1.5 + Math.random()*heightBoundary, shapeRadius);
        break;
      case 2:
        newShape = new Star(shapeRadius*1.5 + Math.random()*widthBoundary, shapeRadius*1.5 + Math.random()*heightBoundary, shapeRadius);
        break;
      case 3:
        newShape = new RegularPolygon(shapeRadius*1.5 + Math.random()*widthBoundary, shapeRadius*1.5 + Math.random()*heightBoundary, shapeRadius);
        break;
      // case 4:
      //   newShape = new Circle(shapeRadius*1.5 + Math.random()*widthBoundary, shapeRadius*1.5 + Math.random()*heightBoundary, shapeRadius);
      //   break;
      case 4:
        newShape = new SqiggleCircle(shapeRadius*1.5 + Math.random()*widthBoundary, shapeRadius*1.5 + Math.random()*heightBoundary, shapeRadius);
        break;
      case 5:
        newShape = new LightningBolt(shapeRadius*1.5 + Math.random()*widthBoundary, shapeRadius*1.5 + Math.random()*heightBoundary, shapeRadius);
        break;
      default:
        newShape = new LightningBolt(shapeRadius*1.5 + Math.random()*widthBoundary, shapeRadius*1.5 + Math.random()*heightBoundary, shapeRadius);
    }

    if (newShape.checkOverlap()) {
      newShape.generate();
      shapes.push(newShape);
      failedPlacements = 0;
    } else {
      if (failedPlacements < width*height) {
        i--;
      };
      failedPlacements++;
    }
  };


  $("#frame-counter").text(`Frame Count: 0/${totalFrames}`);
  createLoop({duration:gifLength, gif:true});
}

function draw() {
  background("#8ab2cc");

  if (elapsedFrames >= totalFrames) {

  } else if (elapsedFrames === 0) { //first frame
    shapes.forEach((shape) => {
      shape.show();
    })
    saveCanvas(`Background - ${currentTime} - ${elapsedFrames}`, 'jpg');
  } else { //gif frames


    shapes.forEach((shape) => {
      shape.show();
    })

    $("#frame-counter").text(`Frame Count: ${elapsedFrames+1}/${totalFrames}`);
    console.log(`Frame ${elapsedFrames}\\${totalFrames}`);
  };

  elapsedFrames++;
}
