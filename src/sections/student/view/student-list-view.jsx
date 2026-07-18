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

import { StudentTableRow } from '../student-table-row';

const FILTEREDTABLEHEAD = [
  { id: 'studentName', label: 'Name', width: '20%' },
  { id: 'mobileNo', label: 'Phone', width: '15%' },
  { id: 'parent', label: 'Parent', width: '20%', sortBy: false },
  { id: 'classId', label: 'Class', width: '15%', sortBy: false },
  { id: 'rollNo', label: 'Roll No', width: '10%' },
  { id: 'updatedDate', label: 'Last Update', width: '15%' },
];

const TABLEHEAD = [
  ...FILTEREDTABLEHEAD,
  { id: '', label: 'Action', width: '10%', sortBy: false, sx: { textAlign: 'center' } },
];

export function StudentListView() {
  const table = useTable({ defaultOrderBy: 'updatedDate', defaultOrder: 'desc' });
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [classMasters, setClassMasters] = useState([]);
  const filters = useSetState({ search: '', classSection: '' });
  const dataInPage = rowInPage(tableData, table.page, table.rowsPerPage);

  const { state: currentFilters, setState: updateFilters } = filters;

  useEffect(() => {
    getStudentList();
    getClassMasters();
  }, []);

  const getStudentList = async () => {
    setIsLoading(true);
    try {
      const { data } = await ApiService.getStudentListAsync();
      if (data) {
        setTableData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getClassMasters = async () => {
    try {
      const { data } = await ApiService.getAllClassMasterSectionsAsync();
      if (data) {
        setClassMasters(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const dataFiltered = useMemo(() => {
    const { search, classSection } = currentFilters;
    const stabilizedThis = tableData.map((el, idx) => [el, idx]);
    stabilizedThis.sort((a, b) => {
      const order = getComparator(table.order, table.orderBy)(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    let filteredData = stabilizedThis.map((el) => el[0]);
    if (search) {
      const lower = search.toLowerCase();
      filteredData = filteredData.filter((student) => {
        const fullName = student.studentName || `${student.firstName} ${student.lastName}`;
        return (
          fullName.toLowerCase().includes(lower) ||
          (student.email && student.email.toLowerCase().includes(lower)) ||
          (student.rollNo && student.rollNo.toLowerCase().includes(lower)) ||
          (student.fatherName && student.fatherName.toLowerCase().includes(lower)) ||
          (student.parentMobile && student.parentMobile.toLowerCase().includes(lower))
        );
      });
    }
    if (classSection) {
      const [classId, sectionId] = classSection.split('-');
      const selectedOption = classMasters.find(
        (c) => c.classId == classId && (c.sectionId ?? 'null') == sectionId
      );

      filteredData = filteredData.filter((student) => {
        if (student.classId !== undefined && student.classId !== null) {
          const matchesClass = student.classId == classId;
          const matchesSection =
            sectionId === 'null' || !sectionId
              ? !student.sectionId || student.sectionId == 'null'
              : student.sectionId == sectionId;
          return matchesClass && matchesSection;
        }
        if (selectedOption) {
          const matchesClass = student.className === selectedOption.className;
          const matchesSection =
            sectionId === 'null' || !sectionId
              ? !student.sectionName
              : student.sectionName === selectedOption.sectionName;
          return matchesClass && matchesSection;
        }
        return false;
      });
    }
    return filteredData;
  }, [tableData, table.order, table.orderBy, currentFilters]);

  const handleFilterChange = (newValue, key = 'search') => {
    updateFilters({ [key]: newValue });
  };

  const onDeleteRow = useCallback(
    async (studentId) => {
      const { data, errors } = await ApiService.deleteStudentAsync(studentId);
      if (data) {
        setTableData((prevData) => prevData.filter((row) => row.studentId !== studentId));
        toast.success('Student deleted successfully.');
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
          placeholder={'Search By Name or Roll No or Parent'}
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
                  <TableNoData label="No student found." notFound={dataFiltered.length <= 0} />
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <StudentTableRow
                        key={row.studentId}
                        row={row}
                        selected={table.selected.includes(row.studentId)}
                        onDeleteRow={() => onDeleteRow(row.studentId)}
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
