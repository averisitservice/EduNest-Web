import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router';
import {
  Box,
  Chip,
  Card,
  Table,
  Stack,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CircularProgress,
  TableContainer,
} from '@mui/material';
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
import ApiService from 'src/services/ApiService';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function ExamReportView() {
  const { id: examId } = useParams();
  const location = useLocation();
  const { classId, sectionId, examName } = location.state || {};

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!examId || !classId) return;
    setLoading(true);
    const rosterRes = await ApiService.getExamMarksEntryAsync(examId, classId, sectionId);
    const students =
      rosterRes && rosterRes.data && rosterRes.data.students ? rosterRes.data.students : [];

    const results = await Promise.all(
      students.map((s) => ApiService.getReportCardAsync(examId, s.studentId))
    );
    setReports(results.map((res) => (res && res.data ? res.data : null)).filter(Boolean));
    setLoading(false);
  }, [examId, classId, sectionId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading={examName ? `${examName} — Report` : 'Exam Report'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Exams', href: paths.dashboard.exam.root },
          { name: 'Report' },
        ]}
        sx={{ mb: { xs: 2, md: 3 } }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : reports.length === 0 ? (
        <Card sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No report data available.
          </Typography>
        </Card>
      ) : (
        <Stack spacing={3}>
          {reports.map((report) => (
            <Card key={report.studentId} sx={{ p: 3 }}>
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
            </Card>
          ))}
        </Stack>
      )}
    </DashboardContent>
  );
}
