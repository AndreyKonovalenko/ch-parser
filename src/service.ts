import { Arrear, LOAN_KEYS } from './types';

export function parseDate(date: string | number | undefined) {
  if (!date) {
    return 'no date';
  }
  let dateString = date.toString();
  dateString = dateString.length == 8 ? dateString : '0' + dateString;
  let day = dateString.substring(0, 2);
  let month = dateString.substring(2, 4);
  const year = dateString.substring(4, 8);

  day = day.length < 2 ? '0' + day : day;
  month = month.length < 2 ? '0' + month : month;

  // return `${day}-${month}-${year}`;
  return `${year}-${month}-${day}`;
}

function removeCompanyPrefix(str: string) {
  return str.replace(/^(АО|ООО|ЗАО|ПАО)\s*/, "");
}

export interface IBusiness {
  /** Primary State Registration Number (optional) */
  OGRN?: string;
  /** Full legal name (required based on samples) */
  FULL_NAME: string;
  /** Shortened name (optional, but present in all given examples) */
  SHORT_NAME?: string;
  /** Previous name if the entity was renamed (optional) */
  PREVIOUS_NAME?: string;
  /** List of information source codes (e.g., "NBCH", "ECS", "EI") */
  INFO_SOURCES?: string[];
  /** Alternative name(s) (optional) */
  OTHER_NAME?: string;
  /** Some kind of sign flag (optional, appears as "1") */
  SIGN_NAME?: string;
  /** Reorganization flag (optional, "0" or "1") */
  SIGN_REORG?: string;
  /** Date of business history event, format `DDMMYYYY` (optional) */
  BUSINESS_HISTORY_DATE?: string;
}

export interface IBusinesses {
  BUSINESSES: {
    BUSINESS: IBusiness[];
  };
}
interface IRoot {
  SINGLE_FORMAT: IBusinesses }


export function getBusinessInfo(data: IRoot) {
  //Guard Clause
  if(!data.SINGLE_FORMAT.BUSINESSES){
    return undefined
  }
   const businesses: IBusiness[] | undefined = Array.isArray(data.SINGLE_FORMAT.BUSINESSES.BUSINESS) 
  ? data.SINGLE_FORMAT.BUSINESSES.BUSINESS
  : [data.SINGLE_FORMAT.BUSINESSES.BUSINESS]

  if (businesses) { 
    const company_name = businesses ? businesses[0].SHORT_NAME: undefined;
    const company_name_short = company_name ? removeCompanyPrefix(company_name): 'имя не задано'
    // const ogrn = businesses ? businesses[0].OGRN: 'ОГРН не задано'
    const ogrn = businesses.find(
        (element) =>
          element.OGRN !== undefined
      )
    return { company_name_short, ogrn: ogrn? ogrn.OGRN:"ОГРН не задан" }
  } 
  return undefined
} 
 


// function getDaysBetweenDates(
//   date1: string | undefined,
//   date2: string | undefined,
// ) {
//   if (date1 == undefined || date2 == undefined) {
//     return undefined;
//   }
//   const d1 = new Date(date1);
//   const d2 = new Date(date2);
//   const diffMs = Math.abs(d1.getTime() - d2.getTime()); // Use Math.abs for positive difference
//   const millisecondsPerDay = 1000 * 60 * 60 * 24;
//   return Math.floor(diffMs / millisecondsPerDay);
// }

// function findDateSegment(arrears: Array<Arrear>){
//   let startDate: Date | undefined = undefined;
//   for (const index in arrears) {
//     if (arrears[index].PAST_DUE > 0) {
//       startDate = parseDate(arrears[index].PAST_DUE_DATE)
//     }
//   }
// }

// function findSegmentOfArrear(arrears: Array<Arrear>, index: number) {
//   // index of start date
//   const startDate = arrears[index].PAST_DUE_DATE;
//   const segmet: Array<Arrear> = [];
//   arrears.forEach(element => {
//     if (element.PAST_DUE_DATE === startDate) {
//       segmet.push(element);
//     }
//   });

//   if (segmet.length > 1) {
//     const dates: Array<string> = [];
//     segmet.forEach(element => {
//       dates.push(parseDate(element.CALCULATION_DATE));
//     });
//     const maxTimeStemp = Math.max(
//       ...dates.map(date => new Date(date).getTime()),
//     );
//     const result = new Date(maxTimeStemp);
//     return result.toLocaleDateString('en-CA');
//   }
//   return undefined;
// }

function findDaysPasDueRepaid(
  arrears: Array<Arrear>,
  pastDueDate: string,
  calculationDate: string,
): undefined | string | number {
  const result = arrears.find(element => {
    if (
      parseDate(element.PAST_DUE_DATE) === pastDueDate &&
      parseDate(element.CALCULATION_DATE) > calculationDate &&
      element.PAST_DUE === 0
    ) {
      return element;
    }
  });
  return result?.DAYS_PAST_DUE_REPAID;
}

