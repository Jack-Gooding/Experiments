let myCanvas;
let fps = 30;

let started = false;

let scaler = 1;
let gifLength = 12;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

let cWidth = 120 * scaler;
let cHeight = 80 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let numPoints = 360;

let noiseScale = 0.08;

let circle;
let tears = [];

let displacement = 0;

let img;
let bgImg;

let handleStart = () => {
  started = true;
  loop();
};

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
      //point(this.x,this.y);
      this.points.forEach(function(p) {
        point(p.x,p.y);
      });

    }


};

function Tear() {

  //a tear is a line from p1 to p2, distorted using a 2D perlin noise field.
  this.p1;
  this.p2;

  //    find equation of line
  //
  //    y = mx + b
  //    0,0,tear.x,maxSize/2
  //
  //    m = y1 - y2 / x1 - x2

  // m is the proportional relationship between x / y for the line.
  this.m;

  //angle of line and perpendicular angle between hypotenuse and adjacent sides
  this.angle;
  this.pAngle;

  //
  this.points = [];

  //spread/max iterations controls how far from the original tear line the tear spreads
  this.spreadIterations = 0;
  this.maxIterations = Math.floor(Math.random()*80);

  //randomly choose a point in the base circle, and find a point on the opposite side
  //the opposite point can be within a small range to create a more random tearing effect.
  this.createPoints = function() {
    this.rGen = Math.floor(Math.random()*numPoints);
    this.p1 = circle.points[this.rGen];
    this.p2 = circle.points[(this.rGen + numPoints/2 - numPoints/12 + Math.floor(Math.random()*(numPoints/6)))%numPoints];

    // m is the proportional relationship between x / y for the line p1,p2.
    // m = y2 - y1 / x2 - x1
    this.m = (this.p2.y-this.p1.y) / (this.p2.x - this.p1.x);
  }

  //reciprocal is -1/x
  this.calculateNegativeReciprocal = function() {

    // pm is the perpendicular proportional relationship between x / y for the line p1,p2.
    this.pm = -1/this.m;

    //angle and perpendicular angle between hypotenus and adjacent sides for line.
    this.angle = Math.atan(1/this.m);
    this.pAngle = Math.atan(1/this.pm);
  }

  //generate points along the tear line, offset by perlin noise value along a perpendicular direction to the line.
  this.generateNoisePoints = function() {
    //magic number, scales the noise field up to a suitable value
    let zVal = Math.random()*maxSize*200000;

    for (let i = 0; i < maxSize; i+=.4) {
      let xSize = this.p2.x-this.p1.x;
      let ySize = this.p2.y-this.p1.y;

      let x = this.p2.x-xSize*(i/maxSize);
      let y = this.p2.y-ySize*(i/maxSize);

      let b = y - this.pm * x;

      let noiseVal = (noise(x*noiseScale,y*noiseScale,zVal)-.5)*maxSize/12;
      let x2 = x + Math.cos(this.angle)*noiseVal;
      let y2 = x2 * this.pm + b;

      this.points.push([x2,y2]);
    }
  };

  //Updates the base image, ready to be read by the next tear
  this.updateImage = function() {
    img.loadPixels();
    loadPixels();

    let test = createImage(visualWidth,visualHeight);
    //let d = pixelDensity();
    let d = 1;
    let imageSize = 4 * (width * d) * (height * d);

    for (let i = 0; i < visualWidth; i++) {
      for (let j = 0; j < visualHeight; j++) {
        let x = width/2 - visualWidth/2 + i;
        let y = height/2 - visualHeight/2 + j;

        let off = (y * width + x) * d * 4;

        img.pixels[i*4+j*visualWidth*4] = pixels[off];
        img.pixels[i*4+j*visualWidth*4+1] = pixels[off + 1];
        img.pixels[i*4+j*visualWidth*4+2] = pixels[off + 2];
        img.pixels[i*4+j*visualWidth*4+3] = 255;

      }
    }


    img.updatePixels();
    image(img,-visualWidth/2,-visualHeight/2);
    console.log("Image Updated");
  };


  this.spreadSize = (1+Math.random())*4;
  this.spreadBackground = 0;


  //function creates two images and moves apart perpendicular to line p1,p2
  this.spread = function() {
    img.loadPixels();
    loadPixels();
    push();
    fill(10);
    strokeWeight(1);
    stroke(255);
    rect(-visualWidth/2, -visualHeight/2, visualWidth, visualHeight);
    circle.show();
    pop();
    let image1Points = [];

    //check if image1 exists
    //if yes, place image away from origin based on spreadIterations
      //
    //if no, calculate necessary points and create image using these points.
      //leave alpha channel blank for non-nececssary points
    if (this.image1) {
      this.image1.loadPixels();
      let p = [-visualWidth/2,-visualHeight/2];
      let b = p[1] - this.pm * p[0];
      let x2 = p[0] + Math.cos(this.angle)*(this.spreadIterations/Math.sqrt(maxSize))*this.spreadSize;

      let y2 = x2 * this.pm + b;
      image(this.image1, x2,y2);
    } else {
      this.image1 = createImage(visualWidth,visualHeight);
      this.image1.loadPixels();
      for (let i = 0; i < this.points.length; i++) {
        for (let j = 0; j < maxSize/1.333; j++) {
          let p = this.points[i];
          let b = p[1] - this.pm * p[0];
          let x2 = p[0] + Math.cos(this.angle)*j;
          let y2 = x2 * this.pm + b;
          if ( x2 > -visualWidth/2 && x2 < visualWidth/2-1 && y2 > -visualHeight/2 && y2 < visualHeight/2) {
            let exists = false;
            image1Points.forEach(function(c) {
              if (c[0] == Math.round(x2) && c[1] == Math.round(y2)) {
                exists = true;
              };
            });
            if (exists === false) {
              image1Points.push([Math.round(x2),Math.round(y2)]);
            }
          }
        }
      }
      console.log("point calc done");
      //reduce number of points, reduce number of slow 'img.get()' calls


      for (let i = 0; i < image1Points.length; i++) {
        let p = image1Points[i];
        let x = p[0] + visualWidth/2;
        let y = p[1] + visualHeight/2;
        let d = 1;


        let off = (y * visualWidth + x) * d * 4;


        this.image1.pixels[off] = img.pixels[off];
        this.image1.pixels[off + 1] = img.pixels[off + 1];
        this.image1.pixels[off + 2] = img.pixels[off + 2];
        this.image1.pixels[off + 3] = 255;

        //This was used before pixel[] implementation, much slower
        //this.image1.set(p[0]+visualWidth/2,p[1]+visualWidth/2,img.get(p[0]+visualWidth/2,p[1]+visualWidth/2));
      }
      this.image1.updatePixels();
      image(this.image1, -visualWidth/2,-visualHeight/2);
    };

    //Same process for 2nd side, should simplify to one function

    let image2Points = [];
    if (this.image2) {
      this.image2.loadPixels();
      let p = [-visualWidth/2,-visualHeight/2];
      let b = p[1] - this.pm * p[0];
      let x2 = p[0] - Math.cos(this.angle)*(this.spreadIterations/Math.sqrt(maxSize))*this.spreadSize;
      let y2 = x2 * this.pm + b;
      image(this.image2, x2,y2);
    } else {
      this.image2 = createImage(visualWidth,visualHeight);
      this.image2.loadPixels();
      for (let i = 0; i < this.points.length; i++) {
        for (let j = 0; j < maxSize/1.333; j++) {
          let p = this.points[i];
          let b = p[1] - this.pm * p[0];
          let x2 = p[0] - Math.cos(this.angle)*j;
          let y2 = x2 * this.pm + b;
          if ( x2 > -visualWidth/2 && x2 < visualWidth/2 && y2 > -visualHeight/2 && y2 < visualHeight/2) {
            let exists = false;
            image2Points.forEach(function(c) {
              if (c[0] == Math.round(x2) && c[1] == Math.round(y2)) {
                exists = true;
              };
            });
            if (exists === false) {
              image2Points.push([Math.round(x2),Math.round(y2)]);
            }
          }
        }
      }
      console.log("point calc done");
      //reduce number of points, reduce number of slow 'img.get()' calls

      for (let i = 0; i < image2Points.length; i++) {
        let p = image2Points[i];
        let x = p[0] + visualWidth/2;
        let y = p[1] + visualHeight/2;
        let d = 1;


        let off = (y * visualWidth + x) * d * 4;

        this.image2.pixels[off] = img.pixels[off];
        this.image2.pixels[off + 1] = img.pixels[off + 1];
        this.image2.pixels[off + 2] = img.pixels[off + 2];
        this.image2.pixels[off + 3] = 255;

        //This was used before pixel[] implementation, much slower
        //this.image2.set(p[0]+visualWidth/2,p[1]+visualWidth/2,img.get(p[0]+visualWidth/2,p[1]+visualWidth/2));
      }
      this.image2.updatePixels();
      image(this.image2, -visualWidth/2,-visualHeight/2);
    }





    this.spreadIterations++;
    //if a spread has happened x number of times
    //create a new tear and replace this tear with it.
    if (this.spreadIterations >= 40) {
      this.updateImage();
      let t1 = new Tear();
      tears.push(t1);
      tears.shift();
      t1.createPoints();
      t1.calculateNegativeReciprocal();
      t1.generateNoisePoints();
      t1.show();
    }


  };


  this.showPerpendicularLine = function() {
    let b = 0 + 1*0/this.pm;

    for (let i = 0; i < maxSize; i++) {

      let x = -maxSize/2 + i;

      let y = x * this.pm + 0;

      console.log("I don't think this is used");
    }

  };


  this.show = function() {
    stroke(255);
    //line(this.p1.x,this.p1.y,this.p2.x,this.p2.y);
    for (let i = 0; i < maxSize; i++) {
      //let xSize = this.p2.x-this.p1.x;
      //let ySize = this.p2.y-this.p1.y;

      //point(this.p2.x-xSize*(i/maxSize),this.p2.y-ySize*(i/maxSize));
    }
    console.log(this.points.length);
    img.loadPixels();

      for (let j = 0; j < this.points.length; j++) {
        let p = this.points[j];
        //thicken lines, increase comparator for thicker
        for (let i = -1; i < 2; i++) {
          let b = p[1] - this.pm * p[0];
          let x2 = p[0] + Math.cos(this.angle)*i;
          let y2 = x2 * this.pm + b;
          if ( x2 > -visualWidth/2 && x2 < visualWidth/2 && y2 > -visualHeight/2 && y2 < visualHeight/2) {
            img.set(Math.round(x2+visualWidth/2),Math.round(y2+visualHeight/2),255);
          }
        }
      }

    img.updatePixels();
    line(this.p1[0],this.p1[1],this.p2[0],this.p2[1]);
    image(img, -visualWidth/2, -visualHeight/2);
  };




};


function setup() {
  img = createImage(visualWidth, visualHeight);
  img.loadPixels();
  bgImg = createImage(visualWidth, visualHeight);
  bgImg.loadPixels();

  $("#canvas-target").html("");
  myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");
  frameRate(fps);
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
  for (let i = 0; i < visualHeight; i++) {
    for (let j = 0; j < visualWidth; j++) {
      bgImg.set(j,i,0);
      img.set(j,i,color(Math.random()*10,Math.random()*10,Math.random()*10));
    }
  }
  img.updatePixels();
  image(img, -visualHeight/2, -visualWidth/2);

  let t1 = new Tear();
  tears.push(t1);
  t1.createPoints();
  t1.calculateNegativeReciprocal();
  t1.generateNoisePoints();
  t1.show();

  //gif creator
  createLoop({duration:gifLength, gif:true});
  if (!started) {
    noLoop();
  }
}

function draw() {
    clear();
    background(0);
    translate(width / 2, height / 2);
    if (elapsedFrames > totalFrames) {
    } else if (elapsedFrames === 0) {
    } else {
      tears[tears.length-1].spread();
      console.log(`Frames: ${elapsedFrames} / ${totalFrames}`);
    }
    elapsedFrames++;
}
