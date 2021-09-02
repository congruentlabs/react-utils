import { MutableRefObject, Dispatch } from 'react';
export declare function useComponentStatusRef(componentStatusRef?: MutableRefObject<boolean>): MutableRefObject<boolean>;
export declare function useSafeDispatch<TAction>(dispatch: Dispatch<TAction>, componentStatusRef?: MutableRefObject<boolean>): (action: TAction) => void;
export declare function useSafeState<TState>(initialState: TState, componentStatusRef?: MutableRefObject<boolean>): [TState, (newState: TState) => void];
export declare function useExecutor(func: () => Promise<void>): () => void;
