/* Đối chiếu SGK Toán 5, Tập một, Kết nối tri thức với cuộc sống:
   Bài 19 tr.65–66; Bài 20 tr.68–69; Bài 21 tr.71–74;
   Bài 22 tr.76–82; Bài 23 tr.83–86 (chỉ phần nhân, chia với 10; 100; 1 000 —
   trang chưa có phần nhân, chia với 0,1; 0,01; 0,001). Ví dụ 3,50 + 1,25 theo yêu cầu giáo viên. */
/* Hoạt cảnh đặt tính dọc — cùng kiểu ô với phần luyện tập. */
(function (root) {
  'use strict';

  function P(op, nums, answer, kind) {
    return { op: op, kind: kind || 0, nums: nums, answer: answer, level: 'de', meta: {} };
  }

  function board(problem, opts) {
    return STP.render(problem, opts || { mode: 'show' });
  }

  var ADD = P('add', [3500, 1250], 4750);
  var ADD2 = P('add', [2750, 1480], 4230);
  var SUB = P('sub', [8020, 3570], 4450);
  var SUB2 = P('sub', [5800, 2300], 3500);
  var MUL = P('mul', [1200, 400], 480);
  var MUL2 = P('mul', [100, 200], 20);
  var D1 = P('div', [14400, 6000], 2400, 1);
  var D1B = P('div', [2080, 8000], 260, 1);
  var D1C = P('div', [4040, 4000], 1010, 1);
  var D2 = P('div', [18000, 600], 30000, 2);
  var D3 = P('div', [3250, 1300], 2500, 3);
  var D4 = P('div', [45600, 100000], 456, 4);
  var D4B = P('div', [4500, 100000], 45, 4);
  var D4C = P('div', [45000, 1000000], 45, 4);
  var D5 = P('div', [6000, 25000], 240, 5);

  var CLIPS = {
    add: {
      title: 'Cộng số thập phân',
      steps: [
        { who: 'rabbit', ms: 7500, say: 'Đặt tính 3,5 cộng 1,25: các chữ số ở cùng một hàng đặt thẳng cột với nhau, các dấu phẩy đặt thẳng cột.', board: '<p class="expr">3,5 + 1,25</p>' },
        { who: 'bear', ms: 9000, say: 'Có thể viết thêm chữ số 0 vào bên phải phần thập phân của 3,5 để hai số có cùng số chữ số ở phần thập phân: 3,5 = 3,50.', board: board(ADD, { mode: 'show', phase: 0 }) },
        { who: 'rabbit', ms: 7000, say: 'Kẻ một đường ngang dưới hai số hạng, rồi cộng như cộng các số tự nhiên, từ phải sang trái.', board: board(ADD, { mode: 'show', phase: 1, columnStep: 0 }) },
        { who: 'bear', ms: 6500, say: 'Hàng phần trăm: 0 cộng 5 bằng 5, viết 5.', board: board(ADD, { mode: 'show', phase: 2, columnStep: 1 }) },
        { who: 'rabbit', ms: 6500, say: 'Hàng phần mười: 5 cộng 2 bằng 7, viết 7.', board: board(ADD, { mode: 'show', phase: 3, columnStep: 2 }) },
        { who: 'bear', ms: 6500, say: 'Hàng đơn vị: 3 cộng 1 bằng 4, viết 4.', board: board(ADD, { mode: 'show', phase: 4, columnStep: 3 }) },
        { who: 'rabbit', ms: 7500, say: 'Cộng xong, viết dấu phẩy ở tổng thẳng cột với các dấu phẩy ở hai số hạng.', board: board(ADD, { mode: 'show', phase: 5, columnStep: 4 }) },
        { who: 'bear', ms: 6500, say: 'Vậy 3,5 + 1,25 = 4,75.', board: board(ADD, { mode: 'show', phase: 5, columnStep: 4 }) },
        { who: 'rabbit', ms: 7000, say: 'Thêm một ví dụ có nhớ: 2,75 + 1,48. Đặt tính rồi cộng từ phải sang trái.', board: board(ADD2, { mode: 'show', phase: 1, columnStep: 0 }) },
        { who: 'bear', ms: 8000, say: 'Hàng phần trăm: 5 cộng 8 bằng 13, viết 3, nhớ 1 sang hàng phần mười.', board: board(ADD2, { mode: 'show', phase: 2, columnStep: 1 }) },
        { who: 'rabbit', ms: 8000, say: 'Hàng phần mười: 7 cộng 4 bằng 11, thêm 1 bằng 12, viết 2, nhớ 1 sang hàng đơn vị.', board: board(ADD2, { mode: 'show', phase: 3, columnStep: 2 }) },
        { who: 'bear', ms: 7000, say: 'Hàng đơn vị: 2 cộng 1 bằng 3, thêm 1 bằng 4, viết 4.', board: board(ADD2, { mode: 'show', phase: 4, columnStep: 3 }) },
        { who: 'rabbit', ms: 8000, say: 'Viết dấu phẩy ở tổng thẳng cột với các dấu phẩy. Vậy 2,75 + 1,48 = 4,23.', board: board(ADD2, { mode: 'show', phase: 5, columnStep: 4 }) },
        { who: 'bear', ms: 6500, say: 'Đến lượt em điền chữ số và đặt dấu phẩy.', board: board(ADD2, { mode: 'show', phase: 5, columnStep: 4 }) }
      ]
    },
    sub: {
      title: 'Trừ số thập phân',
      steps: [
        { who: 'rabbit', ms: 8500, say: 'Đặt tính 8,02 − 3,57: số bị trừ ở trên, số trừ ở dưới; các chữ số cùng hàng thẳng cột, các dấu phẩy thẳng cột.', board: '<p class="expr">8,02 − 3,57</p>' },
        { who: 'bear', ms: 8500, say: 'Kẻ vạch ngang rồi trừ như trừ các số tự nhiên, từ phải sang trái. Vạch vàng chỉ cột dấu phẩy.', board: board(SUB, { mode: 'show', phase: 1, columnStep: 0 }) },
        { who: 'rabbit', ms: 10400, say: 'Hàng phần trăm: 2 không trừ được 7, lấy 12 trừ 7 bằng 5, viết 5, nhớ 1. Số 1 nhỏ màu đỏ cạnh chữ số 2 cho biết ta thêm 10 vào 2.', board: board(SUB, { mode: 'show', phase: 2, columnStep: 1 }) },
        { who: 'bear', ms: 10400, say: 'Hàng phần mười: 5 thêm 1 bằng 6. 0 không trừ được 6, lấy 10 trừ 6 bằng 4, viết 4, nhớ 1. Dấu +1 đỏ cạnh số 5 là số nhớ cộng vào số trừ.', board: board(SUB, { mode: 'show', phase: 3, columnStep: 2 }) },
        { who: 'rabbit', ms: 8500, say: 'Hàng đơn vị: 3 thêm 1 bằng 4. 8 trừ 4 bằng 4, viết 4.', board: board(SUB, { mode: 'show', phase: 4, columnStep: 3 }) },
        { who: 'bear', ms: 8500, say: 'Trừ xong, viết dấu phẩy ở hiệu thẳng cột với các dấu phẩy ở trên. Vậy 8,02 − 3,57 = 4,45.', board: board(SUB, { mode: 'show', phase: 5, columnStep: 4 }) },
        { who: 'rabbit', ms: 10000, say: 'Nhớ nhé: trừ theo cột dọc từ phải sang trái; số nhớ được cộng thêm vào chữ số của số trừ ở hàng bên trái (hàng cao hơn liền kề). Viết dấu phẩy ở hiệu thẳng cột với dấu phẩy của số bị trừ.', board: board(SUB, { mode: 'show', phase: 5, columnStep: 4 }) },
        { who: 'bear', ms: 8000, say: 'Ví dụ không nhớ: 5,8 − 2,3. Hàng phần mười: 8 trừ 3 bằng 5, viết 5.', board: board(SUB2, { mode: 'show', phase: 2, columnStep: 1 }) },
        { who: 'rabbit', ms: 8500, say: 'Hàng đơn vị: 5 trừ 2 bằng 3, viết 3. Viết dấu phẩy thẳng cột. Vậy 5,8 − 2,3 = 3,5.', board: board(SUB2, { mode: 'show', phase: 4, columnStep: 3 }) },
        { who: 'bear', ms: 6500, say: 'Đến lượt em điền chữ số và đặt dấu phẩy.', board: board(SUB2, { mode: 'show', phase: 4, columnStep: 3 }) }
      ]
    },
    mul: {
      title: 'Nhân số thập phân',
      steps: [
        { who: 'rabbit', ms: 11000, say: 'Muốn nhân hai số thập phân: nhân như nhân các số tự nhiên. Rồi đếm xem phần thập phân của cả hai thừa số có tất cả bao nhiêu chữ số, dùng dấu phẩy tách ở tích ra bấy nhiêu chữ số kể từ phải sang trái.', board: '<p class="expr">1,2 × 0,4</p>' },
        { who: 'bear', ms: 9000, say: 'Phần thập phân của 1,2 có 1 chữ số, của 0,4 có 1 chữ số. Vậy phần thập phân của hai thừa số có tất cả 2 chữ số.', board: board(MUL, { mode: 'show', phase: 0 }) },
        { who: 'rabbit', ms: 8500, say: 'Đặt tính rồi nhân như nhân các số tự nhiên (tạm chưa để ý dấu phẩy): 12 × 4.', board: board(MUL, { mode: 'show', phase: 0 }) },
        { who: 'bear', ms: 7500, say: '12 nhân 4 bằng 48. Viết 48 ở hàng tích.', board: board(MUL, { mode: 'show', phase: 1 }) },
        { who: 'rabbit', ms: 10000, say: 'Từ phải sang trái, tách 2 chữ số: ,48. Phần nguyên chưa có chữ số nào nên viết 0 trước dấu phẩy: 0,48.', board: board(MUL, { mode: 'show', phase: 2 }) },
        { who: 'bear', ms: 7500, say: 'Vậy 1,2 × 0,4 = 0,48.', board: board(MUL, { mode: 'show', phase: 2 }) },
        { who: 'rabbit', ms: 11000, say: 'Nếu tích có ít chữ số hơn số chữ số cần tách thì viết thêm chữ số 0 vào bên trái. Ví dụ 0,1 × 0,2: 1 × 2 = 2, cần tách 2 chữ số nên viết 0,02.', board: board(MUL2, { mode: 'show' }) },
        { who: 'bear', ms: 7000, say: 'Khi làm bài, em tự đặt dấu phẩy vào ô nét đứt.', board: board(MUL, { mode: 'show', phase: 2 }) }
      ]
    },
    div1: {
      title: 'Chia số thập phân cho số tự nhiên',
      steps: [
        { who: 'rabbit', ms: 8800, say: 'Đặt phép chia viết: số bị chia bên trái vạch dọc, số chia bên phải. Thương viết dưới số chia, ngăn cách bởi một vạch ngang.', board: board(D1, { mode: 'show', phase: 0 }) },
        { who: 'bear', ms: 9600, say: '14 chia 6 được 2, viết 2 vào thương, dưới số 6. 2 nhân 6 bằng 12; viết 12 dưới 14 rồi trừ.', board: board(D1, { mode: 'show', phase: 1, divisionStage: 1 }) },
        { who: 'rabbit', ms: 10000, say: '14 trừ 12 bằng 2. Đã hết phần nguyên của số bị chia, nên viết dấu phẩy vào bên phải số 2 ở thương, rồi hạ 4 được 24.', board: board(D1, { mode: 'show', phase: 2, divisionStage: 2 }) },
        { who: 'bear', ms: 8800, say: '24 chia 6 được 4, viết 4 vào thương. 4 nhân 6 bằng 24; 24 trừ 24 bằng 0.', board: board(D1, { mode: 'show', phase: 3, divisionStage: 3 }) },
        { who: 'rabbit', ms: 8200, say: 'Thương là 2,4. Thử lại: 2,4 × 6 = 14,4.', board: board(D1, { mode: 'show', phase: 3, divisionStage: 3 }) },
        { who: 'bear', ms: 10000, say: 'Ở đây ta viết đầy đủ tích dưới số bị chia rồi trừ cho dễ theo dõi. Trong sách có thể chỉ ghi số dư (nhân, trừ nhẩm); hai cách đều ra cùng một thương.', board: board(D1, { mode: 'show', phase: 3, divisionStage: 3 }) },
        { who: 'rabbit', ms: 12000, say: 'Ví dụ 2,08 : 8. Phần nguyên 2 bé hơn 8: 2 chia 8 được 0, viết 0, rồi viết dấu phẩy vào thương. Hạ 0 được 20; 20 chia 8 được 2, dư 4. Hạ 8 được 48; 48 chia 8 được 6. Thương là 0,26.', board: board(D1B, { mode: 'show' }) },
        { who: 'bear', ms: 12000, say: 'Ví dụ 4,04 : 4. 4 chia 4 được 1, viết 1, rồi viết dấu phẩy. Hạ 0 được 0; 0 chia 4 được 0, viết 0 vào thương. Hạ 4; 4 chia 4 được 1. Thương là 1,01, nhớ viết chữ số 0 ở giữa.', board: board(D1C, { mode: 'show' }) },
        { who: 'rabbit', ms: 8000, say: 'Khi làm bài, em điền chữ số của thương ở bên phải vạch dọc và tự đặt dấu phẩy.', board: board(D1, { mode: 'show', phase: 3, divisionStage: 3 }) }
      ]
    },
    div2: {
      title: 'Số tự nhiên chia cho số thập phân',
      steps: [
        { who: 'rabbit', ms: 8800, say: 'Số tự nhiên chia cho số thập phân: trước hết làm cho số chia thành số tự nhiên.', board: '<p class="expr">18 : 0,6</p>' },
        { who: 'bear', ms: 11000, say: 'Số chia 0,6 có 1 chữ số ở phần thập phân, nên viết thêm 1 chữ số 0 vào bên phải số bị chia: 18 thành 180; bỏ dấu phẩy ở số chia: 0,6 thành 6.', board: board(D2, { mode: 'show', phase: 0 }) },
        { who: 'rabbit', ms: 8800, say: 'Như vậy là đã nhân cả số bị chia và số chia với 10. Đặt phép chia viết 180 : 6, thương viết dưới số chia.', board: board(D2, { mode: 'show', phase: 0 }) },
        { who: 'bear', ms: 10000, say: 'Ta chia 180 cho 6: 18 chục chia 6 được 3 chục, viết 3 vào thương. 3 nhân 6 bằng 18; 18 trừ 18 bằng 0.', board: board(D2, { mode: 'show', phase: 1, divisionStage: 1 }) },
        { who: 'rabbit', ms: 9000, say: 'Hạ 0 đơn vị được 0; 0 chia 6 được 0, viết 0 vào thương. Vậy thương là 30.', board: board(D2, { mode: 'show', phase: 3, divisionStage: 3 }) },
        { who: 'bear', ms: 9000, say: 'Khi nhân cả số bị chia và số chia với 10 thì thương không đổi, nên 18 : 0,6 = 180 : 6 = 30.', board: board(D2, { mode: 'show', phase: 3, divisionStage: 3 }) }
      ]
    },
    div3: {
      title: 'Số thập phân chia cho số thập phân',
      steps: [
        { who: 'rabbit', ms: 9500, say: 'Số thập phân chia cho số thập phân: cũng làm cho số chia thành số tự nhiên, bằng cách nhân cả số bị chia và số chia với cùng một số (10; 100; …).', board: '<p class="expr">3,25 : 1,3</p>' },
        { who: 'bear', ms: 10500, say: 'Phần thập phân của số chia 1,3 có 1 chữ số, nên chuyển dấu phẩy của số bị chia 3,25 sang bên phải 1 chữ số được 32,5; bỏ dấu phẩy ở số chia được 13.', board: board(D3, { mode: 'show', phase: 0 }) },
        { who: 'rabbit', ms: 9600, say: 'Đặt phép chia viết 32,5 : 13. 32 chia 13 được 2, viết 2 vào thương, dưới số 13. 2 nhân 13 bằng 26.', board: board(D3, { mode: 'show', phase: 1, divisionStage: 1 }) },
        { who: 'bear', ms: 9500, say: '32 trừ 26 bằng 6. Đã hết phần nguyên của số bị chia, nên viết dấu phẩy vào bên phải số 2 ở thương, rồi hạ 5 được 65.', board: board(D3, { mode: 'show', phase: 2, divisionStage: 2 }) },
        { who: 'rabbit', ms: 8000, say: '65 chia 13 được 5, viết 5. 5 nhân 13 bằng 65; 65 trừ 65 bằng 0.', board: board(D3, { mode: 'show', phase: 3, divisionStage: 3 }) },
        { who: 'bear', ms: 8200, say: '32,5 : 13 = 2,5. Vậy 3,25 : 1,3 = 2,5.', board: board(D3, { mode: 'show', phase: 3, divisionStage: 3 }) },
        { who: 'rabbit', ms: 10000, say: 'Khi làm bài: số chia có 1 chữ số ở phần thập phân thì nhân cả hai số với 10, có 2 chữ số thì nhân với 100. Em điền thương ở bên phải vạch dọc và tự đặt dấu phẩy.', board: board(D3, { mode: 'show', phase: 3, divisionStage: 3 }) }
      ]
    },
    div4: {
      title: 'Chia cho 10; 100; 1 000',
      steps: [
        { who: 'rabbit', ms: 9500, say: 'Chia một số thập phân cho 10; 100; 1 000: chuyển dấu phẩy sang bên trái một, hai, ba chữ số (theo số chữ số 0 của số chia).', board: '<p class="expr">45,6 : 100</p>' },
        { who: 'bear', ms: 8800, say: '100 có 2 chữ số 0, nên ta chuyển dấu phẩy của 45,6 sang bên trái 2 chữ số.', board: board(D4, { mode: 'show', phase: 0 }) },
        { who: 'rabbit', ms: 8000, say: 'Chuyển 1 chữ số: 45,6 thành 4,56.', board: board(D4, { mode: 'show', phase: 1 }) },
        { who: 'bear', ms: 9500, say: 'Chuyển tiếp 1 chữ số nữa: 4,56 thành 0,456 (phần nguyên không còn chữ số nào nên viết 0).', board: board(D4, { mode: 'show', phase: 2 }) },
        { who: 'rabbit', ms: 8800, say: 'Với số có ít chữ số hơn, ta cũng chuyển đủ 2 chữ số và viết thêm chữ số 0. Xét 4,5 : 100.', board: board(D4B, { mode: 'show', phase: 1 }) },
        { who: 'bear', ms: 9000, say: '4,5 : 100 = 0,045. Không đủ chữ số nên viết thêm chữ số 0 ở phần nguyên và ở phần thập phân.', board: board(D4B, { mode: 'show', phase: 3 }) },
        { who: 'rabbit', ms: 11000, say: 'Số tự nhiên coi như có dấu phẩy ở bên phải hàng đơn vị: 45 = 45,0. Chia cho 1 000, chuyển dấu phẩy sang bên trái 3 chữ số: 45 : 1 000 = 0,045.', board: board(D4C, { mode: 'show' }) },
        { who: 'bear', ms: 8000, say: 'Khi làm bài, em tự đặt dấu phẩy vào ô nét đứt sau khi đã chuyển dấu phẩy.', board: board(D4, { mode: 'show', phase: 3 }) }
      ]
    },
    div5: {
      title: 'Số tự nhiên chia cho số tự nhiên, thương là số thập phân',
      steps: [
        { who: 'rabbit', ms: 10000, say: 'Khi chia số tự nhiên cho số tự nhiên mà còn dư, ta viết dấu phẩy vào bên phải thương, viết thêm chữ số 0 vào bên phải số dư rồi chia tiếp.', board: '<p class="expr">6 : 25</p>' },
        { who: 'bear', ms: 8500, say: 'Đặt phép chia viết. Số bị chia 6 ở bên trái vạch dọc. Số chia 25 ở bên phải. Kẻ một vạch ngang dưới số chia.', board: board(D5, { mode: 'show', phase: 0 }) },
        { who: 'rabbit', ms: 8500, say: '6 chia 25 được 0, viết 0 vào thương, dư 6.', board: board(D5, { mode: 'show', phase: 1 }) },
        { who: 'bear', ms: 10000, say: 'Còn dư 6, nên viết dấu phẩy vào bên phải số 0 ở thương, viết thêm chữ số 0 vào bên phải số dư, được 60.', board: board(D5, { mode: 'show', phase: 2 }) },
        { who: 'rabbit', ms: 10500, say: '60 chia 25 được 2, viết 2 vào thương. 2 nhân 25 bằng 50; 60 trừ 50 bằng 10.', board: board(D5, { mode: 'show', phase: 3 }) },
        { who: 'bear', ms: 9000, say: 'Còn dư 10, ta viết thêm chữ số 0 vào bên phải số dư, được 100 rồi chia tiếp.', board: board(D5, { mode: 'show', phase: 4 }) },
        { who: 'rabbit', ms: 10500, say: '100 chia 25 được 4, viết 4 vào thương. 4 nhân 25 bằng 100; 100 trừ 100 bằng 0.', board: board(D5, { mode: 'show', phase: 5 }) },
        { who: 'bear', ms: 8500, say: 'Vậy 6 : 25 = 0,24. Khi làm bài, em viết thương ở bên phải và tự đặt dấu phẩy.', board: board(D5, { mode: 'show', phase: 5 }) }
      ]
    }
  };

  function mount(container, clipId, onPractice) {
    var clip = CLIPS[clipId];
    if (!clip) throw new Error('missing clip ' + clipId);
    container.innerHTML =
      '<div class="cast">' +
        '<img class="who rabbit" src="assets/tho-bong.png" alt="Thỏ Bông">' +
        '<div class="speech" aria-live="polite"></div>' +
        '<img class="who bear" src="assets/gau-bin.png" alt="Gấu Bin">' +
      '</div>' +
      '<div class="board"><div class="board-body"></div></div>' +
      '<div class="step-label"></div>' +
      '<div class="clip-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Tiến độ hoạt cảnh"><div></div></div>' +
      '<div class="row center clip-controls">' +
        '<button type="button" class="btn blue" data-act="toggle" aria-pressed="true">Tạm dừng</button>' +
        '<button type="button" class="btn gray" data-act="fast" aria-pressed="false">Tua nhanh</button>' +
        '<button type="button" class="btn gray" data-act="replay">Xem lại</button>' +
        '<button type="button" class="btn green" data-act="go" hidden>Làm bài tập</button>' +
      '</div>';

    var speech = container.querySelector('.speech');
    var boardEl = container.querySelector('.board-body');
    var bar = container.querySelector('.clip-bar > div');
    var barWrap = container.querySelector('.clip-bar');
    var label = container.querySelector('.step-label');
    var toggle = container.querySelector('[data-act="toggle"]');
    var rabbit = container.querySelector('.who.rabbit');
    var bear = container.querySelector('.who.bear');
    var go = container.querySelector('.clip-controls [data-act="go"]');
    var fastBtn = container.querySelector('[data-act="fast"]');
    var step = 0;
    var playing = true;
    var speed = 1;
    var stepStart = 0;
    var pausedAt = 0;
    var timer = null;

    function clearTimer() {
      if (timer) { clearTimeout(timer); timer = null; }
    }

    function stepMs(ms) {
      return Math.max(350, Math.round(ms / speed));
    }

    function applyPace() {
      var pace = (0.95 / speed) + 's';
      container.querySelectorAll('.vsheet-wrap').forEach(function (el) {
        el.style.setProperty('--pace', pace);
      });
    }

    function arm() {
      clearTimer();
      if (!playing || step >= clip.steps.length - 1) return;
      var total = stepMs(clip.steps[step].ms);
      var left = total - (Date.now() - stepStart);
      if (left < 80) left = 80;
      var to = ((step + 1) / clip.steps.length) * 100;
      bar.style.transition = 'width ' + left + 'ms linear';
      bar.style.width = to + '%';
      barWrap.setAttribute('aria-valuenow', String(Math.round(to)));
      timer = setTimeout(function () { render(step + 1); }, left);
    }

    function render(i) {
      step = i;
      var s = clip.steps[i];
      stepStart = Date.now();
      speech.textContent = s.say;
      speech.className = 'speech from-' + s.who;
      boardEl.innerHTML = s.board;
      applyPace();
      rabbit.classList.toggle('talk', s.who === 'rabbit');
      rabbit.classList.toggle('quiet', s.who !== 'rabbit');
      bear.classList.toggle('talk', s.who === 'bear');
      bear.classList.toggle('quiet', s.who !== 'bear');
      label.textContent = 'Bước ' + (i + 1) + ' / ' + clip.steps.length;
      var from = (i / clip.steps.length) * 100;
      bar.style.transition = 'none';
      bar.style.width = from + '%';
      barWrap.setAttribute('aria-valuenow', String(Math.round(from)));
      go.hidden = i !== clip.steps.length - 1;
      if (playing) requestAnimationFrame(arm);
      else clearTimer();
    }

    container.onclick = function (ev) {
      var btn = ev.target.closest('[data-act]');
      if (!btn || !container.contains(btn)) return;
      var act = btn.getAttribute('data-act');
      if (act === 'go') { onPractice(); return; }
      if (act === 'replay') {
        playing = true;
        toggle.textContent = 'Tạm dừng';
        toggle.setAttribute('aria-pressed', 'true');
        render(0);
        return;
      }
      if (act === 'fast') {
        speed = speed === 1 ? 2 : speed === 2 ? 4 : 1;
        fastBtn.textContent = speed === 1 ? 'Tua nhanh' : ('Tua ' + speed + '×');
        fastBtn.setAttribute('aria-pressed', speed === 1 ? 'false' : 'true');
        applyPace();
        if (playing) arm();
        return;
      }
      if (act === 'toggle') {
        playing = !playing;
        toggle.textContent = playing ? 'Tạm dừng' : 'Phát';
        toggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
        if (!playing) { pausedAt = Date.now(); clearTimer(); return; }
        if (pausedAt) { stepStart += Date.now() - pausedAt; pausedAt = 0; }
        arm();
      }
    };

    render(0);
    return {
      destroy: function () { clearTimer(); container.onclick = null; container.innerHTML = ''; },
      title: clip.title
    };
  }

  root.Clips = { mount: mount, CLIPS: CLIPS };
})(window);
