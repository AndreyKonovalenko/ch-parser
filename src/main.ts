import allUUID from './all-uuid';
import overview from './overview';
import { getFiles } from './xml-loader-from-files';
import { Table } from 'console-table-printer';
import { saveToFile } from './xml-loader-from-files';
import sentence from './sentence';
import 'dotenv/config';

if (process.argv[2] === 'OVERVIEW' || process.argv[2] === 'OVERVIEW-JSON') {
  const files = getFiles();
  const table = new Table();
  const result: Array<{ [key: string]: string | number }> = [];
  if (files && files.length > 0) {
    files.forEach(element => {
      const output = overview(element);
      table.addRow(output);
      result.push(output);
    });
  }
  if (process.argv[2] === 'OVERVIEW') {
    table.printTable();
  }
  if (process.argv[2] === 'OVERVIEW-JSON') {
    table.printTable();
    saveToFile('overview', JSON.stringify(result));
  }
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

if (process.argv[2] === 'SENTENCE') {
  const files = getFiles();
  if (files && files.length > 0) {
    files.forEach(element => {
      sentence(element);
    });
  }
  if (files && files.length === 0) {
    console.log('There is no files in provided directory with xml extention!');
  }
}
