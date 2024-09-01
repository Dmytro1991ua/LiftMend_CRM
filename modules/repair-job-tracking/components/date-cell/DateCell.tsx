import { useState } from 'react';

import DatePicker from '@/shared/date-picker';

type DateCellProps = {
  date: Date;
};

const DateCell = ({ date }: DateCellProps) => {
  const [singleDate, setSingleDate] = useState<Date | undefined>(date);

  return <DatePicker key={`${date}`} singleDate={singleDate} onSingleDateChange={setSingleDate} />;
};

export default DateCell;
