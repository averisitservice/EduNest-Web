import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import {
  Box,
  Stack,
  Dialog,
  Button,
  MenuItem,
  FormLabel,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

const today = () => new Date().toISOString().slice(0, 10);

const HomeworkSchema = zod.object({
  subjectId: zod.string().optional(),
  title: zod.string().trim().min(1, { message: 'Title is required.' }),
  description: zod.string().trim().optional(),
  dueDate: zod.string().optional(),
});

const defaultValues = {
  subjectId: '',
  title: '',
  description: '',
  dueDate: today(),
};

export function HomeworkFormDialog({ open, onClose, item, selectedClass, subjects, onSuccess }) {
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  const [selectedFile, setSelectedFile] = useState(null);

  const methods = useForm({
    resolver: zodResolver(HomeworkSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!open) return;

    setFileName(item && item.attachmentUrl ? 'Attached File' : 'No file chosen');
    setSelectedFile(null);

    reset({
      subjectId: item && item.subjectId != null ? String(item.subjectId) : '',
      title: item && item.title ? item.title : '',
      description: item && item.description ? item.description : '',
      dueDate: item && item.dueDate ? item.dueDate : today(),
    });
  }, [open, item, reset]);

  const handleFileChange = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setSelectedFile(file);
    } else {
      setFileName('No file chosen');
      setSelectedFile(null);
    }
  };

  const handleSave = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        homeworkId: item && item.homeworkId ? item.homeworkId : null,
        classId: selectedClass && selectedClass.classId ? selectedClass.classId : null,
        sectionId:
          selectedClass && selectedClass.sectionId != null ? selectedClass.sectionId : null,
        subjectId: values.subjectId === '' ? null : Number(values.subjectId),
        title: values.title.trim(),
        description: values.description.trim() || null,
        dueDate: values.dueDate || null,
      };
      const res = await ApiService.saveHomeworkAsync(payload, selectedFile);
      if (res && res.data) {
        toast.success(item ? 'Homework updated.' : 'Homework posted.');
        onSuccess();
        onClose();
      } else if (res && res.errors && res.errors.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to save:', err);
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {item ? 'Edit Homework' : 'New Homework'}
      </DialogTitle>
      <Form methods={methods} onSubmit={handleSave}>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <Field.Select name="subjectId" label="Subject" fullWidth>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {subjects.map((s) => (
                <MenuItem key={s.subjectId} value={String(s.subjectId)}>
                  {s.subjectName}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="title" label="Title" fullWidth />

            <Field.Text name="description" label="Description" multiline minRows={3} fullWidth />

            <Field.DatePicker
              name="dueDate"
              label="Due Date"
              allowFutureDates
              allowPastDates
              slotProps={{ textField: { fullWidth: true } }}
            />

            <Box sx={{ mt: 1 }}>
              <FormLabel
                htmlFor="attachment-file"
                sx={{ display: 'block', mb: 1, fontWeight: 'medium' }}
              >
                Attachment File (optional)
              </FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Iconify icon="solar:upload-bold" />}
                >
                  Choose File
                  <input id="attachment-file" type="file" hidden onChange={handleFileChange} />
                </Button>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {fileName}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={saving || isSubmitting}
          >
            {item ? 'Update' : 'Save'}
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
