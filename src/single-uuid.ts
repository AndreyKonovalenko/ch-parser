import  { getData } from './xml-loader-from-files';
import { pastdueArrearsHandler } from './service';
import 'dotenv/config'

const jsonObj = getData();
const loans = jsonObj.SINGLE_FORMAT.LOANS

const loan_uuid = process.argv[2] .length === 38 ? process.argv[2]: null;

if (!loan_uuid){
  console.error('uuid задан не верно!!!')
  console.log('npm run start -- 34 chars')
  process.exit(0)
}
const loan = loans.LOAN.find((loan: { UUID: string; }) => loan.UUID === loan_uuid)
const arraers = loan.PASTDUE_ARREARS.PASTDUE_ARREAR

console.log('uuid: ',loan_uuid)
console.table(pastdueArrearsHandler(arraers, loan_uuid).table)
