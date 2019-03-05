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
  this.colour;

  this.wireNum;

  this.wall = function(r,g,b) { //Simple display show for diagnostics, shows all 'used' tiles.
    noStroke();
    fill(`rgba(${r},${g},${b}, 0.25)`);
    rect(this.x*tileSize, this.y*tileSize, tileSize, tileSize);
  }

  this.join = function(nextX, nextY, direction, nextDirection, col) {
    if(this.direction != nextDirection) {
      //ellipse(nextX*tileSize+tileSize/2,nextY*tileSize+tileSize/2, 5,5)
    }
    if (this.direction === "left" && nextY === this.y) {
      if (this.x <= 1) {
        //stroke(255,0,0);
        //ellipse(this.x*tileSize+tileSize/2,this.y*tileSize+tileSize*1.5,3,3);
        line(this.x*tileSize-tileSize/2, this.y*tileSize+tileSize/2, this.x*tileSize-tileSize*2, this.y*tileSize+tileSize/2);
        //stroke(0,0,255);
        line((numTiles-1)*tileSize+tileSize/2, nextY*tileSize+tileSize/2, (numTiles-1)*tileSize+tileSize*1.5, nextY*tileSize+tileSize/2);
      }
    } else if (this.direction === "up" && nextX === this.x) {
        //line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.previous.x*tileSize+tileSize/2, this.previous.y*tileSize+tileSize/2);
        if (this.y <= 1) {
          //stroke(255,0,0);
          //ellipse(this.x*tileSize+tileSize/2,this.y*tileSize+tileSize*1.5,3,3);
          line(this.x*tileSize+tileSize/2, this.y*tileSize-tileSize/2, this.x*tileSize+tileSize/2, this.y*tileSize-tileSize*2);
          //stroke(0,0,255);
          line(nextX*tileSize+tileSize/2, (numTiles-1)*tileSize+tileSize/2, nextX*tileSize+tileSize/2, (numTiles-1)*tileSize+tileSize*2);
        }
    }  else if (this.direction === "right" && nextY === this.y) {
        //line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.previous.x*tileSize+tileSize/2, this.previous.y*tileSize+tileSize/2);
        if (this.x >= numTiles-2) {
          //stroke(255,0,0);
          //ellipse(this.x*tileSize+tileSize/2,this.y*tileSize+tileSize*1.5,3,3);
          line(this.x*tileSize+tileSize*1.5, this.y*tileSize+tileSize/2, this.x*tileSize+tileSize*2, this.y*tileSize+tileSize/2);
          //stroke(0,0,255);
          line(tileSize/2, nextY*tileSize+tileSize/2, -tileSize/2, nextY*tileSize+tileSize/2);

        }
    }  else if (this.direction === "down" && nextX === this.x) {
        //line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.previous.x*tileSize+tileSize/2, this.previous.y*tileSize+tileSize/2);
        if (this.y >= numTiles-2) {
          //stroke(255,0,0);
          //ellipse(this.x*tileSize+tileSize/2,this.y*tileSize+tileSize*1.5,3,3);
          line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize*1.5, this.x*tileSize+tileSize/2, this.y*tileSize+tileSize*2);
          //stroke(0,0,255);
          line(nextX*tileSize+tileSize/2, tileSize/2, nextX*tileSize+tileSize/2, -tileSize*2);
        }
      if(this.y === numTiles-1) {
        //stroke(255,255,0);
      }
    }

  }

  this.show = function() { //function to display 'wires', based on determined direction.
    //fill(r,g,b);
    //noStroke();
    //rect(this.x*tileSize,this.y*tileSize, tileSize, tileSize);
    let direction;
    strokeCap(ROUND);
    if (this.previous.wireNum) {
      this.wireNum = this.previous.wireNum;
    } else {
      if (this.wireNum === undefined) {
        this.wireNum = oldPaths.length;
      }
    }
    if (this.previous.colour) {
      this.colour = this.previous.colour;
    } else {
      this.colour = circles[this.wireNum*2].colour;
    }
    stroke(this.colour);

    //determine how to draw wires, if the previous vertex was on the same x plane or y plane, check above and below for which direction to draw.
    //TODO: Add edge-checking to remove occasional artifacts when turning on an edge
    //TODO: make wires stick to edge of nodes instead of penetrating.
    //TODO: change basic colour to grey or neutral colour
    if (this.previous.x == this.x) { //If x == prev.x, path follows y-plane
      if (this.previous.y > this.y) { //If prev.y > y, path is moving up, else down
        this.previous.direction ="up";
      } else {
        this.previous.direction ="down";
      }
    } else if (this.previous.y == this.y) { //If y == prev.y, path follows x-plane
      if (this.previous.x > this.x) { //If prev.x > x, path is moving left, else right
        this.previous.direction ="left";
      } else {
        this.previous.direction ="right";
      }
    }
  //  if(this.direction != this.previous.direction) {
  //    this.previous.direction = this.direction;
  //  }
    //Draw line from centre of tile, to centre of last tile, based on position of last tile.
    if (Math.abs(this.x - this.previous.x) < numTiles/4 && Math.abs(this.y - this.previous.y) < numTiles-1) {
      line(this.x*tileSize+tileSize/2, this.y*tileSize+tileSize/2, this.previous.x*tileSize+tileSize/2, this.previous.y*tileSize+tileSize/2);
    }
    this.previous.join(this.x, this.y, direction, this.direction, this.colour);

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
