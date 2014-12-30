var app = {};

app.init = function () {
  this.fetch();
};

app.userName = function () {
  return window.location.search.split('=')[1];
};

app.send = function () {
  var message = {
    'username': app.userName(),
    'text': $('#textbox').val(),
    'roomname': '4chan'
  };

  app.addMessage(message);
  $('#textbox').val('');
};

app.fetch = function () {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
    success: function (data) {
      $('.message').remove();
      var messages = data.results;
      for (var i = 0; i < messages.length; i++) {
        var complied = _.template("<div class=message><%- username %>: <%- text %></div>");
        $('#messages').append(complied({
          username: messages[i].username, text: messages[i].text
        }));
      }
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
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
  })
};

app.addRoom = function () {

};

app.addFriend = function () {

};

app.init();
setInterval(app.fetch, 10000);

$(document).ready(function(){
  $('#submit').on('click', app.send);
  $('#textbox').on('keydown', function (e) {
    if (e.keyCode === 13) app.send();
  })
});
