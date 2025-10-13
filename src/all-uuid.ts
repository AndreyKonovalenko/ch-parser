import { getData } from './xml-loader-from-files';
import { pastdueArrearsHandler } from './service';
import { saveToFile } from './xml-loader-from-files';
import { LOAN_KEYS, RELATIONSHIP, TYPE, STATUS, COLLATERAL_CODE } from './types';
import { parseDate } from './service';
import 'dotenv/config';
import {Table} from 'console-table-printer';

const allUUID = () => {
  const jsonObj = getData();
  const loans = jsonObj.SINGLE_FORMAT.LOANS;
  const ogrn = jsonObj.SINGLE_FORMAT.BUSINESSES.BUSINESS[0].OGRN

  if (!loans) {
    console.log('Просрочки отсутвуют');
    process.exit(0);
  }

  const resultTable = new Table()

  const reslut:Array<{[key: string]: number|string|undefined}> = []

  for (const index in loans.LOAN) {
    const loan = loans.LOAN[index];
    const arraers = loan.PASTDUE_ARREARS
      ? loan.PASTDUE_ARREARS.PASTDUE_ARREAR
        ? loan.PASTDUE_ARREARS.PASTDUE_ARREAR
        : null
      : null;
    if (arraers && arraers.length > 0) {

      const data = pastdueArrearsHandler(
        arraers,
      );
      if (data.length > 0) {
        const relationship: keyof typeof RELATIONSHIP = loan.RELATIONSHIP;
        const status: keyof typeof STATUS = loan.STATUS;
        const type: keyof typeof TYPE = loan.TYPE;
        const creditLimit = loan.CREDIT_LIMIT;
        const outstanding = loan.OUTSTANDING;
        const openDate = parseDate(loan.OPEN_DATE);
        const finalPmt = parseDate(loan.FINAL_PMT_DATE);
        const nextPmt =  loan.NEXT_PMT;
        const collateral: keyof typeof COLLATERAL_CODE = loan.COLLATERAL_CODE;
        const delqBalace = loan.DELQ_BALANCE;
        data.forEach((element, index) => {
          if(index === 0) {
            const loanData = {
              [LOAN_KEYS.UUID]: loan.UUID,
              [LOAN_KEYS.LOAN_STATUS]:STATUS[status],
              [LOAN_KEYS.LOAN_TYPE]: TYPE[type],
              [LOAN_KEYS.LOAN_RELATIONSHIP]: RELATIONSHIP[relationship],
              [LOAN_KEYS.CREDIT_LIMIT]: creditLimit,
              [LOAN_KEYS.OUTSTANDING]: outstanding,
              [LOAN_KEYS.OPEN_DATE]: openDate,
              [LOAN_KEYS.FINAL_PMT_DATE]: finalPmt,
              [LOAN_KEYS.NEXT_PMT]: nextPmt,
              [LOAN_KEYS.COLLATERAL_CODE]: collateral? COLLATERAL_CODE[collateral]:'нет',
              [LOAN_KEYS.DELQ_BALANCE]: delqBalace,
              [LOAN_KEYS.PAST_DUE_DATE]: element[LOAN_KEYS.PAST_DUE_DATE],
              [LOAN_KEYS.CALCULATION_DATE]: element[LOAN_KEYS.CALCULATION_DATE],
              [LOAN_KEYS.PAST_DUE]: element[LOAN_KEYS.PAST_DUE],
              [LOAN_KEYS.DAYS_PAST_DUE]: element[LOAN_KEYS.DAYS_PAST_DUE],
              [LOAN_KEYS.DAYS_PAST_DUE_REPAID]: element[LOAN_KEYS.DAYS_PAST_DUE_REPAID]
            }
            resultTable.addRow(loanData)            
            reslut.push(loanData)
          }
          if(index !==0){
            const loanDataShort = {
              [LOAN_KEYS.UUID]: loan.UUID,
              [LOAN_KEYS.PAST_DUE_DATE]: element[LOAN_KEYS.PAST_DUE_DATE],
              [LOAN_KEYS.CALCULATION_DATE]: element[LOAN_KEYS.CALCULATION_DATE],
              [LOAN_KEYS.PAST_DUE]: element[LOAN_KEYS.PAST_DUE],
              [LOAN_KEYS.DAYS_PAST_DUE]: element[LOAN_KEYS.DAYS_PAST_DUE],
              [LOAN_KEYS.DAYS_PAST_DUE_REPAID]: element[LOAN_KEYS.DAYS_PAST_DUE_REPAID]
            }
            resultTable.addRow(loanDataShort)
            reslut.push(loanDataShort)
          }
        })
      }
    }
  }
  resultTable.printTable()
  const jsonString = JSON.stringify(reslut);
  saveToFile(ogrn, jsonString)

};

export default allUUID;
