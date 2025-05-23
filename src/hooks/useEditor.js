import { useEditorStore, useSettingsStore } from '@/store';
import { useEffect } from 'react';

/**
 * Hook para gerenciar a funcionalidade de uma cor por coluna no editor
 */
export function useOneColorPerColumn() {
  const lights = useEditorStore((state) => state.lights);
  const updateLights = useEditorStore((state) => state.updateLights);
  const oneColorPerColumn = useSettingsStore((state) => state.settings.oneColorPerColumn);

  useEffect(() => {
    if (!oneColorPerColumn.value) return;

    // Usamos uma referência ao objeto para evitar cópia desnecessária
    let hasChanges = false;
    const newLights = { ...lights };
    const columnColors = [];

    // Primeiro, encontramos a primeira cor não vazia para cada coluna
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

    // Depois, aplicamos as cores onde necessário
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

    // Só atualizamos o estado se houver mudanças
    if (hasChanges) {
      updateLights(newLights);
    }
  }, [oneColorPerColumn.value, lights, updateLights]);
}

/**
 * Hook para prevenir o menu de contexto padrão do navegador
 */
export function usePreventContextMenu() {
  useEffect(() => {
    const preventContextMenu = (e) => e.preventDefault();
    window.addEventListener("contextmenu", preventContextMenu);

    return () => {
      window.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);
}
