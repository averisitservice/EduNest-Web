import { Controller, useFormContext } from 'react-hook-form';

import { PhoneInput } from '../phone-input';

// ----------------------------------------------------------------------

export function RHFPhoneInput({ name, helperText, disableCountryCode = false, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PhoneInput
          {...field}
          fullWidth
          value={field.value ?? ''}
          onChange={(val) => field.onChange(val ?? '')}
          error={!!error}
          helperText={error?.message ?? helperText}
          autoComplete="new-password"
          disableCountryCode={disableCountryCode}
          {...other}
        />
      )}
    />
  );
}
