import { useEffect, useRef, useState, MutableRefObject, Dispatch } from 'react';

export function useComponentStatusRef(
  componentStatusRef?: MutableRefObject<boolean>
): MutableRefObject<boolean> {
  const componentStatus = componentStatusRef ?? useRef(true);

  useEffect(() => {
    if (componentStatusRef === undefined) {
      return () => {
        componentStatus.current = false;
      };
    }
    return () => {
      // returns a clean-up function that does nothing as this component
      // is not the owner of the component status reference.
    };
  }, []);

  return componentStatus;
}

export function useSafeDispatch<TAction>(
  dispatch: Dispatch<TAction>,
  componentStatusRef?: MutableRefObject<boolean>
): (action: TAction) => void {
  const componentStatus = useComponentStatusRef(componentStatusRef);

  return (action: TAction) => {
    if (componentStatus.current === true) {
      dispatch(action);
    }
  };
}

export function useSafeState<TState>(
  initialState: TState,
  componentStatusRef?: MutableRefObject<boolean>
): [TState, (newState: TState) => void] {
  const componentStatus = useComponentStatusRef(componentStatusRef);

  const [state, setState] = useState<TState>(initialState);

  const safeSetState = (newState: TState) => {
    if (componentStatus.current === true) {
      setState(newState);
    }
  };

  return [state, safeSetState];
}

export function useExecutor(func: () => Promise<void>): () => void {
  const [executionCounter, setExecutionCounter] = useSafeState(0);

  const previousCounterRef = useRef(0);

  useEffect(() => {
    if (executionCounter !== previousCounterRef.current) {
      previousCounterRef.current = executionCounter;

      (async () => {
        await func();
      })();
    }
  }, [func, executionCounter, previousCounterRef]);

  const execute = () => {
    const newCount = executionCounter !== Number.MAX_SAFE_INTEGER ? executionCounter + 1 : 0;

    setExecutionCounter(newCount);
  };

  return execute;
}
