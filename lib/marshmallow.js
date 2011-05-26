var Campfire = require('../vendor/campfire/lib/campfire').Campfire;

var marshmallow = function(config, definition) {
  var messages = {};
  var botAccountCache;
  definition({
    cmd: function(command, callback) {
      var re = '!' + command;
      // Expect there to be one arg for speaker.
      for(var i = 1; i < callback.length; i++) {
        re += '\\s+(\\S+)';
      }
      messages[re] = function(match, speaker) {
        var args = [speaker].concat(match);
        callback.apply(this, args);
      };
    },
    on: function(re, callback) {
      messages[re] = callback;
    },
    tricks: function() {
      return messages;
    }
  })
  
  var campfireInstance = new Campfire(config);
  
  campfireInstance.room(config.room_id, function(room) {
    room.join(function() {
      room.listen(function(message) {
        if (message.type != "TextMessage"){
          return;
        }
        
        var match;
        for (re in messages) {
          if (re == 'catchAll') { 
            continue; 
          } else if (match = message.body.match(re)) {

            match.shift();
            
            campfireInstance.user(message.user_id, function(speaker) {
              messages[re].call(room, match, speaker.user);
            });

            return;
          }
        }
        if (messages['catchAll']) {
          campfireInstance.user(message.user_id, function(speaker) {
            messages['catchAll'].call(room, message, speaker.user);
          });
        }
      })
    });
  });
  
}

exports.marshmallow = marshmallow;
