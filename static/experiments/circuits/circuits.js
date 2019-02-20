
let fr = 3;

let numTiles = 15;

//holds all tiles. structure is: numTiles arrays, containing numTiles 'Tile' objects
let tiles = [];

let numCircles = 16;
//holds all circles. simple array containing 'Circle' objects
let circles = [];

//currently unused
let numWires = 0;

let tileSize = 40;
let wh = numTiles*tileSize+1;

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


function Circle(x, y) { //Constructor object for "through-hole" circles of circuit board.
  this.rawX = x;
  this.rawY = y;
  this.x = x*tileSize+tileSize/2;
  this.y = y*tileSize+tileSize/2;
  this.pair = 0;
  this.show = function(num) {
    this.pair = num;
    fill(50);
    stroke((255/numCircles*(num+1)),200,(255-(255/numCircles*(num+1))));
    ellipse(this.x, this.y, 15, 15);
    //console.log("showing");
  }
}

function Tile(x, y) { //constructor for all tiles, one for each of numTiles*numTiles, display functions for 'paths' between circles
  this.x = x;
  this.y = y;

  this.f = 0; //compound heuristic estimate, used to determine fastest route to travel.
  this.g = 0; //'cost' from start node, +1 for every tile moved.
  this.h = 0; //heuristic value, manhattan distance to 'end' location

  this.neighbours = [];

  this.previous; //assigned previous, most 'efficient' tile before current. stores entire Tile object.

  this.used = false; //true if tile has been used to create a 'wire', can no longer be tested for paths.
  this.path = 0; //true if circle spawns on tile.
  this.direction;

  this.wall = function(r,g,b) { //Simple display show for diagnostics, shows all 'used' tiles.
    noStroke();
    fill(`rgba(${r},${g},${b}, 0.25)`);
    rect(this.x*tileSize, this.y*tileSize, tileSize, tileSize);
  }


  this.show = function(r,g,b) { //function to display 'wires', based on determined direction.
    //fill(r,g,b);
    //noStroke();
    //rect(this.x*tileSize,this.y*tileSize, tileSize, tileSize);
    let num = circles[this.path*2].pair;
    let direction;
    strokeCap(ROUND);
    stroke((255/numCircles*(num+1)),200,(255-(255/numCircles*(num+1))));


    //determine how to draw wires, if the previous vertex was on the same x plane or y plane, check above and below for which direction to draw.
    //TODO: Add edge-checking to remove occasional artifacts when turning on an edge
    //TODO: make wires stick to edge of nodes instead of penetrating.

    if (this.previous.x == this.x) { //If x == prev.x, path follows y-plane
      if (this.previous.y > this.y) { //If prev.y > y, path is moving up, else down
        direction ="up";
      } else {
        direction ="down";
      }
    } else if (this.previous.y == this.y) { //If y == prev.y, path follows x-plane
      if (this.previous.x > this.x) { //If prev.x > x, path is moving left, else right
        direction ="left";
      } else {
        direction ="right";
      }
    }

    this.direction = direction;

    if (direction === "left") {
        line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.x*tileSize+tileSize+tileSize/2, this.y*tileSize+tileSize/2);
      if(this.x === 0  && this.y == this.previous.y) {
        //stroke(255,0,0);
        line(this.x*tileSize, this.y*tileSize+tileSize/2, this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2);
      }
    } else if (direction === "up") {
        line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.x*tileSize+tileSize/2, this.y*tileSize+tileSize+tileSize/2);
      if(this.y === 0 && this.x == this.previous.x) {
        //stroke(255,0,0);
        line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.x*tileSize+tileSize/2, this.y*tileSize);
      }
    }  else if (direction === "right") {
        line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.x*tileSize-tileSize+tileSize/2, this.y*tileSize+tileSize/2);
      if(x === numTiles-1 && this.y == this.previous.y) {
        //stroke(255,255,0);
        line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.x*tileSize+tileSize, this.y*tileSize+tileSize/2);
      }
    }  else if (direction === "down") {
        line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.x*tileSize+tileSize/2, this.y*tileSize-tileSize+tileSize/2);
      if(this.y === numTiles-1 && this.x == this.previous.x) {
        //stroke(255,255,0);
        line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.x*tileSize+tileSize/2+2, this.y*tileSize+tileSize*2);
      }
    }
  }

  this.addNeighbours = function(tiles) {
    let x = this.x;
    let y = this.y;

    if (y < numTiles-1) { //check for edge collision
      this.neighbours.push(tiles[x][y+1]);
    } else { //loop
      this.neighbours.push(tiles[x][y+1-numTiles]);
    }
    if (y > 0) { //check for edge collision
      this.neighbours.push(tiles[x][y-1]);
    } else { //loop
      this.neighbours.push(tiles[x][y-1+numTiles]);
    }
    if (x < numTiles-1) { //check for edge collision
      this.neighbours.push(tiles[x+1][y]);
    } else { //loop
      this.neighbours.push(tiles[x+1-numTiles][y]);
    }
    if (x > 0) { //check for edge collision
      this.neighbours.push(tiles[x-1][y]);
    } else { //loop
      this.neighbours.push(tiles[x-1+numTiles][y]);
    }
  }
}


