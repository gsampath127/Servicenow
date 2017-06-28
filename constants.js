var urgency = {
    High: {description : "high" , value : 1},
    Medium: { description: "medium", value: 2 },
    Low: { description: "low", value: 3 }
   
};

var state = {
    New: {description : "new" , value : 1},
    Active: {description : "active" , value : 2},
    AwaitingProblem: {description : "AwaitingProblem" , value : 3},
    AwaitingUserInfo: {description : "AwaitingUserInfo" , value : 4},
    AwaitingEvidence: {description : "AwaitingEvidence" , value : 5},
    Resolved: {description : "Resolved" , value : 6},
    Closed: { description: "Closed", value: 7 }


};
var impact = {
    High: 1,
    Medium: 2,
    Low: 3
};
var priority = {
    Critical: 1,
    High: 2,
    Moderate: 3,
    Low: 4,
    Planning:5,
    Moderate: 3,
};
var category = {
    Request: { description: "request", value: 1 },
    InquiryHelp: { description: "inquiry help", value: 2 },
    Software: { description: "software", value: 3 },
    Hardware: { description: "hardware", value: 4 },
    Network: { description: "network", value: 5 },
    Database:{ description: "database", value: 6 }
};
var contacttype = {
    Email: 1,
    Phone: 2,
    SelfService: 3,
    WalkIn:4


};


module.exports.Category = category;
module.exports.Urgency = urgency;
module.exports.State = state;

module.exports.getValue = function (object, value) {
    
    var val = "";
    for (var property in object) {
        if (object.hasOwnProperty(property) &&
            object[String(property)].description.indexOf(String(value).toLowerCase()) != -1) {
            val = object[String(property)].value;
        }
    }
   
    return val;
};

module.exports.getDescription = function (object, value) {
    for (var property in object) {
        if (object.hasOwnProperty(property) && object[String(property)].value == value) {
            return object[String(property)].description;
        }
    }
};
