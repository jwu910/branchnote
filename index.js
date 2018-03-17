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
      .then(async res => {
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

        let questionDeleteBranch = await prompts(question);

        questionDeleteBranch.value.forEach(item => {
          git.deleteBranch(item).catch(async error => {
            if (error.indexOf('not fully merged')) {
          
              // generate question 
              const confirm = {
                type: 'confirm',
                name: 'value',
                message: `There is unmerged work in ${chalk.red(item)}. Are you sure you want to delete?`,
                initial: false
              }

              let questionForceDelete = await prompts(confirm);

              console.log(questionForceDelete);

              
            }
          });
        });
      });
  });

// branches should be present on local, but not on origin
  // if branch exists on origin, delete?

// Should user only be able to delete local branches?

// change view to view prompts on origin vs local
// Sade - pass flags for local or origin

