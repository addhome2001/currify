/*!
 * currify <https://github.com/addhome2001/currify>
 *
 * Copyright (c) 2017 addhome2001, contributors.
 * Licensed under the MIT License
 */

function toArray(args) {
  return Array.prototype.slice.call(args);
}

function throwError(reason) {
  throw new Error(reason);
}

function curried(fn, args, fnArgsLength) {
  return function () {
    var newArgs = args.concat(toArray(arguments));
    var newArgsLength = fnArgsLength - arguments.length;
    if (newArgsLength < 1) return fn.apply(null, newArgs);
    return curried(fn, newArgs, newArgsLength);
  };
}

function currying(fn) {
  return curried(fn, [], fn.length);
}

function uncurrify(fn) {
  return function () {
    var newArgs = toArray(arguments);
    var firstArgs = newArgs.splice(0, 1);
    var result = fn(firstArgs);
    // if argument's length is 1
    if (newArgs <= 0) { return result; }
    newArgs.forEach(function (arg) {
      result = result(arg);
    });
    return typeof result === 'function'
      ? throwError('Arguments is not enough')
      : result;
  };
}

module.exports = {
  currify: currying,
  uncurrify: uncurrify,
};
