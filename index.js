// Import
var _irc = require('irc'),
    _ = require('lodash'),
    shellwords = require('shellwords');

// Config
var botName = 'bobot',
    channels = [
      '##ability',
      '#francejs',
      '#bobot'
    ],
    server = 'irc.freenode.net';

// IRC client
var client = new _irc.Client(server, botName, {
    channels: channels,
    floodProtection: true,
    floodProtectionDelay: 500
});

var app = {
  list: function() {
    var keys = [];
    for(var key in this){
      keys.push(key);
    }

    // Remove the cmd itself
    keys.shift();

    return 'List: ➤ ' + keys.join('  ➤ ');
  },

  // PLEASE ORDER BELOW BY ALPHA
  caniuse: function(param) {
    return 'http://caniuse.com/#search=' + encodeURIComponent(param);
  },

  conj: function(param) {
    return 'http://leconjugueur.lefigaro.fr/conjugaison/verbe/' + encodeURIComponent(param) + '.html';
  },

  fakeimg: function(width, height, text, font) {
    var content = 'http://fakeimg.pl/';

    if(width) { content += width; }
    if(height) { content += 'x' + height; }
    if(text) { content += '/?text=' + encodeURIComponent(text); }
    if(font) { content += '&font=' + encodeURIComponent(font) }

    return  content;
  },

  forkyou: function() {
    return 'Please, please, please https://github.com/kud/ed-209';
  },

  gh: function(param) {
    return 'https://github.com/search?q=' + encodeURIComponent(param);
  },

  google: function(param) {
    return 'https://www.google.com/search?q=' + encodeURIComponent(param)
  },

  img: function(param) {
    return 'http://mebe.co/' + encodeURIComponent(param) + '.jpeg';
  },

  mdn: function(param) {
    return 'https://developer.mozilla.org/en-US/search?q=' + encodeURIComponent(param) + '&sitesearch=developer.mozilla.org';
  },

  repo: function(param) {
    return 'https://github.com/' + param;
  },

  roll: function(param) {
    var dice = function(sides) { return Math.floor((Math.random() * sides) + 1) };

    return '1d6: ' + dice(6);
  },

  roulette: function() {
    var trigger = 4,
        user = Math.floor(Math.random()*8 + 1);

    return trigger === user ? 'BANG!' : 'Click!';
  },

  svg: function() {
    var list = [
          'http://iconmonstr.com/',
          'http://thenounproject.com/',
          'http://icomoon.io/app/'
        ];
    return list.join('\n');
  },

  unicode: function() {
    return 'Ha tu veux de l\'unicode, bah tiens, gros con : http://copypastecharacter.com';
  }
}

// Listeners
client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);

    // We're talking to the bot
    if(message.search(botName) !== -1) {
      var catchedMessage = message.match(new RegExp(botName + ": (.*)"));

      if(catchedMessage && catchedMessage[1]) {
        var plainParams = catchedMessage[1],
            params = shellwords.split(plainParams),
            cmd = params.shift();

        if(typeof app[cmd] !== 'undefined') {
          client.say(to, app[cmd].apply(app, params));
        } else {
          client.say(to, 'Unknown cmd. :]');
        }
      }
    }
});

client.addListener('pm', function (from, message) {
    console.log(from + ' => ME: ' + message);
});
