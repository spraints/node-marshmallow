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
      
      // Basic ping function
      bot.on("^!ping", function(ping) {
        this.speak("pong!");
      });
      
      // Spit out what tricks this doggy knows
      bot.on("^!tricks", function(command) {
        var tricks = [ 'ping', 'tricks' ];
        for(trick in bot.tricks()) {
          if (trick != 'catchAll') { tricks.push(trick.replace(/\^/, '')); }
        }
        this.speak("I know the following tricks: " + tricks.join(', '));
      });
      
    });
    
  } catch (err) {
    console.log("Failed to load " + config + "!")
    throw err
  }
})
