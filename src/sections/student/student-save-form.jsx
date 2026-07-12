import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Autocomplete, Box, Button, Card,
  MenuItem, Stack, TextField
} from '@mui/material';
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
  middleName: zod.string().nullable().optional().or(zod.literal('')),
  lastName: zod.string().min(1, { message: 'Last Name is required.' }),
  gender: zod.string().min(1, { message: 'Gender is required.' }),
  dateOfBirth: zod.string({ required_error: 'Date of Birth is required.' }).min(1, { message: 'Date of Birth is required.' }),
  bloodGroup: zod.string().nullable().optional().or(zod.literal('')),
  aadharNo: zod.string().nullable().optional().or(zod.literal('')),
  email: zod.string().min(1, { message: 'Email is required.' }).email({ message: 'Email must be valid.' }),
  mobileNo: zod.string().min(1, { message: 'Mobile Number is required.' }),
  addressLine1: zod.string().nullable().optional(),
  city: zod.string().nullable().optional(),
  state: zod.string().nullable().optional(),
  postalCode: zod.string().nullable().optional(),
  fatherName: zod.string().min(1, { message: 'Father Name is required.' }),
  motherName: zod.string().min(1, { message: 'Mother Name is required.' }),
  parentMobile: zod.string().min(1, { message: 'Parent Mobile Number is required.' }),
  parentEmail: zod.string().nullable().optional().or(zod.literal('').refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: 'Parent Email must be valid.' })),
  parentAadhar: zod.string().nullable().optional().or(zod.literal('')),
  studentClass: zod.any().nullable().refine(val => val !== null, { message: 'Class & Section is required.' }),
  rollNo: zod.string().min(1, { message: 'Roll Number is required.' }),
});

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function StudentSaveForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [classMasters, setClassMasters] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  const defaultValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    aadharNo: '',
    email: '',
    mobileNo: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    fatherName: '',
    motherName: '',
    parentMobile: '',
    parentEmail: '',
    parentAadhar: '',
    studentClass: null,
    rollNo: '',
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
              (c) => c.classId === data.classId && (c.sectionId ?? null) === (data.sectionId ?? null)
            ) || {
              classId: data.classId,
              sectionId: data.sectionId,
              className: data.className || `Class ${data.classId}`,
              sectionName: data.sectionName || ''
            };

            methods.reset({
              ...data,
              middleName: data.middleName ?? '',
              bloodGroup: data.bloodGroup ?? '',
              aadharNo: data.aadharNo ?? '',
              mobileNo: data.mobileNo ?? '',
              addressLine1: data.addressLine1 ?? '',
              city: data.city ?? '',
              state: data.state ?? '',
              postalCode: data.postalCode ?? '',
              fatherName: data.fatherName ?? '',
              motherName: data.motherName ?? '',
              parentMobile: data.parentMobile ?? '',
              parentEmail: data.parentEmail ?? '',
              parentAadhar: data.parentAadhar ?? '',
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
      sectionId: values.studentClass.sectionId ?? null,
      ...(id && { studentId: Number(id) }),
    };
    delete payload.studentClass;

    const response = await apiService.saveStudentAsync(payload);
    if (response.data) {
      toast.success(id ? "Student updated successfully." : "Student created successfully.");
      navigate(-1);
      return;
    }
    if (response.errors && response.errors.length > 0) {
      setError(response.errors[0].param || 'email', {
        message: response.errors[0].msg,
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
          <Stack spacing={2}>
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
                  <Field.Text maxLength={50} name="middleName" label="Middle Name" />
                  <Field.Text maxLength={50} name="lastName" label="Last Name" />

                  <Field.Select name="gender" label="Gender">
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="O">Other</MenuItem>
                  </Field.Select>

                  <Field.DatePicker name="dateOfBirth" label="Date of Birth" allowFutureDates={false} allowPastDates={true} />

                  <Field.Select name="bloodGroup" label="Blood Group">
                    {BLOOD_GROUPS.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </Field.Select>

                  <Field.Text name="rollNo" label="Roll Number" />
                  <Field.Text name="aadharNo" label="Aadhar Number" />
                  <Field.Text name="email" label="Email" />
                  <Field.Text name="mobileNo" label="Mobile Number" placeholder="e.g. 9876543210" />

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
                        getOptionLabel={(option) => {
                          if (!option) return '';
                          return option.sectionName
                            ? `${option.className} - ${option.sectionName}`
                            : option.className || '';
                        }}
                        isOptionEqualToValue={(option, value) => {
                          if (!option || !value) return false;
                          return option.classId === value.classId && option.sectionId === value.sectionId;
                        }}
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
                </Box>
              </Stack>
            </Card>

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
                  <Field.Text name="addressLine1" label="Address" />
                  <Field.Text name="city" label="City" />
                  <Field.Text name="state" label="State" />
                  <Field.Text name="postalCode" label="Postal Code" />
                </Box>
              </Stack>
            </Card>
          </Stack>
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
                <Field.Text name="fatherName" label="Father Name" />
                <Field.Text name="motherName" label="Mother Name" />
                <Field.Text name="parentMobile" label="Parent Mobile Number" />
                <Field.Text name="parentEmail" label="Parent Email" />
                <Field.Text name="parentAadhar" label="Parent Aadhar Number" />
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
