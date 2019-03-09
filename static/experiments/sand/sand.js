let cWidth = 400;
let cHeight = 400;

let spots = [];
let flat = [];
let initialSand = 100000;
let totalSand = 100000;

let height0 = "#0000ff";
let height1 = "#4400bb";
let height2 = "#bb0044";
let height3 = "#00ffcc";

let time0;
let time1;

$(document).ready(function() {
  $("#totalSand").val(totalSand);
})

$(function(){
    $('#color-picker1').colorpicker({color: height0});
    $('#color-picker2').colorpicker({color: height1});
    $('#color-picker3').colorpicker({color: height2});
    $('#color-picker4').colorpicker({color: height3});

    $('#color-picker1').on('changeColor.colorpicker', function() {
      height0 = $(this).colorpicker('getValue');
    });

    $('#color-picker2').on('changeColor.colorpicker', function() {
      height1 = $(this).colorpicker('getValue');
    });

    $('#color-picker3').on('changeColor.colorpicker', function() {
      height2 = $(this).colorpicker('getValue');
    });

    $('#color-picker4').on('changeColor.colorpicker', function() {
      height3 = $(this).colorpicker('getValue');
    });
});

function render() {
  for (let x = 0; x < cWidth; x++) {
    for (let y = 0; y < cHeight; y++) {
      if (spots[x][y].height > 0) {
        spots[x][y].show(true);
      }
    }
  }
}

function Spot(x,y) {
  this.x = x;
  this.y = y;

  this.colour = 0;
  this.stableColour = 0;
  this.height = 0;
  this.enabled = false;
  this.neighbours = [];

  this.addNeighbours = function() {
    if (this.x > 0) {
      this.neighbours.push(spots[x-1][y]);
    }
    if (this.y > 0) {
      this.neighbours.push(spots[x][y-1]);
    }
    if (this.x < cWidth-1) {
      this.neighbours.push(spots[x+1][y]);
    }
    if (this.y < cHeight-1) {
      this.neighbours.push(spots[x][y+1]);
    }
  }

  this.addSand = function(sand) {
    this.height += sand || 1;
    this.enable = true;
  }

  this.distribute = function() {
    for (let i = 0; i < this.neighbours.length; i++) {
      this.neighbours[i].height++;
      this.neighbours[i].enable = true;
    }
    this.height -= 4;
  }

  this.show = function(stable) {
    //this.colour = map(this.height,0,4,0,255);
    if (this.height === 0) {
      this.colour = height0;
    } else if (this.height === 1) {
      this.colour = height1;
    } else if (this.height === 2) {
      this.colour = height2;
    } else if (this.height >= 3) {
      this.colour = height3;
    }
    if (stable) {
      this.stableColour = this.colour;
      stroke(this.colour);
    } else {
      stroke(this.stableColour);
    }
    point(this.x,this.y);
  }
}

function addSand(e) {
  totalSand += Number($("#addSand").val());
  initialSand += Number($("#addSand").val());

}

function setup() {
    $("#canvas-target").html("");
    var myCanvas = createCanvas(cWidth, cHeight);
    myCanvas.parent("canvas-target");

    for (let x = 0; x < cWidth; x++) {
      spots.push([]);
      for (let y = 0; y < cHeight; y++) {
        let spot = new Spot(x,y);
        spots[x].push(spot);
      }
    }

    for (let x = 0; x < cWidth; x++) {
      spots.push([]);
      for (let y = 0; y < cHeight; y++) {
        let spot = new Spot(x,y);
        spots[x][y].addNeighbours();
      }
    }
    console.log(spots.length);
    //spots[Math.floor(cWidth/2)][Math.floor(cHeight/2)].addSand(totalSand);
    //totalSand = 0;
    time0 = new Date().getTime();
}



function draw() {
  frameRate(60);
  background(0);
  stable = true;
  for (let x = 0; x < cWidth; x++) {
    for (let y = 0; y < cHeight; y++) {
      let spot = spots[x][y];
      if(spots[x][y].height >= 4) {
        spot.distribute();
        stable = false;
      };
    }
  }
  //console.log(stable);

  if (stable) {
    for (let x = 0; x < cWidth; x++) {
      for (let y = 0; y < cHeight; y++) {
        if (spots[x][y].enable) {
          spots[x][y].show(true);
        }
      }
    }
    if (totalSand > 4) {
      spots[Math.floor(cWidth/2)][Math.floor(cHeight/2)].addSand(3);
      totalSand -= 3;
    } else {
      noLoop();
    }
  } else {
    for (let x = 0; x < cWidth; x++) {
      for (let y = 0; y < cHeight; y++) {
        if (spots[x][y].enable) {
          spots[x][y].show(false);
        }
      }
    }
    //$("#perf-stats").text(spots[Math.floor(cWidth/2)][Math.floor(cHeight/2)].height);
  };
  time1 = new Date().getTime();
  $("#perf-stats").text(`sand/sec: ${Math.floor((initialSand-totalSand)/((time1-time0)/1000))}`);
  $("#totalSand").val(totalSand);

}
