import ava from 'ava';
import uncurrify from '../lib/uncurrify';

ava('should throw Error if passing arguments\' is empty and can invoke just once time', (t) => {
  const curry = (() => 1 + 2);
  const uncurry = uncurrify(curry);
  t.is(uncurry(), 3);
});

ava('should throw Error if passing arguments\' is empty and can not invoke just once time', (t) => {
  const curry = (a => b => a + b);
  const uncurry = uncurrify(curry);
  const { message } = t.throws(() => {
    uncurry();
  }, Error);
  t.is(message, 'Arguments are not enough');
});

ava('should throw Error if passing arguments\' is more than expect', (t) => {
  const curry = (a => b => c => (+a) + (+b) + (+c));
  const uncurry = uncurrify(curry);
  const { message } = t.throws(() => {
    uncurry(1, 2, 3, 4, 5);
  }, Error);
  t.is(message, 'Arguments are too much');
});

ava('should throw Error if passing arguments\' is not enough', (t) => {
  const curry = (a => b => c => (+a) + (+b) + (+c));
  const uncurry = uncurrify(curry);
  const { message } = t.throws(() => {
    uncurry(1, 2);
  }, Error);
  t.is(message, 'Arguments are not enough');
});
