import { useEditorStore, useSettingsStore } from '@/store/index.ts';
import { useCallback } from 'react';
import { useShallow } from "zustand/react/shallow";

/**
 * Hook personalizado para gerenciar a cor do componente Light
 * otimizado para evitar renderizações desnecessárias
 */
export function useLightColor(row, column, disabled = false) {
  // Usamos useShallow para evitar renderizações quando outras partes do estado mudam
  const light = useEditorStore(
    useShallow(state => state.lights?.[row]?.[column])
  );
  
  const { selectedColor, updateLight } = useEditorStore(
    useShallow(state => ({ 
      selectedColor: state.selectedColor,
      updateLight: state.updateLight
    }))
  );
  
  const isOneColorPerColumn = useSettingsStore(
    state => state.settings.oneColorPerColumn,
  );

  const handleClick = useCallback(
    () => {
      if (disabled) return;
      updateLight({ 
        row, 
        column, 
        color: selectedColor, 
        isOneColorPerColumn 
      });
    },
    [updateLight, row, column, disabled, isOneColorPerColumn, selectedColor],
  );

  return {
    light,
    selectedColor,
    handleClick
  };
}
