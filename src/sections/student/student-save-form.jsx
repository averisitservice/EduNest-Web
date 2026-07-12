import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Box, Button, Card, MenuItem, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Field, Form } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';
import { useParams } from 'src/routes/hooks';
import apiService from 'src/services/ApiService';
import { z as zod } from 'zod';

const StudentSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First Name is required.' }),
  lastName: zod.string().min(1, { message: 'Last Name is required.' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Email must be valid.' }),
  mobileNo: zod.string().optional().or(zod.literal('')),
  gender: zod.string().min(1, { message: 'Gender is required.' }),
  rollNo: zod.string().min(1, { message: 'Roll Number is required.' }),
  dateOfBirth: zod.string().optional().nullable(),
  joiningDate: zod.string().min(1, { message: 'Admission Date is required.' }),
  addressLine1: zod.string().optional().nullable(),
  city: zod.string().optional().nullable(),
  state: zod.string().optional().nullable(),
  postalCode: zod.string().optional().nullable(),
  studentClass: zod
    .object(
      {
        classId: zod.number(),
        sectionId: zod.number().nullable().optional(),
        className: zod.string().optional(),
        sectionName: zod.string().optional(),
      },
      { required_error: 'Class & Section is required.' }
    )
    .nullable()
    .refine((val) => val !== null, { message: 'Class & Section is required.' }),
  guardianName: zod.string().min(1, { message: 'Guardian Name is required.' }),
  guardianPhone: zod.string().optional().or(zod.literal('')),
});

export function StudentSaveForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [classMasters, setClassMasters] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    gender: '',
    rollNo: '',
    dateOfBirth: '',
    joiningDate: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    studentClass: null,
    guardianName: '',
    guardianPhone: '',
  };

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(StudentSchema),
    defaultValues,
  });

  const {
    control,
    setError,
    handleSubmit,
    formState: { isSubmitting, isLoading, errors },
  } = methods;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        const classRes = await apiService.getAllClassMasterSectionsAsync();
        setClassMasters(classRes.data || []);

        if (id) {
          const { data } = await apiService.getStudentDataByIdAsync(id);
          if (data) {
            const studentClassVal = classRes.data?.find(
              (c) =>
                c.classId === data.classId && (c.sectionId ?? null) === (data.sectionId ?? null)
            ) || {
              classId: data.classId,
              sectionId: data.sectionId,
              className: data.className || `Class ${data.classId}`,
              sectionName: data.sectionName || '',
            };

            methods.reset({
              ...data,
              studentClass: studentClassVal,
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [id, methods]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      ...values,
      classId: values.studentClass.classId,
      sectionId: values.studentClass.sectionId ?? null,
      ...(id && { studentId: Number(id) }),
    };
    delete payload.studentClass;

    const response = await apiService.saveStudentAsync(payload);
    if (response.data) {
      toast.success(id ? 'Student updated successfully.' : 'Student created successfully.');
      navigate(-1);
      return;
    }
    if (response.error) {
      setError(response.error.param, {
        message: response.error.msg,
      });
    }
  });

  if (fetchingData || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Stack direction="column" spacing={2}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text maxLength={50} name="firstName" label="First Name" />
                <Field.Text maxLength={50} name="lastName" label="Last Name" />
                <Field.Text name="email" label="Email" />
                <Field.Text name="mobileNo" label="Mobile Number" placeholder="e.g. 9876543210" />
                <Field.Text name="rollNo" label="Roll Number" />

                <Field.Select name="gender" label="Gender">
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </Field.Select>

                <Controller
                  name="studentClass"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      fullWidth
                      options={classMasters}
                      value={field.value || null}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      getOptionLabel={(option) =>
                        option.sectionName
                          ? `${option.className} - ${option.sectionName}`
                          : option.className
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.classId === value.classId && option.sectionId === value.sectionId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Class & Section"
                          placeholder="Select Class & Section"
                          error={!!errors.studentClass}
                          helperText={errors.studentClass?.message}
                        />
                      )}
                    />
                  )}
                />

                <Field.DatePicker
                  name="dateOfBirth"
                  label="Date of Birth"
                  allowFutureDates={true}
                  allowPastDates={true}
                />
                <Field.DatePicker
                  name="joiningDate"
                  label="Admission Date"
                  allowFutureDates={true}
                  allowPastDates={true}
                />

                <Field.Text name="addressLine1" label="Address" />
                <Field.Text name="city" label="City" />
                <Field.Text name="state" label="State" />
                <Field.Text name="postalCode" label="Postal Code" />
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Stack direction="column" spacing={3}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 1,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                }}
              >
                <Field.Text name="guardianName" label="Guardian Name" />
                <Field.Text name="guardianPhone" label="Guardian Phone Number" />
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, md: 8 }}>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={2}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
              >
                Save
              </LoadingButton>
              <Button
                disabled={isSubmitting}
                variant="outlined"
                color="error"
                onClick={() => navigate(-1)}
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
