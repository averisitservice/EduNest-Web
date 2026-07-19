import {
  Box,
  Button,
  Card,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { useSetState } from 'minimal-shared/hooks';
import { useCallback, useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import {
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

import { StudentTableRow } from '../student-table-row';

const FILTEREDTABLEHEAD = [
  { id: 'studentName', label: 'Name', width: '20%' },
  { id: 'mobileNo', label: 'Phone', width: '15%' },
  { id: 'parent', label: 'Parent', width: '20%', sortBy: false },
  { id: 'classId', label: 'Class', width: '15%', sortBy: false },
  { id: 'rollNo', label: 'Roll No', width: '10%', sortBy: false },
  { id: 'updatedDate', label: 'Last Update', width: '15%' },
];

const TABLEHEAD = [
  ...FILTEREDTABLEHEAD,
  { id: '', label: 'Action', width: '10%', sortBy: false, sx: { textAlign: 'center' } },
];

// Parse the "classId-sectionId" filter value into ids the API understands.
function parseClassSection(value) {
  if (!value) return { classId: null, sectionId: null };
  const [c, s] = value.split('-');
  return {
    classId: c ? Number(c) : null,
    sectionId: s && s !== 'null' ? Number(s) : null,
  };
}

export function StudentListView() {
  const table = useTable({ defaultOrderBy: 'updatedDate', defaultOrder: 'desc' });
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [classMasters, setClassMasters] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const filters = useSetState({ search: '', classSection: '' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const { page, rowsPerPage, order, orderBy } = table;
  const { classSection } = currentFilters;

  useEffect(() => {
    (async () => {
      const { data } = await ApiService.getAllClassMasterSectionsAsync();
      if (data) setClassMasters(data);
    })();
  }, []);

  // Debounce the search box so we don't hit the server on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(currentFilters.search), 400);
    return () => clearTimeout(timer);
  }, [currentFilters.search]);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    const { classId, sectionId } = parseClassSection(classSection);
    const { data } = await ApiService.getStudentListAsync({
      page,
      size: rowsPerPage,
      search: debouncedSearch,
      classId,
      sectionId,
      sortBy: orderBy,
      sortDir: order,
    });
    setTableData(data?.content ?? []);
    setTotalCount(data?.totalElements ?? 0);
    setIsLoading(false);
  }, [page, rowsPerPage, order, orderBy, debouncedSearch, classSection]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Reset to the first page whenever a filter changes.
  useEffect(() => {
    table.onResetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, classSection]);

  const handleFilterChange = (newValue, key = 'search') => {
    updateFilters({ [key]: newValue });
  };

  const onDeleteRow = useCallback(
    async (studentId) => {
      const { data, errors } = await ApiService.deleteStudentAsync(studentId);
      if (data) {
        toast.success('Student deleted successfully.');
        fetchStudents();
      } else if (errors) {
        toast.error(errors[0].msg);
      }
      return data;
    },
    [fetchStudents]
  );

  const notFound = !isLoading && tableData.length === 0;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Manage Students"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Student', href: paths.dashboard.student.list },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.student.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Student
          </Button>
        }
        sx={{ mb: { xs: 2, md: 2 } }}
      />
      <Card>
        <TableToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          placeholder="Search By Name or Roll No or Parent"
        >
          <Select
            name="classSection"
            size="small"
            sx={{ mr: 2, minWidth: 160, textAlign: 'left' }}
            value={filters.state.classSection ?? ''}
            onChange={(e) => handleFilterChange(e.target.value, 'classSection')}
            displayEmpty
          >
            <MenuItem value="">
              <em>All Classes</em>
            </MenuItem>
            {classMasters.map((option) => (
              <MenuItem
                key={`${option.classId}-${option.sectionId ?? 'null'}`}
                value={`${option.classId}-${option.sectionId ?? 'null'}`}
              >
                {option.sectionName
                  ? `${option.className} - ${option.sectionName}`
                  : option.className}
              </MenuItem>
            ))}
          </Select>
        </TableToolbar>
        <TableContainer sx={{ height: 'calc(100vh - 40vh)' }}>
          <Box sx={{ position: 'relative' }}>
            <Table stickyHeader aria-label="sticky table" size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLEHEAD}
                rowCount={tableData.length}
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
                  <TableNoData label="No student found." notFound={notFound} />
                  {tableData.map((row) => (
                    <StudentTableRow
                      key={row.studentId}
                      row={row}
                      selected={table.selected.includes(row.studentId)}
                      onDeleteRow={() => onDeleteRow(row.studentId)}
                    />
                  ))}
                </TableBody>
              )}
            </Table>
          </Box>
        </TableContainer>
        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={totalCount}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
