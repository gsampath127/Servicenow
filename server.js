

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
app.get('/incident', function (req, res) {
    //res.send("hello");
    //var sysId = req.query.Id;
    var url = "https://dev19713.service-now.com/api/now/table/incident/d71f7935c0a8016700802b64c67c11c6";
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
            res.write(data.result);
        })
    });
});



// Create functions to handle requests here
const WELCOME_INTENT = 'input.welcome';  // the action name from the API.AI intent
const INCIDENT_INTENT = 'input.incident';  // the action name from the API.AI intent






function sillyNameMaker(req, res) {
    const assistant = new apiaiAssistant({ request: req, response: res });

    

    var actionMap = new Map();
    actionMap.set(WELCOME_INTENT, welcomeIntent);
    actionMap.set(INCIDENT_INTENT, incidentIntent);
    //actionMap.set(NUMBER_INTENT, numberIntent);
    assistant.handleRequest(actionMap);


    // you can add the function name instead of an action map
    //assistant.handleRequest(responseHandler);
}

function responseHandler (assistant) {
    console.log("okok")
    // intent contains the name of the intent you defined in the Actions area of API.AI
    assistant.ask('Welcome! Say a number.');
    //let intent = assistant.getIntent();
    //switch (intent) {
    //    case WELCOME_INTENT:
    //        assistant.ask('Welcome! Say a number.');
    //        break;

    //    case NUMBER_INTENT:
    //        let number = assistant.getArgument(NUMBER_ARGUMENT);
    //        assistant.tell('You said ' + number);
    //        break;
    //}
}


function incidentIntent(assistant)
{
    //return new Promise(function (resolve, reject) {

        var sysId = assistant.getArgument('Id');
        //resolve(assistant.tell('Incident severity ' ));
        // assistant.tell('You Said' + sysId);
       // assistant.handleRequest(getIncidentInfo(sysId));
        return getIncidentInfo(sysId, assistant);
        
        //.then(function (data) {

        //   // assistant.tell('Fetching incident information......................');
        //    resolve(assistant.tell('Incident severity ' + data.severity));
        //}, function (err) {
        //    resolve(assistant.tell('Error occured ' ));
        //});
  //  });
    
    
    
        
}

function welcomeIntent (assistant) {
    assistant.ask('Welcome to Servicenow chat service .');
}
function getIncidentInfo(sysId, assistant)
{
    return new Promise(function (resolve, reject) {

        var url = "https://dev19713.service-now.com/api/now/table/incident" + "/" + sysId;
        request.get(url, {
            'auth': {
                'user': 'admin',
                'pass': 'SAMPATH18',
                'sendImmediately': false
            },
            'headers': {
                'Content-Type': 'application/json'
            }
        }).on('response', function (response) {
            console.log(response.statusCode);
            console.log(response.headers['content-type'])
          
            response.on('data', function (data) {
                console.log('data: ' + data);
                var incident = data;//JSON.parse(data);
                
                resolve(assistant.tell("Incident Severity" + incident));
              
               

                //res.write(data);
            })
        });

    });
    
}

app.post('/google', function (req, res) {
    console.log(req.body);
    sillyNameMaker(req, res);
})


app.get('/', function (req, res) {
    res.send("Server is up and running.")
})


