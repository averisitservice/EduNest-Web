import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { MaintenanceIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function MaintenanceView() {
  return (
    <Container sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Website currently under maintenance
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        We are currently working hard on this page!
      </Typography>

      <MaintenanceIllustration sx={{ my: { xs: 5, sm: 10 } }} />
    </Container>
  );
}
