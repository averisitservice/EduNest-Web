import { m } from 'framer-motion';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ForbiddenIllustration } from 'src/assets/illustrations';
import { varBounce, MotionContainer } from 'src/components/animate';
import { Button } from '@mui/material';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function RoleBasedGuard({ sx, children, hasContent }) {
  return hasContent ? (
    <Container
      component={MotionContainer}
      sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <m.div variants={varBounce('in')}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Permission denied
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary' }}>
          You do not have permission to access this page.
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
      </m.div>
      <Button component={RouterLink} href={-1} size="large" variant="contained">
        Go to home
      </Button>
    </Container>
  ) : null;
}
