let img;

function preload() {
  img = loadImage('http://localhost:4000/mug'); // Load the image
}

function setup() {
  img.loadPixels();
  createCanvas(img.width,img.height)
  console.log(img.width, img.height);
  let pink = color(255, 102, 204);
let d = pixelDensity();
let halfImage = 4 * (img.width * d) * (img.height * d);
let target = [41,124,166]
let closest = 1000;
let location;
for (let i = 0; i < halfImage; i += 4) {
  let newC = Math.abs(target[0] - img.pixels[i]) +  Math.abs(target[1] - img.pixels[i+1]) + Math.abs(target[2] - img.pixels[i+2]);
  if (newC <= closest) {
    closest = newC;
    location = [((i/4)%(img.width)),(Math.ceil((i/4) / (img.width*d)))]
  }
  }
  console.log(closest);
  console.log(`location: [${location[0]},${location[1]}]`)
  img.updatePixels();
  //image(img,0,0,width,height);
  fill(0);
  stroke(255);
  rectMode(CENTER);
  rect(location[0],location[1],20,20);
    //image(img,0,0,width,height);
}

function draw() {
  background(255);
  img.loadPixels();
  let d = pixelDensity();
  let halfImage = 4 * (img.width * d) * (img.height * d);
  let pixelSizeX = Math.ceil((1+mouseX)/4);
  let pixelSizeY = Math.ceil((1+mouseY)/4);
  let rows = 0;
  console.log(rows);
  for (let i = 0; i < halfImage; i += 4*pixelSizeX) {
/*
    if (i/Math.floor(img.width* d/4)*4 >= rows) {
      rows++;
      i+=Math.floor(img.width*pixelSizeY/4)*4;
    }*/
    if (Math.floor(i/(img.width*4)) > rows*pixelSizeY) {
      i-=i%img.width*4;
      if (i/(img.width*4) > rows) {
        i+=Math.floor(img.width/4)*16*pixelSizeY;
      }
      i-=i%(img.width*4);
      rows++;
      //i+=img.width*d*pixelSizeY*4;
      //i = rows*img.width*4*pixelSizeY+1;
      //i=Math.floor(i/img.width)*img.width;
    }
      stroke(img.pixels[i],img.pixels[i+1],img.pixels[i+2])
      fill(img.pixels[i],img.pixels[i+1],img.pixels[i+2])
      rectMode(CENTER);
      rect(((i/4)%(img.width* d)),(Math.ceil((i/4) / (img.width*d))),pixelSizeX,pixelSizeY);
      stroke(0);
      fill(0);
      point(((i/4)%(img.width* d)),(Math.ceil((i/4) / (img.width*d))))
  }
}
