const { Client } = require('discord.js');

module.exports = {
  data: {
    name: 'ping',
    description: 'Responde com "Pong".'
  },
  /**
   * 
   * @param {{interaction: import('discord.js').Interaction, client: Client}} param0 
   */
  run: ({ interaction, client }) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  }
};