import arg from 'arg';
import inquirer from 'inquirer';
import { printWelcome, printCredits, printHelp, printVersion, printHelpNotice } from './prints.js';
import { developmentMenu, productionMenu } from './menus.js';
import { copyTemplate } from './main.js';

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

  // Check if template option was passed. if so, copy the template and exit.
  if (options.template) {
    await copyTemplate(options);
    await printCredits();
    process.exit(0);
  }

  // Inform user to create a config file or generate a template config file if one doesn't exist.
  await printHelpNotice();

  // Prompt for missing options
  options = await promptForMissingOptions(options);

  // Prompt for what to do
  if (options.environment.toLowerCase() === 'development') options = await developmentMenu(options);
  if (options.environment.toLowerCase() === 'production') options = await productionMenu(options);

  // Show the credits
  await printCredits();
}
