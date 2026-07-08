import { LoadingButton } from '@mui/lab';
import {
  Box,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip
} from '@mui/material';
import { useBoolean } from 'minimal-shared/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import dateHelper from 'src/utils/dateHelper';
import utils from 'src/utils/utils';
import { ClassDialog } from './class-dialog';


export function ClassTableRow({ row, selected, onDeleteRow, handleRefresh }) {
  const confirmDialog = useBoolean();
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      authChoice: 'backup',
    },
  });

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Teacher"
      content={
        <>
          Are you sure want to delete {row.className}?
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
            <Stack sx={{ flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit', typography: 'body2' }}>
                {`${row.className}`}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit', typography: 'body2' }}>
                {row.annualFee}
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

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton onClick={() => setEditId(row.classId)} color="primary">
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top" arrow>
              <IconButton color="error" onClick={() => confirmDialog.onTrue()}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <ClassDialog
        open={Boolean(editId)}
        onClose={() => setEditId(null)}
        id={editId}
        onSuccess={handleRefresh}
      />
      {renderConfirmDialog()}
    </>
  );
}
