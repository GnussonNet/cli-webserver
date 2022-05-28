import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import Listr from 'listr';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
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

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Something went wrong... could not find templates folder', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy template files',
      task: () => copyTemplateFiles(options),
      skip: () => (!options.template ? 'Pass --template to automatically copy template files' : undefined),
    },
  ]);

  await tasks.run();
  console.log('\n%s Project ready', chalk.green.bold('DONE'));
  return true;
}

export { copyTemplate };
