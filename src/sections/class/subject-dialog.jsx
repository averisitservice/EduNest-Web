import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { Field } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import ApiService from 'src/services/ApiService';

const SubjectSchema = zod.object({
  subjectName: zod.string().trim().min(1, { message: 'Subject Name is required.' }),
  subjectCode: zod.string().trim().min(1, { message: 'Subject Code is required.' }),
});

const defaultValues = {
  subjectName: '',
  subjectCode: '',
};

export function SubjectDialog({ id, open, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const methods = useForm({
    resolver: zodResolver(SubjectSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);

    const payload = {
      subjectName: values.subjectName,
      subjectCode: values.subjectCode,
    };

    const response = await ApiService.saveSubjectAsync(payload);

    if (response.data) {
      toast.success(id ? 'Subject updated successfully.' : 'Subject created successfully.');
      if (onSuccess) onSuccess();
      onClose();
      reset(defaultValues);
    } else if (response.errors) {
      response.errors.forEach((error) => {
        setError(error.param, {
          message: error.msg,
        });
      });
    }

    setIsLoading(false);
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{id ? 'Edit Subject' : 'Add Subject'}</DialogTitle>

      {isLoadingData ? (
        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 5,
          }}
        >
          <CircularProgress />
        </DialogContent>
      ) : (
        <FormProvider {...methods}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Field.Text name="subjectName" label="Subject Name" fullWidth />

              <Field.Text name="subjectCode" label="Subject Code" fullWidth />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'flex-start' }}>
            <LoadingButton
              variant="contained"
              color="primary"
              loading={isSubmitting || isLoading}
              onClick={onSubmit}
            >
              Save
            </LoadingButton>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </FormProvider>
      )}
    </Dialog>
  );
}
