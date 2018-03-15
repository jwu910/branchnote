const chalk = require('chalk');
const updateNotifier = require('update-notifier');

const pkg = require('./package.json');
const notifier = updateNotifier({ pkg });


  if (notifier.update) {
    notifier.notify();
  }

