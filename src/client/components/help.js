var commando = require("discord.js-commando");
require("dotenv").config();

const serverURL = keys.env.SERVER_URL;

class server extends commando.Command {
  constructor(client) {
    super(client, {
      name: "server",
      group: "other",
      memberName: "server",
      description: "Shows the Anime Server Portal Login",
    });
  }

  async run(message) {
    message.channel.send(
      {
        embed: {
          title: "Anime Server",
          url: serverURL,
          description:
            "To access the server, login in with your first initial and full last name. Example hrumjahn. If you forgot your password, contact me so I can reset. ",
        }, // Embed Arg Bracket
      } // Embed Bracket
    ); // Run function
  } // end command
}

module.exports = server;
