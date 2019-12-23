let cWidth = 300;
let cHeight = 300;

let total = 50;
let radius = 100;

let moons = [];

var easycam;

function Moon(x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.points = [];

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

  this.show = function() {
    for (let i = 0; i < this.points.length; i++) {
      for (let j = 0; j < this.points[i].length; j++) {
          stroke(255);
          strokeWeight(1);
          let p = this.points[i][j];
          strokeWeight(.1);
          if (i < this.points.length-1) {

          line(this.points[i][j].x,this.points[i][j].y,this.points[i][j].z,this.points[i+1][j].x,this.points[i+1][j].y,this.points[i+1][j].z)
        }  else {
          line(this.points[i][j].x,this.points[i][j].y,this.points[i][j].z,this.points[i+1-this.points.length][j].x,this.points[i+1-this.points.length][j].y,this.points[i+1-this.points.length][j].z)

        }
        if (j < this.points[i].length-1) {
          line(this.points[i][j].x,this.points[i][j].y,this.points[i][j].z,this.points[i][j+1].x,this.points[i][j+1].y,this.points[i][j+1].z)
        } else {
          line(this.points[i][j].x,this.points[i][j].y,this.points[i][j].z,this.points[i][j+1-this.points[i].length].x,this.points[i][j+1-this.points[i].length].y,this.points[i][j+1-this.points[i].length].z)
        }
          //point(point.x,point.y,point.z);
          point(p.x,p.y,p.z);
          if(!this.points[i][j].target) {
          if (true) {

          let maxOffset = 1;
          let a = i + Math.floor(Math.random()*maxOffset*2-maxOffset);
          if (a < 0) {
            a+=this.points.length;
          } else if (a > this.points.length-1) {
            a-=this.points.length;
          }
          let b = j + Math.floor(Math.random()*maxOffset*2-maxOffset);
          if (b < 0) {
            b+=this.points[i].length;
          } else if (b > this.points[i].length-1) {
            b-=this.points[i].length;
          }
          this.points[i][j].target = this.points[a][b];

        } else {

          this.points[i][j].target = this.points[Math.floor(Math.random()*this.points.length)][Math.floor(Math.random()*this.points[i].length)];
          }
          }

          //line(p.x,p.y,p.z,p.target.x,p.target.y,p.target.z);
          fill(255);
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
