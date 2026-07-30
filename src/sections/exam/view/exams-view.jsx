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
import { RouterLink } from 'src/routes/components';
import ApiService from 'src/services/ApiService';
import dateHelper from 'src/utils/dateHelper';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';

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
            component={RouterLink}
            href={paths.dashboard.exam.new}
            state={{ classId: selectedClass ? selectedClass.classId : null }}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
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
                  <TableCell align="center">Start Date</TableCell>
                  <TableCell align="center">End Date</TableCell>
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
                    <TableCell align="center">
                      {exam.startDate ? dateHelper.formatDate(exam.startDate) : '-'}
                    </TableCell>
                    <TableCell align="center">
                      {exam.endDate ? dateHelper.formatDate(exam.endDate) : '-'}
                    </TableCell>
                    <TableCell>
                      <Stack sx={{ typography: 'body2' }}>
                        <Box component="span">{exam.updatedBy ? exam.updatedBy : ''}</Box>
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
                          <IconButton
                            component={RouterLink}
                            href={paths.dashboard.exam.edit(exam.examId)}
                            size="small"
                          >
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
