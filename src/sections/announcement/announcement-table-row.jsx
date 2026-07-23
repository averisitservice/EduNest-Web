import { Box, TableRow, TableCell, Tooltip, IconButton, Chip, Stack } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import dateHelper from 'src/utils/dateHelper';

const AUDIENCE_COLOR = {
  ALL: 'default',
  TEACHERS: 'info',
  PARENTS: 'warning',
  STUDENTS: 'success',
};

export function AnnouncementTableRow({ row, onEditRow, onDeleteRow }) {
  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: 'medium' }}>{row.title}</TableCell>
      <TableCell>
        <Box
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'text.secondary',
            whiteSpace: 'pre-line',
            maxHeight: 40,
          }}
        >
          {row.message}
        </Box>
      </TableCell>
      <TableCell>
        <Chip size="small" label={row.audience} color={AUDIENCE_COLOR[row.audience] || 'default'} />
      </TableCell>
      <TableCell>
        <Box sx={{ whiteSpace: 'nowrap' }}>
          {row.publishDate ? dateHelper.formatDate(row.publishDate) : '-'}
        </Box>
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
