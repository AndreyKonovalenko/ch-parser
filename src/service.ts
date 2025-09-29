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

  return `${day}-${month}-${year}`;
}

export function pastdueArrearsHandler(arraers: Array<Arrear>, uuid: string) {
  const table = [];
  for (const index in arraers) {
    // const arrear = arraers[index].PAST_DUE;
    table.push({
      'проп. платеж': parseDate(arraers[index].PAST_DUE_DATE),
      'дата расчета': parseDate(arraers[index].CALCULATION_DATE),
      cумма: arraers[index].PAST_DUE,
      'дней просрочки': arraers[index].DAYS_PAST_DUE,
    });
  }
  return { uuid, table };
}

export function allPaymentDataHandler(
  arraers: Array<IData>,
  payments: Array<IData>,
  uuid: string,
) {
  const table = [];
  for (const index in payments) {
    const calc_date = parseDate(payments[index].CALCULATION_DATE);
    const pastDue = arraers.find(
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
