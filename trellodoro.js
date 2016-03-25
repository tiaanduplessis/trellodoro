
var trellodoroLogo =  (window.location.href.indexOf("trello.com") > -1) ? chrome.extension.getURL('trellodoro-logo.png') : 'trellodoro-logo.png';
var isPaused = true;
var timerId;
var trellodoroSettings = {
  time:25, // Pomodoro time
  title:"Próximo!", // Notification title
  message:"Você avassalou em mais um trellodoro! Pronto pro outro?", // Notification message
}

// Request permission to use Chrome Notification Messages
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function trellodoroNotify() {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var trellodoroAlert = new Notification(trellodoroSettings.title, {
      icon: trellodoroLogo,
      body: trellodoroSettings.message,
    });
  }
}

function trellodoro(timer) {
  var countdown = timer * 60 * 1000;
  clearInterval(timerId);
  $("#trellodoro-counter").hide().fadeIn('fast');
  timerId = setInterval(function(){
    if (!isPaused) {
      countdown -= 1000;
      var min = Math.floor(countdown / (60 * 1000));
      var sec = Math.floor((countdown - (min * 60 * 1000)) / 1000);

      if (countdown <= 0) {
        trellodoroNotify();
        clearInterval(timerId);
        $("#trellodoro-counter").html(" 00:00 ");
      } else {
         $("#trellodoro-counter").html(min + ":" + sec);
      }
    }
  }, 1000);
}

$(function() {
  $('#header .header-user').before('<div id="trellodoro-container"><div id="trellodoro-start"><img src="'+ trellodoroLogo +'" alt="Trellodoro"></div><div id="trellodoro-counter">25:00</div><div id="trellodoro-play">&#9654;</div><div id="trellodoro-pause">&#10074;&#10074;</div></div>');

  $('#trellodoro-start').click(function() {
    isPaused = false;
    trellodoro(trellodoroSettings.time);
    $('#trellodoro-container').addClass('trellodoroStarted');
  });

  $('#trellodoro-play').click(function() {
    isPaused = false;
    $(this).hide();
    $('#trellodoro-pause').show();
  });

  $('#trellodoro-pause').click(function() {
    isPaused = true;
    $(this).hide();
    $('#trellodoro-play').show();
  });
});