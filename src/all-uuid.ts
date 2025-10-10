import { getData } from './xml-loader-from-files';
import { pastdueArrearsHandler } from './service';
import { saveToFile } from './xml-loader-from-files';
import { RELATIONSHIP, TYPE } from './types';
import 'dotenv/config';
import {Table} from 'console-table-printer';

const allUUID = () => {
  const jsonObj = getData();
  const loans = jsonObj.SINGLE_FORMAT.LOANS;
  const ogrn = jsonObj.SINGLE_FORMAT.BUSINESSES.BUSINESS[0].OGRN

  if (!loans) {
    console.log('Просрочки отсутвуют');
    process.exit(0);
  }

  const resultTable = new Table({
    columns: [
      {
        name: 'UUID'
      },
      {name:'дата возникновения'},
      {name: 'дата обновления '},
      {name: 'cумма просрочки'},
      {name: 'дн. на дату обнов.'},
      {name:'всего дней'}
      ]
  })


  const reslut:Array<{[key: string]: number|string|undefined}> = []

  for (const index in loans.LOAN) {
    const loan = loans.LOAN[index];
    const relationship: keyof typeof RELATIONSHIP = loan.RELATIONSHIP;
    const type: keyof typeof TYPE = loan.TYPE;
    const arraers = loan.PASTDUE_ARREARS
      ? loan.PASTDUE_ARREARS.PASTDUE_ARREAR
        ? loan.PASTDUE_ARREARS.PASTDUE_ARREAR
        : null
      : null;
    if (arraers && arraers.length > 0) {
      const result = pastdueArrearsHandler(
        arraers,
      );
      if (result.length > 0) {
        result.forEach((element, index) => {
          if(index === 0){
            resultTable.addRow({...element, 
              "вид": type? TYPE[type]: undefined,
              "отношение": relationship? RELATIONSHIP[relationship]: undefined,
              "UUID": loan.UUID})
            reslut.push({...element, "UUID": loan.UUID})
          }
          if(index !==0){
            resultTable.addRow(element)
            reslut.push(element)
          }
        } )
      }
    }
  }
  resultTable.printTable()
  // const jsonString = JSON.stringify(reslut);
  // saveToFile(ogrn, jsonString)

};

export default allUUID;
