const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3500;

app.use(express.static(__dirname + '/static')); // set the static files location /static/img will be /img for users


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
