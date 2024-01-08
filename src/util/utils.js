const { EmbedBuilder, Role } = require('discord.js');
const titles = require('../json/scanTitles.json');

const getTitlesChoices = () => {
  const titlesArray = [];
  for (let title of titles)
    titlesArray.push({ name: title.name, value: title.id });
  return titlesArray;
};

const getTitlesList = () => titles;

/**
 * 
 * @param {string} listText 
 */
const listTreater = listText => {
  const list = listText.split(', ');
  return '- '.concat(list.join('\n- '));
};

/**
 * 
 * @param {import('discord.js').Interaction} interaction
 * @param {EmbedBuilder[]} embeds 
 * @param {boolean} ephemeral 
 * @param {Role | "@everyone"} role 
 */
const sendEmbeds = (interaction, embeds, ephemeral, role = '@everyone') => {
  if (ephemeral) {
    interaction.channel.send({ content: `${role}`, embeds });
    interaction.reply({ content: 'Mensagem enviada!', ephemeral: true });
  } else interaction.reply({ content: `${role}`, embeds });
};

/**
 * 
 * @param {string} commandName 
 * @param {string} errMessage 
 */
const errorLogger = (commandName, errMessage) => {
  console.error(`Error while running command "${commandName}":\n${errMessage}`);
};

module.exports = {
  getTitlesChoices,
  getTitlesList,
  listTreater,
  sendEmbeds,
  errorLogger
};