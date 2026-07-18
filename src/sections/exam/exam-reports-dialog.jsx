import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Table,
  Button,
  Dialog,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  TableContainer,
} from '@mui/material';
import ApiService from 'src/services/ApiService';
import { Iconify } from 'src/components/iconify';

export function ExamReportsDialog({ open, onClose, exam, selectedClass, onReport }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!exam || !selectedClass) return;
    setLoading(true);
    const res = await ApiService.getExamMarksEntryAsync(
      exam.examId,
      selectedClass.classId,
      selectedClass.sectionId
    );
    const data = res && res.data ? res.data : null;
    setStudents(data && data.students ? data.students : []);
    setLoading(false);
  }, [exam, selectedClass]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {exam && exam.examName ? exam.examName : ''} — Report Cards
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : students.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No students found for this class/section.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 460 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 70 }}>Roll</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell align="center" sx={{ width: 100 }}>
                    Report
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.studentId} hover>
                    <TableCell>{student.rollNo || '-'}</TableCell>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => onReport(student)}>
                        <Iconify icon="solar:eye-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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

ExamReportsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  exam: PropTypes.object,
  selectedClass: PropTypes.object,
  onReport: PropTypes.func.isRequired,
};
