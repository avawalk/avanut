let _$_c_0_r_E_ = 0;
let submitted_score = 0;

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
  $('.board .head').html(`
  <div class='col-1 trophy text-center'><img src='./assets/trophy.png'></div>
  <div class='col d-none d-md-block'>#1 <span class="fi fi-th"></span> 124.2B</div>
  <div class='col d-none d-md-block'>#2 <span class="fi fi-hk"></span> 124.2B</div>
  <div class='col d-none d-md-block'>#3 <span class="fi fi-tw"></span> 124.2B</div>
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

// submit bot
//let endpoint = '../../avarun/docs/apis/nut.php';
//function submit_score_daemon(min=0, start=0, range=5) {
let endpoint = '../apis/nut.php';
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

// main
update_score();
render_board_head();
submit_score_daemon();
