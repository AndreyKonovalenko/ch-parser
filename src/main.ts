import singleUUID from './single-uuid';
import allUUID from './all-uuid';
import { getFiles } from './xml-loader-from-files';
import 'dotenv/config';

if (process.argv[2] === 'UUID') {
  singleUUID();
}

if (process.argv[2] === 'ALL') {
  
  const files = getFiles();
  if (files&&files.length > 0) {
    files?.forEach(element => {
      allUUID(false, element);
    })
  }
  if( files && files.length === 0){
    console.log('There is no files in provided directory with xml extention!')
  }
}

if (process.argv[2] === 'ALL-JSON') {
  const files = getFiles();
  if (files &&files.length > 0) {
    files.forEach(element => {
      allUUID(true, element);
    })
  }
  if( files && files.length === 0){
    console.log('There is no files in provided directory with xml extention!')
  }
}
