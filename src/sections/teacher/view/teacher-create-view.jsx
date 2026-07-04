import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserSaveForm } from '../teacher-save-form';

export function TeacherCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Staff Member"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Staff', href: paths.dashboard.user.root },
          { name: 'New Staff Member' },
        ]}
        sx={{ mb: { xs: 2, md: 2 } }}
      />

      <UserSaveForm />
    </DashboardContent>
  );
}
