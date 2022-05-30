import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import exec from 'await-exec';
import ora from 'ora';
import inquirer from 'inquirer';

const access = promisify(fs.access);
const copy = promisify(ncp);

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

async function startWebserver(options) {
  const spinner = ora('Starting webserver').start();
  try {
    if (options.environment === 'development') {
      await exec(`docker run -it --rm -d -p ${options.port}:80 --name webserver -v ${options.frontend}:/var/www/${options.domain} -v ${options.config}:/etc/nginx/sites-enabled/${options.domain} ghcr.io/gnussonnet/webserver:latest`).then((stdout) => {
        spinner.succeed('Webserver started');
        return true;
      });
    } else if (options.environment === 'production') {
      await exec(`docker run -it --rm -d -p 80:80 -p 443:443 --name webserver -v ${options.frontend}:/var/www/${options.domain} -v ${options.config}:/etc/nginx/sites-enabled/${options.domain} ghcr.io/gnussonnet/webserver:latest`).then((stdout) => {
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

async function reloadWebserver(options) {
  const spinner = ora('Reloading webserver').start();
  try {
    await exec(`docker kill -s HUP webserver`).then((stdout) => {
      spinner.succeed('Webserver reloaded');
      return true;
    });
  } catch (error) {
    if (error.stderr) {
      spinner.fail(error.stderr);
      return false;
    }
  }
}

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

async function installCertificate(options) {
  const spinner = ora('Installing certificate').start();
  try {
    await exec(`docker exec -ti webserver certbot --nginx --email ${options.email} --redirect -d ${options.domain}`).then((stdout) => {
      spinner.succeed('Certificate installed');
      return true;
    });
  } catch (error) {
    if (error.stderr) {
      spinner.fail(error.stderr);
      return false;
    }
  }
}

export { copyTemplate, startWebserver, reloadWebserver, stopWebserver, installCertificate };
