var util = require('util'),
    shellwords = require('shellwords'),
    utilityPack = Object.create(null)

exports.name = 'utility-pack'

exports.register = function(bot) {
  bot.util = utilityPack.create(bot)
}
/**
 * Utility functions for the listeners
 */
utilityPack.create = function(){
  var self = Object.create(this)
  self.constructor.apply(self, arguments)
  return self
}

utilityPack.constructor = function(bot) {
  this.bot = bot
}

utilityPack.constructor.prototype = utilityPack

// Create a RegExp to match a given command
//
// The following are valid commands
// <nick>: commandName commandArgs...
// <nick>    : commandName commandArgs...
// <nick> commandName commandArgs
//
// <nick> must be at the start of the message
utilityPack.commandPattern = function(command) {
  return RegExp('^' + this.bot.client.nick + "\\s*(?:,|:)?\\s" + command + '(\\s|$)')
}

// Returns true if a message is a command
utilityPack.matchesCommand = function(command, message) {
  var pattern = this.commandPattern(command)

  return (message.match(pattern) !== null)
}

// Extracts parameters from a command
// Use shellwords to handle quoted parameters
utilityPack.extractParams = function(message, command) {
  var plainParams = this.removeCommand(message, command)

  try {
    return shellwords.split(plainParams)
  } catch(error) {
    console.error('Error: ' + util.inspect(error))
    return []
  }
}

// Remove the command part from a message
utilityPack.removeCommand = function(message, command) {
  var pattern = this.commandPattern(command),
      plainParams = message.replace(pattern, '').trim()

  return plainParams
}
