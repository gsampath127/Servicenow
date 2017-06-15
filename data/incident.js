﻿var CONFIG = require('../config.json');
var request = require('request');

var getAllIncidents = function (data) {
    return new Promise(function (resolve, reject) {
        var str = '';
        var url = CONFIG.ServicenowURL + 'api/now/table/incident?sysparam_fields=number,short_description,urgency,state';
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
                 incidents = obj.result;
                 incidents = incidents.filter(function (item) {
                    for (var key in data) {
                       
                        if (data[key] && (item[key] === undefined || item[key] != data[key]))
                            return false;
                    }
                    return true;
                    // return ((e.number == data.incidentNumber && data.incidentNumber!=null) || ( e.state == data.state && data.state!=null)|| (e.urgency == data.urgency && data.urgency!=''));
                });
               
              
                resolve(incidents);
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
var updateIncident = function (sysId, updateData) {
    console.log(sysId);
    console.log(updateData);

    return new Promise(function (resolve, reject) {
        var str = '';
        var url = CONFIG.ServicenowURL + 'api/now/table/incident/' + sysId;
        request.put(url, {
            'auth': {
                'user': CONFIG.username,
                'pass': CONFIG.password,
                'sendImmediately': false
            },
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': updateData,

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

module.exports.GetAllIncidents = getAllIncidents;
module.exports.CreateIncident = createIncident;
module.exports.GetIncident = getIncident;
module.exports.CloseIncident = updateIncident;
module.exports.Test = Test;

   
