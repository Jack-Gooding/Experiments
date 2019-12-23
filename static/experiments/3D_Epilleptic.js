let cWidth = 300;
let cHeight = 300;

let total = 8;
let lineDetail = 5;
let linePairs = 20;
let radius = 100;

let moons = [];

var easycam;

function Moon(x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.points = [];
  this.pointers = [];
  this.buildSphere = function() {

    for (let i = 0; i < total+1; i++) {
      let lon = map(i, 0, total, 0, PI);
      this.points.push([]);
      for (let j = 0; j < total+1; j++) {
        let lat = map(j, 0, total, 0, TWO_PI);
        let x = radius*Math.sin(lat)*Math.cos(lon);
        let y = radius*Math.sin(lat)*Math.sin(lon);
        let z = radius*Math.cos(lat);
        this.points[i][j] = {x:x,y:y,z:z};
      }
    }
    console.log(this.points);
  }

  this.createPoints = function() {
    for (let i = 0; i < linePairs*2; i++) {
      let lon1 = map(Math.random(), 0, 1, 0, PI);
      let lat1 = map(Math.random(), 0, 1, 0, TWO_PI);
      let lon2 = map(Math.random(), 0, 1, 0, PI);
      let lat2 = map(Math.random(), 0, 1, 0, TWO_PI);
      this.pointers.push([]);
      let pointArr = [];
      for (let j = 0; j < lineDetail*2; j++) {
        let lon = map(j, 0, lineDetail*2, lon1, lon2);
        let lat = map(j, 0, lineDetail*2, lat1, lat2);
        let x = radius*Math.sin(lat)*Math.cos(lon);
        let y = radius*Math.sin(lat)*Math.sin(lon);
        let z = radius*Math.cos(lat);
        pointArr.push({x:x,y:y,z:z});
        this.pointers[i] = pointArr;
      }
    };
    console.log(this.pointers)

  }

  this.show = function() {
    for (let i = 0; i < this.pointers.length; i++) {
      let p = this.pointers[i];
      stroke(Math.random()*255,Math.random()*255,Math.random()*255);
      beginShape();
      for (let j = 0; j < this.pointers[i].length; j++)  {
        strokeWeight(3);
        //point(p[j].x,p[j].y,p[j].z);
        vertex(p[j].x,p[j].y,p[j].z);
      }
      endShape();
    }
    for (let i = 0; i < this.points.length; i++) {
      for (let j = 0; j < this.points[i].length; j++) {
          stroke(255);
          strokeWeight(2);
          let p = this.points[i][j];
          strokeWeight(.1);
          point(p.x,p.y,p.z);

        }
    }
  }

}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);


  // fix for EasyCam to work with p5 v0.7.2
  Dw.EasyCam.prototype.apply = function(n) {
    var o = this.cam;
    n = n || o.renderer,
    n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
  };

  easycam = createEasyCam({distance:300});

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

  $("#perf-stats").html("FPS: " + fps.toFixed(2));

  background(51);
  moons.forEach(function(moon) {
    moon.show();
  });

  point(0,0,0);

}
