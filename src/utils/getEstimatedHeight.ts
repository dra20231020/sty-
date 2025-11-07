export function getEstimatedHeight({
  catchBounds,
  itemCount,
  estimatedItemSize,
  itemSize,
}: {
  catchBounds: any;
  itemCount: number;
  estimatedItemSize: number;
  itemSize: number | undefined | ((val: any) => number);
}) {
  if (typeof itemSize === "number") {
    return itemSize * itemCount;
  } else if (catchBounds.size > 0) {
    return catchBounds.averageSize * itemCount;
  } else {
    return estimatedItemSize * itemCount;
  }
}
