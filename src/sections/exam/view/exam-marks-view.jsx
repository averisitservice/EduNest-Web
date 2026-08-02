import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router';
import {
  Box,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  CircularProgress,
  TableContainer,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function ExamMarksView() {
  const { id: examId } = useParams();
  const location = useLocation();
  const { classId, sectionId, examName } = location.state || {};

  const [subjects, setSubjects] = useState([]);
  const [maxMarks, setMaxMarks] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!examId || !classId) return;
    setLoading(true);
    const res = await ApiService.getExamMarksEntryAsync(examId, classId, sectionId);
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
  }, [examId, classId, sectionId]);

  useEffect(() => {
    load();
  }, [load]);

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
      const res = await ApiService.saveExamMarksAsync({ examId, records });
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
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading={examName ? `${examName} — Marks Entry` : 'Marks Entry'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Exams', href: paths.dashboard.exam.root },
          { name: 'Marks Entry' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.exam.report(examId)}
            state={{ classId, sectionId, examName }}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="solar:document-text-bold" />}
          >
            Generate Report
          </Button>
        }
        sx={{ mb: { xs: 2, md: 3 } }}
      />

      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows?.card,
        }}
      >
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
          <TableContainer sx={{ maxHeight: 640 }}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ p: 2 }}>
          <LoadingButton
            color="primary"
            variant="contained"
            loading={saving}
            onClick={handleSave}
            disabled={rows.length === 0 || subjects.length === 0}
          >
            Save Marks
          </LoadingButton>
        </Box>
      </Box>
    </DashboardContent>
  );
}
