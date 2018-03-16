const chalk = require('chalk');
const prompts = require('prompts');
const updateNotifier = require('update-notifier');

const pkg = require('./package.json');
const notifier = updateNotifier({ pkg });

if (notifier.update) {
  notifier.notify();
}

const git = require('./utils/git');

git.buildListArray().then(result => {
    console.log(result)
});



// Build branch list
// Print branch list to prompt
// branches should be present on local, but not on origin
// change view to view prompts on origin vs local
// Sade - pass flags for local or origin

