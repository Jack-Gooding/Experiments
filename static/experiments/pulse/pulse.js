let bgColour = 20;

let moons = [];
let totalMoons = 12;

$(document).ready(function() {

});

function drawCircle(x, y, radius) {
  for (var i = 0; i <= 360; i+=.01) {
    rect(x, y, cos(i) * radius, sin(i) * radius);
  }
}

function Moon(init) {

  this.x = width/2;
  this.y = height/2;
  this.r = 1;
  this.scaler = 3;
  this.points = [];
  this.seed = init;

  this.createPoints = function() {
    console.log(this.seed);
    for (let i = 0; i < 200; i++) {
      let theta = map(i, 0, 138, -PI+PI*2*(moons.length/totalMoons), PI+PI*2*(moons.length/totalMoons));
      this.points.push(createVector(this.x + (this.r+this.scaler*i)*cos(theta), this.y + (this.r+this.scaler*i)*sin(theta)));
    }
  }

  this.show = function() {
    this.points.forEach(function(pt, index) {
      strokeWeight(Math.floor(noise(-index/10+frameCount/10, init)*4)*3);
      stroke(255);
      point(pt.x,pt.y);
    })
  }
}

function setup() {
  $("#canvas-target").html("");
  var myCanvas = createCanvas(window.innerWidth, window.innerHeight-80);
  myCanvas.parent("canvas-target");
  for (let i= 0; i< totalMoons; i++) {
    moon = new Moon(moons.length*5);
    moon.createPoints();
    moons.push(moon);
  }
  frameRate(15);
  noiseSeed(99);

}

function draw() {
  // Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
  let fps = 12;
  $("#perf-stats").html("FPS: " + fps.toFixed(2));
  background(bgColour);
  strokeWeight(1);
  stroke(255);
  point(width/2,height/2);
  moons.forEach(function(moon) {
    //ellipse(element.x,element.y,5);
    moon.show();
  });

}
