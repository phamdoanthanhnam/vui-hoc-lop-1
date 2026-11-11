/* Đối chiếu SGK Toán 5, Tập một, Kết nối tri thức với cuộc sống:
   Bài 19 tr.65–66; Bài 20 tr.68–69; Bài 21 tr.71–74;
   Bài 22 tr.76–82; Bài 23 tr.83–86 (chỉ phần nhân, chia với 10; 100; 1 000 —
   trang chưa có phần nhân, chia với 0,1; 0,01; 0,001). Ví dụ 3,50 + 1,25 theo yêu cầu giáo viên. */
/* Số thập phân Lớp 5 — sinh đề, chấm bài, lời giải.
   Mọi số là số nguyên phần nghìn (3,5 = 3500). Cộng trừ nhân chia
   chỉ dùng số nguyên, nên kết quả đúng đến tối đa 3 chữ số thập phân. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.STP = api;
})(typeof self !== 'undefined' ? self : this, function () {
  var SCALE = 1000;

  function randInt(rng, lo, hi) {
    return lo + Math.floor(rng() * (hi - lo + 1));
  }

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
  }

  function placesOf(milli) {
    var f = Math.abs(milli) % SCALE;
    if (f === 0) return 0;
    if (f % 100 === 0) return 1;
    if (f % 10 === 0) return 2;
    return 3;
  }

  function fmt(milli) {
    var neg = milli < 0;
    var v = Math.abs(milli);
    var ip = Math.floor(v / SCALE);
    var f = v % SCALE;
    var s = String(ip);
    if (f !== 0) {
      var frac = String(f).padStart(3, '0').replace(/0+$/, '');
      s += ',' + frac;
    }
    return neg ? '-' + s : s;
  }

  /* Hiển thị kiểu SGK: tách lớp nghìn bằng khoảng trắng (1 000; 7 870). Chỉ dùng để hiện, không dùng để chấm. */
  function fmtG(milli) {
    var s = fmt(milli);
    var neg = s.charAt(0) === '-';
    if (neg) s = s.slice(1);
    var parts = s.split(',');
    var ip = parts[0];
    if (ip.length >= 4) ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
    return (neg ? '-' : '') + ip + (parts.length > 1 ? ',' + parts[1] : '');
  }

  function numG(n) {
    return fmtG(n * SCALE);
  }

  function fmtFixed(milli, places) {
    var neg = milli < 0;
    var v = Math.abs(milli);
    var ip = Math.floor(v / SCALE);
    var f = v % SCALE;
    var s = String(ip);
    if (places > 0) s += ',' + String(f).padStart(3, '0').slice(0, places);
    return neg ? '-' + s : s;
  }

  function parseAnswer(input) {
    if (input == null) return null;
    var s = String(input).trim().replace(/\s+/g, '').replace(/,/g, '.');
    if (!/^\d+(\.\d+)?$/.test(s)) return null;
    var parts = s.split('.');
    var ip = parts[0];
    var fr = parts[1] || '';
    if (ip.length > 9 || fr.length > 8) return null;
    if (fr.length > 3 && /[1-9]/.test(fr.slice(3))) return null;
    var frac3 = (fr + '000').slice(0, 3);
    var milli = Number(ip) * SCALE + Number(frac3);
    if (!Number.isSafeInteger(milli)) return null;
    return milli;
  }

  function splitDigits(milli) {
    var v = Math.abs(milli);
    var frac = v % SCALE;
    var ip = Math.floor(v / SCALE);
    var fracDigits = [
      Math.floor(frac / 100),
      Math.floor((frac % 100) / 10),
      frac % 10
    ];
    var intDigits = [];
    if (ip === 0) intDigits.push(0);
    else {
      while (ip > 0) {
        intDigits.unshift(ip % 10);
        ip = Math.floor(ip / 10);
      }
    }
    return { intDigits: intDigits, fracDigits: fracDigits };
  }

  function digitRow(milli, intLen, d) {
    var sp = splitDigits(milli);
    var ints = [];
    var i;
    for (i = 0; i < intLen; i++) ints.push(0);
    for (i = 0; i < sp.intDigits.length; i++) {
      ints[intLen - sp.intDigits.length + i] = sp.intDigits[i];
    }
    var fr = [];
    for (i = 0; i < d; i++) fr.push(sp.fracDigits[i] || 0);
    return ints.concat(fr);
  }

  function blankLead(digits, intLen) {
    var out = digits.slice();
    for (var i = 0; i < intLen - 1; i++) {
      if (out[i] === 0) out[i] = '';
      else break;
    }
    return out;
  }

  var COL_NAMES = {
    '-4': 'hàng chục nghìn',
    '-3': 'hàng nghìn',
    '-2': 'hàng trăm',
    '-1': 'hàng chục',
    '0': 'hàng đơn vị',
    '1': 'hàng phần mười',
    '2': 'hàng phần trăm',
    '3': 'hàng phần nghìn',
    '4': 'hàng phần chục nghìn'
  };

  function colName(index, intLen) {
    var offset = index - (intLen - 1);
    return COL_NAMES[String(offset)] || 'cột tiếp theo';
  }

  function hasCarry(nums) {
    var parts = nums.map(splitDigits);
    var intLen = 0;
    parts.forEach(function (p) { if (p.intDigits.length > intLen) intLen = p.intDigits.length; });
    var cols = parts.map(function (p) {
      var ints = [];
      for (var i = 0; i < intLen; i++) ints.push(0);
      for (var j = 0; j < p.intDigits.length; j++) ints[intLen - p.intDigits.length + j] = p.intDigits[j];
      return ints.concat(p.fracDigits);
    });
    var width = cols[0].length;
    var carry = 0;
    for (var i = width - 1; i >= 0; i--) {
      var s = carry;
      for (var r = 0; r < cols.length; r++) s += cols[r][i];
      if (s >= 10) return true;
      carry = 0;
    }
    return false;
  }

  function hasBorrow(a, b) {
    var A = splitDigits(a);
    var B = splitDigits(b);
    var intLen = Math.max(A.intDigits.length, B.intDigits.length);
    function cols(p) {
      var ints = [];
      for (var i = 0; i < intLen; i++) ints.push(0);
      for (var j = 0; j < p.intDigits.length; j++) ints[intLen - p.intDigits.length + j] = p.intDigits[j];
      return ints.concat(p.fracDigits);
    }
    var da = cols(A);
    var db = cols(B);
    for (var i = 0; i < da.length; i++) if (da[i] < db[i]) return true;
    return false;
  }

  function randomDecimal(rng, intMin, intMax, places) {
    var ip = randInt(rng, intMin, intMax);
    if (places <= 0) return ip * SCALE;
    if (places === 1) return ip * SCALE + randInt(rng, 1, 9) * 100;
    if (places === 2) return ip * SCALE + randInt(rng, 0, 9) * 100 + randInt(rng, 1, 9) * 10;
    return ip * SCALE + randInt(rng, 0, 9) * 100 + randInt(rng, 0, 9) * 10 + randInt(rng, 1, 9);
  }

  function computeAnswer(op, nums) {
    if (op === 'add') {
      var s = 0;
      for (var i = 0; i < nums.length; i++) s += nums[i];
      return s;
    }
    if (op === 'sub') return nums[0] - nums[1];
    if (op === 'mul') {
      var prod = nums[0] * nums[1];
      if (prod % SCALE !== 0) return null;
      return prod / SCALE;
    }
    if (op === 'div') {
      if (!nums[1]) return null;
      var num = nums[0] * SCALE;
      if (num % nums[1] !== 0) return null;
      return num / nums[1];
    }
    return null;
  }

  function pack(op, level, kind, nums, meta) {
    var answer = computeAnswer(op, nums);
    if (answer == null || !Number.isInteger(answer) || answer < 0) {
      throw new Error('bad answer ' + op);
    }
    if (placesOf(answer) > 3) throw new Error('too many places');
    return {
      op: op,
      level: level,
      kind: kind || 0,
      nums: nums.slice(),
      answer: answer,
      meta: meta || {}
    };
  }

  function tryLoop(fn, times) {
    var last = null;
    for (var i = 0; i < times; i++) {
      last = fn();
      if (last) return last;
    }
    throw new Error('generator failed');
  }

  function genAddDe(rng) {
    var d = randInt(rng, 1, 2);
    var intLen = randInt(rng, 1, 2);
    var Aint = [], Bint = [], Afr = [], Bfr = [];
    var i, x, y;
    for (i = 0; i < intLen; i++) {
      x = randInt(rng, i === 0 ? 1 : 0, 4);
      y = randInt(rng, i === 0 ? 1 : 0, 4);
      Aint.push(x); Bint.push(y);
    }
    for (i = 0; i < d; i++) {
      x = randInt(rng, i === d - 1 ? 1 : 0, 4);
      y = randInt(rng, i === d - 1 ? 1 : 0, 4);
      Afr.push(x); Bfr.push(y);
    }
    function from(ints, fr) {
      var ip = 0, k;
      for (k = 0; k < ints.length; k++) ip = ip * 10 + ints[k];
      var milli = ip * SCALE;
      var mul = 100;
      for (k = 0; k < fr.length; k++) { milli += fr[k] * mul; mul = Math.floor(mul / 10); }
      return milli;
    }
    return pack('add', 'de', 0, [from(Aint, Afr), from(Bint, Bfr)]);
  }

  function genAddVua(rng) {
    var pairs = [[1, 2], [1, 3], [2, 3]];
    var pair = pairs[randInt(rng, 0, 2)];
    var p1 = pair[0], p2 = pair[1];
    if (rng() < 0.5) { var tmp = p1; p1 = p2; p2 = tmp; }
    var a = randomDecimal(rng, 1, 70, p1);
    var b = randomDecimal(rng, 1, 70, p2);
    return pack('add', 'vua', 0, [a, b]);
  }

  function genAddKho(rng) {
    var ps = [randInt(rng, 1, 3), randInt(rng, 1, 3), randInt(rng, 1, 3)];
    var nums = ps.map(function (p) { return randomDecimal(rng, 1, 40, p); });
    if (!hasCarry(nums)) {
      nums[0] = Math.floor(nums[0] / 100) * 100 + 60 + (nums[0] % 10);
      nums[1] = Math.floor(nums[1] / 100) * 100 + 70 + (nums[1] % 10);
      if (placesOf(nums[0]) === 0) nums[0] += 60;
      if (placesOf(nums[1]) === 0) nums[1] += 70;
    }
    if (!hasCarry(nums)) return null;
    return pack('add', 'kho', 0, nums);
  }

  function genSubDe(rng) {
    var d = randInt(rng, 1, 2);
    var intLen = randInt(rng, 1, 2);
    var Aint = [], Bint = [], Afr = [], Bfr = [];
    var i, x, y;
    for (i = 0; i < intLen; i++) {
      x = randInt(rng, i === 0 ? 2 : 0, 9);
      y = randInt(rng, 0, Math.max(0, x - 1));
      if (i === 0 && y >= x) y = x - 1;
      Aint.push(x); Bint.push(y);
    }
    for (i = 0; i < d; i++) {
      x = randInt(rng, i === d - 1 ? 1 : 0, 9);
      y = randInt(rng, 0, x);
      if (i === d - 1 && y === 0 && x === 0) { x = 1; y = 0; }
      if (i === d - 1 && x === y) { if (x < 9) x++; else y = x - 1; }
      Afr.push(x); Bfr.push(y);
    }
    if (Bfr[Bfr.length - 1] === 0) {
      if (Afr[Afr.length - 1] > 1) Bfr[Bfr.length - 1] = 1;
      else { Afr[Afr.length - 1] = 2; Bfr[Bfr.length - 1] = 1; }
    }
    function from(ints, fr) {
      var ip = 0, k;
      for (k = 0; k < ints.length; k++) ip = ip * 10 + ints[k];
      var milli = ip * SCALE;
      var mul = 100;
      for (k = 0; k < fr.length; k++) { milli += fr[k] * mul; mul = Math.floor(mul / 10); }
      return milli;
    }
    var a = from(Aint, Afr);
    var b = from(Bint, Bfr);
    if (!(a > b) || hasBorrow(a, b)) return null;
    if (placesOf(a) !== placesOf(b)) return null;
    return pack('sub', 'de', 0, [a, b]);
  }

  function genSubVua(rng) {
    var pShort = randInt(rng, 1, 2);
    var pLong = randInt(rng, pShort + 1, 3);
    var a = randomDecimal(rng, 1, 80, rng() < 0.5 ? pShort : pLong);
    var b = randomDecimal(rng, 1, 80, a && placesOf(a) === pShort ? pLong : pShort);
    if (placesOf(a) === placesOf(b)) return null;
    if (a < b) { var t = a; a = b; b = t; }
    if (!(a > b)) return null;
    if (placesOf(a) === placesOf(b)) return null;
    if (placesOf(a) < 1 || placesOf(b) < 1) return null;
    return pack('sub', 'vua', 0, [a, b]);
  }

  function genSubKho(rng) {
    var roll = rng();
    var a, b;
    if (roll < 0.25) {
      // Số tự nhiên trừ số thập phân, ví dụ 15 − 4,72.
      var A = randInt(rng, 2, 30);
      a = A * SCALE;
      b = randomDecimal(rng, 0, A - 1, randInt(rng, 1, 2));
    } else if (roll < 0.5) {
      // Số bị trừ có ít chữ số ở phần thập phân hơn, ví dụ 7,4 − 3,56.
      a = randomDecimal(rng, 2, 40, 1);
      b = randomDecimal(rng, 1, Math.max(1, Math.floor(a / SCALE)), 2);
    } else if (roll < 0.75) {
      var p = randInt(rng, 2, 3);
      a = randomDecimal(rng, 3, 60, p);
      b = randomDecimal(rng, 1, Math.max(1, Math.floor(a / SCALE)), randInt(rng, 1, p));
    } else {
      var u = randInt(rng, 3, 9);
      var bu = randInt(rng, 1, u - 1);
      var ah = randInt(rng, 1, 4);
      var bh = randInt(rng, ah + 1, 9);
      var bt = randInt(rng, 0, 9);
      if (rng() < 0.55) {
        a = u * SCALE + ah * 10;
        b = bu * SCALE + bt * 100 + bh * 10;
      } else {
        a = u * SCALE + ah * 10 + randInt(rng, 1, 9);
        b = bu * SCALE + bt * 100 + bh * 10 + randInt(rng, 0, 9);
      }
    }
    if (!(a > b) || !hasBorrow(a, b)) return null;
    if (placesOf(b) < 1) return null;
    return pack('sub', 'kho', 0, [a, b]);
  }

  function genMulDe(rng) {
    var d = randInt(rng, 1, 2);
    var a = randomDecimal(rng, 1, 48, d);
    var n = randInt(rng, 2, 9);
    return pack('mul', 'de', 0, [a, n * SCALE], { subtype: 'natural' });
  }

  function genMulVua(rng) {
    var d1 = randInt(rng, 1, 2);
    var d2 = randInt(rng, 1, 3 - d1);
    var a = randomDecimal(rng, 0, 18, d1);
    var b = randomDecimal(rng, 0, 12, d2);
    if (a < 100 || b < 100) return null;
    return pack('mul', 'vua', 0, [a, b], { subtype: 'mixed' });
  }

  function genMulKho(rng) {
    if (rng() < 0.5) {
      var pows = [10, 100, 1000];
      var pow = pows[randInt(rng, 0, 2)];
      var shift = String(pow).length - 1;
      var d = randInt(rng, 1, 3);
      var ipMax = pow === 1000 ? 20 : 90;
      var a = randomDecimal(rng, rng() < 0.25 ? 0 : 1, ipMax, d);
      if (a < 100) return null;
      return pack('mul', 'kho', 0, [a, pow * SCALE], { subtype: 'pow10', pow: pow, shift: shift });
    }
    var leftSmall = rng() < 0.55;
    var a, b;
    if (leftSmall) {
      a = randomDecimal(rng, 0, 0, 2);
      b = randomDecimal(rng, 1, 12, 1);
    } else {
      var first = rng() < 0.5;
      a = randomDecimal(rng, 0, 15, first ? 2 : 1);
      b = randomDecimal(rng, 0, 15, first ? 1 : 2);
    }
    if (a < 100 || b < 100) return null;
    if (placesOf(a) + placesOf(b) !== 3) return null;
    return pack('mul', 'kho', 0, [a, b], { subtype: 'mixed' });
  }

  function genDiv1De(rng) {
    var N = randInt(rng, 2, 9);
    var qInt = randInt(rng, 1, 12);
    var qTenth = randInt(rng, 1, 9);
    if ((qTenth * N) % 10 === 0) return null;
    var Q = qInt * SCALE + qTenth * 100;
    var dividend = Q * N;
    if (placesOf(dividend) !== 1 || placesOf(Q) !== 1) return null;
    if (dividend >= 100 * SCALE) return null;
    return pack('div', 'de', 1, [dividend, N * SCALE]);
  }

  function genDiv1Vua(rng) {
    var N = randInt(rng, 2, 12);
    var qInt = randInt(rng, 1, 24);
    var qT = randInt(rng, 0, 9);
    var qH = randInt(rng, 1, 9);
    var M = qInt * 100 + qT * 10 + qH;
    if ((M * N) % 10 === 0) return null;
    var Q = M * 10;
    var dividend = Q * N;
    if (placesOf(dividend) !== 2) return null;
    if (dividend >= 800 * SCALE) return null;
    return pack('div', 'vua', 1, [dividend, N * SCALE]);
  }

  function genDiv1Kho(rng) {
    var N = randInt(rng, 6, 25);
    if (N % 10 === 0) return null; // chia cho 10, 20 nên làm bằng cách chuyển dấu phẩy
    var qInt = randInt(rng, 0, 20);
    var qT = randInt(rng, 0, 9);
    var qH = randInt(rng, 0, 9);
    var qTh = randInt(rng, 1, 9);
    var Q = qInt * SCALE + qT * 100 + qH * 10 + qTh;
    if (Q < 100) return null;
    var dividend = Q * N;
    if (dividend <= 0 || dividend >= 1000 * SCALE) return null;
    if (placesOf(dividend) < 1) return null;
    if (placesOf(Q) < 2 && N < 12) return null;
    return pack('div', 'kho', 1, [dividend, N * SCALE]);
  }

  function genDiv2De(rng) {
    var D = randInt(rng, 2, 9);
    var step = 10 / gcd(D, 10);
    var m = randInt(rng, 1, Math.max(1, Math.floor(70 / step)));
    var q = step * m;
    if (q < 2 || q > 90) return null;
    if ((D * q) % 10 !== 0) return null;
    var dividend = (D * q) / 10;
    if (dividend < 1 || dividend > 250 || !Number.isInteger(dividend)) return null;
    return pack('div', 'de', 2, [dividend * SCALE, D * 100]);
  }

  function genDiv2Vua(rng) {
    // Số chia có 2 chữ số ở phần thập phân (0,25; 1,25; 0,75; 0,48; 2,35 …), thương đa dạng,
    // tránh kiểu X : 0,X = 100 lặp lại.
    var r = rng();
    var D;
    if (r < 0.45) D = 25 * (2 * randInt(rng, 0, 9) + 1);
    else if (r < 0.72) D = 4 * randInt(rng, 1, 124);
    else D = 5 * randInt(rng, 1, 99);
    if (D % 10 === 0) return null;
    var g = gcd(D, 100);
    if (g === 1) return null;
    var step = 100 / g;
    var m = randInt(rng, 1, Math.max(1, Math.floor(80 / step)));
    var q = step * m;
    if (q < 2 || q > 80) return null;
    if ((D * q) % 100 !== 0) return null;
    var dividend = (D * q) / 100;
    if (dividend < 1 || dividend > 400 || !Number.isInteger(dividend)) return null;
    var divisor = D * 10;
    if (placesOf(divisor) !== 2) return null;
    return pack('div', 'vua', 2, [dividend * SCALE, divisor]);
  }

  var DIV2_KHO_BANK = null;
  function div2KhoBank() {
    if (DIV2_KHO_BANK) return DIV2_KHO_BANK;
    var list = [];
    var seen = Object.create(null);
    function push(nums, meta) {
      var sig = nums.join(',');
      if (seen[sig]) return;
      var answer = computeAnswer('div', nums);
      if (answer == null || !Number.isInteger(answer) || answer <= 0) return;
      seen[sig] = 1;
      list.push({ nums: nums, meta: meta });
    }
    var odd, D, g, step, m, q, N;
    for (odd = 0; odd < 20; odd++) {
      D = 25 * (2 * odd + 1);
      if (D > 999 || D % 10 === 0) continue;
      g = gcd(D, 1000);
      step = 1000 / g;
      for (m = 1; m <= 6; m++) {
        q = step * m;
        N = D * q / 1000;
        if (!Number.isInteger(N) || N < 1 || N > 48 || q < 2 || q > 120) continue;
        if (placesOf(D) !== 3) continue;
        push([N * SCALE, D], { subtype: 'k3' });
      }
    }
    var M, t, nStep, divisor, n;
    for (M = 1; M <= 99; M++) {
      if (M % 10 === 0) continue;
      g = gcd(M, 1000);
      nStep = M / g;
      for (t = 1; t <= 16; t++) {
        n = nStep * t;
        if (n > 48) break;
        if ((n * SCALE) % M !== 0) continue;
        D = (n * SCALE) / M;
        if (!Number.isInteger(D) || D % 10 === 0 || D < 11 || D > 2000) continue;
        divisor = D * 10;
        if (placesOf(divisor) !== 2 || placesOf(M * 100) !== 1) continue;
        push([n * SCALE, divisor], { subtype: 'k2dec' });
      }
    }
    if (list.length < 40) throw new Error('div2 kho bank small ' + list.length);
    DIV2_KHO_BANK = list;
    return list;
  }

  function genDiv2Kho(rng) {
    var bank = div2KhoBank();
    var item = bank[randInt(rng, 0, bank.length - 1)];
    return pack('div', 'kho', 2, item.nums.slice(), item.meta);
  }

  function genDiv3De(rng) {
    var D = randInt(rng, 2, 19);
    if (D % 10 === 0) return null;
    var q = randInt(rng, 2, 16);
    if ((q * D) % 10 === 0) return null;
    var dividend = q * D * 100;
    var divisor = D * 100;
    if (placesOf(dividend) !== 1 || placesOf(divisor) !== 1) return null;
    if (dividend >= 400 * SCALE) return null;
    return pack('div', 'de', 3, [dividend, divisor]);
  }

  function genDiv3Vua(rng) {
    var M = randInt(rng, 1, 90);
    if (M % 10 === 0) return null;
    var D = randInt(rng, 2, 36);
    if (D % 10 === 0) return null;
    if ((M * D) % 10 === 0) return null;
    var dividend = M * D * 10;
    var divisor = D * 100;
    if (placesOf(dividend) !== 2 || placesOf(divisor) !== 1) return null;
    if (dividend >= 600 * SCALE) return null;
    return pack('div', 'vua', 3, [dividend, divisor]);
  }

  function genDiv3Kho(rng) {
    if (rng() < 0.55) {
      var D = randInt(rng, 11, 399);
      if (D % 10 === 0) return null;
      var q = randInt(rng, 2, 24);
      if ((q * D) % 100 === 0) return null;
      var dividend = q * D * 10;
      var divisor = D * 10;
      if (placesOf(divisor) !== 2 || placesOf(dividend) < 1) return null;
      if (dividend >= 900 * SCALE) return null;
      return pack('div', 'kho', 3, [dividend, divisor]);
    }
    var M = randInt(rng, 1, 90);
    if (M % 10 === 0) return null;
    var D2 = randInt(rng, 11, 250);
    if (D2 % 10 === 0) return null;
    var dividend2 = M * D2;
    var divisor2 = D2 * 10;
    if (placesOf(divisor2) !== 2 || placesOf(dividend2) < 1) return null;
    if (dividend2 >= 900 * SCALE) return null;
    return pack('div', 'kho', 3, [dividend2, divisor2]);
  }

  function genDiv4(rng, level) {
    var pow = level === 'de' ? 10 : level === 'vua' ? 100 : 1000;
    var a;
    if (level === 'kho') {
      var ip = randInt(rng, 1, 999);
      a = ip * SCALE;
    } else if (level === 'vua') {
      var roll = rng();
      if (roll < 0.4) a = randomDecimal(rng, 1, 9, 1);
      else if (roll < 0.75) a = randomDecimal(rng, 10, 99, 1);
      else a = randInt(rng, 1, 99) * SCALE;
    } else {
      var r2 = rng();
      if (r2 < 0.4) a = randomDecimal(rng, 1, 99, 1);
      else if (r2 < 0.75) a = randomDecimal(rng, 1, 99, 2);
      else a = randInt(rng, 1, 200) * SCALE;
    }
    if (a % pow !== 0) return null;
    var answerMilli = a / pow;
    if (!Number.isInteger(answerMilli)) return null;
    return pack('div', level, 4, [a, pow * SCALE], { pow: pow });
  }

  function genDiv5(rng, level) {
    var places = level === 'de' ? 1 : level === 'vua' ? 2 : 3;
    var divs = level === 'de' ? [2, 5] : level === 'vua' ? [4, 25] : [8];
    var N = divs[randInt(rng, 0, divs.length - 1)];
    var ip = randInt(rng, 0, 20);
    var Q;
    if (places === 1) Q = ip * SCALE + randInt(rng, 1, 9) * 100;
    else if (places === 2) Q = ip * SCALE + randInt(rng, 0, 9) * 100 + randInt(rng, 1, 9) * 10;
    else Q = ip * SCALE + [125, 375, 625, 875][randInt(rng, 0, 3)];
    if (placesOf(Q) !== places) return null;
    if ((Q * N) % SCALE !== 0) return null;
    var dividend = (Q * N) / SCALE;
    if (!Number.isInteger(dividend) || dividend < 1 || dividend > 400) return null;
    if (dividend % N === 0) return null;
    return pack('div', level, 5, [dividend * SCALE, N * SCALE]);
  }

  var GENERATORS = {
    'add-de': genAddDe,
    'add-vua': genAddVua,
    'add-kho': genAddKho,
    'sub-de': genSubDe,
    'sub-vua': genSubVua,
    'sub-kho': genSubKho,
    'mul-de': genMulDe,
    'mul-vua': genMulVua,
    'mul-kho': genMulKho,
    'div1-de': genDiv1De,
    'div1-vua': genDiv1Vua,
    'div1-kho': genDiv1Kho,
    'div2-de': genDiv2De,
    'div2-vua': genDiv2Vua,
    'div2-kho': genDiv2Kho,
    'div3-de': genDiv3De,
    'div3-vua': genDiv3Vua,
    'div3-kho': genDiv3Kho,
    'div4-de': function (rng) { return genDiv4(rng, 'de'); },
    'div4-vua': function (rng) { return genDiv4(rng, 'vua'); },
    'div4-kho': function (rng) { return genDiv4(rng, 'kho'); },
    'div5-de': function (rng) { return genDiv5(rng, 'de'); },
    'div5-vua': function (rng) { return genDiv5(rng, 'vua'); },
    'div5-kho': function (rng) { return genDiv5(rng, 'kho'); }
  };

  var CATEGORY_IDS = Object.keys(GENERATORS);

  function generateOne(id, rng) {
    var gen = GENERATORS[id];
    if (!gen) throw new Error('unknown category ' + id);
    var p = tryLoop(function () { return gen(rng); }, 200);
    p.cat = id;
    if (!matchesLevel(p)) throw new Error('level mismatch ' + id + ' ' + JSON.stringify(p));
    return p;
  }

  function matchesLevel(p) {
    var nums = p.nums;
    var a = nums[0], b = nums[1];
    var pa = placesOf(a), pb = b == null ? 0 : placesOf(b);
    var ans = computeAnswer(p.op, nums);
    if (ans !== p.answer || ans == null || !Number.isInteger(ans)) return false;
    if (placesOf(ans) > 3 || ans < 0) return false;
    if (p.op === 'add' && p.level === 'de') {
      return nums.length === 2 && pa === pb && pa >= 1 && pb >= 1 && !hasCarry(nums);
    }
    if (p.op === 'add' && p.level === 'vua') {
      return nums.length === 2 && pa !== pb && pa >= 1 && pb >= 1;
    }
    if (p.op === 'add' && p.level === 'kho') {
      return nums.length === 3 && hasCarry(nums) && pa >= 1 && pb >= 1 && placesOf(nums[2]) >= 1;
    }
    if (p.op === 'sub' && p.level === 'de') {
      return a > b && pa === pb && pa >= 1 && !hasBorrow(a, b);
    }
    if (p.op === 'sub' && p.level === 'vua') {
      return a > b && pa !== pb && pa >= 1 && pb >= 1;
    }
    if (p.op === 'sub' && p.level === 'kho') {
      return a > b && pb >= 1 && hasBorrow(a, b);
    }
    if (p.op === 'mul' && p.level === 'de') {
      return pa >= 1 && pb === 0 && b / SCALE >= 2 && b / SCALE <= 9 && b % SCALE === 0;
    }
    if (p.op === 'mul' && p.level === 'vua') {
      return pa >= 1 && pb >= 1 && pa + pb <= 3;
    }
    if (p.op === 'mul' && p.level === 'kho') {
      var pow = 0;
      if (b === 10 * SCALE || b === 100 * SCALE || b === 1000 * SCALE) pow = b / SCALE;
      if (a === 10 * SCALE || a === 100 * SCALE || a === 1000 * SCALE) pow = a / SCALE;
      if (pow) {
        var other = pow === b / SCALE ? a : b;
        return placesOf(other) >= 1;
      }
      return pa >= 1 && pb >= 1;
    }
    if (p.op === 'div' && p.kind === 1) {
      if (!(pa >= 1 && pb === 0 && b % SCALE === 0 && b / SCALE >= 2)) return false;
      if (p.level === 'de') return pa === 1 && placesOf(ans) === 1 && b / SCALE <= 9;
      if (p.level === 'vua') return pa === 2 && b / SCALE <= 12;
      return b / SCALE <= 25 && (b / SCALE) % 10 !== 0 && (placesOf(ans) >= 2 || b / SCALE >= 12 || pa >= 2);
    }
    if (p.op === 'div' && p.kind === 2) {
      if (!(pa === 0 && pb >= 1 && a % SCALE === 0 && a >= SCALE)) return false;
      if (p.level === 'de') return pb === 1 && placesOf(ans) === 0;
      if (p.level === 'vua') return pb === 2 && placesOf(ans) === 0;
      return pb >= 2;
    }
    if (p.op === 'div' && p.kind === 3) {
      if (!(pa >= 1 && pb >= 1)) return false;
      if (p.level === 'de') return pa === 1 && pb === 1;
      if (p.level === 'vua') return pa === 2 && pb === 1;
      return pb >= 2;
    }
    if (p.op === 'div' && p.kind === 4) {
      var dv = b / SCALE;
      if (p.level === 'de') return dv === 10 && a % 10 === 0;
      if (p.level === 'vua') return dv === 100 && a % 100 === 0;
      return dv === 1000 && a % SCALE === 0 && pa === 0;
    }
    if (p.op === 'div' && p.kind === 5) {
      var N5 = b / SCALE;
      var D5 = a / SCALE;
      if (!(pa === 0 && pb === 0 && a % SCALE === 0 && b % SCALE === 0 && N5 >= 2 && D5 >= 1)) return false;
      if (D5 % N5 === 0) return false;
      var pl5 = placesOf(ans);
      if (p.level === 'de') return pl5 === 1;
      if (p.level === 'vua') return pl5 === 2;
      return pl5 === 3;
    }
    return false;
  }

  function buildBank(id, count, seed) {
    var rng = mulberry32(seed == null ? hashStr(id) : seed);
    var seen = Object.create(null);
    var out = [];
    var fixed = [];
    if (id === 'div5-de') fixed.push([2 * SCALE, 5 * SCALE]);
    if (id === 'div5-vua') fixed.push([23 * SCALE, 4 * SCALE], [6 * SCALE, 25 * SCALE]);
    if (id === 'div5-kho') fixed.push([15 * SCALE, 8 * SCALE]);
    fixed.forEach(function (nums) {
      var fp = pack('div', id.split('-')[1], 5, nums);
      fp.cat = id;
      var sig = fp.nums.join(',');
      if (seen[sig]) return;
      seen[sig] = 1;
      fp.id = id + '-' + out.length;
      out.push(fp);
    });
    var guard = 0;
    while (out.length < count && guard < count * 50) {
      guard++;
      var p = generateOne(id, rng);
      // Cộng, nhân: coi a + b và b + a là một câu.
      var sig = (p.op === 'add' || p.op === 'mul') ? p.nums.slice().sort(function (x, y) { return x - y; }).join(',') : p.nums.join(',');
      if (seen[sig]) continue;
      seen[sig] = 1;
      p.id = id + '-' + out.length;
      out.push(p);
    }
    if (out.length < count) throw new Error('bank short ' + id + ' got ' + out.length);
    return out;
  }

  function shuffle(list, rng) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pickQuestions(bank, n, rng) {
    rng = rng || Math.random;
    if (!bank.length) return [];
    if (bank[0].cat === 'mul-kho') {
      var pow10 = shuffle(bank.filter(function (p) { return p.meta && p.meta.subtype === 'pow10'; }), rng);
      var mixed = shuffle(bank.filter(function (p) { return p.meta && p.meta.subtype === 'mixed'; }), rng);
      var by = { 10: [], 100: [], 1000: [] };
      pow10.forEach(function (p) { if (by[p.meta.pow]) by[p.meta.pow].push(p); });
      var chosen = [];
      [10, 100, 1000].forEach(function (k) { if (by[k][0]) chosen.push(by[k][0]); });
      var restPow = pow10.filter(function (p) { return chosen.indexOf(p) < 0; });
      if (restPow[0]) chosen.push(restPow[0]);
      mixed.slice(0, 4).forEach(function (p) { chosen.push(p); });
      return shuffle(chosen, rng).slice(0, n);
    }
    return shuffle(bank, rng).slice(0, n);
  }

  function checkAnswer(problem, input) {
    var got = parseAnswer(input);
    return got !== null && got === problem.answer;
  }

  function starsFor(correct, total) {
    if (!total) return 0;
    if (correct === total) return 3;
    if (correct / total >= 0.75) return 2;
    if (correct / total >= 0.5) return 1;
    return 0;
  }

  function shiftRightOnce(str) {
    var t = str.indexOf(',') >= 0 ? str : str + ',';
    var i = t.indexOf(',');
    var left = t.slice(0, i);
    var right = t.slice(i + 1);
    var next;
    if (!right.length) next = left + '0';
    else next = left + right[0] + (right.length > 1 ? ',' + right.slice(1) : '');
    if (next.indexOf(',') >= 0) {
      var bits = next.split(',');
      bits[0] = bits[0].replace(/^0+(?=\d)/, '');
      next = bits[0] + ',' + bits[1];
    } else next = next.replace(/^0+(?=\d)/, '');
    if (next.charAt(0) === ',') next = '0' + next;
    return next;
  }

  function shiftLeftOnce(str) {
    var t = str.indexOf(',') >= 0 ? str : str + ',';
    var i = t.indexOf(',');
    if (i === 0) return '0,' + t.slice(1);
    var left = t.slice(0, i - 1);
    var digit = t.charAt(i - 1);
    var right = t.slice(i + 1);
    var next = left + ',' + digit + right;
    if (next.charAt(0) === ',') next = '0' + next;
    if (next.endsWith(',')) next = next.slice(0, -1);
    if (!next.length) next = '0';
    return next;
  }

  function simplifyCommaStr(s) {
    if (s.indexOf(',') < 0) return s.replace(/^0+(?=\d)/, '') || '0';
    var bits = s.split('.');
    bits = s.split(',');
    var a = bits[0].replace(/^0+(?=\d)/, '') || '0';
    var b = (bits[1] || '').replace(/0+$/, '');
    return b ? a + ',' + b : a;
  }

  function placeCommaDigits(prod, total) {
    var digits = String(Math.abs(prod));
    if (total <= 0) return digits;
    if (digits.length < total) digits = digits.padStart(total, '0');
    if (digits.length === total) return '0,' + digits;
    var cut = digits.length - total;
    return digits.slice(0, cut) + ',' + digits.slice(cut);
  }

  function stripInt(milli) {
    var p = placesOf(milli);
    var div = Math.pow(10, 3 - p);
    if (milli % div !== 0) throw new Error('strip');
    return milli / div;
  }

  function textCells(str) {
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var ch = str.charAt(i);
      if (ch === ',') out.push({ ch: ',', comma: true });
      else out.push({ ch: ch });
    }
    return out;
  }

  function cellsToText(cells) {
    var s = '';
    (cells || []).forEach(function (c) {
      if (!c) return;
      if (c.comma || c.ch === ',') s += ',';
      else if (c.ch != null && c.ch !== '') s += c.ch;
    });
    return s;
  }

  function blankArr(n) {
    var a = [];
    for (var i = 0; i < n; i++) a.push('');
    return a;
  }

  function placeDigits(digitStr, endCol, glyphs) {
    var cols = [];
    var c = endCol;
    var i;
    for (i = digitStr.length - 1; i >= 0; i--) {
      while (c >= 0 && glyphs[c] === ',') c--;
      cols.unshift({ col: c, ch: digitStr.charAt(i) });
      c--;
    }
    return cols;
  }

  function shiftNeg(glyphs, rows, quotCols, commaCol) {
    var min = 0;
    function see(c) { if (c < min) min = c; }
    quotCols.forEach(function (q) { see(q.col); });
    rows.forEach(function (r) {
      (r.placed || []).forEach(function (p) { see(p.col); });
    });
    if (min >= 0) return { glyphs: glyphs, rows: rows, quotCols: quotCols, commaCol: commaCol, shift: 0 };
    var shift = -min;
    var g2 = blankArr(shift).concat(glyphs);
    quotCols.forEach(function (q) { q.col += shift; });
    rows.forEach(function (r) {
      if (r.cells) {
        r.cells = blankArr(shift).concat(r.cells);
      }
      (r.placed || []).forEach(function (p) { p.col += shift; });
      if (r.from != null) r.from += shift;
      if (r.to != null) r.to += shift;
      if (r.endCol != null) r.endCol += shift;
    });
    return { glyphs: g2, rows: rows, quotCols: quotCols, commaCol: commaCol < 0 ? -1 : commaCol + shift, shift: shift };
  }

  function buildTableau(dividendMilli, N, forcedQs) {
    var dPlaces = placesOf(dividendMilli);
    var sp = splitDigits(dividendMilli);
    var intDigits = sp.intDigits.length;
    var frac = sp.fracDigits.slice(0, dPlaces);
    var base = sp.intDigits.concat(frac);
    var glyphs = sp.intDigits.map(function (d) { return String(d); });
    var commaCol = -1;
    if (dPlaces > 0) {
      commaCol = glyphs.length;
      glyphs.push(',');
      frac.forEach(function (d) { glyphs.push(String(d)); });
    }
    function gcol(baseIndex) {
      return commaCol >= 0 && baseIndex >= intDigits ? baseIndex + 1 : baseIndex;
    }
    var padFrom = glyphs.length;
    var steps = [];
    var quotCols = [];
    var idx = 0;
    var rem = 0;
    var passedComma = false;
    var extraZeros = 0;
    var guard = 0;
    var originLen = base.length;
    function markComma() {
      if (passedComma || idx < intDigits) return;
      var commaAt = commaCol >= 0 ? commaCol : intDigits - 0.5;
      var wroteInt = quotCols.some(function (q) { return q.ch !== ',' && q.col < commaAt; });
      if (!wroteInt) quotCols.push({ col: Math.max(0, intDigits - 1), ch: '0' });
      if (!quotCols.some(function (q) { return q.ch === ','; })) quotCols.push({ col: commaAt, ch: ',' });
      passedComma = true;
    }
    while (guard++ < 32) {
      if (forcedQs && steps.length >= forcedQs.length) break;
      if (idx >= base.length) {
        if (rem === 0) break;
        if (extraZeros >= 4) break;
        extraZeros++;
        if (commaCol < 0 && dPlaces > 0) {
          commaCol = glyphs.length;
          glyphs.push(',');
        }
        markComma();
        base.push(0);
        glyphs.push('0');
      }
      markComma();
      var digitIndex = idx;
      var digit = base[idx];
      var endCol = gcol(idx);
      idx++;
      var prevRem = rem;
      rem = rem * 10 + digit;
      if (steps.length === 0 && rem < N && idx < intDigits) continue;
      if (forcedQs && steps.length >= forcedQs.length) break;
      var q = forcedQs ? forcedQs[steps.length] : Math.floor(rem / N);
      var prod = q * N;
      var left = rem;
      var fits = prod <= left;
      rem = fits ? left - prod : left;
      var prodStr = String(prod);
      var placed = placeDigits(prodStr, endCol, glyphs);
      var firstChunk = steps.length === 0;
      quotCols.push({ col: endCol, ch: String(q), si: steps.length });
      steps.push({
        endCol: endCol,
        q: q,
        left: left,
        prod: prod,
        prodStr: prodStr,
        placed: placed,
        rem: rem,
        prevRem: prevRem,
        firstChunk: firstChunk,
        brought: String(digit),
        appended: digitIndex >= originLen,
        fits: fits
      });
      if (!fits) break;
      if (rem === 0 && idx >= base.length) break;
    }
    var naturalCont = dPlaces === 0 && extraZeros > 0;
    var width = glyphs.length;
    var rows = [{ kind: 'dividend', cells: glyphs.slice(), phase: 0 }];
    var phaseN = 0;
    function paint(text, end, into) {
      placeDigits(String(text), end, glyphs).forEach(function (p) {
        if (p.col >= 0 && p.col < width) into[p.col] = p.ch;
      });
    }
    function widen(n) {
      while (glyphs.length < n) glyphs.push('');
      rows.forEach(function (r) {
        while (r.cells.length < n) r.cells.push('');
      });
      width = n;
    }
    function nextBring(st) {
      if (!st || st.fits === false) return null;
      if (st.rem === 0) {
        var zero = blankArr(width);
        paint(0, st.endCol, zero);
        return { cells: zero, final: true };
      }
      var nextDigit;
      var nextEnd;
      if (idx < base.length) {
        nextDigit = String(base[idx]);
        nextEnd = gcol(idx);
      } else if (extraZeros < 4) {
        if (commaCol < 0 && dPlaces > 0) {
          commaCol = glyphs.length;
          glyphs.push(',');
          rows.forEach(function (r) { r.cells.push(''); });
          width = glyphs.length;
        }
        base.push(0);
        glyphs.push('0');
        rows.forEach(function (r) { r.cells.push(''); });
        width = glyphs.length;
        extraZeros++;
        nextDigit = '0';
        nextEnd = gcol(base.length - 1);
      } else return null;
      if (nextEnd + 1 > width) widen(nextEnd + 1);
      var work = blankArr(width);
      paint(st.rem, st.endCol, work);
      if (nextEnd >= 0 && nextEnd < width && glyphs[nextEnd] !== ',') work[nextEnd] = nextDigit;
      return { cells: work, final: false };
    }
    if (naturalCont) {
      steps.forEach(function (st, si) {
        var zeroLead = st.firstChunk && st.q === 0 && st.prod === 0;
        if (zeroLead) {
          phaseN += 1;
          st.qPhase = phaseN;
          if (si === steps.length - 1) {
            var leadBring = nextBring(st);
            if (leadBring) rows.push({ kind: 'partial', cells: leadBring.cells, phase: phaseN, final: leadBring.final });
          }
          return;
        }
        if (!st.firstChunk) {
          phaseN += 1;
          st.bringPhase = phaseN;
          var prev = steps[si - 1];
          var work = blankArr(width);
          if (prev && prev.rem !== 0) paint(prev.rem, prev.endCol, work);
          if (st.endCol >= 0 && st.endCol < width && glyphs[st.endCol] !== ',') work[st.endCol] = st.brought;
          rows.push({ kind: 'partial', cells: work, phase: phaseN });
        }
        phaseN += 1;
        st.qPhase = phaseN;
        var sub = blankArr(width);
        var from = st.endCol;
        var to = st.endCol;
        st.placed.forEach(function (p) {
          if (p.col >= 0 && p.col < width) sub[p.col] = p.ch;
          if (p.col < from) from = p.col;
          if (p.col > to) to = p.col;
        });
        rows.push({ kind: 'sub', cells: sub, from: from, to: to, placed: st.placed, phase: phaseN });
        if (st.fits === false) return;
        if (si === steps.length - 1) {
          var look = nextBring(st);
          if (look) rows.push({ kind: 'partial', cells: look.cells, phase: phaseN, final: look.final });
        }
      });
    } else {
      steps.forEach(function (st, si) {
        if (st.firstChunk && st.q === 0 && st.prod === 0) {
          if (si === steps.length - 1) {
            var leadN = nextBring(st);
            if (leadN) rows.push({ kind: 'partial', cells: leadN.cells, final: leadN.final });
          }
          return;
        }
        if (!st.firstChunk) {
          var prevN = steps[si - 1];
          var workN = blankArr(width);
          if (prevN.rem !== 0) paint(prevN.rem, prevN.endCol, workN);
          if (st.endCol >= 0 && st.endCol < width && glyphs[st.endCol] !== ',') workN[st.endCol] = st.brought;
          rows.push({ kind: 'partial', cells: workN });
        }
        var subN = blankArr(width);
        var fromN = st.endCol;
        var toN = st.endCol;
        st.placed.forEach(function (p) {
          if (p.col >= 0 && p.col < width) subN[p.col] = p.ch;
          if (p.col < fromN) fromN = p.col;
          if (p.col > toN) toN = p.col;
        });
        rows.push({ kind: 'sub', cells: subN, from: fromN, to: toN, placed: st.placed });
        if (st.fits === false) return;
        if (si === steps.length - 1) {
          var lookN = nextBring(st);
          if (lookN) rows.push({ kind: 'partial', cells: lookN.cells, final: lookN.final });
        }
      });
      var seenSubs = 0;
      rows.forEach(function (r, ri) {
        if (ri === 0) { r.phase = 0; return; }
        if (r.kind === 'sub') {
          seenSubs += 1;
          r.phase = seenSubs;
        } else r.phase = seenSubs;
      });
    }
    var norm = shiftNeg(glyphs, rows, quotCols, commaCol);
    glyphs = norm.glyphs;
    rows = norm.rows;
    quotCols = norm.quotCols;
    commaCol = norm.commaCol;
    padFrom += norm.shift || 0;
    quotCols.sort(function (a, b) { return a.col - b.col; });
    if (naturalCont) {
      var commaPhase = 1;
      var commaSet = false;
      steps.forEach(function (st) {
        if (!commaSet && st.appended && st.bringPhase != null) {
          commaPhase = st.bringPhase;
          commaSet = true;
        }
      });
      quotCols.forEach(function (q) {
        if (q.ch === ',') q.phase = commaPhase;
        else if (q.si != null && steps[q.si]) q.phase = steps[q.si].qPhase;
        else q.phase = 1;
      });
    } else {
      var qSeen = 0;
      quotCols.forEach(function (q) {
        if (q.ch === ',') q.phase = Math.max(1, qSeen);
        else {
          qSeen += 1;
          q.phase = qSeen;
        }
      });
    }
    var blankAt;
    for (blankAt = padFrom; blankAt < rows[0].cells.length; blankAt++) rows[0].cells[blankAt] = '';
    var dividendPlain = glyphs.slice(0, padFrom).join('');
    var qstr = quotCols.map(function (q) { return q.ch; }).join('');
    if (qstr.charAt(0) === ',') qstr = '0' + qstr;
    var answerCells = textCells(qstr);
    var lines = steps.map(function (st) {
      return st.left + ' chia ' + N + ' được ' + st.q + ', dư ' + st.rem + '; ' + st.q + ' × ' + N + ' = ' + st.prod + '.';
    });
    var maxPhase = 0;
    rows.forEach(function (r) { if ((r.phase || 0) > maxPhase) maxPhase = r.phase; });
    quotCols.forEach(function (q) { if ((q.phase || 0) > maxPhase) maxPhase = q.phase; });
    return {
      glyphs: glyphs,
      rows: rows,
      quotCols: quotCols,
      qstr: qstr,
      answerCells: answerCells,
      commaCol: commaCol,
      padFrom: padFrom,
      dividendPlain: dividendPlain,
      phased: true,
      divisor: String(N),
      sourceMilli: dividendMilli,
      rem: steps.length ? steps[steps.length - 1].rem : 0,
      lines: lines,
      stepCount: naturalCont ? maxPhase : steps.length
    };
  }

  function longDiv(dividendMilli, N) {
    var tab = buildTableau(dividendMilli, N);
    return { qstr: tab.qstr, lines: tab.lines, rem: tab.rem, tableau: tab };
  }

  function divisionLive(dividendMilli, N, digits) {
    var forced = [];
    var i;
    for (i = 0; i < (digits || []).length; i++) {
      var d = digits[i];
      if (d == null || d === '') break;
      var n = Number(d);
      if (!isFinite(n)) break;
      forced.push(n);
    }
    return buildTableau(dividendMilli, N, forced);
  }

  function divisionLiveHTML(dividendMilli, N, digits) {
    var tab = divisionLive(dividendMilli, N, digits);
    var html = '';
    var row = 2;
    tab.rows.forEach(function (r, idx) {
      if (idx === 0) return;
      var marked = false;
      r.cells.forEach(function (ch, ci) {
        if (ch === '' || ch == null) return;
        var cls = 'tcell' + (tab.glyphs[ci] === ',' ? ' comma' : '');
        if (r.kind === 'sub' && !marked) { cls += ' substart'; marked = true; }
        html += '<span class="' + cls + '" style="grid-row:' + row + ';grid-column:' + (ci + 1) + '">' + esc(ch) + '</span>';
      });
      if (r.kind === 'sub' && r.from != null) {
        html += '<span class="trule" style="grid-row:' + row + ';grid-column:' + (Math.max(0, r.from) + 1) + ' / ' + (r.to + 2) + '"></span>';
      }
      row++;
    });
    return html;
  }

  function columnCells(milli, intLen, d, ghostFrom) {
    var digits = digitRow(milli, intLen, d);
    var shown = blankLead(digits, intLen);
    var ghost = [];
    var i;
    for (i = 0; i < shown.length; i++) ghost.push(false);
    if (ghostFrom != null) {
      for (var f = ghostFrom; f < d; f++) ghost[intLen + f] = true;
    }
    var cells = [];
    for (i = 0; i < shown.length; i++) {
      if (d > 0 && i === intLen) cells.push({ ch: ',', comma: true });
      var ch = shown[i] === '' || shown[i] == null ? '' : String(shown[i]);
      cells.push({ ch: ch, ghost: !!ghost[i] });
    }
    return cells;
  }

  function columnBoard(op, nums, answer) {
    var d = 0;
    var i;
    nums.forEach(function (n) { if (placesOf(n) > d) d = placesOf(n); });
    var intLen = splitDigits(answer).intDigits.length;
    nums.forEach(function (n) {
      var L = splitDigits(n).intDigits.length;
      if (L > intLen) intLen = L;
    });
    var width = intLen + d;
    var cols = nums.map(function (n) { return digitRow(n, intLen, d); });
    var carryInto = [];
    for (i = 0; i < width; i++) carryInto.push(0);
    var carry = 0;
    var resultDigits = [];
    if (op === '+') {
      for (i = width - 1; i >= 0; i--) {
        carryInto[i] = carry;
        var sum = carry;
        for (var r = 0; r < cols.length; r++) sum += cols[r][i];
        resultDigits[i] = sum % 10;
        carry = Math.floor(sum / 10);
      }
    } else {
      // SGK Việt Nam: không trừ được thì lấy 10 + chữ số, rồi nhớ 1 cộng vào số trừ ở hàng liền trước.
      var top = cols[0];
      var db = cols[1];
      var borrowAt = [];
      var nhoAt = [];
      var nho = 0;
      for (i = width - 1; i >= 0; i--) {
        nhoAt[i] = nho;
        var bot = db[i] + nho;
        if (top[i] < bot) { borrowAt[i] = true; resultDigits[i] = top[i] + 10 - bot; nho = 1; }
        else { borrowAt[i] = false; resultDigits[i] = top[i] - bot; nho = 0; }
      }
    }
    function packCarry(arr) {
      var cells = [];
      for (var c = 0; c < arr.length; c++) {
        if (d > 0 && c === intLen) cells.push({ ch: '', comma: true });
        cells.push({ ch: arr[c] ? String(arr[c]) : '', carry: true });
      }
      return cells;
    }
    var anyCarry = carryInto.some(function (c) { return c; });
    var anyBorrow = false;
    var numRows = nums.map(function (n, idx) {
      var cells = columnCells(n, intLen, d, placesOf(n));
      if (op === '−') {
        var k = 0;
        cells.forEach(function (c) {
          if (c.comma) return;
          if (idx === 0 && borrowAt[k]) { c.borrow = true; anyBorrow = true; }
          if (idx === 1 && nhoAt[k]) c.nho = true;
          k++;
        });
      }
      return {
        op: idx === nums.length - 1 ? (op === '+' ? '+' : '−') : '',
        cells: cells
      };
    });
    var resultCells = columnCells(answer, intLen, d, null);
    var note = nums.map(fmt).join(op === '+' ? ' + ' : ' − ') + ' = ' + fmt(answer);
    if (nums.some(function (n) { return placesOf(n) !== d; })) {
      var sep = op === '+' ? ' + ' : ' − ';
      var rewrites = [];
      var aligned = nums.map(function (n) {
        if (placesOf(n) !== d) rewrites.push(fmt(n) + ' = ' + fmtFixed(n, d));
        return fmtFixed(n, d);
      });
      note = rewrites.join(' và ') + ' nên ' + aligned.join(sep) + ' = ' + fmt(answer);
    }
    return {
      type: 'column',
      op: op,
      rows: numRows,
      carries: anyCarry ? packCarry(carryInto) : null,
      borrows: anyBorrow,
      answerCells: resultCells,
      note: note
    };
  }

  function shiftFrames(milli, places, dir) {
    var frames = [fmt(milli)];
    var cur = fmt(milli);
    var fn = dir === 'left' ? shiftLeftOnce : shiftRightOnce;
    for (var i = 0; i < places; i++) {
      cur = fn(cur);
      frames.push(cur);
    }
    return frames;
  }

  function shiftBoard(milli, places, dir, answerMilli) {
    var frames = shiftFrames(milli, places, dir);
    var pretty = fmt(answerMilli);
    var last = frames[frames.length - 1];
    var lead = '';
    if (placesOf(milli) === 0 && dir === 'left') lead = 'Số tự nhiên coi như có dấu phẩy ở bên phải hàng đơn vị: ' + fmt(milli) + ' = ' + fmt(milli) + ',0. ';
    var note = lead + 'Chuyển dấu phẩy sang bên ' + (dir === 'left' ? 'trái ' : 'phải ') + places + ' chữ số' +
      ' (nếu không đủ chữ số thì viết thêm chữ số 0): ' + frames.join(' → ') +
      (simplifyCommaStr(last) !== pretty ? ' = ' + pretty : '') + '.';
    return {
      type: 'shift',
      direction: dir,
      places: places,
      frames: frames,
      answerCells: textCells(pretty),
      minDigits: last.replace(/,/g, '').length,
      note: note
    };
  }

  function mulBoard(a, b) {
    var answer = computeAnswer('mul', [a, b]);
    var pow = 0;
    var base = a;
    if (b === 10 * SCALE || b === 100 * SCALE || b === 1000 * SCALE) { pow = b / SCALE; base = a; }
    else if (a === 10 * SCALE || a === 100 * SCALE || a === 1000 * SCALE) { pow = a / SCALE; base = b; }
    if (pow) {
      var board = shiftBoard(base, String(pow).length - 1, 'right', answer);
      board.label = fmtG(a) + ' × ' + fmtG(b);
      board.note = fmtG(a) + ' × ' + fmtG(b) + ' = ' + fmtG(answer) + '. ' + board.note;
      return board;
    }
    var pa = placesOf(a), pb = placesOf(b), total = pa + pb;
    var ia = stripInt(a), ib = stripInt(b), prod = ia * ib;
    var raw = placeCommaDigits(prod, total);
    var pretty = fmt(answer);
    var top = String(ia).split('');
    var bot = String(ib).split('');
    var width = Math.max(top.length, bot.length, String(prod).length);
    while (top.length < width) top.unshift('');
    while (bot.length < width) bot.unshift('');
    var product = String(prod).split('');
    while (product.length < width) product.unshift('');
    return {
      type: 'mul',
      label: fmtG(a) + ' × ' + fmtG(b),
      top: top,
      bottom: bot,
      product: product,
      partials: String(ib).split('').reverse().map(function (digit, shift) {
        var part = String(ia * Number(digit)).split('');
        while (part.length < width - shift) part.unshift('');
        while (part.length < width) part.push('');
        return part;
      }),
      places: total,
      raw: raw,
      answerCells: textCells(pretty),
      minDigits: raw.replace(/,/g, '').length,
      note: 'Nhân như nhân các số tự nhiên: ' + ia + ' × ' + ib + ' = ' + prod + '. Phần thập phân của các thừa số có tất cả ' + total + ' chữ số; dùng dấu phẩy tách ở tích ra ' + total + ' chữ số kể từ phải sang trái' +
        (String(prod).length < total ? ' (thiếu chữ số thì viết thêm chữ số 0 vào bên trái)' : String(prod).length === total ? ' (phần nguyên chưa có chữ số nào nên viết 0 trước dấu phẩy)' : '') +
        ': ' + raw + (simplifyCommaStr(raw) !== pretty ? ' = ' + pretty : '') + '.'
    };
  }

  function divBoard(dividend, N, rewrite) {
    var tab = buildTableau(dividend, N);
    return {
      type: 'div',
      rewrite: rewrite || null,
      tableau: tab,
      answerCells: tab.answerCells,
      note: (rewrite ? rewrite.note + ' ' : '') + 'Thương ' + tab.qstr + '.'
    };
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var ink = null;

  function startInk(opts) {
    if (!opts || opts.mode === 'fill' || opts.ink === false) { ink = null; return; }
    ink = { n: 0, cur: opts.phase == null ? null : opts.phase };
  }

  function finishInk(html) {
    if (!ink || !ink.n) return html;
    var needle = '--i:' + (ink.n - 1) + ';';
    var at = html.lastIndexOf(needle);
    if (at < 0) return html;
    var cls = html.lastIndexOf('class="', at);
    if (cls < 0) return html;
    return html.slice(0, cls) + 'class="fresh ' + html.slice(cls + 7);
  }

  function tag(name, cls, inner, opts) {
    opts = opts || {};
    var classes = cls || '';
    var style = opts.style || '';
    var canInk = ink && opts.ink !== false && (inner !== '' || opts.force);
    if (canInk && (ink.cur == null || opts.phase === ink.cur)) {
      classes += (classes ? ' ' : '') + 'ink';
      style = '--i:' + ink.n++ + ';' + style;
    }
    var html = '<' + name + ' class="' + classes + '"';
    if (style) html += ' style="' + style + '"';
    if (opts.attrs) html += ' ' + opts.attrs;
    return html + '>' + inner + '</' + name + '>';
  }

  function gridTemplate(cells, fill) {
    var digit = fill ? '28px' : '13px';
    var comma = fill ? '12px' : '8px';
    var op = fill ? '14px' : '11px';
    var tracks = cells.map(function (c) { return c && c.comma ? comma : digit; });
    return op + ' ' + tracks.join(' ');
  }

  function glyphTemplate(glyphs) {
    return glyphs.map(function (g) { return g === ',' ? '8px' : '13px'; }).join(' ');
  }

  function commaSlotHTML() {
    return '<button type="button" class="comma-slot comma-gap" data-ans="comma" aria-label="Đặt dấu phẩy"></button>';
  }

  function digitBoxHTML(label) {
    return '<input class="vbox" data-ans="digit" inputmode="numeric" maxlength="1" aria-label="' + (label || 'Chữ số kết quả') + '" autocomplete="off">';
  }

  function cellHTML(cell, opts) {
    opts = opts || {};
    var fill = opts.fill;
    if (cell && cell.comma) {
      if (opts.answer && fill) return commaSlotHTML();
      return tag('span', 'vcell comma glow', ',', { phase: opts.phase, style: opts.style });
    }
    var ch = cell && cell.ch != null ? String(cell.ch) : '';
    var cls = 'vcell';
    if (cell && cell.ghost) cls += ' ghost';
    if (cell && cell.carry) cls += ' carry';
    if (opts.fill && opts.digit) return digitBoxHTML('Chữ số kết quả');
    var inner = ch === '' ? '' : esc(ch);
    if (opts.marks && cell && cell.borrow) inner = '<sup class="mark-ten" aria-label="thêm 10">1</sup>' + inner;
    if (opts.marks && cell && cell.nho) inner = inner + '<sup class="mark-nho" aria-label="nhớ 1">+1</sup>';
    return tag('span', cls, inner, { phase: opts.phase, style: opts.style, ink: inner === '' ? false : true });
  }

  function choiceAnswerHTML(cells, fill, phase, minDigits) {
    var digits = [];
    var commaAt = null;
    cells.forEach(function (c) {
      if (c.comma) commaAt = digits.length;
      else digits.push(c.ch);
    });
    if (!fill) {
      var html = '<div class="answer-digits">';
      cells.forEach(function (c) {
        html += c.comma
          ? tag('span', 'vcell comma glow', ',', { phase: phase })
          : tag('span', 'vcell result', esc(c.ch), { phase: phase });
      });
      return html + '</div>';
    }
    // Ô trả lời tự do: dư ô để không lộ số chữ số của đáp án; có ô dấu phẩy giữa mọi ô;
    // ô trống ở đầu và cuối được bỏ qua khi chấm (7,82 hay 170,0 đều nhập được).
    var count = Math.max(digits.length, minDigits || 0) + 1;
    if (count < 4) count = 4;
    var row = '<div class="answer-digits free">';
    for (var i = 0; i < count; i++) {
      row += digitBoxHTML();
      if (i < count - 1) row += commaSlotHTML();
    }
    return row + '</div>';
  }

  function renderColumn(board, opts) {
    opts = opts || {};
    var fill = opts.mode === 'fill';
    var staged = !fill && opts.columnStep != null;
    // Thứ tự hiện: các chữ số từ phải sang trái, dấu phẩy viết sau cùng (như SGK).
    var order = [];
    var commaIdx = -1;
    for (var oi = board.answerCells.length - 1; oi >= 0; oi--) {
      if (board.answerCells[oi].comma) commaIdx = oi;
      else order.push(oi);
    }
    if (commaIdx >= 0) order.push(commaIdx);
    var complete = !staged || opts.columnStep >= order.length;
    var showCarry = !fill && board.carries && (opts.phase == null || opts.phase >= 1);
    var showMarks = !fill && board.borrows && (opts.phase == null || opts.phase >= 1);
    var showResult = opts.mode === 'fill' || opts.phase == null || opts.phase >= 2;
    var sample = board.rows[0].cells;
    var html = '<div class="vsheet"><div class="vcol"' + (fill ? ' data-strict="1"' : '') + ' style="display:grid;grid-template-columns:' + gridTemplate(sample, fill) + ';justify-content:center">';
    var row = 1;
    function emitRow(cells, op, rowCls, phase) {
      html += tag('span', 'vop ' + (rowCls || ''), esc(op || ''), {
        phase: phase,
        style: 'grid-row:' + row + ';grid-column:1',
        ink: op ? true : false
      });
      cells.forEach(function (c, i) {
        if (rowCls === 'carry' && c.comma) return;
        var cellPhase = phase;
        if (staged && rowCls === 'carry') {
          var next = i + 1;
          if (sample[next] && sample[next].comma) next++;
          var carryReveal = order.indexOf(next) + 1;
          if (!carryReveal || carryReveal > opts.columnStep) return;
          cellPhase = carryReveal + 1;
        }
        if (staged && rowCls === 'result') {
          var reveal = order.indexOf(i) + 1;
          if (reveal > opts.columnStep) return;
          cellPhase = reveal + 1;
        }
        var piece = cellHTML(c, {
          fill: fill,
          digit: !!(c && c.fill),
          answer: rowCls === 'result',
          marks: showMarks && rowCls !== 'result' && rowCls !== 'carry' && (!staged || (order.indexOf(i) + 1 > 0 && order.indexOf(i) + 1 <= opts.columnStep)),
          phase: cellPhase,
          style: 'grid-row:' + row + ';grid-column:' + (i + 2)
        });
        if (piece.indexOf('style="') < 0) {
          piece = piece.replace('<input ', '<input style="grid-row:' + row + ';grid-column:' + (i + 2) + '" ')
            .replace('<button ', '<button style="grid-row:' + row + ';grid-column:' + (i + 2) + '" ');
        }
        html += piece;
      });
      row++;
    }
    if (showCarry) emitRow(board.carries, '', 'carry', 1);
    board.rows.forEach(function (r) { emitRow(r.cells, r.op, '', 0); });
    if (showResult || fill || staged) {
      html += tag('span', 'vhr', '', { phase: staged ? 1 : 2, force: true, style: 'grid-row:' + row + ';grid-column:1 / -1' });
      row++;
      var ans = board.answerCells.map(function (c) {
        if (c.comma) return c;
        return { ch: fill ? '' : c.ch, fill: !!fill && !c.comma, ghost: c.ghost };
      });
      emitRow(ans, '', 'result', 2);
    }
    html += '</div></div>';
    if (!fill && board.note && showResult && complete && opts.caption !== false) html += '<p class="caption">' + esc(board.note) + '</p>';
    return html;
  }

  function renderMul(board, opts) {
    opts = opts || {};
    var fill = opts.mode === 'fill';
    var html = board.label ? '<p class="expr" style="font-size:22px;margin:0 0 2px">' + esc(board.label) + '</p>' : '';
    var showProd = !fill && (opts.phase == null || opts.phase >= 1);
    var showAns = fill || opts.phase == null || opts.phase >= 2;
    var n = board.top.length;
    var colW = fill ? '28px' : '13px';
    var opW = fill ? '14px' : '11px';
    var tracks = opW;
    for (var ti = 0; ti < n; ti++) tracks += ' ' + colW;
    html += '<div class="vsheet"><div class="vcol" style="display:grid;grid-template-columns:' + tracks + ';justify-content:center">';
    var row = 1;
    function emitPlain(arr, op, phase) {
      html += tag('span', 'vop', esc(op || ''), { phase: phase, style: 'grid-row:' + row + ';grid-column:1', ink: !!op });
      arr.forEach(function (ch, i) {
        html += tag('span', 'vcell', esc(ch), { phase: phase, style: 'grid-row:' + row + ';grid-column:' + (i + 2) });
      });
      row++;
    }
    emitPlain(board.top, '', 0);
    emitPlain(board.bottom, '×', 0);
    if (showProd || fill) {
      html += tag('span', 'vhr', '', { phase: 1, force: true, ink: fill ? false : true, style: 'grid-row:' + row + ';grid-column:1 / -1' });
      row++;
      if (fill) {
        html += '<span class="mul-echo" data-live="mul" style="grid-row:' + row + ';grid-column:1 / -1"></span>';
        row++;
      } else {
        if (board.partials && board.partials.length > 1) {
          board.partials.forEach(function (part) { emitPlain(part, '', 1); });
          html += tag('span', 'vhr', '', { phase: 1, force: true, style: 'grid-row:' + row + ';grid-column:1 / -1' });
          row++;
        }
        emitPlain(board.product, '', 1);
      }
    }
    html += '</div></div>';
    html += '<p class="caption">Phần thập phân của các thừa số có tất cả ' + board.places + ' chữ số: dùng dấu phẩy tách ở tích ra ' + board.places + ' chữ số kể từ phải sang trái.</p>';
    if (showAns) html += choiceAnswerHTML(board.answerCells, fill, 2, board.minDigits);
    if (!fill && showAns && board.note) html += '<p class="caption">' + esc(board.note) + '</p>';
    return html;
  }

  function renderShift(board, opts) {
    opts = opts || {};
    var fill = opts.mode === 'fill';
    var frames = board.frames;
    var shown;
    if (fill) shown = [frames[0]];
    else if (opts.phase != null) shown = frames.slice(0, Math.min(frames.length, opts.phase + 1));
    else shown = frames.slice();
    var arrow = board.direction === 'left' ? '← chuyển dấu phẩy 1 chữ số' : '→ chuyển dấu phẩy 1 chữ số';
    var html = '<div class="vsheet shift-col">';
    // Khi làm bài, phép tính đầy đủ (vd 3,45 × 100 = ?) đã hiện ở dòng đề; lời giải thì ghi lại ở đây.
    if (board.label && !fill) html += '<p class="expr shift-label">' + esc(board.label) + '</p>';
    shown.forEach(function (fr, idx) {
      html += '<div class="shift-row">';
      textCells(fr).forEach(function (c) {
        html += tag('span', 'vcell' + (c.comma ? ' comma glow' : ''), c.comma ? ',' : esc(c.ch), { phase: idx });
      });
      html += '</div>';
      if (idx < shown.length - 1) html += '<div class="shift-arrow">' + arrow + '</div>';
    });
    var showAns = fill || opts.phase == null || opts.phase >= frames.length - 1;
    if (showAns) {
      html += '<div class="shift-arrow">' + (board.direction === 'left' ? '←' : '→') + '</div>';
      html += choiceAnswerHTML(board.answerCells, fill, frames.length - 1, board.minDigits);
    }
    html += '</div>';
    if (!fill && board.note && showAns) html += '<p class="caption">' + esc(board.note) + '</p>';
    return html;
  }

  function renderRewrite(rw) {
    var html = '<div class="rewrite">';
    html += '<p class="caption">Số chia có ' + rw.k + ' chữ số ở phần thập phân, nên nhân cả số bị chia và số chia với ' + numG(rw.factor) + ' để số chia thành số tự nhiên.</p>';
    rw.lines.forEach(function (ln) {
      html += '<div class="rewrite-line">' + tag('span', 'vcell-line', esc(ln.left), { phase: 0 }) + '<span class="rew-x">× ' + rw.factor + '</span><span class="rew-arrow">→</span>' + tag('span', 'vcell-line strong', esc(ln.right), { phase: 0 }) + '</div>';
    });
    html += '</div>';
    return html;
  }

  function shownQuotient(tab, phase) {
    if (phase == null || phase >= 90 || phase >= tab.stepCount) {
      var joined = tab.quotCols.map(function (q) { return q.ch; }).join('');
      if (joined === tab.qstr) return tab.quotCols.slice();
      var out = [];
      for (var c = 0; c < tab.qstr.length; c++) out.push({ ch: tab.qstr.charAt(c), phase: phase == null ? 0 : phase });
      return out;
    }
    if (phase <= 0) return [];
    if (tab.phased) return tab.quotCols.filter(function (q) { return (q.phase || 0) <= phase; });
    var out = [];
    var subs = 0;
    for (var i = 0; i < tab.quotCols.length; i++) {
      var q = tab.quotCols[i];
      if (q.ch === ',') {
        if (subs > 0) out.push(q);
        continue;
      }
      if (subs < phase) { out.push(q); subs++; }
      else break;
    }
    return out;
  }

  function renderTableau(tab, opts) {
    opts = opts || {};
    var fill = opts.mode === 'fill';
    var phase = opts.phase == null ? 99 : opts.phase;
    var detailed = !fill && opts.divisionStage != null;
    var detailSubs = 0;
    var dataRows = tab.rows.map(function (r, ri) {
      var copy = Object.assign({}, r);
      if (r.kind === 'sub') detailSubs++;
      copy.detailPhase = ri === 0 ? 0 : r.kind === 'sub' || r.final ? Math.max(1, detailSubs * 2 - 1) : detailSubs * 2;
      return copy;
    });
    var visible;
    if (fill) visible = [dataRows[0]];
    else if (detailed) visible = dataRows.filter(function (r) { return r.detailPhase <= opts.divisionStage; });
    else if (!tab.phased) {
      visible = [dataRows[0]];
      var produced = 0;
      for (var i = 1; i < dataRows.length; i++) {
        if (dataRows[i].kind === 'sub') {
          produced++;
          if (produced > phase) break;
        }
        if (phase <= 0) break;
        visible.push(dataRows[i]);
      }
      if (phase >= tab.stepCount) visible = dataRows.slice();
    } else if (phase >= 90 || phase >= tab.stepCount) visible = dataRows.slice();
    else visible = dataRows.filter(function (r) { return (r.phase || 0) <= phase; });
    var html = '<div class="vsheet"><div class="pchia tableau">';
    var workAttr = fill ? ' data-live="div" data-dividend="' + tab.sourceMilli + '" data-n="' + tab.divisor + '"' : '';
    html += '<div class="pchia-work"><div class="vcol"' + workAttr + ' style="display:grid;grid-template-columns:' + glyphTemplate(tab.glyphs) + '">';
    tab.glyphs.forEach(function (g, i) {
      var hidden = tab.padFrom != null && i >= tab.padFrom;
      var text = hidden ? '' : esc(g);
      var cls = 'tcell dividend' + (g === ',' && !hidden ? ' comma glow' : '');
      html += tag('span', cls, text, { phase: 0, style: 'grid-row:1;grid-column:' + (i + 1) });
    });
    if (fill) html += '<div class="live-rows"></div>';
    visible.forEach(function (r, idx) {
      if (idx === 0) return;
      var gr = idx + 1;
      var rowPhase = detailed ? r.detailPhase : r.phase == null ? phase : r.phase;
      var marked = false;
      r.cells.forEach(function (ch, ci) {
        if (ch === '' || ch == null) return;
        var cls = 'tcell' + (tab.glyphs[ci] === ',' ? ' comma' : '');
        if (r.kind === 'sub' && !marked) { cls += ' substart'; marked = true; }
        html += tag('span', cls, esc(ch), { phase: rowPhase, style: 'grid-row:' + gr + ';grid-column:' + (ci + 1) });
      });
      if (r.kind === 'sub' && r.from != null) {
        html += tag('span', 'trule', '', {
          phase: rowPhase,
          force: true,
          style: 'grid-row:' + gr + ';grid-column:' + (Math.max(0, r.from) + 1) + ' / ' + (r.to + 2)
        });
      }
    });
    html += '</div></div>';
    html += tag('div', 'pchia-rule', '', { phase: 0, force: true, attrs: 'aria-hidden="true"' });
    html += '<div class="pchia-side">';
    html += tag('div', 'tdiv', esc(tab.divisor), { phase: 0 });
    html += tag('div', 'tline', '', { phase: 0, force: true });
    if (fill) html += choiceAnswerHTML(tab.answerCells, true, null, tab.minDigits);
    else if (phase >= 1) {
      var previousPhase = 1;
      var shown = detailed ? tab.quotCols.map(function (q) {
        var copy = Object.assign({}, q);
        copy.phase = q.ch === ',' ? previousPhase + 1 : q.si == null ? 1 : q.si * 2 + 1;
        if (q.ch !== ',') previousPhase = copy.phase;
        return copy;
      }).filter(function (q) { return q.phase <= opts.divisionStage; }) : shownQuotient(tab, phase);
      html += '<div class="tquot">';
      shown.forEach(function (q) {
        var qp = q.phase == null ? phase : q.phase;
        html += q.ch === ','
          ? tag('span', 'vcell comma glow', ',', { phase: qp })
          : tag('span', 'vcell result', esc(q.ch), { phase: qp });
      });
      html += '</div>';
    }
    html += '</div></div></div>';
    return html;
  }

  function renderBoard(board, opts) {
    opts = opts || {};
    startInk(opts);
    var pace = opts.mode === 'fill' ? '' : ' style="--pace:' + (opts.phase == null ? '0.34s' : '0.95s') + '"';
    var html = '<div class="vsheet-wrap"' + pace + '>';
    if (board.type === 'column') html += renderColumn(board, opts);
    else if (board.type === 'mul') html += renderMul(board, opts);
    else if (board.type === 'shift') html += renderShift(board, opts);
    else if (board.type === 'div') {
      if (board.rewrite && (opts.mode === 'fill' || opts.phase == null || opts.phase >= 0)) html += renderRewrite(board.rewrite);
      html += renderTableau(board.tableau, opts);
      if (opts.mode !== 'fill' && opts.caption !== false && board.note && (opts.divisionStage == null || opts.divisionStage >= board.tableau.stepCount * 2 - 1) && (opts.phase == null || opts.phase >= (board.tableau.stepCount || 1))) {
        html += '<p class="caption">' + esc(board.note) + '</p>';
      }
    }
    html += '</div>';
    return finishInk(html);
  }

  function explainAdd(nums) {
    var answer = computeAnswer('add', nums);
    var board = columnBoard('+', nums, answer);
    var different = nums.some(function (n) { return placesOf(n) !== Math.max.apply(null, nums.map(placesOf)); });
    var step1 = 'Viết các số hạng sao cho các chữ số ở cùng hàng và các dấu phẩy thẳng cột.';
    if (different) step1 += ' Có thể viết thêm chữ số 0 vào bên phải phần thập phân để các số hạng có cùng số chữ số ở phần thập phân: ' + nums.map(function (n) {
      var d = Math.max.apply(null, nums.map(placesOf));
      return placesOf(n) === d ? fmt(n) : fmt(n) + ' = ' + fmtFixed(n, d);
    }).join('; ') + '.';
    var steps = [{ title: 'Đặt tính', text: step1 },
      { title: 'Kẻ vạch ngang trước khi cộng', text: 'Kẻ một đường ngang dưới các số hạng rồi mới cộng.', html: renderBoard(board, { mode: 'show', phase: 1, columnStep: 0 }) }];
    var d = Math.max.apply(null, nums.map(placesOf));
    var intLen = board.answerCells.filter(function (c) { return !c.comma; }).length - d;
    var cols = nums.map(function (n) { return digitRow(n, intLen, d); });
    var carry = 0, digitIndex = intLen + d - 1, reveal = 0;
    for (var i = board.answerCells.length - 1; i >= 0; i--) {
      reveal++;
      var c = board.answerCells[i];
      if (c.comma) {
        continue;
      }
      var ns = cols.map(function (r) { return r[digitIndex]; });
      var sum = ns.reduce(function (a, b) { return a + b; }, carry);
      var plain = sum - carry;
      var text = ns.join(' cộng ') + ' bằng ' + plain + (carry ? ', thêm ' + carry + ' bằng ' + sum : '') + ', viết ' + sum % 10;
      carry = Math.floor(sum / 10);
      if (carry) text += ', nhớ ' + carry + ' sang hàng bên trái';
      steps.push({ title: colName(digitIndex, intLen), text: text + '.', html: renderBoard(board, { mode: 'show', phase: reveal + 1, columnStep: reveal }) });
      digitIndex--;
    }
    steps.push({ title: 'Viết dấu phẩy', text: 'Cộng xong, viết dấu phẩy ở tổng thẳng cột với các dấu phẩy ở các số hạng.', html: renderBoard(board, { mode: 'show', phase: reveal + 1, columnStep: reveal }) });
    steps.push({ title: 'Kết quả', text: board.note, html: renderBoard(board, { mode: 'show' }) });
    return { answerText: fmt(answer), board: board, html: renderBoard(board, { mode: 'show' }), steps: steps };
  }

  function explainSub(a, b) {
    var answer = a - b;
    var board = columnBoard('−', [a, b], answer);
    var d = Math.max(placesOf(a), placesOf(b));
    var step1 = placesOf(a) !== placesOf(b)
      ? 'Đặt các chữ số cùng hàng và các dấu phẩy thẳng cột; có thể viết thêm chữ số 0 vào bên phải phần thập phân cho đủ số chữ số: ' + fmt(a) + ' = ' + fmtFixed(a, d) + '; ' + fmt(b) + ' = ' + fmtFixed(b, d) + '.'
      : 'Đặt tính theo cột dọc. Các dấu phẩy thẳng một cột.';
    var borrow = board.borrows ? ' Hàng nào chữ số ở số bị trừ bé hơn thì thêm 10 vào chữ số đó rồi trừ, viết kết quả và nhớ 1; số nhớ 1 được cộng thêm vào chữ số của số trừ ở hàng bên trái (chữ nhỏ màu đỏ).' : '';
    return {
      answerText: fmt(answer),
      board: board,
      html: renderBoard(board, { mode: 'show' }),
      steps: [
        { title: 'Đặt tính', text: step1 },
        { title: 'Trừ từ phải sang trái', text: 'Trừ theo cột dọc từ phải sang trái như trừ các số tự nhiên. Viết dấu phẩy ở hiệu thẳng cột với dấu phẩy của số bị trừ và số trừ. ' + board.note + '.' + borrow, html: renderBoard(board, { mode: 'show' }) }
      ]
    };
  }

  function explainMul(a, b) {
    var board = mulBoard(a, b);
    return {
      answerText: fmt(computeAnswer('mul', [a, b])),
      board: board,
      html: renderBoard(board, { mode: 'show' }),
      frames: board.frames || null,
      steps: [
        { title: 'Đặt tính', text: board.note, html: renderBoard(board, { mode: 'show' }) }
      ]
    };
  }

  function explainDivNatural(dividend, N) {
    var answer = computeAnswer('div', [dividend, N * SCALE]);
    var board = divBoard(dividend, N, null);
    var ok = parseAnswer(board.tableau.qstr) === answer;
    board.note = 'Viết thương bên phải vạch dọc, dưới số chia. ' + (placesOf(dividend) ? 'Chia phần nguyên trước. Viết dấu phẩy vào bên phải thương đã tìm được trước khi lấy chữ số đầu tiên ở phần thập phân của số bị chia để tiếp tục chia. ' : 'Nếu còn dư, viết dấu phẩy vào bên phải thương, viết thêm chữ số 0 vào bên phải số dư rồi chia tiếp. ') + 'Thử lại: ' + fmtG(answer) + ' × ' + numG(N) + ' = ' + fmtG(N * answer) + '. Vậy ' + fmtG(dividend) + ' : ' + numG(N) + ' = ' + fmtG(answer) + '.';
    return {
      answerText: fmt(answer),
      board: board,
      html: renderBoard(board, { mode: 'show' }),
      simOk: ok,
      qstr: board.tableau.qstr,
      steps: [
        { title: 'Phép chia viết', text: board.note, html: renderBoard(board, { mode: 'show' }) }
      ]
    };
  }

  function explainScaledDiv(dividend, divisor, intro) {
    var k = placesOf(divisor);
    var factor = Math.pow(10, k);
    var newDiv = divisor * factor;
    var newDend = dividend * factor;
    var N = newDiv / SCALE;
    var answer = computeAnswer('div', [dividend, divisor]);
    var rewrite = {
      factor: factor,
      k: k,
      lines: [
        { left: fmt(dividend), right: fmt(newDend) },
        { left: fmt(divisor), right: fmt(newDiv) }
      ],
      note: intro + ' × ' + factor + '.'
    };
    var board = divBoard(newDend, N, rewrite);
    board.answerCells = textCells(fmt(answer));
    board.note = 'Sau khi nhân cả hai số với ' + numG(factor) + ': ' + fmtG(newDend) + ' : ' + numG(N) + ' = ' + board.tableau.qstr + '. Vậy ' + fmtG(dividend) + ' : ' + fmtG(divisor) + ' = ' + fmtG(answer) + '.';
    var ok = parseAnswer(board.tableau.qstr) === answer;
    return {
      answerText: fmt(answer),
      board: board,
      html: renderBoard(board, { mode: 'show' }),
      simOk: ok,
      qstr: board.tableau.qstr,
      steps: [
        { title: 'Đổi số chia thành số tự nhiên', text: 'Phần thập phân của số chia có ' + k + ' chữ số. Chuyển dấu phẩy của số bị chia sang bên phải ' + k + ' chữ số (nếu không đủ chữ số thì viết thêm chữ số 0); bỏ dấu phẩy ở số chia. Tức là nhân cả số bị chia và số chia với ' + numG(factor) + '. ' + fmt(dividend) + ' × ' + factor + ' = ' + fmt(newDend) + '. ' + fmt(divisor) + ' × ' + factor + ' = ' + fmt(newDiv) + '.' },
        { title: 'Phép chia viết', text: board.note, html: renderBoard(board, { mode: 'show' }) }
      ]
    };
  }

  function explainDivPow(a, pow) {
    var zeros = String(pow).length - 1;
    var answer = a / pow;
    var board = shiftBoard(a, zeros, 'left', answer);
    board.label = fmtG(a) + ' : ' + numG(pow);
    board.note = fmtG(a) + ' : ' + numG(pow) + ' = ' + fmtG(answer) + '. ' + board.note;
    return {
      answerText: fmt(answer),
      board: board,
      html: renderBoard(board, { mode: 'show' }),
      frames: board.frames,
      steps: [
        { title: 'Chuyển dấu phẩy sang bên trái', text: board.note, html: renderBoard(board, { mode: 'show' }) }
      ]
    };
  }

  function explain(problem) {
    var nums = problem.nums;
    var out;
    if (problem.op === 'add') out = explainAdd(nums);
    else if (problem.op === 'sub') out = explainSub(nums[0], nums[1]);
    else if (problem.op === 'mul') out = explainMul(nums[0], nums[1]);
    else if (problem.kind === 1) out = explainDivNatural(nums[0], nums[1] / SCALE);
    else if (problem.kind === 2) out = explainScaledDiv(nums[0], nums[1], 'Số tự nhiên chia cho số thập phân.');
    else if (problem.kind === 3) out = explainScaledDiv(nums[0], nums[1], 'Số thập phân chia cho số thập phân.');
    else if (problem.kind === 4) out = explainDivPow(nums[0], nums[1] / SCALE);
    else if (problem.kind === 5) out = explainDivNatural(nums[0], nums[1] / SCALE);
    else throw new Error('cannot explain');
    if (out.answerText !== fmt(problem.answer)) {
      throw new Error('explain mismatch ' + out.answerText + ' vs ' + fmt(problem.answer));
    }
    var joined = cellsToText(out.board.answerCells);
    if (parseAnswer(joined) !== problem.answer) {
      throw new Error('answer cells ' + joined + ' vs ' + fmt(problem.answer));
    }
    return out;
  }

  function render(problem, opts) {
    var ex = explain(problem);
    return renderBoard(ex.board, opts || { mode: 'show' });
  }

  function promptOf(problem) {
    var sym = problem.op === 'add' ? ' + ' : problem.op === 'sub' ? ' − ' : problem.op === 'mul' ? ' × ' : ' : ';
    return problem.nums.map(fmtG).join(sym);
  }

  return {
    SCALE: SCALE,
    CATEGORY_IDS: CATEGORY_IDS,
    mulberry32: mulberry32,
    hashStr: hashStr,
    fmt: fmt,
    fmtFixed: fmtFixed,
    fmtG: fmtG,
    parseAnswer: parseAnswer,
    placesOf: placesOf,
    computeAnswer: computeAnswer,
    hasCarry: hasCarry,
    hasBorrow: hasBorrow,
    matchesLevel: matchesLevel,
    generateOne: generateOne,
    buildBank: buildBank,
    pickQuestions: pickQuestions,
    checkAnswer: checkAnswer,
    starsFor: starsFor,
    explain: explain,
    render: render,
    renderBoard: renderBoard,
    cellsToText: cellsToText,
    promptOf: promptOf,
    longDiv: longDiv,
    divisionLive: divisionLive,
    divisionLiveHTML: divisionLiveHTML,
    shiftLeftOnce: shiftLeftOnce,
    shiftRightOnce: shiftRightOnce
  };
});
