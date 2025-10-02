export interface Arrear {
  PAST_DUE: number;
  CALCULATION_DATE: number;
  INFO_SOURCES: { SOURCE: string | Array<string> };
  PAST_DUE_DATE?: number;
  IS_LAST_PAYMENT_CALC?: number;
  PRINCIPAL_PAST_DUE?: number;
  INTEREST_PAST_DUE?: number;
  OTHER_PAST_DUE?: number;
  INTEREST_MISSED_PAYMENT_DATE?: number;
  PRINCIPAL_MISSED_PAYMENT_DATE?: number;
  DAYS_PAST_DUE?: number;
  DAYS_PAST_DUE_REPAID?: number;
}

export interface IData {
  [key: string]: number | string;
}
