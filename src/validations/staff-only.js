const { staff } = require('../config.json');

/**
 * 
 * @param {import('discord.js').Interaction} interaction 
 * @param {{staffOnly: boolean}} commandObj 
 * @returns boolean | undefined
 */
module.exports = (interaction, commandObj) => {
  if (commandObj.staffOnly) if (!interaction.member.roles.includes(staff)) {
    interaction.reply({
      content: 'Este comando só pode ser utilizado por membros da staff!',
      ephemeral: true
    });
    return true;
  }
};