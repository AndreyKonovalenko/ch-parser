
export function parseDate(date: string | number){
  let dateString = date.toString()
  dateString = dateString.length == 8 ? dateString : '0' + dateString
  let day = dateString.substring(0, 2);
  let month = dateString.substring(2, 4)
  let year = dateString.substring(4, 8); 

  day = day.length < 2 ? '0' + day: day;
  month = month.length < 2 ? '0' + month : month;

  return `${day}-${month}-${year}`
}
