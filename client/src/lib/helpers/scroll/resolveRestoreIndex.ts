interface RestorePosition {
  listID?: string | null;
  topKey: string | number | null;
  topIndex: number | null;
}

interface RestoreIndexOptions<T> {
  items: readonly T[];
  listId: string;
  restorePosition?: RestorePosition;
  getKey: (item: T) => string | number;
}

// null means there is no applicable restoration; zero is a valid saved target.
export function resolveRestoreIndex<T>({
  items, listId, restorePosition, getKey,
}: RestoreIndexOptions<T>): number | null {
  if (!restorePosition || restorePosition.listID !== listId || items.length === 0) {
    return null;
  }

  const keyIndex = restorePosition.topKey == null
    ? -1
    : items.findIndex(item => getKey(item) === restorePosition.topKey);
  if (keyIndex >= 0) return keyIndex;

  return Math.max(0, Math.min(restorePosition.topIndex ?? 0, items.length - 1));
}
