/*!
 * currify <https://github.com/addhome2001/currify>
 *
 * Copyright (c) 2017 addhome2001, contributors.
 * Licensed under the MIT License
 */

function toArray(args) {
  return Array.prototype.slice.call(args);
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

module.exports = currying;
