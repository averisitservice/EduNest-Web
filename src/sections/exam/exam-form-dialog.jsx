import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import {
  Box,
  Stack,
  Alert,
  Dialog,
  Button,
  Divider,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

const ExamSchema = zod.object({
  examName: zod.string().trim().min(1, { message: 'Exam name is required.' }),
  maxMarks: zod.coerce.number().positive({ message: 'Max marks must be positive.' }),
  passMarks: zod.coerce.number().nonnegative({ message: 'Pass marks cannot be negative.' }),
  subjects: zod
    .array(
      zod.object({
        subjectId: zod.string(),
        subjectName: zod.string(),
        examDate: zod.string().min(1, { message: 'Date required.' }),
        startTime: zod.string().optional(),
        endTime: zod.string().optional(),
        maxMarks: zod.coerce.number().positive({ message: 'Max marks required.' }),
        passMarks: zod.coerce.number().nonnegative({ message: 'Pass marks ≥ 0.' }),
      })
    )
    .min(1, { message: 'This class has no subjects to schedule.' }),
});

const defaultValues = {
  examName: '',
  maxMarks: '100',
  passMarks: '35',
  subjects: [],
};

export function ExamFormDialog({ open, onClose, exam, classId, onSuccess }) {
  const [saving, setSaving] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const methods = useForm({
    resolver: zodResolver(ExamSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields } = useFieldArray({ control, name: 'subjects' });

  useEffect(() => {
    if (!open) return;

    const baseValues = {
      examName: exam && exam.examName ? exam.examName : '',
      maxMarks: exam && exam.maxMarks != null ? String(exam.maxMarks) : '100',
      passMarks: exam && exam.passMarks != null ? String(exam.passMarks) : '35',
      subjects: [],
    };
    reset(baseValues);

    if (classId == null) return;

    setLoadingSubjects(true);
    (async () => {
      try {
        const res = await ApiService.getClassSubjectsAsync(classId);
        const classSubjects = res && res.data ? res.data : [];

        // Prefill dates from an existing exam's schedule, keyed by subjectId.
        const existing = {};
        if (exam && Array.isArray(exam.subjects)) {
          exam.subjects.forEach((s) => {
            existing[String(s.subjectId)] = s;
          });
        }

        const rows = classSubjects.map((s) => {
          const prev = existing[String(s.subjectId)];
          return {
            subjectId: String(s.subjectId),
            subjectName: s.subjectName,
            examDate: prev && prev.examDate ? prev.examDate : '',
            startTime: prev && prev.startTime ? String(prev.startTime).slice(0, 5) : '',
            endTime: prev && prev.endTime ? String(prev.endTime).slice(0, 5) : '',
            maxMarks: prev && prev.maxMarks != null ? String(prev.maxMarks) : baseValues.maxMarks,
            passMarks:
              prev && prev.passMarks != null ? String(prev.passMarks) : baseValues.passMarks,
          };
        });

        reset({ ...baseValues, subjects: rows });
      } finally {
        setLoadingSubjects(false);
      }
    })();
  }, [open, exam, classId, reset]);

  const handleSave = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        examId: exam && exam.examId ? exam.examId : null,
        classId,
        examName: values.examName.trim(),
        maxMarks: Number(values.maxMarks),
        passMarks: Number(values.passMarks) || 0,
        examDate: null,
        subjects: (values.subjects || []).map((s) => ({
          subjectId: Number(s.subjectId),
          examDate: s.examDate || null,
          startTime: s.startTime || null,
          endTime: s.endTime || null,
          maxMarks: Number(s.maxMarks),
          passMarks: Number(s.passMarks) || 0,
        })),
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>{exam ? 'Edit Exam' : 'New Exam'}</DialogTitle>
      <Form methods={methods} onSubmit={handleSave}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <Field.Text name="examName" label="Exam Name" placeholder="e.g. Mid-Term" fullWidth />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Text name="maxMarks" type="number" label="Max Marks" fullWidth />
              <Field.Text name="passMarks" type="number" label="Pass Marks" fullWidth />
            </Stack>

            <Divider>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Datesheet
              </Typography>
            </Divider>

            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Set the exam date for every subject in this class.
            </Typography>

            {loadingSubjects ? (
              <Stack alignItems="center" sx={{ py: 3 }}>
                <CircularProgress size={26} />
              </Stack>
            ) : fields.length === 0 ? (
              <Alert severity="warning" variant="outlined">
                This class has no subjects assigned. Add subjects to the class first.
              </Alert>
            ) : (
              <Stack spacing={1.25}>
                {fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: 'background.neutral',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      alignItems={{ sm: 'flex-start' }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ minWidth: 140, pt: { sm: 1 } }}
                      >
                        <Iconify
                          icon="solar:book-2-bold-duotone"
                          sx={{ color: 'primary.main', flexShrink: 0 }}
                        />
                        <Typography variant="subtitle2" noWrap>
                          {field.subjectName}
                        </Typography>
                      </Stack>

                      <Box sx={{ flex: 1, width: 1 }}>
                        <Stack spacing={1.5}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <Box sx={{ flex: 1.4, minWidth: 0 }}>
                              <Field.DatePicker
                                name={`subjects.${index}.examDate`}
                                label="Exam Date"
                                allowFutureDates
                                allowPastDates
                                slotProps={{
                                  textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    sx: { minWidth: 0 },
                                  },
                                }}
                              />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Field.Text
                                name={`subjects.${index}.startTime`}
                                label="Start"
                                type="time"
                                size="small"
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                              />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Field.Text
                                name={`subjects.${index}.endTime`}
                                label="End"
                                type="time"
                                size="small"
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                              />
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={1.5}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Field.Text
                                name={`subjects.${index}.maxMarks`}
                                label="Max Marks"
                                type="number"
                                size="small"
                                fullWidth
                              />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Field.Text
                                name={`subjects.${index}.passMarks`}
                                label="Pass Marks"
                                type="number"
                                size="small"
                                fullWidth
                              />
                            </Box>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={saving || isSubmitting}
            disabled={loadingSubjects || fields.length === 0}
          >
            Save
          </LoadingButton>
          <Button
            variant="outlined"
            color="error"
            onClick={onClose}
            disabled={saving || isSubmitting}
          >
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
