import { getData } from './xml-loader-from-files';
import { getOGRN, getPersonName } from './service';
import { parseDate, pastdueArrearsHandler } from './service';
import 'dotenv/config';
import { LOAN_KEYS, STATUS, TYPE, RELATIONSHIP, LOANS_OVERVIEW } from './types';

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

  // const hasCurrentPASTDUE = (loans: Array<{ [key: string]: number }>) => {
  //   const pastdudedLoan = loans.find(element => element.DELQ_BALANCE > 0);
  //   return pastdudedLoan ? 'да' : 'нет';
  // };

  console.log(
    business ? business.SHORT_NAME : name,
    business ? business.OGRN : '',
  );
  let sum = 0;
  for (const index in loans.LOAN) {
    const loan = loans.LOAN[index];
    const arraers = loan.PASTDUE_ARREARS
      ? loan.PASTDUE_ARREARS.PASTDUE_ARREAR
        ? loan.PASTDUE_ARREARS.PASTDUE_ARREAR
        : null
      : null;
    if (arraers && arraers.length > 0) {
      const data = pastdueArrearsHandler(arraers);
      if (data.length > 0) {
        const status: keyof typeof STATUS = loan.STATUS;
        const type: keyof typeof TYPE = loan.TYPE;
        const relationship: keyof typeof RELATIONSHIP = loan.RELATIONSHIP;
        const creditLimit = loan.CREDIT_LIMIT;
        const minPastDueDate = data
          .map(element => element[LOAN_KEYS.PAST_DUE_DATE])
          .reduce((accumulator, currentValue) => {
            if (!currentValue) {
              return accumulator;
            }
            if (!accumulator) {
              return '9999-12-31';
            }
            return accumulator < currentValue ? accumulator : currentValue;
          });
        const maxCalculationDate = data
          .map(element => element[LOAN_KEYS.CALCULATION_DATE])
          .reduce((accumulator, currentValue) => {
            if (!currentValue) {
              return accumulator;
            }
            if (!accumulator) {
              return '1000-01-01';
            }
            return accumulator > currentValue ? accumulator : currentValue;
          });
        const maxPastDue = data
          .map(element => element[LOAN_KEYS.PAST_DUE])
          .reduce((accumulator, currentValue) => {
            if (!currentValue) {
              return accumulator;
            }
            if (!accumulator) {
              return 0;
            }
            return accumulator > currentValue ? accumulator : currentValue;
          });
        const maxDaysPastDue = data
          .map(element => element[LOAN_KEYS.DAYS_PAST_DUE])
          .reduce((accumulator, currentValue) => {
            if (!currentValue) {
              return accumulator;
            }
            if (!accumulator) {
              return 0;
            }
            return accumulator > currentValue ? accumulator : currentValue;
          });

        const ttl_5 =
          loan.TTL_DELQ_5 > 0
            ? `${[LOANS_OVERVIEW.TTL_DELQ_5]}: ${loan.TTL_DELQ_5} `
            : '';
        const ttl_5_29 =
          loan.TTL_DELQ_5_29 > 0
            ? `${[LOANS_OVERVIEW.TTL_DELQ_5_29]}: ${loan.TTL_DELQ_5_29} `
            : '';
        const ttl_30_59 =
          loan.TTL_DELQ_30_59 > 0
            ? `${[LOANS_OVERVIEW.TTL_DELQ_30_59]}: ${loan.TTL_DELQ_30_59} `
            : '';
        const ttl_60_89 =
          loan.TTL_DELQ_60_89 > 0
            ? `${[LOANS_OVERVIEW.TTL_DELQ_60_89]}: ${loan.TTL_DELQ_60_89} `
            : '';
        const ttl_90_plus =
          loan.TTL_DELQ_90_PLUS > 0
            ? `${[LOANS_OVERVIEW.TTL_DELQ_90_PLUS]}: ${loan.TTL_DELQ_90_PLUS} `
            : '';
        const delq =
          ttl_5 +
          ttl_5_29 +
          ttl_30_59 +
          ttl_60_89 +
          ttl_90_plus +
          `макс дней ${maxDaysPastDue}, макс сумма просрочки ${maxPastDue}`;
        const result =
          `uuid: ${loan.UUID} ${STATUS[status]}${loan.FACT_CLOSE_DATE ? ' ' + parseDate(loan.FACT_CLOSE_DATE) + ' ' : ' '}${TYPE[type]} ${RELATIONSHIP[relationship]}` +
          '\n' +
          `лимит: ${creditLimit} в период с ${minPastDueDate} по ${maxCalculationDate} было допущено просрочек: ` +
          '\n' +
          `${delq}${loan.DELQ_BALANCE > 0 ? ' текущая просрочка ' + loan.DELQ_BALANCE : ''}`;
        console.log(result);
        sum++;
      }
    }
  }
  console.log('всего', sum);
};

export default sentence;
