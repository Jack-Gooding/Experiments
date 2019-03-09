let cWidth = 200;
let cHeight = 200;

let currentFaction = "red";
let spots = [];

let diagonal = true;

function Spot(x,y) {
  this.x = x;
  this.y = y;

  this.colour;
  this.faction;
  this.targetFaction = "white";

  this.health = 10;

  this.frame = true;
  this.neighbours = [];

  this.addNeighbours = function() {
    //cardinal directions
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
    //diagonal
    if (diagonal) {

      if (this.x > 0 && this.y > 0) {
        this.neighbours.push(spots[x-1][y-1]);
      }
      if (this.x < cWidth-1 && this.y < cHeight-1) {
        this.neighbours.push(spots[x+1][y+1]);
      }
      if (this.x > 0 && this.y < cHeight-1) {
        this.neighbours.push(spots[x-1][y+1]);
      }
      if (this.x < cWidth-1 && this.y > 0) {
        this.neighbours.push(spots[x+1][y-1]);
      }

    }

  }

  this.expand = function() {
      //console.log(this.neighbours);
      let safe = true;
      let supported = 0;
      for (let i = 0; i < this.neighbours.length; i++) {
        cell = this.neighbours[i];
        if (cell.faction === undefined && this.health > 0) {
          cell.health = this.health-1;
          cell.faction = this.faction;
          cell.targetFaction = this.targetFaction;
          cell.predatorFaction = this.predatorFaction;
          cell.frame = false;
        } else if ( cell.faction === this.targetFaction) {
          if (cell.health > 1) {
            cell.health--;
          } else if (cell.health <= 1) {
            cell.health = this.health;
            cell.faction = this.faction;
            cell.targetFaction = this.targetFaction;
            cell.predatorFaction = this.predatorFaction;
          }
          cell.frame = false;

        } else if ( cell.faction === this.faction && this.health <= cell.health) {
          supported += cell.health - this.health +1;
        } else if ( cell.faction === this.predatorFaction) {
          safe = false;
        }
      }
      if (safe && supported > this.neighbours.length && this.health<= 10) { //change this for different behavouir
        this.health++;
    }
  }

  this.show = function() {
    if (this.faction === "red") {
      this.colour = [55+20*this.health,0,0];
   } else if (this.faction === "green") {
     this.colour = [0,55+20*this.health,0];
   } else if (this.faction === "blue") {
     this.colour = [0,0,55+20*this.health];
   }
    stroke(this.colour)
    point(x,y);
  }
}

function setup() {
      $("#canvas-target").html("");
      var myCanvas = createCanvas(cWidth, cHeight);
      myCanvas.parent("canvas-target");

      for (let x = 0; x < cWidth; x++) {
        spots[x] = [];
        for (let y = 0; y < cHeight; y++) {
          spots[x][y] = new Spot(x,y);
        }
      }

      for (let x = 0; x < cWidth; x++) {
        for (let y = 0; y < cHeight; y++) {
          spots[x][y].addNeighbours();
        }
      }

}

function mouseDragged() {
  if (mouseX < cWidth && mouseX > 0 && mouseY < cHeight && mouseY > 0) {
    spots[Math.floor(mouseX)][Math.floor(mouseY)].faction = currentFaction;
    if (currentFaction === "red") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].targetFaction = "green";
    } else if (currentFaction === "green") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].targetFaction = "blue";
    } else if (currentFaction === "blue") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].targetFaction = "red";
    }
    if (currentFaction === "red") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].predatorFaction = "blue";
    } else if (currentFaction === "green") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].predatorFaction = "red";
    } else if (currentFaction === "blue") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].predatorFaction = "green";
    }
    spots[Math.floor(mouseX)][Math.floor(mouseY)].health = 10;
  }
}

function mousePressed() {
  if (mouseX < cWidth && mouseX > 0 && mouseY < cHeight && mouseY > 0) {
    spots[Math.floor(mouseX)][Math.floor(mouseY)].faction = currentFaction;
    if (currentFaction === "red") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].targetFaction = "green";
    } else if (currentFaction === "green") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].targetFaction = "blue";
    } else if (currentFaction === "blue") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].targetFaction = "red";
    }
    if (currentFaction === "red") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].predatorFaction = "blue";
    } else if (currentFaction === "green") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].predatorFaction = "red";
    } else if (currentFaction === "blue") {
      spots[Math.floor(mouseX)][Math.floor(mouseY)].predatorFaction = "green";
    }
    spots[Math.floor(mouseX)][Math.floor(mouseY)].health = 10;
  }
}

function keyTyped() {
  if (key === 'r') {
    currentFaction = "red";
  } else if (key === 'g') {
    currentFaction = "green";
  } else if (key === 'b') {
    currentFaction = "blue";
  }
}

function draw() {
  frameRate(60);
  background(20);


  for (let x = 0; x < cWidth; x++) {
    for (let y = 0; y < cHeight; y++) {
      if(spots[x][y].faction && spots[x][y].frame) {
        spots[x][y].expand();
      }
    }
  }
  for (let x = 0; x < cWidth; x++) {
    for (let y = 0; y < cHeight; y++) {
      if(spots[x][y].faction) {
        spots[x][y].show();
        spots[x][y].frame = true;
      }
    }
  }
  fill(currentFaction);
  rect(0,0,10,10);
}
