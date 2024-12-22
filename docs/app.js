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

// ava events
$('.ava').on('pointerdown', _ => {
  _$_c_0_r_E_++;
  update_score();
  open_mouth();
});
$('.ava').on('pointerup', _ => {
  close_mouth();
});

// main
update_score();