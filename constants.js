var urgency = {
    High: {description : "high" , value : 1},
    Medium: { description: "medium", value: 2 },
    Low: { description: "low", value: 3 }
   
};

var state = {
    New: 1,
    Active: 2,
    AwaitingProblem: 3,
    AwaitingUserInfo: 4,
    AwaitingEvidence: 5,
    Resolved: 6,
    Closed:7

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
    Request: 1,
    InquiryHelp: 2,
    Software: 3,
    Hardware: 4,
    Network: 5,
    Database:6
};
var contacttype = {
    Email: 1,
    Phone: 2,
    SelfService: 3,
    WalkIn:4


};


module.exports.Urgency = urgency;

module.exports.getValue = function (object, value) {
    console.log(object);
    console.log(value);
    var val = "";
    for (var property in object) {
        console.log(property);
        console.log(object['High']);
        if (object.hasOwnProperty(property) ) {
            val= property.value;
        }
    }
    console.log(val);
    return val;
};

module.exports.getDescription = function (object, value) {
    for (var property in object) {
        if (object.hasOwnProperty(property) && property.value == value) {
            return property.description;
        }
    }
};
