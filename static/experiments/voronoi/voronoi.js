let sWidth = window.innerWidth;
let sHeight = window.innerHeight;
let viewSizeX = window.innerWidth-40;
let viewSizeY = window.innerHeight-40;
let offsetX = (sWidth-viewSizeX)/2;
let offsetY = (sHeight-viewSizeY)/2;

let pointlist = [];

let delaunay = true;
let voronoi = true;
let circumcircles = true;

function Vertex(x,y) {
  this.x = x;
  this.y = y;

  this.equals = function(p) {

    let check = (this.x == p.x && this.y == p.y);

    return check;
  };

  this.show = function() {
    stroke(0);
    strokeWeight(6);
    point(this.x,this.y);
  };
};

function Edge(v0,v1) {
  this.v0 = v0;
  this.v1 = v1;
  this.midpoint = {x:lerp(this.v0.x,this.v1.x,.5),y:lerp(this.v0.y,this.v1.y,.5)}
  //y = mx+b

  //m = (y2 - y1)/(x2 - x1)
  this.m = (this.v1.y-this.v0.y)/(this.v1.x-this.v0.x);
  this.b = this.v0.y-(this.m*this.v0.x);

  this.bisector = {
    m : (this.m != 0) ? -1/this.m : this.m,
    b : this.midpoint.y - ((this.m != 0) ? -1/this.m : this.m)*this.midpoint.x
  };

  this.equals = function(v0,v1) {
    return (this.v0 === v0 && this.v1 === v1 || this.v0 === v1 && this.v1 === v0);
  };

  this.checkUnique = function(edge) {
    let unique = true;
    if ((this.v0.equals(edge.v0) && this.v1.equals(edge.v1)) || (this.v0.equals(edge.v1) && this.v1.equals(edge.v0))) {
      unique = false;
    }
    return unique;
  };

  this.show = function() {
    line(this.v0.x,this.v0.y,this.v1.x,this.v1.y);
  };

  this.showBisector = function() {
    stroke("green");
    strokeWeight(1)
    if (this.bisector.m != 0) {
      line(this.midpoint.x,this.midpoint.y,0,this.bisector.b);
    } else {
      line(this.midpoint.x,this.midpoint.y,this.midpoint.x,this.midpoint.y+70)
    }

  }

};

function Triangle(v0,v1,v2) {
  this.v0 = v0;
  this.v1 = v1;
  this.v2 = v2;

  this.edges = [new Edge(v0,v1),new Edge(v1,v2),new Edge(v0,v2)];

  this.show = function(colour) {
    strokeWeight(2);
    stroke(0);
    if (colour) {
      console.log(colour);
      colorMode(RGB, 255,255,255,1);
      fill(colour,colour,colour,0.1);
      triangle(this.v0.x,this.v0.y,this.v1.x,this.v1.y,this.v2.x,this.v2.y);

    } else {
      //fill(Math.random()*255,Math.random()*255,Math.random()*255,40);
      noFill();
    }

  };

  this.calcCircumcircle = function() {

    let d1 = dist(this.v0.x,this.v0.y,this.v1.x,this.v1.y);
    let d2 = dist(this.v1.x,this.v1.y,this.v2.x,this.v2.y);
    let d3 = dist(this.v2.x,this.v2.y,this.v0.x,this.v0.y);

    this.r = (d1*d2*d3)/Math.sqrt( (d1 + d2 + d3) * (d2 + d3 - d1) * (d3 + d1 - d2) * (d1 + d2 - d3));


    this.circlex = (this.edges[1].bisector.b - this.edges[0].bisector.b)/(this.edges[0].bisector.m - this.edges[1].bisector.m);
    this.circley = this.edges[0].bisector.m * this.circlex + this.edges[0].bisector.b;
  }

  this.showCircumcircle = function(colour) {
    if (colour) {
      colorMode(RGB, 255, 255, 255, 1);
      fill(colour,colour,colour,0.01);
    } else {
      noFill();
    }
    stroke(255,0,0,.2);
    circle(this.circlex,this.circley,this.r*2);
    strokeWeight(4);
    point(this.circlex,this.circley);
  }

  this.checkContains = function(p) {
    if (dist(p.x,p.y,this.circlex,this.circley) < this.r) {
      return true;
    } else {
      return false;
    }
  };

  this.checkVertices = function(vertices) {
    let contains = false;
    for (let i = 0; i < vertices.length; i++) {
      if (vertices[i].equals(this.v0) || vertices[i].equals(this.v1) || vertices[i].equals(this.v2)) {
        contains = true;
      }
    };
    return contains;
  };

  this.checkSharedEdge = function(triangle) {
    let shared = false;

    for (let i = 0; i < triangle.edges.length; i++) {
      for (let j = 0; j < triangle.edges.length; j++) {
        if (!this.edges[i].checkUnique(triangle.edges[j])) {
          shared = true;
        };
      }
    }

    return shared;
  };
};

