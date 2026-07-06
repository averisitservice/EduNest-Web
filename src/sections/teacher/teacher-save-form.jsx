import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Autocomplete, Box, Button, Card,
  Checkbox, Chip, IconButton, InputAdornment, MenuItem,
  Stack, TextField
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useBoolean } from 'minimal-shared/hooks';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';
import { useParams } from 'src/routes/hooks';
import apiService from 'src/services/ApiService';
import constants from 'src/utils/constants';
import { z as zod } from 'zod';

const TeacherSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First Name is required.' }),
  lastName: zod.string().min(1, { message: 'Last Name is required.' }),
  email: zod.string().min(1, { message: 'Email is required.' }).email({ message: 'Email must be valid.' }),
  mobileNo: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  roleId: zod.coerce.number().refine(val => val > 0, { message: 'Role is required.' }),
  employmentTypeId: zod.coerce.number().refine(val => val > 0, { message: 'Employment Type is required.' }),
  gender: zod.string().min(1, { message: 'Gender is required.' }),
  joiningDate: zod.string().min(1, { message: 'Joining Date is required.' }),
  qualification: zod.array(zod.string()).optional(),
  dateOfBirth: zod.string().optional(),
  addressLine1: zod.string().optional(),
  city: zod.string().optional(),
  state: zod.string().optional(),
  postalCode: zod.string().optional(),
  teacherClasses: zod.array(zod.object({
    classId: zod.number(),
  })).optional(),
  teacherSubjects: zod.array(zod.object({
    subjectId: zod.number(),
  })).optional(),
});

const TeacherAddSchema = TeacherSchema.extend({
  password: zod.string().min(1, { message: 'Password is required.' }).min(8, { message: 'Password must be at least 8 characters.' }),
});

