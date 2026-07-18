import { useState, useEffect } from 'react';
import { Tab, Tabs, Card, Stack, Select, MenuItem } from '@mui/material';
import { paths } from 'src/routes/paths';
import ApiService from 'src/services/ApiService';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AttendanceMark } from './attendance-mark';
import { AttendanceReport } from './attendance-report';


function getClassLabel(option) {
  if (!option) return '';
  return option.sectionName
    ? `${option.className} - ${option.sectionName}`
    : option.className || '';
}

function classKey(option) {
  if (!option) return '';
  return `${option.classId}-${option.sectionId !== null && option.sectionId !== undefined ? option.sectionId : 'null'}`;
}


export function AttendanceView() {
  const [classSections, setClassSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [tab, setTab] = useState('mark');

  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await ApiService.getAllClassMasterSectionsAsync();
        const list = res && res.data ? res.data : [];
        setClassSections(list);
        if (list.length > 0) setSelectedClass(list[0]);
      } catch (err) {
        console.error('Failed to load classes:', err);
      }
    }
    loadClasses();
  }, []);

  const handleSelectClass = (value) => {
    setSelectedClass(classSections.find((c) => classKey(c) === value) || null);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Attendance"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Attendance', href: paths.dashboard.attendance.root },
        ]}
        sx={{ mb: 4 }}
      />

      <Card sx={{ mb: 3, p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <Select
            size="small"
            value={classKey(selectedClass)}
            onChange={(e) => handleSelectClass(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>Select Class & Section</em>
            </MenuItem>
            {classSections.map((option) => (
              <MenuItem key={classKey(option)} value={classKey(option)}>
                {getClassLabel(option)}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Card>

      <Card>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="mark" label="Mark Attendance" />
          <Tab value="report" label="Report" />
        </Tabs>

        {tab === 'mark' ? (
          <AttendanceMark selectedClass={selectedClass} />
        ) : (
          <AttendanceReport selectedClass={selectedClass} />
        )}
      </Card>
    </DashboardContent>
  );
}
