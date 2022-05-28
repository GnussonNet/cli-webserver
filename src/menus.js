import inquirer from 'inquirer';

async function developmentMenu() {
  const answers = await inquirer.prompt([
    {
      name: 'menu',
      type: 'checkbox',
      message: 'What would you like to do?',
      choices: [
        { name: 'Run Webserver', value: 'run' },
        { name: 'Reload Webserver', value: 'reload' },
        { name: 'Stop Webserver', value: 'stop' },
      ],
    },
  ]);

  if (answers.menu.includes('run')) console.log('Running Webserver');
  if (answers.menu.includes('reload')) console.log('Reloading Webserver');
  if (answers.menu.includes('stop')) console.log('Stopping Webserver');
  if (answers.menu.length === 0) console.log('No options selected');
}

async function productionMenu() {
  const answers = await inquirer.prompt([
    {
      name: 'menu',
      type: 'checkbox',
      message: 'What would you like to do?',
      choices: [
        { name: 'Run Webserver', value: 'run' },
        { name: 'Install Certificate', value: 'installCert' },
        { name: 'Reload Webserver', value: 'reload' },
        { name: 'Stop Webserver', value: 'stop' },
      ],
    },
  ]);

  if (answers.menu.includes('run')) console.log('Running Webserver');
  if (answers.menu.includes('installCert')) console.log('Installing Certificate');
  if (answers.menu.includes('reload')) console.log('Reloading Webserver');
  if (answers.menu.includes('stop')) console.log('Stopping Webserver');
  if (answers.menu.length === 0) console.log('No options selected');
}

export { developmentMenu, productionMenu };
