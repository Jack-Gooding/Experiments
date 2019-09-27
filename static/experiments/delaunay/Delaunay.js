let sWidth = 1000;
let sHeight = 1000;
let viewSizeX = 200;
let viewSizeY = 200;
let offsetX = (sWidth-viewSizeX)/2;
let offsetY = (sHeight-viewSizeY)/2;

let points = [];

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

function perpendicularLine(m,b,p) {
  //start
  //y = mx+b

  //y = -x/m + b/m
  if ( m != 0) {
    m = -1/m;
  }

  //b = m(x - p.x) + p.y

  b = -m*p.x + p.y;

  return([m,b]);
}

function lineAngle(p1, p2) {

  //y = mx+b

  //m = (y2 - y1)/(x2 - x1)
  let m = (p2.y-p1.y)/(p2.x-p1.x);
  let b = p1.y-(m*p1.x);

  return ([m,b]);
}

function circumCircle(tri) {
    //Edge Lengths
    let a = tri[0];
    let b = tri[1];
    let c = tri[2];
    let aB = dist(a.x,a.y,b.x,b.y);
    let bC = dist(b.x,b.y,c.x,c.y);;
    let aC = dist(a.x,a.y,c.x,c.y);

    let radius = (aB*aC*bC)/Math.sqrt( (aB + aC + bC) * (bC + aC - aB) * (aC + aB - bC) * (aB + bC - aC) );

    let lAB = lineAngle(a, b);
    let lBC = lineAngle(b, c);
    let lAC = lineAngle(a, c);

    pA = {x:lerp(a.x,b.x,.5),y:lerp(a.y,b.y,.5)};
    let pAB = perpendicularLine(lAB[0],lAB[1],pA);

    pB = {x:lerp(b.x,c.x,.5),y:lerp(b.y,c.y,.5)};
    let pBC = perpendicularLine(lBC[0],lBC[1],pB);

    pC = {x:lerp(a.x,b.x,.5),y:lerp(a.y,b.y,.5)};
    let pAC = perpendicularLine(lAC[0],lAC[1],pC);

    //console.log(pAB);
    //console.log(pBC);
    //console.log(pAC);

    //let intersectX = (pAB[1]-pAC[1])/(pAC[0]-pAB[0]);
    let intersectX = (pBC[1]-pAB[1])/(pAB[0]-pBC[0]);
    let intersectY = pBC[0]*intersectX + pBC[1];

    push();
    strokeWeight(1);
    stroke(150);
    circle(intersectX,intersectY,radius*2)
    pop();

    push();
    stroke(255,0,0);
    strokeWeight(10);
    point(intersectX,intersectY);
    //console.log(intersectX, intersectY);
    pop();

    let amp = 50;

    //Draw parallel intersects
    line(pA.x,pA.y,pA.x+pAB[0]*amp,pA.y+amp);
    line(pB.x,pB.y,pB.x+pBC[0]*amp,pB.y+amp);
    line(pC.x,pC.y,pC.x+pAB[0]*amp,pC.y+amp);

    return({
        x : intersectX,
        y : intersectY,
        r: radius
      })

}

