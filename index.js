const chalk = require('chalk');
const prompts = require('prompts');
const updateNotifier = require('update-notifier');

const pkg = require('./package.json');
const notifier = updateNotifier({ pkg });

if (notifier.update) {
  notifier.notify();
}

const git = require('./utils/git');
const { populateList } = require('./utils/prompts');
// const support = require('./utils/support');

git.buildListArray()
  .then(result => {
    git.filterDiffs(result)
      .then( res => {
        const choices = populateList(res);

        const question = {
          type: 'multiselect',
          name: 'value',
          message: 'Select branches to delete',
          choices: choices,
          initial: 1,
          max: choices.length - 1,
          hint: 
            chalk.green('[local]') + '/' + 
            chalk.yellow('[origin]') +
            ' - Space to select. Return to submit'
        };

        let response = prompts(question);

      });
  });

// branches should be present on local, but not on origin
  // if branch exists on origin, delete?

// Should user only be able to delete local branches?

// change view to view prompts on origin vs local
// Sade - pass flags for local or origin

