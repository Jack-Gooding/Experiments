let myCanvas;

let cWidth = 200;
let cHeight = 200;
let maxSize = Math.sqrt(cWidth*cWidth+cHeight*cHeight);

let noiseScale = 0.08;

let tears = [];

let displacement = 0;

let img;

let createTear = function() {
  let tear = {
    angle: 0,
    x: 0,
    y: 0,
    points: [],
  };

  tear.angle = Math.floor(Math.random()*90);
  tear.x = (maxSize/2)*Math.tan(tear.angle);

  //step 1
  //    Find equation of circle
  //    Circle equation ->
  //
  //     (x - a)^2 + (y - b)^2 = r^2
  //     (x - 0)^2 + (y - 0)^2 = (maxSize / 2)^2
  //     x^2 + y^2 = maxSize^2 / 4


  //step 2
  //    find equation of line
  //
  //    y = mx + b
  //    0,0,tear.x,maxSize/2
  //
  //    m = y1 - y2 / x1 - x2
  let m = (0 - maxSize/2) / (0 - tear.x);
  //
  //    y - y1 = m(x -x1)
  //    y - maxSize/2 = m(x - tear.x)
  //    y = m(x - tear.x) + maxSize/2
  //
  //      let lineEquation =

  //step 3
  //    find point of intersection
  //
  //    x^2 + (m(x - tear.x) + maxSize/2)^2 = (maxSize/2)^2
  //    x^2 + ( m * x + (m * (-tear.x) + maxSize/2))^2 = (maxSize/2)^2
  //
  //  FILO
  //    (m*x + (m(-tear.x) + maxSize/2)) * (m*x + (m(-tear.x) + maxSize/2)))
  //    0 = x^2 + 2m*x^2 + 2m*x*(m(-tear.x) + maxSize/2) + (m(-tear.x)+maxSize/2)^2 - (maxSize/2)^2
  //
  //   Quadratic Formula
  //
  //   x = ( -b +- sqrt(b^2 -4ac) ) / 2 * a
  //   x = ( -2m*x*(m(-tear.x) + maxSize/2 + sqrt(  (2m*x*(m(-tear.x) + maxSize/2)^2) - 4*(x^2 + 2m*x^2)*((m(-tear.x)+maxSize/2)^2 - (maxSize/2)^2) ) / 2*(x^2 + 2m*x^2) )
  //   a = (1 +2m)
  //   b = (2m)
  //   c = ( (m(-tear.x)+maxSize/2)^2 - (maxSize/2)^2 )
  //   x = ( -2m + sqrt(2m^2 - 4*(1+2m)*((m(-tear.x)+maxSize/2)^2 - (maxSize/2)^2))) / 2*(1 +2m)

  let  x1 = ( -2*m + Math.sqrt(2*m*m - 4*(1+2*m)*(Math.pow((m*(-tear.x)+maxSize/2),2) - Math.pow((maxSize/2),2)))) / 2*(1 +2*m);
  let  x2 = ( -2*m - Math.sqrt(2*m*m - 4*(1+2*m)*(Math.pow((m*(-tear.x)+maxSize/2),2) - Math.pow((maxSize/2),2)))) / 2*(1 +2*m);

  let  y1 = m*(x1 - tear.x) + maxSize/2;
  let  y2 = m*(x2 - tear.x) + maxSize/2;
  console.log(tear.x, x1,y1);
  console.log(tear.x, x2,y2);



  //tear.y = (maxSize/4)/Math.cos(tear.angle);

  //console.log(tear.x,tear.y);

  let zVal = Math.random()*tears.length*20;

  for (let i = 0; i < cHeight; i++) {
    let noiseVal = noise(cWidth*noiseScale,i*noiseScale,zVal);
    tear.points.push([cWidth/2+noiseVal*20,i]);
  }
  tears.push(tear);
};

function setup() {
  img = createImage(cWidth, cHeight);
  img.loadPixels();
  $("#canvas-target").html("");
  var myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      img.set(i, j, 0);
    }
  }
  img.updatePixels();
  image(img, 0, 0);
  stroke(255);
  noFill();
  noiseDetail(8, 0.1);
  createTear();
}

function draw() {
  img.loadPixels();
  for (let i = 0; i < 2; i++) {
    tears[tears.length-1].points.forEach(function(p) {
      img.set(p[0]+displacement*(i > 0 ? 1 : -1),p[1], 255);
      if (displacement > 0) {
        img.set(p[0]+(displacement-1)*(i > 0 ? 1 : -1),p[1], 0);
      }
    })
  }

  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {

    }
  }

  displacement++;
  if (displacement > cWidth/8) {
    displacement = 0;
    createTear();
  }
  img.updatePixels();
  image(img, 0, 0);
  line(cWidth/2,cHeight/2,tears[tears.length-1].x,tears[tears.length-1].y);
  circle(cWidth/2,cHeight/2,maxSize/2);
}
