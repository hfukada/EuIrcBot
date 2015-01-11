

var u = require("./utils");
var repl = require("./repl");

module.exports.msg = function (text, from, reply, raw) {
    if (u.contains("(", text)) {
        if (u.balancedParens(text)) {
            repl.evalClj(text).then(reply);
        } else {
            reply("Balance yo parens, homie!");
        }
    }
}
