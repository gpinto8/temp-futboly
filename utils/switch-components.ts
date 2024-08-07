import { Dispatch } from '@reduxjs/toolkit';
import { SetStateAction, useState } from 'react';

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
  defaultComponentIndex?: number
): ResultProps => {
  const newComponents = components.map(component => ({
    ...component,
    id: component.label.toUpperCase(),
  }));

  const [value, setValue] = useState(newComponents?.at(defaultComponentIndex || 0)?.id);

  const componentToRender = newComponents?.find(component => component?.id === value)?.Component;
  const isCurrentId = (id: string) => value === id;

  return {
    components: newComponents,
    currentComponentId: value!,
    SwitchedComponent: componentToRender,
    setComponentId: setValue,
    isCurrentId,
  };
};
