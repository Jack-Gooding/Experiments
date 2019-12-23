let sWidth = window.innerWidth;
let sHeight = window.innerHeight;

let maxIterations = 20;

let minValueX = -2;
let maxValueX = 2;
let minValueY = -2*sHeight/sWidth;
let maxValueY = 2*sHeight/sWidth;

function setup() {
  let canvas = createCanvas(sWidth,sHeight);
  canvas.parent('#sketch-holder');
  pixelDensity(1);

  noLoop();
}

function draw() {
  loadPixels();
  for (let x = 0; x < sWidth; x++) {
    for (let y = 0; y < sHeight; y++) {
      let a = map (x, 0, width, minValueX, maxValueX);
      let b = map (y, 0, height, minValueY, maxValueY);

      var ca = a;
      var cb = b;

      let z = 0;
      let iterations = 0;

      for (let i = 0; i < maxIterations; i++) {
        iterations = i;

        let aa = a * a - b * b;
        let bb = 2 * a * b;

        a = aa + ca;
        b = bb + cb;

        if (abs(a + b) > 8) {
          i = maxIterations;
        }
      }

      let brightness = map(iterations, 0, maxIterations, 0, 1);

      let hsv = HSVtoRGB(brightness, 1, 1);

      let pixel = (x + y*width)*4;
      pixels[pixel + 0] = hsv.r;
      pixels[pixel + 1] = hsv.g;
      pixels[pixel + 2] = hsv.b;
      pixels[pixel + 3] = 255;
    }
  }

  updatePixels();
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
function mouseWheel(event) {
  //move the square according to the vertical scroll amount
  let x = map(mouseX, 0, sWidth, minValueX, maxValueX);
  let y = map(mouseY, 0, sHeight, minValueY, maxValueY);
  console.log(event.delta);
  let zoomAmount = .9;
  if (parseInt(event.delta) >= 0) {
    zoomAmount = .9;
  } else {
    zoomAmount = 1.3;
  }


  minValueX = (x-(x-minValueX)*zoomAmount);
  minValueY = (y-(y-minValueY)*zoomAmount);
  maxValueX = (x+(maxValueX-x)*zoomAmount);
  maxValueY = (y+(maxValueY-y)*zoomAmount);

  redraw();
  //uncomment to block page scrolling
  return false;

}
