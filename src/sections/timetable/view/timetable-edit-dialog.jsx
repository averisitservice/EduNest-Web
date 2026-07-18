import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import {
  Stack,
  Button,
  Dialog,
  MenuItem,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

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

const TimetablePeriodSchema = zod.object({
  subjectId: zod.any().refine((val) => val !== null && val !== undefined && String(val).trim() !== '', {
    message: 'Subject is required.',
  }),
  teacherId: zod.any().refine((val) => val !== null && val !== undefined && String(val).trim() !== '', {
    message: 'Teacher is required.',
  }),
});

export function TimetableEditDialog({
  open,
  onClose,
  row,
  day,
  subjects,
  selectedClass,
  workingDayId,
  onSuccess,
}) {
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const defaultValues = {
    subjectId: '',
    teacherId: '',
  };

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(TimetablePeriodSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const subjectId = watch('subjectId');

  useEffect(() => {
    if (open && row && day) {
      const cell = row.cells?.[day] || {};
      reset({
        subjectId: cell.subjectId ?? '',
        teacherId: cell.teacherId ?? '',
      });
    }
  }, [open, row, day, reset]);

  useEffect(() => {
    if (!subjectId) {
      setTeacherOptions([]);
      setValue('teacherId', '');
      return undefined;
    }
    let active = true;
    setLoadingTeachers(true);
    (async () => {
      try {
        const res = await ApiService.getTeachersBySubjectAsync(subjectId);
        if (active) setTeacherOptions(res?.data ?? []);
      } catch (err) {
        console.error('Failed to load teachers for subject:', err);
        if (active) setTeacherOptions([]);
      } finally {
        if (active) setLoadingTeachers(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [subjectId, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedClass || !row) return;

    try {
      const payload = {
        classId: selectedClass.classId,
        sectionId: selectedClass.sectionId,
        workingDayId,
        timeSlotId: row.timeSlotId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
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
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Assign Period</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {day} &nbsp;•&nbsp; {getRowTimeLabel(row)}
            </Typography>

            <Field.Select name="subjectId" label="Subject">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {subjects.map((sub) => (
                <MenuItem key={sub.subjectId} value={sub.subjectId}>
                  {sub.subjectName}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select
              name="teacherId"
              label="Teacher"
              disabled={!subjectId || loadingTeachers}
              helperText={
                !subjectId
                  ? 'Select a subject first'
                  : loadingTeachers
                    ? 'Loading teachers…'
                    : teacherOptions.length === 0
                      ? 'No teachers assigned to this subject'
                      : ''
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {teacherOptions.map((teacher) => (
                <MenuItem key={teacher.teacherId} value={teacher.teacherId}>
                  {teacher.teacherName}
                </MenuItem>
              ))}
            </Field.Select>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start' }}>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            Save
          </LoadingButton>
          <Button variant="outlined" color="error" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

TimetableEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  row: PropTypes.object,
  day: PropTypes.string,
  subjects: PropTypes.array.isRequired,
  selectedClass: PropTypes.object,
  workingDayId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSuccess: PropTypes.func.isRequired,
};
