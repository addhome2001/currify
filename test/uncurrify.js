import ava from 'ava';
import uncurrify from '../lib/uncurrify';

ava('return result', (t) => {
  const curry = (a => b => c => a * b * c);
  const uncurry = uncurrify(curry);
  t.is(uncurry(1, 2, 3), 6);
});

ava('expect arguments are empty', (t) => {
  const curry = (() => 1 + 2);
  const uncurry = uncurrify(curry);
  t.is(uncurry(), 3);
});

ava('arguments are not enough', (t) => {
  const curry = (a => b => a + b);
  const uncurry = uncurrify(curry);
  const { message } = t.throws(() => {
    uncurry();
  }, Error);
  t.is(message, 'Arguments are not enough');
});

ava('arguments are too much', (t) => {
  const curry = (a => b => c => (+a) + (+b) + (+c));
  const uncurry = uncurrify(curry);
  const { message } = t.throws(() => {
    uncurry(1, 2, 3, 4, 5);
  }, Error);
  t.is(message, 'Arguments are too much');
});

ava('arguments are not enough', (t) => {
  const curry = (a => b => c => (+a) + (+b) + (+c));
  const uncurry = uncurrify(curry);
  const { message } = t.throws(() => {
    uncurry(1, 2);
  }, Error);
  t.is(message, 'Arguments are not enough');
});