export function pastdueArrearsHandler(arrears: Arrear | Array<Arrear>) {
  const table: Array<{ [keys: string]: string | undefined | number }> = [];

  if(Array.isArray(arrears)) {
    arrears.forEach(element => {
      const pastDue = element.PAST_DUE;
      if (pastDue > 0) {
        const pastDueDate = parseDate(element.PAST_DUE_DATE);
        const calculationDate = parseDate(element.CALCULATION_DATE);
        const daysPastDueRepaid = findDaysPasDueRepaid(
          arrears,
          pastDueDate,
          calculationDate,
        );
        const daysPastDue = element.DAYS_PAST_DUE;
        table.push({
          [LOAN_KEYS.PAST_DUE_DATE]: pastDueDate,
          [LOAN_KEYS.CALCULATION_DATE]: calculationDate,
          [LOAN_KEYS.PAST_DUE]: pastDue,
          [LOAN_KEYS.DAYS_PAST_DUE]: daysPastDue,
          [LOAN_KEYS.DAYS_PAST_DUE_REPAID]: daysPastDueRepaid,
        });
      }
    });
  }

  if(!Array.isArray(arrears)) {
      const pastDue = arrears.PAST_DUE;
      if (pastDue > 0) {
        const pastDueDate = parseDate(arrears.PAST_DUE_DATE);
        const calculationDate = parseDate(arrears.CALCULATION_DATE);
        // const daysPastDueRepaid = findDaysPasDueRepaid(
        //   arrears,
        //   pastDueDate,
        //   calculationDate,
        // );
        const daysPastDue = arrears.DAYS_PAST_DUE;
        table.push({
          [LOAN_KEYS.PAST_DUE_DATE]: pastDueDate,
          [LOAN_KEYS.CALCULATION_DATE]: calculationDate,
          [LOAN_KEYS.PAST_DUE]: pastDue,
          [LOAN_KEYS.DAYS_PAST_DUE]: daysPastDue,
          // [LOAN_KEYS.DAYS_PAST_DUE_REPAID]: daysPastDueRepaid,
        });
      }
  }
  return table;
}

export function removeOOO(data: string) {
  console.log(data.split(/['"]/)[1])
  return data.split(/['"]/)[1];
}


// export function getBusinessInfo(data: {
//   [key: string]: {
//     [key: string]: Array<{ [key: string]: string }> | { [key: string]: string };
//   };
// }): BusinessInfoOutput  {
//   if (data.BUSINESSES) {
//     if (Array.isArray(data.BUSINESSES.BUSINESS)) {
//         const ogrn = data.BUSINESSES.BUSINESS.find(
//         (element: { [key: string]: string | number }) =>
//           element.OGRN !== undefined
//       );
//       const short_name: string | undefined = data.BUSINESSES.BUSINESS.find(
//         (element: { [key: string]: string | number }) =>
//           element.SHORT_NAME !== undefined
//       );
//       return {
//         short_name,
//         ogrn

//       }
//     }
//     if (!Array.isArray(data.BUSINESSES.BUSINESS)) {
//       return data.BUSINESSES.BUSINESS;
//     }
//   }
//   return undefined;
// }
export function getPersonName(
  data: Record<string, Record<string, { [key: string]: string }>>,
) {
  if (data.NAMES) {
    if (Array.isArray(data.NAMES.NAME)) {
      const nameArr = data.NAMES.NAME.find(
        (element: { [key: string]: string | number }) =>
          element.LAST_NAME !== undefined,
      );
      return nameArr.LAST_NAME;
    }
    if (!Array.isArray(data.NAMES.NAME)) {
      return data.NAMES ? data.NAMES.NAME.LAST_NAME : undefined;
    }
  }
  return undefined;
}





export type BusinessInfoOutput = {
  short_name: string | undefined;
  ogrn: string |undefined;
}

type NameInput = string | null | undefined;




export function isValidName(name: NameInput) {
  return name 
    && typeof name === 'string' 
    && name.trim().length > 0;
}


// export function getBusinessInfo(business: BusinessInput, name: NameInput): BusinessInfoResult {

//   const  hasValidBusiness = business
//     && typeof business === 'object'
//     && business?.SHORT_NAME
//     && business?.OGRN
//   // Type validation

//   if (hasValidBusiness) {
//     return {
//       name: removeOOO(business.SHORT_NAME),
//       ogrn: business.OGRN
//     };
//   }

//   return { name: name || 'не указано', ogrn: 'не указано' };

// }



// Helper to extract from array or object




// let
//     Source = Json.Document(File.Contents("C:\Users\konovalenko.a\Desktop\test\1125250004285.json")),
//     #"Converted to Table" = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
//     #"Added Custom" = Table.AddColumn(#"Converted to Table", "tb", each Table.FromRecords({[Column1]})),
//     res=Table.Combine(#"Added Custom"[tb]),
// in
//     res
