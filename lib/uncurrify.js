var utils = require('./utils');

function uncurrify(fn) {
  return function () {
    var newArgs = utils.toArray(arguments);
    var result = fn;
    var firstExcute;

    if (newArgs.length <= 0) {
      firstExcute = fn();
      if (typeof firstExcute === 'function') {
        utils.throwError('Arguments are not enough');
      }
      return firstExcute;
    }

    newArgs.forEach(function (arg) {
      if (typeof result === 'function') {
        result = result(arg);
      } else {
        utils.throwError('Arguments are too much');
      }
    });

    if (typeof result === 'function') {
      utils.throwError('Arguments are not enough');
    }

    return result;
  };
}

module.exports = uncurrify;
