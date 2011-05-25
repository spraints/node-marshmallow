(function() {
  var fs, marshmallow, users_out, yaml;
  marshmallow = require("./lib/marshmallow").marshmallow;
  fs = require('fs');
  yaml = require('yaml');
  users_out = {};
  fs.readFile('config.yml', "utf8", function(e, data) {
    var config;
    if (e) {
      throw e;
    }
    try {
      config = yaml.eval(data).campfire;
      console.log("Crankybot is alive with the following settings:");
      console.log(config);
      return marshmallow(config, function(bot) {
        bot.on('^!blame (.*)', function(blamee, speaker) {
          return this.speak("It's all " + blamee + "'s fault");
        });
        bot.on('^!out (.*)', function(reason, speaker) {
          this.speak("Have fun, " + speaker.name);
          return users_out[speaker.id] = reason;
        });
        bot.on('^!pt (.+)', function(story_id, speaker) {
          return this.speak("https://www.pivotaltracker.com/story/show/" + story_id);
        });
        bot.on('^!hello', function(command, speaker) {
          return this.speak("Hello there, " + speaker.name);
        });
        bot.on('^!ping', function(command, speaker) {
          return this.speak('Pong!');
        });
        bot.on('^!tricks', function(command, speaker) {
          var trick, tricks;
          tricks = (function() {
            var _results;
            _results = [];
            for (trick in bot.tricks()) {
              if (trick !== 'catchAll') {
                _results.push(trick.replace(/\^/, '').split(' ')[0]);
              }
            }
            return _results;
          })();
          return this.speak("I know the following tricks: " + (tricks.join(', ')));
        });
        return bot.on('catchAll', function(rawMessage, speaker) {
          if (users_out[speaker.id]) {
            this.speak("" + speaker.name + " is back from: " + users_out[speaker.id]);
            return users_out[speaker.id] = null;
          }
        });
      });
    } catch (e) {
      console.log("Failed to load " + config);
      throw e;
    }
  });
}).call(this);
