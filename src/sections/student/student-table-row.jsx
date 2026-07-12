import { LoadingButton } from '@mui/lab';
import { Avatar, Box, IconButton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useBoolean } from 'minimal-shared/hooks';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import dateHelper from 'src/utils/dateHelper';
import utils from 'src/utils/utils';

export function StudentTableRow({ row, selected, onDeleteRow }) {
  const confirmDialog = useBoolean();
  const [loading, setLoading] = useState(false);

  const studentName = row.studentName || `${row.firstName} ${row.lastName}`;

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Student"
      content={<>Are you sure want to delete {studentName}?</>}
      action={
        <LoadingButton
          variant="contained"
          color="error"
          loading={loading}
          onClick={() => {
            utils.handleConfirmDelete({
              setLoading,
              onDeleteRow,
              confirmDialog,
            });
          }}
        >
          Delete
        </LoadingButton>
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt={studentName}
              src={row.imagePath}
              sx={{ bgcolor: 'primary.main', color: 'white' }}
            >
              {studentName.charAt(0).toUpperCase()}
            </Avatar>
            <Stack sx={{ flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit', typography: 'body2' }}>
                {studentName}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit' }}>
                {row.email || '-'}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit' }}>
                {row.mobileNo || '-'}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit' }}>
                {row.className
                  ? row.sectionName
                    ? `${row.className} - ${row.sectionName}`
                    : row.className
                  : '-'}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'inherit' }}>
                {row.rollNo || '-'}
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
                {row.updatedDate ? dateHelper.formatDateTime(row.updatedDate) : '-'}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton
                component={RouterLink}
                href={paths.dashboard.student.edit(row.studentId)}
                color="primary"
              >
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
      {renderConfirmDialog()}
    </>
  );
}
