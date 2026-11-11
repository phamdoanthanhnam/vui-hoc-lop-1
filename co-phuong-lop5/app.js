(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var KEY = 'thaynam_stp_v1';
  var save = { name: '', stars: 0, sound: true, best: {} };
  try {
    var raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (raw && typeof raw === 'object') {
      save.name = raw.name || '';
      save.stars = raw.stars || 0;
      save.sound = raw.sound !== false;
      save.best = raw.best || {};
    }
  } catch (e) {}

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {}
  }

  var OPS = {
    add: {
      clip: 'add',
      title: 'Cộng số thập phân',
      levels: [
        { id: 'add-de', name: 'Dễ', blurb: 'Hai số có cùng số chữ số ở phần thập phân, không nhớ.', ex: '2,3 + 1,4' },
        { id: 'add-vua', name: 'Vừa', blurb: 'Hai số có số chữ số ở phần thập phân khác nhau.', ex: '3,5 + 1,25' },
        { id: 'add-kho', name: 'Khó', blurb: 'Ba số hạng, có nhớ.', ex: '7,86 + 4,59 + 2,7' }
      ]
    },
    sub: {
      clip: 'sub',
      title: 'Trừ số thập phân',
      levels: [
        { id: 'sub-de', name: 'Dễ', blurb: 'Hai số có cùng số chữ số ở phần thập phân, không nhớ.', ex: '5,8 − 2,3' },
        { id: 'sub-vua', name: 'Vừa', blurb: 'Hai số có số chữ số ở phần thập phân khác nhau.', ex: '6,5 − 1,25' },
        { id: 'sub-kho', name: 'Khó', blurb: 'Có nhớ, có cả số tự nhiên trừ số thập phân.', ex: '8,02 − 3,57 ; 15 − 4,72' }
      ]
    },
    mul: {
      clip: 'mul',
      title: 'Nhân số thập phân',
      levels: [
        { id: 'mul-de', name: 'Dễ', blurb: 'Nhân số thập phân với số tự nhiên có một chữ số.', ex: '2,4 × 3' },
        { id: 'mul-vua', name: 'Vừa', blurb: 'Nhân hai số thập phân. Đặt dấu phẩy theo tổng số chữ số ở phần thập phân của hai thừa số.', ex: '1,2 × 0,4' },
        { id: 'mul-kho', name: 'Khó', blurb: 'Nhân với 10; 100; 1 000 và nhân hai số thập phân.', ex: '3,45 × 100 ; 0,25 × 1,2' }
      ]
    }
  };

  var KINDS = [
    { kind: 1, clip: 'div1', title: 'Dạng 1. Số thập phân : số tự nhiên', ex: '14,4 : 6', rule: 'Chia như chia số tự nhiên. Viết dấu phẩy vào bên phải thương đã tìm được trước khi lấy chữ số đầu tiên ở phần thập phân của số bị chia để tiếp tục chia.' },
    { kind: 2, clip: 'div2', title: 'Dạng 2. Số tự nhiên : số thập phân', ex: '18 : 0,6', rule: 'Phần thập phân của số chia có bao nhiêu chữ số thì viết thêm bấy nhiêu chữ số 0 vào bên phải số bị chia; bỏ dấu phẩy ở số chia rồi chia như chia số tự nhiên.' },
    { kind: 3, clip: 'div3', title: 'Dạng 3. Số thập phân : số thập phân', ex: '3,25 : 1,3', rule: 'Phần thập phân của số chia có bao nhiêu chữ số thì chuyển dấu phẩy của số bị chia sang bên phải bấy nhiêu chữ số (thiếu thì viết thêm chữ số 0); bỏ dấu phẩy ở số chia rồi chia.' },
    { kind: 4, clip: 'div4', title: 'Dạng 4. Chia cho 10; 100; 1 000', ex: '45,6 : 100 = 0,456', rule: 'Chuyển dấu phẩy sang bên trái một, hai, ba chữ số. Không đủ chữ số thì viết thêm chữ số 0.' },
    { kind: 5, clip: 'div5', title: 'Dạng 5. Số tự nhiên : số tự nhiên, thương là số thập phân', ex: '6 : 25 = 0,24', rule: 'Nếu còn dư, viết dấu phẩy vào bên phải thương, viết thêm chữ số 0 vào bên phải số dư rồi chia tiếp.' }
  ];

  var DIV_LEVELS = {
    1: [
      { id: 'div1-de', name: 'Dễ', blurb: 'Số bị chia có 1 chữ số ở phần thập phân, số chia từ 2 đến 9.', ex: '14,4 : 6' },
      { id: 'div1-vua', name: 'Vừa', blurb: 'Số bị chia có 2 chữ số ở phần thập phân, số chia đến 12.', ex: '7,56 : 4' },
      { id: 'div1-kho', name: 'Khó', blurb: 'Số chia đến 25; thương có thể có 2 hoặc 3 chữ số ở phần thập phân.', ex: '47,994 : 19' }
    ],
    2: [
      { id: 'div2-de', name: 'Dễ', blurb: 'Số chia có 1 chữ số ở phần thập phân. Nhân cả hai số với 10.', ex: '18 : 0,6' },
      { id: 'div2-vua', name: 'Vừa', blurb: 'Số chia có 2 chữ số ở phần thập phân. Nhân cả hai số với 100.', ex: '21 : 1,75' },
      { id: 'div2-kho', name: 'Khó', blurb: 'Số chia có 2 hoặc 3 chữ số ở phần thập phân; thương có thể là số thập phân (viết thêm 0 vào số dư như Dạng 5).', ex: '1 : 0,125 ; 21 : 3,75' }
    ],
    3: [
      { id: 'div3-de', name: 'Dễ', blurb: 'Cả hai số đều có 1 chữ số ở phần thập phân. Nhân cả hai số với 10.', ex: '4,8 : 1,2' },
      { id: 'div3-vua', name: 'Vừa', blurb: 'Số bị chia có 2 chữ số ở phần thập phân, số chia có 1. Nhân cả hai số với 10.', ex: '3,25 : 1,3' },
      { id: 'div3-kho', name: 'Khó', blurb: 'Số chia có 2 chữ số ở phần thập phân. Nhân cả hai số với 100.', ex: '7,56 : 1,26' }
    ],
    4: [
      { id: 'div4-de', name: 'Dễ', blurb: 'Chia cho 10. Chuyển dấu phẩy sang bên trái 1 chữ số.', ex: '45,6 : 10' },
      { id: 'div4-vua', name: 'Vừa', blurb: 'Chia cho 100. Chuyển dấu phẩy sang bên trái 2 chữ số.', ex: '45,6 : 100' },
      { id: 'div4-kho', name: 'Khó', blurb: 'Số tự nhiên chia cho 1 000. Chuyển dấu phẩy sang bên trái 3 chữ số.', ex: '45 : 1 000' }
    ],
    5: [
      { id: 'div5-de', name: 'Dễ', blurb: 'Thương có 1 chữ số ở phần thập phân. Chia cho 2 hoặc 5.', ex: '2 : 5 = 0,4' },
      { id: 'div5-vua', name: 'Vừa', blurb: 'Thương có 2 chữ số ở phần thập phân. Chia cho 4 hoặc 25.', ex: '23 : 4 = 5,75' },
      { id: 'div5-kho', name: 'Khó', blurb: 'Thương có 3 chữ số ở phần thập phân. Chia cho 8.', ex: '15 : 8 = 1,875' }
    ]
  };

  var flow = { op: 'add', kind: 0, cat: '' };
  var player = null;
  var quiz = null;
  var banks = {};

  function bankFor(id) {
    if (!banks[id]) banks[id] = STP.buildBank(id, 48, STP.hashStr('lop5-' + id));
    return banks[id];
  }

  function show(name) {
    ['home', 'kinds', 'clip', 'levels', 'quiz', 'result'].forEach(function (s) {
      $('screen-' + s).hidden = s !== name;
    });
    var scroller = document.querySelector('main');
    if (scroller) scroller.scrollTop = 0;
  }

  function destroyClip() {
    if (player) { player.destroy(); player = null; }
  }

  function hello() {
    var name = save.name ? save.name : 'em';
    $('hello').textContent = 'Chào ' + name + '! Mình là Thỏ Bông, đây là Gấu Bin. Cùng ôn số thập phân lớp 5 với Cô Bích Phượng Tam Bình nhé!';
    $('homeStars').textContent = String(save.stars);
  }

  function goHome() {
    destroyClip();
    hello();
    show('home');
  }

  function currentLevels() {
    if (flow.op === 'div') return DIV_LEVELS[flow.kind];
    return OPS[flow.op].levels;
  }

  function currentClip() {
    if (flow.op === 'div') return 'div' + flow.kind;
    return OPS[flow.op].clip;
  }

  function currentTitle() {
    if (flow.op === 'div') {
      var k = KINDS.filter(function (item) { return item.kind === flow.kind; })[0];
      return k ? k.title : 'Chia số thập phân';
    }
    return OPS[flow.op].title;
  }

  function openClip() {
    destroyClip();
    show('clip');
    var id = currentClip();
    $('clipHeading').textContent = Clips.CLIPS[id].title;
    player = Clips.mount($('clipMount'), id, function () { openLevels(); });
  }

  function starText(n) {
    if (!n) return '';
    return 'Đã đạt ' + '★'.repeat(n);
  }

  function openLevels() {
    destroyClip();
    $('levelHeading').textContent = currentTitle();
    $('levelLead').textContent = 'Mỗi mức có 8 câu. Câu được lấy ngẫu nhiên, nên lần làm sau sẽ khác lần này.';
    var box = $('levelList');
    box.innerHTML = '';
    currentLevels().forEach(function (lv) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'level ' + (lv.id.endsWith('de') ? 'de' : lv.id.endsWith('vua') ? 'vua' : 'kho');
      var key = lv.id.endsWith('-de') ? 'de' : lv.id.endsWith('-vua') ? 'vua' : 'kho';
      var best = save.best[lv.id] || 0;
      b.innerHTML = '<span class="lv ' + key + '">' + lv.name + '</span><span><b>' + lv.blurb + '</b><span>Ví dụ: ' + lv.ex + '</span>' +
        (best ? '<span class="stars-mini">' + starText(best) + '</span>' : '') + '</span>';
      b.addEventListener('click', function () { startQuiz(lv.id); });
      box.appendChild(b);
    });
    show('levels');
  }

  function renderKinds() {
    var box = $('kindList');
    box.innerHTML = '';
    KINDS.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'kind';
      b.innerHTML = '<span class="kind-no ico-div">' + k.kind + '</span><span><b>' + k.title + '</b><span>' + k.rule + '</span><span>Ví dụ: ' + k.ex + '</span></span>';
      b.addEventListener('click', function () {
        flow.op = 'div';
        flow.kind = k.kind;
        openClip();
      });
      box.appendChild(b);
    });
  }

  var PRAISE = ['Đúng rồi!', 'Chính xác!', 'Em làm tốt lắm!', 'Cô khen em!', 'Rất tốt!'];
  var EMO = ['⭐', '🌟', '🎉', '✨', '🍀', '🎈', '💖', '🧡'];

  function confetti(n) {
    var fx = $('fx');
    // Bắt đầu rơi từ dưới thanh tiêu đề để không lẫn vào chữ tiêu đề.
    var head = document.querySelector('header.top');
    fx.style.top = head ? Math.round(head.getBoundingClientRect().bottom) + 'px' : '0';
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'cf';
      s.textContent = EMO[i % EMO.length];
      // Chỉ rơi ở hai mép màn hình để không che chữ và nút Kiểm tra.
      var side = i % 2 === 0;
      s.style.left = side ? (Math.random() * 6) + 'vw' : 'calc(' + (94 + Math.random() * 6) + 'vw - 26px)';
      s.style.animationDelay = (Math.random() * 0.35) + 's';
      fx.appendChild(s);
      setTimeout(function (el) { return function () { el.remove(); }; }(s), 1800);
    }
  }

  var audioCtx = null;
  function tone(freqs, dur, type) {
    if (!save.sound) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      var t0 = audioCtx.currentTime;
      freqs.forEach(function (f, i) {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.type = type || 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + i * dur);
        g.gain.exponentialRampToValueAtTime(0.18, t0 + i * dur + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + (i + 1) * dur);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(t0 + i * dur);
        o.stop(t0 + (i + 1) * dur + 0.03);
      });
    } catch (e) {}
  }

  function startQuiz(cat) {
    flow.cat = cat;
    quiz = {
      cat: cat,
      items: STP.pickQuestions(bankFor(cat), 8),
      i: 0,
      correct: 0,
      locked: false,
      misses: []
    };
    show('quiz');
    renderQuestion();
  }

  var OP_NAME = { add: 'Cộng', sub: 'Trừ', mul: 'Nhân', div: 'Chia' };

  // Đọc các ô: bỏ qua ô trống ở đầu và ở cuối (không bắt viết 07,82; nhập được cả 170 và 170,0).
  function readBoxes() {
    var nodes = Array.prototype.slice.call($('workspace').querySelectorAll('[data-ans]'));
    var res = { text: '', any: false, gap: false, leadComma: false, trailComma: false, complete: false };
    if (!nodes.length) return res;
    var seq = nodes.map(function (n) {
      if (n.getAttribute('data-ans') === 'comma') return { c: true, on: n.getAttribute('data-on') === '1' };
      return { c: false, v: String(n.value || '').replace(/\D/g, '').slice(0, 1) };
    });
    var first = -1, last = -1, i;
    for (i = 0; i < seq.length; i++) if (!seq[i].c && seq[i].v) { if (first < 0) first = i; last = i; }
    if (first < 0) {
      res.leadComma = seq.some(function (x) { return x.c && x.on; });
      return res;
    }
    res.any = true;
    for (i = 0; i < seq.length; i++) {
      var x = seq[i];
      if (x.c) {
        if (!x.on) continue;
        if (i < first) res.leadComma = true;
        else if (i > last) res.trailComma = true;
        else res.text += ',';
      } else if (i >= first && i <= last) {
        if (!x.v) res.gap = true;
        res.text += x.v;
      }
    }
    res.complete = !res.gap && !res.leadComma && !res.trailComma;
    return res;
  }

  function clearBoxes() {
    $('workspace').querySelectorAll('.vbox').forEach(function (el) { el.value = ''; });
    $('workspace').querySelectorAll('.comma-slot').forEach(function (sl) {
      sl.removeAttribute('data-on');
      sl.textContent = '';
      sl.classList.remove('on');
    });
    paintLive();
  }

  // Kiểm tra cách gõ ở ô "Hoặc gõ cả đáp án"; trả về lời nhắc hoặc '' nếu hợp lệ.
  function typedProblem(raw) {
    var t = String(raw).trim().replace(/\s+/g, '');
    if (/^\d{1,3}(\.\d{3})+$/.test(t)) return 'Em dùng dấu phẩy để viết số thập phân nhé (ví dụ 7,87). Số tự nhiên thì không cần dấu chấm.';
    if (/^[,.]/.test(t)) return 'Trước dấu phẩy phải có phần nguyên, ví dụ 0,5.';
    if (/[,.]$/.test(t)) return 'Sau dấu phẩy phải có chữ số. Nếu không có phần thập phân thì em bỏ dấu phẩy đi.';
    if ((t.match(/[,.]/g) || []).length > 1) return 'Số thập phân chỉ có một dấu phẩy.';
    if (!/^\d+([,.]\d+)?$/.test(t)) return 'Em chỉ gõ chữ số và một dấu phẩy nhé.';
    return '';
  }

  function paintLive() {
    if (!quiz || quiz.locked) return;
    var host = $('workspace').querySelector('[data-live="div"]');
    if (host) {
      var side = $('workspace').querySelector('.pchia-side');
      var digits = [];
      if (side) {
        var boxes = side.querySelectorAll('.vbox');
        var started = false;
        for (var i = 0; i < boxes.length; i++) {
          var v = String(boxes[i].value || '').replace(/\D/g, '').slice(0, 1);
          if (!v) { if (started) break; continue; }
          started = true;
          digits.push(Number(v));
        }
      }
      var slot = host.querySelector('.live-rows');
      if (slot) slot.innerHTML = STP.divisionLiveHTML(Number(host.getAttribute('data-dividend')), Number(host.getAttribute('data-n')), digits);
    }
    var echo = $('workspace').querySelector('[data-live="mul"]');
    if (echo) {
      var pack = $('workspace').querySelector('.answer-digits');
      var text = '';
      if (pack) {
        pack.querySelectorAll('[data-ans]').forEach(function (n) {
          if (n.getAttribute('data-ans') === 'comma') {
            if (n.getAttribute('data-on') === '1') text += ',';
          } else {
            var d = String(n.value || '').replace(/\D/g, '').slice(0, 1);
            if (d) text += d;
          }
        });
      }
      echo.textContent = text;
    }
  }

  function placeComma(slot) {
    if (!slot) return;
    var turnOn = slot.getAttribute('data-on') !== '1';
    $('workspace').querySelectorAll('.comma-slot').forEach(function (s) {
      s.removeAttribute('data-on');
      s.textContent = '';
      s.classList.remove('on');
    });
    if (turnOn) {
      slot.setAttribute('data-on', '1');
      slot.textContent = ',';
      slot.classList.add('on');
    }
  }

  function renderQuestion() {
    var q = quiz.items[quiz.i];
    quiz.locked = false;
    $('qCount').textContent = 'Câu ' + (quiz.i + 1) + '/8';
    $('qScore').textContent = String(quiz.correct);
    $('qBar').style.width = (quiz.i / 8 * 100) + '%';
    $('prompt').textContent = OP_NAME[q.op] + ': ' + STP.promptOf(q) + ' = ?';
    $('promptSub').textContent = 'Điền kết quả (đặt dấu phẩy nếu cần).';
    $('workspace').innerHTML = STP.render(q, { mode: 'fill' });
    $('ans').value = '';
    $('ans').disabled = false;
    $('workspace').querySelectorAll('.vbox').forEach(function (el) { el.disabled = false; });
    $('checkBtn').disabled = false;
    $('fb').className = 'fb';
    $('fb').textContent = '';
    $('solution').hidden = true;
    $('solution').innerHTML = '';
    $('nextBtn').hidden = true;
    $('nextBtn').textContent = quiz.i === 7 ? 'Xem kết quả' : 'Câu tiếp theo';
    var first = $('workspace').querySelector('.vbox');
    if (first) first.focus();
  }

  function showSolution(q) {
    var ex = STP.explain(q);
    var box = $('solution');
    box.hidden = false;
    // Vẽ tĩnh (không hiệu ứng viết dần) để phần Cách làm hiện đủ ngay.
    box.innerHTML = '<h3>Cách làm</h3>' + STP.renderBoard(ex.board, { mode: 'show', ink: false });
  }

  function warn(msg, shake) {
    $('fb').className = 'fb warn';
    $('fb').textContent = msg;
    if (shake) {
      $('qcard').classList.remove('shake');
      void $('qcard').offsetWidth;
      $('qcard').classList.add('shake');
    }
  }

  function onCheck(ev) {
    ev.preventDefault();
    if (!quiz || quiz.locked) return;
    var boxes = readBoxes();
    var backup = $('ans').value;
    var raw = '';
    if (boxes.any || boxes.leadComma) {
      if (boxes.gap) { warn('Em viết các chữ số liền nhau, không để trống ô ở giữa.', true); return; }
      if (boxes.leadComma) { warn('Trước dấu phẩy phải có phần nguyên, ví dụ 0,5.', true); return; }
      if (boxes.trailComma) { warn('Sau dấu phẩy phải có chữ số. Nếu không có phần thập phân thì em bỏ dấu phẩy đi (chạm lại ô dấu phẩy).', true); return; }
      raw = boxes.text;
    } else if (backup.trim()) {
      var problem = typedProblem(backup);
      if (problem) { warn(problem, true); return; }
      raw = backup;
    } else {
      warn('Em hãy điền kết quả vào các ô (hoặc gõ cả đáp án), rồi bấm Kiểm tra.', true);
      return;
    }
    var tooLong = STP.parseAnswer(raw) === null && /^\d+([,.]\d+)?$/.test(String(raw).trim().replace(/\s+/g, ''));
    if (STP.parseAnswer(raw) === null && !tooLong) {
      warn('Em chỉ ghi chữ số và một dấu phẩy nhé.', true);
      return;
    }
    var q = quiz.items[quiz.i];
    quiz.locked = true;
    $('ans').disabled = true;
    $('checkBtn').disabled = true;
    $('workspace').querySelectorAll('.vbox').forEach(function (el) { el.disabled = true; });
    if (STP.checkAnswer(q, raw)) {
      quiz.correct += 1;
      $('fb').className = 'fb ok';
      $('fb').textContent = PRAISE[Math.floor(Math.random() * PRAISE.length)] + ' Kết quả là ' + STP.fmtG(q.answer) + '.';
      $('qScore').textContent = String(quiz.correct);
      tone([784, 1047, 1319], 0.12);
      confetti(10);
    } else {
      quiz.misses.push(q);
      $('fb').className = 'fb no';
      $('fb').textContent = 'Chưa đúng. Kết quả đúng là ' + STP.fmtG(q.answer) + '. Em xem cách làm nhé.';
      showSolution(q);
      tone([196, 146], 0.16, 'square');
    }
    $('qBar').style.width = ((quiz.i + 1) / 8 * 100) + '%';
    $('nextBtn').hidden = false;
    $('nextBtn').focus();
  }

  function finish() {
    var stars = STP.starsFor(quiz.correct, 8);
    save.stars += stars;
    var prev = save.best[quiz.cat] || 0;
    if (stars > prev) save.best[quiz.cat] = stars;
    persist();
    hello();
    var starStr = stars ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '☆☆☆';
    $('rStars').textContent = starStr;
    var title = stars === 3 ? 'Xuất sắc!' : stars === 2 ? 'Khá tốt!' : stars === 1 ? 'Em đã cố gắng!' : 'Ta luyện thêm nhé!';
    $('rTitle').textContent = title;
    var who = save.name ? save.name : 'Em';
    $('rScore').textContent = who + ' đúng ' + quiz.correct + '/8 câu. Mức này được ' + stars + ' sao.';
    var miss = $('rMiss');
    miss.innerHTML = '';
    if (!quiz.misses.length) {
      var p = document.createElement('p');
      p.className = 'lead';
      p.textContent = 'Em làm đúng cả 8 câu.';
      miss.appendChild(p);
      confetti(28);
    } else {
      var h = document.createElement('h2');
      h.textContent = 'Các câu cần xem lại';
      h.style.fontSize = '20px';
      miss.appendChild(h);
      quiz.misses.forEach(function (q) {
        var row = document.createElement('div');
        row.className = 'miss';
        row.textContent = STP.promptOf(q) + ' = ' + STP.fmtG(q.answer);
        miss.appendChild(row);
      });
    }
    show('result');
  }

  function renderSound() {
    $('snd').textContent = save.sound ? '🔊' : '🔇';
    $('snd').setAttribute('aria-label', save.sound ? 'Tắt âm thanh' : 'Bật âm thanh');
  }

  document.querySelectorAll('.gate').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var op = btn.getAttribute('data-op');
      flow.op = op;
      if (op === 'div') { show('kinds'); return; }
      flow.kind = 0;
      openClip();
    });
  });

  $('homeBtn').addEventListener('click', goHome);
  $('kindsHome').addEventListener('click', goHome);
  $('levelHome').addEventListener('click', goHome);
  $('quizHome').addEventListener('click', goHome);
  $('resultHome').addEventListener('click', goHome);
  $('rewatch').addEventListener('click', openClip);
  $('otherLevel').addEventListener('click', openLevels);
  $('againBtn').addEventListener('click', function () { startQuiz(flow.cat); });
  $('retryBtn').addEventListener('click', function () { if (flow.cat) startQuiz(flow.cat); });
  $('answerForm').addEventListener('submit', onCheck);
  $('workspace').addEventListener('click', function (ev) {
    var slot = ev.target.closest ? ev.target.closest('.comma-slot') : null;
    if (!slot || (quiz && quiz.locked)) return;
    if ($('ans').value) $('ans').value = '';
    placeComma(slot);
    paintLive();
  });
  $('ans').addEventListener('input', function () {
    if (quiz && quiz.locked) return;
    if ($('ans').value.trim() && readBoxes().any) clearBoxes();
  });
  $('workspace').addEventListener('input', function (ev) {
    var t = ev.target;
    if (!t.classList || !t.classList.contains('vbox')) return;
    if ($('ans').value) $('ans').value = '';
    var raw = String(t.value || '');
    if (/[,.]/.test(raw)) {
      t.value = '';
      var nodes = Array.prototype.slice.call($('workspace').querySelectorAll('[data-ans]'));
      var at = nodes.indexOf(t);
      var slot = null;
      var j;
      // Dấu phẩy gõ vào ô trống đang chờ → đặt ở ô dấu phẩy ngay trước ô đó (sau chữ số vừa viết).
      for (j = at - 1; j >= 0; j--) if (nodes[j].getAttribute('data-ans') === 'comma') { slot = nodes[j]; break; }
      if (!slot) for (j = at + 1; j < nodes.length; j++) if (nodes[j].getAttribute('data-ans') === 'comma') { slot = nodes[j]; break; }
      if (slot && slot.getAttribute('data-on') !== '1') placeComma(slot);
      paintLive();
      return;
    }
    t.value = raw.replace(/\D/g, '').slice(0, 1);
    paintLive();
    if (!t.value) return;
    var all = Array.prototype.slice.call($('workspace').querySelectorAll('.vbox'));
    var i = all.indexOf(t);
    if (all[i + 1]) all[i + 1].focus();
  });
  $('workspace').addEventListener('keydown', function (ev) {
    var t = ev.target;
    if (!t.classList || !t.classList.contains('vbox')) return;
    if (ev.key === 'Backspace' && !t.value) {
      var all = Array.prototype.slice.call($('workspace').querySelectorAll('.vbox'));
      var i = all.indexOf(t);
      if (i > 0) {
        all[i - 1].focus();
        all[i - 1].value = '';
        paintLive();
        ev.preventDefault();
      }
    }
  });
  $('nextBtn').addEventListener('click', function () {
    if (!quiz) return;
    quiz.i += 1;
    if (quiz.i >= 8) finish();
    else renderQuestion();
  });
  $('snd').addEventListener('click', function () {
    save.sound = !save.sound;
    persist();
    renderSound();
    if (save.sound) tone([660, 880], 0.08);
  });
  $('name').value = save.name;
  $('name').addEventListener('input', function () {
    save.name = $('name').value.replace(/\s+/g, ' ').trim().slice(0, 24);
    persist();
    hello();
  });

  renderKinds();
  renderSound();
  hello();
  show('home');
})();
