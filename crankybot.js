var marshmallow = require("./lib/marshmallow").marshmallow;
var Fs = require("fs");
var YAML = require("yaml");

// var config = {
//   token:   process.env["CAMPFIRE_TOKEN"],
//   account: process.env["CAMPFIRE_ACCOUNT"],
//   ssl:     process.env["CAMPFIRE_SSL"] == "true",
//   room_id: process.env["CAMPFIRE_ROOM"]
// };

Fs.readFile('config.yml', "utf8", function(err, data) {
  if (err) throw err
  try {
    this.config = YAML.eval(data).campfire;
    
    console.log(config);
    
    marshmallow(config, function(bot) {
      bot.on("^!hello", function(hello, speaker) {
        this.speak("Hello there, " + speaker.name);
      });
      
      // PT story link
      bot.on("^!pt (.+)", function(story_id) {
        this.speak("https://www.pivotaltracker.com/story/show/" + story_id);
      });      
      
      // Basic ping function
      bot.on("^!ping", function(ping) {
        this.speak("pong!");
      });
      
      // Spit out what tricks this doggy knows
      bot.on("^!tricks", function(command) {
        var tricks = [ ];
        for(trick in bot.tricks()) {
          if (trick != 'catchAll') { tricks.push(trick.replace(/\^/, '')); }
        }
        this.speak("I know the following tricks: " + tricks.join(', '));
      });

      bot.on('catchAll', function(rawMessage) {
        this.speak(rawMessage.body.split(" ").reverse.join(" "));
      });
    });
    
  } catch (err) {
    console.log("Failed to load " + config + "!")
    throw err
  }
})
