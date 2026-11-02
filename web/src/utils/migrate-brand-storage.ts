const StorageRenames = [
  ['answerwhizai-ui-theme', 'sourcepi-ui-theme'],
  ['answerwhizai_llm_list_cache', 'sourcepi_llm_list_cache'],
] as const;

/** Move saved browser state once before the application reads its current keys. */
export function migrateBrandStorage(storage: Storage) {
  try {
    for (const [previousKey, currentKey] of StorageRenames) {
      const previous = storage.getItem(previousKey);
      if (previous === null) continue;
      if (storage.getItem(currentKey) === null)
        storage.setItem(currentKey, previous);
      storage.removeItem(previousKey);
    }
  } catch {
    // Storage restrictions must not interrupt application startup.
  }
}
