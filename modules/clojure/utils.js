
var request = require("request-promise"); 

exports.balancedParens = function balancedParens (string) {
    var length = string.length;
    var balance = 0;
    for (var i = 0; i < length; i++) {
        if (string[i] === "(") {
            balance++;
        } else if (string[i] === ")") {
            balance--;
            if (balance < 0) { 
                return false;
            }
        }
    }
    return balance === 0;
}

exports.contains = function contains (substr, superstr) {
    return superstr.indexOf(substr) > -1;
}

exports.lookup = function lookup (key) {
    return function (object) {
        return object[key];
    }
}

function addCookie (req, key, value) {
    var cookie = request.cookie(key + "=" + value);
    var jar = request.jar();
    jar.setCookie(cookie, req.uri.split("?")[0]);
    req.jar = jar;
    return req;
}

exports.buildRequest = function buildRequest (expression, session) {
    var urlEncoded = encodeURIComponent(expression);
    var request = {
        uri: "http://www.tryclj.com/eval.json?expr=" + urlEncoded,
        method: "GET", 
        resolveWithFullResponse: true
    };
    if (!!session) {
        request = addCookie(request, "ring-session", session);
    }
    return request;
}
