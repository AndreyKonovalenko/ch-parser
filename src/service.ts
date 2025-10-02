import { Arrear, IData } from './types';

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
  return(`${year}-${month}-${day}`)
}

function getDaysBetweenDates(date1: string| undefined, date2:string| undefined) {

  if (date1 == undefined || date2 == undefined){
    return undefined
  }
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = Math.abs(d1.getTime() - d2.getTime()); // Use Math.abs for positive difference
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor(diffMs / millisecondsPerDay);

}

// function findDateSegment(arrears: Array<Arrear>){
//   let startDate: Date | undefined = undefined;
//   for (const index in arrears) {
//     if (arrears[index].PAST_DUE > 0) {
//       startDate = parseDate(arrears[index].PAST_DUE_DATE)
//     }
//   }
// }

function findSegmentOfArrear(arrears: Array<Arrear>, index: number) {
// index of start date
  const startDate = arrears[index].PAST_DUE_DATE;  
  const segmet: Array<Arrear> = [];
  arrears.forEach(element => {
    if ( element.PAST_DUE_DATE === startDate ) {
      segmet.push(element)
    }
  });

  if (segmet.length > 1) {
    const dates: Array<string> = []
    segmet.forEach(element => {
      dates.push(parseDate(element.CALCULATION_DATE)) 
    })
    console.log(dates)
    const maxTimeStemp = Math.max(...dates.map(date => (new Date(date)).getTime()));  
    const result =  new Date(maxTimeStemp)
    return result.toLocaleDateString('en-CA')
  }
  return undefined;

}

export function pastdueArrearsHandler(arrears: Array<Arrear>, uuid: string) {
  const table: Array<{[keys: string]: string | undefined | number}> = [];
  arrears.forEach((elemet, index) => {
    const pastDueDate = parseDate(elemet.PAST_DUE_DATE);
    const calculationDate = parseDate(elemet.CALCULATION_DATE);
    const pastDue = elemet.PAST_DUE;
    const daysPastDueRepaid = parseDate(elemet.DAYS_PAST_DUE_REPAID);
    const endDate = findSegmentOfArrear(arrears, index);
    table.push({
      'дата возн': pastDueDate,
      'дата расчета': calculationDate,
      'cумма': pastDue,
      'дней просрочки': arrears[index].DAYS_PAST_DUE,
      'DPDR': daysPastDueRepaid,
      'PMPD': parseDate(elemet.PRINCIPAL_MISSED_PAYMENT_DATE),
      'IMPD':parseDate(elemet.INTEREST_MISSED_PAYMENT_DATE),
      'startDate': pastDueDate,
      'endDate': findSegmentOfArrear(arrears, index), 
      'diff': getDaysBetweenDates(pastDueDate, endDate),
    });
  })
  return { uuid, table };
}



export function allPaymentDataHandler(
  arrears: Array<IData>,
  payments: Array<IData>,
  uuid: string,
) {
  const table = [];
  for (const index in payments) {
    const calc_date = parseDate(payments[index].CALCULATION_DATE);
    const pastDue = arrears.find(
      element => parseDate(element.CALCULATION_DATE) === calc_date,
    );
    table.push({
      payment_date: parseDate(payments[index].PAYMENT_DATE),
      calc_date: calc_date,
      pastDueDate: pastDue ? ( pastDue.PAST_DUE_DATE ? pastDue.DAYS_PAST_DUE: 'no date') : '',
      pastDue: pastDue ? pastDue.PAST_DUE : 0,
      pastDueDays: pastDue ? pastDue.DAYS_PAST_DUE : 0,
    });
  }
  return { uuid, table };
}
