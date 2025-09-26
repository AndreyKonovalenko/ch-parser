import { getData } from './xml-loader-from-files';
import { pastdueArrearsHandler } from './service';
import 'dotenv/config';

const jsonObj = getData();
const loans = jsonObj.SINGLE_FORMAT.LOANS;

if (!loans) {
  console.log('Просрочки отсутвуют');
  process.exit(0);
}

for (const index in loans.LOAN) {
  const loan = loans.LOAN[index];
  const arraers = loan.PASTDUE_ARREARS
    ? loan.PASTDUE_ARREARS.PASTDUE_ARREAR
      ? loan.PASTDUE_ARREARS.PASTDUE_ARREAR
      : null
    : null;
  if (arraers && arraers.length > 0) {
    const result = pastdueArrearsHandler(
      arraers,
      loans.LOAN[index].UUID ? loans.LOAN[index].UUID : undefined,
    );
    if (result.table.length > 0) {
      console.log('UUID: ', result.uuid);
      console.table(result.table);
    }
  }
}
