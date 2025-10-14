import singleUUID from './single-uuid';
import allUUID from './all-uuid';
import 'dotenv/config';

if (process.argv[2] === 'UUID') {
  singleUUID();
}

if (process.argv[2] === 'ALL') {
  const withJson = false;
  allUUID(withJson);
}

if (process.argv[2] === 'ALL-JSON') {
  const withJson = true;
  allUUID(withJson);
}
