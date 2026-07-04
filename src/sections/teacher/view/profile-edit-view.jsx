import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

import { useSelector } from 'react-redux';
import { TeacherSaveForm } from '../teacher-save-form';

export function ProfileEditView() {
  const { loggedInTeacher } = useSelector((state) => state.AuthReducer);
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Profile"
        links={
          [{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Edit Profile' }]}
        sx={{ mb: { xs: 2, md: 2 } }}
      />
      <TeacherSaveForm />
    </DashboardContent>
  );
}
