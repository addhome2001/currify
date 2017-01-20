function toArray(args) {
  return Array.prototype.slice.call(args);
}

function throwError(reason) {
  throw new Error(reason);
}

module.exports = {
  toArray: toArray,
  throwError: throwError,
};
