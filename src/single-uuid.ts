import { getData } from './xml-loader-from-files';
import { pastdueArrearsHandler, allPaymentDataHandler } from './service';
import 'dotenv/config';

const jsonObj = getData();
const loans = jsonObj.SINGLE_FORMAT.LOANS;

const loan_uuid = process.argv[2].length === 38 ? process.argv[2] : null;

if (!loan_uuid) {
  console.error('uuid задан не верно!!!');
  console.log('npm run start -- 34 chars');
  process.exit(0);
}
const loan = loans.LOAN.find(
  (loan: { UUID: string }) => loan.UUID === loan_uuid,
);
const pastDueArraers = loan.PASTDUE_ARREARS.PASTDUE_ARREAR;
const pastDue = loan.DUE_ARREARS.DUE_ARREAR;
const arraers = loan.ARREARS.ARREAR;
const payments = loan.PAYMENTS.PAYMENT;

// console.log(pastDueArraers[1], pastDue[1], arraers[1], payments[1])

console.log('uuid: ', loan_uuid);
console.table(pastdueArrearsHandler(pastDueArraers, loan_uuid).table);
// console.table(allPaymentDataHandler(pastDueArraers, loan.PAYMENTS.PAYMENT, loan.uuid).table)
