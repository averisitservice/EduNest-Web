import { Box, TableRow, TableCell, Tooltip, IconButton, Chip, Stack } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import dateHelper from 'src/utils/dateHelper';

const AUDIENCE_COLOR = {
  ALL: 'default',
  TEACHERS: 'info',
  PARENTS: 'warning',
  STUDENTS: 'success',
};

const TYPE_COLOR = {
  GENERAL: 'default',
  HOLIDAY: 'error',
  EXAM: 'warning',
  SPORTS: 'success',
  CULTURAL: 'secondary',
  MEETING: 'info',
};

function formatSchedule(row) {
  const start = row.startDate ? dateHelper.formatDate(row.startDate) : '-';
  const end =
    row.endDate && row.endDate !== row.startDate ? dateHelper.formatDate(row.endDate) : '';
  return end ? `${start} - ${end}` : start;
}

function formatTime(row) {
  if (row.isAllDay) return 'All day';
  if (!row.startTime) return '-';
  return row.endTime ? `${row.startTime} - ${row.endTime}` : row.startTime;
}

export function EventTableRow({ row, onEditRow, onDeleteRow }) {
  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: 'medium' }}>{row.title}</TableCell>
      <TableCell>
        <Chip
          size="small"
          label={row.eventType || 'GENERAL'}
          color={TYPE_COLOR[row.eventType] || 'default'}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ whiteSpace: 'nowrap' }}>{formatSchedule(row)}</Box>
        <Box component="span" sx={{ color: 'text.disabled', typography: 'caption' }}>
          {formatTime(row)}
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ color: 'text.secondary' }}>{row.venue || '-'}</Box>
      </TableCell>
      <TableCell>
        <Chip size="small" label={row.audience} color={AUDIENCE_COLOR[row.audience] || 'default'} />
      </TableCell>
      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Stack sx={{ flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box component="span" sx={{ color: 'inherit', typography: 'body2' }}>
              {row.updatedBy || ''}
            </Box>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.updatedDate ? dateHelper.formatDateTime(row.updatedDate) : '-'}
            </Box>
          </Stack>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton color="primary" onClick={onEditRow}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top" arrow>
            <IconButton color="error" onClick={onDeleteRow}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
}
