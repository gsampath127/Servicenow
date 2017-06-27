var incidentData = require('../data/incident');
var constants = require('../constants');


const INCIDENT_INTENT = 'input.incident';  // the action name from the API.AI intent
const INCIDENT_ALL_INTENT = 'input.incidents';  // the action name from the API.AI intent
const INCIDENT_CREATE_INTENT = 'input.createincident';  // the action name from the API.AI intent
const INCIDENT_CLOSE_INTENT = 'input.closeincident';  // the action name from the API.AI intent 
const INCIDENT_GET_ASSIGN_INTENT = 'input.getassignincident';  // the action name from the API.AI intent 
const INCIDENT_ASSIGN_INTENT = 'input.assignincident';  // the action name from the API.AI intent 


var initializeIncident = function (actionMap) {

    actionMap.set(INCIDENT_ALL_INTENT, incidentAllIntent);
    actionMap.set(INCIDENT_CREATE_INTENT, incidentCreateIntent);
    actionMap.set(INCIDENT_CLOSE_INTENT, incidentCloseIntent);
    actionMap.set(INCIDENT_GET_ASSIGN_INTENT, getIncidentAssignedIntent); 
    actionMap.set(INCIDENT_ASSIGN_INTENT, assignIncidentIntent);
};

//function incidentAllIntent(assistant) {
//    assistant.ask('Testing Incident from server');

//};

function incidentAllIntent(assistant) {
    var state = assistant.getArgument('state'),
        urgency = constants.getValue(constants.Urgency, assistant.getArgument('urgency')),
        incidentNumber = assistant.getArgument('incidentNumber'),
        filterData = { 'state': state, 'urgency': urgency, 'number': incidentNumber };

    return new Promise(function (resolve, reject) {
        var speech = "";
        incidentData.GetAllIncidents(filterData)
            .then(function (data) {

                if (data.length <= 0) {
                    speech = "Sorry!! Could not find the results";
                } else if (data.length == 1) {
                    speech = "The incident " + data[0].number + " describes on " + data[0].short_description + " with urgency level " + constants.getDescription(constants.Urgency, data[0].urgency);
                }
                else {
                    speech = "Please find below data ";
                    for (var i = 0 ; i < data.length ; i++) {
                        speech = speech + " " + data[i].number + " describes on " + data[i].short_description + " with urgency level " + constants.getDescription(constants.Urgency, data[0].urgency);
                    }
                }

                resolve(assistant.tell(speech));
            }, function (err) {

                resolve(assistant.tell("Sorry!! some error occured in fetching tickets/incidents. Please try again!!"));
            });

    });

}
function incidentCreateIntent(assistant) {
    var description = assistant.getArgument('description'),
        urgency = constants.getValue(constants.Urgency, assistant.getArgument('urgency')),
        category = assistant.getArgument('category');

    var postData = { 'short_description': String(description), 'urgency': urgency };

    return new Promise(function (resolve, reject) {

        incidentData.CreateIncident(postData)
            .then(function (data) {
                var speech = "Great!! Your ticket " + data.number + "was created which describes on " + data.short_description + " with Urgency level " + constants.getDescription(constants.Urgency, data.urgency) + ", last updated on  " + data.sys_updated_on + " and updated by " + data.sys_updated_by;
                resolve(assistant.tell(speech));
            }, function (err) {

                resolve(assistant.tell("Sorry!! some error occured in creating a incident. Please try again!!"));
            });

    });


}
function incidentCloseIntent(assistant) {
    var incidentNumber = assistant.getArgument('incidentNumber');

    var postData = { 'number': incidentNumber };
    var updateData = { 'state': 7 };
    return new Promise(function (resolve, reject) {

        incidentData.GetAllIncidents(postData)
            .then(function (data) {

                incidentData.UpdateIncident(data[0].sys_id, updateData).then(function (item) {
                    var speech = "Great!! Your ticket " + item.number + "was closed which describes on " + item.short_description;
                    resolve(assistant.tell(speech));
                }, function (err) {

                    resolve(assistant.tell("Sorry!! some error occured in closing a incident. Please try again!!"));
                });
            });


    });


}

function getIncidentAssignedIntent(assistant) {
    var user = assistant.getArgument('user'),
          postData = { 'name': String(user) };

    return new Promise(function (resolve, reject) {

        incidentData.GetUsers(postData)
            .then(function (data) {

                var userSysId = data[0].sys_id;
                incidentData.GetAllIncidents(null).then(function (items) {

                    items = items.filter(function (e) {
                        return e.assigned_to.value == userSysId;

                    });
                    var speech = "";
                    if (items.length <= 0) {
                        speech = "Sorry!! Could not find the results";
                    } else if (items.length == 1) {
                        speech = "The incident " + items[0].number + " describes on " + items[0].short_description + " with urgency level " + constants.getDescription(constants.Urgency, items[0].urgency);
                    }
                    else {
                        speech = "Please find below data ";
                        for (var i = 0 ; i < items.length ; i++) {
                            speech = speech + " " + items[i].number + " describes on " + items[i].short_description + " with urgency level " + constants.getDescription(constants.Urgency, items[0].urgency);
                        }
                    }

                    resolve(assistant.tell(speech));
                }, function (err) {

                    resolve(assistant.tell("Sorry!! some error occured in closing a incident. Please try again!!"));
                });
            });


    });


}

function assignIncidentIntent(assistant) {
    var user = assistant.getArgument('user'),
        number = assistant.getArgument('number'),
        userPostData = { 'name': String(user) },
       
        incidentPostData = { 'number': number };
    return new Promise(function (resolve, reject) {
        incidentData.GetIncident(number).then(function (incident) {
            var previousIncidentData = incident;
            console.log("incident.");
            console.log(incident);
            
            incidentData.GetUsers(userPostData).then(function (userData) {
                  
                    // Updating the incident
                    var updateData = { assigned_to: userData[0].sys_id };
                    incidentData.UpdateIncident(previousIncidentData.sys_id, updateData).then(function (item) {
                        

                       // incidentData.GetUser(incident[0].assigned_to.value).then(function (prevUser) {
                            

                           // incidentData.GetUser(item.assigned_to.value).then(function (assignedUser) {

                              //  console.log(assignedUser.name);
                                //var speech = "Great!! The ticket " + number + " was assigned which describes on " + item.short_description + "assigned from " + prevUser.name + " to" + assignedUser.name;
                                resolve(assistant.tell("Testing allllllllll"));
                            }, function (err) {

                                resolve(assistant.tell("Sorry!! some error occured in assigning  a incident. Please try again!!"));

                          //  });

                       // });
  
                    });
                });

        });


       
    });

}

module.exports.InitializeIncident = initializeIncident;