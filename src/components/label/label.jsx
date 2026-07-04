/* eslint-disable react/display-name */
import { upperFirst } from 'es-toolkit';
import { mergeClasses } from 'minimal-shared/utils';
import { forwardRef } from 'react';

import { labelClasses } from './classes';
import { LabelIcon, LabelRoot } from './styles';

// ----------------------------------------------------------------------

export const Label = forwardRef((props, ref) => {
  const {
    endIcon,
    children,
    startIcon,
    className,
    disabled,
    variant = 'soft',
    color = 'default',
    sx,
    ...other
  } = props;

  return (
    <LabelRoot
      ref={ref}
      color={color}
      variant={variant}
      disabled={disabled}
      className={mergeClasses([labelClasses.root, className])}
      sx={sx}
      {...other}
    >
      {startIcon && <LabelIcon className={labelClasses.icon}>{startIcon}</LabelIcon>}

      {typeof children === 'string' ? upperFirst(children) : children}

      {endIcon && <LabelIcon className={labelClasses.icon}>{endIcon}</LabelIcon>}
    </LabelRoot>
  );
});
