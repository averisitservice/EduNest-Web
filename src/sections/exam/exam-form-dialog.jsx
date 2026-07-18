import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import {
  Stack,
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

const today = () => new Date().toISOString().slice(0, 10);

const ExamSchema = zod.object({
  examName: zod.string().trim().min(1, { message: 'Exam name is required.' }),
  maxMarks: zod.coerce.number().positive({ message: 'Max marks must be positive.' }),
  passMarks: zod.coerce.number().nonnegative({ message: 'Pass marks cannot be negative.' }),
  examDate: zod.string().min(1, { message: 'Exam date is required.' }),
});

const defaultValues = {
  examName: '',
  maxMarks: '100',
  passMarks: '35',
  examDate: today(),
};

export function ExamFormDialog({ open, onClose, exam, classId, onSuccess }) {
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(ExamSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!open) return;
    reset({
      examName: exam && exam.examName ? exam.examName : '',
      maxMarks: exam && exam.maxMarks != null ? String(exam.maxMarks) : '100',
      passMarks: exam && exam.passMarks != null ? String(exam.passMarks) : '35',
      examDate: exam && exam.examDate ? exam.examDate : today(),
    });
  }, [open, exam, reset]);

  const handleSave = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        examId: exam && exam.examId ? exam.examId : null,
        classId,
        examName: values.examName.trim(),
        maxMarks: Number(values.maxMarks),
        passMarks: Number(values.passMarks) || 0,
        examDate: values.examDate || null,
      };
      const res = await ApiService.saveExamAsync(payload);
      if (res && res.data) {
        toast.success(exam ? 'Exam updated.' : 'Exam created.');
        onSuccess();
        onClose();
      } else if (res && res.errors && res.errors.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to save exam:', err);
      toast.error('Failed to save exam.');
    } finally {
      setSaving(false);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>{exam ? 'Edit Exam' : 'New Exam'}</DialogTitle>
      <Form methods={methods} onSubmit={handleSave}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <Field.Text
              name="examName"
              label="Exam Name"
              placeholder="e.g. Mid-Term"
              fullWidth
            />
            <Field.Text
              name="maxMarks"
              type="number"
              label="Max Marks"
              fullWidth
            />
            <Field.Text
              name="passMarks"
              type="number"
              label="Pass Marks"
              fullWidth
            />
            <Field.DatePicker
              name="examDate"
              label="Exam Date"
              allowFutureDates
              allowPastDates
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={saving || isSubmitting}>
            Save
          </LoadingButton>
          <Button variant="outlined" color="error" onClick={onClose} disabled={saving || isSubmitting}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

ExamFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  exam: PropTypes.object,
  classId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSuccess: PropTypes.func.isRequired,
};
