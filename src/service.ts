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

export function pastdueArrearsHandler(arrears: Array<Arrear>) {
  const table: Array<{ [keys: string]: string | undefined | number }> = [];
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
  return table;
}

export function getOGRN(data: {
  [key: string]: { [key: string]: Array<{ [key: string]: string }> };
}) {
  if (data.BUSINESSES) {
    return data.BUSINESSES.BUSINESS.find(
      (element: { [key: string]: string | number }) =>
        element.OGRN !== undefined,
    );
  }
  return undefined;
}
export function getPersonName(
  data: Record<string, Record<string, { [key: string]: string }>>,
) {
  return data.NAMES ? data.NAMES.NAME.LAST_NAME : undefined;
}

export function removeOOO(data: string) {
  return data.split('"')[1];
}

// let
//     Source = Json.Document(File.Contents("C:\Users\konovalenko.a\Desktop\test\1125250004285.json")),
//     #"Converted to Table" = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
//     #"Added Custom" = Table.AddColumn(#"Converted to Table", "tb", each Table.FromRecords({[Column1]})),
//     res=Table.Combine(#"Added Custom"[tb]),
// in
//     res
