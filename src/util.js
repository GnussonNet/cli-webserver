import fs from 'fs';

const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

export { readJSON };
