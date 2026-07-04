import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function ComingSoonView() {
  return (
    <Container sx={{ textAlign: 'center', alignItems: 'center' }}>
      <Stack
        divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}></Box>}
        sx={{ typography: 'h2', justifyContent: 'center', alignItems: 'center', mt: 10, mb: 5 }}
      >
        <img alt="Under Construction" src="/under-construction.png" style={{ width: 500 }} />
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          We are currently working hard on this page.
        </Typography>
      </Stack>
    </Container>
  );
}
