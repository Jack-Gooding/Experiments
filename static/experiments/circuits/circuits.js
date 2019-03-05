let startDraw = false; //encloses draw function, when true, draw runs.


// // // controls visuals only//
let showGrid = true;
let showWalls = false;
let showSets = false;
let useHeuristics = true;

let wireColour = [120,255,40];
let bgColour = [65];
let gridColour = [35];

let fr = 5; //frameRate, higher = faster

let numTiles = 15; //number of tiles in each row/column. always square.

//holds all tiles. structure is: numTiles arrays, containing numTiles 'Tile' objects
let tiles = [];

let numCircles = 16;
//holds all circles. simple array containing 'Circle' objects
let circles = [];

//used to determine when a path is finished, and to start the next.
let numWires = 0;

let tileSize = 40; //size of tiles in px

let wh = numTiles*tileSize; //width / height of canvas, created to display full tiles + grid

//Two arrays to hold "open" tiles to be assessed, and "closed" tiles which have been assessed
let openSet = [];
let closedSet = [];

//Array containing tile path locations.
let path = [];
let oldPaths = [];
// start,end = circle.x,y
let start;
let end;

// will be 'true' when openSet empty, closedSet full, with no more tiles available to examine
let noSolution = false;

//Configuring options, uses "bootstrap-toggle" library to display
$(document).ready(function() {
  $("#showSets").bootstrapToggle('off');
  $("#showGrid").bootstrapToggle('on');
  $("#showWalls").bootstrapToggle('off');
  $("#useHeuristics").bootstrapToggle('on');

  $('#showSets').change(function() {
    if ($(this).prop('checked')) {
      showSets = true;
    } else {
      showSets = false;
    }
  })

  $('#showWalls').change(function() {
    if ($(this).prop('checked')) {
      showWalls = true;
    } else {
      showWalls = false;
    }
  })

  $('#showGrid').change(function() {
    if ($(this).prop('checked')) {
      showGrid = true;
    } else {
      showGrid = false;
    }
  })

  $('#useHeuristics').change(function() {
    if ($(this).prop('checked')) {
      useHeuristics = true;
    } else {
      useHeuristics = false;
    }
  })

  $('#wireColour').val(wireColour);
  $('#wireColour').on('input',function(e){
    let v = this.value.split(":");
    console.log(v);
    if (v.length > 1) {
      let c = v[1].split(",");
      if(v[0] == "random") {
          wireColour = "random";
      } else if (v[0] == "similar") {
          wireColour = "similar";
        } else if (v[0] == "classic") {
          wireColour = "classic";
        }
      } else {
    let c = this.value.split(",");
    console.log(`c: ${c}`);
    c.forEach(function(ele) {
      console.log(ele);
    })
    if (c.length === 3) {
      wireColour = [c[0],c[1],c[2]];
    } else {
      wireColour = [c[0],c[0],c[0]];
  }
}
});

$('#bgColour').val(bgColour);
$('#bgColour').on('input',function(e){

  console.log(this.value.split(",").length);
  let c = this.value.split(",");
  if (this.value.split(",").length === 3) {
    bgColour = [c[0],c[1],c[2]];
  } else {
    bgColour = [c[0],c[0],c[0]];
}
});

$('#gridColour').val(gridColour);
$('#gridColour').on('input',function(e){

  console.log(this.value.split(",").length);
  let c = this.value.split(",");
  if (this.value.split(",").length === 3) {
    gridColour = [c[0],c[1],c[2]];
  } else {
    gridColour = [c[0],c[0],c[0]];
}
});

});


function Circle(x, y) { //Constructor object for "through-hole" circles of circuit board.
  this.rawX = x;
  this.rawY = y;
  this.x = x*tileSize+tileSize/2;
  this.y = y*tileSize+tileSize/2;
  this.pair = 0;
  this.colour;
  this.show = function(num, col) {
    this.pair = num*2;
    if(col == "random") {
      if (circles[this.pair].colour) {
        this.colour = circles[this.pair].colour;
      } else {
        this.colour = [Math.random()*255,Math.random()*255,Math.random()*255];
      }
    } else if (col == "similar") {
      if (circles[this.pair].colour) {
        r = circles[this.pair].colour > 210 ? circles[this.pair].colour - 40 : (circles[this.pair].colour < 50 ? circles[this.pair].colour + 40 : (Math.random() > 0.5 ? circles[this.pair].colour + 40: circles[this.pair].colour -40));
        g = circles[this.pair].colour > 210 ? circles[this.pair].colour - 40 : (circles[this.pair].colour < 50 ? circles[this.pair].colour + 40 : (Math.random() > 0.5 ? circles[this.pair].colour + 40: circles[this.pair].colour -40));
        b = circles[this.pair].colour > 210 ? circles[this.pair].colour - 40 : (circles[this.pair].colour < 50 ? circles[this.pair].colour + 40 : (Math.random() > 0.5 ? circles[this.pair].colour + 40: circles[this.pair].colour -40));;
        //this.colour = [r,g,b];
        this.colour = circles[this.pair].colour
      } else if (!circles[this.pair].colour) {
        this.colour = [Math.random()*255,Math.random()*255,Math.random()*255];
      }
    } else if (col == "classic") {
      console.log("classic 2");
      this.colour = [(255/numCircles*(this.pair+1)),200,(255-(255/numCircles*(this.pair+1)))]
    } else {
      this.colour = col;
    }
    fill(this.colour);
    stroke(this.colour);
    ellipse(this.x, this.y, 15, 15);
    //console.log("showing");
  }
}




