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
  errorLogger
};