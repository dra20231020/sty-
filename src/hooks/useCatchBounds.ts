import { useMemo } from "react";
import { createCachedBounds } from "../utils/createCachedBounds";
export function useCatchBounds ({
  estimatedItemSize,
  itemSize,
  itemCount,
}: {
  estimatedItemSize: number;
  itemSize: number | undefined | ((val: any) => number);
  itemCount: number;
}) {
  return useMemo(
    () =>
      createCachedBounds({
        estimatedItemSize,
        itemCount,
        itemSize,
      }),
    [estimatedItemSize, itemSize, itemCount]
  );
}
