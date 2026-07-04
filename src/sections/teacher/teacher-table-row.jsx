import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useBoolean } from 'minimal-shared/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import dateHelper from 'src/utils/dateHelper';
import enums from 'src/utils/enums';
import utils from 'src/utils/utils';


export function TeacherTableRow({ row, selected, onDeleteRow, isProfile }) {  
  const confirmDialog = useBoolean();
  const authDialog = useBoolean();
  const confirmWorkingHoursDialog = useBoolean();
  const [loading, setLoading] = useState(false);

  console.log(row);
  

  const methods = useForm({
    defaultValues: {
      authChoice: 'backup',
    },
  });

  const { watch } = methods;

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Staff Member"
      content={
        <>
          Are you sure want to delete {row.name}?
        </>
      }
      action={
        <LoadingButton variant="contained" color="error" loading={loading}
          onClick={() => {
            utils.handleConfirmDelete({
              setLoading, onDeleteRow, confirmDialog
            });
          }}
        >
          Delete
        </LoadingButton >
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt={row.teacherName}
              src={row.imagePath}
              sx={{ bgcolor: 'primary.main', color: 'white' }}
            >
              {row.teacherName.charAt(0).toUpperCase()}
            </Avatar>
            <Stack sx={{ flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit', typography: 'body2' }}>
                {`${row.teacherName}`}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit' }}>
                {row.email}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit' }}>
                {row.mobileNo}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit' }}>
                {enums.displayRole[row.roleId]}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit', typography: 'body2' }}>
                {row.lastLoginOn ? `${dateHelper.formatDateTime(row.lastLoginOn)}` : '-'}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit', typography: 'body2' }}>
                {row.updatedBy ?? ''}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {dateHelper.formatDateTime(row.updatedDate)}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          {!isProfile && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Tooltip title="Edit" placement="top" arrow>
                <IconButton
                  color="primary">
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" placement="top" arrow>
                <IconButton color="error" onClick={() => confirmDialog.onTrue()}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </TableCell>
      </TableRow>
      {renderConfirmDialog()}
    </>
  );
}
