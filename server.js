

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




// Create functions to handle requests here
const WELCOME_INTENT = 'input.welcome';  // the action name from the API.AI intent
const PROBLEM_INTENT = 'input.problem';  // the action name from the API.AI intent
const PROBLEM_ALL_INTENT = 'input.allproblems';  // the action name from the API.AI intent
const PROBLEM_CREATE_INTENT = 'input.createproblem';  // the action name from the API.AI intent






function InitializeAssistant(req, res) {
    const assistant = new apiaiAssistant({ request: req, response: res });

    var actionMap = new Map();
    actionMap.set(WELCOME_INTENT, welcomeIntent);
    actionMap.set(PROBLEM_INTENT, problemIntent);
    actionMap.set(PROBLEM_ALL_INTENT, problemAllIntent);
    actionMap.set(PROBLEM_CREATE_INTENT, problemCreateIntent);
    //actionMap.set(NUMBER_INTENT, numberIntent);
    assistant.handleRequest(actionMap);

}



function problemIntent(assistant) {
    var sysId = assistant.getArgument('Id');
    return getProblemInfo(sysId, assistant);

}
function problemAllIntent(assistant) {
    
    return getAllProblems(assistant);

}
function problemCreateIntent(assistant) {

    return createProblem(assistant);

}

function welcomeIntent(assistant) {
    assistant.ask('Welcome to Servicenow chat service .');
}
function getProblemInfo(sysId, assistant) {
    return new Promise(function (resolve, reject) {
        var str = '';
        var url = "https://dev19713.service-now.com/api/now/table/problem" + "/" + sysId;
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
            console.log(response.headers['content-type']);

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
               
                var problem = JSON.parse(str);
                var speech = "This problem describes on " + problem.result.short_description + " with Urgency level " + problem.result.urgency + ", last updated on  " + problem.result.sys_updated_on + " and updated by " + problem.result.sys_updated_by;
                resolve(assistant.tell(speech));
            });
        });

    });

}

function getAllProblems(assistant)
{
    var state = assistant.getArgument('state');
    var urgency = assistant.getArgument('urgency');
    return new Promise(function (resolve, reject) {
        var str = '';
        var url = "https://dev19713.service-now.com/api/now/table/problem";
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
            console.log(response.headers['content-type']);

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                var obj = JSON.parse(str),
                 problems = obj.result,
                speech = "";
                if (state)
                {
                    problems = problems.filter(function (e) {
                        return (e.state == state);
                    });
                }
                if (urgency) {
                    problems = problems.filter(function (e) {
                        return (e.urgency == urgency);
                    });
                }
                if (problems.length <= 0)
                {
                    speech = "Sorry!! Could not find the results";
                } else {
                    speech = "Please find below problems ";
                    for (var i = 0 ; i < problems.length ; i++) {
                        speech = speech + problems[i].number + "describes on " + problems[i].short_description;
                    }
                }
               
                
                resolve(assistant.tell(speech));
            });
        });

    });
}
function getProblemInfo(sysId) {
    return new Promise(function (resolve, reject) {
        var str = '';
        var url = "https://dev19713.service-now.com/api/now/table/problem" + "/" + sysId;
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
            console.log(response.headers['content-type']);

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {

                var problem = JSON.parse(str);
                var speech = "This problem describes on " + problem.result.short_description + " with Urgency level " + problem.result.urgency + ", last updated on  " + problem.result.sys_updated_on + " and updated by " + problem.result.sys_updated_by;
                resolve(assistant.tell(speech));
            });
        });

    });

}
function createProblem(assistant) {
    var description = assistant.getArgument('description');
    var urgency = assistant.getArgument('urgency');
    return new Promise(function (resolve, reject) {
        var str = '';
        var url = "https://dev19713.service-now.com/api/now/table/problem";
        request.post(url, {
            'auth': {
                'user': 'admin',
                'pass': 'SAMPATH18',
                'sendImmediately': false
            },
            'headers': {
                'Content-Type': 'application/json'
            },
            'body':
                {
                    'short_description':description, 'urgency':'2'
                },
            json: true,
        }).on('response', function (response) {
            console.log(response.statusCode);
            console.log(response.headers['content-type']);
            
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {

                var problem = JSON.parse(str);
                var speech = "This new problem describes on " + problem.result.short_description + " with Urgency level " + problem.result.urgency + ", last updated on  " + problem.result.sys_updated_on + " and updated by " + problem.result.sys_updated_by;
                resolve(assistant.tell(speech));
            });
        });

    });

}

app.post('/google', function (req, res) {
    
    InitializeAssistant(req, res);
})


app.get('/', function (req, res) {
    res.send("Server is up and running.")
});




