import { parseDate } from './service';
import  { getData } from './xml-loader-from-files';
import 'dotenv/config'

const jsonObj = getData();
const loans = jsonObj.SINGLE_FORMAT.LOANS
const loan_uuid = process.argv[2] .length === 38 ? process.argv[2]: null;
if (!loan_uuid){
  console.error('uuid задан не верно!!!')
  console.log('npm run start -- 34 chars')
  process.exit(0)
}

const loan = loans.LOAN.find((loan: { UUID: string; }) => loan.UUID === loan_uuid)

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
