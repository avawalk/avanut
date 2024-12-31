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
    play_new_song();
    start_effect();
  }
});
$('.ava').on('pointerup', _ => {
  close_mouth();
});

// main
update_score();
