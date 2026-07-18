import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Table,
  Stack,
  Button,
  Dialog,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  TableContainer,
} from '@mui/material';
import ApiService from 'src/services/ApiService';

// ----------------------------------------------------------------------

export function ReportCardDialog({ open, onClose, examId, student }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !examId || !student) return;
    let active = true;
    setLoading(true);
    (async () => {
      const res = await ApiService.getReportCardAsync(examId, student.studentId);
      if (active) setReport(res && res.data ? res.data : null);
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [open, examId, student]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Report Card</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : !report ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No report available.
            </Typography>
          </Box>
        ) : (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {report.studentName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Roll No: {report.rollNo || '-'} &nbsp;•&nbsp; {report.examName}
                </Typography>
              </Box>
              <Chip
                label={report.result}
                color={report.result === 'PASS' ? 'success' : 'error'}
                sx={{ fontWeight: 700 }}
              />
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell align="right">Marks</TableCell>
                    <TableCell align="right">Max</TableCell>
                    <TableCell align="center">Grade</TableCell>
                    <TableCell align="center">Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.subjects.map((s) => (
                    <TableRow key={s.subjectId}>
                      <TableCell>{s.subjectName}</TableCell>
                      <TableCell align="right">
                        {s.marksObtained != null ? s.marksObtained : '-'}
                      </TableCell>
                      <TableCell align="right">{report.maxMarksPerSubject}</TableCell>
                      <TableCell align="center">{s.grade}</TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: s.passed ? 'success.main' : 'error.main', fontWeight: 600 }}
                      >
                        {s.passed ? 'Pass' : 'Fail'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-around" textAlign="center">
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Total
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {report.totalObtained} / {report.totalMax}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Percentage
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {report.percentage}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Grade
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {report.overallGrade}
                </Typography>
              </Box>
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-start' }}>
        <Button variant="outlined" color="error" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ReportCardDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  examId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  student: PropTypes.object,
};
