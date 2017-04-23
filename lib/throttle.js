// 限制在幾毫秒之內函數調用次數
// 會處於等待狀態，且不會再繼續調用提供的函數
// 再等待時間結束後，進入閒置狀態
// 選項：
//    leading: 是否在一開始調用
//    trailing: 是否在等待時間結束後調用

var utils = require('./utils');

/**
 * throttle
 * @param  {Function} func    [throttle函數]
 * @param  {Number}   wait    [等待豪秒數=0]
 * @param  {Object}   options [options={}]
 *         {Bool}     leading [指定頭部調用=true]
 *         {Bool}     tailing [指定尾部調用=true]
 * @return {Function}         [throttle後函數]
 */
function throttle(func, wait, options) {
  var waitTime = +wait || 0;
  var opts = options || {};
  var leading = opts.leading === undefined;
  var trailing = opts.trailing === undefined;

  // 尾部現在有沒有要調用
  var isTrailEdge = false;
  // 現在時間 + waitTime
  var lastTime;
  // 在等待期間調用會回傳頭部調用的結果
  var result;

  if (func.constructor.name !== 'Function') {
    utils.throwError('The first argument is not a Function.');
  }

  return function () {
    var now = Date.now();
    var args = utils.toArray(arguments);
    // 是否在等待期間
    var isWait = now < lastTime;

    // 在不是等待期間和第一次調用
    if (!lastTime || !isWait) {
      lastTime = now + waitTime;

      // 如果trailing為true，就在時間結束後調用
      if (trailing) {
        setTimeout(function () {
          func.apply(null, args);
        }, waitTime);
      }

      // 如果leading為true，立刻調用
      if (leading) {
        result = func.apply(null, args);

      // 如果leading為false，且等待為0，就在下一個tick調用
      } else if (now === lastTime) {
        setTimeout(function () {
          func.apply(null, args);
        }, 0);
      }
    }

    // 假如leading、trailing都為true
    // 且在等待中、還沒有尾部調用（和等待時間結束後調用不同）
    // 就讓函數在尾部調用
    if (leading && trailing && isWait && !isTrailEdge) {
      isTrailEdge = true;
      setTimeout(function () {
        isTrailEdge = false;
        func.apply(null, args);
      }, lastTime - now);
    }

    return result;
  };
}

module.exports = throttle;
