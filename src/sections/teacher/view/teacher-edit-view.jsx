import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserSaveForm } from '../teacher-save-form';

export function TeacherEditView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Staff Member"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Staff', href: paths.dashboard.user.root },
          { name: 'Edit Staff Member' },
        ]}
        sx={{ mb: { xs: 2, md: 2 } }}
      />

      <UserSaveForm />
    </DashboardContent>
  );
}
