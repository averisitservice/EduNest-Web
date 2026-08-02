import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Chip,
  Stack,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import ApiService from 'src/services/ApiService';
import dateHelper from 'src/utils/dateHelper';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import LoadingButton from '@mui/lab/LoadingButton';

const STATUS_COLOR = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

function getClassLabel(option) {
  if (!option) return '';
  return option.sectionName
    ? `${option.className} - ${option.sectionName}`
    : option.className || '';
}

function classKey(option) {
  if (!option) return '';
  return `${option.classId}-${option.sectionId !== null && option.sectionId !== undefined ? option.sectionId : 'null'}`;
}

export function LeaveView() {
  const [classSections, setClassSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    async function loadClasses() {
      const res = await ApiService.getAllClassMasterSectionsAsync();
      const list = res && res.data ? res.data : [];
      setClassSections(list);
      if (list.length > 0) setSelectedClass(list[0]);
    }
    loadClasses();
  }, []);

  const loadItems = useCallback(async () => {
    if (!selectedClass) {
      setItems([]);
      return;
    }
    setLoading(true);
    const res = await ApiService.getLeaveListAsync(selectedClass.classId, selectedClass.sectionId);
    setItems(res && res.data ? res.data : []);
    setLoading(false);
  }, [selectedClass]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSelectClass = (value) => {
    setSelectedClass(classSections.find((c) => classKey(c) === value) || null);
  };

  const handleAction = async (item, status) => {
    setActioningId(item.leaveId);
    const res = await ApiService.updateLeaveStatusAsync(item.leaveId, status);
    if (res && res.data) {
      toast.success(status === 'APPROVED' ? 'Leave approved.' : 'Leave rejected.');
      loadItems();
    } else if (res && res.errors && res.errors.length) {
      toast.error(res.errors[0].msg);
    }
    setActioningId(null);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Leave Requests"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Leave Requests', href: '' },
        ]}
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
        ) : items.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No leave requests found.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2} sx={{ p: 2 }}>
            {items.map((item) => (
              <Card key={item.leaveId} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flexGrow: 1, pr: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {item.studentName}
                      </Typography>
                      {item.rollNo && <Chip size="small" label={`Roll No: ${item.rollNo}`} />}
                      <Chip
                        size="small"
                        color={STATUS_COLOR[item.status] || 'default'}
                        label={item.status}
                      />
                      {item.leaveDate && (
                        <Chip
                          size="small"
                          color="info"
                          label={`Leave Date: ${dateHelper.formatDate(item.leaveDate)}`}
                        />
                      )}
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item.reason}
                    </Typography>
                  </Box>
                  {item.status === 'PENDING' && (
                    <Stack direction="row" spacing={1}>
                      <LoadingButton
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<Iconify icon="solar:check-circle-bold" />}
                        loading={actioningId === item.leaveId}
                        onClick={() => handleAction(item, 'APPROVED')}
                      >
                        Approve
                      </LoadingButton>
                      <LoadingButton
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Iconify icon="solar:close-circle-bold" />}
                        loading={actioningId === item.leaveId}
                        onClick={() => handleAction(item, 'REJECTED')}
                      >
                        Reject
                      </LoadingButton>
                    </Stack>
                  )}
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.disabled', mt: 1, display: 'block' }}
                >
                  Requested {item.createdDate ? dateHelper.formatDateTime(item.createdDate) : ''}
                  {item.updatedBy
                    ? ` • ${item.status === 'APPROVED' ? 'Approved' : 'Rejected'} by ${item.updatedBy} ${item.updatedDate ? `on ${dateHelper.formatDateTime(item.updatedDate)}` : ''}`
                    : ''}
                </Typography>
              </Card>
            ))}
          </Stack>
        )}
      </Card>
    </DashboardContent>
  );
}
