

var request = require("request-promise");

function balancedParens (string) {
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

function contains (substr, superstr) {
    return superstr.indexOf(substr) > -1;
}

function buildRequest (expression, session) {
    var urlEncoded = encodeURIComponent(expression);
    var request = {
        uri: "http://www.tryclj.com/eval.json?expr=" + urlEncoded,
        method: "GET", 
        resolveWithFullResponse: true
    };
    if (!!session) {
        request.headers = {"Cookie": "ring-session=" + session + ""};
    }
    return request;
}

function lookup (key) {
    return function (object) {
        return object[key];
    }
}

var globalSession = null;

function saveSession (response) {
    try {
        var headers = response.headers;
        var cookie = headers["set-cookie"][0]
        var ringSession = cookie.split(";")[0].split("=")[1];
        globalSession = ringSession;
    } catch (e) {
        console.error("problem grabbing cookie from response");
        console.error("headers: ", headers, "cookie: ", cookie);
        console.error("status: ", response.statusCode, "body: ", response.body);
    }
    return response;
}

module.exports.msg = function (text, from, reply, raw) {
    if (contains("(", text)) {
        if (balancedParens(text)) {
            request(buildRequest(text, globalSession))
                .then(saveSession)
                .then(lookup("body"))
                .then(JSON.parse)
                .then(lookup("result"))
                .then(reply);
        } else {
            reply("Balance yo parens, homie!");
        }
    }
}
