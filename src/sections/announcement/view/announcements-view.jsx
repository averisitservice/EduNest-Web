import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  Select,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
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

import { NoticeFormDialog } from '../notice-form-dialog';
import { AnnouncementTableRow } from '../announcement-table-row';

const FILTEREDTABLEHEAD = [
  { id: 'title', label: 'Title', width: '20%' },
  { id: 'message', label: 'Message', width: '35%', sortBy: false },
  { id: 'audience', label: 'Audience', width: '15%' },
  { id: 'publishDate', label: 'Publish Date', width: '15%' },
  { id: 'updatedDate', label: 'Last Update', width: '15%' },
];

const TABLEHEAD = [
  ...FILTEREDTABLEHEAD,
  { id: '', label: 'Action', width: '10%', sortBy: false, sx: { textAlign: 'center' } },
];

export function AnnouncementsView() {
  const table = useTable({ defaultOrderBy: 'updatedDate', defaultOrder: 'desc' });
  const [isLoading, setIsLoading] = useState(false);
  const [notices, setNotices] = useState([]);
  const [classes, setClasses] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [formNotice, setFormNotice] = useState(null);
  const [deleteNotice, setDeleteNotice] = useState(null);

  const filters = useSetState({ search: '', classId: '' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataInPage = rowInPage(notices, table.page, table.rowsPerPage);

  const loadNotices = useCallback(async () => {
    setIsLoading(true);
    const res = await ApiService.getAnnouncementListAsync();
    setNotices(res && res.data ? res.data : []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadNotices();
    (async () => {
      const res = await ApiService.getClassListAsync();
      setClasses(res && res.data ? res.data : []);
    })();
  }, [loadNotices]);

  const openNew = () => {
    setFormNotice(null);
    setFormOpen(true);
  };

  const openEdit = (notice) => {
    setFormNotice(notice);
    setFormOpen(true);
  };

  const handleDelete = async (notice) => {
    if (!notice) return;
    const res = await ApiService.deleteAnnouncementAsync(notice.announcementId);
    if (res && res.data) {
      setNotices((prev) => prev.filter((row) => row.announcementId !== notice.announcementId));
      toast.success('Notice deleted.');
      table.onUpdatePageDeleteRow(dataInPage.length);
    } else if (res && res.errors && res.errors.length) {
      toast.error(res.errors[0].msg);
    }
  };

  const dataFiltered = useMemo(() => {
    const { search, classId } = currentFilters;
    const stabilizedThis = notices.map((el, idx) => [el, idx]);
    stabilizedThis.sort((a, b) => {
      const order = getComparator(table.order, table.orderBy)(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    let filteredData = stabilizedThis.map((el) => el[0]);
    if (search) {
      const lower = search.toLowerCase();
      filteredData = filteredData.filter((notice) => {
        return (
          (notice.title && notice.title.toLowerCase().includes(lower)) ||
          (notice.message && notice.message.toLowerCase().includes(lower))
        );
      });
    }
    if (classId) {
      filteredData = filteredData.filter((notice) => {
        return notice.classId == classId;
      });
    }
    return filteredData;
  }, [notices, table.order, table.orderBy, currentFilters]);

  const handleFilterChange = (newValue, key = 'search') => {
    updateFilters({ [key]: newValue });
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Announcements"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Announcements', href: paths.dashboard.announcement.root },
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openNew}
          >
            New Notice
          </Button>
        }
        sx={{ mb: { xs: 2, md: 2 } }}
      />

      <Card>
        <TableToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          placeholder="Search By Title or Message"
        ></TableToolbar>

        <TableContainer sx={{ height: 'calc(100vh - 40vh)' }}>
          <Box sx={{ position: 'relative' }}>
            <Table stickyHeader size={table.dense ? 'small' : 'medium'}>
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
                    label="No announcements found."
                    notFound={dataFiltered.length <= 0}
                  />
                  {dataFiltered.map((row) => (
                    <AnnouncementTableRow
                      key={row.announcementId}
                      row={row}
                      onEditRow={() => openEdit(row)}
                      onDeleteRow={() => setDeleteNotice(row)}
                    />
                  ))}
                </TableBody>
              )}
            </Table>
          </Box>
        </TableContainer>
      </Card>

      <NoticeFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        notice={formNotice}
        classes={classes}
        onSuccess={loadNotices}
      />

      <ConfirmDialog
        open={Boolean(deleteNotice)}
        onClose={() => setDeleteNotice(null)}
        title="Delete Notice"
        content={
          deleteNotice && deleteNotice.title
            ? `Are you sure you want to delete "${deleteNotice.title}"?`
            : 'Are you sure you want to delete this notice?'
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(deleteNotice);
              setDeleteNotice(null);
            }}
          >
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
