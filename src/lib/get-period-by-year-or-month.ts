import { endOfMonth, endOfYear, startOfYear } from 'date-fns';

type Props = {
  year?: number;
  month?: number;
};

export function getPeriodByYearOrMonth({ year, month }: Props) {
  let startDate: Date = new Date();
  let endDate: Date = new Date();

  if (!year && !month) {
    return {
      startDate,
      endDate,
    };
  }

  const yearChecked = year || new Date().getFullYear();
  const monthChecked = (month ?? 1) - 1;

  startDate = month
    ? new Date(yearChecked, monthChecked, 1)
    : startOfYear(new Date(yearChecked, monthChecked));
  endDate = month
    ? endOfMonth(startDate)
    : endOfYear(new Date(yearChecked, monthChecked));

  return {
    startDate,
    endDate,
  };
}
