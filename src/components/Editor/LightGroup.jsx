import React from 'react';
import Light from '../Light';

/**
 * Componente otimizado para carregamento de luzes por grupos
 * para evitar renderização excessiva ao mesmo tempo
 */
const LightGroup = React.memo(({ 
  rowIndex, 
  columns, 
  currentRow 
}) => {
  return (
    <>
      {columns.map((_, columnIndex) => (
        <Light
          // biome-ignore lint/suspicious/noArrayIndexKey: Índices são estáveis neste contexto
          key={`light-${rowIndex}-${columnIndex}`}
          row={rowIndex}
          column={columnIndex}
          isCurrent={rowIndex === currentRow}
        />
      ))}
    </>
  );
});

// Prevenir erros de nome no React DevTools
LightGroup.displayName = 'LightGroup';

export default LightGroup;
