let _$_c_0_r_E_ = 0;
let submitted_score = 0;
let dev_mode = false;
let endpoint = (dev_mode ? '../../avarun/docs' : '..') + '/apis/nut.php';
let ranks = Array(10).fill({code: 'AVA', plays: 0, score: 0});

// render
function update_score() {
  $('.score').html('SCORE:' + _$_c_0_r_E_);
}
function open_mouth() {
  let src = './assets/AVA_Stage1.jpeg'
  if (_$_c_0_r_E_ >= 500)
    src = './assets/AVA_Stage3_500Pointup.jpeg';
  else if (_$_c_0_r_E_ >= 100)
    src = './assets/AVA_Stage2_100Pointup.jpeg';
  $('.ava').attr('src', src);
}
function close_mouth() {
  $('.ava').attr('src', './assets/AVA_Stage0_Normal.jpeg');
}

// sound effect
function play_effect() {
  let audio = new Audio('https://avawalk.github.io/avanut/assets/crack_co2.wav');
  audio.addEventListener('ended', () => {
    audio.src = '';
  });
  audio.play();
}

// ava events
$('.ava').on('pointerdown', _ => {
  _$_c_0_r_E_++;
  update_score();
  open_mouth();
  play_effect();
  if (first_time_autoplay) {
    console.log('first time autoplay music');
    play_new_song(true, start_effect);
  }
});
$('.ava').on('pointerup', _ => {
  close_mouth();
});

// leaderboard
function render_board_head() {
  let html = ranks.slice(0, 3).map((r, i) => `<div class='col d-none d-md-block'>#${i+1} <span class="fi fi-${r.code.toLowerCase()}"></span> ${r.score}</div>`).join('');
  $('.board .head').html(`
  <div class='col-1 trophy text-center'><img src='./assets/trophy.png'></div>
  ${html}
  <div class='col d-block d-md-none text-center'>Leaderboard</div>
  <div class='col-1 up-arrow text-center'><i class="bi bi-chevron-up"></i></div>
  `);
}
function move_board(bottom, speed=500, callback) {
  $('.board').animate({ bottom: bottom + 'px' }, speed);
}
function collapse_board() {
  let gap = $('.board .head .col').eq(0).height();
  let bottom = '-' + ($('.board').height()-gap);
  move_board(bottom, _ => {
    render_board_head();
  });
}
function expand_board() {
  move_board(0, _ => {
    $('.board .head').html(`
    <div class='col-1 trophy text-center'><img src='./assets/trophy.png'></div>
    <div class='col text-center'>Leaderboard</div>
    <div class='col-1 up-arrow text-center'><i class="bi bi-chevron-down"></i></div>
    `);
  });
}
function toggle_board() {
  let expanded = $('.board').css('bottom') === '0px';
  if (expanded)
    collapse_board();
  else
    expand_board();
}
$('body').on('click', '.board', toggle_board);

// apis
function submit_score_daemon(min=20, start=30, range=30) {
  let random_interval = start + Math.floor(Math.random() * range+1);
  setTimeout(_ => {
    let new_score = _$_c_0_r_E_ - submitted_score;
    if (new_score > min) {
      let code = localStorage.getItem('AVA_FLAG') || 'AVA';
      let score = new_score;
      let secret = 'DONTHACKMENABRO';
      console.log(`add ${score} scores for ${code}`);
      $.post(endpoint,
        { code: code, score: score, secret: secret },
        resp => { if (resp.success) submitted_score = _$_c_0_r_E_; }
      );
    }
    submit_score_daemon();
  }, random_interval * 1_000);
}
function load_scoreboard(callback) {
  $.getJSON(endpoint, resp => {
    // update data
    let rows = resp.data || [];
    rows.forEach((r, i) => ranks[i] = r);
    // render scoreboard
    $('.board').html(`<div class='head row'></div>`);
    ranks.forEach((r, i) => {
      // TODO add world row + show click per sec
      // TODO ava flag
      // TODO gold, silver, bronze class
      let country = r.code; // TODO resolve country name
      let flag = 'fi-' + r.code.toLowerCase();
      let zcore = r.score; // TODO format number
      $('.board').append(`
      <div class='row'>
        <div class='col-1 text-center'>${i+1}</div>
        <div class='col'><span class="fi ${flag}"></span> ${country}</div>
        <div class='col-sm text-end'>${zcore}</div>
      </div>
      `);
    });
    callback();
  });
}

// main
update_score();
load_scoreboard(_ => {
  render_board_head();
  submit_score_daemon();
});
