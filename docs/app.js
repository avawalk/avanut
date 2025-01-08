let _$_c_0_r_E_ = 0;
let submitted_score = 0;
let dev_mode = location.hostname == 'localhost';
let endpoint = (dev_mode ? '../../avarun/docs' : '..') + '/apis/nut.php';
let ranks = Array(10).fill({code: 'AVA', plays: 0, score: 0});
let save_flag = localStorage.getItem('AVA_FLAG') || 'AVA';

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
function resolve_flag(code) {
  return (code == 'AVA') ? '🐯' : `<span class="fi fi-${code.toLowerCase()}"></span>`;
}
function render_board_head() {
  let top3 = ranks.slice(0, 3).map((r, i) => {
    let flag = resolve_flag(r.code);
    let zcore = r.score;
    if (zcore > 1_000_000_000)
      zcore = (zcore / 1_000_000_000).toFixed(1) + 'B'
    else if (zcore > 1_000_000)
      zcore = (zcore / 1_000_000).toFixed(1) + 'M'
    else if (zcore > 1_000)
      zcore = (zcore / 1_000).toFixed(1) + 'K'
    zcore = zcore.toString().replace('.0', ''); // clean up
    return `<div class='col d-none d-md-block'>#${i+1} ${flag} ${zcore}</div>`
  }).join('');
  $('.board .head').html(`
  <div class='col-1 trophy text-center'><img src='./assets/trophy.png'></div>
  ${top3}
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
  let html = COUNTRIES.map(r => {
    let [ title, code, flag ] = r;
    let sel = code == save_flag ? 'selected' : '';
    return `<option value='${code}' ${sel}>${title} ${flag}</option>`;
  }).join('');
  move_board(0, _ => {
    $('.board .head').html(`
    <div class='col-1 trophy text-center'><img src='./assets/trophy.png'></div>
    <div class='col'><select class='w-100' id='country'>${html}</select></div>
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
$('body').on('click', '#country', evt => { evt.stopPropagation(); });
$('body').on('change', '#country', evt => { localStorage.setItem('AVA_FLAG', evt.target.value); });

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
    $('.board').html(`
      <div class='head row'></div>
      <div class='world row'></div>
    `);
    ranks.forEach((r, i) => {
      let [ country, _, __ ] = COUNTRIES.find(c => c[1] == r.code);
      let flag = resolve_flag(r.code);
      let zcore = r.score.toLocaleString('en-US');
      $('.board').append(`
      <div class='row no${i+1}'>
        <div class='col-1 text-center'>${i+1}</div>
        <div class='col'>${flag} ${country}</div>
        <div class='col-sm text-end'>${zcore}</div>
      </div>
      `);
    });
    // add world row + show click per sec
    $.getJSON(endpoint + '?q=sum', resp2 => {
      let info = resp2.data || {};
      let life_in_sec = +(info.life_in_seconds || 0);
      let sum_clicks = +(info.sum_score || 0);
      let cps = (life_in_sec > 0) ? sum_clicks / life_in_sec : 0;
      let cps_html = '';
      if (cps > 0.1) cps_html = ` <span class='text-success'>${cps.toFixed(1)} CPS</span>`;
      console.log('CPS:', cps);
      $('.world.row').html(`
        <div class='col-1 text-center'>🌎</div>
        <div class='col'>Worldwide${cps_html}</div>
        <div class='col-sm text-end'>${sum_clicks.toLocaleString('en-US')}</div>
      `);
    });
    // render finish callback
    callback();
  });
}

// main
update_score();
load_scoreboard(_ => {
  render_board_head();
  submit_score_daemon();
});
