import React from 'react';
import { themeConfig } from 'src/theme';

const Tooth = ({ number, selectedTeeth, onToothClick, children }) => {
  const isSelected = selectedTeeth.includes(number);

  return (
    <g onClick={() => onToothClick(number)} style={{ cursor: 'pointer' }}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          fill:
            index === 0
              ? isSelected
                ? themeConfig.palette.primary.light
                : themeConfig.palette.common.white
              : 'none',
          stroke: themeConfig.palette.common.black,
          strokeWidth: 1,
        })
      )}
    </g>
  );
};

export default Tooth;
