let myCanvas;
let fps = 12;
let scaler = 1;
let gifLength = 5;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

let cWidth = 3000 * scaler;
let cHeight = 3000 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let noiseScale = 0.002;

let openSimplexNoise = new OpenSimplexNoise(Math.floor(Math.random()*5000));


let planeCount = 80;

class Plane {
    constructor(planeNumber = 0) {
      this.planeSize = planeSize;
      this.heightMod = 0;
    }

    generatePoints = function() {
    };

    show = () => {
    };

};

let sketch = function (p) {

    p.setup = function () {


      $("#canvas-target").html("");
      myCanvas = p.createCanvas(cWidth, cHeight, p.WEBGL);
      myCanvas.parent("canvas-target");
      p.frameRate(fps);
      //translate(width / 2, height / 2);
      p.strokeWeight(1);
      p.noFill();
      p.noiseDetail(8, 0.3);
      p.colorMode(p.HSB, 255, 255, 255);
      p.smooth();
      //let rotation = map(Math.random(),0,1,0,TWO_PI);
      //Starts the gif
      if (true) {

        p.angleMode(p.DEGREES);
        p.rotateX(90-35.264);
        p.rotateZ(45);

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
        // $("#frame-counter").text(`Frame Count: 0/${totalFrames}`);
        // createLoop({duration:gifLength, gif:true});
    };

    p.draw = function () {
      // background(160,60,60);
      // p.background(220);
      // angleMode(DEGREES);
      // rotateX(90-35.264-20);
      // rotateZ(30);
      p.angleMode(p.RADIANS);
      p.stroke(0);
      p.strokeWeight(2);
      // translate(0,0,100);
      // translate(0,-80,0);
      for (let n = 0; n < 1; n++) {
      p.stroke(Math.random()*255,150,150);
      p.push();
      let openSimplexNoise = new OpenSimplexNoise(Math.floor(Math.random()*5000));
      let x = Math.random()*200;
      let y = Math.random()*200;
      p.translate(100-x,100-y);

      for (let i = -20; i < planeCount+20; i++ ) {
        p.push();
        // translate(0,0,-5*i);
        // translate(0,2*i,0);

        let planeRatio = i/planeCount;
        if (planeRatio > 1) {
          planeRatio = 1;
        } else if (planeRatio < 0) {
          planeRatio = 0;
        };
        let expansionDamper = 1;
        if (planeRatio >= 0.9) {
        } else if (planeRatio < 0.1) {
          //expansionDamper =
          expansionDamper = 0.99;
        }
        let pointCount = 360;
        let points = [];

        for (let j = 0; j < pointCount; j++) {
          let theta = p.map(j, 0, pointCount, 0, p.TWO_PI);
          let x = Math.cos(theta)*600;
          let y = Math.sin(theta)*600;
          let noiseVal = openSimplexNoise.noise2D(x*noiseScale,y*noiseScale);
          // let noiseX = x*planeRatio+x*noiseVal*(1-planeRatio);
          // let noiseY = y*planeRatio+y*noiseVal*(1-planeRatio);
          // let noiseY = (y+((y*noiseVal/1.5)*planeRatio)*2/(1+planeRatio));// * Math.pow(expansionDamper, 2);
          // let noiseX = (x+((x*noiseVal/1.5)*planeRatio)*2/(1+planeRatio));// * Math.pow(expansionDamper, 2);
          let damping = 1;
          let multiplic = 1;
          if (i < 0) {
            multiplic = Math.abs(i);
            damping = Math.pow(1.12,Math.pow(0.92,multiplic))/1.11;
          }
          let noiseX = ((x+(x*noiseVal/1.5)*planeRatio)*2/(1+planeRatio))/damping;
          let noiseY = ((y+(y*noiseVal/1.5)*planeRatio)*2/(1+planeRatio))/damping;
          // push();
          // strokeWeight(2);
          // stroke("green");
          // point(noiseX,noiseY);
          // pop();
          points.push([noiseX,noiseY]);
        };

        for (let j = 0; j < points.length; j++) {
          let p1 = points[j];
          let p2;
          if (j >= points.length-1) {
            p2 = points[0];
          } else {
            p2 = points[j+1];
          }
          p.line(p1[0],p1[1],p2[0],p2[1]);
          if (Math.random()<0.001) {
            //circle(p1[0],p1[1],(maxSize/20)*(0.2+Math.random()*.8));
          }
        };

        p.pop();
      };
      p.pop();
      };

      console.log("Done!");
      p.noLoop();
    };


    p.mousePressed = function() {
    };

    p.save_canvas = function() {
        p.save();
    }
};

cvs = new p5(sketch, "my_image");
cvs.type = "NORMAL";

svg = new p5(sketch, "hidden_div");
svg.type = "SVG";
