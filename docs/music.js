let playlist = {
  host: "https://avawalk.github.io/avanut/mp3/",
  edm: [
    "AVA_Edm_Mode01.mp3",
    "AVA_Edm_Mode02.mp3",
    "AVA_Edm_Mode03.mp3",
    "AVA_Edm_Mode04.mp3",
    "AVA_Edm_Mode05.mp3",
  ],
  fight: [
    "AVA_Fight_Mode01.mp3",
    "AVA_Fight_Mode02.mp3",
    "AVA_Fight_Mode03.mp3",
    "AVA_Fight_Mode04.mp3",
    "AVA_Fight_Mode05.mp3",
  ],
  snow: [
    "AVA_Snow_Mode01.mp3",
    "AVA_Snow_Mode02.mp3",
    "AVA_Snow_Mode03.mp3",
    "AVA_Snow_Mode04.mp3",
    "AVA_Snow_Mode05.mp3",
  ],
}

// audio
let aud = $('#ava_song')[0];
let song_mode = 'edm';
let song_idx = 0;
aud.addEventListener('play', _ => {
  first_time_autoplay = false;
});
aud.addEventListener('ended', _ => {
  song_idx++;
  if (song_idx >= playlist[song_mode].length) song_idx = 0;
  aud.src = get_song_path(song_mode, song_idx);
  aud.play();
  update_current_track();
});
function get_song_path(mode, idx) {
  return playlist.host + playlist[mode][idx];
}
function play_new_song(autoplay=true) {
  aud.src = get_song_path(song_mode, song_idx);
  aud.load();
  if (autoplay) {
    aud.play();
    update_music_icon();
  }
}

// play default song
play_new_song(false);
// NotAllowedError: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD

// effect
let effect_started = false;
function start_effect() {
  if (effect_started) return;
  effect_started = true;
  switch(song_mode) {
    case 'edm':
      startEDM();
      break;
    case 'fight':
      startFire();
      break;
    case 'snow':
      startSnowflakes();
      break;
  }
}
function stop_effect() {
  if (!effect_started) return;
  effect_started = false;
  switch(song_mode) {
    case 'edm':
      stopEDM();
      break;
    case 'fight':
      stopFire();
      break;
    case 'snow':
      stopSnowflakes();
      break;
  }
}

// panel
function update_music_icon() {
  let compact_img = 'musical-note';
  let idx = 1;
  if (aud.paused) {
    compact_img = 'mute';
    idx = 0;
  }
  $('.bgm.compact img').attr('src', `./assets/${compact_img}.png`);
  $('.sound div').css('background-color', '#ffffff');
  $('.sound div').eq(idx).css('background-color', '#ffcc3391');
}
function update_current_track() {
  $('.track span').removeClass('active');
  $('.track span').eq(song_idx).addClass('active');
}
function click_outside_panel(evt) {
  console.log('check click outside panel..');
  if (!$(evt.target).closest('.bgm.panel').length) {
    $('.bgm.compact').removeClass('d-none');
    $('.bgm.panel').addClass('d-none');
    $('.container-fluid').off('click', click_outside_panel);
  }
}
$('.bgm.compact').click(evt => {
  update_music_icon();
  $('.bgm.compact').addClass('d-none');
  $('.bgm.panel').removeClass('d-none');
  $('.container-fluid').on('click', click_outside_panel);
});
$('.sound div').eq(0).click(_ => {
  if (aud.paused) return;
  aud.pause();
  update_music_icon();
  stop_effect();
});
$('.sound div').eq(1).click(_ => {
  if (!aud.paused) return;
  aud.play();
  update_music_icon();
  start_effect();
});
$('.mode div').click(_ => {
  let $thz = $(_.target);
  let new_mode = $thz.text().toLowerCase();
  if (new_mode == song_mode) return;
  // stop old effect
  stop_effect();
  // set first song of that mode
  song_mode = new_mode;
  song_idx = 0;
  // active new mode
  $('.bgm.compact div').html(new_mode.toUpperCase());
  $('.mode div').removeClass('active');
  $thz.addClass('active');
  // active first track
  update_current_track();
  // play song
  play_new_song();
  // start new effect
  start_effect();
});
$('.track span').click(_ => {
  let $thz = $(_.target);
  let new_track = +$thz.text().toLowerCase();
  if (new_track == song_idx + 1) return;
  // set new track
  song_idx = new_track - 1;
  // active first track
  update_current_track();
  // play song
  play_new_song();
  // start effect (if need)
  start_effect();
});
