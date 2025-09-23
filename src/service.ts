import { Arrear } from "./types";

export function parseDate(date: string | number |undefined){
  if (!date) {
    return 'no date'
  }
  let dateString = date.toString()
  dateString = dateString.length == 8 ? dateString : '0' + dateString
  let day = dateString.substring(0, 2);
  let month = dateString.substring(2, 4)
  let year = dateString.substring(4, 8); 

  day = day.length < 2 ? '0' + day: day;
  month = month.length < 2 ? '0' + month : month;

  return `${day}-${month}-${year}`
}


export function pastdueArrearsHandler(arraers:Array<Arrear>, uuid: string) {
  const table = []
    for (const index in arraers) {
      const arrear =  arraers[index].PAST_DUE
      if ( arrear && arrear > 0) { 
          table.push({
            'проп. платеж': parseDate(arraers[index].PAST_DUE_DATE), 
            'дата оплаты': parseDate(arraers[index].CALCULATION_DATE),
            'cумма':arraers[index].PAST_DUE,
            'дней просрочки':arraers[index].DAYS_PAST_DUE
          })
      }
    }
  return {uuid,table}  
}