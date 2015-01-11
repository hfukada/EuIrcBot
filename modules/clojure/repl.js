var request = require("request-promise");
var u = require("./utils");

var globalSession = null;

function saveSession (response) {
    try {
        var headers = response.headers;
        var cookie = headers["set-cookie"][0]
        var ringSession = cookie.split(";")[0].split("=")[1];
        globalSession = ringSession;
    } catch (e) {
        // console.error("problem grabbing cookie from response");
        // console.error("headers: ", headers, "cookie: ", cookie);
        // console.error("status: ", response.statusCode, "body: ", response.body);
    }
    return response;
}

exports.evalClj = function evalClj (expression) {
    return request(u.buildRequest(expression, globalSession)).
        then(saveSession).
        then(u.lookup("body")).
        then(JSON.parse).
        then(u.lookup("result"));
}
