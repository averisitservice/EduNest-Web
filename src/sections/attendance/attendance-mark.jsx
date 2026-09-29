import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import {
  Box,
  Chip,
  Alert,
  Table,
  Stack,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  AlertTitle,
  Typography,
  CircularProgress,
  TableContainer,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import constants from 'src/utils/constants';

export function AttendanceMark({ selectedClass }) {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [holidayList, setHolidayList] = useState([]);
  const [backendHoliday, setBackendHoliday] = useState({ isHoliday: false, holidayName: '' });

  const methods = useForm({
    defaultValues: {
      date: '',
    },
  });

  const { watch } = methods;
  const date = watch('date');

  useEffect(() => {
    async function loadHolidayList() {
      const res = await ApiService.getHolidayListAsync();
      const list = res && res.data ? res.data : [];
      setHolidayList(list);
    }
    loadHolidayList();
  }, []);

  const holidayFromList = useMemo(() => {
    if (!date || !holidayList || holidayList.length === 0) return null;
    return (
      holidayList.find((h) => {
        if (!h || h.isActive === false) return false;
        const start = h.startDate || '';
        const end = h.endDate || start;
        return date >= start && date <= end;
      }) || null
    );
  }, [date, holidayList]);

  const isHoliday = Boolean(holidayFromList || (backendHoliday && backendHoliday.isHoliday));
  const holidayName =
    holidayFromList && holidayFromList.holidayName
      ? holidayFromList.holidayName
      : backendHoliday && backendHoliday.holidayName
        ? backendHoliday.holidayName
        : '';

  const isToday = useMemo(() => {
    if (!date) return true;
    return dayjs(date).isSame(dayjs(), 'day');
  }, [date]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadRoster = useCallback(async () => {
    if (!selectedClass || !date) {
      setRoster([]);
      setBackendHoliday({ isHoliday: false, holidayName: '' });
      return;
    }
    setLoading(true);
    const res = await ApiService.getAttendanceRosterAsync(
      selectedClass.classId,
      selectedClass.sectionId,
      date,
      debouncedSearch
    );
    const records = res && res.data && res.data.records ? res.data.records : [];
    const isRosterHoliday = Boolean(res && res.data && (res.data.isHoliday || res.data.holiday));
    const rosterHolidayName = res && res.data && res.data.holidayName ? res.data.holidayName : '';
    setBackendHoliday({ isHoliday: isRosterHoliday, holidayName: rosterHolidayName });
    setRoster(records.map((r) => ({ ...r, status: r.status || 'P' })));
    setLoading(false);
  }, [selectedClass, date, debouncedSearch]);

  useEffect(() => {
    loadRoster();
  }, [loadRoster]);

  const setStatus = (studentId, status) => {
    if (!status || isHoliday) return;
    setRoster((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  };

  const setRemarks = (studentId, remarks) => {
    if (isHoliday) return;
    setRoster((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r)));
  };

  const markAllPresent = () => {
    if (isHoliday) return;
    setRoster((prev) => prev.map((r) => ({ ...r, status: 'P' })));
  };

  const handleSave = async () => {
    if (!selectedClass || roster.length === 0 || isHoliday) return;
    setSaving(true);
    try {
      const payload = {
        classId: selectedClass.classId,
        sectionId: selectedClass.sectionId,
        attendanceDate: date,
        records: roster.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks || null,
        })),
      };
      const res = await ApiService.saveAttendanceAsync(payload);
      if (res && res.data) {
        toast.success('Attendance saved successfully!');
        loadRoster();
      } else if (res && res.errors && res.errors.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to save attendance:', err);
      toast.error('Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const { presentCount, absentCount } = useMemo(() => {
    if (isHoliday) {
      return { presentCount: 0, absentCount: 0 };
    }
    let p = 0;
    let a = 0;
    roster.forEach((r) => {
      if (r.status === 'P') {
        p += 1;
      } else if (r.status === 'A') {
        a += 1;
      }
    });
    return { presentCount: p, absentCount: a };
  }, [roster, isHoliday]);

  const filteredRoster = useMemo(() => {
    if (!searchQuery) return roster;
    const query = searchQuery.toLowerCase();
    return roster.filter((student) => {
      const name = student.studentName || '';
      const roll = student.rollNo || '';
      return name.toLowerCase().includes(query) || roll.toLowerCase().includes(query);
    });
  }, [roster, searchQuery]);

  return (
    <Form methods={methods}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        sx={{ p: 2 }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}
        >
          <Field.DatePicker
            name="date"
            label="Date"
            allowFutureDates
            allowPastDates
            slotProps={{ textField: { size: 'small', fullWidth: false } }}
            sx={{ width: 180 }}
          />

          <TextField
            size="small"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220, maxWidth: 300 }}
          />
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>
            Present: {presentCount}
          </Typography>
          <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 700 }}>
            Absent: {absentCount}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Total: {roster.length}
          </Typography>
          <Tooltip
            title={
              isHoliday
                ? `Cannot mark attendance on a holiday${holidayName ? ` (${holidayName})` : ''}`
                : ''
            }
            arrow
          >
            <span>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<Iconify icon="solar:check-circle-bold" />}
                onClick={markAllPresent}
                disabled={isHoliday || roster.length === 0}
              >
                Mark all present
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {isHoliday && (
        <Alert
          severity="warning"
          variant="outlined"
          icon={<Iconify icon="solar:calendar-date-bold" width={24} />}
          sx={{ mx: 2, mb: 2 }}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>
            {isToday ? 'Today is a Holiday' : 'Holiday'}
          </AlertTitle>
          <Typography variant="body2">
            {holidayName ? (
              <>
                <strong>{holidayName}</strong> &mdash; Attendance cannot be marked or saved for this
                date.
              </>
            ) : (
              'Attendance cannot be marked or saved on holidays.'
            )}
          </Typography>
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : roster.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No data found
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 90 }}>Roll No</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell sx={{ width: 220 }}>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRoster.map((r) => (
                  <TableRow key={r.studentId} hover>
                    <TableCell>{r.rollNo}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span>{r.studentName}</span>
                        {r.onLeave && (
                          <Tooltip title="Approved leave for this date" arrow>
                            <Chip size="small" color="warning" label="Leave" />
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      {isHoliday ? (
                        <Chip
                          size="small"
                          color="warning"
                          variant="soft"
                          label={r.status === 'HOLIDAY' || !r.status ? 'Holiday' : r.status}
                          sx={{ fontWeight: 600 }}
                        />
                      ) : (
                        <ToggleButtonGroup
                          exclusive
                          size="small"
                          value={r.status}
                          onChange={(e, v) => setStatus(r.studentId, v)}
                        >
                          {constants.ATTENDANCE_STATUS_OPTIONS.map((opt) => (
                            <Tooltip key={opt.value} title={opt.label} arrow>
                              <ToggleButton
                                value={opt.value}
                                color={opt.color}
                                sx={{ px: 1.5, fontWeight: 700 }}
                              >
                                {opt.value}
                              </ToggleButton>
                            </Tooltip>
                          ))}
                        </ToggleButtonGroup>
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder={isHoliday ? 'Holiday' : 'Optional'}
                        value={r.remarks || ''}
                        disabled={isHoliday}
                        onChange={(e) => setRemarks(r.studentId, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Tooltip
              title={
                isHoliday
                  ? `Cannot save attendance on a holiday${holidayName ? ` (${holidayName})` : ''}`
                  : ''
              }
              arrow
            >
              <span>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={saving}
                  disabled={isHoliday || roster.length === 0}
                  onClick={handleSave}
                >
                  Save Attendance
                </LoadingButton>
              </span>
            </Tooltip>
          </Box>
        </>
      )}
    </Form>
  );
}
