import singleUUID from './single-uuid';
import allUUID from './all-uuid';
import 'dotenv/config';

if (process.argv[2] === 'UUID') {
  singleUUID();
}
if (process.argv[2] === 'ALL') {
  allUUID();
}
