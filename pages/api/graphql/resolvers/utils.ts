import { orderBy as _orderBy } from 'lodash';

export const getSortedRepairJobData = async <T>(
  model: { findMany: () => Promise<T[]> },
  field: keyof T
): Promise<string[]> => {
  const data = await model.findMany();

  return _orderBy(data.flatMap((item) => item[field] as string[]));
};

export async function fetchRepairJobData<T>(fetchFunction: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fetchFunction();
  } catch (error) {
    console.error(`Error fetching ${label}:`, error);
    throw new Error(`Failed to fetch ${label}: ${(error as Error).message}`);
  }
}
