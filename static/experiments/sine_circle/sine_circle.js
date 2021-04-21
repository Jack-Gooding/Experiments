let myCanvas;
let fps = 30;
let scaler = 1;
let gifLength = 18;

let bgImg;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

let cWidth = 200 * scaler;
let cHeight = 200 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let numPoints = 2;
let numCircles = 30;

let numTwists = 1;

let baseCircle;

let circles = [];


class Circle {
    constructor(numLines = 1, rotation = 0, r = maxSize/4,  x = 0, y = 0 ) {
      this.r = r;
      this.x = y;
      this.y = x;
      this.numLines = numLines;
      this.rotation = rotation;
      this.numPoints = 64;
      this.points = [];
    }


/*
*/

    createPoints = function() {
      //let rotation = map(Math.random(),0,1,0,TWO_PI);
      for (let i = 0; i < this.numPoints; i++) {
        let theta = map(i, 0, this.numPoints, this.rotation, TWO_PI+this.rotation);
        this.points.push(createVector(this.x + this.r*cos(theta), this.y + this.r*sin(theta)));
      }
    };

    show = function() {
      push();
      strokeWeight(1);
      fill(Math.random()*255,Math.random()*255,Math.random()*255,0);
      noFill();

      beginShape();

      this.points.forEach(function(p) {
        vertex(p.x,p.y);
        //point(p.x,p.y);
      })
      //endShape(CLOSE);
      endShape(CLOSE);
      //point(this.x,this.y);
      //circle(this.x,this.y,this.r*2);
      pop();
    }

    showLines = function(num) {
      for (let i = 0; i < this.numLines; i++) {
        push();
        let rotation = map(i, 0, this.numLines, 0, PI);
        let hue = Math.round(map(i, 0, this.numLines, 0, 360));
        rotate(rotation);
        //line(this.x,this.y-this.r,this.x,this.y+this.r);
        strokeWeight(this.r/6);
        let rot2 = map(num, 0, totalFrames, -PI+rotation, PI+rotation);
        let mod = Math.sin(rot2)*this.r;
        stroke(200);
        fill(hue, 100, 100);
        translate(0,mod,1);
        strokeWeight(1);
        //sphere(this.r/12);
        circle(this.x,this.y,this.r/6);
        //point(this.x,this.y+mod,1);
        pop();
      };
    }


};

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


function setup() {

  setAttributes('antialias', true);
  $("#canvas-target").html("");
  myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");
  translate(width/2,height/2);
  frameRate(fps);
  stroke(200);
  strokeWeight(1);
  noFill();
  noiseDetail(8, 0.3);
  colorMode(HSB, 360, 100, 100);
  background(0);
  bgImg = createImage(width,height);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      bgImg.set(i,j,color(Math.random()*255,Math.random()*Math.random()*255,Math.random()*Math.random()*Math.random()*Math.random()*90));
    }
  }
  bgImg.updatePixels();
  //image(bgImg,-width/2,-height/2);
  //let rotation = map(Math.random(),0,1,0,TWO_PI);
  //translate(width / 2, height / 2);
  baseCircle = new Circle(2);
  baseCircle.createPoints();
  //baseCircle.show();
  baseCircle.showLines();
  //Starts the gif
  createLoop({duration:gifLength, gif:true});
}

function draw() {

  //background(40);
  translate(width/2,height/2);
  
  push();
  fill(40);
  //rect(-width/2,-height/2, height, width);
  pop();
  clear();
  //image(bgImg,-width/2,-height/2);
  //baseCircle.show();
  baseCircle.showLines(elapsedFrames*3);
  if (elapsedFrames === 135) {
    baseCircle.numLines = 4;
  } else if (elapsedFrames === 270) {
    baseCircle.numLines = 8;
  } else if (elapsedFrames === 360) {
    baseCircle.numLines = 16;
  }
  if (elapsedFrames > totalFrames) {
    elapsedFrames = 0;
  } else {
    console.log(`Frame ${elapsedFrames}\\${totalFrames}`);
  }
  elapsedFrames++;
}
