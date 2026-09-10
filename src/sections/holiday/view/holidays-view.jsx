import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  TableBody,
  TableContainer,
  LinearProgress,
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
  rowInPage,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';

import { HolidayFormDialog } from '../holiday-form-dialog';
import { HolidayTableRow } from '../holiday-table-row';

// ----------------------------------------------------------------------

const TABLEHEAD = [
  { id: 'holidayName', label: 'Holiday Name', width: '35%' },
  { id: 'startDate', label: 'Date / Period', width: '30%' },
  { id: 'holidayType', label: 'Type', width: '20%' },
  { id: '', label: 'Action', width: '15%', sortBy: false, sx: { textAlign: 'center' } },
];

export function HolidaysView() {
  const table = useTable({ defaultOrderBy: 'startDate', defaultOrder: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const [holidays, setHolidays] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [formHoliday, setFormHoliday] = useState(null);
  const [deleteHoliday, setDeleteHoliday] = useState(null);

  const filters = useSetState({ search: '' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataInPage = rowInPage(holidays, table.page, table.rowsPerPage);

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
      toast.success('Holiday deleted.');
      table.onUpdatePageDeleteRow(dataInPage.length);
    } else if (res && res.errors && res.errors.length) {
      toast.error(res.errors[0].msg);
    }
    setDeleteHoliday(null);
  };

  const dataFiltered = useMemo(() => {
    let result = holidays;
    const searchTrim = currentFilters.search ? currentFilters.search.trim().toLowerCase() : '';

    if (searchTrim) {
      result = result.filter(
        (row) =>
          (row.holidayName && row.holidayName.toLowerCase().includes(searchTrim)) ||
          (row.holidayType && row.holidayType.toLowerCase().includes(searchTrim)) ||
          (row.description && row.description.toLowerCase().includes(searchTrim))
      );
    }

    result = [...result].sort(getComparator(table.order, table.orderBy));
    return result;
  }, [holidays, currentFilters.search, table.order, table.orderBy]);

  const canReset = !!currentFilters.search;
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilterChange = (value, field) => {
    if (field === 'search') {
      updateFilters({ search: value });
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Holidays"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Holidays' },
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
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <TableToolbar
          placeholder="Search holiday..."
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {isLoading && <LinearProgress />}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 700 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLEHEAD}
              onSort={table.onSort}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <HolidayTableRow
                    key={row.holidayId}
                    row={row}
                    onEditRow={() => openEdit(row)}
                    onDeleteRow={() => setDeleteHoliday(row)}
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 56 : 76}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
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
        open={!!deleteHoliday}
        onClose={() => setDeleteHoliday(null)}
        title="Delete Holiday"
        content={
          deleteHoliday ? (
            <>
              Are you sure you want to delete <strong>{deleteHoliday.holidayName}</strong>?
            </>
          ) : (
            ''
          )
        }
        action={
          <Button variant="contained" color="error" onClick={() => handleDelete(deleteHoliday)}>
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
