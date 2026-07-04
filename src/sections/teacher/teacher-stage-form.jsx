import { LoadingButton } from '@mui/lab';
import {
    Box, Card, Checkbox, Chip, CircularProgress, Paper, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Field, Form } from 'src/components/hook-form';
import apiService from 'src/services/ApiService';
import constants from 'src/utils/constants';
import dateHelper from 'src/utils/dateHelper';

export function UserStageForm() {
    const [stages, setStages] = useState([]);
    const [userStages, setUserStages] = useState([]);
    const [updatedDate, setUpdatedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    const defaultValues = useMemo(() => ({
        users: [],
        stages: {},
    }), []);

    const methods = useForm({
        defaultValues,
        mode: 'onSubmit',
    });

    const { handleSubmit, watch, setValue, reset, formState: { isSubmitting } } = methods;

    const selectedUsers = watch('users') || [];
    const stagesState = watch('stages') || {};

    const fetchData = async () => {
        setIsLoading(true);
        const [stages, userStages] = await Promise.all([apiService.getStageOptionsAsync(), apiService.getUserStagesAsync(dateHelper.formatDateForStage(updatedDate))]);
        if (stages.data && stages.data.length > 0) {
            setStages(stages.data);
        }
        if (userStages.data && userStages.data.length > 0) {
            setUserStages(userStages.data);
            reset({
                users: [],
                stages: {},
            });
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [updatedDate])

    const handleFilterDate = useCallback(
        (newValue) => {
            setUpdatedDate(newValue);
        },
        [updatedDate]
    );

    const handleUserChange = useCallback((event, selectedUser) => {

        if (selectedUser.length <= 5) {
            setValue('users', selectedUser, { shouldDirty: true });
            selectedUser.forEach(user => {
                if (!stagesState[user.userId]) {
                    const initialStages = user.stages
                        ? user.stages.map(stageId => stageId)
                        : [];
                    setValue(`stages.${user.userId}`, initialStages);
                }
            });
        }
    }, [setValue, stagesState]);

    const onSubmit = handleSubmit(async (values) => {
        const userStages = (values.users || []).map((user) => {
            const selectedStageIds = values.stages && values.stages[user.userId] || [];
            return {
                userId: user.userId,
                stages: selectedStageIds,
            };
        });
        const payload = {
            updatedDate: new Date(updatedDate).toLocaleDateString('en-CA'),
            users: userStages
        }
        const { data } = await apiService.saveUserStagesAsync(payload);
        if (data) {
            const filterUsers = selectedUsers.map((user) => {
                return { ...user, isDefault: false }
            })

            reset({
                stages: stagesState,
                users: filterUsers
            });

            setUserStages(prevStages =>
                prevStages.map(user => {
                    const update = filterUsers.find(u => u.userId === user.userId);
                    return update ? { ...user, ...update } : user;
                })
            );

            toast.success('Stages are updated successfully.');
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Card sx={{ py: 0, boxShadow: 'none' }}>
                        <Box
                            sx={{
                                py: 1,
                                display: 'grid',
                                gridTemplateColumns: { md: '1fr 2fr 1fr' },
                                gap: 2,
                            }}
                        >
                            <DatePicker
                                label="Stage Assign Date"
                                disablePast
                                format={constants.dateFormat}
                                value={dayjs(updatedDate)}
                                onChange={handleFilterDate}
                            />
                            <Field.Autocomplete
                                name="users"
                                label="Staff Member"
                                multiple
                                disabled={isLoading}
                                options={userStages}
                                value={selectedUsers}
                                filterSelectedOptions
                                getOptionLabel={(option) => option.name || ''}
                                onChange={handleUserChange}
                                isOptionEqualToValue={(o, v) => o.userId === v.userId}
                                renderTags={(selected, getTagProps) =>
                                    selected.map((option, index) => (
                                        <Chip
                                            {...getTagProps({ index })}
                                            key={option.userId}
                                            label={option.name}
                                            size="small"
                                            variant="soft"
                                        />
                                    ))
                                }
                            />
                            <Stack direction="row" spacing={2} alignItems={'center'} justifyContent={'end'} sx={{ mr: 2 }}>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    loading={isSubmitting}
                                    disabled={isLoading || selectedUsers.length === 0}
                                >
                                    Save
                                </LoadingButton>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>
                {isLoading ? <Grid size={12}>
                    <Stack justifyContent="center" alignItems="center" sx={{ height: '60vh' }}>
                        <CircularProgress />
                    </Stack>
                </Grid> : (
                    <Grid size={{ xs: 12 }}>
                        <StagesTable
                            stages={stages}
                            selectedUsers={selectedUsers}
                            stagesState={stagesState}
                            setValue={setValue}
                        />
                    </Grid>
                )}
            </Grid>
        </Form>
    );
}

export function StagesTable({ stages, selectedUsers, stagesState, setValue }) {
    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto', border: '1px solid rgba(241, 241, 241, 1)', height: 'calc(100vh - 30vh)' }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ position: 'sticky', left: 0, zIndex: 1, width: '20%', p: 1.5 }}>
                            <b>Stage</b>
                        </TableCell>
                        {selectedUsers.length > 0 && selectedUsers.map(user => (
                            <TableCell key={user.userId} align="center" sx={{ p: 1.5 }}>
                                <Stack spacing={1} direction={'row'} alignItems={'center'} justifyContent={'center'}>
                                    <b>{user.name}</b>
                                    {user && user.isDefault && (<Chip
                                        label={'Draft'}
                                        size="small"
                                        variant="outlined"
                                        color='primary'
                                    />)
                                    }
                                </Stack>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stages && stages.length > 0 && stages.map(stage => (
                        <TableRow key={stage.stageId}>
                            <TableCell sx={{ position: 'sticky', left: 0, background: '#fff', p: 1.5 }}>
                                {stage.stageName}
                            </TableCell>
                            {selectedUsers.map(user => {
                                const userStageIds = stagesState[user.userId] || [];
                                const isChecked = userStageIds.some(id => Number(id) === Number(stage.stageId));
                                return (
                                    <TableCell key={user.userId} align="center" sx={{ p: 1.5 }}>
                                        <Checkbox
                                            checked={isChecked}
                                            sx={{ p: 0 }}
                                            onChange={(e) => {
                                                let updated = [...userStageIds];
                                                if (e.target.checked) {
                                                    updated.push(stage.stageId);
                                                } else {
                                                    updated = updated.filter(
                                                        (id) => Number(id) !== Number(stage.stageId)
                                                    );
                                                }
                                                setValue(
                                                    `stages.${user.userId}`,
                                                    updated,
                                                    {
                                                        shouldDirty: true,
                                                        shouldValidate: true,
                                                    }
                                                );
                                            }}
                                        />
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
