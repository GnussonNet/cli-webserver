import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import exec from 'await-exec';
import ora from 'ora';
import inquirer from 'inquirer';
import chalk from 'chalk';

// Promisify file system functions
const access = promisify(fs.access);
const copy = promisify(ncp);

// Execute exec function with callback
async function execute(command, callback) {
  await exec(command, function (error, stdout, stderr) {
    callback(stdout);
  });
}

// Copy Template Files to Target Directory
async function copyTemplateFiles(options) {
  const spinnerCopy = ora('Copying template').start();
  try {
    await copy(options.templateDirectory, options.targetDirectory, { clobber: false });
    spinnerCopy.succeed(`Template copied to '${options.targetDirectory}'`);
  } catch (error) {
    spinnerCopy.fail('Could not copy template files');
    return false;
  }

  return true;
}

// Prompt to create missing directory
async function createDirectory(options) {
  const pathArray = options.targetDirectory.split('/');

  await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'createNew',
        message: `"${pathArray[pathArray.length - 1]}" does not exist inside "${pathArray[pathArray.length - 2]}". Create it?`,
      },
    ])
    .then((answer) => {
      if (answer.createNew) {
        return copyTemplateFiles(options);
      }
    });
  return false;
}

// Copy template function
async function copyTemplate(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const templateDir = path.resolve(
    new URL(import.meta.url).pathname,
    '../../templates'
    //  options.template || 'JavaScript' <----- makes it possible to have multiple templates folders
  );
  options.templateDirectory = templateDir;

  // If template files exist, continue, else return false
  const spinner = ora('Find template files').start();
  if (
    !(await fs.promises
      .access(templateDir, fs.constants.R_OKP)
      .then(async () => {
        spinner.succeed('Template files found');
        return true;
      })
      .catch((error) => {
        spinner.fail('Template files not found');
        return false;
      }))
  )
    return false;

  // If target directory exists, continue, else return false
  spinner.start('Check if target directory exists');
  if (
    !(await fs.promises
      .access(options.targetDirectory, fs.constants.R_OKP)
      .then(async () => {
        spinner.succeed('Target directory exists');
        return true;
      })
      .catch((error) => {
        spinner.info('Target directory does not exist');
        return false;
      }))
  ) {
    return await createDirectory(options);
  }

  // Copy template files to target directory
  return copyTemplateFiles(options);
}

// Start webserver using docker image
async function startWebserver(options) {
  const spinner = ora('Starting webserver').start();
  try {
    if (options.environment === 'development') {
      await exec(`docker run -it --rm -d -p ${options.port}:80 --name webserver -v ${options.frontend}:/var/www/${options.domain} -v ${options.config}:/etc/nginx/sites-enabled/${options.domain} gnusson/cli-webserver:latest`).then((stdout) => {
        spinner.succeed('Webserver started');
        return true;
      });
    } else if (options.environment === 'production') {
      await exec(`docker run -it --rm -d -p 80:80 -p 443:443 --name webserver -v ${options.frontend}:/var/www/${options.domain} -v ${options.config}:/etc/nginx/sites-enabled/${options.domain} gnusson/cli-webserver:latest`).then((stdout) => {
        spinner.succeed('Webserver started');
        return true;
      });
    } else {
      spinner.fail('No environment specified');
      return false;
    }
  } catch (error) {
    if (error.stderr) {
      spinner.fail(error.stderr);
      return false;
    }
  }
}

// Restart docker container
async function restartWebserver(options) {
  const spinner = ora('Restarting webserver').start();
  try {
    await exec(`docker restart webserver`).then((stdout) => {
      spinner.succeed('Webserver restarted');
      return true;
    });
  } catch (error) {
    if (error.stderr) {
      spinner.fail(error.stderr);
      return false;
    }
  }
}

// Stop docker container
async function stopWebserver(options) {
  const spinner = ora('Stopping webserver').start();
  try {
    await exec(`docker stop webserver`).then((stdout) => {
      spinner.succeed('Webserver stopped');
      return true;
    });
  } catch (error) {
    if (error.stderr) {
      spinner.fail(error.stderr);
      return false;
    }
  }
}

// Install Let's Encrypt certificate using Certbot and docker
async function installCertificate(options) {
  const spinner = ora('Installing certificate').start();
  if (!options.agreeTos) {
    spinner.fail("You must agree to the Let's Encrypt terms of service to install a certificate");
    return false;
  }
  try {
    await execute(`docker exec -t webserver certbot --nginx --email ${options.email} ${options.agreeEmail === true ? '--eff-email' : '--no-eff-email'} ${options.agreeTos && '--agree-tos'} --redirect -d ${options.domain}`).then((callback) => {
      spinner.succeed('Certificate installed');
      return true;
    });
  } catch (error) {
    if (error.stderr || error.stdout) {
      spinner.fail('Failed to install Certificate');
      console.error(`${chalk.bold.bgRedBright.hex('#000')('\nFROM CERTBOT:\n')}${error.stderr || error.stdout}`);
      return false;
    }
  }
}

export { copyTemplate, startWebserver, restartWebserver, stopWebserver, installCertificate };
