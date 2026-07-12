/* eslint-disable react/display-name */
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { mergeClasses } from 'minimal-shared/utils';
import { forwardRef } from 'react';
import { RouterLink } from 'src/routes/components';
import { useSelector } from 'react-redux';

import fullIcon from '../../assets/icons/full-logo-labSync.png';
import singleIcon from '../../assets/icons/singleIcon.png';

import { logoClasses } from './classes';
// ----------------------------------------------------------------------

export const Logo = forwardRef((props, ref) => {
  const { tenantDetail } = useSelector((state) => state.AuthReducer);

  const {
    className,
    href = '/',
    isSingle = true,
    isRestrict = false,
    disabled,
    sx,
    ...other
  } = props;

  // * OR using local (public folder)
  // *
  const singleLogo = (
    <img
      alt="Single logo"
      src={tenantDetail?.singleLogoUrl || singleIcon}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }}
    />
  );

  const fullLogo = (
    <img
      alt="Full logo"
      src={tenantDetail?.logoUrl || fullIcon}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }}
    />
  );

  return (
    <LogoRoot
      ref={ref}
      component={isRestrict ? null : RouterLink}
      href={isRestrict ? null : href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        () => ({
          width: 40,
          ...(!isSingle && { width: 200 }),
          ...(disabled && { pointerEvents: 'none' }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
});

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
