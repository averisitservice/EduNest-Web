import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { UserStageForm } from '../teacher-stage-form';

export function UserStagesView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Roster"
                sx={{ mb: { xs: 2, md: 2 } }}
            />
            <UserStageForm />
        </DashboardContent>
    );
}
