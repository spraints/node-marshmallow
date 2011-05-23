var marshmallow = require("./lib/marshmallow").marshmallow;
var Fs = require("fs");
var YAML = require("yaml");

// var config = {
//   token:   process.env["CAMPFIRE_TOKEN"],
//   account: process.env["CAMPFIRE_ACCOUNT"],
//   ssl:     process.env["CAMPFIRE_SSL"] == "true",
//   room_id: process.env["CAMPFIRE_ROOM"]
// };

var users_out = { };

Fs.readFile('config.yml', "utf8", function(err, data) {
  if (err) throw err
  try {
    this.config = YAML.eval(data).campfire;
    
    console.log(this.config);
    
    marshmallow(config, function(bot) {
      bot.on("^!out (.*)", function(reason, speaker) {
        this.speak("Have fun, " + speaker.name);
        users_out[speaker.id] = reason;
      });
      
      bot.on("^!hello", function(hello, speaker) {
        this.speak("Hello there, " + speaker.name);
      });
      
      // PT story link
      bot.on("^!pt (.+)", function(story_id, speaker) {
        this.speak("https://www.pivotaltracker.com/story/show/" + story_id);
      });      
      
      // Basic ping function
      bot.on("^!ping", function(ping, speaker) {
        this.speak("pong!");
      });
      
      // Spit out what tricks this doggy knows
      bot.on("^!tricks", function(command, speaker) {
        var tricks = [ ];
        for(trick in bot.tricks()) {
          if (trick != 'catchAll') { tricks.push(trick.replace(/\^/, '').split(' ')[0]); }
        }
        this.speak("I know the following tricks: " + tricks.join(', '));
      });

      bot.on('catchAll', function(rawMessage, speaker) {
        if (users_out[speaker.id] != null) {
          this.speak(speaker.name + " is back from: " + users_out[speaker.id]);
          users_out[speaker.id] = null;
        }
        
        // this.speak(rawMessage.body.split(" ").reverse.join(" "));
      });
    });
    
  } catch (err) {
    console.log("Failed to load " + config + "!")
    throw err
  }
})
