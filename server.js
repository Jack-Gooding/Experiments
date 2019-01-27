const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

let dynamicRoutes = [];

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

walk(__dirname + "/static/experiments", function(err, results) {
  if (err) throw err;
  //console.log(results);
  results.forEach(function(element) {
    elementFileType = element.split(".");
    //console.log(elementFileType.slice(-1));
    if(elementFileType.slice(-1) == "html") {
      dirName = elementFileType.slice(-2,-1)[0].split("/").slice(-1)[0];
      console.log(dirName);
      dynamicRoutes.push(dirName);
      //app.get(`/${dirName}`, (req, res) => {
        //res.sendfile(__dirname + `/static/experiments/${dirName}/${dirName}.html`); // load the single view file (angular will handle the page changes on the front-end)
      //});
    }
  });
});

app.use(express.static(__dirname + '/static'));                 // set the static files location /public/img will be /img for users

app.get('/', (req, res) => {
  res.sendfile(__dirname + '/static/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

//app.get('/knight', (req, res) => {
  //res.sendfile(__dirname + '/static/experiments/knight/knight.html'); // load the single view file (angular will handle the page changes on the front-end)
//});

app.get('/:experiment', (req, res) => {
  console.log(req.params.experiment);
  let route = '';
  dynamicRoutes.forEach(function(routeName) {
    if (req.params.experiment === routeName) {
    route = req.params.experiment;
  };
});
  //res.send("success!: "+route+" : "+req.params.experiment);
  res.sendfile(__dirname + `/static/experiments/${route}/${route}.html`);
  console.log("success!: "+route);
});

app.listen(4200);
