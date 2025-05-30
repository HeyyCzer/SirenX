import React from 'react';
import Light from '../Light';

const LightGroup = React.memo(({ 
  rowIndex, 
  columns, 
  currentRow 
}) => {
  return (
    <>
      {columns.map((_, columnIndex) => (
        <Light
          // biome-ignore lint/suspicious/noArrayIndexKey: indexes are stable in this context
          key={`light-${rowIndex}-${columnIndex}`}
          row={rowIndex}
          column={columnIndex}
          isCurrent={rowIndex === currentRow}
        />
      ))}
    </>
  );
});

LightGroup.displayName = 'LightGroup';

export default LightGroup;
