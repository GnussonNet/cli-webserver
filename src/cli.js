import arg from 'arg';
import inquirer from 'inquirer';
import { printWelcome, printCredits, printHelp, printVersion } from './prints.js';

function parseArgumentsIntoOptions(rawArgs) {
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

async function promptForMissingOptions(options) {
  const questions = [];
  if (!options.environment) {
    questions.push({
      type: 'list',
      name: 'environment',
      message: 'Which environment would you like to deploy to?',
      choices: ['Development', 'Production'],
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    environment: options.environment || answers.environment,
  };
}

export async function cli(args) {
  // Parse the arguments into options.
  let options = parseArgumentsIntoOptions(args);

  // Check if version or help options were passed.
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

  // Prompt for missing options
  options = await promptForMissingOptions(options);

  // Show the credits
  await printCredits();
}
