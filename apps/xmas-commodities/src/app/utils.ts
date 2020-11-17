export function last<T>(items: readonly T[]): T | undefined {
  return items[items.length - 1];
}
