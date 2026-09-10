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

const HOLIDAY_TYPE_OPTIONS = [
  { value: 'NATIONAL', label: 'National Holiday' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'SCHOOL_EVENT', label: 'School Event' },
  { value: 'VACATION', label: 'Vacation / Break' },
  { value: 'OTHER', label: 'Other' },
];

const HolidaySchema = zod
  .object({
    holidayName: zod.string().trim().min(1, { message: 'Holiday name is required.' }),
    startDate: zod.string().nullable().refine((val) => !!val, { message: 'Start date is required.' }),
    endDate: zod.string().nullable().optional(),
    holidayType: zod.string().min(1, { message: 'Holiday type is required.' }),
    description: zod.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return !dayjs(data.endDate).isBefore(dayjs(data.startDate), 'day');
      }
      return true;
    },
    {
      message: 'End date cannot be before start date.',
      path: ['endDate'],
    }
  );

const defaultValues = {
  holidayName: '',
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: null,
  holidayType: 'NATIONAL',
  description: '',
};

export function HolidayFormDialog({ open, onClose, holiday, onSuccess }) {
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(HolidaySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!open) return;
    const today = dayjs().format('YYYY-MM-DD');
    reset({
      holidayName: holiday && holiday.holidayName ? holiday.holidayName : '',
      startDate: holiday && holiday.startDate ? holiday.startDate : today,
      endDate: holiday && holiday.endDate ? holiday.endDate : null,
      holidayType: holiday && holiday.holidayType ? holiday.holidayType : 'NATIONAL',
      description: holiday && holiday.description ? holiday.description : '',
    });
  }, [open, holiday, reset]);

  const handleSave = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const startDateFormatted = values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : null;
      const endDateFormatted = values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : startDateFormatted;

      const payload = {
        holidayId: holiday && holiday.holidayId ? holiday.holidayId : null,
        holidayName: values.holidayName.trim(),
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        holidayType: values.holidayType,
        description: values.description ? values.description.trim() : '',
      };

      const res = await ApiService.saveHolidayAsync(payload);
      if (res && res.data) {
        toast.success(holiday ? 'Holiday updated.' : 'Holiday added.');
        onSuccess();
        onClose();
      } else if (res && res.errors && res.errors.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to save holiday:', err);
      toast.error('Failed to save holiday.');
    } finally {
      setSaving(false);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {holiday ? 'Edit Holiday' : 'New Holiday'}
      </DialogTitle>
      <Form methods={methods} onSubmit={handleSave}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <Field.Text name="holidayName" label="Holiday Name" fullWidth />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.DatePicker name="startDate" label="Start Date" allowFutureDates fullWidth />
              <Field.DatePicker name="endDate" label="End Date (optional)" allowFutureDates fullWidth />
            </Stack>

            <Field.Select name="holidayType" label="Holiday Type" fullWidth>
              {HOLIDAY_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="description" label="Description / Details (optional)" multiline minRows={2} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={saving || isSubmitting}
          >
            {holiday ? 'Update' : 'Save'}
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
