import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import {
  Box,
  Card,
  Stack,
  Alert,
  Button,
  Divider,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Form, Field } from 'src/components/hook-form';
import { useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

const ExamSchema = zod.object({
  studentClass: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Class & Section is required.' }),
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
  studentClass: null,
  examName: '',
  maxMarks: '100',
  passMarks: '35',
  subjects: [],
};

export function ExamSaveForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [classMasters, setClassMasters] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(ExamSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields } = useFieldArray({ control, name: 'subjects' });

  useEffect(() => {
    const fetchData = async () => {
      setFetchingData(true);

      const classRes = await ApiService.getAllClassMasterSectionsAsync();
      const classList = classRes && classRes.data ? classRes.data : [];
      setClassMasters(classList);

      let initialClass = null;
      let initialExam = null;

      if (id) {
        const examRes = await ApiService.getExamByIdAsync(id);
        initialExam = examRes && examRes.data ? examRes.data : null;
      }

      if (initialExam) {
        initialClass =
          classList.find((c) => c.classId === initialExam.classId) || null;
      } else if (location.state && location.state.classId) {
        initialClass =
          classList.find((c) => c.classId === location.state.classId) || null;
      } else if (classList.length > 0) {
        initialClass = classList[0];
      }

      const baseValues = {
        studentClass: initialClass,
        examName: initialExam && initialExam.examName ? initialExam.examName : '',
        maxMarks: initialExam && initialExam.maxMarks != null ? String(initialExam.maxMarks) : '100',
        passMarks: initialExam && initialExam.passMarks != null ? String(initialExam.passMarks) : '35',
        subjects: [],
      };

      if (initialClass) {
        setLoadingSubjects(true);
        const subRes = await ApiService.getClassSubjectsAsync(initialClass.classId);
        const classSubjects = subRes && subRes.data ? subRes.data : [];

        const existing = {};
        if (initialExam && Array.isArray(initialExam.subjects)) {
          initialExam.subjects.forEach((s) => {
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
        setLoadingSubjects(false);
      } else {
        reset(baseValues);
      }

      setFetchingData(false);
    };

    fetchData();
  }, [id, location.state, reset]);

  const handleClassChange = async (newClass) => {
    methods.setValue('studentClass', newClass, { shouldValidate: true });
    if (!newClass) {
      methods.setValue('subjects', []);
      return;
    }
    setLoadingSubjects(true);
    const subRes = await ApiService.getClassSubjectsAsync(newClass.classId);
    const classSubjects = subRes && subRes.data ? subRes.data : [];
    const currentMaxMarks = methods.getValues('maxMarks') || '100';
    const currentPassMarks = methods.getValues('passMarks') || '35';

    const rows = classSubjects.map((s) => ({
      subjectId: String(s.subjectId),
      subjectName: s.subjectName,
      examDate: '',
      startTime: '',
      endTime: '',
      maxMarks: currentMaxMarks,
      passMarks: currentPassMarks,
    }));
    methods.setValue('subjects', rows, { shouldValidate: true });
    setLoadingSubjects(false);
  };

  const handleSave = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const selectedClass = values.studentClass;
      const payload = {
        examId: id ? Number(id) : null,
        classId: selectedClass ? selectedClass.classId : null,
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
        toast.success(id ? 'Exam updated successfully.' : 'Exam created successfully.');
        navigate(paths.dashboard.exam.root);
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

  if (fetchingData) {
    return <LoadingScreen />;
  }

  return (
    <Form methods={methods} onSubmit={handleSave}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Exam Information
              </Typography>
              <Stack spacing={2.5}>
                <Controller
                  name="studentClass"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      fullWidth
                      options={classMasters}
                      value={field.value || null}
                      onChange={(event, newValue) => handleClassChange(newValue)}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        return option.sectionName
                          ? `${option.className} - ${option.sectionName}`
                          : option.className || '';
                      }}
                      isOptionEqualToValue={(option, value) => {
                        if (!option || !value) return false;
                        return (
                          option.classId === value.classId && option.sectionId === value.sectionId
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Class & Section"
                          placeholder="Select Class & Section"
                          error={Boolean(errors.studentClass)}
                          helperText={
                            errors.studentClass ? errors.studentClass.message : undefined
                          }
                        />
                      )}
                    />
                  )}
                />

                <Field.Text
                  name="examName"
                  label="Exam Name"
                  placeholder="e.g. Mid-Term / Final Exam"
                  fullWidth
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Field.Text name="maxMarks" type="number" label="Max Marks" fullWidth />
                  <Field.Text name="passMarks" type="number" label="Pass Marks" fullWidth />
                </Stack>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Divider sx={{ mb: 2 }}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  Datesheet
                </Typography>
              </Divider>

              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                Set the exam date and schedule for each subject in this class.
              </Typography>

              {loadingSubjects ? (
                <Stack alignItems="center" sx={{ py: 4 }}>
                  <CircularProgress size={30} />
                </Stack>
              ) : fields.length === 0 ? (
                <Alert severity="warning" variant="outlined">
                  This class has no subjects assigned. Add subjects to the class first.
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <Box
                      key={field.id}
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        bgcolor: 'background.neutral',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems={{ sm: 'flex-start' }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ minWidth: 150, pt: { sm: 1 } }}
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
                                  label="Start Time"
                                  type="time"
                                  size="small"
                                  fullWidth
                                  slotProps={{ inputLabel: { shrink: true } }}
                                />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Field.Text
                                  name={`subjects.${index}.endTime`}
                                  label="End Time"
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
            </Card>

            <Stack direction="row" spacing={2} justifyContent="flex-start">
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={saving || isSubmitting}
                disabled={loadingSubjects || fields.length === 0}
              >
                {id ? 'Update Exam' : 'Create Exam'}
              </LoadingButton>
              <Button
                variant="outlined"
                color="error"
                onClick={() => navigate(-1)}
                disabled={saving || isSubmitting}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