function removeFromArray(arr, elm) {
  for (let i = arr.length -1; i>= 0; i--) {
    if (arr[i] == elm) {
      arr.splice(i,1);
    }
  }
}

function beginDraw() {
  reset();
  startDraw = true;
 }

function heuristic(start,end) { //called per 'openSet' Tile, to assign this.h

  //heuristic; an educated guess used to make informed decisions, in this case, which tiles to prioritise checking

  //euclidian distance, raw pixels. This gives inconsistent behaviour
  //return dist(start.x, start.y, end.x, end.y);

  //manhattan distance, sum of x-tiles + y tiles.
  let xComponent;
  let yComponent;

  //Complicated, checks distance from   start -> end, and    start -> wall -> opposite wall -> end (once for each side)
  //sets x/yComponent to the lower of the three values, to allow looping through walls.
  if (Math.abs(wh-start.x*tileSize+end.x*tileSize) < Math.abs(start.x*tileSize-end.x*tileSize)) {
    xComponent = Math.abs(wh-start.x*tileSize+end.x*tileSize);
  } else if (Math.abs(start.x*tileSize+wh-end.x*tileSize) < Math.abs(start.x*tileSize-end.x*tileSize)) {
    xComponent = Math.abs(start.x*tileSize+wh-end.x*tileSize);
  } else {
    xComponent = Math.abs(start.x*tileSize-end.x*tileSize);
  }

  if (Math.abs(wh-start.y*tileSize+end.y*tileSize) < Math.abs(start.y*tileSize-end.y*tileSize)) {
    yComponent = Math.abs(wh-start.y*tileSize+end.y*tileSize);
  } else if (Math.abs(start.y*tileSize+wh-end.y*tileSize) < Math.abs(start.y*tileSize-end.y*tileSize)) {
    yComponent = Math.abs(start.y*tileSize+wh-end.y*tileSize);
  } else {
    yComponent = Math.abs(start.y*tileSize-end.y*tileSize);
  }

  return xComponent+yComponent;
}

function reset() { //Runs at start of drawing. Can be called multiple times.

  openSet = [];
  closedSet = [];
  circles = [];
  path = [];
  oldPaths = [];
  numWires = 0;

  for (let i = 0; i < numTiles; i++) { //Create array with Cartesian coordinates, using i=x,j=y
    tiles[i] = [];
    for (let j = 0; j < numTiles; j++) {
      tiles[i][j] = new Tile(i,j);
    }
  }


  /*for (let i = 0; i < numTiles; i++) { //Diagnostic, randomly set tiles to 'used'/'wall' status, preventing them from being used in pathfinding or placement.
    x = Math.ceil(Math.random()*numTiles-1);
    y = Math.ceil(Math.random()*numTiles-1);
      tiles[x][y].used = true;
  }*/

  for (let i = 0; i < numTiles; i++) { //add neighbours to all tiles, as array.
    for (let j = 0; j < numTiles; j++) {
      tiles[i][j].addNeighbours(tiles);
    }
  }


  while (circles.length < numCircles) { //generate randomly placed circles until numCircles exist
    x = Math.ceil(Math.random()*(numTiles-2));
    y = Math.ceil(Math.random()*(numTiles-2));

    let acceptable = true; //assume these x,y coords are valid, unless told otherwise by following checks.

    for (let j = 0; j < circles.length; j++) { //if attempted placement is on existing circle, generate new x,y
      if ((circles[j].rawX == x && circles[j].rawY == y )) {
        acceptable = false;
      }
    }

    if (tiles[x][y].used) { //if attempted placement is a wall, or used, generate new x,y
      acceptable = false;
    }

    if (acceptable) {
      circles[circles.length] = new Circle(x,y);
    }
  }

  for (let i = 0; i < numTiles; i++) { //iterate circles & tiles arrays, prevent any circles from entering the openSet with the 'used' flag
    for (let j = 0; j < numTiles; j++) {
      for (let k = 0; k < circles.length; k++) {
        if (circles[k].rawX == tiles[i][j].x && circles[k].rawY == tiles[i][j].y) {
          tiles[i][j].used = true;
        }
      }
    }
  }


  start = tiles[circles[0].rawX][circles[0].rawY]; //set initial 'start'
  end = tiles[circles[1].rawX][circles[1].rawY]; //set initial 'end'

  openSet.push(start);
  loop();
}

