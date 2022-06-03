import inquirer from 'inquirer';
import { PathPrompt } from 'inquirer-path';
import fs from 'fs';
import chalk from 'chalk';

// Register path prompt
inquirer.prompt.registerPrompt('path', PathPrompt);

async function templateMenu(options) {
  const questions = [
    // Ask where template files should be copied to
    {
      type: 'path',
      name: 'targetDirectory',
      message: 'Where do you want to copy template files to?',
      directoryOnly: true,
      validate(answer) {
        var path = answer.split('/');
        path.pop();
        if (fs.existsSync(path.join('/'))) {
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
      targetDirectory: options.targetDirectory || answers.targetDirectory,
    };
  });
  return options;
}

async function developmentMenu(options) {
  const questions = [
    // Ask user what to do
    {
      name: 'menu',
      type: 'checkbox',
      message: 'What would you like to do?',
      choices: [
        { name: 'Start Webserver', value: 'start' },
        { name: 'Restart Webserver', value: 'restart' },
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
        return !options.domain && answers.menu.includes('start');
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
  ];

  // Handle answers and update options
  options = await inquirer.prompt(questions).then((answers) => {
    return {
      ...options,
      domain: options.domain || (answers.domain === undefined ? '' : answers.domain),
      frontend: options.frontend || (answers.frontend === undefined ? '' : answers.frontend),
      config: options.config || (answers.config === undefined ? '' : answers.config),
      run: answers.menu,
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
        { name: 'Restart Webserver', value: 'restart' },
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
        return !options.domain && (answers.menu.includes('start') || answers.menu.includes('installCert'));
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
    {
      type: 'confirm',
      name: 'agreeTos',
      message: `${chalk.bold.bgYellowBright.hex('#000')('FROM CERTBOT:')} Please read the Terms of Service at
  https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
  agree in order to register with the ACME server. Do you agree?`,
      when(answers) {
        return !options.agreeTos && answers.menu.includes('installCert');
      },
    },
    {
      type: 'confirm',
      name: 'agreeEmail',
      message: `${chalk.bold.bgYellowBright.hex('#000')('FROM CERTBOT:')} Would you be willing, once your first certificate is successfully issued, to
  share your email address with the Electronic Frontier Foundation, a founding
  partner of the Let's Encrypt project and the non-profit organization that
  develops Certbot? We'd like to send you email about our work encrypting the web,
  EFF news, campaigns, and ways to support digital freedom.`,
      when(answers) {
        return !options.agreeEmail && answers.menu.includes('installCert');
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
      run: answers.menu,
      agreeTos: options.agreeTos || answers.agreeTos,
      agreeEmail: options.agreeEmail || answers.agreeEmail,
    };
  });
  return options;
}

export { templateMenu, developmentMenu, productionMenu };
