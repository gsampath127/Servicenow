const INCIDENT_INTENT = 'input.problem';  // the action name from the API.AI intent
const INCIDENT_ALL_INTENT = 'input.incidents';  // the action name from the API.AI intent
const INCIDENT_CREATE_INTENT = 'input.createproblem';  // the action name from the API.AI intent


var initializeInicednt = function (actionMap) {
    //actionMap.set(PROBLEM_INTENT, problemIntent);
    actionMap.set(INCIDENT_ALL_INTENT, incidentAllIntent);
   // actionMap.set(PROBLEM_CREATE_INTENT, problemCreateIntent);
};

function incidentAllIntent(assistant) {
    assistant.ask('Testing Incident from server');

};

module.exports.InitializeInicednt = initializeInicednt;