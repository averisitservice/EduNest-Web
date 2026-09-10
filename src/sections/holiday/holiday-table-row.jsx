import {
  Box,
  Chip,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import dateHelper from 'src/utils/dateHelper';

// ----------------------------------------------------------------------

const TYPE_COLOR_MAP = {
  NATIONAL: 'error',
  FESTIVAL: 'warning',
  SCHOOL_EVENT: 'info',
  VACATION: 'secondary',
  OTHER: 'default',
};

const TYPE_LABEL_MAP = {
  NATIONAL: 'National Holiday',
  FESTIVAL: 'Festival',
  SCHOOL_EVENT: 'School Event',
  VACATION: 'Vacation / Break',
  OTHER: 'Other',
};

export function HolidayTableRow({ row, selected, onEditRow, onDeleteRow }) {
  const startDateFormatted = row && row.startDate ? dateHelper.formatDate(row.startDate) : '-';
  const endDateFormatted = row && row.endDate ? dateHelper.formatDate(row.endDate) : '-';

  const dateDisplay =
    row && row.startDate && row.endDate && row.startDate !== row.endDate
      ? `${startDateFormatted} - ${endDateFormatted}`
      : startDateFormatted;

  const holidayType = row && row.holidayType ? row.holidayType : 'OTHER';
  const chipColor = TYPE_COLOR_MAP[holidayType] || 'default';
  const chipLabel = TYPE_LABEL_MAP[holidayType] || holidayType.replace('_', ' ');

  return (
    <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
      <TableCell sx={{ fontWeight: 'medium' }}>
        {row && row.holidayName ? row.holidayName : '-'}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {dateDisplay}
      </TableCell>

      <TableCell>
        <Chip
          label={chipLabel}
          size="small"
          color={chipColor}
          variant="soft"
        />
      </TableCell>

      <TableCell>
        <Box
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'text.secondary',
            typography: 'body2',
            maxWidth: 320,
          }}
        >
          {row && row.description ? row.description : '-'}
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
