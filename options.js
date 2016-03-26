// Saves options to chrome.storage
function save_options() {
  var pomodoroTime = document.getElementById('pomodoroTime').value;
  var alert = document.getElementById('alert').checked;
  var notification = document.getElementById('notification').checked;
  var notificationTitle = document.getElementById('notificationMessage').value;
  var notificationMessage = document.getElementById('notificationTitle').value;

  chrome.storage.sync.set({
    pomodoroTime: pomodoroTime,
    alert: alert,
    notification: notification,
    notificationTitle: notificationTitle,
    notificationMessage: notificationMessage
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Settings saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    pomodoroTime: 25,
    alert: true,
    notification: true,
    notificationTitle: 'Next!',
    notificationMessage: 'You rocked another pomodoro! Ready for next one?'
  }, function(items) {
    document.getElementById('pomodoroTime').value = items.pomodoroTime;
    document.getElementById('alert').checked = items.alert;
    document.getElementById('notification').checked = items.notification;
    document.getElementById('notification').checked = items.notification;
    if (items.notification){
      document.getElementById( 'hide' ).style.display = 'block';
    }
    document.getElementById('notificationTitle').value = items.notificationTitle;
    document.getElementById('notificationMessage').value = items.notificationMessage;
  });
}

function showNotification() {
  if(document.getElementById('notification').checked) {
      document.getElementById( 'hide' ).style.display = 'block';
  } else {
      document.getElementById( 'hide' ).style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('notification').addEventListener('click',showNotification);
document.getElementById('save').addEventListener('click',save_options);