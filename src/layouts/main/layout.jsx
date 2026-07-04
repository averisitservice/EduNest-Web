import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
// ----------------------------------------------------------------------
export function MainLayout({ children, isGuestRoute }) {

  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: theme.palette.grey[200],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {/* The inner Box needs adjustment */}
      <Box
        sx={{
          maxWidth: isGuestRoute ? 'none' : '800px',
          width: '100%',
          height: '100vh',
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
