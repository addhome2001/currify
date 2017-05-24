import ava from 'ava';
import { toArray, throwError } from '../lib/utils';

const getArgs = function () {
  return toArray(arguments);
};

ava('toArray', (t) => {
  t.deepEqual(getArgs(1, 2, 3), [1, 2, 3]);
});

ava('passing undefined', (t) => {
  t.deepEqual(getArgs(), []);
});

ava('throw an Error', (t) => {
  const error = t.throws(() => {
    throwError('New Error');
  }, Error);

  t.is(error.message, 'New Error');
});
