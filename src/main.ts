import path from  'path';
import fs from 'fs';
import os from 'os'
import { XMLParser } from 'fast-xml-parser';
import 'dotenv/config'

function parseDate(date: string | number){
  let dateString = date.toString()
  dateString = dateString.length == 8 ? dateString : '0' + dateString
  let day = dateString.substring(0, 2);
  let month = dateString.substring(2, 4)
  let year = dateString.substring(4, 8); 

  day = day.length < 2 ? '0' + day: day;
  month = month.length < 2 ? '0' + month : month;

  return `${day}-${month}-${year}`
}

const pathname = process.env.DIRECTORY
if (!pathname) {
  process.exit(0)
}
// try {
//   const filenames = fs.readdirSync(pathname)
//   filenames.forEach(file=> {
//     console.log(file)
//   })
// } catch(err) {
//   console.error('error reading directory', err)
// }


try {
  // Read the XML file content synchronously
  const filename = fs.readdirSync(pathname)
  // console.log(filename)
  // console.log(path.join(pathname, filename[0]))
  const xmlData = fs.readFileSync(path.join(pathname, filename[0]), 'utf8');

  // Create a new XMLParser instance
  const parser = new XMLParser();

  // Parse the XML data
  const jsonObj = parser.parse(xmlData);
  const loans = jsonObj.SINGLE_FORMAT.LOANS
  // console.log(loans)
  const loan_uuid = process.argv[2] .length === 38 ? process.argv[2]: null;
  console.log(process.argv, loan_uuid)
  if (!loan_uuid){
    console.error('uuid задан не верно!!!')
    console.log('npm run start -- 34 chars')
    process.exit(0)
  }

  const loan = loans.LOAN.find((loan: { UUID: string; }) => loan.UUID === loan_uuid)
  console.log(loan)
  const arraers = loan.PASTDUE_ARREARS.PASTDUE_ARREAR
  let count = 0;
  const seen = new Set()

  const table = []

  const result = []
  for (const index in arraers) {
    if (arraers[index].DAYS_PAST_DUE > 5 ) { 
        // console.log(arraers[index])
        table.push({
          'пр. платеж': parseDate(arraers[index].PRINCIPAL_MISSED_PAYMENT_DATE), 
          'дата расчета': parseDate(arraers[index].CALCULATION_DATE),
          'cумма':arraers[index].PAST_DUE,
          'дней':arraers[index].DAYS_PAST_DUE
        })
    }
  }
  // const uniqByPAST_DUE_DATE = result.filter(obj => {
  //   if(seen.has(obj.PAST_DUE_DATE)){
  //     return false;
   
  //   } else {
  //     seen.add(obj.PAST_DUE_DATE)
  //     return true
  //   }
  // })
  // console.log(count)
  // console.log(result)
  // console.log(uniqByPAST_DUE_DATE.length)
  console.log(loan_uuid)
  console.table(table)
  console.log(process.argv[2])

} catch (error) {
  console.error('Error reading or parsing XML file:', error);
}