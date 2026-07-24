import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Divider,
  Typography,
  CardHeader,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { fCurrency, fNumber } from 'src/utils/format-number';
import dateHelper from 'src/utils/dateHelper';
import ApiService from 'src/services/ApiService';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const AUDIENCE_COLOR = {
  ALL: 'default',
  TEACHERS: 'info',
  PARENTS: 'warning',
  STUDENTS: 'success',
};

const TYPE_COLOR = {
  GENERAL: 'default',
  HOLIDAY: 'error',
  EXAM: 'warning',
  SPORTS: 'success',
  CULTURAL: 'secondary',
  MEETING: 'info',
};

function StatCard({ title, value, icon, color = 'primary.main' }) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: color,
            color: 'common.white',
          }}
        >
          <Iconify icon={icon} width={28} />
        </Box>
        <Stack>
          <Typography variant="h3">{value}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export function OverviewAnalyticsView() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    const res = await ApiService.getDashboardSummaryAsync();
    setSummary(res && res.data ? res.data : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const attendance = summary?.attendanceToday;
  const upcomingEvents = summary?.upcomingEvents || [];
  const latestAnnouncements = summary?.latestAnnouncements || [];

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Students"
            value={fNumber(summary?.totalStudents || 0)}
            icon="solar:users-group-rounded-bold"
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Teachers"
            value={fNumber(summary?.totalTeachers || 0)}
            icon="solar:user-id-bold"
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Classes"
            value={fNumber(summary?.totalClasses || 0)}
            icon="solar:square-academic-cap-bold"
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Fees Collected (This Month)"
            value={fCurrency(summary?.feeCollectedThisMonth || 0)}
            icon="solar:wallet-money-bold"
            color="success.main"
          />
        </Grid>

        {/* Today's attendance */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: 1 }}>
            <CardHeader
              title="Today's Attendance"
              subheader={attendance?.date ? dateHelper.formatDate(attendance.date) : ''}
            />
            <CardContent>
              {attendance && attendance.marked > 0 ? (
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography variant="h2">{attendance.presentPercent}%</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      present today
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={attendance.presentPercent}
                    color="success"
                    sx={{ height: 10, borderRadius: 1 }}
                  />
                  <Stack direction="row" spacing={3} sx={{ pt: 1 }}>
                    <Stack>
                      <Typography variant="h5" sx={{ color: 'success.main' }}>
                        {attendance.present}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Present
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="h5" sx={{ color: 'error.main' }}>
                        {attendance.absent}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Absent
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="h5" sx={{ color: 'warning.main' }}>
                        {attendance.late}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Late
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="h5">{attendance.marked}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Marked
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Attendance has not been marked today.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming events */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: 1 }}>
            <CardHeader title="Upcoming Events" />
            <CardContent sx={{ pt: 1 }}>
              {upcomingEvents.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No upcoming events.
                </Typography>
              ) : (
                <Stack divider={<Divider flexItem />} spacing={1.5}>
                  {upcomingEvents.map((ev) => (
                    <Stack
                      key={ev.eventId}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Iconify icon="solar:calendar-mark-bold" sx={{ color: 'text.disabled' }} />
                        <Typography variant="subtitle2">{ev.title}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Chip
                          size="small"
                          label={ev.eventType || 'GENERAL'}
                          color={TYPE_COLOR[ev.eventType] || 'default'}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {ev.startDate ? dateHelper.formatDate(ev.startDate) : ''}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Latest announcements */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Latest Announcements" />
            <CardContent sx={{ pt: 1 }}>
              {latestAnnouncements.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No announcements yet.
                </Typography>
              ) : (
                <Stack divider={<Divider flexItem />} spacing={1.5}>
                  {latestAnnouncements.map((a) => (
                    <Stack
                      key={a.announcementId}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Iconify icon="solar:bell-bold" sx={{ color: 'text.disabled' }} />
                        <Typography variant="subtitle2">{a.title}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Chip
                          size="small"
                          label={a.audience}
                          color={AUDIENCE_COLOR[a.audience] || 'default'}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {a.publishDate ? dateHelper.formatDate(a.publishDate) : ''}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
