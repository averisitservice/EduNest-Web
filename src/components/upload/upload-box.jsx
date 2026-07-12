import Box from '@mui/material/Box';
import { mergeClasses, varAlpha } from 'minimal-shared/utils';
import { useDropzone } from 'react-dropzone';

import { Iconify } from '../iconify';
import { HelperText } from '../hook-form/help-text';

import { uploadClasses } from './classes';

// ----------------------------------------------------------------------

export function UploadBox({
  placeholder,
  helperText,
  error,
  disabled,
  className,
  isLoading,
  sx,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'model/stl': ['.stl'],
      'application/sla': ['.stl'],
    },
    ...other,
  });

  const hasError = isDragReject || error;

  return (
    <>
      <Box
        {...getRootProps()}
        className={mergeClasses([uploadClasses.uploadBox, className])}
        sx={[
          (theme) => ({
            width: 64,
            height: 64,
            flexShrink: 0,
            display: 'flex',
            borderRadius: 1,
            cursor: 'pointer',
            alignItems: 'center',
            color: 'text.disabled',
            justifyContent: 'center',
            bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            border: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            ...(isDragActive && { opacity: 0.72 }),
            ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
            ...(hasError && {
              color: 'error.main',
              borderColor: 'error.main',
              bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
            }),
            '&:hover': { opacity: 0.72 },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <input {...getInputProps()} />

        {placeholder || (
          <Iconify icon={isLoading ? 'codex:loader' : 'eva:cloud-upload-fill'} width={28} />
        )}
      </Box>
      {helperText ? helperText : null}

      {hasError ? (
        <HelperText errorMessage="This File can not be uploaded." color={'warning'} mt={-8} />
      ) : null}
    </>
  );
}
