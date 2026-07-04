import { Box, Card, Link, Typography } from '@mui/material';
import { SvgColor } from 'src/components/svg-color';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function CardSummary({ sx, icon, title, total, href, color = 'warning', ...other }) {
  return (
    <Card sx={[{ py: 3, pl: 3, pr: 2.5 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ typography: 'h5' }}>{total}</Box>

        {href ? (
          <Link component={RouterLink} href={href} color="inherit" sx={{ cursor: 'pointer' }}>
            <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
              {title}
            </Typography>
          </Link>
        ) : (
          <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
        )}
      </Box>

      <SvgColor
        src={icon}
        sx={(theme) => ({
          top: 24,
          right: 20,
          width: 36,
          height: 36,
          position: 'absolute',
          background: `linear-gradient(135deg, ${theme.vars.palette[color].main} 0%, ${theme.vars.palette[color].dark} 100%)`,
        })}
      />

      <Box
        sx={(theme) => ({
          top: -44,
          width: 160,
          zIndex: -1,
          height: 160,
          right: -104,
          opacity: 0.12,
          borderRadius: 3,
          position: 'absolute',
          transform: 'rotate(40deg)',
          background: `linear-gradient(to right, ${theme.vars.palette[color].main}, transparent)`,
        })}
      />
    </Card>
  );
}
