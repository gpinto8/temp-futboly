import { useState, useEffect } from 'react';

type ComponentProps = {
  label: string;
  Component: () => any;
};

type ResultProps = {
  components: (ComponentProps & { id: string })[];
  currentComponentId: string;
  setComponentId: (id: string) => any;
  SwitchedComponent: (() => any) | undefined;
  isCurrentId: (id: string) => boolean;
};

export const useSwitchComponents = (
  components: ComponentProps[],
  externalComponentId?: string, // id esterno controllato da context
): ResultProps => {
  const newComponents = components.map((component) => ({
    ...component,
    id: component.label.toUpperCase(),
  }));

  const [internalValue, setInternalValue] = useState(
    externalComponentId || newComponents[0]?.id,
  );

  useEffect(() => {
    if (externalComponentId && externalComponentId !== internalValue) {
      setInternalValue(externalComponentId);
    }
  }, [externalComponentId]);

  const componentToRender = newComponents.find(
    (component) => component.id === internalValue,
  )?.Component;

  const isCurrentId = (id: string) => internalValue === id;

  return {
    components: newComponents,
    currentComponentId: internalValue,
    setComponentId: setInternalValue,
    SwitchedComponent: componentToRender,
    isCurrentId,
  };
};
