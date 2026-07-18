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
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  TableContainer,
  InputAdornment,
} from '@mui/material';
import { paths } from 'src/routes/paths';
import ApiService from 'src/services/ApiService';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { FeeCollectDialog } from '../fee-collect-dialog';
import { FeeHistoryDialog } from '../fee-history-dialog';
import { fNumber } from 'src/utils/format-number';



function getClassLabel(option) {
  if (!option) return '';
  return option.sectionName
    ? `${option.className} - ${option.sectionName}`
    : option.className || '';
}

function classKey(option) {
  if (!option) return '';
  return `${option.classId}-${option.sectionId ?? 'null'}`;
}


export function FeesView() {
  const [classSections, setClassSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [collectStudent, setCollectStudent] = useState(null);
  const [historyStudent, setHistoryStudent] = useState(null);

  useEffect(() => {
    async function loadClasses() {
      const res = await ApiService.getAllClassMasterSectionsAsync();
      const list = res && res.data ? res.data : [];
      setClassSections(list);
      if (list.length > 0) setSelectedClass(list[0]);
    }
    loadClasses();
  }, []);

  const loadStatus = useCallback(async () => {
    if (!selectedClass) {
      setRows([]);
      return;
    }
    setLoading(true);
    const res = await ApiService.getFeeStatusAsync(
      selectedClass.classId,
      selectedClass.sectionId
    );
    setRows(res && res.data ? res.data : []);
    setLoading(false);
  }, [selectedClass]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleSelectClass = (value) => {
    setSelectedClass(classSections.find((c) => classKey(c) === value) || null);
    setSearchQuery('');
  };

  const dataFiltered = rows.filter((row) => {
    const name = row.studentName ? row.studentName.toLowerCase() : '';
    const roll = row.rollNo ? String(row.rollNo).toLowerCase() : '';
    const query = searchQuery.toLowerCase();
    return name.indexOf(query) !== -1 || roll.indexOf(query) !== -1;
  });

  const totalDue = rows.reduce((sum, r) => sum + (Number(r.dueAmount) || 0), 0);
  const totalPaid = rows.reduce((sum, r) => sum + (Number(r.paidAmount) || 0), 0);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Fees"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Fees', href: paths.dashboard.fees.root },
        ]}
        sx={{ mb: 4 }}
      />

      <Card sx={{ mb: 3, p: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexGrow: 1, mr: 2 }}>
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

            <TextField
              size="small"
              placeholder="Search by name or roll no"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ flexShrink: 0 }}>
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>
              Collected: {fNumber(totalPaid)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 700 }}>
              Due: {fNumber(totalDue)}
            </Typography>
          </Stack>
        </Stack>
      </Card>

      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No students found for this class.
            </Typography>
          </Box>
        ) : dataFiltered.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No students found matching your search.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 90 }}>Roll No</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell align="right">Annual Fee</TableCell>
                  <TableCell align="right">Paid</TableCell>
                  <TableCell align="right">Due</TableCell>
                  <TableCell align="center" sx={{ width: 160 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFiltered.map((r) => {
                  const due = Number(r.dueAmount) || 0;
                  return (
                    <TableRow key={r.studentId} hover>
                      <TableCell>{r.rollNo || '-'}</TableCell>
                      <TableCell>{r.studentName}</TableCell>
                      <TableCell align="right">{fNumber(r.annualFee)}</TableCell>
                      <TableCell align="right">{fNumber(r.paidAmount)}</TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 700, color: due > 0 ? 'error.main' : 'success.main' }}
                      >
                        {fNumber(due)}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            disabled={due <= 0}
                            onClick={() => setCollectStudent(r)}
                          >
                            Collect
                          </Button>
                          <Tooltip title="History">
                            <IconButton size="small" color="primary" onClick={() => setHistoryStudent(r)}>
                              <Iconify icon="solar:clock-circle-bold-duotone" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <FeeCollectDialog
        open={Boolean(collectStudent)}
        onClose={() => setCollectStudent(null)}
        student={collectStudent}
        onSuccess={loadStatus}
      />

      <FeeHistoryDialog
        open={Boolean(historyStudent)}
        onClose={() => setHistoryStudent(null)}
        student={historyStudent}
      />
    </DashboardContent>
  );
}
