import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import exec from 'await-exec';
import ora from 'ora';

const access = promisify(fs.access);
const copy = promisify(ncp);

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

  const spinnerAccess = ora('Checking folder access').start();
  try {
    await access(templateDir, fs.constants.R_OK);
    spinnerAccess.succeed('Folder access checked');
  } catch (err) {
    spinnerAccess.fail('Could not find templates folder');
    return false;
  }
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
