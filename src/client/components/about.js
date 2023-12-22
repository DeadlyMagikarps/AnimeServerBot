var commando = require('discord.js-commando');

class about extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'about',
            group: 'other',
            memberName: 'about',
            description: 'This bot will periodically check for updates to the Anime Server for any new episodes.'
        });
    }

    async run(message, args){
        message.channel.send("Testing bot creation with file read permissions to post to discord :)");
    }
}

module.exports = about;