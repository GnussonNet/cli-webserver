import inquirer from 'inquirer';
import { PathPrompt } from 'inquirer-path';
import fs from 'fs';

// Register path prompt
inquirer.prompt.registerPrompt('path', PathPrompt);

async function developmentMenu(options) {
  const questions = [
    // Ask user what to do
    {
      name: 'menu',
      type: 'checkbox',
      message: 'What would you like to do?',
      choices: [
        { name: 'Start Webserver', value: 'start' },
        { name: 'Reload Webserver', value: 'reload' },
        { name: 'Stop Webserver', value: 'stop' },
      ],
      validate(answer) {
        if (answer.length) return true;
        else return 'Please select at least one option';
      },
    },
    // If user wants to start webserver, ask for frontend path
    {
      type: 'path',
      name: 'frontend',
      directoryOnly: true,
      message: 'Where is your frontend directory located?',
      when(answers) {
        return !options.frontend && answers.menu.includes('start');
      },
      validate(answer) {
        if (fs.existsSync(answer)) {
          return true;
        } else {
          return 'Please enter a valid path';
        }
      },
    },
    // If user wants to start webserver, ask for config file path
    {
      type: 'path',
      name: 'config',
      message: 'Where is your config file located?',
      when(answers) {
        return !options.frontend && answers.menu.includes('start');
      },
      validate(answer) {
        if (fs.existsSync(answer)) {
          return true;
        } else {
          return 'Please enter a valid path';
        }
      },
    },
  ];

  // Handle answers and update options
  options = await inquirer.prompt(questions).then((answers) => {
    return {
      ...options,
      frontend: options.frontend || (answers.frontend === undefined ? '' : answers.frontend),
      config: options.config || (answers.config === undefined ? '' : answers.config),
    };
  });
  return options;
}

async function productionMenu(options) {
  const questions = [
    // Ask user what to do
    {
      name: 'menu',
      type: 'checkbox',
      message: 'What would you like to do?',
      choices: [
        { name: 'Start Webserver', value: 'start' },
        { name: 'Install Certificate', value: 'installCert' },
        { name: 'Reload Webserver', value: 'reload' },
        { name: 'Stop Webserver', value: 'stop' },
      ],
      validate(answer) {
        if (answer.length) return true;
        else return 'Please select at least one option';
      },
    },
    // If user wants to start webserver or install certificate, ask for domain
    {
      type: 'input',
      name: 'domain',
      message: 'What domain would you like to use?',
      when(answers) {
        return (!options.domain && answers.menu.includes('start')) || answers.menu.includes('installCert');
      },
      validate(answer) {
        var expression = /^\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/g;
        var regex = new RegExp(expression);
        if (answer.match(regex)) {
          return true;
        } else {
          return 'Please enter a valid domain name';
        }
      },
    },
    // If user wants to start webserver, ask for frontend path
    {
      type: 'path',
      name: 'frontend',
      directoryOnly: true,
      message: 'Where is your frontend directory located?',
      when(answers) {
        return !options.frontend && answers.menu.includes('start');
      },
      validate(answer) {
        if (fs.existsSync(answer)) {
          return true;
        } else {
          return 'Please enter a valid path';
        }
      },
    },
    // If user wants to start webserver, ask for config file path
    {
      type: 'path',
      name: 'config',
      message: 'Where is your config file located?',
      when(answers) {
        return !options.frontend && answers.menu.includes('start');
      },
      validate(answer) {
        if (fs.existsSync(answer)) {
          return true;
        } else {
          return 'Please enter a valid path';
        }
      },
    },
    // If user wants to install certificate, ask for email
    {
      type: 'input',
      name: 'email',
      message: 'What email would you like to use for retrieving certificate?',
      when(answers) {
        return !options.email && answers.menu.includes('installCert');
      },
      validate(answer) {
        var expression = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        var regex = new RegExp(expression);
        if (answer.match(regex)) {
          return true;
        } else {
          return 'Please enter a valid email';
        }
      },
    },
  ];

  // Handle answers and update options
  options = await inquirer.prompt(questions).then((answers) => {
    return {
      ...options,
      domain: options.domain || (answers.domain === undefined ? '' : answers.domain),
      email: options.email || (answers.email === undefined ? '' : answers.email),
      frontend: options.frontend || (answers.frontend === undefined ? '' : answers.frontend),
      config: options.config || (answers.config === undefined ? '' : answers.config),
    };
  });
  return options;
}

export { developmentMenu, productionMenu };
