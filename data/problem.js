var CONFIG = require('../config.json');
var request = require('request');
var getAllProblems = function (data) {

    return new Promise(function (resolve, reject) {
        var str = '';
        var url = CONFIG.ServicenowURL + 'api/now/table/problem';
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

var createProblem = function (data) {
   
    return new Promise(function (resolve, reject) {
        var str = '';
        var url = CONFIG.ServicenowURL + 'api/now/table/problem';
        request.post(url, {
            'auth': {
                'user': CONFIG.username,
                'pass': CONFIG.password,
                'sendImmediately': false
            },
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': data,

            json: true,
        }).on('response', function (response) {
            console.log(response.statusCode);
            console.log(response.headers['content-type']);

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {

                var problem = JSON.parse(str);

                resolve(problem.result);
            });
        }).on('error', function (err) {
            reject(err);
        });

    });
};

var getProblem = function (sysId) {
    return new Promise(function (resolve, reject) {
        var str = '';
        var url = CONFIG.ServicenowURL + 'api/now/table/problem' + '/' + sysId;
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


module.exports.GetAllProblems = getAllProblems;
module.exports.CreateProblem = createProblem;
module.exports.GetProblem = getProblem;
