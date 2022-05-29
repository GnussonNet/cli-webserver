import chalk from 'chalk';
import cliWelcome from 'cli-welcome';
import cliTable from 'cli-table';
import { readJSON } from './util.js';

// Information from the cli-webserver package.json file
const pkg = readJSON(new URL('../package.json', import.meta.url));

// Welcome message displaying at the start of the cli-webserver
async function printWelcome() {
  cliWelcome({
    title: pkg.name,
    tagLine: `by ${pkg.author.name}`,
    description: `${pkg.description}`,
    bgColor: `#5683ff`,
    color: `#000000`,
    bold: true,
    clear: true,
    version: pkg.version,
  });
}

// Displayed at the end of the cli-webserver, advising the user to support the project
async function printCredits() {
  const table = new cliTable();
  table.push([chalk.bold.bgYellow.hex('#000')(' Star '), 'https://github.com/GnussonNet/cli-webserver'], [chalk.bold.bgCyan.hex('#000')(' Follow '), 'https://github.com/GnussonNet']);
  console.log('\n' + table.toString() + '\n');
}

// Display help message when --help option is passed
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

// Display version message when --version option is passed
async function printVersion() {
  console.log(`v${pkg.version}`);
}

async function printHelpNotice() {
  console.log(`
${chalk.bold.yellowBright('First time using cli-webserver?')}
If you haven't used cli-webserver before,
make sure to ether create a config file or generate a template config file using ${chalk.yellowBright('-t, --template')}.
  
  `);
}

export { printWelcome, printCredits, printHelp, printVersion, printHelpNotice };
