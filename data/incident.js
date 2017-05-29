var CONFIG = require('../config.json');
var request = require('request');

var getAllIncidents = function (data) {

    return new Promise(function (resolve, reject) {
        var str = '';
        var url = CONFIG.ServicenowURL + 'api/now/table/incident';
        request.get(url, {
            'auth': {
                'user': CONFIG.username,
                'pass': CONFIG.password,
                'sendImmediately': false
            },
            'headers': {
                'Content-Type': 'application/json'
            }
        }).on('response', function (response) {

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                var obj = JSON.parse(str),
                 problems = obj.result;
                 problems = problems.filter(function (e) {
                    return (e.number == data.problemNumber || e.state == data.state || e.urgency == data.urgency);
                });
              
                resolve(problems);
            });
        }).on('error', function (err) {
            reject(err.statusText);
        });

    });
};

var createIncident = function (data) {
  
    return new Promise(function (resolve, reject) {
        var str = '';
        var url = CONFIG.ServicenowURL +'api/now/table/incident';
        request.post(url, {
            'auth': {
                'user': CONFIG.username,
                'pass': CONFIG.password,
                'sendImmediately': false
            },
            'headers': {
                'Content-Type': 'application/json'
            },
            'body':data,
                
            json: true,
        }).on('response', function (response) {
           
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {

                var problem = JSON.parse(str);
               
                resolve(problem.result);
            });
        }).on('error', function (err) {
            reject(err.statusText);
        });

    });
};

var getIncident = function (sysId) {
    return new Promise(function (resolve, reject) {
        var str = '';
        var url =  CONFIG.ServicenowURL +'api/now/table/incident' + '/' + sysId;
        request.get(url, {
            'auth': {
                'user': CONFIG.username,
                'pass': CONFIG.password,
                'sendImmediately': false
            },
            'headers': {
                'Content-Type': 'application/json'
            }
        }).on('response', function (response) {

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {

                var problem = JSON.parse(str);
               resolve(problem);
            });
        }).on('error', function (err) {
            reject(err.statusText);
        });

    });
};
var Test = function () {
    return "Testinggg";
};


module.exports.GetAllIncidents = getAllIncidents;
module.exports.CreateIncident = createIncident;
module.exports.GetIncident = getIncident;
module.exports.Test = Test;

   
