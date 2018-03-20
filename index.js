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

async function checkError(error, item) {
  console.log('Were in checkError(). Expecting (error, item)');
  switch (error) {
    case error.indexOf('not fully merged'):
      await confirmDelete(item);
      break;
    default:
      console.log('Unhandled error: ' + error);
      console.log('Unable to delete branch ' + item);
  }

  process.exit(0);
}

async function confirmDelete(res, item) {
  const confirm = {
    initial: '',
    message: `There is unmerged work in ${chalk.yellow(item)}. Type ${chalk.red(
      'DELETE',
    )} to permanently delete this repo?`,
    name: 'value',
    style: 'default',
    type: 'text',
  };

  let questionForceDelete = await prompts(confirm);

  // TODO: force delete with y/n prompt for now, change to text input for name of branch. Maybe...
  if (questionForceDelete.value === 'DELETE') {
    git.forceDeleteBranch(item).then(() => {
      console.log('Force deleted ' + chalk.red(item));
    });
  } else {
    console.log('Skipped. Will not delete ' + chalk.yellow(item));
  }
}

git
  .buildListArray()
  .then(result => {
    git.filterDiffs(result).then(async res => {
      const choices = populateList(res);

      const question = {
        choices: choices,
        hint:
          chalk.green('[local]') +
          '/' +
          chalk.yellow('[origin]') +
          ' - Space to select. Return to submit',
        initial: 1,
        max: choices.length - 1,
        message: 'Select branches to delete',
        name: 'value',
        type: 'multiselect',
      };

      let questionDeleteBranch = await prompts(question);

      if (!questionDeleteBranch.value) {
        console.log('Nothing selected.');
        process.exit(0);
      }

      if (questionDeleteBranch.value.length > 1) {
        questionDeleteBranch.value.forEach(async item => {
          console.log('Current Branch is: ' + item);

          await git.deleteBranch(item).catch(async error => {
            await checkError(error, item);
          });
        });
      } else if (questionDeleteBranch.value.length === 1) {
        const branch = questionDeleteBranch.value;

        await git.deleteBranch(branch).catch(async error => {
          if (error.indexOf('not fully merged')) {
            await checkError(error, branch);
          }
        });
      } else {
        console.log('Nothing selected.');
      }
    }).catch(error => {
      console.log('Error occured: ' + error);
    });
  })
  .catch(error => {
    console.log('Error occured: ' + error);
  });

// branches should be present on local, but not on origin
// if branch exists on origin, delete?

// Should user only be able to delete local branches?

// change view to view prompts on origin vs local
// Sade - pass flags for local or origin
