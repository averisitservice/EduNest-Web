import dayjs from 'dayjs';
import {
  Stack,
  Chip,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const TYPE_COLOR_MAP = {
  NATIONAL: 'error',
  FESTIVAL: 'warning',
  SCHOOL_EVENT: 'info',
  VACATION: 'secondary',
  OTHER: 'default',
};

export function HolidayTableRow({ row, onEditRow, onDeleteRow }) {
  const startDateFormatted = row && row.startDate ? dayjs(row.startDate).format('DD MMM YYYY') : '-';
  const endDateFormatted = row && row.endDate ? dayjs(row.endDate).format('DD MMM YYYY') : '-';

  const dateDisplay =
    row && row.startDate && row.endDate && row.startDate !== row.endDate
      ? `${startDateFormatted} - ${endDateFormatted}`
      : startDateFormatted;

  const holidayType = row && row.holidayType ? row.holidayType : 'OTHER';
  const chipColor = TYPE_COLOR_MAP[holidayType] || 'default';

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {row && row.holidayName ? row.holidayName : '-'}
        </Typography>
        {row && row.description ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {row.description}
          </Typography>
        ) : null}
      </TableCell>

      <TableCell>{dateDisplay}</TableCell>

      <TableCell>
        <Chip
          label={holidayType.replace('_', ' ')}
          size="small"
          color={chipColor}
          variant="soft"
        />
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="Edit">
            <IconButton size="small" onClick={onEditRow}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={onDeleteRow}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
