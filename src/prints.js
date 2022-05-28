import chalk from 'chalk';
import cliWelcome from 'cli-welcome';
import cliTable from 'cli-table';
import { readJSON } from './util.js';

const pkg = readJSON(new URL('../package.json', import.meta.url));

async function printWelcome() {
  cliWelcome({
    title: `cli-webserver`,
    tagLine: `by ${pkg.author.name}`,
    description: `${pkg.description}`,
    bgColor: `#5683ff`,
    color: `#000000`,
    bold: true,
    clear: true,
    version: pkg.version,
  });
}

async function printCredits() {
  const table = new cliTable();
  table.push([chalk.bold.yellow(' Star '), 'https://github.com/GnussonNet/cli-webserver'], [chalk.bold.cyan(' Follow '), 'https://github.com/GnussonNet']);
  console.log('\n' + table.toString() + '\n');
}

async function printHelp() {
  console.log(`  Version: v${pkg.version}
  Via a simple menu you can easily create and renew a webserver with SSL certificates for free
  
  ${chalk.bold.bgGreenBright(' Usage ')}

  ${chalk.white('$')} ${chalk.bold.greenBright('cli-webserver')} ${chalk.cyanBright('<environment>')} ${chalk.yellowBright('[options]')}
  
  ${chalk.bold.bgCyanBright(' Environments ')}

  ${chalk.cyanBright('development')}  Deploy webserver in development mode (no SSL)
  ${chalk.cyanBright('production')}   Deploy webserver in production mode
  
  ${chalk.bold.bgYellowBright(' Options ')}

  ${chalk.yellowBright('-d, --domain')}      Domain name of the webserver
  ${chalk.yellowBright('-f, --frontend')}    Path to the frontend directory
  ${chalk.yellowBright('-c, --config')}      Path to the config file
  ${chalk.yellowBright('-p, --port')}        Port number of the webserver
  ${chalk.yellowBright('-e, --email')}       Email address of the webserver
  ${chalk.yellowBright('-t, --template')}    Generate a template config file
  ${chalk.yellowBright('-v, --version')}     Print the version of the cli-webserver
  ${chalk.yellowBright('-h, --help')}        Print this help message
  `);
}

async function printVersion() {
  console.log(`v${pkg.version}`);
}

export { printWelcome, printCredits, printHelp, printVersion };
