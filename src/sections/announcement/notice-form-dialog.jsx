import dayjs from 'dayjs';
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
const PUBLISH_MODE_OPTIONS = [
  { value: 'NOW', label: 'Now' },
  { value: 'SCHEDULED', label: 'Publish Date' },
];

const NoticeSchema = zod
  .object({
    title: zod.string().trim().min(1, { message: 'Title is required.' }),
    message: zod.string().trim().min(1, { message: 'Message is required.' }),
    audience: zod.string().min(1, { message: 'Audience is required.' }),
    classIds: zod.array(zod.string()).optional(),
    publishMode: zod.enum(['NOW', 'SCHEDULED']),
    publishDate: zod.string().nullable().optional(),
  })
  .refine((data) => data.publishMode !== 'SCHEDULED' || !!data.publishDate, {
    message: 'Publish date is required.',
    path: ['publishDate'],
  });

const defaultValues = {
  title: '',
  message: '',
  audience: 'ALL',
  classIds: [],
  publishMode: 'NOW',
  publishDate: null,
};

export function NoticeFormDialog({ open, onClose, notice, classes, onSuccess }) {
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(NoticeSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const publishMode = watch('publishMode');

  useEffect(() => {
    if (!open) return;
    reset({
      title: notice && notice.title ? notice.title : '',
      message: notice && notice.message ? notice.message : '',
      audience: notice && notice.audience ? notice.audience : 'ALL',
      classIds:
        notice && Array.isArray(notice.classIds) ? notice.classIds.map((id) => String(id)) : [],
      publishMode: notice && notice.status === 'SCHEDULED' ? 'SCHEDULED' : 'NOW',
      publishDate: notice && notice.publishDate ? notice.publishDate : null,
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
        classIds: (values.classIds || []).map(Number),
        publishMode: values.publishMode,
        publishDate:
          values.publishMode === 'SCHEDULED' && values.publishDate
            ? dayjs(values.publishDate).format('YYYY-MM-DDTHH:mm:ss')
            : null,
      };
      const res = await ApiService.saveAnnouncementAsync(payload);
      if (res && res.data) {
        toast.success(notice ? 'Announcement updated.' : 'Announcement posted.');
        onSuccess();
        onClose();
      } else if (res && res.errors && res.errors.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to save announcement:', err);
      toast.error('Failed to save announcement.');
    } finally {
      setSaving(false);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {notice ? 'Edit Announcement' : 'New Announcement'}
      </DialogTitle>
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

              <Field.MultiSelect
                name="classIds"
                label="Classes (optional)"
                fullWidth
                checkbox
                chip
                placeholder="Whole school"
                options={classes.map((c) => ({ value: String(c.classId), label: c.className }))}
              />
            </Stack>

            <Field.RadioGroup name="publishMode" label="Publish" row options={PUBLISH_MODE_OPTIONS} />

            {publishMode === 'SCHEDULED' && (
              <Field.MobileDateTimePicker name="publishDate" label="Publish Date & Time" />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={saving || isSubmitting}
          >
            {notice ? 'Update' : 'Save'}
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
