var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.chatGet = function (req, res) {
  Chat
    .find()
    .exec(function(err, chat) {
      if (!chat) {
        sendJSONresponse(res, 404, {
          "message": "chat not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      sendJSONresponse(res, 200, chat);
    });
};

module.exports.chatPost = function (req, res) {
  Chat
    .create({
      chat: req.body.chat,
      name: req.body.name
    }, function(err, chat) {
      if (err) {
        console.log(err);
       sendJSONresponse(res, 400, err);
     } else {
       console.log(chat);
       sendJSONresponse(res, 201, chat);
      }
  });
};