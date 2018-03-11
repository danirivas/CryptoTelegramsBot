const {prefix} = require('./config.json');
const {token} = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const cheerio = require('cheerio');

client.on('ready', () => {
    console.log('Ready!');
});

client.login(token);

client.on('message', message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const cmd = args.shift().toLowerCase();

  switch(cmd) {
    case 'args-info':
      if(!args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}`);
      }
      message.channel.send(`Command name: ${cmd}\nArguments: ${args}`);
      break;
    case 'server':
      message.channel.send(`This server's name is: ${message.guild.name}`);
      break;
    case 'list':
      request('http://www.cryptotelegrams.com', function(err,resp, html) {
        if(!err) {
          const $ = cheerio.load(html);
          var data = [];
          $('img').each(function(i, element) {
            const img = $(this).attr('src');
            const coin = $(this).next();
            const users = coin.parent().next();
            const change = users.next();
            const activity = change.next();

            var data_tmp = {};
            data_tmp["IMG"] = img;
            data_tmp["Coin"] = coin.text().replace(/(\r\n\t|\n|\r\t|\s)/gm,"");
            data_tmp["Users"] = users.text().replace(/(\r\n\t|\n|\r\t|\s)/gm,"");
            data_tmp["Change"] = change.text().replace(/(\r\n\t|\n|\r\t|\s)/gm,"");
            data_tmp["Activity"] = activity.text().replace(/(\r\n\t|\n|\r\t|\s)/gm,"");
            data.push(data_tmp);
            /*message.channel.send(`Icon: ${img}`);
            message.channel.send(coins.text().replace(/\n/, ''));
            message.channel.send(users.text().replace(/\n/, ''));
            message.channel.send(change.text().replace(/\n/, ''));
            message.channel.send(activity.text().replace(/\n/, ''));*/

          });

          var ShortListSize = 5;
          if(args.length) {
              ShortListSize = parseInt(args[0], 10);
          }
          var result = "";
          for(var i = 0; i < ShortListSize; i++) {
            result = result + data[i]["Coin"].toString() + " \t- \t" + data[i]["Users"].toString() +
                    " \t- \t" + data[i]["Change"].toString() + " \t- \t" + data[i]["Activity"].toString() + "\n";
          }
          message.channel.send({embed: {
              color: 3447003,
              author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
              },
              title: "Top in total number of users - Telegram Channels",
              //url: "www.cryptotelegrams.com",
              //description: "Ordered by total number of users.",
              /*fields: [{
                name: `${coinfields[0]["name"]}`,
                value: `${coinfields[0]["value"]}`
              }],*/
              fields: [{
                name: "Coin      -      Users     -     Change     -     Activity (24h)",
                value: result
              }],
              timestamp: new Date(),
              footer: {
                //icon_url: client.user.avatarURL,
                text: "© by Bender Rodriguez"
              }
            }
          });

          result = "";
          data.sort(compareChange);
          for(var i = 0; i < ShortListSize; i++) {
            result = result + data[i]["Coin"].toString() + " \t- \t" + data[i]["Users"].toString() +
                    " \t- \t" + data[i]["Change"].toString() + " \t- \t" + data[i]["Activity"].toString() + "\n";
          }
          message.channel.send({embed: {
              color: 3447003,
              author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
              },
              title: "Top increment of users (24h) - Telegram Channels",
              //url: "www.cryptotelegrams.com",
              //description: "Ordered by change in the number of users in the last 24h.",
              /*fields: [{
                name: `${coinfields[0]["name"]}`,
                value: `${coinfields[0]["value"]}`
              }],*/
              fields: [{
                name: "Coin      -      Users     -     Change     -     Activity (24h)",
                value: result
              }],
              timestamp: new Date(),
              footer: {
                //icon_url: client.user.avatarURL,
                text: "© by Bender Rodriguez"
              }
            }
          });

          result = "";
          data.sort(compareActivity);
          for(var i = 0; i < ShortListSize; i++) {
            result = result + data[i]["Coin"].toString() + " \t- \t" + data[i]["Users"].toString() +
                    " \t- \t" + data[i]["Change"].toString() + " \t- \t" + data[i]["Activity"].toString() + "\n";
          }
          message.channel.send({embed: {
              color: 3447003,
              author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
              },
              title: "Top Activity (24h) - Telegram Channels",
              //url: "www.cryptotelegrams.com",
              //description: "Ordered by total activity of the telegram channel in the last 24h.",
              /*fields: [{
                name: `${coinfields[0]["name"]}`,
                value: `${coinfields[0]["value"]}`
              }],*/
              fields: [{
                name: "Coin      -      Users     -     Change     -     Activity (24h)",
                value: result
              }],
              timestamp: new Date(),
              footer: {
                //icon_url: client.user.avatarURL,
                text: "© by Bender Rodriguez"
              }
            }
          });
        }
      });
  }

});

function compareActivity(a, b) {
  var first_a = a["Activity"].indexOf("%");
  var first_b = b["Activity"].indexOf("%");
  var activity_a = parseInt(a["Activity"].substring(0, first_a));
  var activity_b = parseInt(b["Activity"].substring(0, first_b));
  if(activity_a >= activity_b) return -1;
  if(activity_a < activity_b) return 1;
  return 0;
}

function compareChange(a, b) {
  var first_a = a["Change"].indexOf("%");
  var first_b = b["Change"].indexOf("%");
  var change_a = parseInt(a["Change"].substring(0, first_a));
  var change_b = parseInt(b["Change"].substring(0, first_b));
  if(change_a >= change_b) return -1;
  if(change_a < change_b) return 1;
  return 0;
}
