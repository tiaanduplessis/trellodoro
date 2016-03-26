
var trellodoroLogo =  (window.location.href.indexOf("trello.com") > -1) ? chrome.extension.getURL('trellodoro-logo.png') : 'trellodoro-logo.png';
var trellodoroAudio =  new Audio((window.location.href.indexOf("trello.com") > -1) ? chrome.extension.getURL('beep.mp3') : 'beep.mp3');
var isPaused = true;
var timerId;
var trellodoroSettings = {};

// Get values from settings
chrome.storage.sync.get({
    pomodoroTime: 25,
    alert: true,
    notification: true,
    notificationTitle: 'Next!',
    notificationMessage: 'You rocked another pomodoro! Ready for next one?'
  }, function(items) {
    trellodoroSettings = {
      pomodoroTime: items.pomodoroTime,
      alert: items.alert,
      notification: items.notification,
      notificationTitle: items.notificationTitle,
      notificationMessage: items.notificationMessage
    }
  });

function trellodoroNotify() {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var trellodoroAlert = new Notification(trellodoroSettings.notificationTitle, {
      icon: trellodoroLogo,
      body: trellodoroSettings.notificationMessage,
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
        clearInterval(timerId);
        if (trellodoroSettings.notification) {
          trellodoroNotify();
        }
        if (trellodoroSettings.alert) {
          trellodoroAudio.play();
        }
        $("#trellodoro-counter").html(" 00:00 ");
      } else {
         $("#trellodoro-counter").html(min + ":" + sec);
      }
    }
  }, 1000);
}

$(function() {
  // Request permission to use Chrome Notification Messages
  document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
      Notification.requestPermission();
  });

  $('#header .header-user').before('<div id="trellodoro-container"><div id="trellodoro-start"><img src="'+ trellodoroLogo +'" alt="Trellodoro"></div><div id="trellodoro-counter">'+ trellodoroSettings.pomodoroTime +':00</div><div id="trellodoro-play">&#9654;</div><div id="trellodoro-pause">&#10074;&#10074;</div></div>');

  $('#trellodoro-start').click(function() {
    isPaused = false;
    trellodoro(trellodoroSettings.pomodoroTime);
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