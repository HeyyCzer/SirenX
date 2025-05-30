import { useEditorStore } from '@/store/editor.store';
import { useSettingsStore } from '@/store/settings.store';
import { useEffect } from 'react';

export function useOneColorPerColumn() {
  const lights = useEditorStore((state) => state.lights);
  const updateLights = useEditorStore((state) => state.updateLights);
  const oneColorPerColumn = useSettingsStore((state) => state.settings.oneColorPerColumn);

  useEffect(() => {
    if (!oneColorPerColumn.value) return;

    let hasChanges = false;
    const newLights = { ...lights };
    const columnColors = [];

    for (const rowIndex in lights) {
      const row = lights[rowIndex];
      if (!row) continue;

      for (const index in row) {
        const item = row[index];
        if (!item) continue;

        if (!columnColors[index] && item.color !== "none") {
          columnColors[index] = item.color;
        }
      }
    }

    for (const rowIndex in lights) {
      const row = lights[rowIndex];
      if (!row) continue;
      
      for (const index in row) {
        const item = row[index];
        if (!item) continue;
        
        if (item.color !== "none" && columnColors[index] && item.color !== columnColors[index]) {
          if (!newLights[rowIndex]) newLights[rowIndex] = {};
          newLights[rowIndex][index] = {
            ...item,
            color: columnColors[index],
          };
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      updateLights(newLights);
    }
  }, [oneColorPerColumn.value, lights, updateLights]);
}

export function usePreventContextMenu() {
  useEffect(() => {
    const preventContextMenu = (e) => e.preventDefault();
    window.addEventListener("contextmenu", preventContextMenu);

    return () => {
      window.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);
}
