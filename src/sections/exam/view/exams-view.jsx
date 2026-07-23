import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  Select,
  Tooltip,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  CircularProgress,
  TableContainer,
} from '@mui/material';
import { paths } from 'src/routes/paths';
import ApiService from 'src/services/ApiService';
import dateHelper from 'src/utils/dateHelper';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { ExamFormDialog } from '../exam-form-dialog';
import { ExamMarksDialog } from '../exam-marks-dialog';
import { ReportCardDialog } from '../report-card-dialog';

function getClassLabel(option) {
  if (!option) return '';
  return option.sectionName
    ? `${option.className} - ${option.sectionName}`
    : option.className || '';
}

function classKey(option) {
  if (!option) return '';
  return `${option.classId}-${option.sectionId != null ? option.sectionId : 'null'}`;
}

export function ExamsView() {
  const [classSections, setClassSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formExam, setFormExam] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [marksExam, setMarksExam] = useState(null);
  const [reportStudent, setReportStudent] = useState(null);
  const [deleteExam, setDeleteExam] = useState(null);

  useEffect(() => {
    async function loadClasses() {
      const res = await ApiService.getAllClassMasterSectionsAsync();
      const list = res && res.data ? res.data : [];
      setClassSections(list);
      if (list.length > 0) setSelectedClass(list[0]);
    }
    loadClasses();
  }, []);

  const loadExams = useCallback(async () => {
    if (!selectedClass) {
      setExams([]);
      return;
    }
    setLoading(true);
    const res = await ApiService.getExamListAsync(selectedClass.classId);
    setExams(res && res.data ? res.data : []);
    setLoading(false);
  }, [selectedClass]);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const handleSelectClass = (value) => {
    setSelectedClass(classSections.find((c) => classKey(c) === value) || null);
  };

  const openNew = () => {
    setFormExam(null);
    setFormOpen(true);
  };

  const openEdit = (exam) => {
    setFormExam(exam);
    setFormOpen(true);
  };

  const handleDelete = async (exam) => {
    if (!exam) return;
    const res = await ApiService.deleteExamAsync(exam.examId);
    if (res && res.data) {
      toast.success('Exam deleted.');
      loadExams();
    } else if (res && res.errors && res.errors.length) {
      toast.error(res.errors[0].msg);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Exams"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Exams', href: paths.dashboard.exam.root },
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openNew}
            disabled={!selectedClass}
          >
            New Exam
          </Button>
        }
        sx={{ mb: 4 }}
      />

      <Card sx={{ mb: 3, p: 2 }}>
        <Select
          size="small"
          value={classKey(selectedClass)}
          onChange={(e) => handleSelectClass(e.target.value)}
          displayEmpty
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="" disabled>
            <em>Select Class & Section</em>
          </MenuItem>
          {classSections.map((option) => (
            <MenuItem key={classKey(option)} value={classKey(option)}>
              {getClassLabel(option)}
            </MenuItem>
          ))}
        </Select>
      </Card>

      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : exams.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No exams yet. Click “New Exam” to create one.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Exam</TableCell>
                  <TableCell align="center">Max Marks</TableCell>
                  <TableCell align="center">Pass Marks</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell>Updated By</TableCell>
                  <TableCell align="center" sx={{ width: 200 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.examId} hover>
                    <TableCell>{exam.examName}</TableCell>
                    <TableCell align="center">{exam.maxMarks}</TableCell>
                    <TableCell align="center">{exam.passMarks}</TableCell>
                    <TableCell align="center">{exam.examDate || '-'}</TableCell>
                    <TableCell>
                      <Stack sx={{ typography: 'body2' }}>
                        <Box component="span">{exam.updatedBy ?? ''}</Box>
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          {exam.updatedDate ? dateHelper.formatDateTime(exam.updatedDate) : '-'}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button size="small" variant="outlined" onClick={() => setMarksExam(exam)}>
                          Enter Marks
                        </Button>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(exam)}>
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteExam(exam)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <ExamFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        exam={formExam}
        classId={selectedClass && selectedClass.classId ? selectedClass.classId : null}
        onSuccess={loadExams}
      />

      <ExamMarksDialog
        open={Boolean(marksExam)}
        onClose={() => setMarksExam(null)}
        exam={marksExam}
        selectedClass={selectedClass}
        onReport={(student) => setReportStudent(student)}
      />

      <ReportCardDialog
        open={Boolean(reportStudent)}
        onClose={() => setReportStudent(null)}
        examId={marksExam && marksExam.examId ? marksExam.examId : null}
        student={reportStudent}
      />

      <ConfirmDialog
        open={Boolean(deleteExam)}
        onClose={() => setDeleteExam(null)}
        title="Delete Exam"
        content={
          deleteExam && deleteExam.examName
            ? `Are you sure you want to delete ${deleteExam.examName}?`
            : 'Are you sure you want to delete this exam?'
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(deleteExam);
              setDeleteExam(null);
            }}
          >
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
