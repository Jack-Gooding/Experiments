let myCanvas;
let fps = 12;
let scaler = 1;
let gifLength = 5;

let totalFrames = gifLength*fps;
let elapsedFrames = 0;

let cWidth = 831 * scaler;
let cHeight = 548 * scaler;

let visualWidth = cWidth * 1.2  * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(visualWidth*visualWidth+visualHeight*visualHeight);

let noiseScale = 0.02;

let openSimplexNoise = new OpenSimplexNoise(Math.floor(Math.random()*5000));


let planeCount = 20;

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


function setup() {


  $("#canvas-target").html("");
  myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");
  frameRate(fps);
  //translate(width / 2, height / 2);
  strokeWeight(1);
  noFill();
  noiseDetail(8, 0.3);
  colorMode(HSB, 255, 255, 255);
  smooth();
  //let rotation = map(Math.random(),0,1,0,TWO_PI);
  //Starts the gif
  if (true) {

    angleMode(DEGREES);
    // rotateX(90-35.264);
    // rotateZ(45);

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
    noLoop();

}

function draw() {
  // background(160,60,60);
  translate(width/2,height/2);
  background(220);
  // angleMode(DEGREES);
  // rotateX(90-35.264-20);
  // rotateZ(30);
  angleMode(RADIANS);
  stroke(0);
  strokeWeight(2);
  // translate(0,0,100);
  // translate(0,-80,0);
  for (let n = 0; n < 3; n++) {
  stroke(Math.random()*255,150,150);
  push();
  let openSimplexNoise = new OpenSimplexNoise(Math.floor(Math.random()*5000));
  let x = Math.random()*120;
  let y = Math.random()*120;
  //translate(100-x,100-y);
  for (let i = 0; i < planeCount+20; i++ ) {
    push();
    // translate(0,0,-5*i);
    // translate(0,2*i,0);

    let planeRatio = i/planeCount;
    if (planeRatio > 1) {
      planeRatio = 1;
    }
    let expansionDamper = 1;
    if (planeRatio >= 0.9) {
      expansionDamper = (planeRatio-0.9)*10;
    }
    let pointCount = 360;
    let points = [];

    for (let j = 0; j < pointCount; j++) {
      let theta = map(j, 0, pointCount, 0, TWO_PI);
      let x = Math.cos(theta)*100;
      let y = Math.sin(theta)*100;
      let noiseVal = openSimplexNoise.noise2D(x*noiseScale,y*noiseScale);
      // let noiseX = x*planeRatio+x*noiseVal*(1-planeRatio);
      // let noiseY = y*planeRatio+y*noiseVal*(1-planeRatio);
      let noiseX = (x+(x*noiseVal/1.5)*planeRatio)*2/(1+planeRatio);
      let noiseY = (y+(y*noiseVal/1.5)*planeRatio)*2/(1+planeRatio);
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
      line(p1[0],p1[1],p2[0],p2[1]);
      if (Math.random()<0.001) {
        //circle(p1[0],p1[1],(maxSize/20)*(0.2+Math.random()*.8));
      }
    };

    pop();
  };
  pop();
};

  console.log("Done!");
  noLoop();
}
