const prompts = require('prompts');
const chalk = require('chalk');

function populateList(array, message) {
  let retVal = [];
console.log(array);
  array.forEach(line => {
    if (line[0] !== '*') {
      let titleText;

      if (line[4] === 'localOnly') {
        titleText = chalk.green('local ') + ' - ' + line[2];
      } else {
        titleText = chalk.yellow(line[4]) + ' - ' + line[2];
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