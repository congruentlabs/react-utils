async function timeout(ms: number, onCancel: (cancel: () => void) => void): Promise<void> {
  let timer;

  try {
    await new Promise((resolve, reject) => {
      if (onCancel) {
        onCancel(() => reject());
      }

      timer = setTimeout(resolve, ms);
    });
  } catch (_) {
    clearTimeout(timer);
  }
}

export default timeout;
