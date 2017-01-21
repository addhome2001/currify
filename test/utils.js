import ava from 'ava';
import { toArray, throwError } from '../lib/utils';

const getArgs = function () {
  return toArray(arguments);
};

ava('should return arguments to an array', (t) => {
  t.deepEqual(getArgs(1, 2, 3), [1, 2, 3]);
});

ava('should return empty array if arguments is not exist', (t) => {
  t.deepEqual(getArgs(), []);
});

ava('should throw Error', (t) => {
  const error = t.throws(() => {
    throwError('New Error');
  }, Error);

  t.is(error.message, 'New Error');
});