/*
function BowyerWatson (pointList)
     // pointList is a set of coordinates defining the points to be triangulated
     triangulation := empty triangle mesh data structure
     add super-triangle to triangulation // must be large enough to completely contain all the points in pointList
     for each point in pointList do // add all the points one at a time to the triangulation
        badTriangles := empty set
        for each triangle in triangulation do // first find all the triangles that are no longer valid due to the insertion
           if point is inside circumcircle of triangle
              add triangle to badTriangles
        polygon := empty set
        for each triangle in badTriangles do // find the boundary of the polygonal hole
           for each edge in triangle do
              if edge is not shared by any other triangles in badTriangles
                 add edge to polygon
        for each triangle in badTriangles do // remove them from the data structure
           remove triangle from triangulation
        for each edge in polygon do // re-triangulate the polygonal hole
           newTri := form a triangle from edge to point
           add newTri to triangulation
     for each triangle in triangulation // done inserting points, now clean up
        if triangle contains a vertex from original super-triangle
           remove triangle from triangulation
     return triangulation
*/


function bowyerWatson(points) {
  // pointList is a set of coordinates defining the points to be triangulated

  //triangulation := empty triangle mesh data structure
  let triangulation = [];

  //add super-triangle to triangulation // must be large enough to completely contain all the points in pointList
  let sp0 = new Vertex(-viewSizeX+offsetX,viewSizeY+offsetY);
  let sp1 = new Vertex(viewSizeX/2+offsetX,-viewSizeY/2+offsetY);
  let sp2 = new Vertex(viewSizeX*2+offsetX,viewSizeY+offsetY);

  let superTriangle = new Triangle(sp0,sp1,sp2);

  triangulation.push(superTriangle);

  triangulation.forEach(function(triangle) {
    triangle.calcCircumcircle();
  });

  //for each point in pointList do // add all the points one at a time to the triangulation
  points.forEach(function(point, pointIndex){

    //badTriangles := empty set
    let badTriangles = [];

    //for each triangle in triangulation do // first find all the triangles that are no longer valid due to the insertion
    triangulation.forEach(function(triangle) {

      //if point is inside circumcircle of triangle
      if (triangle.checkContains(point)) {

        //add triangle to badTriangles
        badTriangles.push(triangle);
      }

    });
    console.log(`Bad triangles: ${badTriangles.length}`);

    //polygon := empty set
    let polygon = [];

    //for each triangle in badTriangles do // find the boundary of the polygonal hole
    let badEdges = [];
    badTriangles.forEach(function(badTriangle) {

      //for each edge in triangle do
      badTriangle.edges.forEach(function(badEdge) {
        badEdges.push(badEdge);
      });
    });


    //if edge is not shared by any other triangles in badTriangles
    badEdges.forEach(function(badEdge, index) {
      let uniqueEdge = true;
      badEdges.forEach(function(badEdgeCheck, indexCheck) {
        if (index != indexCheck) {
          if (!badEdge.checkUnique(badEdgeCheck)) {
            uniqueEdge = false;
          }
        }
      });

      polygon.forEach(function(polygonCheck, polygonIndex) {
        if (!badEdge.checkUnique(polygonCheck)) {
          uniqueEdge = false;
        }
      });

      if (uniqueEdge) {
        //add edge to polygon
        polygon.push(badEdge);
      };
    });


    //for each triangle in badTriangles do // remove them from the data structure
    badTriangles.forEach(function(badTriangle, badIndex) {

      //remove triangle from triangulation
      for (let i = triangulation.length-1; i >= 0; i--) {

        let triCheck = triangulation[i];
        if (badTriangle === triCheck) {
        //remove triangle from triangulation
          triangulation.splice(i,1);
        }
      }
    });
    //for each edge in polygon do // re-triangulate the polygonal hole
    polygon.forEach(function(edge) {

      //newTri := form a triangle from edge to point
      let v0 = new Vertex(edge.v0.x,edge.v0.y);
      let v1 = new Vertex(point.x,point.y)
      let v2 = new Vertex(edge.v1.x,edge.v1.y);

      let newTri = new Triangle(v0,v1,v2);
      newTri.calcCircumcircle();

      //add newTri to triangulation
      triangulation.push(newTri);

    });
  });
  let debug = true;
  if (debug == true) {
  //for each triangle in triangulation // done inserting points, now clean up

  for (let i = triangulation.length-1; i >= 0; i--) {

    //if triangle contains a vertex from original super-triangle
    if (triangulation[i].checkVertices([sp0,sp1,sp2])) {

      //remove triangle from triangulation
      triangulation.splice(i,1);
    }
  };
  }

  console.log(triangulation);
  return triangulation;
};

