// The operation must forward this signal to fetch (or another abort-aware API).
export async function withTimeout<T>(
  run: (signal: AbortSignal) => Promise<T>,
  parent: AbortSignal,
  duration: number,
  timeout: Error,
): Promise<T> {
  parent.throwIfAborted();
  const controller = new AbortController();
  const abort = () => controller.abort(parent.reason);
  parent.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(() => controller.abort(timeout), duration);

  try {
    const result = await run(controller.signal);
    controller.signal.throwIfAborted();
    return result;
  } catch (error) {
    // Body reads can reject with AbortError rather than our timeout reason.
    controller.signal.throwIfAborted();
    throw error;
  } finally {
    clearTimeout(timer);
    parent.removeEventListener("abort", abort);
  }
}

export function waitForNextPoll(signal: AbortSignal, delay: number): Promise<void> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, delay);
    signal.addEventListener("abort", abort, { once: true });
  });
}
