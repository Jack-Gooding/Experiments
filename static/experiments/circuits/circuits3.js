let numTiles = 15;
let tiles = [];
let numCircles = 10;
let circles = [];
let tileSize = 40;
let wh = numTiles*tileSize+1;
let tile
function setup() {
  createCanvas(wh, wh);
  //there's a "b" for every "a"
  //for (let a = 10; a < width; a += 30) {
    //for (let b = 10; b < height; b += 30) {
      //add the circles to the array at x = a and y = b
    //  circles.push(new Circle(a, b));
    //}
  //}
  for (let i = 0; i <numCircles; i++) {
  circles[i] = new Circle();
  }
  for (let i = 0; i < numTiles; i++) {
    tiles[i] = [];
    for (let j = 0; j < numTiles; j++) {
      tiles[i][j] = {x: i, y:j, used: false,}
    }
  }
  console.log(tiles);
  console.log(circles.length);
  strokeWeight(3);

noLoop();
}


function draw() {
  background(50);
  let oldCircle = [];


  for (let i = 0; i <= width; i+=tileSize) {
      stroke(100);
      line(i, 0, i, height);
      line(0, i, width, i);
  }


  for (let i = 0; i < circles.length; i++) {
    circles[i].show(i);
    circles[i].setUsed();

    let smallestDistance = wh;


    for (let j = 0; j < circles.length; j++) {
      let d = dist(circles[i].x, circles[i].y, circles[j].x, circles[j].y);
      if (d < smallestDistance && i != j && !circles[j].used) {
        smallestDistance = d;
        circles[i].updateClosest(j);
      }
    }
    circles[circles[i].closest].setUsed();

    if (oldCircle.length ) {
      circles[i].connect(circles[i].x,circles[i].y,circles[circles[i].closest].x,circles[circles[i].closest].y, i)
    }
    console.log(smallestDistance+","+i);
  oldCircle = [circles[i].x,circles[i].y];
  console.log(circles[i].closest+","+i+","+circles[i].x/tileSize+","+circles[i].y/tileSize);
}
}

function Circle(x, y) {
  this.x = Math.ceil(Math.random()*numTiles)*tileSize-tileSize/2;
  this.y = Math.ceil(Math.random()*numTiles)*tileSize-tileSize/2;
  this.used = false;
  this.closest = 0;

  this.show = function(num) {
    fill(50);
    stroke((255/numCircles*(num+1)),200,(255-(255/numCircles*(num+1))));
    ellipse(this.x, this.y, 15, 15);
    //console.log("showing");
  }

  this.connect = function(x1, y1, x2, y2, num) {
    stroke((255/numCircles*(num+1)),200,(255-(255/numCircles*(num+1))));
    if (Math.floor(Math.random()*2)) {
      let truePath = true;
      for (let i = 0; i < Math.abs(Math.floor(y1-y2)/tileSize); i++) {        //for all squares along y axis to new point
        if (tiles[Math.floor(y1/tileSize)+i][Math.floor(x1/tileSize)].used) { // if any tiles have been used, declare false
          truePath = false;
          console.log("OVERLAP");
        }
        //console.log(tiles[Math.floor(y1/tileSize)+i][Math.floor(x1/tileSize)]);
        }
        if (truePath) {
          line(x1, y1, x1, y2);
          for (let i = 0; i < Math.abs(Math.floor(y1-y2)/tileSize); i++) {
          tiles[Math.floor(y1/tileSize)+i][Math.floor(x1/tileSize)].c1 = {x: x1, y: y1};
          tiles[Math.floor(y1/tileSize)+i][Math.floor(x1/tileSize)].c2 = {x: x2, y: y2};
          tiles[Math.floor(y1/tileSize)+i][Math.floor(x1/tileSize)].used = true;
          }
        } else {
          truePath = true;
          let array = [];
          for (let i = 0; i < tileCount; i++) {
            for (let j = 0; j <tileCount; j++) {
              if (tiles[Math.floor(y1/tileSize)+i][Math.floor(x1/tileSize)+j].used) {
                truePath = false;
                array[i][j] = {i: i, i:j};
              }
            }
          }
          console.log(array);
        }
      line(x1, y2, x2, y2);
    } else {
      line(x1, y1, x2, y1);
      line(x2, y1, x2, y2);
    }
    //console.log(Math.floor(x1/tileSize)+","+Math.floor(x2/tileSize)+","+Math.floor(y1/tileSize)+","+Math.floor(y2/tileSize));
    //console.log("joined")
    console.log(tiles);
  }
  this.setUsed = function() {
    this.used = true;
  }

  this.updateClosest = function(closest) {
    this.closest = closest;
  }
}
