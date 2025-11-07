import { useMemo } from "react";
import { createCachedBounds } from "../utils/createCachedBounds";
export function useCatchBounds<Props extends object>({
  estimatedItemSize,
  itemSize,
  itemProps,
  itemCount,
}: {
  estimatedItemSize: number;
  itemSize: number | undefined | ((val: any) => number);
  itemProps: Props;
  itemCount: number;
}) {
  return useMemo(
    () =>
      createCachedBounds({
        estimatedItemSize,
        itemProps,
        itemCount,
        itemSize,
      }),
    [estimatedItemSize, itemSize, itemCount]
  );
}
