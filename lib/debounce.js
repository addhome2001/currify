// 限制在幾毫秒之後調用提供函數
// 如果再延遲期間內
// 又在調用的話
// 會將時間再延長，以此類推
// 選項：
//    leading: 是否在一開始調用
//    trailing: 是否在等待時間結束後調用
//    maxWait: 允許最多可以延遲多久

var utils = require('./utils');

/**
 * debounce
 * @param  {Function} func    [debounce函數]
 * @param  {Number}   wait    [等待豪秒數=0]
 * @param  {Object}   options [options={}]
 *         {Bool}     leading [指定頭部調用=true]
 *         {Bool}     tailing [指定尾部調用=true]
 *         {Number}   maxWait [限制最久可以延遲多長]
 * @return {Function}         [debounce後函數]
 */
function debounce(func, wait, options) {
  var waitTime = +wait || 0;
  var opts = options || {};
  var leading = opts.leading === undefined;
  var trailing = opts.trailing === undefined;
  var maxWait = !isNaN(opts.maxWait) && opts.maxWait;

  // 現在時間 + waitTime
  var lastTime;
  // 在等待期間調用會回傳頭部調用的結果
  var result;
  // 調用定時器
  var timer;
  // 尾部調用定時器
  var trailEdgeTimer;
  // 總延遲時間
  var delayTime = 0;

  if (func.constructor.name !== 'Function') {
    utils.throwError('The first argument is not a Function.');
  }

  return function () {
    var now = Date.now();
    var args = utils.toArray(arguments);
    // 是否在等待期間
    var isWait = now < lastTime;

    // 如果在第一次或是下一次閒置後調用
    if (!lastTime || !isWait) {
      lastTime = now + waitTime;

      // 如果尾部調用為true，就在m秒後調用
      if (trailing) {
        timer = setTimeout(function () {
          func.apply(null, args);
        }, waitTime);
      }

      // 如果頭部調用為true，立刻調用
      if (leading) {
        result = func.apply(null, args);

      // 如果頭部調用為false，且wait為0，就在下一個tick調用
      } else if (now === lastTime) {
        setTimeout(function () {
          func.apply(null, args);
        }, 0);
      }
    } else {
      // 如果在等待期間
      // 如果所有延遲時間超過最多限制
      // 就回傳false，下面的尾部調用不會被延遲
      if (maxWait) {
        delayTime += waitTime;
        if (delayTime >= maxWait) return false;
      }

      // 重新計算上次調用時間
      // 並重新判斷是否為等待期間
      lastTime = now + waitTime;
      isWait = now < lastTime;

      // 如果trailing為true
      // 且在等待期間調用，就清掉現在timer
      // 並重新倒數
      if (trailing) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          func.apply(null, args);
        }, waitTime);
      }
    }

    // 假如leading、trailing都為true、且在等待中
    // 就讓函數在尾部調用
    // 如果在等待期間繼續調用，就延長時間
    if (leading && trailing && isWait) {
      clearTimeout(trailEdgeTimer);
      trailEdgeTimer = setTimeout(function () {
        func.apply(null, args);
      }, waitTime);
    }

    return result;
  };
}

module.exports = debounce;
