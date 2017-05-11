

//modules **************************************
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiaiAssistant = require('actions-on-google').ApiAiAssistant;

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
//app.get('/incident', function (req, res) {
//    //res.send("hello");
//    var sysId = req.query.Id;
//    var url = "https://dev19713.service-now.com/api/now/table/incident"+"/"+sysId;
//    request.get(url, {
//        'auth': {
//            'user': 'admin',
//            'pass': 'SAMPATH18',
//            'sendImmediately': false
//        }
//    }).on('response', function (response) {
//        console.log(response.statusCode);
//        console.log(response.headers['content-type'])
//        response.on('data', function (data) {
//            console.log('data: ' + data);
//            res.write(data);
//        })
//    });
//});

app.post('/', function (req, res) {
   // var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    //return res.json({
    //    speech:  'hellllllllllllllllllllllll',
    //    displayText: "hellooooooooooooo",
    //    source: 'webhook-echo-sample'
    //});
    var assistant = new ApiAiAssistant({ request: request, response: response });
    var actionMap = new Map();
    // actionMap.set(WELCOMEINTENT, WelcomeIntent);
    actionMap.set(INCIDENT, getIncidents);
    assistant.handleRequest(actionMap);
});

///////////////////////////////////////////////////////////////////////////////


//Intents
const WELCOMEINTENT = 'input.welcome';
const INCIDENT = 'incident';

//Entities
const incidentId = 'any';

//Functions
//function welcomeIntent(assistant) {
//    assistant.ask("With EShopping, you can get the product order status);
//    }

function trackOrderStatus(assistant) {
    var orderidfromuser = assistant.getArgument(ORDERID);
    var orderStatusMessage = "";
    var orderDescription = "Your order" + orderidfromuser + "is";  
 
    if (orderidfromuser != null) { 
        assistant.ask (orderStatusMessage + "\n" +"is Available");
    }

    else {
        assistant.ask("please provide valid order id to check your order status");
    }
}
function getIncidents(assistant)
{
    assistant.ask("please provide valid order id to check your order status");
}
//exports.incident = function (request, response) {
//    var assistant = new ApiAiAssistant({request: request, response: response});
//    var actionMap = new Map ();
//   // actionMap.set(WELCOMEINTENT, WelcomeIntent);
//    actionMap.set(INCIDENT, getIncidents);
//    assistant.handleRequest(actionMap);
//};