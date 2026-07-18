import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Select,
  Dialog,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';

// Helper to format time slot label
function formatTime(value) {
  if (!value) return '';
  let hours;
  let minutes;
  if (Array.isArray(value)) {
    [hours, minutes] = value;
  } else if (typeof value === 'string') {
    const [h, m] = value.split(':');
    hours = Number(h);
    minutes = Number(m);
  } else {
    return '';
  }
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return '';
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

function getRowTimeLabel(row) {
  if (!row) return '';
  const range = [formatTime(row.startTime), formatTime(row.endTime)].filter(Boolean).join(' - ');
  return range || row.slotName || '';
}

export function TimetableEditDialog({
  open,
  onClose,
  row,
  day,
  subjects,
  teachers,
  selectedClass,
  workingDayId,
  onSuccess,
}) {
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [teacherError, setTeacherError] = useState('');
  const [saving, setSaving] = useState(false);

  // Update form fields when the row or day changes (e.g. when opening the dialog)
  useEffect(() => {
    if (open && row && day) {
      const cell = row.cells?.[day] || {};
      setSubjectId(cell.subjectId ?? '');
      setTeacherId(cell.teacherId ?? '');
      setSubjectError('');
      setTeacherError('');
    }
  }, [open, row, day]);

  const handleSave = async () => {
    let isValid = true;
    if (!subjectId) {
      setSubjectError('Subject is required.');
      isValid = false;
    } else {
      setSubjectError('');
    }

    if (!teacherId) {
      setTeacherError('Teacher is required.');
      isValid = false;
    } else {
      setTeacherError('');
    }

    if (!isValid || !selectedClass || !row) return;

    setSaving(true);
    try {
      const payload = {
        classId: selectedClass.classId,
        sectionId: selectedClass.sectionId,
        workingDayId,
        timeSlotId: row.timeSlotId,
        subjectId,
        teacherId,
      };
      const res = await ApiService.saveTimetableCellAsync(payload);
      if (res?.data) {
        toast.success('Slot saved successfully!');
        onSuccess();
        onClose();
      } else if (res?.errors?.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to save cell:', err);
      toast.error('Failed to save cell.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Assign Period</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {day} &nbsp;•&nbsp; {getRowTimeLabel(row)}
          </Typography>

          <FormControl fullWidth error={Boolean(subjectError)}>
            <InputLabel id="edit-subject-label">Subject</InputLabel>
            <Select
              labelId="edit-subject-label"
              value={subjectId}
              label="Subject"
              onChange={(e) => {
                setSubjectId(e.target.value);
                if (e.target.value) setSubjectError('');
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {subjects.map((sub) => (
                <MenuItem key={sub.subjectId} value={sub.subjectId}>
                  {sub.subjectName}
                </MenuItem>
              ))}
            </Select>
            {subjectError && <FormHelperText>{subjectError}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={Boolean(teacherError)}>
            <InputLabel id="edit-teacher-label">Teacher</InputLabel>
            <Select
              labelId="edit-teacher-label"
              value={teacherId}
              label="Teacher"
              onChange={(e) => {
                setTeacherId(e.target.value);
                if (e.target.value) setTeacherError('');
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {teachers.map((teacher) => (
                <MenuItem key={teacher.teacherId} value={teacher.teacherId}>
                  {teacher.teacherName}
                </MenuItem>
              ))}
            </Select>
            {teacherError && <FormHelperText>{teacherError}</FormHelperText>}
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-start' }}>
        <LoadingButton
          onClick={handleSave}
          variant="contained"
          color="primary"
          loading={saving}
        >
          Save
        </LoadingButton>
        <Button variant="outlined" color="error" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TimetableEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  row: PropTypes.object,
  day: PropTypes.string,
  subjects: PropTypes.array.isRequired,
  teachers: PropTypes.array.isRequired,
  selectedClass: PropTypes.object,
  workingDayId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSuccess: PropTypes.func.isRequired,
};
