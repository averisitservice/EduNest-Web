import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StudentSaveForm } from '../student-save-form';

export function StudentEditView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Student"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Student', href: paths.dashboard.student.root },
          { name: 'Edit Student' },
        ]}
        sx={{ mb: { xs: 2, md: 2 } }}
      />

      <StudentSaveForm />
    </DashboardContent>
  );
}
