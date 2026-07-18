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
  DialogActions,
  DialogContent,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ApiService from 'src/services/ApiService';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { fNumber } from 'src/utils/format-number';

const PAYMENT_MODES = ['CASH', 'ONLINE', 'CHEQUE', 'CARD'];
const today = () => new Date().toISOString().slice(0, 10);

const FeeCollectSchema = zod.object({
  amount: zod.coerce.number().min(0.01, { message: 'Enter a valid amount.' }),
  paymentMode: zod.string().min(1, { message: 'Payment mode is required.' }),
  paymentDate: zod.string().min(1, { message: 'Payment date is required.' }),
  remarks: zod.string().trim().optional().nullable(),
});

const defaultValues = {
  amount: '',
  paymentMode: 'CASH',
  paymentDate: today(),
  remarks: '',
};

export function FeeCollectDialog({ open, onClose, student, onSuccess }) {
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(FeeCollectSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open && student) {
      const due = Number(student.dueAmount) || 0;
      reset({
        amount: due > 0 ? due : '',
        paymentMode: 'CASH',
        paymentDate: today(),
        remarks: '',
      });
    }
  }, [open, student, reset]);

  const handleSave = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        studentId: student.studentId,
        amount: Number(values.amount),
        paymentDate: values.paymentDate,
        paymentMode: values.paymentMode,
        remarks: values.remarks || null,
      };
      const res = await ApiService.collectFeePaymentAsync(payload);
      if (res && res.data) {
        toast.success(`Payment collected. Receipt: ${res.data}`);
        onSuccess();
        onClose();
      } else if (res && res.errors && res.errors.length) {
        toast.error(res.errors[0].msg);
      }
    } catch (err) {
      console.error('Failed to collect payment:', err);
      toast.error('Failed to collect payment.');
    } finally {
      setSaving(false);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Collect Fee</DialogTitle>
      <Form methods={methods} onSubmit={handleSave}>
        <DialogContent>
          <Stack spacing={2.5}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {student && student.studentName ? student.studentName : ''} &nbsp;•&nbsp; Due:{' '}
              {student && student.dueAmount ? fNumber(student.dueAmount) : 0}
            </Typography>

            <Field.Text name="amount" type="number" label="Amount" fullWidth />

            <Field.Select name="paymentMode" label="Payment Mode" fullWidth>
              {PAYMENT_MODES.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.DatePicker
              name="paymentDate"
              label="Payment Date"
              allowFutureDates
              allowPastDates
              slotProps={{ textField: { fullWidth: true } }}
            />

            <Field.Text name="remarks" label="Remarks" placeholder="Optional" fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start' }}>
          <LoadingButton type="submit" variant="contained" color="primary" loading={saving || isSubmitting}>
            Collect
          </LoadingButton>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

FeeCollectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  student: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};
