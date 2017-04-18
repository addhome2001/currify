import ava from 'ava';
import currify from '../lib/currify';

ava('should return same result as before', (t) => {
  const s = (a, b, c) => a + b + c;
  const sc = currify(s);
  t.is(sc(1)(2)(3), s(1, 2, 3));
});

ava('should currfied function not affect each other', (t) => {
  const add = currify((a, b) => a + b);
  const add1 = add(1);
  const add2 = add(2);
  const add3 = add(3);
  const add4 = add(4);
  const add5 = add(5);
  t.is(add1(1), 2);
  t.is(add2(2), 4);
  t.is(add3(3), 6);
  t.is(add4(4), 8);
  t.is(add5(5), 10);
});

ava('should allow combine multiple currify function', (t) => {
  const square = currify(a => a ** 2);
  const identify = currify(value => ({ value: square(value) }));
  const zipWith = currify((cb, a) => a.map(cb));
  const zipAdd = zipWith(identify);

  t.deepEqual(
    zipAdd([2, 3, 4]),
    [{ value: 4 }, { value: 9 }, { value: 16 }],
  );
});

ava('should allow multiple arguments to be passed at a time', (t) => {
  const sum3 = currify((a, b, c) => a + b + c);

  t.is(sum3(1, 2, 3), sum3(1, 2)(3));
  t.is(sum3(1, 2, 3), sum3(1)(2, 3));
  t.is(sum3(1, 2, 3), sum3(1)(2)(3));
});
