/*!
 * currify <https://github.com/addhome2001/currify>
 *
 * Copyright (c) 2017 addhome2001, contributors.
 * Licensed under the MIT License
 */
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

function uncurrify(fn) {
  return function () {
    var newArgs = utils.toArray(arguments);
    var result = fn;
    var firstExcute;

    if (newArgs.length <= 0) {
      firstExcute = fn();
      if (typeof firstExcute === 'function') {
        utils.throwError('Arguments is not enough');
      }
      return firstExcute;
    }

    newArgs.forEach(function (arg) {
      if (typeof result === 'function') {
        result = result(arg);
      } else {
        utils.throwError('Arguments too much');
      }
    });

    if (typeof result === 'function') {
      utils.throwError('Arguments is not enough');
    }
    return result;
  };
}

module.exports = {
  currify: currying,
  uncurrify: uncurrify,
};
