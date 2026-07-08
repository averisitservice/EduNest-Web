import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TeacherSaveForm } from '../teacher-save-form';

export function TeacherEditView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Teacher"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Teachert', href: paths.dashboard.teacher.root },
          { name: 'Edit teacher' },
        ]}
        sx={{ mb: { xs: 2, md: 2 } }}
      />

      <TeacherSaveForm />
    </DashboardContent>
  );
}
