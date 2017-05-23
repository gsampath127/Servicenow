var problemData = require('../data/problem');


const PROBLEM_INTENT = 'input.problem';  // the action name from the API.AI intent
const PROBLEM_ALL_INTENT = 'input.allproblems';  // the action name from the API.AI intent
const PROBLEM_CREATE_INTENT = 'input.createproblem';  // the action name from the API.AI intent
var initializeProblem = function (actionMap) {
    actionMap.set(PROBLEM_INTENT, problemIntent);
    actionMap.set(PROBLEM_ALL_INTENT, problemAllIntent);
    actionMap.set(PROBLEM_CREATE_INTENT, problemCreateIntent);
};


function problemIntent(assistant) {

    return getProblemInfo(sysId, assistant);

}
function problemAllIntent(assistant) {
    var state = assistant.getArgument('state'),
        urgency = assistant.getArgument('urgency'),
        problemNumber = assistant.getArgument('problemNumber'),
        filterData = { 'state': state, 'urgency': urgency, 'problemNumber': problemNumber };


    return new Promise(function (resolve, reject) {
        var speech = "";
        problemData.GetAllProblems(filterData)
            .then(function (data) {

                if (data.length <= 0) {
                    speech = "Sorry!! Could not find the results";
                } else if (data.length==1) {
                    speech = "The problem " + data[0].number + " describes on" + data[0].short_description + " with urgency level" + data[0].urgency;
                }
                else {
                    speech = "Please find below data ";
                    for (var i = 0 ; i < data.length ; i++) {
                        speech = speech +" "+ data[i].number + " describes on " + data[i].short_description;
                    }
                }
              
                resolve(assistant.tell(speech));
            }, function (err) {
                cons
                resolve(assistant.tell("Sorry!! some error occured in fetching problems. Please try again!!"));
            });

    });

}
function problemCreateIntent(assistant) {
    var description = assistant.getArgument('description'),
        urgency = assistant.getArgument('urgency');

    var postData = {'short_description':description,'urgency':urgency};

    return new Promise(function (resolve,reject) {

        problemData.CreateProblem(postData)
            .then(function (data) {
                var speech = "Great!! Your problem was created which describes on " + data.short_description + " with Urgency level " + data.urgency + ", last updated on  " + data.sys_updated_on + " and updated by " + data.sys_updated_by;
                resolve(assistant.tell(speech));
            }, function (err) {
               
                resolve(assistant.tell("Sorry!! some error occured in creating a problem. Please try again!!"));
            });

    });
    

}




module.exports.InitializeProblem = initializeProblem;