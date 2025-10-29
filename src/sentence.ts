import { getData } from './xml-loader-from-files';
import { getOGRN, getPersonName, removeOOO } from './service';
import { LOAN_KEYS, LOANS_OVERVIEW } from './types';
import 'dotenv/config';

const sentence = (pathToFile: string) => {
  const jsonObj = getData(pathToFile);
  const loans = jsonObj.SINGLE_FORMAT.LOANS;
  const business = getOGRN(jsonObj.SINGLE_FORMAT);
  const name = getPersonName(jsonObj.SINGLE_FORMAT);
  const loansOverveiew = jsonObj.SINGLE_FORMAT.LOANS_OVERVIEW;

  if (!loansOverveiew) {
    if (!loans) {
      console.log('no data found');
      process.exit(0);
    }
  }

  const hasCurrentPASTDUE = (loans: Array<{ [key: string]: number }>) => {
    const pastdudedLoan = loans.find(element => element.DELQ_BALANCE > 0);
    return pastdudedLoan ? 'да' : 'нет';
  };

  
  for (const index in loans.LOAN) {
    const loan = loans.LOAN[index];
    const arraers = loan.PASTDUE_ARREARS
      ? loan.PASTDUE_ARREARS.PASTDUE_ARREAR
        ? loan.PASTDUE_ARREARS.PASTDUE_ARREAR
        : null
      : null;
      if (arraers && arraers.length > 0) {
  }

  const result = {
    ['наименование']: business
      ? removeOOO(business.SHORT_NAME)
      : name
        ? name
        : 'не указано',
    ['ОГРН']: business ? business.OGRN : undefined,
    loans: [];
    [LOANS_OVERVIEW.LOANS_ACTIVE]: loansOverveiew.LOANS_ACTIVE,
    [LOANS_OVERVIEW.PAY_LOAD]: loansOverveiew.PAY_LOAD,
    [LOAN_KEYS.DELQ_BALANCE]: loans ? hasCurrentPASTDUE(loans.LOAN) : 'нет ки',
    [LOANS_OVERVIEW.TTL_DELQ_5]: loansOverveiew.TTL_DELQ_5,
    [LOANS_OVERVIEW.TTL_DELQ_5_29]: loansOverveiew.TTL_DELQ_5_29,
    [LOANS_OVERVIEW.TTL_DELQ_30_59]: loansOverveiew.TTL_DELQ_30_59,
    [LOANS_OVERVIEW.TTL_DELQ_60_89]: loansOverveiew.TTL_DELQ_60_89,
    [LOANS_OVERVIEW.TTL_DELQ_90_PLUS]: loansOverveiew.TTL_DELQ_90_PLUS,
  };
  return result;
};

export default sentence;
