let _$_c_0_r_E_ = 0;

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

// main
update_score();
render_board_head();
