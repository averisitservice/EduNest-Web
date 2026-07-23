import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  TableRow,
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
  getComparator,
  rowInPage,
  TableHeadCustom,
  TableNoData,
  useTable,
} from 'src/components/table';

import { EventFormDialog } from '../event-form-dialog';
import { EventTableRow } from '../event-table-row';

const TABLEHEAD = [
  { id: 'title', label: 'Title', width: '25%' },
  { id: 'eventType', label: 'Type', width: '12%' },
  { id: 'startDate', label: 'Schedule', width: '18%' },
  { id: 'venue', label: 'Venue', width: '15%', sortBy: false },
  { id: 'audience', label: 'Audience', width: '12%' },
  { id: 'updatedDate', label: 'Last Update', width: '13%' },
  { id: '', label: 'Action', width: '10%', sortBy: false, sx: { textAlign: 'center' } },
];

export function EventsView() {
  const table = useTable({ defaultOrderBy: 'startDate', defaultOrder: 'desc' });
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [formEvent, setFormEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);

  const filters = useSetState({ search: '' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataInPage = rowInPage(events, table.page, table.rowsPerPage);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    const res = await ApiService.getEventListAsync();
    setEvents(res && res.data ? res.data : []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadEvents();
    (async () => {
      const res = await ApiService.getClassListAsync();
      setClasses(res && res.data ? res.data : []);
    })();
  }, [loadEvents]);

  const openNew = () => {
    setFormEvent(null);
    setFormOpen(true);
  };

  const openEdit = (event) => {
    setFormEvent(event);
    setFormOpen(true);
  };

  const handleDelete = async (event) => {
    if (!event) return;
    const res = await ApiService.deleteEventAsync(event.eventId);
    if (res && res.data) {
      setEvents((prev) => prev.filter((row) => row.eventId !== event.eventId));
      toast.success('Event deleted.');
      table.onUpdatePageDeleteRow(dataInPage.length);
    } else if (res && res.errors && res.errors.length) {
      toast.error(res.errors[0].msg);
    }
  };

  const dataFiltered = useMemo(() => {
    const { search } = currentFilters;
    const stabilizedThis = events.map((el, idx) => [el, idx]);
    stabilizedThis.sort((a, b) => {
      const order = getComparator(table.order, table.orderBy)(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    let filteredData = stabilizedThis.map((el) => el[0]);
    if (search) {
      const lower = search.toLowerCase();
      filteredData = filteredData.filter(
        (event) =>
          (event.title && event.title.toLowerCase().includes(lower)) ||
          (event.venue && event.venue.toLowerCase().includes(lower)) ||
          (event.description && event.description.toLowerCase().includes(lower))
      );
    }
    return filteredData;
  }, [events, table.order, table.orderBy, currentFilters]);

  const handleFilterChange = (newValue, key = 'search') => {
    updateFilters({ [key]: newValue });
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Events"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Events', href: paths.dashboard.event.root },
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openNew}
          >
            New Event
          </Button>
        }
        sx={{ mb: { xs: 2, md: 2 } }}
      />

      <Card>
        <TableToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          placeholder="Search By Title or Venue"
        />

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
                  <TableNoData label="No events found." notFound={dataFiltered.length <= 0} />
                  {dataFiltered.map((row) => (
                    <EventTableRow
                      key={row.eventId}
                      row={row}
                      onEditRow={() => openEdit(row)}
                      onDeleteRow={() => setDeleteEvent(row)}
                    />
                  ))}
                </TableBody>
              )}
            </Table>
          </Box>
        </TableContainer>
      </Card>

      <EventFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        event={formEvent}
        classes={classes}
        onSuccess={loadEvents}
      />

      <ConfirmDialog
        open={Boolean(deleteEvent)}
        onClose={() => setDeleteEvent(null)}
        title="Delete Event"
        content={
          deleteEvent && deleteEvent.title
            ? `Are you sure you want to delete "${deleteEvent.title}"?`
            : 'Are you sure you want to delete this event?'
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(deleteEvent);
              setDeleteEvent(null);
            }}
          >
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
