import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.style.css";
import { ukDateFormat } from "Utils/datesFormat";

interface CustomDatePickerState {
  selectedDate: Date | null;
}
interface CustomDatePickerProps {
  state: CustomDatePickerState;
  setState: React.Dispatch<React.SetStateAction<CustomDatePickerState>>;
  handleDateChanges: (date: string) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  state,
  setState,
  handleDateChanges
}) => {
  const handleDateChange = (date: Date | null) => {
    setState({ selectedDate: date });
    const ukBaseFormat = date && ukDateFormat(date, false);
    ukBaseFormat && handleDateChanges(ukBaseFormat);
  };

  const today = new Date(); // Get current date in YYYY-MM-DD format

  return (
    <div className="react-datepicker__input-container">
      <DatePicker
        minDate={today}
        selected={state.selectedDate}
        className="red-border"
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/MM/YYYY"
      />
    </div>
  );
};

export default CustomDatePicker;
