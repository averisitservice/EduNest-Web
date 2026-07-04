import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

export function RHFAutocomplete({ name, label, slotProps, helperText, placeholder, ...other }) {
  const { control, setValue, watch } = useFormContext();
  const value = watch(name);
  const { textfield, ...otherSlotProps } = slotProps ?? {};

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          id={`rhf-autocomplete-${name}`}
          disableClearable={other.disableClearable ?? (!value || value.length === 0)}
          value={other.options?.find((opt) => opt.value === field.value) || null}
          onChange={(_, newValue) => field.onChange(newValue ? newValue.value : '')}
          getOptionLabel={(option) => {
            if (!option) return '';
            if (typeof option === 'string') return option;
            return option.label || '';
          }}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              {...textfield}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message ?? helperText}
              slotProps={{
                ...textfield?.slotProps,
                htmlInput: {
                  ...params.inputProps,
                  autoComplete: 'off',
                  ...textfield?.slotProps?.htmlInput,
                },
              }}
            />
          )}
          {...other}
          {...otherSlotProps}
        />
      )}
    />
  );
}
