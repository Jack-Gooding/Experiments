let myCanvas;
let fps = 60;
//let //capturer = new CCapture( {framerate: fps, verbose: true, format: 'gif', workersPath: './js/'} );
let scaler = 1;
let gifLength = 20;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

let cWidth = 400 * scaler;
let cHeight = 400 * scaler;

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
    this.p1 = circle.points[this.rGen];
    //this.p2 = (this.rGen >= numPoints/2) ? circle.points[this.rGen-numPoints/2] : circle.points[this.rGen+numPoints/2];
    this.p2 = circle.points[(this.rGen + numPoints/2 - numPoints/12 + Math.floor(Math.random()*(numPoints/6)))%numPoints];
    console.log(this.p1,this.p2);
    this.m = (this.p2.y-this.p1.y) / (this.p2.x - this.p1.x);
  }

  this.calculateNegativeReciprocal = function() {
    this.pm = -1/this.m;
    this.angle = Math.atan(1/this.m);
    this.pAngle = Math.atan(1/this.pm);
  }

  this.generateNoisePoints = function() {
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

  this.updateImage = function() {
    img.loadPixels();
    loadPixels();
    //let p = myCanvas.getImageData(-visualWidth/2, -visualHeight/2, 1, 1).data;
    let test = createImage(visualWidth,visualHeight);
    //let d = pixelDensity();
    let d = 1;
    let imageSize = 4 * (width * d) * (height * d);

    for (let i = 0; i < visualWidth; i++) {
      for (let j = 0; j < visualHeight; j++) {
        let x = width/2 - visualWidth/2 + i;
        let y = height/2 - visualHeight/2 + j;

        let off = (y * width + x) * d * 4;

        let pixel = [
          pixels[off],
          pixels[off + 1],
          pixels[off + 2],
          pixels[off + 3]
        ];
        if (x > width/2 - visualWidth/2 && x < width/2 + visualWidth/2 && y > height/2 - visualWidth/2 && y < height/2 + visualWidth/2) {
          //img.set(x,y,pixel);
        }
        img.set(i,j,myCanvas.get(width/2-visualWidth/2+i, height/2-visualHeight/2+j));

      }
    }

    //for (let i = 0; i < imageSize; i += 4) {

    //  let pixel = [];
    //  pixel.push(pixels[i]);
    //  pixel.push(pixels[i + 1]);
    //  pixel.push(pixels[i + 2]);
    //  pixel.push(pixels[i + 3]);
    //  img.set((i/4)%width,Math.floor(i/(4*width)),color(pixel[0],pixel[1],pixel[2],pixel[3]));
    //  console.log(pixel);
    //};
    //for (let i = 0; i < visualWidth; i++) {
      //for (let j = 0; j < visualHeight; j++) {
        //console.log(myCanvas.get(width/2-visualWidth/2+i, height/2-visualHeight/2+j));
        //console.log(pixel);
        //img.set(i,j,myCanvas.get(width/2-visualWidth/2+i, height/2-visualHeight/2+j));
      //}
    //}
    img.updatePixels();
    image(img,-visualWidth/2,-visualHeight/2);
    console.log("pixel");
  };


  this.spreadSize = (1+Math.random())*4;

  //  there are a lot of very visible pixel holes in the spread images when doing this
  //  this.spreadBackground = color(Math.random()*255,Math.random()*255,Math.random()*255);

  this.spreadBackground = 0;

  this.spread = function() {
    img.loadPixels();
    push();
    fill(10);
    strokeWeight(1);
    stroke(255);
    rect(-visualWidth/2, -visualHeight/2, visualWidth, visualHeight);
    circle.show();
    pop();
    //background(this.spreadBackground);
    let image1Points = [];
    if (this.image1) {
      this.image1.loadPixels();
      let p = [-visualWidth/2,-visualHeight/2];
      let b = p[1] - this.pm * p[0];
      //let x2 = p[0] + Math.cos(this.angle)*(this.spreadIterations/((maxSize&maxSize*this.spreadSize)/12));
      let x2 = p[0] + Math.cos(this.angle)*(this.spreadIterations/Math.sqrt(maxSize))*this.spreadSize;

      let y2 = x2 * this.pm + b;
      //image(this.image1, Math.round(x2),Math.round(y2));
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
          if ( x2 > -visualWidth/2 && x2 < visualWidth/2 && y2 > -visualHeight/2 && y2 < visualHeight/2) {
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
        this.image1.set(p[0]+visualWidth/2,p[1]+visualWidth/2,img.get(p[0]+visualWidth/2,p[1]+visualWidth/2));
      }
      this.image1.updatePixels();
      console.log(image1Points);
      console.log(this.image1.get(0,0));
      image(this.image1, -visualWidth/2,-visualHeight/2);
    };

    //Same process for 2nd side

    let image2Points = [];
    if (this.image2) {
      this.image2.loadPixels();
      let p = [-visualWidth/2,-visualHeight/2];
      let b = p[1] - this.pm * p[0];
      let x2 = p[0] - Math.cos(this.angle)*(this.spreadIterations/Math.sqrt(maxSize))*this.spreadSize;
      let y2 = x2 * this.pm + b;
      //image(this.image2, Math.round(x2),Math.round(y2));
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
        this.image2.set(p[0]+visualWidth/2,p[1]+visualWidth/2,img.get(p[0]+visualWidth/2,p[1]+visualWidth/2));
      }
      this.image2.updatePixels();
      console.log(image2Points);
      console.log(this.image2.get(0,0));
      image(this.image2, -visualWidth/2,-visualHeight/2);
    }


    if (this.spreadIterations > 0) {
      stroke(Math.random()*0);
      for (let i = 0; i < this.prevPoints.length; i++) {
        let p = this.prevPoints[i];
        //point(p[0],p[1]);
      }
    }

    this.prevPoints = [];

    this.spreadIterations++;
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
    //this.showPerpendicularLine();
    stroke(255);
    console.log(this.points.length);
    img.loadPixels();

      for (let j = 0; j < this.points.length; j++) {
        let p = this.points[j];
        for (let i = -1; i < 2; i++) {
          let b = p[1] - this.pm * p[0];
          let x2 = p[0] + Math.cos(this.angle)*i;
          let y2 = x2 * this.pm + b;
          if ( x2 > -visualWidth/2 && x2 < visualWidth/2 && y2 > -visualHeight/2 && y2 < visualHeight/2) {
            img.set(Math.round(x2+visualHeight/2),Math.round(y2+visualHeight/2),255);
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

  createLoop({duration:gifLength, gif:true});
}

function draw() {
  translate(width / 2, height / 2);
  //let t1 = new Tear();
  //t1.createPoints();
  //t1.show();
  if (elapsedFrames >= totalFrames + 5) {
    ////capturer.stop();
    //capturer.save();
  } else if (elapsedFrames === 0) {
    //capturer.start();
  } else {
    tears[tears.length-1].spread();
    //capturer.capture(document.getElementById('defaultCanvas0'));
    console.log(`Frames: ${elapsedFrames} / ${totalFrames}`);
  }
  elapsedFrames++;
}