function setup() { //setup is small because the majority of the setup needs to be reproducible, and is called from 'reset()' instead
  $("#canvas-target").html("");
  var myCanvas = createCanvas(wh, wh);
  myCanvas.parent("canvas-target");
}


function draw() {

  background(bgColour);
  strokeWeight(3);

  if (showGrid) {
    frameRate(fr);

    for (let i = 0; i <= width; i+=tileSize) { //drawing tile-grid
      stroke(gridColour);
      line(i, 0, i, height);
      line(0, i, width, i);
    }
}



  if (startDraw) {

  if (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
        //openSet[i].show();
        if(openSet[i].f < openSet[lowestIndex].f) {
          lowestIndex = i;
        }
    }

    var current = openSet[lowestIndex];

    if (openSet[lowestIndex] === end) {
      for (let i = 0; i < path.length; i++){
        path[i].used = true;
        path[i].path = numWires;
        end.path = numWires;
      }
      oldPaths.push(path);
      oldPaths[numWires].unshift(end);
      console.log("Done");
      path = [];
      let temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous
      }




      openSet = [];
      closedSet = [];
      if (numWires < numCircles/2 -1) {

        start = tiles[circles[2+numWires*2].rawX][circles[2+numWires*2].rawY];
        end = tiles[circles[3+numWires*2].rawX][circles[3+numWires*2].rawY];
      }
        numWires++;
      openSet.push(start);

      for (let i = 0; i < numTiles-1; i++) {
        for (let j = 0; j < numTiles-1; j++) {
          //tiles[i][j].previous = undefined;
        }
      };

    } else {


    closedSet.push(current); //push tested tile to closedSet
    removeFromArray(openSet, current); //custom function to remove checked tile from openSet


    let neighbours = current.neighbours;
    console.log(neighbours.length);
    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];
      //if(neighbour.g > 0) {
        if (!closedSet.includes(neighbour) && (!neighbour.used || (Math.abs(neighbour.x - end.x) < 1 && Math.abs(neighbour.y - end.y) < 1))) {
          let tempG = current.g+1;
           if (openSet.includes(neighbour)) {
             if (tempG < neighbour.g) {
               neighbour.g = tempG;
             }
        } else {
          neighbour.g = tempG;
          openSet.push(neighbour);
        }
        if (useHeuristics) {
          neighbour.h = heuristic(neighbour,end);
        } else {
          neighbour.h = 0;
        }
        neighbour.f = neighbour.g + neighbour.h;
        neighbour.previous = current;
      }
    }


  }

  } else {
    console.log("No solution / Failed");
    noSolution = true;
    for (let i = 0; i < tiles.length; i++) { //Diagnostic. Draw all walls.
      for (let j = 0; j < tiles[i].length; j++) {
        if (tiles[i][j].used) {
          tiles[i][j].wall(255,100,150);
        }
      }
    }
    startDraw = false;
  }


  if (!noSolution) { //if nothing left in openSet, stop path, draw back to origin
    path = [];
    let temp = current;
    path.push(temp);

    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
  }

}

  for (let i = 0; i < path.length-1; i++) { //draw path
    path[i].show();
  }

  for (let i = 0; i < oldPaths.length; i++) { //draw path
    for (let j = 0; j < oldPaths[i].length-1; j++) {
      oldPaths[i][j].show();
    }
  }

if (showSets) {
  for (let i= 0; i < closedSet.length; i++) { //display closedSet as red square
    closedSet[i].wall(255,0,0);
  }

  for (let i= 0; i < openSet.length; i++) { //display openSet as green squares
    openSet[i].wall(0,255,0);
  }
}

if (showWalls) {
  for (let i = 0; i < tiles.length; i++) { //Diagnostic. Draw all walls.
    for (let j = 0; j < tiles[i].length; j++) {
      if (tiles[i][j].used) {
        tiles[i][j].wall(255,255,255);
      }
    }
  }
}
for (let i = 0; i < circles.length; i++) { //display all circles
  circles[i].show((Math.floor(i/2)),wireColour);
}

  if(numWires >= (numCircles)/2-1/2){
    startDraw = false;
  }


} //draw end


//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
$('.btn-number').click(function(e){
    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {

            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            }
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});
$('.input-number').focusin(function(){
   $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function() {

    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());

    name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }


});
$(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
