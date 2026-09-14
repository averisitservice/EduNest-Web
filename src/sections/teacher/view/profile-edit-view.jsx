import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { TeacherSaveForm } from '../teacher-save-form';

export function ProfileEditView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Profile"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Edit Profile' }]}
        sx={{ mb: { xs: 2, md: 2 } }}
      />
      <TeacherSaveForm />
    </DashboardContent>
  );
}
