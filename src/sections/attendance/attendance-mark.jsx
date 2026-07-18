import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Table,
  Stack,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
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

const STATUS_OPTIONS = [
  { value: 'P', color: 'success', label: 'Present' },
  { value: 'A', color: 'error', label: 'Absent' },
  { value: 'L', color: 'warning', label: 'Late' },
  { value: 'H', color: 'info', label: 'Half Day' },
];

const today = () => new Date().toISOString().slice(0, 10);

export function AttendanceMark({ selectedClass }) {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const methods = useForm({
    defaultValues: {
      date: today(),
    },
  });

  const { watch } = methods;
  const date = watch('date');

  const loadRoster = useCallback(async () => {
    if (!selectedClass || !date) {
      setRoster([]);
      return;
    }
    setLoading(true);
    const res = await ApiService.getAttendanceRosterAsync(
      selectedClass.classId,
      selectedClass.sectionId,
      date
    );
    const records = res && res.data && res.data.records ? res.data.records : [];
    setRoster(records.map((r) => ({ ...r, status: r.status || 'P' })));
    setLoading(false);
  }, [selectedClass, date]);

  useEffect(() => {
    loadRoster();
  }, [loadRoster]);

  const setStatus = (studentId, status) => {
    if (!status) return;
    setRoster((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  };

  const setRemarks = (studentId, remarks) => {
    setRoster((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r)));
  };

  const markAllPresent = () => {
    setRoster((prev) => prev.map((r) => ({ ...r, status: 'P' })));
  };

  const handleSave = async () => {
    if (!selectedClass || roster.length === 0) return;
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
  }, [roster]);

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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
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
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<Iconify icon="solar:check-circle-bold" />}
            onClick={markAllPresent}
            disabled={roster.length === 0}
          >
            Mark all present
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : roster.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No students found for this class.
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
                    <TableCell>{r.studentName}</TableCell>
                    <TableCell align="center">
                      <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={r.status}
                        onChange={(e, v) => setStatus(r.studentId, v)}
                      >
                        {STATUS_OPTIONS.map((opt) => (
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
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Optional"
                        value={r.remarks || ''}
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
            <LoadingButton variant="contained" color="primary" loading={saving} onClick={handleSave}>
              Save Attendance
            </LoadingButton>
          </Box>
        </>
      )}
    </Form>
  );
}

AttendanceMark.propTypes = {
  selectedClass: PropTypes.object,
};
