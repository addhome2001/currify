# js-utility

[![Build Status](https://travis-ci.org/addhome2001/js-utility.svg?branch=master)](https://travis-ci.org/addhome2001/js-utility)
[![Known Vulnerabilities](https://snyk.io/test/github/addhome2001/currify/badge.svg)](https://snyk.io/test/github/addhome2001/currify)

currify
------
```js
const sum = currify((a, b, c) => a + b + c);

// Passing partial arguments
sum(1, 2)(3));
sum(1)(2, 3));
sum(1)(2)(3));

// Or full arguments
sum(1, 2, 3);

// Currify function will return a new curried function
sum2 = sum(1, 2);
sum2(4); // -> 7
sum2(5); // -> 8
```

uncurrify
------
```js
const uncurry = uncurrify(a => b => c => a * b * c);
uncurry(1, 2, 3); // -> 6
uncurry(1, 2, 3, 4, 5); // Throw Error: Arguments are too much
uncurry(1); // Throw Error: Arguments are not enough
```
If the uncurrify function does not take any parameters.
```js
const uncurry = uncurrify(() => 1 + 2);
uncurry('foo bar') // -> 3
```

LICENSE
=======

MIT
