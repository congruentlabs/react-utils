var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect, useRef, useState } from 'react';
export function useComponentStatusRef(componentStatusRef) {
    const componentStatus = componentStatusRef !== null && componentStatusRef !== void 0 ? componentStatusRef : useRef(true);
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
export function useSafeDispatch(dispatch, componentStatusRef) {
    const componentStatus = useComponentStatusRef(componentStatusRef);
    return (action) => {
        if (componentStatus.current === true) {
            dispatch(action);
        }
    };
}
export function useSafeState(initialState, componentStatusRef) {
    const componentStatus = useComponentStatusRef(componentStatusRef);
    const [state, setState] = useState(initialState);
    const safeSetState = (newState) => {
        if (componentStatus.current === true) {
            setState(newState);
        }
    };
    return [state, safeSetState];
}
export function useExecutor(func) {
    const [executionCounter, setExecutionCounter] = useSafeState(0);
    const previousCounterRef = useRef(0);
    useEffect(() => {
        if (executionCounter !== previousCounterRef.current) {
            previousCounterRef.current = executionCounter;
            (() => __awaiter(this, void 0, void 0, function* () {
                yield func();
            }))();
        }
    }, [func, executionCounter, previousCounterRef]);
    const execute = () => {
        const newCount = executionCounter !== Number.MAX_SAFE_INTEGER ? executionCounter + 1 : 0;
        setExecutionCounter(newCount);
    };
    return execute;
}
