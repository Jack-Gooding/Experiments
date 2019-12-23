let cWidth = 300;
let cHeight = 300;

let total = 8;
let lineDetail = 5;
let linePairs = 1000;
let radius = 100;

let moons = [];
let grid;

let starGraphics;

var easycam;

function polarise(cX,cY) {
  let x = radius*Math.sin(cX)*Math.cos(cY);
  let y = radius*Math.sin(cX)*Math.sin(cY);
  let z = radius*Math.cos(cX);
  return {x: x, y: y, z: z};
}

function Cartesian(x, y, h) {
  this.x = x;
  this.y = y;
  this.h = h

  this.pointers = [];

  this.show = function() {
    noFill(0);
    stroke(200);
    strokeWeight(1);
    beginShape();
    vertex(this.x, this.y, 0);
    vertex(this.x+this.h, this.y, 0);
    vertex(this.x+this.h, this.y+this.h, 0);
    vertex(this.x, this.y+this.h, 0);
    vertex(this.x, this.y, 0);
    endShape();

    line(this.x+this.h/2,this.y,this.x+this.h/2,this.y+this.h);
    line(this.x,this.y+this.h/2,this.x+this.h,this.y+this.h/2);

    for (let i = 0; i < this.pointers.length; i++) {
      noFill();
      stroke(Math.random()*255,Math.random()*255,Math.random()*255);
      strokeWeight(2);
      beginShape();
      for (let j = 0; j < this.pointers[i].length; j++) {
        let p = this.pointers[i][j];
        let x = map(p.x, 0, PI, -this.h/2, this.h/2);
        let y = map(p.y, 0, TWO_PI, -this.h/2, this.h/2);
        vertex(this.x+this.h/2+x,this.y+this.h/2+y);
      }
      endShape();
    }
  }
}
function Moon(x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.origin;

  this.points = [];
  this.pointers = [];
  this.buildSphere = function() {

    for (let i = 0; i < total+1; i++) {
      let lat = map(i, 0, total, 0, PI);
      this.points.push([]);
      for (let j = 0; j < total+1; j++) {
        let lon = map(j, 0, total, 0, TWO_PI);
        this.points[i][j] = polarise(lat,lon);
      }
    }
    console.log(this.points);
  }

  this.createPoints = function() {
    for (let i = 0; i < linePairs; i++) {
      let lat1 = map(Math.random(), 0, 1, 0, PI);
      let lat2 = map(Math.random(), 0, 1, 0, PI);
      let lon1 = map(Math.random(), 0, 1, 0, TWO_PI);
      let lon2 = map(Math.random(), 0, 1, 0, TWO_PI);
      //(lon1 - lon2 > PI) , minus Pi from smallest
      if (Math.abs(lon1 - lon2) > PI) {
        if (lon1 > lon2) {
          lon1 -= TWO_PI;
        } else {
          lon2 -= TWO_PI;
        }
      }
      this.pointers.push([]);
      grid.pointers.push([]);
      let pointArr = [];
      let cartArr = [];
      for (let j = 0; j < lineDetail; j++) {
        let lat = map(j, 0, lineDetail*2, lat1, lat2);
        let lon = map(j, 0, lineDetail*2, lon1, lon2);
//        cartArr.push({x:lat,y:lon});
        pointArr.push(polarise(lat,lon));

        let start = polarise(lat1,lon1);
        let target = polarise(lat2,lon2);
        let x = map(j, 0, lineDetail, start.x, target.x);
        let y = map(j, 0, lineDetail, start.y, target.y);
        let z = map(j, 0, lineDetail, start.z, target.z);
        //pointArr.push({x:x,y:y,z:z});
      }
      this.pointers[i] = pointArr;
      grid.pointers[i] = cartArr;
    };
    grid.pointers.push([{x:0,y:0},{x:PI,y:1}]);
    console.log([polarise(0,0),polarise(0,1)]);
    this.pointers.push([polarise(HALF_PI,-.6),polarise(HALF_PI/2,.6)]);
    console.log(this.pointers)

  }

  this.show = function() {
    for (let i = 0; i < this.pointers.length; i++) {
      let p = this.pointers[i];
      //stroke(Math.random()*255,Math.random()*255,Math.random()*255);
      stroke(200,200,200,0.5);
      strokeWeight(.5);
      noFill();
      beginShape(LINES);
      for (let j = 0; j < this.pointers[i].length; j++)  {
        //point(p[j].x,p[j].y,p[j].z);
        vertex(p[j].x,p[j].y,p[j].z);
      }
      endShape();
    }
    for (let i = 0; i < this.points.length; i++) {
      for (let j = 0; j < this.points[i].length; j++) {
          stroke(200,200,200,0.5);
          strokeWeight(.5);
          let p = this.points[i][j];
          strokeWeight(.1);
          point(p.x,p.y,p.z);

        }
    }
    strokeWeight(10);
    let origin = polarise(0,0);
    let top = polarise(PI,TWO_PI);
    let mid = polarise(HALF_PI,0);

    point(origin.x, origin.y, origin.z);
    point(top.x, top.y, top.z);
    point(mid.x, mid.y, mid.z);
  }

}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  starGraphics = createGraphics(windowWidth, windowHeight, WEBGL);
  starGraphics.background(255);

  // fix for EasyCam to work with p5 v0.7.2
  Dw.EasyCam.prototype.apply = function(n) {
    var o = this.cam;
    n = n || o.renderer,
    n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
  };

  easycam = createEasyCam({distance:500});
  grid = new Cartesian(200,0,200);

  document.oncontextmenu = function() { return false; }
  document.onmousedown   = function() { return false; }
  moons.push(new Moon(0,0,0));
  moons.forEach(function(moon) {
    moon.buildSphere();
    moon.createPoints();
  });


}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]);
}


function draw(){
  // Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
  let fps = frameRate();
  background(51);
  starGraphics.ellipse(starGraphics.width / 2, starGraphics.height / 2, 50, 50);
  image(starGraphics, 0, 0);

  $("#perf-stats").html("FPS: " + fps.toFixed(2));

  moons.forEach(function(moon) {
    moon.show();
  });
  //grid.show();
  point(0,0,0);

}
