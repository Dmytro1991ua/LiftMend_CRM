import { useState } from 'react';

import DatePicker from '@/shared/date-picker';

type DateCellProps = {
  date: Date;
  isDisabled?: boolean;
};

const DateCell = ({ date, isDisabled }: DateCellProps) => {
  const [singleDate, setSingleDate] = useState<Date | undefined>(date);

  return (
    <DatePicker key={`${date}`} isDisabled={isDisabled} singleDate={singleDate} onSingleDateChange={setSingleDate} />
  );
};

export default DateCell;
