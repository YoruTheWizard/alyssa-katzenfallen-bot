require('dotenv').config();
const path = require('path');
const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const { testServer } = require('./config.json');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds] });
new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
  validationsPath: path.join(__dirname, 'validations'),
  // testServer
});

client.login(process.env.TOKEN);