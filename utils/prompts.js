const prompts = require('prompts');
const chalk = require('chalk');

function populateList(array, message) {
  let retVal = [];

  array.forEach(line => {
    if (line[0] !== '*') {
      let titleText;

      if (line[4] === 'localOnly') {
        titleText = chalk.yellow(line[1]) + ' - ' + line[2];
      } else {
        titleText = line[1] + ' - ' + line[2];
      }

      retVal.push(
        {
          title: titleText,
          value: line[2]
        }
      );
    }
  });

  return retVal;
}

module.exports = {
  populateList
}