// Existing imports
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';
import { useParams } from 'src/routes/hooks';
import apiService from 'src/services/ApiService';
import { login, logout } from 'src/store/reducers/authReducer';
import constants from 'src/utils/constants';
import enums from 'src/utils/enums';
import utils from 'src/utils/utils';
import { z as zod } from 'zod';

const BaseUserSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First Name is required.' }),
  surname: zod.string().min(1, { message: 'Surname is required.' }),
  empCode: zod
    .string()
    .min(1, { message: 'Employee Code is required.' })
    .min(6, { message: 'Employee Code must be at least 6 characters.' })
    .regex(/^\d+$/, { message: 'Employee Code must contain only numbers.' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Email must be a valid.' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  pin: zod
    .string()
    .min(1, { message: 'Pin is required.' })
    .min(6, { message: 'Pin must have six characters.' }),
  roleId: zod.coerce.number().refine(val => val > 0, {
    message: "Role is required.",
  }),
  userStages: zod
    .array(zod.object({
      stageId: zod.number(),
      stageName: zod.string(),
    })).optional(),
  profileType: zod.enum(['full', 'lite']),
  labourRate: zod.coerce.number().positive({ message: "Labour Rate is required." }),
  isPriceVisible: zod.boolean(),
  isPermanentUser: zod.boolean(),
  siteId: zod.coerce.number().refine(val => val > 0, {
    message: "Site is required.",
  }),
});

// Define the required fields schema
const FullProfileSchema = BaseUserSchema.extend({
  profileType: zod.literal('full'),
  password: zod
    .string()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Password must be at least eight characters.' }),
});

// Define the optional fields schema
const LiteProfileSchema = BaseUserSchema.extend({
  profileType: zod.literal('lite'),
  password: zod.string().optional(),
});

// Combine them into a discriminated union
export const UserSchema = zod.discriminatedUnion('profileType', [
  FullProfileSchema,
  LiteProfileSchema,
]).superRefine((data, ctx) => {
    if (!data.userStages || data.userStages.length === 0) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: "Please select at least one user stage.",
        path: ["userStages"],
      });
    }
});

