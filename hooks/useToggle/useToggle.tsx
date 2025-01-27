import {boolean} from 'joi';
import React from 'react';

export type HandlersType = {
  on: () => void;
  off: () => void;
  toggle: () => void;
};

interface UseToggleReturn {
  state: boolean;
  handlers: HandlersType;
}

export const useToggle = (): UseToggleReturn => {
  const [state, setState] = React.useState<boolean>(false);

  const handlers = React.useMemo(
    () => ({
      on: () => {
        setState(true);
      },
      off: () => {
        setState(false);
      },
      toggle: () => {
        setState((s) => (s === true ? false : true));
      },
    }),
    [],
  );

  return {state, handlers};
};