function removeFromArray(arr, elm) {
  for (let i = arr.length -1; i>= 0; i--) {
    if (arr[i] == elm) {
      arr.splice(i,1);
    }
  }
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

function setup() {
   frameRate(fr);
  $("#canvas-target").html("");
  var myCanvas = createCanvas(wh, wh);
  myCanvas.parent("canvas-target");
  for (let i = 0; i < numTiles; i++) {
    tiles[i] = [];
  }


  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      tiles[i][j] = new Tile(i,j);
    }
  }


  //there's a "b" for every "a"
  //for (let a = 10; a < width; a += 30) {
    //for (let b = 10; b < height; b += 30) {
      //add the circles to the array at x = a and y = b
    //  circles.push(new Circle(a, b));
    //}
  //}


  for (let i = 0; i < numTiles*0; i++) { //Diagnostic, randomly set tiles to 'used'/'wall' status, preventing them from being used in pathfinding or placement.
    x = Math.ceil(Math.random()*numTiles-1);
    y = Math.ceil(Math.random()*numTiles-1);
      tiles[x][y].used = true;
  }

  for (let i = 0; i < numTiles; i++) { //add neighbours to all tiles.
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

  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      for (let k = 0; k < circles.length; k++) {
        if (circles[k].rawX == tiles[i][j].x && circles[k].rawY == tiles[i][j].y) {
          tiles[i][j].used = true;
          console.log("removed tile from consideration");
        }
      }
    }
  }


  console.log(tiles);
  start = tiles[circles[0].rawX][circles[0].rawY];
  end = tiles[circles[1].rawX][circles[1].rawY];

  openSet.push(start);
  strokeWeight(3);
}


function draw() {
  background(50);

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
      console.log(end);
      oldPaths[numWires].unshift(end);
      console.log("oldpaths");
      console.log(oldPaths);
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
      console.log(openSet);

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
        neighbour.h = heuristic(neighbour,end);
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
    noLoop();
  }



  for (let i = 0; i <= width; i+=tileSize) { //drawing tile-grid
      stroke(100);
      line(i, 0, i, height);
      line(0, i, width, i);
  }


  for (let i = 0; i < circles.length; i++) { //display all circles
    circles[i].show(Math.round(i/4)*4);
  }

  for (let i= 0; i < closedSet.length; i++) { //display closedSet as red square
    //closedSet[i].wall(255,0,0);
  }

  for (let i= 0; i < openSet.length; i++) { //display openSet as green squares
    //openSet[i].wall(0,255,0);
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


  for (let i = 0; i < path.length-1; i++) { //draw path

    path[i].show(0,0,255);
  }

  for (let i = 0; i < oldPaths.length; i++) { //draw path
    for (let j = 0; j < oldPaths[i].length-1; j++) {
      oldPaths[i][j].show(0,255,255);
    }
  }

  for (let i = 0; i < tiles.length; i++) { //Diagnostic. Draw all walls.
    for (let j = 0; j < tiles[i].length; j++) {
      if (tiles[i][j].used) {
        //tiles[i][j].wall(255,255,255);
      }
    }
  }
  if(numWires >= (numCircles)/2-1/2){
    noLoop();
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
