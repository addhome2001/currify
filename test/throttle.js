import ava from 'ava';
import { spy, useFakeTimers } from 'sinon';
import throttle from '../lib/throttle';

const mockFunc = spy();
const throttleCurrify = throttle.bind(null, mockFunc, 2000);
let clock;

ava.beforeEach(() => {
  clock = useFakeTimers();
});

ava.afterEach(() => {
  clock.restore();
  mockFunc.reset();
});

ava('should return throttled function.', (t) => {
  const throttled = throttleCurrify();

  throttled('trigger 1');
  t.is(mockFunc.callCount, 1);
  t.is(mockFunc.getCall(0).args[0], 'trigger 1');
  throttled('trigger 2');
  t.is(mockFunc.callCount, 1);

  clock.tick(2001);

  t.is(mockFunc.callCount, 3);
  t.is(mockFunc.getCall(1).args[0], 'trigger 1');
  t.is(mockFunc.getCall(2).args[0], 'trigger 2');

  throttled('trigger 3');
  t.is(mockFunc.callCount, 4);
  t.is(mockFunc.getCall(3).args[0], 'trigger 3');
  throttled('trigger 4');
  t.is(mockFunc.callCount, 4);

  clock.tick(2001);

  t.is(mockFunc.callCount, 6);
  t.is(mockFunc.getCall(4).args[0], 'trigger 3');
  t.is(mockFunc.getCall(5).args[0], 'trigger 4');
});

ava('should the func is invoked only on the leading edge if trailing is false.', (t) => {
  const throttled = throttleCurrify({ trailing: false });

  throttled('trigger 1');
  t.is(mockFunc.callCount, 1);
  t.is(mockFunc.getCall(0).args[0], 'trigger 1');

  clock.tick(2001);

  throttled('trigger 2');
  t.is(mockFunc.callCount, 2);
  t.is(mockFunc.getCall(1).args[0], 'trigger 2');
});

ava('should the func is invoked on the trailing edge if leading is false.', (t) => {
  const throttled = throttleCurrify({ leading: false });

  throttled('trigger 1');
  throttled('trigger 2');
  t.is(mockFunc.callCount, 0);

  clock.tick(2001);

  t.is(mockFunc.callCount, 1);
  t.is(mockFunc.getCall(0).args[0], 'trigger 1');

  throttled('trigger 3');
  throttled('trigger 4');
  t.is(mockFunc.callCount, 1);

  clock.tick(2001);

  t.is(mockFunc.callCount, 2);
  t.is(mockFunc.getCall(1).args[0], 'trigger 3');
});

ava('should not invoke func if leading and trailing are falsly.', (t) => {
  const throttled = throttleCurrify({ leading: false, trailing: false });

  throttled('trigger 1');
  throttled('trigger 2');

  clock.tick(2001);

  throttled('trigger 3');
  throttled('trigger 4');

  clock.tick(2001);

  t.is(mockFunc.callCount, 0);
});

ava('should the func invocation is deferred until to the next tick.', (t) => {
  const throttled = throttle(mockFunc, 0, { leading: false });

  throttled('trigger 1');
  t.is(mockFunc.callCount, 0);

  clock.tick(0);

  t.is(mockFunc.callCount, 2);
  t.is(mockFunc.getCall(0).args[0], 'trigger 1');
  t.is(mockFunc.getCall(1).args[0], 'trigger 1');

  throttled('trigger 2');
  t.is(mockFunc.callCount, 2);

  clock.tick(0);

  t.is(mockFunc.callCount, 4);
  t.is(mockFunc.getCall(2).args[0], 'trigger 2');
  t.is(mockFunc.getCall(3).args[0], 'trigger 2');
});

ava('should throw error if the func is not a function.', (t) => {
  const { message } = t.throws(() => {
    throttle('Not a Function.');
  }, Error);

  t.is(message, 'The first argument is not a Function.');
});
