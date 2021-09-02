declare function timeout(ms: number, onCancel: (cancel: () => void) => void): Promise<void>;
export default timeout;
