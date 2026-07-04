import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { m } from 'framer-motion';
import { useSelector } from 'react-redux';
import { AnimateBorder, transitionTap, varHover, varTap } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AccountButton({ displayName, sx, ...other }) {
  const { loggedInTeacher } = useSelector((state) => state.AuthReducer);
  return (
    <IconButton
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Account button"
      sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <AnimateBorder
        sx={{ p: '3px', borderRadius: '50%', width: 40, height: 40 }}
        slotProps={{
          primaryBorder: { size: 60, width: '1px', sx: { color: 'primary.main' } },
          secondaryBorder: { sx: { color: 'warning.main' } },
        }}
      >
        <Avatar src={loggedInTeacher?.imagePath} alt={loggedInTeacher.name} sx={{ width: 1, height: 1, bgcolor: 'primary.main', color: 'white' }}>
          {loggedInTeacher?.name?.charAt(0).toUpperCase()}
        </Avatar>
      </AnimateBorder>
    </IconButton>
  );
}
