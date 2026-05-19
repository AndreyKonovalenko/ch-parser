import { getData } from './xml-loader-from-files';
import { getBusinessInfo, getPersonName, } from './service';
import { LOAN_KEYS, LOANS_OVERVIEW } from './types';
import 'dotenv/config';

const overview = (pathToFile: string) => {
  const jsonObj = getData(pathToFile);
  const loans = jsonObj.SINGLE_FORMAT.LOANS;
  const businessInfo = getBusinessInfo(jsonObj);
  const name = getPersonName(jsonObj.SINGLE_FORMAT);
  const loansOverveiew = jsonObj.SINGLE_FORMAT.LOANS_OVERVIEW;

  if (!loansOverveiew) {
    if (!loans) {
      console.log('no data found');
      process.exit(0);
    }
  }

  const hasCurrentPASTDUE = (loans: Array<{ [key: string]: number }> | {[key: string]: number } )=> {
    const pastdudedLoan = Array.isArray(loans) ?  loans.find(element => element.DELQ_BALANCE > 0): loans.DELQ_BALANCE > 0;
    return pastdudedLoan ? 'да' : 'нет';
  };

  const data = {
    ['наименование']: businessInfo
      ? businessInfo.company_name_short
      : name
        ? name
        : 'не указано',
    ['ОГРН']: businessInfo ? businessInfo.ogrn: 'огрн не задано',
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
