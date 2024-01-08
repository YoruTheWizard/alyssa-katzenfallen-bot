const { EmbedBuilder, Role, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
 * @param {string} linksText 
 */
const linkListTreater = linksText => {
  console.log(linksText);
  if (!linksText) return;
  const links = linksText.split(', '),
    treatedLinks = [];
  for (let i = 0; i < links.length; i++) {
    const splitLink = links[i].split('[');
    const linkObj = {
      num: i + 1,
      name: splitLink[1].replace('] ', '').replace(']', ''),
      url: splitLink[0].replace(' ', '')
    };
    if (splitLink[2])
      linkObj.emoji = splitLink[2].replace(/[^0-9]/g, '');
    treatedLinks.push(linkObj);
  }
  return treatedLinks;
};

/**
 * 
 * @param {{
 *  num: number,
 *  name: string,
 *  url: string,
 *  emoji?: string
 * }[]} links 
 */
const linkButtonsRow = links => {
  console.log(links);
  const row = new ActionRowBuilder();
  for (let link of links) {
    let btn =
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(link.name)
        .setURL(link.url);
    if (link.emoji) btn.setEmoji(link.emoji);
    row.components.push(btn);
  }
  return row;
};

/**
 * 
 * @param {import('discord.js').Interaction} interaction
 * @param {EmbedBuilder[]} embeds 
 * @param {boolean} ephemeral 
 * @param {ActionRowBuilder[]} rows
 * @param {Role | "@everyone"} role 
 */
const sendEmbeds = (interaction, embeds, ephemeral, role = '@everyone', rows = undefined) => {
  if (ephemeral) {
    interaction.channel.send({ content: `${role}`, embeds, components: rows });
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
  linkListTreater,
  linkButtonsRow,
  sendEmbeds,
  errorLogger
};