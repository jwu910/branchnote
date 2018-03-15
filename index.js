const blessed = require('blessed');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');

const git = require('./utils/git');
const dialogue = require('./utils/interface');
const { THEME_COLOR } = require('./utils/theme');

const pkg = require('./package.json');
const notifier = updateNotifier({ pkg });

const screen = dialogue.screen();

const branchTable =  dialogue.branchTable();
const helpDialogue =  dialogue.helpDialogue();
const question =  dialogue.question();
const statusBar =  dialogue.statusBar();
const statusHelpText =  dialogue.statusHelpText();

const toggleHelp = () => {
  helpDialogue.toggle();
  screen.render();
};

screen.key('?', toggleHelp);
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
screen.key('r', () => {
  branchTable.clearItems();

  git.fetchBranches().then(() => refreshTable());
});

screen.append(branchTable);

branchTable.setLabel('The BranchNote');

statusBar.append(statusHelpText);

screen.append(statusBar);

screen.append(helpDialogue);
screen.render();

