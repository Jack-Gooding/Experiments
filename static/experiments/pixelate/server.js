const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/


app.get('/', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hi, this is a back-end server.` }));
});

app.get('/mug', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(__dirname+'/mugLightBlue.png');
})

app.listen(4000, () =>
  console.log('Express server is running on localhost:4000')
);
