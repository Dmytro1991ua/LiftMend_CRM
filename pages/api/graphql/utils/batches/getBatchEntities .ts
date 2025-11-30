/**
 * Generic batch fetch and group function (type-safe)
 *
 * Fetches items in batch and groups them according to a provided grouping function.
 * Ensures the returned arrays correspond to the order of input keys.
 *
 * T = type of items being fetched (e.g., RepairJob)
 * K = type of keys used to fetch items (e.g., string)
 * KeyObj = shape of the object used to group items (e.g., { buildingName: string; elevatorLocation: string })
 */
export const getBatchEntities = <T, K, KeyObj extends Record<string, unknown>>({
  fetchFn,
  keyExtractor,
  groupByFn,
}: {
  fetchFn: (keys: readonly K[]) => Promise<T[]>;
  keyExtractor: (key: K) => KeyObj;
  groupByFn: (item: T) => KeyObj;
}) => {
  return async (keys: readonly K[]): Promise<T[][]> => {
    if (!keys.length) return [];

    // Convert each input key to its object form for grouping
    const keyPairs: KeyObj[] = keys.map(keyExtractor);

    const allItems = await fetchFn(keys);

    // Group items by their group key for efficient lookup
    // Using a Map with JSON.stringify of the group key as string
    const groupedEntitiesMap = new Map<string, T[]>();

    allItems.forEach((item) => {
      const itemGroupKey = groupByFn(item);
      const mapKey = JSON.stringify(itemGroupKey); // serialize key object for Map
      const itemsForKey = groupedEntitiesMap.get(mapKey) ?? [];

      itemsForKey.push(item);

      groupedEntitiesMap.set(mapKey, itemsForKey);
    });

    // Return grouped items in the same order as input keys ---
    return keyPairs.map((keyPair) => groupedEntitiesMap.get(JSON.stringify(keyPair)) ?? []);
  };
};
