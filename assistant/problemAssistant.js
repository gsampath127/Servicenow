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

    return getAllProblems(assistant);

}
function problemCreateIntent(assistant) {
    var description = assistant.getArgument('description'),
        urgency = assistant.getArgument('urgency');

    var postData = {'short_description':description,'urgency':urgency};

    return new Promise(function (resolve,reject) {

        problemData.CreateProblem(postData)
            .then(function (data) {
                var speech = "Great!! Your problem was created which describes on " + problem.result.short_description + " with Urgency level " + problem.result.urgency + ", last updated on  " + problem.result.sys_updated_on + " and updated by " + problem.result.sys_updated_by;
                resolve(assistant.tell(speech));
            }, function (err) {
                console.log(err);
                resolve(assistant.tell("Sorry!! some error occured in creating a problem. Please try again!!"));
            });

    });
    

}




module.exports.InitializeProblem = initializeProblem;