// ----------------------------------------------------------------------
export function UserSaveForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const confirmDialog = useBoolean();
  const [userStageOptions, setUserStageOptions] = useState([]);
  const [sitesOptions, setSitesOptions] = useState([]);
  const [roles, setRoles] = useState([]);
  const { loggedInTeacher } = useSelector((state) => state.AuthReducer);

  const location = window.location.href;
  const isProfilePage = location.includes('profile');
  const showPassword = useBoolean();

  const defaultValues = {
    firstName: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    pin: '',
    empCode: '',
    roleId: '',
    labourRate: null,
    isPriceVisible: false,
    isPermanentUser: false,
    userStages: [],
    siteId: '',
  };

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserSchema),
    defaultValues: async () => {
      const data = await getUserDataById();
      return {
        ...data,
        profileType: !id ? 'full' : 'lite',
      };
    },
  });

  const {
    control,
    setError,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isLoading, errors },
  } = methods;

  useEffect(() => {

    const fetchData = async () => {
      const [userStageOptions, sitesOptions, roles] = await Promise.all([
        apiService.getStageOptionsAsync(),
        apiService.getSitesOptionsAsync(),
        apiService.getRolesAsync(),
      ]);
      setUserStageOptions(userStageOptions.data);
      setSitesOptions(sitesOptions.data);
      setRoles(roles.data);
    }

    fetchData();
  }, [])

  const getUserDataById = async () => {
    if (id) {
      const { data } = await apiService.getUserDataByIdAsync(id);
      return data;
    } else {
      return defaultValues;
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    let response = [];
    values.userStages = values.userStages.map((st) => st.stageId);
    if (id) {
      values.userId = Number(id);
      response = await apiService.updateUserAsync(values);
    } else {
      response = await apiService.createUserAsync(values);
    }
    if (response.data && response.data.session && response.data.refresh) {
      const token = { session: response.data.session, refresh: response.data.refresh };
      dispatch(login({ user: response.data.user, token }));
    }
    if (response.data) {
      toast.success(id ? 'Staff Member updated successfully.' : 'Staff Member created successfully.');
      navigate(-1);
    } else if (response.errors) {
      response.errors.map((error) => {
        setError(error.param, { message: error.msg }); // setError for userName
      });
    }
  });

  const handleDeleteRow = async () => {
    await apiService.deleteUserAsync(id);
    dispatch(logout());
    toast.success('Staff Member deleted successfully.');
    navigate('/auth/sign-in', { replace: true });
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Staff Member"
      content={<>Are you sure want to delete your profile?</>}
      action={
        <Button variant="contained" color="error" onClick={handleDeleteRow}>
          Delete
        </Button>
      }
    />
  );

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
                  <Stack direction="column" spacing={2} >
                    <Box
                      sx={{
                        rowGap: 3,
                        columnGap: 2,
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                      }}
                    >
                      <Field.Text
                        name="empCode"
                        label="Employee Code"
                        disabled={isProfilePage && loggedInTeacher && loggedInTeacher.roleId !== enums.roleType.Administrator}
                        slotProps={{ htmlInput: { maxLength: 6 } }}
                        onKeyDown={utils.handleNumericKey}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData.getData('text/plain');
                          const numericData = pastedData.replace(/\D/g, '');
                          e.currentTarget.value = numericData;
                        }}
                      />
                      <Field.Text maxLength={50} name="firstName" label="First Name" />
                      <Field.Text maxLength={50} name="surname" label="Surname" />
                      <Field.Text name="email" label="Email" />
                      {!id && (
                        <Field.Text
                          name="password"
                          label="Password"
                          placeholder="8+ characters"
                          type={showPassword.value ? 'text' : 'password'}
                          slotProps={{
                            htmlInput: {
                              minLength: 8,
                              maxLength: 25,
                            },
                            inputLabel: { shrink: true },
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={showPassword.onToggle} edge="end">
                                    <Iconify
                                      icon={
                                        showPassword.value
                                          ? 'solar:eye-bold'
                                          : 'solar:eye-closed-bold'
                                      }
                                    />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                      <Field.Phone name="phone" label="Phone Number"
                        country={constants.defaultCountryCode}
                        disableCountryCode={true} />
                      <Field.Text
                        name="pin"
                        label="Pin"
                        onKeyDown={utils.handleNumericKey}
                        slotProps={{ htmlInput: { maxLength: 6 } }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData.getData('text/plain');
                          const numericData = pastedData.replace(/\D/g, '');
                          e.currentTarget.value = numericData;
                        }}
                      />
                      <Field.Select name="roleId" label="Role" disabled={isProfilePage && loggedInTeacher && loggedInTeacher.roleId !== enums.roleType.Administrator}>
                        {roles && roles.map((option) => (
                          <MenuItem key={option.roleId} value={option.roleId}>
                            {option.roleName}
                          </MenuItem>
                        ))}
                      </Field.Select>
                      <Field.Select name="siteId" label="Site" disabled={isProfilePage && loggedInTeacher && loggedInTeacher.roleId !== enums.roleType.Administrator}>
                        {sitesOptions && sitesOptions.map((option) => (
                          <MenuItem key={option.siteId} value={option.siteId}>
                            {option.siteName}
                          </MenuItem>
                        ))}
                      </Field.Select>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4, sm: 4 }}>
                          <Field.Text type="number" name="labourRate" label="Labour Rate" disabled={isProfilePage && loggedInTeacher && loggedInTeacher.roleId !== enums.roleType.Administrator} maxLength={6} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 8, sm: 8 }}>
                          <Stack direction={'row'}>
                            <Field.Switch
                              name="isPriceVisible"
                              label="Can View Price"
                              disabled={isProfilePage && loggedInTeacher && loggedInTeacher.roleId !== enums.roleType.Administrator}
                            />
                            <Field.Switch name="isPermanentUser" label="Permanent Staff" disabled={isProfilePage && loggedInTeacher && loggedInTeacher.roleId !== enums.roleType.Administrator} />
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 3 }}>
                  <Stack direction="column" spacing={2} >
                    <Box
                      sx={{
                        rowGap: 3,
                        columnGap: 1,
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                      }}
                    >
                      <Controller
                        name="userStages"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            fullWidth
                            multiple
                            disabled={isProfilePage && loggedInTeacher && loggedInTeacher.roleId !== enums.roleType.Administrator}
                            disableCloseOnSelect
                            options={userStageOptions}
                            getOptionLabel={(option) => option.stageName}
                            onChange={(event, newValue) => field.onChange(newValue)}
                            isOptionEqualToValue={(option, value) => option.stageId === value.stageId}

                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Stages"
                                placeholder="Stages"
                                error={!!errors.userStages}
                                helperText={errors.userStages ? errors.userStages.message : ''}
                              />
                            )}
                            renderOption={(props, option) => {
                              const isSelected = field.value.some(
                                (selectedOption) => selectedOption.stageId === option.stageId
                              );
                              return (
                                <li {...props} key={option.stageId}>
                                  <Checkbox
                                    size="small"
                                    disableRipple
                                    checked={isSelected}
                                  />
                                  {option.stageName}
                                </li>
                              );
                            }}
                            renderTags={(selected, getTagProps) =>
                              selected.map((option, index) => (
                                <Chip
                                  {...getTagProps({ index })}
                                  key={option.stageId}
                                  label={option.stageName}
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
                <Stack direction="row" justifyContent={'space-between'}>
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
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Form>
          {renderConfirmDialog()}
        </>
      )}
    </>
  );
}
