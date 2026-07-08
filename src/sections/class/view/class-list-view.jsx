import {
  Box,
  Button,
  Card,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import { useSetState } from 'minimal-shared/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
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
import { DashboardContent } from 'src/layouts/dashboard';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { TableToolbar } from 'src/sections/table-toolbar';
import ApiService from 'src/services/ApiService';
import { ClassTableRow } from '../class-table-row';
import { ClassDialog } from '../class-dialog';


const FILTEREDTABLEHEAD = [
  { id: 'className', label: 'Class Name' },
  { id: 'annualFee', label: 'Annual Fee' },
  { id: 'updatedDate', label: 'Last Updated' },
];

const TABLEHEAD = [
  ...FILTEREDTABLEHEAD,
  { id: '', label: 'Action', sortBy: false, sx: { textAlign: 'center' } },
];

export function ClassListView() {
  const table = useTable({ defaultOrderBy: 'updatedDate', defaultOrder: 'desc' });
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const filters = useSetState({
    search: '',
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const dataInPage = rowInPage(
    tableData,
    table.page,
    table.rowsPerPage
  );

  useEffect(() => {
    getClassList();
  }, []);

  const getClassList = async () => {
    setIsLoading(true);
    const { data } = await ApiService.getClassListAsync();
    if (data) {
      setTableData(data);
    }
    setIsLoading(false);
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const handleFilterChange = (value) => {
    updateFilters({ search: value });
    table.onResetPage();
  };

  const OpenDialog = () => {
    setOpenDialog(true);
  };

  const toggleOpenDialog = () => setOpenDialog(!openDialog);

  const handleRefresh = () => {
    getClassList();
  };

  const onDeleteRow = useCallback(
    async (classId) => {
      const { data, errors } = await ApiService.deleteClassAsync(classId);
      if (data) {
        setTableData((prev) =>
          prev.filter((row) => row.classId !== classId)
        );
        toast.success('Class deleted successfully.');
        table.onUpdatePageDeleteRow(dataInPage.length);
      } else if (errors) {
        toast.error(errors[0].msg);
      }
      return data;
    },
    [table, dataInPage.length]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Manage Class"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Class', href: paths.dashboard.class.list },
        ]}
        action={
          <Button
            component={RouterLink}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={OpenDialog}
          >
            New Class
          </Button>
        }
        sx={{ mb: 2 }}
      />

      <Card>
        <TableToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          placeholder="Search Class"
        />

        <TableContainer sx={{ height: 'calc(100vh - 40vh)' }}>
          <Box sx={{ position: 'relative' }}>
            <Table
              stickyHeader
              size={table.dense ? 'small' : 'medium'}
            >
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
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ py: 5 }}
                      >
                        <LinearProgress
                          sx={{
                            width: '50%',
                            maxWidth: 300,
                          }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  <TableNoData
                    notFound={dataFiltered.length === 0}
                    label="No Class Found."
                  />

                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage +
                      table.rowsPerPage
                    )
                    .map((row) => (
                      <ClassTableRow
                        key={row.classId}
                        row={row}
                        selected={table.selected.includes(
                          row.classId
                        )}
                        onDeleteRow={() =>
                          onDeleteRow(row.classId)
                        }
                        onSuccess={handleRefresh}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 76}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      dataFiltered.length
                    )}
                  />
                </TableBody>
              )}
            </Table>
          </Box>
        </TableContainer>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={
            table.onChangeRowsPerPage
          }
          onChangeDense={table.onChangeDense}
        />
      </Card>
      <ClassDialog
        open={openDialog}
        onClose={toggleOpenDialog}
        onSuccess={handleRefresh}
      />
    </DashboardContent>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { search } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  let filteredData = stabilizedThis.map((el) => el[0]);

  if (search) {
    const lower = search.toLowerCase();
    filteredData = filteredData.filter((item) =>
      [item.className]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(lower)
        )
    );
  }
  return filteredData;
}
