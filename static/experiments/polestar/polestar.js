let myCanvas;
let fps = 1;
let scaler = 1;
let gifLength = 1;

let totalFrames = gifLength * fps;
let elapsedFrames = 0;

// let cWidth = 800 * scaler;
// let cHeight = 1200 * scaler;

let cWidth = 400 * scaler;
let cHeight = 400 * scaler;

let visualWidth = cWidth * 1.2 * scaler;
let visualHeight = cHeight * 1.2 * scaler;

let maxSize = Math.sqrt(
  visualWidth * visualWidth + visualHeight * visualHeight
);

let noiseScale = 0.02;

let starfield;

let gBackground;

let numPlanes = 3 + Math.round(Math.random() * 3);
let planes = [];

let filmGrains = [];

let currentTime;

class Starfield {
  constructor(starCount = 2000) {
    this.starCount = starCount;
    this.points = [];
  }

  generateStars = () => {
    //Polestar();
    this.points.push({
      x: 0 + Math.random() * 6,
      y: 0 + Math.random() * 6,
      magnitude: 3.2,
      hue: Math.random() * 255,
      saturation: Math.random() * 30,
      brightness: 180 + Math.random() * 75,
      opacity: 1,
    });

    for (let i = 0; i < this.starCount; i++) {
      this.points.push({
        x: Math.random() * maxSize - maxSize / 2,
        y: Math.random() * maxSize - maxSize / 2,
        magnitude: Math.pow(3, Math.random() + 0.1),
        hue: Math.random() * 255,
        saturation: Math.random() * Math.random() * 60,
        brightness: 120 + Math.random() * 180,
        opacity: Math.random() * Math.random(),
      });
    }
  };

  show = (opacityMod = 1) => {
    this.points.forEach((p) => {
      push();
      strokeWeight(p.magnitude);
      colorMode(HSB, 255, 255, 255, 1);
      let opacity = noise(this.x * noiseScale, this.y * noiseScale);
      stroke(p.hue, p.saturation, p.brightness, p.opacity * opacityMod);
      point(p.x, p.y);
      pop();
    });
  };
}

class PopPlane {
  constructor(width, height, bgColour, noiseMag = noiseScale, heightMod) {
    this.width = width;
    this.height = height;
    this.bgColour = bgColour;
    this.points = [];
    this.heightMod = heightMod;
    this.noiseMag = noiseMag;
  }

  generatePath = () => {
    for (let i = 0; i < this.width; i++) {
      let noiseVal = noise(
        i * noiseScale * this.noiseMag,
        (this.height + this.heightMod) * noiseScale * this.noiseMag
      );
      noiseVal = map(noiseVal, 0, 1, -1, 1);
      this.points.push([
        i,
        this.height + this.heightMod + noiseVal * 400 * this.noiseMag,
      ]);
    }
  };

  show = () => {
    push();

    beginShape();
    vertex(this.points[0][0], visualHeight);
    fill(this.bgColour);
    noStroke();
    this.points.forEach((p) => {
      // point(p[0],p[1]);
      vertex(p[0], p[1]);
    });
    vertex(this.points[this.points.length - 1][0], visualHeight);
    endShape(CLOSE);

    pop();
  };
}

class GradientBackground {
  constructor(radius, x, y, c1, c2) {
    this.radius;
    this.x = x;
    this.y = y;
    this.colour1 = c1;
    this.colour2 = c2;
  }

  show = () => {
    if (!this.radius) {
      let d1 = dist(this.x, this.y, 0, 0);
      let d2 = dist(this.x, this.y, cWidth, 0);

      if (d1 >= d2) {
        this.radius = d1;
      } else {
        this.radius = d2;
      }
    }
    push();
    noFill();
    strokeWeight(1);
    for (let i = 0; i < this.radius; i += 0.1) {
      let lerpVal = map(i, 0, this.radius, 0, 1);
      let lerpColour = lerpColor(this.colour1, this.colour2, lerpVal);
      stroke(lerpColour);
      circle(this.x, this.y, i * 2);
    }
    pop();
  };
}

class FilmGrain {
  constructor(severity = 0.2) {
    this.severity = severity;
    this.img;
  }

