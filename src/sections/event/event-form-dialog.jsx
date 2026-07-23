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
const TYPE_OPTIONS = ['GENERAL', 'HOLIDAY', 'EXAM', 'SPORTS', 'CULTURAL', 'MEETING'];

const today = () => new Date().toISOString().slice(0, 10);

const EventSchema = zod
  .object({
    title: zod.string().trim().min(1, { message: 'Title is required.' }),
    description: zod.string().optional(),
    eventType: zod.string().min(1, { message: 'Event type is required.' }),
    venue: zod.string().optional(),
    startDate: zod.string().min(1, { message: 'Start date is required.' }),
    endDate: zod.string().optional().nullable(),
    isAllDay: zod.boolean(),
    startTime: zod.string().optional(),
    endTime: zod.string().optional(),
    audience: zod.string().min(1, { message: 'Audience is required.' }),
    classId: zod.string().optional(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: 'End date cannot be before start date.',
    path: ['endDate'],
  })
  .refine(
    (data) => data.isAllDay || !data.startTime || !data.endTime || data.endTime >= data.startTime,
    {
      message: 'End time cannot be before start time.',
      path: ['endTime'],
    }
  );

const defaultValues = {
  title: '',
  description: '',
  eventType: 'GENERAL',
  venue: '',
  startDate: today(),
  endDate: '',
  isAllDay: true,
  startTime: '',
  endTime: '',
  audience: 'ALL',
  classId: '',
};

export function EventFormDialog({ open, onClose, event, classes, onSuccess }) {
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(EventSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const isAllDay = watch('isAllDay');

  useEffect(() => {
    if (!open) return;
    reset({
      title: event && event.title ? event.title : '',
      description: event && event.description ? event.description : '',
      eventType: event && event.eventType ? event.eventType : 'GENERAL',
      venue: event && event.venue ? event.venue : '',
      startDate: event && event.startDate ? event.startDate : today(),
      endDate: event && event.endDate ? event.endDate : '',
      isAllDay: event && event.isAllDay != null ? Boolean(event.isAllDay) : true,
      startTime: event && event.startTime ? String(event.startTime).slice(0, 5) : '',
      endTime: event && event.endTime ? String(event.endTime).slice(0, 5) : '',
      audience: event && event.audience ? event.audience : 'ALL',
      classId: event && event.classId != null ? String(event.classId) : '',
    });
  }, [open, event, reset]);

  const handleSave = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        eventId: event && event.eventId ? event.eventId : null,
        title: values.title.trim(),
        description: values.description ? values.description.trim() : null,
        eventType: values.eventType,
        venue: values.venue ? values.venue.trim() : null,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        isAllDay: values.isAllDay,
        startTime: values.isAllDay || !values.startTime ? null : values.startTime,
        endTime: values.isAllDay || !values.endTime ? null : values.endTime,
        audience: values.audience,
        classId: values.classId === '' ? null : Number(values.classId),
      };

      const res = await ApiService.saveEventAsync(payload);
      if (res && res.data) {
        toast.success(event ? 'Event updated.' : 'Event created.');
        onSuccess();
        onClose();
      } else if (res && res.errors && res.errors.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to save event:', err);
      toast.error('Failed to save event.');
    } finally {
      setSaving(false);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>{event ? 'Edit Event' : 'New Event'}</DialogTitle>
      <Form methods={methods} onSubmit={handleSave}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <Field.Text name="title" label="Title" fullWidth />
            <Field.Text name="description" label="Description" multiline minRows={2} fullWidth />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.Select name="eventType" label="Event Type" fullWidth>
                {TYPE_OPTIONS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="venue" label="Venue (optional)" fullWidth />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.DatePicker
                name="startDate"
                label="Start Date"
                allowFutureDates
                allowPastDates
                slotProps={{ textField: { fullWidth: true } }}
              />
              <Field.DatePicker
                name="endDate"
                label="End Date (optional)"
                allowFutureDates
                allowPastDates
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Stack>

            <Field.Switch name="isAllDay" label="All day event" />

            {!isAllDay && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Field.Text
                  name="startTime"
                  label="Start Time"
                  type="time"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <Field.Text
                  name="endTime"
                  label="End Time"
                  type="time"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Stack>
            )}

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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={saving || isSubmitting}
          >
            {event ? 'Update' : 'Create'}
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
