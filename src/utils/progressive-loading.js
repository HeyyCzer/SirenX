/**
 * Este arquivo contém utilitários para gerenciar o carregamento progressivo 
 * de componentes pesados, permitindo uma experiência mais fluida
 */

import { useEffect, useState } from 'react';

/**
 * Hook para carregar componentes gradualmente
 * @param {Object} options - Configuração para o carregamento progressivo
 * @param {Array<string>} options.components - Lista de nomes dos componentes a carregar
 * @param {Array<number>} [options.delays] - Atrasos para cada componente (em ms)
 * @returns {Object} Estado mostrando quais componentes estão carregados
 */
export function useProgressiveLoading({ components = [], delays = [] }) {
  const [loadedComponents, setLoadedComponents] = useState(
    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
    components.reduce((acc, component) => ({ ...acc, [component]: false }), {})
  );

  useEffect(() => {
    components.forEach((component, index) => {
      const delay = delays[index] || index * 300; // Delay padrão de 300ms * índice
      
      const timer = setTimeout(() => {
        setLoadedComponents(prev => ({
          ...prev,
          [component]: true
        }));
      }, delay);
      
      return () => clearTimeout(timer);
    });
  }, [components, delays]);

  return loadedComponents;
}

/**
 * Hook para renderizar um placeholder enquanto o componente está carregando
 * @param {boolean} isLoaded - Se o componente está carregado
 * @param {React.ReactNode} placeholder - O componente de placeholder a ser exibido
 * @param {React.ReactNode} component - O componente real a ser exibido quando carregado
 * @returns {React.ReactNode} O componente ou placeholder apropriado
 */
export function useLoadingPlaceholder(isLoaded, placeholder, component) {
  return isLoaded ? component : placeholder;
}
