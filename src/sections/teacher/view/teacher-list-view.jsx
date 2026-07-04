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
import { TeacherTableRow } from '../teacher-table-row';


const FILTEREDTABLEHEAD = [
  { id: 'teacherName', label: 'Name', width: '20%', },
  { id: 'email', label: 'Email', width: '20%' },
  { id: 'mobileNo', label: 'Phone', width: '15%' },
  { id: 'roleId', label: 'Role', width: '15%' },
  { id: 'lastLogin', label: 'Last Login', width: '15%', sortBy: false },
  { id: 'updatedDate', label: 'Last Update', width: '15%' },
];

const TABLEHEAD = [
  ...FILTEREDTABLEHEAD,
  { id: '', label: 'Action', width: '10%', sortBy: false, sx: { textAlign: 'center' } },
];

export function TeacherListView() {
  const table = useTable({ defaultOrderBy: 'updatedDate', defaultOrder: 'desc' });
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const filters = useSetState({ search: '' });
  const dataInPage = rowInPage(tableData, table.page, table.rowsPerPage);

  const { state: currentFilters, setState: updateFilters } = filters;

  useEffect(() => {
    getTeacherList();
  }, []);

  const getTeacherList = async () => {
    setIsLoading(true);
    const { data } = await ApiService.getTeacherListAsync();
    console.log(data);

    if (data) {
      setTableData(data);
    }
    setIsLoading(false);
  };

  const dataFiltered = useMemo(() => {
    const { search } = currentFilters;
    const stabilizedThis = tableData.map((el, idx) => [el, idx]);
    stabilizedThis.sort((a, b) => {
      const order = getComparator(table.order, table.orderBy)(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    let filteredData = stabilizedThis.map((el) => el[0]);
    if (search) {
      const lower = search.toLowerCase();
      filteredData = filteredData.filter((teacher) => {
        return (
          teacher.teacherName.toLowerCase().includes(lower) ||
          teacher.email.toLowerCase().includes(lower)
        );
      });
    }
    return filteredData;
  }, [tableData, table.order, table.orderBy, currentFilters]);

  const handleFilterChange = (newFilters) => {
    updateFilters({ search: newFilters });
  };

  const onRefresh = () => {
    getSpecialDayList();
  };

  const onDeleteRow = useCallback(
    async (materialId) => {
      const { data, errors } = await ApiService.deleteMaterialAsync(materialId);
      if (data) {
        setTableData((prevData) => prevData.filter((row) => row.materialId !== materialId));
        toast.success('Material deleted successfully.');
        table.onUpdatePageDeleteRow(dataInPage.length);
      }
      else if (errors) {
        toast.error(errors[0].msg);
      }
      return data;
    },
    [table, dataInPage.length]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Manage Teacher"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Teacher', href: paths.dashboard.teacher.list },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.teacher.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Teacher
          </Button>
        }
        sx={{ mb: { xs: 2, md: 2 } }}
      />
      <Card>
        <TableToolbar filters={filters} onFilterChange={handleFilterChange} placeholder={'Search By Name or Category '} />
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
                        <Stack alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
                          <LinearProgress sx={{ width: '50%', maxWidth: 360 }} />
                        </Stack>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  <TableNoData
                    label="No teacher found."
                    notFound={dataFiltered.length <= 0}
                  />
                  {dataFiltered.slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage).map((row) => (
                    <TeacherTableRow
                      key={row.materialId}
                      row={row}
                      selected={table.selected.includes(row.materialId)}
                      onDeleteRow={() => onDeleteRow(row.materialId)}
                      onSuccess={onRefresh}
                    />
                  ))}
                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />
                </TableBody>
              )}
            </Table>
          </Box>
        </TableContainer>
        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={filters ? dataFiltered.length : tableData.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
