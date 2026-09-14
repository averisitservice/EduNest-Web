import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { formatPatterns } from 'src/utils/format-time';
import constants from 'src/utils/constants';
import { MobileTimePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export function RHFDatePicker({
  name,
  slotProps,
  allowPastDates = false,
  allowFutureDates = false,
  disabled = false,
  minDateValue,
  ...other
}) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        useEffect(() => {
          if (!field.value) {
            field.onChange(dayjs().format('YYYY-MM-DD'));
          }
        }, []);

        const helperText = (error && error.message)
          ? error.message
          : (slotProps && slotProps.textField && slotProps.textField.helperText)
          ? slotProps.textField.helperText
          : undefined;

        const textFieldSlot = (slotProps && slotProps.textField) ? slotProps.textField : {};

        return (
          <DatePicker
            {...field}
            value={field.value ? dayjs(field.value) : dayjs()}
            onChange={(newValue) => {
              if (disabled) return;
              const formatted = newValue && newValue.isValid() ? newValue.format('YYYY-MM-DD') : null;
              field.onChange(formatted);
            }}
            format={constants.dateFormat}
            minDate={minDateValue ? dayjs(minDateValue) : allowPastDates ? undefined : dayjs()}
            maxDate={allowFutureDates ? undefined : dayjs().subtract(0, 'day')}
            slotProps={{
              ...slotProps,
              openPickerButton: {
                disabled: disabled,
              },
              textField: {
                fullWidth: true,
                disabled: disabled,
                error: !!error,
                helperText,
                ...textFieldSlot,
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMobileDateTimePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const helperText = (error && error.message)
          ? error.message
          : (slotProps && slotProps.textField && slotProps.textField.helperText)
          ? slotProps.textField.helperText
          : undefined;

        const textFieldSlot = (slotProps && slotProps.textField) ? slotProps.textField : {};

        return (
          <MobileDateTimePicker
            {...field}
            value={field.value ? dayjs(field.value) : dayjs()}
            onChange={(newValue) => field.onChange(dayjs(newValue).format())}
            format={formatPatterns.split.dateTime}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText,
                ...textFieldSlot,
              },
              ...slotProps,
            }}
            {...other}
          />
        );
      }}
    />
  );
}

export function RHFMobileTimePicker({ name, slotProps, disabled = false, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const displayValue = field.value ? dayjs(field.value, constants.timeFormat) : null;

        const helperText = (error && error.message)
          ? error.message
          : (slotProps && slotProps.textField && slotProps.textField.helperText)
          ? slotProps.textField.helperText
          : undefined;

        const textFieldSlot = (slotProps && slotProps.textField) ? slotProps.textField : {};

        return (
          <MobileTimePicker
            {...field}
            value={displayValue}
            onChange={(newValue) => {
              const formatted =
                newValue && dayjs(newValue).isValid()
                  ? dayjs(newValue).format(constants.timeFormat)
                  : null;
              field.onChange(formatted);
            }}
            slotProps={{
              ...slotProps,
              textField: {
                fullWidth: true,
                disabled: disabled,
                error: !!error,
                helperText,
                ...textFieldSlot,
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}
