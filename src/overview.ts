import { getData } from './xml-loader-from-files';
import { getOGRN, getPersonName, removeOOO } from './service';
import { LOAN_KEYS, LOANS_OVERVIEW } from './types';
import 'dotenv/config';

const overview = (pathToFile: string) => {
  const jsonObj = getData(pathToFile);
  const loans = jsonObj.SINGLE_FORMAT.LOANS;
  const ogrn = getOGRN(jsonObj.SINGLE_FORMAT);
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

  const data = {
    ['наименование']: ogrn
      ? removeOOO(ogrn.SHORT_NAME)
      : name
        ? name
        : 'не указано',
    ['ОГРН']: ogrn ? ogrn.OGRN : undefined,
    [LOANS_OVERVIEW.LOANS_ACTIVE]: loansOverveiew.LOANS_ACTIVE,
    [LOANS_OVERVIEW.PAY_LOAD]: loansOverveiew.PAY_LOAD,
    [LOAN_KEYS.DELQ_BALANCE]: loans ? hasCurrentPASTDUE(loans.LOAN) : 'нет ки',
    [LOANS_OVERVIEW.TTL_DELQ_5]: loansOverveiew.TTL_DELQ_5,
    [LOANS_OVERVIEW.TTL_DELQ_5_29]: loansOverveiew.TTL_DELQ_5_29,
    [LOANS_OVERVIEW.TTL_DELQ_30_59]: loansOverveiew.TTL_DELQ_30_59,
    [LOANS_OVERVIEW.TTL_DELQ_60_89]: loansOverveiew.TTL_DELQ_60_89,
    [LOANS_OVERVIEW.TTL_DELQ_90_PLUS]: loansOverveiew.TTL_DELQ_90_PLUS,
  };
  return data;
};

export default overview;
