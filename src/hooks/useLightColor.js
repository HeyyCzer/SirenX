import { useEditorStore } from '@/store/editor.store';
import { useSettingsStore } from '@/store/settings.store';
import { useCallback } from 'react';
import { useShallow } from "zustand/react/shallow";

export function useLightColor(row, column, disabled = false) {
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
