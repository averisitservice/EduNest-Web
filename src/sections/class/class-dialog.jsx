import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z as zod } from 'zod';
import { Field } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import ApiService from 'src/services/ApiService';

const ClassSchema = zod.object({
  className: zod.string().trim().min(1, { message: 'Class Name is required.' }),
  annualFee: zod.coerce.number().nullable().optional(),
  hostelFee: zod.coerce.number().nullable().optional(),
  sections: zod.string().trim().optional(),
  subjectIds: zod.array(zod.number()).min(1, { message: 'Please select at least one subject.' }),
});

const defaultValues = {
  className: '',
  annualFee: '',
  hostelFee: '',
  sections: '',
  subjectIds: [],
};

export function ClassDialog({ id, open, onClose, onSuccess }) {
  const tenant = useSelector((state) => state.AuthReducer.tenantDetail);
  const showHostel = Boolean(tenant?.isHostel);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const methods = useForm({
    resolver: zodResolver(ClassSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!open) return;
    loadSubjects();
    if (id) {
      loadClass();
    } else {
      reset(defaultValues);
    }
  }, [id, open]);

  const loadSubjects = async () => {
    const { data } = await ApiService.getSubjectAsync();
    if (data) {
      setSubjects(data);
    }
  };

  const loadClass = async () => {
    setIsLoadingData(true);
    try {
      const { data } = await ApiService.getClassDataByIdAsync(id);

      if (data) {
        reset({
          className: data.className,
          annualFee: data.annualFee,
          hostelFee: data.hostelFee ?? '',
          sections: data.sections?.join(', ') || '',
          subjectIds: data.subjectIds || [],
        });
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);

    const payload = {
      className: values.className,
      annualFee:
        values.annualFee === '' || values.annualFee == null ? null : Number(values.annualFee),
      hostelFee:
        values.hostelFee === '' || values.hostelFee == null ? null : Number(values.hostelFee),
      sections: values.sections
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      subjectIds: values.subjectIds,
      ...(id && { classId: Number(id) }),
    };
    const response = await ApiService.saveClassAsync(payload);

    if (response.data) {
      toast.success(id ? 'Class updated successfully.' : 'Class created successfully.');
      onSuccess?.();
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
      <DialogTitle>{id ? 'Edit Class' : 'New Class'}</DialogTitle>

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
              <Field.Text name="className" label="Class Name" fullWidth />

              <Field.Text name="annualFee" label="Annual Fee" type="number" fullWidth />

              {showHostel && (
                <Field.Text name="hostelFee" label="Hostel Fee" type="number" fullWidth />
              )}

              <Field.Text name="sections" label="Sections" placeholder="A, B, C" fullWidth />

              <Controller
                name="subjectIds"
                control={methods.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    fullWidth
                    multiple
                    disableCloseOnSelect
                    options={subjects}
                    value={subjects.filter((subject) =>
                      (field.value || []).includes(subject.subjectId)
                    )}
                    getOptionLabel={(option) => option.subjectName}
                    isOptionEqualToValue={(option, value) => option.subjectId === value.subjectId}
                    onChange={(event, newValue) => {
                      field.onChange(newValue.map((item) => item.subjectId));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Subjects"
                        placeholder="Select Subjects"
                        error={!!methods.formState.errors.subjectIds}
                        helperText={methods.formState.errors.subjectIds?.message}
                      />
                    )}
                    renderOption={(props, option) => {
                      const isSelected = (field.value || []).includes(option.subjectId);

                      return (
                        <li {...props} key={option.subjectId}>
                          <Checkbox size="small" disableRipple checked={isSelected} />
                          {option.subjectName}
                        </li>
                      );
                    }}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.subjectId}
                          label={option.subjectName}
                          size="small"
                          variant="soft"
                        />
                      ))
                    }
                  />
                )}
              />
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
