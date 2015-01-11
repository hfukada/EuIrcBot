

var u = require("./utils");
var repl = require("./repl");

function shouldEval (text) {
    var length = text.length;
    return text[0] === "(" && 
        text[length - 1] === ")" && 
        u.balancedParens(text);
}

module.exports.msg = function (text, from, reply, raw) {
    if (shouldEval(text)) {
        repl.evalClj(text).then(reply);
    }
}
