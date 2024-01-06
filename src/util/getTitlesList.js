const titles = require('../json/scanTitles.json');

module.exports = () => {
  const titlesArray = [];
  for (let title of titles)
    titlesArray.push({ name: title.name, value: title.id });
  return titlesArray;
};