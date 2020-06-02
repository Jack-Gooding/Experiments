let img;
let myCanvas;

let xVal = 0;
let yVal = 0;

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            loadImage(URL.createObjectURL(input.files[0]), img2 => {
              console.log(img2);
              console.log(img2.width,img2.height);
              console.log(img.width,img.height);
              img = img2;
              //image(img2, 0, 0);
              image(img, 20, 20);
              resizeCanvas(img.width, img.height);
            });
            //img = loadImage(URL.createObjectURL(input.files[0]));
            console.log("Loaded Image");
        }

        reader.readAsDataURL(input.files[0]);
    }
}


function setup() {

  $("#canvas-target").html("");
  myCanvas = createCanvas(200, 200);
  myCanvas.parent("canvas-target");
  frameRate(30);
  img = createImage(200,200);
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      if (Math.round(Math.random()*1.8)) {
        img.set(i,j,color(Math.round(Math.random()*254),Math.round(Math.random()*254),Math.round(Math.random()*254)));
      } else {
        img.set(i,j,255);
      };
    }
  }
  img.updatePixels();
}

function draw() {


  let newX = Math.max(mouseX,0);
  let newY = Math.max(mouseY,0);
  if (newX !== xVal || newY !== yVal) {
    img.loadPixels();
    background(255);
    image(img,0,0);
    xVal = newX;
    yVal = newY;
    let pixelSizeX = 2 + Math.min(xVal,img.width-2);
    let pixelSizeY = 2 + Math.min(yVal,img.height-2);
    for (let i = 0; i < img.width; i += pixelSizeX) {
      for (let j = 0; j < img.height; j += pixelSizeY) {
        let r = img.pixels[i*4+j*img.width*4];
        let g = img.pixels[i*4+j*img.width*4+1];
        let b = img.pixels[i*4+j*img.width*4+2];
        let a = img.pixels[i*4+j*img.width*4+3];

        let c = color(r,g,b,a)
        stroke(c);
        fill(c);
        rect(i,j,pixelSizeX,pixelSizeY);
      }
    }
  }
}