  generateImage = () => {
    this.img = createImage(cWidth, cHeight);
    this.img.loadPixels();

    push();
    colorMode(HSB, 255, 255, 255, 1);
    for (let x = 0; x < this.img.width; x++) {
      for (let y = 0; y < this.img.height; y++) {
        let c = color(
          Math.random() * 255,
          Math.random() * 30,
          255 / 2 + Math.random() * 30,
          Math.random() * this.severity
        );
        this.img.set(x, y, c);
      }
    }
    this.img.updatePixels();
    pop();
  };

  show = () => {
    if (this.img) {
      image(this.img, 0, 0);
    } else {
      this.generateImage();
      this.show();
    }
  };
}

function setup() {
  $("#canvas-target").html("");
  myCanvas = createCanvas(cWidth, cHeight);
  myCanvas.parent("canvas-target");

  currentTime = `${hour()}:${minute()}`;

  frameRate(fps);
  smooth();
  stroke(255);
  strokeWeight(1);
  angleMode(DEGREES);
  noFill();
  noiseDetail(8, 0.3);
  background(26, 26, 27);
  colorMode(HSB, 255, 255, 255);
  //Starts the gif

  starfield = new Starfield();
  starfield.generateStars();
  // starfield.show();

  for (let i = numPlanes - 1; i >= 0; i--) {
    let hue = Math.random() * 255;
    let sat = 80 - (Math.random() * i * 32) / numPlanes;
    let bri = 90 - i * 16 - (Math.random() * i * 20) / numPlanes;

    let brightness = 90 - i * 16 - (Math.random() * i * 20) / numPlanes;

    let bg = color(hue, sat, bri);

    let newPlane = new PopPlane(
      visualWidth,
      (visualHeight * 3) / 4,
      bg,
      (i + 1) / 10,
      (-visualHeight * i) / 16
    );
    newPlane.generatePath();
    planes.push(newPlane);
  }

  for (let i = 0; i < 12; i++) {
    let grainyBackground = new FilmGrain();
    grainyBackground.generateImage();
    filmGrains.push(grainyBackground);
  }

  $("#frame-counter").text(`Frame Count: 0/${totalFrames}`);
  createLoop({ duration: gifLength, gif: true });
}

function draw() {
  // background(20);

  if (elapsedFrames >= totalFrames) {
  } else if (elapsedFrames === 0) {
    //first frame

    //Calculate Background
    let c1 = color(
      Math.random() * 255,
      50 + Math.random() * 100,
      Math.random() * 120
    );
    let c2 = color(
      Math.random() * 255,
      50 + Math.random() * 100,
      Math.random() * 60
    );

    gBackground = new GradientBackground(
      maxSize / 1.4,
      Math.random() * cWidth,
      (visualHeight * 3) / 4,
      c1,
      c2
    );
    gBackground.show();

    //Draw Starfield
    totalpoints = 100;
    for (let i = 0; i < totalpoints; i++) {
      push();
      translate((cWidth * 2) / 3, cHeight / 6);
      rotate(-i / 4);
      let opacityMod = ((i / totalpoints) * i) / totalpoints;
      starfield.show(opacityMod);
      pop();
    }

    for (let i = 0; i < planes.length - 1; i++) {
      planes[i].show();
    }

    let rGrain = Math.floor(Math.random() * (filmGrains.length - 1));
    filmGrains[rGrain].show();

    // saveCanvas(`Polestar - ${currentTime} - ${elapsedFrames}`, 'jpg');
  } else {
    //gif frames

    gBackground.show();

    //Draw Starfield
    totalpoints = 100;
    for (let i = 0; i < totalpoints; i++) {
      push();
      translate((cWidth * 2) / 3, cHeight / 6);
      rotate(-1 * elapsedFrames - i / 4);
      let opacityMod = ((i / totalpoints) * i) / totalpoints;
      starfield.show(opacityMod);
      pop();
    }

    for (let i = 0; i < planes.length - 1; i++) {
      planes[i].show();
    }

    let rGrain = Math.floor(Math.random() * (filmGrains.length - 1));
    filmGrains[rGrain].show();

    $("#frame-counter").text(
      `Frame Count: ${elapsedFrames + 1}/${totalFrames}`
    );
    console.log(`Frame ${elapsedFrames}\\${totalFrames}`);
  }

  elapsedFrames++;
}
