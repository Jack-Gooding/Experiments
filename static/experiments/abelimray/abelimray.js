let sWidth = 400;
let sHeight = 400;

let sComb = (sWidth+sHeight)/2;

let viewSizeX = 200;
let viewSizeY = 200;

let speed = .5;

let points = [];

let Point = function() {
  this.x = Math.random()*sWidth;
  this.y = Math.random()*sHeight;

  this.r = 2+Math.random()*3;

  this.xOffset = -speed+Math.random()*speed*2;
  this.yOffset = -speed+Math.random()*speed*2;

  this.reset = function() {
    //this.x = Math.random()*sWidth;
    //this.y = Math.random()*sHeight;

    //this.r = 2+Math.random()*3;

    //this.xOffset = -speed+Math.random()*speed*2;
    //this.yOffset = -speed+Math.random()*speed*2;

    if (Math.floor(Math.random()*2)) {
      let rand = Math.floor(Math.random()*2);
      this.x = (rand) ? 0 : sWidth;
      this.y = Math.random()*sHeight;
      this.xOffset = (rand) ? Math.random()*speed : -Math.random()*speed;
    } else {
      let rand = Math.floor(Math.random()*2);
      this.x = Math.random()*sWidth;
      this.y = (rand) ? 0 : sHeight;
      this.yOffset = (rand) ? Math.random()*speed : -Math.random()*speed;
    }

  }

  this.update = function() {
    this.x += this.xOffset;
    this.y += this.yOffset;

    if (this.x > sWidth || this.x < 0 || this.y > sHeight || this.y < 0) {
        this.reset();
    }
  }

  this.show = function() {
    circle(this.x,this.y,this.r)
  }


}

function setup() {
  createCanvas(sWidth,sHeight)
  strokeWeight(3);
  stroke(180);
  fill(180);
  colorMode(RGB, 255);

  for (let i = 0; i < 100; i++) {
    let p = new Point();
    points.push(p);
  };
}

function draw() {
  background("beige");
  stroke(160);
  fill(160);
  points.forEach(function(p) {
    p.update();
    points.forEach(function(p2) {
      let d = dist(p.x,p.y,p2.x,p2.y);
      if (d < sComb/5) {
        let power = map(d,0,sComb/5,1,0);
        let a = 160*Math.pow(power,2)
        stroke(180,180,180,a);
        line(p.x,p.y,p2.x,p2.y);
      }
    })
  });
  points.forEach(function(p) {
    p.show();
  });


  push();
  let fps = frameRate();
  fill(0);
  noStroke();
  text("FPS: " + fps.toFixed(2), 10, height - 10);
  pop();
}


window.onresize = function() {
  sWidth = window.innerWidth;
  sHeight = window.innerHeight;
  canvas.size(sWidth,sHeight);

};
