import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExamSaveForm } from '../exam-save-form';

export function ExamCreateView() {
  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Create Exam"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Exams', href: paths.dashboard.exam.root },
          { name: 'New Exam' },
        ]}
        sx={{ mb: { xs: 2, md: 3 } }}
      />

      <ExamSaveForm />
    </DashboardContent>
  );
}
