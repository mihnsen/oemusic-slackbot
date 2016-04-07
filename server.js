
var express = require('express');
var bodyParser = require('body-parser');
var webdriver = require('selenium-webdriver');

var app = express();
var port = process.env.PORT || 3456;

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var driver = new webdriver.Builder().
     withCapabilities(webdriver.Capabilities.chrome()).
     build();

function play(url) {
  driver.get(url);
}

function stop() {
  if(driver != undefined)
    driver.get('http://ownego.com');
}

app.post('/music', function(req, res, next) {
  var commands = req.body.text.split(' ');
  var user = req.body.user_name;

  var action = commands[0];
  var url;

  if(commands.length > 1) url = commands[1];
  var botPayload = {
    text : 'Playing ' + url + ' by ' + user
  };


  if(action == 'play' && url != undefined) play(url);
  if(action == 'stop' || action == 'pause') stop();

  return res.status(200).json(botPayload);
})




// basic error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});
