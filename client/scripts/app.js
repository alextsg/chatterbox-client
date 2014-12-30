var app = {};
app.roomName;

app.init = function () {
  this.fetch();
};

app.userName = function () {
  return window.location.search.split('=')[1];
};

app.send = function () {
  var message = {
    username: app.userName(),
    text: $('#usermessage').val(),
    roomname: $('#roomname').val()
  };

  app.addMessage(message);
  $('#usermessage').val('');
};

app.fetch = function () {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: { order: '-createdAt' },
    success: function (data) {
      $('.message').remove();
      var messages = data.results;
      for (var i = 0; i < messages.length; i++) {
        if (!app.roomName || messages[i].roomname === app.roomName) {
          app.message(messages[i]);
        }
      }
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.message = function (message) {
  var $div = $('<div>').addClass('message');
  var usr = $('<span>').addClass('user').text(message.username + ': ');
  var msg = $('<span>').addClass('msg').text(message.text);
  var rm = $('<span>').addClass('room').text('(' + message.roomname + ') ');

  $div.append(rm).append(usr).append(msg);
  $('#messages').append($div);

};

app.clearMessages = function () {

};

app.addMessage = function (message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    dataType: 'json',
    success: function (data) {
      console.log(message);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to add message');
    }
  });
};

app.addRoom = function () {
};

app.addFriend = function () {

};

app.init();
setInterval(app.fetch, 3000);

$(document).ready(function(){
  $('#submit').on('click', app.send);
  $('#usermessage').on('keydown', function (e) {
    if (e.keyCode === 13) app.send();
  });
  
  $('body').on('click', ".room", function(){
    var temp = ($(this).text());
    app.roomName = temp.slice(1,temp.length-2);
    console.log(app.roomName);
    app.fetch();
  });
  $('#room-clear').on('click', function(){
    app.roomName = '';
    app.fetch();
  });

});
