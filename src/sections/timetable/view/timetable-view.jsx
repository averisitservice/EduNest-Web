import { useState, useEffect, useCallback } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  Switch,
  Select,
  Dialog,
  TableRow,
  MenuItem,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  InputLabel,
  FormControl,
  Autocomplete,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  CircularProgress,
  FormControlLabel,
  TablePagination,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { paths } from 'src/routes/paths';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const BREAK_ICON = 'solar:cup-bold-duotone';

// Backend serialises LocalTime as "HH:mm:ss" (string) or [h, m] (array); normalise to "hh:mm AM/PM".
function formatTime(value) {
  if (!value) return '';
  let hours;
  let minutes;
  if (Array.isArray(value)) {
    [hours, minutes] = value;
  } else if (typeof value === 'string') {
    const [h, m] = value.split(':');
    hours = Number(h);
    minutes = Number(m);
  } else {
    return '';
  }
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return '';
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

function getRowTimeLabel(row) {
  const range = [formatTime(row.startTime), formatTime(row.endTime)].filter(Boolean).join(' - ');
  return range || row.slotName || '';
}

function getClassLabel(option) {
  if (!option) return '';
  return option.sectionName
    ? `${option.className} - ${option.sectionName}`
    : option.className || '';
}

// ----------------------------------------------------------------------

export function TimetableView() {
  const [classSections, setClassSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [workingDays, setWorkingDays] = useState([]);
  const [workingDayMap, setWorkingDayMap] = useState({}); // dayName -> workingDayId
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [rows, setRows] = useState([]);
  const [showTeacherName, setShowTeacherName] = useState(true);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Cell edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editDay, setEditDay] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('');
  const [editTeacherId, setEditTeacherId] = useState('');
  const [saving, setSaving] = useState(false);

  // Load lookups: class/section list, working days (for name -> id), subjects and teachers.
  useEffect(() => {
    async function loadLookups() {
      try {
        const [classRes, wdRes, subRes, teacherRes] = await Promise.all([
          ApiService.getAllClassMasterSectionsAsync(),
          ApiService.getWorkingDaysAsync(),
          ApiService.getSubjectAsync(),
          ApiService.getTeacherListAsync(),
        ]);

        const classList = classRes?.data ?? [];
        setClassSections(classList);
        if (classList.length > 0) {
          setSelectedClass(classList[0]);
        }

        const map = {};
        (wdRes?.data ?? []).forEach((wd) => {
          map[wd.dayName] = wd.workingDayId;
        });
        setWorkingDayMap(map);

        setSubjects(subRes?.data ?? []);
        setTeachers(teacherRes?.data ?? []);
      } catch (err) {
        console.error('Failed to load timetable lookups:', err);
      }
    }
    loadLookups();
  }, []);

  // Load the timetable grid for the selected class/section.
  const loadTimetable = useCallback(async () => {
    if (!selectedClass) {
      setRows([]);
      setWorkingDays([]);
      return;
    }
    setLoading(true);
    try {
      const res = await ApiService.getTimetableAsync(
        selectedClass.classId,
        selectedClass.sectionId
      );
      setWorkingDays(res?.data?.workingDays ?? []);
      setRows(res?.data?.rows ?? []);
      setPage(0);
    } catch (err) {
      console.error('Failed to load timetable:', err);
      setWorkingDays([]);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    loadTimetable();
  }, [loadTimetable]);

  const handleOpenCell = (row, day) => {
    const cell = row.cells?.[day] || {};
    setEditRow(row);
    setEditDay(day);
    setEditSubjectId(cell.subjectId ?? '');
    setEditTeacherId(cell.teacherId ?? '');
    setEditOpen(true);
  };

  const handleSaveCell = async () => {
    if (!selectedClass || !editRow) return;

    const workingDayId = workingDayMap[editDay];
    if (!workingDayId) {
      toast.error(`Working day "${editDay}" is not configured.`);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        classId: selectedClass.classId,
        sectionId: selectedClass.sectionId,
        workingDayId,
        timeSlotId: editRow.timeSlotId,
        subjectId: editSubjectId || null,
        teacherId: editTeacherId || null,
      };
      const res = await ApiService.saveTimetableCellAsync(payload);
      if (res?.data) {
        toast.success('Slot saved successfully!');
        setEditOpen(false);
        await loadTimetable();
      } else if (res?.errors?.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to save cell:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const csvRows = [];
    csvRows.push(['Time / Day', ...workingDays].join(','));

    rows.forEach((row) => {
      const timeLabel = getRowTimeLabel(row);
      if (row.isBreak) {
        csvRows.push(
          [timeLabel, ...Array(workingDays.length).fill(row.slotName || 'Break')].join(',')
        );
      } else {
        const line = [
          timeLabel,
          ...workingDays.map((day) => {
            const cell = row.cells?.[day];
            if (!cell || !cell.subjectName) return '--';
            return showTeacherName && cell.teacherName
              ? `"${cell.subjectName} (${cell.teacherName})"`
              : `"${cell.subjectName}"`;
          }),
        ];
        csvRows.push(line.join(','));
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const label = selectedClass ? getClassLabel(selectedClass) : 'Timetable';
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${label.replace(/\s+/g, '_')}_Timetable.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Timetable exported successfully!');
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const headerTitle = selectedClass ? `${getClassLabel(selectedClass)} Timetable` : 'Timetable';

  return (
    <DashboardContent>
      {/* Page Header & Breadcrumbs */}
      <CustomBreadcrumbs
        heading="Manage Timetable"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Timetable', href: paths.dashboard.timetable.root },
        ]}
        sx={{ mb: 4 }}
      />

      {/* Class Selector and Export Button */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'flex-end' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Autocomplete
          sx={{ minWidth: 260 }}
          options={classSections}
          value={selectedClass}
          onChange={(event, newValue) => setSelectedClass(newValue)}
          getOptionLabel={getClassLabel}
          isOptionEqualToValue={(option, value) =>
            option.classId === value.classId && option.sectionId === value.sectionId
          }
          renderInput={(params) => (
            <TextField {...params} label="Class & Section" placeholder="Select Class & Section" />
          )}
        />

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="solar:download-linear" />}
          onClick={handleExport}
          disabled={rows.length === 0}
          sx={{
            borderColor: 'divider',
            alignSelf: { xs: 'flex-start', sm: 'auto' },
            px: 2.5,
            py: 1.2,
          }}
        >
          Export
        </Button>
      </Stack>

      {/* Main Timetable View Card */}
      <Card sx={{ borderRadius: 2, boxShadow: (theme) => theme.customShadows?.card || 3 }}>
        {/* Card Header Section */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
              color: 'success.main',
              mr: 2,
            }}
          >
            <Iconify icon="solar:calendar-bold-duotone" width={24} />
          </Box>
          <Stack>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {headerTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              All Days - Full Week
            </Typography>
          </Stack>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
            <CircularProgress color="success" />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No timetable found for this class.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Timetable Grid Table */}
            <TableContainer>
              <Table
                sx={{
                  minWidth: 800,
                  borderCollapse: 'collapse',
                  '& th, & td': {
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                    p: '6px !important',
                  },
                }}
              >
                <TableHead>
                  <TableRow sx={{ bgcolor: (theme) => alpha(theme.palette.grey[500], 0.06) }}>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        width: '130px',
                        fontSize: '0.7rem',
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      Time / Day
                    </TableCell>
                    {workingDays.map((day) => (
                      <TableCell
                        key={day}
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        {day}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRows.map((row) => (
                    <TableRow key={row.timeSlotId} hover>
                      {/* Time column */}
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: 'text.secondary',
                          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.02),
                          fontSize: '0.7rem',
                          lineHeight: 1.2,
                          py: '8px !important',
                        }}
                      >
                        {getRowTimeLabel(row)}
                      </TableCell>

                      {row.isBreak ? (
                        /* Break Rows span across all day columns */
                        <TableCell
                          colSpan={workingDays.length}
                          sx={{
                            p: '4px !important',
                            bgcolor: (theme) => alpha(theme.palette.success.main, 0.01),
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: (theme) => alpha(theme.palette.success.main, 0.06),
                              border: '1px dashed',
                              borderColor: 'success.main',
                              borderRadius: 1,
                              py: 0.5,
                              mx: 'auto',
                              width: '98%',
                              gap: 1,
                            }}
                          >
                            <Iconify icon={BREAK_ICON} width={14} sx={{ color: 'success.main' }} />
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: 'success.dark',
                                fontWeight: 800,
                                fontSize: '0.7rem',
                                letterSpacing: 1.5,
                              }}
                            >
                              {(row.slotName || 'Break').toUpperCase()}
                            </Typography>
                          </Box>
                        </TableCell>
                      ) : (
                        /* Normal class period cells - click to assign subject/teacher */
                        workingDays.map((day) => {
                          const cell = row.cells?.[day];
                          const hasClass = Boolean(cell && cell.subjectName);

                          return (
                            <TableCell
                              key={day}
                              onClick={() => handleOpenCell(row, day)}
                              sx={{
                                verticalAlign: 'middle',
                                p: '4px !important',
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                                },
                              }}
                            >
                              {hasClass ? (
                                <Box
                                  sx={{
                                    borderRadius: 0.75,
                                    p: 0.75,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: '0.72rem',
                                      color: 'text.primary',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {cell.subjectName}
                                  </Typography>
                                  {showTeacherName && cell.teacherName && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.65rem',
                                        fontWeight: 500,
                                        mt: 0.25,
                                      }}
                                    >
                                      {cell.teacherName}
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'text.disabled', fontSize: '0.72rem', opacity: 0.4 }}
                                >
                                  --
                                </Typography>
                              )}
                            </TableCell>
                          );
                        })
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Footer Actions / Pagination */}
            <Box
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={showTeacherName}
                    onChange={(e) => setShowTeacherName(e.target.checked)}
                    color="success"
                    size="small"
                  />
                }
                label="Show Teacher Name"
                sx={{ ml: 1 }}
              />

              <TablePagination
                component="div"
                count={rows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50]}
                sx={{ borderTopColor: 'transparent', alignSelf: 'flex-end' }}
              />
            </Box>
          </>
        )}
      </Card>

      {/* Cell Edit Dialog - assign subject & teacher (POST /timetable/cell) */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Assign Period</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {editDay} &nbsp;•&nbsp; {editRow ? getRowTimeLabel(editRow) : ''}
            </Typography>

            <FormControl fullWidth>
              <InputLabel id="edit-subject-label">Subject</InputLabel>
              <Select
                labelId="edit-subject-label"
                value={editSubjectId}
                label="Subject"
                onChange={(e) => setEditSubjectId(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {subjects.map((sub) => (
                  <MenuItem key={sub.subjectId} value={sub.subjectId}>
                    {sub.subjectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="edit-teacher-label">Teacher</InputLabel>
              <Select
                labelId="edit-teacher-label"
                value={editTeacherId}
                label="Teacher"
                onChange={(e) => setEditTeacherId(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.teacherId} value={teacher.teacherId}>
                    {teacher.teacherName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="inherit" disabled={saving}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSaveCell}
            variant="contained"
            color="success"
            loading={saving}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
