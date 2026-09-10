import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  Select,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  LinearProgress,
  FormControl,
} from '@mui/material';
import { useSetState } from 'minimal-shared/hooks';
import { paths } from 'src/routes/paths';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { TableToolbar } from 'src/sections/table-toolbar';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';

import { HolidayFormDialog } from '../holiday-form-dialog';
import { HolidayTableRow } from '../holiday-table-row';

// ----------------------------------------------------------------------

const FILTEREDTABLEHEAD = [
  { id: 'holidayName', label: 'Holiday Name', width: '25%' },
  { id: 'startDate', label: 'Date / Period', width: '20%' },
  { id: 'holidayType', label: 'Type', width: '15%' },
  { id: 'description', label: 'Description', width: '30%', sortBy: false },
];

const TABLEHEAD = [
  ...FILTEREDTABLEHEAD,
  { id: '', label: 'Action', width: '10%', sortBy: false, sx: { textAlign: 'center' } },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'NATIONAL', label: 'National Holiday' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'SCHOOL_EVENT', label: 'School Event' },
  { value: 'VACATION', label: 'Vacation / Break' },
  { value: 'OTHER', label: 'Other' },
];

export function HolidaysView() {
  const table = useTable({ defaultOrderBy: 'startDate', defaultOrder: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const [holidays, setHolidays] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [formHoliday, setFormHoliday] = useState(null);
  const [deleteHoliday, setDeleteHoliday] = useState(null);

  const filters = useSetState({ search: '', holidayType: '' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const loadHolidays = useCallback(async () => {
    setIsLoading(true);
    const res = await ApiService.getHolidayListAsync();
    setHolidays(res && res.data ? res.data : []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadHolidays();
  }, [loadHolidays]);

  const openNew = () => {
    setFormHoliday(null);
    setFormOpen(true);
  };

  const openEdit = (holiday) => {
    setFormHoliday(holiday);
    setFormOpen(true);
  };

  const handleDelete = async (holiday) => {
    if (!holiday) return;
    const res = await ApiService.deleteHolidayAsync(holiday.holidayId);
    if (res && res.data) {
      setHolidays((prev) => prev.filter((row) => row.holidayId !== holiday.holidayId));
      toast.success('Holiday deleted successfully.');
      table.onUpdatePageDeleteRow(holidays.length);
    } else if (res && res.errors && res.errors.length) {
      toast.error(res.errors[0].msg);
    }
    setDeleteHoliday(null);
  };

  const dataFiltered = useMemo(() => {
    const search = currentFilters.search ? currentFilters.search.trim().toLowerCase() : '';
    const holidayType = currentFilters.holidayType || '';

    const stabilizedThis = holidays.map((el, idx) => [el, idx]);
    stabilizedThis.sort((a, b) => {
      const order = getComparator(table.order, table.orderBy)(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    let result = stabilizedThis.map((el) => el[0]);

    if (search) {
      result = result.filter((row) => {
        const nameMatch = row && row.holidayName && row.holidayName.toLowerCase().includes(search);
        const descMatch = row && row.description && row.description.toLowerCase().includes(search);
        const typeMatch = row && row.holidayType && row.holidayType.toLowerCase().includes(search);
        return nameMatch || descMatch || typeMatch;
      });
    }

    if (holidayType) {
      result = result.filter((row) => row && row.holidayType === holidayType);
    }

    return result;
  }, [holidays, currentFilters, table.order, table.orderBy]);

  const handleFilterChange = (newValue, key = 'search') => {
    updateFilters({ [key]: newValue });
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Holidays"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Holidays', href: paths.dashboard.holiday.root },
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openNew}
          >
            New Holiday
          </Button>
        }
        sx={{ mb: { xs: 2, md: 2 } }}
      />

      <Card>
        <TableToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          placeholder="Search Holiday..."
        >
          <FormControl sx={{ minWidth: 160 }}>
            <Select
              name="holidayType"
              size="small"
              value={currentFilters.holidayType || ''}
              onChange={(e) => handleFilterChange(e.target.value, 'holidayType')}
              displayEmpty
            >
              {TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableToolbar>

        <TableContainer sx={{ height: 'calc(100vh - 40vh)' }}>
          <Box sx={{ position: 'relative' }}>
            <Table stickyHeader aria-label="sticky table" size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLEHEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              {isLoading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={TABLEHEAD.length}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          width: '100%',
                        }}
                      >
                        <Stack alignItems="center" justifyContent="center" sx={{ width: '100%', py: 5 }}>
                          <LinearProgress sx={{ width: '50%', maxWidth: 360 }} />
                        </Stack>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  <TableNoData label="No holiday found." notFound={dataFiltered.length <= 0} />
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <HolidayTableRow
                        key={row.holidayId}
                        row={row}
                        selected={table.selected.includes(row.holidayId)}
                        onEditRow={() => openEdit(row)}
                        onDeleteRow={() => setDeleteHoliday(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 76}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />
                </TableBody>
              )}
            </Table>
          </Box>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <HolidayFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        holiday={formHoliday}
        onSuccess={loadHolidays}
      />

      <ConfirmDialog
        open={Boolean(deleteHoliday)}
        onClose={() => setDeleteHoliday(null)}
        title="Delete Holiday"
        content={
          deleteHoliday && deleteHoliday.holidayName ? (
            <>
              Are you sure you want to delete <strong>{deleteHoliday.holidayName}</strong>?
            </>
          ) : (
            'Are you sure you want to delete this holiday?'
          )
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(deleteHoliday);
            }}
          >
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
