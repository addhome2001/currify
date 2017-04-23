import ava from 'ava';
import { spy, useFakeTimers } from 'sinon';
import debounce from '../lib/debounce';

const mockFunc = spy();
const debounceCurrify = debounce.bind(null, mockFunc, 2000);
let clock;

ava.beforeEach(() => {
  clock = useFakeTimers();
});

ava.afterEach(() => {
  clock.restore();
  mockFunc.reset();
});

ava('should return debounced function.', (t) => {
  const debounced = debounceCurrify();

  debounced('trigger 1');
  t.is(mockFunc.callCount, 1);
  t.is(mockFunc.getCall(0).args[0], 'trigger 1');

  clock.tick(1000);

  debounced('trigger 2');
  t.is(mockFunc.callCount, 1);

  clock.tick(2001);

  t.is(mockFunc.callCount, 3);
  t.is(mockFunc.getCall(1).args[0], 'trigger 2');
  t.is(mockFunc.getCall(2).args[0], 'trigger 2');

  debounced('trigger 3');
  t.is(mockFunc.callCount, 4);
  t.is(mockFunc.getCall(3).args[0], 'trigger 3');

  clock.tick(1000);

  debounced('trigger 4');
  t.is(mockFunc.callCount, 4);

  clock.tick(2001);

  t.is(mockFunc.callCount, 6);
  t.is(mockFunc.getCall(4).args[0], 'trigger 4');
  t.is(mockFunc.getCall(5).args[0], 'trigger 4');
});

ava('should the func is invoked only on the leading edge if trailing is false.', (t) => {
  const debounced = debounceCurrify({ trailing: false });

  debounced('trigger 1');
  t.is(mockFunc.callCount, 1);
  t.is(mockFunc.getCall(0).args[0], 'trigger 1');

  clock.tick(1000);

  debounced('trigger 2');
  t.is(mockFunc.callCount, 1);

  clock.tick(2001);

  debounced('trigger 3');
  t.is(mockFunc.callCount, 2);
  t.is(mockFunc.getCall(1).args[0], 'trigger 3');
});

ava('should the func is invoked on the trailing edge if leading is false.', (t) => {
  const debounced = debounceCurrify({ leading: false });

  debounced('trigger 1');
  debounced('trigger 2');
  t.is(mockFunc.callCount, 0);

  clock.tick(1000);

  debounced('trigger 3');
  t.is(mockFunc.callCount, 0);

  clock.tick(2001);

  t.is(mockFunc.callCount, 1);
  t.is(mockFunc.getCall(0).args[0], 'trigger 3');

  debounced('trigger 4');
  debounced('trigger 5');
  t.is(mockFunc.callCount, 1);

  clock.tick(2001);

  t.is(mockFunc.callCount, 2);
  t.is(mockFunc.getCall(1).args[0], 'trigger 5');
});

ava('should not invoke func if leading and trailing are falsly.', (t) => {
  const debounced = debounceCurrify({ leading: false, trailing: false });

  debounced('trigger 1');
  debounced('trigger 2');

  clock.tick(2001);

  debounced('trigger 3');
  debounced('trigger 4');

  clock.tick(2001);

  t.is(mockFunc.callCount, 0);
});

ava('should the func invocation is deferred until to the next tick.', (t) => {
  const debounced = debounce(mockFunc, 0, { leading: false });

  debounced('trigger 1');
  t.is(mockFunc.callCount, 0);

  clock.tick(0);

  t.is(mockFunc.callCount, 2);
  t.is(mockFunc.getCall(0).args[0], 'trigger 1');
  t.is(mockFunc.getCall(1).args[0], 'trigger 1');

  debounced('trigger 2');
  t.is(mockFunc.callCount, 2);

  clock.tick(0);

  t.is(mockFunc.callCount, 4);
  t.is(mockFunc.getCall(2).args[0], 'trigger 2');
  t.is(mockFunc.getCall(3).args[0], 'trigger 2');
});

ava('should not delay invoking if delay time is more than maxWait.', (t) => {
  const debounced = debounce(mockFunc, 2000, { leading: false, maxWait: 2000 });

  debounced('trigger 1');
  clock.tick(1000);
  debounced('trigger 2');
  clock.tick(1000);
  debounced('trigger 3');
  t.is(mockFunc.callCount, 1);
  t.is(mockFunc.getCall(0).args[0], 'trigger 1');
});

ava('should throw error if the func is not a function.', (t) => {
  const { message } = t.throws(() => {
    debounce('Not a Function.');
  }, Error);

  t.is(message, 'The first argument is not a Function.');
});
