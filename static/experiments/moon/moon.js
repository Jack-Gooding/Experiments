let cWidth = 600;
let cHeight = 600;

let moons = [];
let stars = [];

let moonRadius = 120;
let moonCount = 2;
let lineCount = 360;

let starCount = 3200;

let distType = "Random";
let sigma = 50;
let lineOffset = 0;

let bgColour = 20;

$(document).ready(function() {

$('#bgColour').val(bgColour);
$('#bgColour').on('input',function(e){
  let c = this.value.split(",");
  if (this.value.split(",").length === 3) {
    bgColour = [c[0],c[1],c[2]];
  } else {
    bgColour = [c[0],c[0],c[0]];
  }
});


$('#moonCount').val(moonCount);
$('#moonCount').on('input',function(e){
  if (!isNaN(this.value)) {
    moonCount = this.value;
  }
});

$('#starCount').val(starCount);
$('#starCount').on('input',function(e){
  if (!isNaN(this.value)) {
    starCount = this.value;
  }
});

$('#lineCount').val(lineCount);
$('#lineCount').on('input',function(e){
  if (!isNaN(this.value)) {
    lineCount = this.value;
  }
});

$('#distType').val(distType);
$('#distType').on('input',function(e){
  if (this.value === "Random") {
    distType = "Random";
    $('#sigma, #lineOffset').prop("disabled", true);
  } else if (this.value === "Gaussian Random"){
    distType = "Gaussian";
    $('#sigma, #lineOffset').prop("disabled", false);
  } else {
    distType = "Inverse Gaussian";
    $('#sigma, #lineOffset').prop("disabled", false);

  }
});

$('#sigma, #lineOffset').prop("disabled", true);

$('#sigma').val(sigma);
$('#sigma').on('input',function(e){
  if (!isNaN(this.value)) {
    sigma = this.value;
  }
});

$('#lineOffset').val(lineOffset);
$('#lineOffset').on('input',function(e){
  if (!isNaN(this.value)) {
    lineOffset = this.value;
  }
});

$('#moonRadius').val(moonRadius);
$('#moonRadius').on('input',function(e){
  if (!isNaN(this.value)) {
    moonRadius = this.value;
  }
});

$('#canvasSize').val(`${cWidth},${cHeight}`);
$('#canvasSize').on('input',function(e){
  let v = this.value.split(",");
  console.log(v);
  if (v.length === 2 && !isNaN(v[0]) && !isNaN(v[1])) {
      cWidth = v[0];
      cHeight = v[1];
      console.log(cWidth);
      console.log(cHeight);


    }
});

});

function drawCircle(x, y, radius) {
  for (var i = 0; i <= 360; i+=.01) {
    rect(x, y, cos(i) * radius, sin(i) * radius);
  }
}

function resetCanvas() {
  resizeCanvas(cWidth, cHeight);
  prepareEnvironment();
}

function Moon() {
  this.r = Math.random()*80+40;
  this.x = Math.random()*(width-this.r*2)+this.r;
  this.y = Math.random()*(height-this.r*2)+this.r;

  this.points = [];

  this.colour = [map(this.r,0,120,0,255)];

  this.createPoints = function() {
    for (let i = 0; i < lineCount; i++) {
      let theta = map(i, 0, lineCount, -PI, PI);
      this.points.push(createVector(this.x + this.r*cos(theta), this.y + this.r*sin(theta)));
    }
  }

  this.show = function() {
    stroke(this.colour);
    beginShape();
    fill(bgColour);
    for (let i = 0; i < this.points.length; i++) {
      vertex(this.points[i].x, this.points[i].y);
    }
    endShape();
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].target) {
        target = this.points[i].target;
      } else {
        if (distType === "Random") {
          random = Math.floor(Math.random()*this.points.length);
        } else if (distType === "Inverse Gaussian") {
          //randomGaussian(mean,standardDistribution)
          random = i- this.points.length/2 + Math.floor(randomGaussian(this.points.length/2-this.points.length*lineOffset/100, sigma));
        } else if (distType === "Gaussian") {
          random = i + Math.floor(randomGaussian(this.points.length/2-this.points.length*lineOffset/100, sigma));
        }
        if (random >= this.points.length) {
          random -= this.points.length * Math.floor(random / this.points.length);
        } else if (random < 0) {
          random += this.points.length * Math.abs(Math.floor(random / this.points.length));
        };

        target = this.points[random];
        this.points[i].target = target;
      }
      element = this.points[i];
      line(element.x,element.y,target.x,target.y);
      //point(element.x,element.y);
    }
    }
}

function Star() {
  this.x = Math.random()*width;
  this.y = Math.random()*height;
  this.colour = Math.random()>.9 ? (Math.random()>0.5 ? [255,255-Math.random()*150,255-Math.random()*150] :[255-Math.random()*150,255-Math.random()*150,255]) : [255-Math.random()*150];
  this.hidden = false;
  this.show = function() {
    for (let i = 0; i < moons.length; i++) {
      moon = moons[i];
      if (dist(moon.x,moon.y,this.x,this.y) < moon.r) {
        this.hidden = true;
      }
    }
    if (this.hidden === false) {
      stroke(this.colour);
      point(this.x,this.y);
    }
  };
}


function createStars() {
  stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }
}

function createMoons() {
  moons = [];
  for (let i = 0; i < moonCount; i++) {
    moon = new Moon();
    moon.createPoints();
    moons.push(moon);
  }
}

function prepareEnvironment() {
  createStars();
  createMoons();
  redraw();
}

function setup() {
  $("#canvas-target").html("");
  var myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");
  prepareEnvironment();
}

function draw() {
  frameRate(0.05);
  background(bgColour);
  strokeWeight(1);
  stroke(255);

  moons.forEach(function(moon) {
    //ellipse(element.x,element.y,5);
    moon.show();
  });

  stars.forEach(function(star) {
    star.show();
  })
}
