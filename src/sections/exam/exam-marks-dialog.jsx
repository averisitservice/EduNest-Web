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
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  TableContainer,
  IconButton,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

export function ExamMarksDialog({ open, onClose, exam, selectedClass, onReport }) {
  const [subjects, setSubjects] = useState([]);
  const [maxMarks, setMaxMarks] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!exam || !selectedClass) return;
    setLoading(true);
    const res = await ApiService.getExamMarksEntryAsync(
      exam.examId,
      selectedClass.classId,
      selectedClass.sectionId
    );
    const data = res && res.data ? res.data : null;
    setSubjects(data && data.subjects ? data.subjects : []);
    setMaxMarks(data && data.maxMarks ? data.maxMarks : 0);
    setRows(
      (data && data.students ? data.students : []).map((s) => {
        const marks = {};
        Object.entries(s.marks || {}).forEach(([subjectId, value]) => {
          marks[subjectId] = value != null ? String(value) : '';
        });
        return { ...s, marks };
      })
    );
    setLoading(false);
  }, [exam, selectedClass]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const setMark = (studentId, subjectId, value) => {
    if (value !== '' && value != null) {
      const numValue = Number(value);
      if (numValue > maxMarks) {
        toast.error(`Marks cannot exceed ${maxMarks}.`);
        return;
      }
      if (numValue < 0) {
        toast.error('Marks cannot be negative.');
        return;
      }
    }
    setRows((prev) =>
      prev.map((r) =>
        r.studentId === studentId ? { ...r, marks: { ...r.marks, [subjectId]: value } } : r
      )
    );
  };

  const handleSave = async () => {
    const records = [];
    rows.forEach((r) => {
      subjects.forEach((sub) => {
        const value = r.marks[sub.subjectId];
        if (value !== '' && value != null) {
          records.push({
            studentId: r.studentId,
            subjectId: sub.subjectId,
            marksObtained: Number(value),
          });
        }
      });
    });

    setSaving(true);
    try {
      const res = await ApiService.saveExamMarksAsync({ examId: exam.examId, records });
      if (res && res.data) {
        toast.success('Marks saved successfully!');
        load();
      } else if (res && res.errors && res.errors.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to save marks:', err);
      toast.error('Failed to save marks.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {exam && exam.examName ? exam.examName : ''} — Marks Entry (max {maxMarks})
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No students found for this class/section.
            </Typography>
          </Box>
        ) : subjects.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No subjects assigned to this class.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 460 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 70 }}>Roll</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>Student</TableCell>
                  {subjects.map((sub) => (
                    <TableCell key={sub.subjectId} align="center" sx={{ minWidth: 90 }}>
                      {sub.subjectName}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ minWidth: 90 }}>
                    Report
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.studentId} hover>
                    <TableCell>{r.rollNo || '-'}</TableCell>
                    <TableCell>{r.studentName}</TableCell>
                    {subjects.map((sub) => (
                      <TableCell key={sub.subjectId} align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={r.marks[sub.subjectId] != null ? r.marks[sub.subjectId] : ''}
                          onChange={(e) => setMark(r.studentId, sub.subjectId, e.target.value)}
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => onReport(r)}>
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
        <LoadingButton
          color="primary"
          variant="contained"
          loading={saving}
          onClick={handleSave}
          disabled={rows.length === 0 || subjects.length === 0}
        >
          Save Marks
        </LoadingButton>
        <Button variant="outlined" color="error" onClick={onClose} disabled={saving}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ExamMarksDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  exam: PropTypes.object,
  selectedClass: PropTypes.object,
  onReport: PropTypes.func.isRequired,
};
