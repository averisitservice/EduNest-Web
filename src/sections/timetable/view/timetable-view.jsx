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
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';
import { paths } from 'src/routes/paths';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TimetableEditDialog } from './timetable-edit-dialog';

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

export function TimetableView() {
  const [classSections, setClassSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [workingDays, setWorkingDays] = useState([]);
  const [workingDayMap, setWorkingDayMap] = useState({});
  const [subjects, setSubjects] = useState([]);

  const [rows, setRows] = useState([]);
  const [showTeacherName, setShowTeacherName] = useState(true);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editDay, setEditDay] = useState('');

  useEffect(() => {
    async function loadLookups() {
      try {
        const [classRes, wdRes, subRes] = await Promise.all([
          ApiService.getAllClassMasterSectionsAsync(),
          ApiService.getWorkingDaysAsync(),
          ApiService.getSubjectAsync(),
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
      } catch (err) {
        console.error('Failed to load timetable lookups:', err);
      }
    }
    loadLookups();
  }, []);

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
    const workingDayId = workingDayMap[day];
    if (!workingDayId) {
      toast.error(`Working day "${day}" is not configured.`);
      return;
    }
    setEditRow(row);
    setEditDay(day);
    setEditOpen(true);
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

  const headerTitle = selectedClass ? `${getClassLabel(selectedClass)} Timetable` : 'Timetable';

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Manage Timetable"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Timetable', href: paths.dashboard.timetable.root },
        ]}
        sx={{ mb: 4 }}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'flex-end' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Select
          size="small"
          value={
            selectedClass ? `${selectedClass.classId}-${selectedClass.sectionId ?? 'null'}` : ''
          }
          onChange={(e) => {
            const val = e.target.value;
            if (!val) {
              setSelectedClass(null);
            } else {
              const [classId, sectionId] = val.split('-');
              const selectedOption = classSections.find(
                (c) => c.classId == classId && (c.sectionId ?? 'null') == sectionId
              );
              setSelectedClass(selectedOption || null);
            }
          }}
          displayEmpty
          sx={{ minWidth: 200, textAlign: 'left' }}
        >
          <MenuItem value="" disabled>
            <em>Select Class & Section</em>
          </MenuItem>
          {classSections.map((option) => (
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

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="solar:download-linear" />}
          onClick={handleExport}
          disabled={rows.length === 0}
        >
          Export
        </Button>
      </Stack>

      <Card>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Stack>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {headerTitle}
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
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table
                size="small"
                sx={{
                  minWidth: 800,
                  tableLayout: 'fixed',
                  borderCollapse: 'collapse',
                  '& th, & td': {
                    borderRight: '1px solid',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                  },
                  '& th:last-of-type, & td:last-of-type': {
                    borderRight: 0,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        width: '180px',
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
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          width: '150px',
                        }}
                      >
                        {day}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.timeSlotId} hover>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: 'text.secondary',
                          lineHeight: 1.2,
                        }}
                      >
                        {getRowTimeLabel(row)}
                      </TableCell>

                      {row.isBreak ? (
                        <TableCell colSpan={workingDays.length}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 800,
                              letterSpacing: 1.5,
                              textAlign: 'center',
                            }}
                          >
                            BREAK
                          </Typography>
                        </TableCell>
                      ) : (
                        workingDays.map((day) => {
                          const cell = row.cells?.[day];
                          const hasClass = Boolean(cell && cell.subjectName);

                          return (
                            <TableCell
                              key={day}
                              onClick={() => handleOpenCell(row, day)}
                              sx={{
                                verticalAlign: 'middle',
                                cursor: 'pointer',
                              }}
                            >
                              {hasClass ? (
                                <Stack alignItems="center" justifyContent="center">
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 700,
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
                                        fontWeight: 500,
                                      }}
                                    >
                                      {cell.teacherName}
                                    </Typography>
                                  )}
                                </Stack>
                              ) : (
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'text.disabled', opacity: 0.4 }}
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

            <Box
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={showTeacherName}
                    onChange={(e) => setShowTeacherName(e.target.checked)}
                  />
                }
                label="Show Teacher Name"
                sx={{ ml: 1 }}
              />
            </Box>
          </>
        )}
      </Card>

      <TimetableEditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        row={editRow}
        day={editDay}
        subjects={subjects}
        selectedClass={selectedClass}
        workingDayId={workingDayMap[editDay]}
        onSuccess={loadTimetable}
      />
    </DashboardContent>
  );
}
