var utils = require('./utils');

function curried(fn, args, fnArgsLength) {
  return function () {
    var newArgs = args.concat(utils.toArray(arguments));
    var newArgsLength = fnArgsLength - arguments.length;
    if (newArgsLength < 1) return fn.apply(null, newArgs);
    return curried(fn, newArgs, newArgsLength);
  };
}

function currying(fn) {
  return curried(fn, [], fn.length);
}

module.exports = currying;
