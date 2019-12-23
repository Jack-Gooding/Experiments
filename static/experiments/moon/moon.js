let cWidth = 600;
let cHeight = 600;

let moons = [];
let stars = [];

let moonRadius = 120;
let moonCount = 1;
let lineCount = 200;

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
  this.r = Math.random()*moonRadius*.7+moonRadius*.3;
  this.x = Math.random()*(width-this.r*2)+this.r;
  this.y = Math.random()*(height-this.r*2)+this.r;

  this.points = [];
  this.children = [];

  this.colour = [map(this.r,0,moonRadius,0,255)];

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
    vertex(this.points[0].x, this.points[0].y);
    endShape(CLOSE);
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
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].show();
        this.children[i].update();
      }
    }

    this.createChild = function() {
      let child = new Sun(this);
      this.children.push(child);
      child.createPoints();
    }
}

function Sun(parent,points, createPoints, show, children, createChild) {
  Moon.call(this, points, createPoints, show, children, createChild);
  this.colour = [150+Math.random()*105,150+Math.random()*105,150+Math.random()*105];
  this.parent = parent;
  this.r = parent.r/2;
  this.offSet = parent.offSet/2 || this.r/2;
  this.angle = Math.random();
  //this.y = parent.y+(parent.r+this.offSet+this.r)*sin(map(this.angle, 0, 1, -PI, PI));
  //this.x = parent.x+(parent.r+this.offSet+this.r)*cos(map(this.angle, 0, 1, -PI, PI));
  this.x = parent.x+parent.r+this.offSet+this.r;
  this.y = parent.y;
  this.update = function() {
    push();
    this.angle+=0.05;
    translate(parent.x,parent.y);
    rotate(this.angle);
    translate(this.r+parent.r,0);
    point(this.r+this.parent.r,0);
    for (let i = 0; i < this.points.length; i++) {
      point(this.points[i].x-this.parent.x,this.points[i].y-this.parent.y)
      //this.points[i].x-=parent.x;
      //this.points[i].y-=parent.y;
    }
    strokeWeight(1);
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].target) {
        target = this.points[i].target;
      } else {
        if (distType === "Random") {
          random = Math.floor(Math.random()*this.points.length);
        }
        target = this.points[random];
        this.points[i].target = target;
      }
      element = this.points[i];
      line(element.x-this.parent.x,element.y-this.parent.y,target.x-this.parent.x,target.y-this.parent.y);
      //point(element.x,element.y);
    }
    point(0,0);
    //this.y = parent.y+(parent.r+this.offSet+this.r)*sin(map(this.angle, 0, 1, -PI, PI));
    //this.x = parent.x+(parent.r+this.offSet+this.r)*cos(map(this.angle, 0, 1, -PI, PI));
    /*
    y = parent.y+(parent.r+this.offSet+this.r)*sin(map(this.angle, 0, 1, -PI, PI));
    x = parent.x+(parent.r+this.offSet+this.r)*cos(map(this.angle, 0, 1, -PI, PI));
    this.x = x;
    this.y = y;
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].x += x-this.x;
      this.points[i].y += y-this.y;
    }
    */
    pop();
  }
}

function Star() {
  this.x = Math.random()*width;
  this.y = Math.random()*height;
  this.colour = Math.random()>.9 ? (Math.random()>0.5 ? [255,255-Math.random()*150,255-Math.random()*150] :[255-Math.random()*150,255-Math.random()*150,255]) : [255-Math.random()*150];
  this.show = function() {
      stroke(this.colour);
      point(this.x,this.y);

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
  moons.forEach(function(moon) {
    //moon.createChild();
  });
  //moons[0].children[0].createChild();
  //moons[0].children[0].children[0].createChild();

  redraw();
}

function setup() {
  $("#canvas-target").html("");
  var myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");
  prepareEnvironment();
}

function draw() {
  // Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
  let fps = frameRate();

  $("#perf-stats").html("FPS: " + fps.toFixed(2));

  background(bgColour);
  strokeWeight(1);
  stroke(255);
  point(1,2);
  stars.forEach(function(star) {
    star.show();
  });
  moons.forEach(function(moon) {
    //ellipse(element.x,element.y,5);
    moon.show();
  });

}
