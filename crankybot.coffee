marshmallow = require("./lib/marshmallow").marshmallow
fs = require('fs')
yaml = require('yaml')

users_out = { }

fs.readFile 'config.yml', "utf8", (e, data) ->
  throw e if e
  
  try
    config = yaml.eval(data).campfire
    
    console.log "Crankybot is alive with the following settings:"
    console.log config
    
    marshmallow config, (bot) ->

      bot.cmd 'blame', (speaker, blamee) ->
        this.speak "It's all #{blamee}'s fault"

      bot.cmd 'out', (speaker, reason) ->
        this.speak "Have fun, #{speaker.name}"
        users_out[speaker.id] = reason

      # PT story link
      bot.cmd 'pt', (speaker, story_id) ->
        this.speak "https://www.pivotaltracker.com/story/show/#{story_id}"

      bot.cmd 'hello', (speaker) ->
        this.speak "Hello there, #{speaker.name}"
      
      # Basic ping function
      bot.cmd 'ping', (speaker) ->
        this.speak 'Pong!'
        
      # Spit out what tricks this doggy knows
      bot.cmd 'tricks', (speaker) ->
        tricks = for trick of bot.tricks() when trick != 'catchAll'
          trick.replace(/\^/, '').split(' ')[0]
          
        this.speak "I know the following tricks: #{tricks.join(', ')}"
        
      bot.on 'catchAll', (rawMessage, speaker) ->
        if users_out[speaker.id]
          this.speak "#{speaker.name} is back from: #{users_out[speaker.id]}"
          users_out[speaker.id] = null

        # this.speak(rawMessage.body.split(" ").reverse.join(" "))
    
  catch e
    console.log "Failed to load #{config}"
    throw e
