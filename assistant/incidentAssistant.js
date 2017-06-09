var incidentData = require('../data/incident');
var constants = require('../constants');


const INCIDENT_INTENT = 'input.incident';  // the action name from the API.AI intent
const INCIDENT_ALL_INTENT = 'input.incidents';  // the action name from the API.AI intent
const INCIDENT_CREATE_INTENT = 'input.createincident';  // the action name from the API.AI intent


var initializeIncident = function (actionMap) {
   
    actionMap.set(INCIDENT_ALL_INTENT, incidentAllIntent);
    actionMap.set(INCIDENT_CREATE_INTENT, incidentCreateIntent);
};

//function incidentAllIntent(assistant) {
//    assistant.ask('Testing Incident from server');

//};

function incidentAllIntent(assistant) {
    var state = assistant.getArgument('state'),
        urgency = constants.gatValue(constants.Urgency, assistant.getArgument('urgency')),
        incidentNumber = assistant.getArgument('incidentNumber'),
        filterData = { 'state': 1, 'urgency': urgency, 'incidentNumber': incidentNumber };


    return new Promise(function (resolve, reject) {
        var speech = "";
        problemData.GetAllProblems(filterData)
            .then(function (data) {

                if (data.length <= 0) {
                    speech = "Sorry!! Could not find the results";
                } else if (data.length == 1) {
                    speech = "The incident " + data[0].number + " describes on" + data[0].short_description + " with urgency level" + data[0].urgency;
                }
                else {
                    speech = "Please find below data ";
                    for (var i = 0 ; i < data.length ; i++) {
                        speech = speech + " " + data[i].number + " describes on " + data[i].short_description;
                    }
                }

                resolve(assistant.tell(speech));
            }, function (err) {
                cons
                resolve(assistant.tell("Sorry!! some error occured in fetching tickets/incidents. Please try again!!"));
            });

    });

}
function incidentCreateIntent(assistant) {
    var description = assistant.getArgument('description'),
        urgency = constants.getValue(constants.Urgency, assistant.getArgument('urgency')),
        category = constants.getValue(constants.Category,assistant.getArgument('category'));

    var postData = { 'short_description': description, 'urgency': urgency };
    console.log(postData);

    return new Promise(function (resolve, reject) {

        incidentData.CreateIncident(postData)
            .then(function (data) {
                var speech = "Great!! Your ticket was created which describes on " + data.short_description + " with Urgency level " + constants.getDescription(constants.Urgency,data.urgency) + ", last updated on  " + data.sys_updated_on + " and updated by " + data.sys_updated_by;
                resolve(assistant.tell(speech));
            }, function (err) {

                resolve(assistant.tell("Sorry!! some error occured in creating a incident. Please try again!!"));
            });

    });


}

module.exports.InitializeIncident = initializeIncident;