import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import {
  Stack,
  Dialog,
  Button,
  MenuItem,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const AUDIENCE_OPTIONS = ['ALL', 'TEACHERS', 'PARENTS', 'STUDENTS'];
const today = () => new Date().toISOString().slice(0, 10);

const NoticeSchema = zod.object({
  title: zod.string().trim().min(1, { message: 'Title is required.' }),
  message: zod.string().trim().min(1, { message: 'Message is required.' }),
  audience: zod.string().min(1, { message: 'Audience is required.' }),
  classId: zod.string().optional(),
  publishDate: zod.string().min(1, { message: 'Publish date is required.' }),
});

const defaultValues = {
  title: '',
  message: '',
  audience: 'ALL',
  classId: '',
  publishDate: today(),
};

export function NoticeFormDialog({ open, onClose, notice, classes, onSuccess }) {
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(NoticeSchema),
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
      title: notice && notice.title ? notice.title : '',
      message: notice && notice.message ? notice.message : '',
      audience: notice && notice.audience ? notice.audience : 'ALL',
      classId: notice && notice.classId != null ? String(notice.classId) : '',
      publishDate: notice && notice.publishDate ? notice.publishDate : today(),
    });
  }, [open, notice, reset]);

  const handleSave = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        announcementId: notice && notice.announcementId ? notice.announcementId : null,
        title: values.title.trim(),
        message: values.message.trim(),
        audience: values.audience,
        classId: values.classId === '' ? null : Number(values.classId),
        publishDate: values.publishDate || null,
      };
      const res = await ApiService.saveAnnouncementAsync(payload);
      if (res && res.data) {
        toast.success(notice ? 'Notice updated.' : 'Notice posted.');
        onSuccess();
        onClose();
      } else if (res && res.errors && res.errors.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to save notice:', err);
      toast.error('Failed to save notice.');
    } finally {
      setSaving(false);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>{notice ? 'Edit Notice' : 'New Notice'}</DialogTitle>
      <Form methods={methods} onSubmit={handleSave}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <Field.Text name="title" label="Title" fullWidth />
            <Field.Text name="message" label="Message" multiline minRows={3} fullWidth />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Select name="audience" label="Audience" fullWidth>
                {AUDIENCE_OPTIONS.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="classId" label="Class (optional)" fullWidth>
                <MenuItem value="">
                  <em>Whole school</em>
                </MenuItem>
                {classes.map((c) => (
                  <MenuItem key={c.classId} value={String(c.classId)}>
                    {c.className}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>

            <Field.DatePicker
              name="publishDate"
              label="Publish Date"
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
            loading={saving || isSubmitting}
          >
            {notice ? 'Update' : 'Post'}
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
