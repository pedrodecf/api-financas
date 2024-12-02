import { parse, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

type DateRangeProps = {
  periodoDe?: string;
  periodoAte?: string;
};

export function getPeriodByDates({ periodoDe, periodoAte }: DateRangeProps) {
  const dateFormat = 'ddMMyyyy';

  let startDate: Date;
  let endDate: Date;

  if (!periodoDe && !periodoAte) {
    const today = new Date();
    startDate = startOfMonth(today);
    endDate = endOfMonth(today);
  } else {
    const dateObj1 = periodoDe ? parse(periodoDe, dateFormat, new Date()) : new Date();
    const dateObj2 = periodoAte ? parse(periodoAte, dateFormat, new Date()) : dateObj1;

    startDate = startOfDay(dateObj1);
    endDate = endOfDay(dateObj2);

    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }
  }

  return {
    startDate,
    endDate,
  };
}
