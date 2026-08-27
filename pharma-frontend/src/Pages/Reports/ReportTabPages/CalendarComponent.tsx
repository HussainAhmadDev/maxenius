import React, { useState } from "react";
// import "./styles.css";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

interface RangeDate {
  startDate: string | Date;
  endDate: string | Date;
}
interface IDateRange {
  setDateRange: (data: RangeDate) => void;
}

const CalendarComponent: React.FC<IDateRange> = ({ setDateRange }) => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });

  //eslint-disable-next-line
  const handleSelect = (ranges: any) => {
    setSelectionRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: "selection"
    });

    if (ranges.selection.startDate && ranges.selection.endDate) {
      const data = {
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate
      };

      setDateRange(data);
    }
  };

  return (
    <DateRangePicker
      showDateDisplay={true}
      ranges={[selectionRange]}
      onChange={handleSelect}
    />
  );
};
export default CalendarComponent;
