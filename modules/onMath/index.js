/* This module is intended to detect lines
 * that contain only math and then evaluate
 * it and return the result.
 * It is possibly insecure, but I have yet to find a way
 * to exploit it.
 */

var RC = require('regex-chain');

var REEscape = function(s) {
    return s.replace(/[\-\/\\^\$\*\+\?\.\(\)\|\[\]{}]/g, '\\$&');
};

var mathKeysToGet = Object.getOwnPropertyNames(Math);
var mathItems = {};
for(var i=0;i<mathKeysToGet.length;i++) {
  mathItems[mathKeysToGet[i]] = Math[mathKeysToGet[i]];
}
mathItems.TAU = Math.PI * 2;
var mathKeys = Object.keys(mathItems);

var mathSymbols = ".,*+-/()%";

function MathScopeEval(str) {
  return (new Function("with(this) { return "+str+"; }")).call(mathItems);
}

function constructMathRe() {
  var re = new RegExp("^([\\d\\s" + REEscape(mathSymbols) + "]|(" + mathKeys.join(")|(") + "))+$");
  return re;
}

var mathRe = constructMathRe();

var onlySymbols = new RC("^[\\s" + REEscape(mathSymbols) + "]*$");
var onlyNumbers = new RC(/^[\s\d]*$/);
var funnyFractions = new RC(/^\s*([0-9][0]?\s*\/\s*(10|5|100))\s*$/);

var ignoreRe = onlySymbols.or(onlyNumbers).or(funnyFractions);

module.exports.msg = function(text, from, reply, raw) {
  if(ignoreRe.test(text)) {
    return;
  }
  if(mathRe.test(text)) {
    reply(MathScopeEval(text));
  }
};
