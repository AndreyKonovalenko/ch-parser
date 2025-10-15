import path from 'path';
import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

export function getFiles() {
  const pathname = process.env.DIRECTORY;
  if (!pathname) {
    console.error('DIRECROTY is not dicleared in .env');
    process.exit(0);
  }
  try {
    const files = fs.readdirSync(pathname);
    const result: Array<string> = [];
    // 'files' is an array of filenames and directory names within the specified path
    files.forEach(element => {
      if (path.extname(element) === '.xml') {
        result.push(path.join(pathname, element));
      }
    });
    return result;
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

export function getData(pathToFile: string) {
  try {
    const xmlData = fs.readFileSync(pathToFile, 'utf8');
    const parser = new XMLParser();
    // Parse the XML data
    const jsonObj = parser.parse(xmlData);
    return jsonObj;
  } catch (error) {
    console.error('Error reading or parsing XML file:', error);
    process.exit(0);
  }
}

export function saveToFile(name: string, content: string) {
  const pathname = process.env.DIRECTORY;
  if (!pathname) {
    console.error('DIRECROTY is not dicleared in .env');
    process.exit(0);
  }
  fs.writeFile(path.join(pathname, `${name}.json`), content, err => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log(`Content successfully saved to ${name}`);
    }
  });
}
