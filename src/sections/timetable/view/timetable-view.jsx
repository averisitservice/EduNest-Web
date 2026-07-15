import { useState, useEffect } from 'react';
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
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  FormControlLabel,
  TablePagination,
  Grid,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const DEFAULT_TIMETABLE = [
  {
    time: "08:00 AM - 08:45 AM",
    isBreak: false,
    days: {
      Monday: { subject: "English", teacher: "Mr. Sharma" },
      Tuesday: { subject: "Maths", teacher: "Ms. Verma" },
      Wednesday: { subject: "Science", teacher: "Mr. Jain" },
      Thursday: { subject: "Social Science", teacher: "Mr. Patel" },
      Friday: { subject: "Hindi", teacher: "Ms. Singh" },
      Saturday: { subject: "Computer", teacher: "Mr. Mehta" },
      Sunday: { subject: "--", teacher: "--" },
    },
  },
  {
    time: "08:45 AM - 09:30 AM",
    isBreak: false,
    days: {
      Monday: { subject: "Maths", teacher: "Ms. Verma" },
      Tuesday: { subject: "English", teacher: "Mr. Sharma" },
      Wednesday: { subject: "Hindi", teacher: "Ms. Singh" },
      Thursday: { subject: "Science", teacher: "Mr. Jain" },
      Friday: { subject: "Social Science", teacher: "Mr. Patel" },
      Saturday: { subject: "Physical Ed.", teacher: "Coach Ravi" },
      Sunday: { subject: "--", teacher: "--" },
    },
  },
  {
    time: "09:30 AM - 10:15 AM",
    isBreak: false,
    days: {
      Monday: { subject: "Science", teacher: "Mr. Jain" },
      Tuesday: { subject: "Social Science", teacher: "Mr. Patel" },
      Wednesday: { subject: "Maths", teacher: "Ms. Verma" },
      Thursday: { subject: "English", teacher: "Mr. Sharma" },
      Friday: { subject: "Computer", teacher: "Mr. Mehta" },
      Saturday: { subject: "Art", teacher: "Ms. Neha" },
      Sunday: { subject: "--", teacher: "--" },
    },
  },
  {
    time: "10:15 AM - 10:30 AM",
    isBreak: true,
    breakLabel: "Short Break",
    breakIcon: "solar:cup-bold-duotone",
    days: {},
  },
  {
    time: "10:30 AM - 11:15 AM",
    isBreak: false,
    days: {
      Monday: { subject: "Hindi", teacher: "Ms. Singh" },
      Tuesday: { subject: "Science", teacher: "Mr. Jain" },
      Wednesday: { subject: "English", teacher: "Mr. Sharma" },
      Thursday: { subject: "Maths", teacher: "Ms. Verma" },
      Friday: { subject: "Physical Ed.", teacher: "Coach Ravi" },
      Saturday: { subject: "Library", teacher: "--" },
      Sunday: { subject: "--", teacher: "--" },
    },
  },
  {
    time: "11:15 AM - 12:00 PM",
    isBreak: false,
    days: {
      Monday: { subject: "Social Science", teacher: "Mr. Patel" },
      Tuesday: { subject: "Hindi", teacher: "Ms. Singh" },
      Wednesday: { subject: "Computer", teacher: "Mr. Mehta" },
      Thursday: { subject: "Physical Ed.", teacher: "Coach Ravi" },
      Friday: { subject: "English", teacher: "Mr. Sharma" },
      Saturday: { subject: "Lab", teacher: "Mr. Jain" },
      Sunday: { subject: "--", teacher: "--" },
    },
  },
  {
    time: "12:00 PM - 12:45 PM",
    isBreak: false,
    days: {
      Monday: { subject: "Computer", teacher: "Mr. Mehta" },
      Tuesday: { subject: "Art", teacher: "Ms. Neha" },
      Wednesday: { subject: "Social Science", teacher: "Mr. Patel" },
      Thursday: { subject: "Hindi", teacher: "Ms. Singh" },
      Friday: { subject: "Maths", teacher: "Ms. Verma" },
      Saturday: { subject: "Club Activity", teacher: "--" },
      Sunday: { subject: "--", teacher: "--" },
    },
  },
  {
    time: "12:45 PM - 01:30 PM",
    isBreak: true,
    breakLabel: "Lunch Break",
    breakIcon: "solar:hamburger-bold-duotone",
    days: {},
  },
  {
    time: "01:30 PM - 02:15 PM",
    isBreak: false,
    days: {
      Monday: { subject: "Art", teacher: "Ms. Neha" },
      Tuesday: { subject: "Computer", teacher: "Mr. Mehta" },
      Wednesday: { subject: "Physical Ed.", teacher: "Coach Ravi" },
      Thursday: { subject: "Lab", teacher: "Mr. Jain" },
      Friday: { subject: "Science", teacher: "Mr. Jain" },
      Saturday: { subject: "Seminar", teacher: "--" },
      Sunday: { subject: "--", teacher: "--" },
    },
  },
  {
    time: "02:15 PM - 03:00 PM",
    isBreak: false,
    days: {
      Monday: { subject: "Lab", teacher: "Mr. Jain" },
      Tuesday: { subject: "Club Activity", teacher: "--" },
      Wednesday: { subject: "Art", teacher: "Ms. Neha" },
      Thursday: { subject: "Computer", teacher: "Mr. Mehta" },
      Friday: { subject: "Hindi", teacher: "Ms. Singh" },
      Saturday: { subject: "Review", teacher: "--" },
      Sunday: { subject: "--", teacher: "--" },
    },
  },
  {
    time: "03:00 PM - 03:45 PM",
    isBreak: false,
    days: {
      Monday: { subject: "Review", teacher: "--" },
      Tuesday: { subject: "Seminar", teacher: "--" },
      Wednesday: { subject: "Library", teacher: "--" },
      Thursday: { subject: "Club Activity", teacher: "--" },
      Friday: { subject: "Art", teacher: "Ms. Neha" },
      Saturday: { subject: "Free Period", teacher: "--" },
      Sunday: { subject: "--", teacher: "--" },
    },
  },
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TimetableView() {
  const [selectedClass, setSelectedClass] = useState('Class 10 - A');
  const [classes, setClasses] = useState(['Class 10 - A', 'Class 10 - B', 'Class 9 - A', 'Class 9 - B']);
  const [showTeacherName, setShowTeacherName] = useState(true);
  const [timetableData, setTimetableData] = useState(DEFAULT_TIMETABLE);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Lists for dropdown selections in Dialog
  const [teachers, setTeachers] = useState([
    'Mr. Sharma',
    'Ms. Verma',
    'Mr. Jain',
    'Mr. Patel',
    'Ms. Singh',
    'Mr. Mehta',
    'Coach Ravi',
    'Ms. Neha',
  ]);
  const [subjects, setSubjects] = useState([
    'English',
    'Maths',
    'Science',
    'Social Science',
    'Hindi',
    'Computer',
    'Physical Ed.',
    'Art',
    'Library',
    'Lab',
    'Club Activity',
    'Seminar',
    'Review',
    'Free Period',
  ]);

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [isBreakSlot, setIsBreakSlot] = useState(false);
  const [dialogTime, setDialogTime] = useState('');
  const [dialogCustomTime, setDialogCustomTime] = useState('');
  const [dialogDay, setDialogDay] = useState('Monday');
  const [dialogSubject, setDialogSubject] = useState('');
  const [dialogTeacher, setDialogTeacher] = useState('');
  const [dialogBreakLabel, setDialogBreakLabel] = useState('Short Break');
  const [dialogBreakIcon, setDialogBreakIcon] = useState('solar:cup-bold-duotone');

  // Load classes and teachers from APIs
  useEffect(() => {
    async function loadData() {
      try {
        const classRes = await ApiService.getClassListAsync();
        if (classRes?.data && classRes.data.length > 0) {
          const classNames = classRes.data.map((c) => c.className);
          setClasses(classNames);
          if (!classNames.includes(selectedClass)) {
            setSelectedClass(classNames[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load classes:', err);
      }

      try {
        const teacherRes = await ApiService.getTeacherListAsync();
        if (teacherRes?.data && teacherRes.data.length > 0) {
          const teacherNames = teacherRes.data.map((t) => t.teacherName);
          setTeachers(teacherNames);
        }
      } catch (err) {
        console.error('Failed to load teachers:', err);
      }
    }
    loadData();
  }, []);

  const handleOpenDialog = () => {
    setIsBreakSlot(false);
    setDialogTime(timetableData[0]?.time || '');
    setDialogCustomTime('');
    setDialogDay('Monday');
    setDialogSubject(subjects[0] || '');
    setDialogTeacher(teachers[0] || '');
    setDialogBreakLabel('Short Break');
    setDialogBreakIcon('solar:cup-bold-duotone');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveSlot = () => {
    const finalTime = dialogTime === 'custom' ? dialogCustomTime : dialogTime;

    if (!finalTime) {
      toast.error('Please enter or select a time slot.');
      return;
    }

    setTimetableData((prev) => {
      if (isBreakSlot) {
        const existingIndex = prev.findIndex((r) => r.time === finalTime);
        const newBreakRow = {
          time: finalTime,
          isBreak: true,
          breakLabel: dialogBreakLabel,
          breakIcon: dialogBreakIcon,
          days: {},
        };
        if (existingIndex > -1) {
          const next = [...prev];
          next[existingIndex] = newBreakRow;
          return next;
        }
        return [...prev, newBreakRow].sort((a, b) => a.time.localeCompare(b.time));
      } else {
        const existingIndex = prev.findIndex((r) => r.time === finalTime);
        if (existingIndex > -1) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            isBreak: false,
            days: {
              ...next[existingIndex].days,
              [dialogDay]: {
                subject: dialogSubject,
                teacher: dialogTeacher,
              },
            },
          };
          return next;
        } else {
          const newRow = {
            time: finalTime,
            isBreak: false,
            days: {
              Monday: { subject: '--', teacher: '--' },
              Tuesday: { subject: '--', teacher: '--' },
              Wednesday: { subject: '--', teacher: '--' },
              Thursday: { subject: '--', teacher: '--' },
              Friday: { subject: '--', teacher: '--' },
              Saturday: { subject: '--', teacher: '--' },
              Sunday: { subject: '--', teacher: '--' },
              [dialogDay]: { subject: dialogSubject, teacher: dialogTeacher },
            },
          };
          return [...prev, newRow].sort((a, b) => a.time.localeCompare(b.time));
        }
      }
    });

    toast.success('Timetable saved successfully!');
    setOpenDialog(false);
  };

  const handleExport = () => {
    const csvRows = [];
    csvRows.push(['Time / Day', ...DAYS_OF_WEEK].join(','));

    timetableData.forEach((row) => {
      if (row.isBreak) {
        csvRows.push([row.time, ...Array(7).fill(row.breakLabel)].join(','));
      } else {
        const line = [
          row.time,
          ...DAYS_OF_WEEK.map((day) => {
            const cell = row.days[day];
            if (!cell || cell.subject === '--') return '--';
            return showTeacherName && cell.teacher && cell.teacher !== '--'
              ? `"${cell.subject} (${cell.teacher})"`
              : `"${cell.subject}"`;
          }),
        ];
        csvRows.push(line.join(','));
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedClass.replace(/\s+/g, '_')}_Timetable.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Timetable exported successfully!');
  };

  return (
    <DashboardContent>
      {/* Page Header & Breadcrumbs */}
      <CustomBreadcrumbs
        heading="Manage Timetable"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Timetable', href: paths.dashboard.timetable.root },
        ]}
        action={
          <Button
            variant="contained"
            color="success"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenDialog}
            sx={{
              bgcolor: 'success.main',
              color: 'success.contrastText',
              '&:hover': { bgcolor: 'success.dark' },
            }}
          >
            New Timetable
          </Button>
        }
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
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="class-select-label" sx={{ fontWeight: 'bold' }}>Class</InputLabel>
          <Select
            labelId="class-select-label"
            id="class-select"
            value={selectedClass}
            label="Class"
            onChange={(e) => setSelectedClass(e.target.value)}
            sx={{ borderRadius: 1 }}
          >
            {classes.map((cls) => (
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="solar:download-linear" />}
          onClick={handleExport}
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
        <Stack direction="row" alignItems="center" sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
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
              {selectedClass} Timetable
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              All Days - Full Week
            </Typography>
          </Stack>
        </Stack>

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
                {DAYS_OF_WEEK.map((day) => (
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
              {timetableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index} hover>
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
                      {row.time}
                    </TableCell>

                    {row.isBreak ? (
                      /* Break Rows span across all day columns */
                      <TableCell
                        colSpan={6}
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
                          <Iconify icon={row.breakIcon} width={14} sx={{ color: 'success.main' }} />
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: 'success.dark',
                              fontWeight: 800,
                              fontSize: '0.7rem',
                              letterSpacing: 1.5,
                            }}
                          >
                            {row.breakLabel.toUpperCase()}
                          </Typography>
                        </Box>
                      </TableCell>
                    ) : (
                      /* Normal class period cells */
                      DAYS_OF_WEEK.map((day) => {
                        const cell = row.days[day] || { subject: '--', teacher: '--' };
                        const hasClass = cell.subject && cell.subject !== '--';

                        return (
                          <TableCell key={day} sx={{ verticalAlign: 'middle', p: '4px !important' }}>
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
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.05),
                                    transform: 'translateY(-1px)',
                                  },
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
                                  {cell.subject}
                                </Typography>
                                {showTeacherName && cell.teacher && cell.teacher !== '--' && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: 'text.secondary',
                                      fontSize: '0.65rem',
                                      fontWeight: 500,
                                      mt: 0.25,
                                    }}
                                  >
                                    {cell.teacher}
                                  </Typography>
                                )}
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ color: 'text.disabled', fontSize: '0.72rem', opacity: 0.4 }}>
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
            count={timetableData.length}
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
      </Card>

      {/* Dialog for Adding/Editing Timetable Slots */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Create / Edit Timetable Slot</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {/* Slot Type Selector */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isBreakSlot}
                    onChange={(e) => setIsBreakSlot(e.target.checked)}
                    color="success"
                  />
                }
                label="Is this a Break Slot? (e.g. Lunch/Tea Break)"
              />
            </Grid>

            {/* Time Slot Input */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="dialog-time-label">Time Slot</InputLabel>
                <Select
                  labelId="dialog-time-label"
                  value={dialogTime}
                  label="Time Slot"
                  onChange={(e) => setDialogTime(e.target.value)}
                >
                  {timetableData.map((row) => (
                    <MenuItem key={row.time} value={row.time}>
                      {row.time}
                    </MenuItem>
                  ))}
                  <MenuItem value="custom">Custom Time Slot...</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Custom Time Slot Textfield */}
            {dialogTime === 'custom' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Custom Time (e.g., 03:45 PM - 04:30 PM)"
                  placeholder="HH:MM AM/PM - HH:MM AM/PM"
                  value={dialogCustomTime}
                  onChange={(e) => setDialogCustomTime(e.target.value)}
                />
              </Grid>
            )}

            {isBreakSlot ? (
              /* Break Slot specific fields */
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="break-label-select">Break Label</InputLabel>
                    <Select
                      labelId="break-label-select"
                      value={dialogBreakLabel}
                      label="Break Label"
                      onChange={(e) => setDialogBreakLabel(e.target.value)}
                    >
                      <MenuItem value="Short Break">Short Break</MenuItem>
                      <MenuItem value="Lunch Break">Lunch Break</MenuItem>
                      <MenuItem value="Tea Break">Tea Break</MenuItem>
                      <MenuItem value="Assembly">Assembly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="break-icon-select">Break Icon</InputLabel>
                    <Select
                      labelId="break-icon-select"
                      value={dialogBreakIcon}
                      label="Break Icon"
                      onChange={(e) => setDialogBreakIcon(e.target.value)}
                    >
                      <MenuItem value="solar:cup-bold-duotone">Coffee/Tea Cup</MenuItem>
                      <MenuItem value="solar:hamburger-bold-duotone">Burger/Lunch</MenuItem>
                      <MenuItem value="solar:bell-bold-duotone">Bell/Assembly</MenuItem>
                      <MenuItem value="solar:clock-circle-bold-duotone">Clock/Rest</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            ) : (
              /* Normal Class Period specific fields */
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="dialog-day-label">Day of Week</InputLabel>
                    <Select
                      labelId="dialog-day-label"
                      value={dialogDay}
                      label="Day of Week"
                      onChange={(e) => setDialogDay(e.target.value)}
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="dialog-subject-label">Subject</InputLabel>
                    <Select
                      labelId="dialog-subject-label"
                      value={dialogSubject}
                      label="Subject"
                      onChange={(e) => setDialogSubject(e.target.value)}
                    >
                      {subjects.map((sub) => (
                        <MenuItem key={sub} value={sub}>
                          {sub}
                        </MenuItem>
                      ))}
                      <MenuItem value="--">None (Clear Slot)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="dialog-teacher-label">Teacher</InputLabel>
                    <Select
                      labelId="dialog-teacher-label"
                      value={dialogTeacher}
                      label="Teacher"
                      onChange={(e) => setDialogTeacher(e.target.value)}
                    >
                      {teachers.map((teach) => (
                        <MenuItem key={teach} value={teach}>
                          {teach}
                        </MenuItem>
                      ))}
                      <MenuItem value="--">None</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveSlot} variant="contained" color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
