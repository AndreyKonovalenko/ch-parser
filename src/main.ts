import singleUUID from './single-uuid';
import allUUID from './all-uuid';
import { getFiles } from './xml-loader-from-files';
import 'dotenv/config';

if (process.argv[2] === 'UUID') {
  singleUUID();
}

if (process.argv[2] === 'ALL' || process.argv[2] === 'ALL-JSON') {
  const files = getFiles();
  if (files && files.length > 0) {
    files.forEach(element => {
      if (process.argv[2] === 'ALL') {
        allUUID(false, element);
      }
      if (process.argv[2] === 'ALL-JSON') {
        allUUID(true, element);
      }
    });
  }
  if (files && files.length === 0) {
    console.log('There is no files in provided directory with xml extention!');
  }
}
