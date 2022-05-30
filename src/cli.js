import arg from 'arg';
import inquirer from 'inquirer';
import { printWelcome, printHelp, printVersion } from './prints.js';
import { templateMenu, developmentMenu, productionMenu } from './menus.js';
import main from './main.js';
import chalk from 'chalk';

function parseArgumentsIntoOptions(rawArgs) {
  // All available args (options)
  const args = arg(
    {
      '--domain': String,
      '--frontend': String,
      '--config': String,
      '--port': Number,
      '--email': String,
      '--template': Boolean,
      '--version': Boolean,
      '--help': Boolean,
      '-d': '--domain',
      '-f': '--frontend',
      '-c': '--config',
      '-p': '--port',
      '-e': '--email',
      '-t': '--template',
      '-v': '--version',
      '-h': '--help',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  // Returned options
  return {
    environment: args._[0],
    domain: args['--domain'] || '',
    frontend: args['--frontend'] || '',
    config: args['--config'] || '',
    port: args['--port'] || 80,
    email: args['--email'] || '',
    template: args['--template'] || false,
    version: args['--version'] || false,
    help: args['--help'] || false,
  };
}

// Prompt user for all missing options
async function promptForMissingOptions(options) {
  const questions = [];
  if (!options.environment) {
    questions.push({
      type: 'list',
      name: 'environment',
      message: 'Which environment would you like to deploy to?',
      choices: [
        { name: 'Development', value: 'development' },
        { name: 'Production', value: 'production' },
      ],
    });
  }

  // Update options with any missing values
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    environment: options.environment || answers.environment,
  };
}

export async function cli(args) {
  let errors = 0;
  // Parse the arguments into options.
  let options = parseArgumentsIntoOptions(args);

  // Check if version or help options were passed. if so, print the appropriate message and exit.
  if (options.version) {
    await printVersion();
    process.exit(0);
  }
  if (options.help) {
    await printHelp();
    process.exit(0);
  }

  // Welcome the user
  await printWelcome();

  if (!options.template) {
    // Prompt for missing options
    console.log(chalk.bold.gray.underline('[questions]'));
    options = await promptForMissingOptions(options);

    // Prompt for what to do if template is not passed.
    if (options.environment.toLowerCase() === 'development') options = await developmentMenu(options);
    if (options.environment.toLowerCase() === 'production') options = await productionMenu(options);
  }
  else {
    // If template is passed, prompt for location.
    options = await templateMenu(options);
  }

  // Execute users choice(s)
  console.log('\n' + chalk.bold.gray.underline('[jobs]'));
  const errorsQuantity = await main(options);
  errors = errors + errorsQuantity;

  // Display errors or success message
  console.log('\n' + chalk.bold.gray.underline('[complected]'));
  if (errors === 0) {
    console.log(chalk.bold.green('\u2714') + ' Success, no errors occurred.\n');
  } else if (errors === 1) {
    console.log(chalk.bold.hex('#FF6C8D')('✖ ') + errors + ' error occurred.\n');
  } else if (errors > 1) {
    console.log(chalk.bold.hex('#FF6C8D')('✖ ') + errors + ' errors occurred.\n');
  }
}