//function BowyerWatson (pointList)
function bowyerWatson(pointList = []) {
  // pointList is a set of coordinates defining the points to be triangulated

//triangulation := empty triangle mesh data structure
  let triangulation = [];

//add super-triangle to triangulation // must be large enough to completely contain all the points in pointList
  let superTriangle = [{x:-viewSizeX+offsetX,y:viewSizeY+offsetY},{x:viewSizeX/2+offsetX,y:-viewSizeY/2+offsetY},{x:viewSizeX*2+offsetX,y:viewSizeY+offsetY}];
  triangulation.push(superTriangle);

//for each point in pointList do // add all the points one at a time to the triangulation
  pointList.forEach(function(p) {
    //badTriangles := empty set
    let badTriangles = [];

    //Draw Each Point -- Purple
          push();
          stroke(255,0,255);
          strokeWeight(20);
          point(p.x,p.y);
          pop();

  //for each triangle in triangulation do // first find all the triangles that are no longer valid due to the insertion
    triangulation.forEach(function(tri) {

    // circumCircle returns x,y,r for the circumcircle of a given triangle
      let circle = circumCircle(tri);

    //if point is inside circumcircle of triangle
      if (dist(circle.x,circle.y,p.x,p.y) <= circle.r ) {
      //add triangle to badTriangles
        badTriangles.push(tri);
      }

      });

    //polygon := empty set
      let polygons = [];

    //for each triangle in badTriangles do // find the boundary of the polygonal hole
      badTriangles.forEach(function(badTri) {

      //for each edge in triangle do
        for (let i = 0; i < badTri.length; i++) {

          let iOffset = 1;

            //p[i]->p[i+iO]
            //p[0]->p[1]
            //p[1]->p[2]
            //p[2]->p[0]
          if (i === badTri.length-1) {
            iOffset = -badTri.length+1;
          }

          //For each edge in each bad triangle, check each edge of each bad triangle !== self && !== exists

      //this is the danger zone

          badTriangles.forEach(function(badTriCheck) {

              for (let j = 0; j < badTriCheck.length; j++) {
                let exists = true;

                let jOffset = 1;

                //p[i]->p[j+jO]
                //p[0]->p[1]
                //p[1]->p[2]
                //p[2]->p[0]
                if (j === badTriCheck.length-1) {
                  jOffset = -badTriCheck.length+1;
                }

                //if edge is not shared by any other triangles in badTriangles
                if (badTri[i].x !== badTriCheck[j].x && badTri[i].y !== badTriCheck[j].y && badTri[i+iOffset].x !== badTriCheck[j+jOffset].x && badTri[i+iOffset].y !== badTriCheck[j+jOffset].y) {

                  let exists = false;
                  let newEdge = {
                    x1:badTri[i].x,
                    y1:badTri[i].y,
                    x2:badTri[i+iOffset].x,
                    y2:badTri[i+iOffset].y
                  };
                  polygons.push(newEdge)

              }
            }
          })
        }
      })

    //for each triangle in badTriangles do // remove them from the data structure
      badTriangles.forEach(function(badTri) {
        //Loop through badTriangles and triangulation to check for matching triangles.
        for (let i = triangulation.length-1; i >= 0; i--) {

          let triCheck = triangulation[i];
          if (badTri === triCheck) {

          //remove triangle from triangulation
            triangulation = triangulation.splice(i,1);

          }
        }
      });
      console.log("POLYGONS!: "+polygons.length);
      console.log(polygons);
    //for each edge in polygon do // re-triangulate the polygonal hole
      polygons.forEach(function(edge) {

      //newTri := form a triangle from edge to point
        let newTri = [{x:edge.x1,y:edge.y1},{x:p.x,y:p.y},{x:edge.x2,y:edge.y2}];

      //add newTri to triangulation
        triangulation.push(newTri);
      });

  });
/*
    triangulation.forEach(function(tri, i) {
    tri.forEach(function(p) {
      if (p.x == -viewSizeX+offsetX && p.y == viewSizeY+offsetY || p.x == viewSizeX/2+offsetX && p.y == -viewSizeY/2+offsetY || p.x == viewSizeX*2+offsetX && p.y == viewSizeY+offsetY) {
        triangulation.splice(i,1);
      }
    })
})
*/

//for each triangle in triangulation // done inserting points, now clean up
  for (let i = triangulation.length-1; i >= 0; i--) {
    //console.log(triangulation.length);

    tri = triangulation[i];
    let s = superTriangle;
    tri.forEach(function(p) {

    //if triangle contains a vertex from original super-triangle
      if (p.x === s[0].x && p.y === s[0].y || p.x === s[1].x && p.y === s[1].y || p.x === s[2].x && p.y === s[2].y) {
      //remove triangle from triangulation
        triangulation.splice(i,1);
      }
    })
  }



  console.log(triangulation)

  return triangulation;
}

function setup() {
  createCanvas(sWidth,sHeight)
  background(240);
  strokeWeight(3);
  stroke(0);
  noFill();
  colorMode(RGB, 255, 255, 255, 1);


  //viewCube
  stroke(200);
  strokeWeight(0.5);
  beginShape(CLOSE)
  vertex(offsetX,offsetY);
  vertex(offsetX+viewSizeX,offsetY);
  vertex(offsetX+viewSizeX,offsetY+viewSizeY);
  vertex(offsetX,offsetY+viewSizeY);
  endShape(CLOSE)

  noLoop();

  points.push({x: offsetX+Math.random()*viewSizeX, y:offsetY+Math.random()*viewSizeY});

}


function draw() {

  let triangles = bowyerWatson(points);
  strokeWeight(3);
  triangles.forEach(function(triangle) {
    stroke(Math.random()*255,Math.random()*255,Math.random()*255,0.2)
    beginShape()
    triangle.forEach(function(p, vIndex) {
      vertex(p.x,p.y);
    })
    endShape(CLOSE);
  })
}

function mouseClicked() {
  console.log(`Mouseclick - Adding new point!: [${mouseX},${mouseY}]`);

  points.push({x:mouseX,y:mouseY});
  redraw();

}
