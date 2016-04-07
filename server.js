
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
var lastUrl;

function play(url) {
  driver.get(url);
}

function stop() {
  if(driver != undefined)
    driver.get('http://ownego.com');
}

function isURL(str) {
  if(!str) return false;
     var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
     var url = new RegExp(urlRegex, 'i');
     return str.length < 2083 && url.test(str);
}

app.post('/music', function(req, res, next) {
  var commands = req.body.text.split(' ');
  var user = req.body.user_name;

  var url = commands[0];
  var action = 'stop';

  if(isURL(url)) {
    action = 'play';
  } else {
    action = commands[0];
    if(commands.length > 1) url = commands[1];
    url = isURL(url)?url:lastUrl;
  }

  lastUrl = url;
  if(action == 'play') {
    play(url);
    return res.status(200).json({
      text : 'Mp3 playing ' + url + ' by ' + user
    });
  }

  if(action == 'pause') {
    stop();
    return res.status(200).json({
      text : 'Mp3 pause by ' + user
    });
  }

  if(action == 'stop') {
    lastUrl = undefined;
    stop();
    return res.status(200).json({
      text : 'Mp3 stop by ' + user
    });
  }

  return res.status(200).json({ text: 'I don\'t know how to do, you fucking me!' });
})




// basic error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});
