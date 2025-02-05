import {format} from 'date-fns';

export const formattedDateDMY = (date: Date) => {
  return format(date, 'dd-MM-yyyy');
};
