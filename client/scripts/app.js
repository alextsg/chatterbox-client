var app = {};
app.roomName = '';
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function () {
  this.fetch();
};

app.userName = function () {
  return window.location.search.split('=')[1];
};

app.send = function (message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    dataType: 'json',
    success: function (data) {
      app.message(message);
    },
    error: function (data) {
      console.error('chatterbox: Failed to add message');
    }
  });

  app.addMessage(message);

  $('#usermessage').val('');
};

app.fetch = function () {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: { order: '-createdAt' },
    success: function (data) {
      $('.message').remove();
      var messages = data.results;
      for (var i = 0; i < messages.length; i++) {
        if (app.roomName === '' || ('' + messages[i].roomname) === app.roomName) {
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
  var $usr = $('<span>').addClass('user').text(message.username + ': ');
  var $msg = $('<span>').addClass('msg').text(message.text);
  var $rm  = $('<span>').addClass('room').text('(' + message.roomname + ') ');

  $div.append($rm, $usr, $msg);
  $('#chats').append($div);
};

app.clearMessages = function () {
  $('#chats').html("");
};

app.addMessage = function (messages) {
  for (var i = 0; i < messages.length; i++) {
    if (app.roomName === '' || ('' + messages[i].roomname) === app.roomName) {
      app.message(messages[i]);
    }
  }
};

app.addRoom = function () {

};

app.addFriend = function () {

};

app.init();
setInterval(app.fetch, 3000);

$(document).ready(function(){
  $('#submit').on('click', function () {
    var message = {
      username: app.userName(),
      text: $('#usermessage').val(),
      roomname: $('#roomname').val()
    };

    app.send(message);
  });
  $('#usermessage').on('keydown', function (e) {
    if (e.keyCode === 13) app.send();
  });

  $('body').on('click', ".room", function(){
    var temp = '' + ($(this).text());
    app.roomName = '' + temp.slice(1,temp.length-2);
    console.log(typeof app.roomName);
    app.fetch();
  });
  $('#room-clear').on('click', function(){
    app.roomName = '';
    app.fetch();
  });

});
