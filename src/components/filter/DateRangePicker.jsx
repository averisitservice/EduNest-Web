import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateHelper from 'src/utils/dateHelper';

export default function DateRangePicker({
  showDateRangePicker,
  onDateChanges,
  minDate,
  maxDate,
  resetDuration,
  sDate,
  eDate,
}) {
  const [startDate, setStartDate] = useState(sDate);
  const [endDate, setEndDate] = useState(eDate);
  const [textValue, setTextValue] = useState('mm/dd/yyyy - mm/dd/yyyy');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (sDate || eDate) {
      setStartDate(sDate);
      setEndDate(eDate);
      if (sDate && eDate) {
        setTextValue(`${dateHelper.formatDate(sDate)} - ${dateHelper.formatDate(eDate)}`);
      }
    }
  }, [sDate, eDate]);

  useEffect(() => {
    if (showDateRangePicker && resetDuration) {
      setStartDate(null);
      setEndDate(null);
      setTextValue('mm/dd/yyyy - mm/dd/yyyy');
    }
    if (startDate === null && endDate === null) {
      setIsDatePickerOpen(true);
    }
  }, [showDateRangePicker, resetDuration]);

  const onDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setIsDatePickerOpen(false);
      setTextValue(`${dateHelper.formatDate(start)} - ${dateHelper.formatDate(end)}`);
      onDateChanges(start, end);
    }
  };

  if (!showDateRangePicker) return null;

  return (
    <DatePicker
      open={isDatePickerOpen}
      selected={startDate}
      onChange={onDateChange}
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      maxDate={maxDate}
      dateFormat={'MM/dd/yyyy'}
      selectsRange
      showYearDropdown
      showMonthDropdown
      customInput={
        <TextField
          label="Between"
          variant="standard"
          value={textValue}
          sx={{ width: 200 }}
          InputProps={{
            onFocus: () => setIsDatePickerOpen(true),
          }}
        />
      }
    />
  );
}
