import path from  'path';
import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';


export function getData() {
    const pathname = process.env.DIRECTORY
    if (!pathname) {
      console.error('DIRECROTY is not dicleared in .env');
      process.exit(0)
    }
    try {
      // Read the XML file content synchronously
      const filename = fs.readdirSync(pathname)
      const xmlData = fs.readFileSync(path.join(pathname, filename[0]), 'utf8');
      const parser = new XMLParser();
      // Parse the XML data
      const jsonObj = parser.parse(xmlData);
      return jsonObj;     
    } catch (error) {
      console.error('Error reading or parsing XML file:', error);
      process.exit(0)
    }
}