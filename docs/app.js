let ava_stages = [
  './assets/AVA_Stage0_Normal.jpeg',
  './assets/AVA_Stage1.jpeg',
  './assets/AVA_Stage2_100Pointup.jpeg',
  './assets/AVA_Stage3_500Pointup.jpeg',
];
let _$_c_0_r_E_ = 0;

function render_score() {
  $('.score').html('SCORE:' + _$_c_0_r_E_);
}
function render_ava() {
  let src = './assets/AVA_Stage0_Normal.jpeg'; // close mouth
  if ((_$_c_0_r_E_ % 2) == 1) { // open mouth
    if (_$_c_0_r_E_ >= 500)
      src = './assets/AVA_Stage3_500Pointup.jpeg';
    else if (_$_c_0_r_E_ >= 100)
      src = './assets/AVA_Stage2_100Pointup.jpeg';
    else
      src = './assets/AVA_Stage1.jpeg';
  }
  $('.ava').attr('src', src);
}

// ava event
$('.ava').click(_ => {
  _$_c_0_r_E_++;
  render_score();
  render_ava();
});

// main
render_score();
