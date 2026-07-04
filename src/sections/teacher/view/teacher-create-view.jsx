import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TeacherSaveForm } from '../teacher-save-form';

export function TeacherCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Teacher"
        links={[
          { name: 'Dashboard', href: paths.dashboard.teacher.root  },
          { name: 'Teacher', href: paths.dashboard.teacher.root },
          { name: 'New Teacher' },
        ]}
        sx={{ mb: { xs: 2, md: 2 } }}
      />

      <TeacherSaveForm />
    </DashboardContent>
  );
}