function drawBox() {
  stroke(60);
  noFill();
  strokeWeight(1);
  beginShape();
  vertex(offsetX,offsetY);
  vertex(offsetX+viewSizeX,offsetY);
  vertex(offsetX+viewSizeX,offsetY+viewSizeY);
  vertex(offsetX,offsetY+viewSizeY);
  endShape(CLOSE);
};

function setup() {
  let canvas = createCanvas(sWidth,sHeight);
  canvas.parent('#sketch-holder');
  canvas.mouseClicked(clicked);

  //draw bounding box

  strokeWeight(3);
  //let firstPoint = new Vertex(Math.random()*viewSizeX+offsetX,Math.random()*viewSizeY+offsetY);
  //pointlist.push(firstPoint);
  noLoop();
};

let triangles = [];
let circumCenters = [];

function draw() {
  background(255);
  drawBox();
  //run bowyerWatson
  triangles = bowyerWatson(pointlist);
  if (delaunay) {

    pointlist.forEach(function(point) {
      point.show();
    })
  }
  triangles.forEach(function(triangle, index) {
    let newCircumCenter = new Vertex(triangle.circlex,triangle.circley);
    circumCenters.push(newCircumCenter);
    if (voronoi) {

    triangles.forEach(function(checkTriangle, indexCheck) {
      if (index != indexCheck) {
        if (triangle.checkSharedEdge(checkTriangle)) {
          push();
          stroke(40,255,150,0.6);
          strokeWeight(2);
          line(triangle.circlex,triangle.circley,checkTriangle.circlex,checkTriangle.circley);
          pop();
        };
      };
    });
    };
    if (delaunay) {
      triangle.show(Math.random()*255);
    }
    if (circumcircles) {
      triangle.showCircumcircle();
    };
  });
};

function clicked() {
  console.log(`Mouseclick - Adding new point!: [${mouseX},${mouseY}]`);
  if (mouseX > offsetX && mouseX <= viewSizeX+offsetX && mouseY > offsetY && mouseY <viewSizeY+offsetY) {
    let newPoint = new Vertex(mouseX,mouseY);
    pointlist.push(newPoint);
    redraw();
  }
    //let firstPoint = new Vertex(Math.random()*viewSizeX+offsetX,Math.random()*viewSizeY+offsetY);
};

function mouseMoved() {
  triangles.forEach(function(triangle) {
    if (triangle.checkContains({
      x: mouseX,
      y: mouseY
    })) {
      console.log("does contain");
      //triangle.show(Math.random()*255);
    }
  })
};

$(document).ready(function() {
  $('#circumcircles').click(function() {
    circumcircles = !circumcircles;
    console.log(circumcircles);
    redraw();
  });

  $('#delaunay').click(function() {
    delaunay = !delaunay;
    console.log(delaunay);
    redraw();
  });

  $('#voronoi').click(function() {
    voronoi = !voronoi;
    console.log(voronoi);
    redraw();
  });
});
