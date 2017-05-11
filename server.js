

//modules **************************************
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var request = require('request');


// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// expose app           
exports = module.exports = app;

//set our port
//var port = process.env.PORT || 8080; 
app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'));

// shoutout to the user                     
console.log('Application started on port ' + app.get('port'));



app.get('/', function (req, res) {
    res.send("hello");
});

app.get('/getAllIncidents', function (req, res) {
    //res.send("hello");
    var url = "https://dev19713.service-now.com/api/now/table/incident";
    request.get(url, {
        'auth': {
            'user': 'admin',
            'pass': 'SAMPATH18',
            'sendImmediately': false
        }
    }).on('response', function (response) {
        console.log(response.statusCode);
        console.log(response.headers['content-type'])
        response.on('data', function (data) {
            console.log('data: ' + data);
            res.write(data);
        })
    });
});
app.get('/incident', function (req, res) {
    //res.send("hello");
    var sysId = req.query.Id;
    var url = "https://dev19713.service-now.com/api/now/table/incident"+"/"+sysId;
    request.get(url, {
        'auth': {
            'user': 'admin',
            'pass': 'SAMPATH18',
            'sendImmediately': false
        }
    }).on('response', function (response) {
        console.log(response.statusCode);
        console.log(response.headers['content-type'])
        response.on('data', function (data) {
            console.log('data: ' + data);
            res.write(data);
        })
    });
});

app.post('/incident', function (req, res) {
   // var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    return res.json({
        speech:  'hellllllllllllllllllllllll',
        displayText: "hellooooooooooooo",
        source: 'webhook-echo-sample'
    });
});