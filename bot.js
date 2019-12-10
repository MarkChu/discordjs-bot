// require the discord.js module
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');


// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// login to Discord with your app's token
client.login(token);


client.on('message', message => {
	console.log(message.content);

	if (message.content.startsWith(`${prefix}ping`)) {
		message.channel.send('Pong.');
	} else if (message.content.startsWith(`${prefix}test`)) {
		message.channel.send('Test.');
	} else if (message.content.startsWith(`${prefix}beep`)) {
		message.channel.send('Boop.');
	}
	
});