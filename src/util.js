import fs from 'fs';

// Parse JSON files into objects
const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

export { readJSON };
