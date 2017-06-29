

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



//app.get('/', function (req, res) {
//    //res.send("hello");
//    var str = '';
//    var url = "https://dev19713.service-now.com/api/now/table/problem";
//    request.post(url, {
//        'auth': {
//            'user': 'admin',
//            'pass': 'SAMPATH18',
//            'sendImmediately': false
//        },
//        'headers': {
//            'Content-Type': 'application/json'
//        },
//        'body':
//            {
//                'short_description': 'postmannnnnnnnnnnnnn', 'urgency': '2'
//            },
//        json: true,
//    }).on('response', function (response) {
//        console.log(response.statusCode);
//        console.log(response.headers['content-type']);

//        response.on('data', function (chunk) {
//            str += chunk;
//        });

//        response.on('end', function () {

//            var problem = JSON.parse(str);
//            res.send(problem);
//            var speech = "This new problem describes on " + problem.result.short_description + " with Urgency level " + problem.result.urgency + ", last updated on  " + problem.result.sys_updated_on + " and updated by " + problem.result.sys_updated_by;
//           // resolve(assistant.tell(speech));
//        });
//    });
  
//});






// Create functions to handle requests here
const WELCOME_INTENT = 'input.welcome';  // the action name from the API.AI intent




var incidentAssistant = require('./assistant/incidentAssistant');
var problemAssistant = require('./assistant/problemAssistant');


function InitializeAssistant(req, res) {
    const assistant = new apiaiAssistant({ request: req, response: res });

    var actionMap = new Map();
    actionMap.set(WELCOME_INTENT, welcomeIntent);
  
    incidentAssistant.InitializeIncident(actionMap);
    problemAssistant.InitializeProblem(actionMap);
    assistant.handleRequest(actionMap);

}




function welcomeIntent(assistant) {

    assistant.buildBasicCard("Hey Welcome................");
   // assistant.ask('Hey!  Welcome to Servicenow. Here you can manage all your operations for Incidents , Problems etc');
}


app.post('/google', function (req, res) {
    
    InitializeAssistant(req, res);
})

var incident = require('./data/incident');
app.get('/', function (req, res) {
   res.send("testing");
});