export function TeacherSaveForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [roles, setRoles] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classMasters, setClassMasters] = useState([]);

  const showPassword = useBoolean();

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNo: '',
    roleId: '',
    employmentTypeId: '',
    gender: '',
    dateOfBirth: '',
    joiningDate: '',
    qualification: [],
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    teacherClasses: [],
    teacherSubjects: [],
  };

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(id ? TeacherSchema : TeacherAddSchema),
    defaultValues: async () => {
      const data = await getTeacherDataById();
      return data;
    },
  });

  const {
    control,
    setError,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isLoading, errors },
  } = methods;

  useEffect(() => {
    const fetchData = async () => {
      const [roles, employmentType, subject, classMaster] = await Promise.all([
        apiService.getRolesAsync(),
        apiService.getEmploymentTypeAsync(),
        apiService.getSubjectAsync(),
        apiService.getClassMasterAsync(),
      ]);
      setRoles(roles.data);
      setEmploymentTypes(employmentType.data);
      setSubjects(subject.data);
      setClassMasters(classMaster.data);
    }
    fetchData();
  }, [])

  const getTeacherDataById = async () => {
    if (id) {
      const { data } = await apiService.getTeacherDataByIdAsync(id);
      return {
        ...data,
        qualification: data.qualification
          ? data.qualification.split(',')
          : [],
        teacherSubjects: subjects.filter((s) =>
          data.teacherSubjects.some((ts) => ts.subjectId === s.subjectId)
        ),
        teacherClasses: classMasters.filter((c) =>
          data.teacherClasses.some((tc) => tc.classId === c.classId)
        ),
      };
    } else {
      return defaultValues;
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      ...values,
      qualification: (values.qualification || []).join(','),
      teacherClasses: values.teacherClasses.map((tc) => ({
        classId: tc.classId,
      })),
      teacherSubjects: values.teacherSubjects.map((ts) => ({
        subjectId: ts.subjectId,
      })),
      ...(id && { teacherId: Number(id) }),
    };
    const response = await apiService.saveTeacherAsync(payload);
    if (response.data) {
      toast.success(id ? "Teacher updated successfully." : "Teacher created successfully.");
      navigate(-1);
      return;
    }
    if (response.error) {
      setError(response.error.param, {
        message: response.error.msg,
      });
    }
  });

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
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
                      {!id && (
                        <Field.Text
                          name="password"
                          label="Password"
                          placeholder="8+ characters"
                          type={showPassword.value ? 'text' : 'password'}
                          slotProps={{
                            htmlInput: { minLength: 8, maxLength: 25 },
                            inputLabel: { shrink: true },
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={showPassword.onToggle} edge="end">
                                    <Iconify
                                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                                    />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                      <Field.Phone
                        name="mobileNo"
                        label="Mobile Number"
                        country={constants.defaultCountryCode}
                        disableCountryCode={true}
                      />
                      <Field.Select name="roleId" label="Role">
                        {roles.map((option) => (
                          <MenuItem key={option.roleId} value={option.roleId}>
                            {option.roleName}
                          </MenuItem>
                        ))}
                      </Field.Select>
                      <Field.Select name="employmentTypeId" label="Employment Type">
                        {employmentTypes.map((option) => (
                          <MenuItem key={option.employmentTypeId} value={option.employmentTypeId}>
                            {option.employmentType}
                          </MenuItem>
                        ))}
                      </Field.Select>
                      <Field.Select name="gender" label="Gender">
                        <MenuItem value="M">Male</MenuItem>
                        <MenuItem value="F">Female</MenuItem>
                        <MenuItem value="O">Other</MenuItem>
                      </Field.Select>
                      <Field.DatePicker name="dateOfBirth" label="Date of Birth" allowFutureDates={true} allowPastDates={true} />
                      <Field.DatePicker name="joiningDate" label="Joining Date" allowFutureDates={true} allowPastDates={true} />
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={watch('qualification') || []}
                        onChange={(event, newValue) => {
                          setValue('qualification', newValue);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Qualification" />
                        )}
                        renderTags={(selected = [], getTagProps) =>
                          selected.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              label={option}
                              size="small"
                              variant="soft"
                            />
                          ))
                        }
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
                  <Stack direction="column" spacing={2}>
                    <Box
                      sx={{
                        rowGap: 3,
                        columnGap: 1,
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                      }}
                    >
                      <Controller
                        name="teacherSubjects"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            fullWidth
                            multiple
                            disableCloseOnSelect
                            options={subjects}
                            getOptionLabel={(option) => option.subjectName}
                            onChange={(event, newValue) => field.onChange(newValue)}
                            isOptionEqualToValue={(option, value) => option.subjectId === value.subjectId}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Subjects"
                                placeholder="Subjects"
                                error={!!errors.teacherSubjects}
                                helperText={errors.teacherSubjects ? errors.teacherSubjects.message : ''}
                              />
                            )}
                            renderOption={(props, option) => {
                              const isSelected = field.value.some(
                                (selected) => selected.subjectId === option.subjectId
                              );
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
                      <Controller
                        name="teacherClasses"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            fullWidth
                            multiple
                            disableCloseOnSelect
                            value={field.value || []}
                            options={classMasters}
                            getOptionLabel={(option) => option.className}
                            onChange={(event, newValue) => field.onChange(newValue)}
                            isOptionEqualToValue={(option, value) => option.classId === value.classId}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Classes"
                                placeholder="Classes"
                                error={!!errors.teacherClasses}
                                helperText={errors.teacherClasses ? errors.teacherClasses.message : ''}
                              />
                            )}
                            renderOption={(props, option) => {
                              const isSelected = (field.value || []).some(
                                (selected) => selected.classId === option.classId
                              );
                              return (
                                <li {...props} key={option.classId}>
                                  <Checkbox size="small" disableRipple checked={isSelected} />
                                  {option.className}
                                </li>
                              );
                            }}
                            renderTags={(selected, getTagProps) =>
                              (selected || []).map((option, index) => (
                                <Chip
                                  {...getTagProps({ index })}
                                  key={option.classId}
                                  label={option.className}
                                  size="small"
                                  variant="soft"
                                />
                              ))
                            }
                          />
                        )}
                      />
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
        </>
      )}
    </>
  );
}
