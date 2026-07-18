import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CircularProgress,
  TableContainer,
} from '@mui/material';
import ApiService from 'src/services/ApiService';
import { Form, Field } from 'src/components/hook-form';

const today = () => new Date().toISOString().slice(0, 10);
const firstOfMonth = () => `${new Date().toISOString().slice(0, 7)}-01`;

export function AttendanceReport({ selectedClass }) {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const methods = useForm({
    defaultValues: {
      fromDate: firstOfMonth(),
      toDate: today(),
    },
  });

  const { watch } = methods;
  const fromDate = watch('fromDate');
  const toDate = watch('toDate');

  const loadSummary = async () => {
    if (!selectedClass) return;
    setLoading(true);
    const res = await ApiService.getAttendanceSummaryAsync(
      selectedClass.classId,
      selectedClass.sectionId,
      fromDate,
      toDate
    );
    setSummary(res && res.data ? res.data : []);
    setLoaded(true);
    setLoading(false);
  };

  return (
    <Form methods={methods}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ sm: 'center' }}
        sx={{ p: 2 }}
      >
        <Field.DatePicker
          name="fromDate"
          label="From"
          allowFutureDates
          allowPastDates
          slotProps={{ textField: { size: 'small', fullWidth: false } }}
        />
        <Field.DatePicker
          name="toDate"
          label="To"
          allowFutureDates
          allowPastDates
          slotProps={{ textField: { size: 'small', fullWidth: false } }}
        />
        <Button variant="contained" color="primary" onClick={loadSummary} disabled={!selectedClass}>
          Load Report
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : summary.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {loaded
              ? 'No attendance records for the selected range.'
              : 'Select a date range, then click “Load Report”.'}
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 90 }}>Roll No</TableCell>
                <TableCell>Student</TableCell>
                <TableCell align="center">Present</TableCell>
                <TableCell align="center">Absent</TableCell>
                <TableCell align="center">Late</TableCell>
                <TableCell align="center">Half</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.map((s) => (
                <TableRow key={s.studentId} hover>
                  <TableCell>{s.rollNo}</TableCell>
                  <TableCell>{s.studentName}</TableCell>
                  <TableCell align="center">{s.presentCount}</TableCell>
                  <TableCell align="center">{s.absentCount}</TableCell>
                  <TableCell align="center">{s.lateCount}</TableCell>
                  <TableCell align="center">{s.halfDayCount}</TableCell>
                  <TableCell align="center">{s.totalMarked}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: s.presentPercentage >= 75 ? 'success.main' : 'error.main',
                    }}
                  >
                    {s.presentPercentage}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Form>
  );
}

AttendanceReport.propTypes = {
  selectedClass: PropTypes.object,
};
