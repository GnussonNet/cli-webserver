import { copyTemplate, startWebserver, reloadWebserver, stopWebserver, installCertificate } from './actions.js';

let errors = 0;

export default async (options) => {
  if (options.template) {
    await copyTemplate(options).then((result) => {
      if (result === false) return errors++;
    });
    return errors;
  }
  if (options.run.includes('start'))
    await startWebserver(options).then((result) => {
      if (result === false) errors++;
    });
  if (options.run.includes('reload'))
    await reloadWebserver(options).then((result) => {
      if (result === false) errors++;
    });
  if (options.run.includes('stop'))
    await stopWebserver(options).then((result) => {
      if (result === false) errors++;
    });
  if (options.run.includes('installCert'))
    await installCertificate(options).then((result) => {
      if (result === false) errors++;
    });

  return errors;
};
