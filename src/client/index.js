require("dotenv").config({ path: "keys.env" });

import { Client } from "discord.js-commando";
import { token as _token } from "../auth.json";
import { activities_status_list } from "./utils/activities_status.js";

// File System Requirements
import { watch } from "chokidar";

// Anime Server Parent Directory
const serverParentDirectory = "Z:/**/*.mp4"; // Only watches for .mp4 files *NOTE: Z was my current directory at the time of writing

// Anime Server ID
const discordGeneralChannelID = keys.env.DISCORD_GENERAL_CHANNEL_ID;
const discordAnimeUploadsChannelID = keys.env.DISCORD_ANIME_UPLOADS_CHANNEL_ID;

// Config the token for authentication
const jsonFilePath = "auth.json";
let jsonData = fs.readFileSync(jsonFilePath, "utf-8");

jsonData = jsonData.replace(/\${DISCORD_TOKEN}/g, keys.env.DISCORD_TOKEN);
const discordToken = JSON.parse(jsonData);

// The escapeRegex function is used to convert special characters into literal characters by escaping them,
// so that they don't terminate the pattern within the Regular Expression
// const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Ignored files
//var ignoredFiles = [/(^|[/\\])\../, /tmp/];

// Initialize Discord Bot
var bot = new Client({
  token: discordToken,
  commandPrefix: "asb.",
});

// New Member Welcome Message
bot.on("guildMemberAdd", (member) => {
  newUsers.set(member.id, member.user);

  // Bot Intro on connect
  var newMemberAdded = bot.channels.get(discordGeneralChannelID); //#general ID
  newMemberAdded.send("Welcome to Hadi's Anime Server Discord Channel!");
});

// On Connect
bot.on("ready", () => {
  // Console Debug Information
  console.log(`Logged in as ${bot.user.tag}!`);

  // Set Random Initial status, then randomize every 5 minutes
  setRandomActivity();

  setInterval(() => {
    setRandomActivity();
  }, 300000);

  // Send Notification for Upload
  var newAddition = bot.channels.get(discordAnimeUploadsChannelID); // #anime_uploads ID

  // Send help messages to current channel

  // Watch the local server for parent and child directory changes. Ignore preexisting files and allow upload to be complete before posting
  var watcher = watch(serverParentDirectory, {
    persistent: true,
    ignoreInitial: true,
    usePolling: true,
    awaitWriteFinish: true,
  });

  // Need to check if a bulk upload, then default to the series + the counted episode count for that series
  watcher
    .on("add", (filepath) => newAddition.send(`Added: ${filepath}`))
    .on("addDir", (filepath) => newAddition.send(`Added: ${filepath} Folder`))

    // Log errors to console only...
    .on("error", (error) => log(`Error happened ${error}`));
});

// Error Handling
bot.on("error", console.error);
bot.on("shardError", (error) => {
  console.error("A websocket connection encountered an error:", error);
});

function setRandomActivity() {
  const index = Math.floor(
    Math.random() * (activities_status_list.length - 1) + 1
  );
  bot.user.setActivity(activities_status_list[index]);
}

// Authenticate
bot.login(discordToken);

// External JS files for commands
bot.registry.registerGroup("other", "Other");
bot.registry.registerCommandsIn(__dirname + "/commands");
bot.registry.registerDefaults();
