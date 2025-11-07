export function getOffsetForIndex({
  align,
  containerOffset,
  catchBounds,
  itemCount,
  itemSize,
  containerSize,
  index,
}: {
  align: string;
  containerOffset: number;
  catchBounds: any;
  itemCount: number;
  itemSize: number | undefined | ((val: any) => number);
  containerSize: number;
  index: number;
}) {
  let alignWay = align;
  // 计算出目标项的最大偏移量
  const lastItemOffset = catchBounds.get(itemCount - 1)?.scrollOffset;
  let lastItemSize;
  if (typeof itemSize === "number") {
    lastItemSize = itemSize;
  } else {
    lastItemSize = catchBounds.averageSize;
  }
  const maxOffset = lastItemOffset + lastItemSize - containerSize;

  // 目标项基于容器底部和顶部对齐的偏移量

  const alignStartOffset = Math.min(
    lastItemOffset,
    catchBounds.get(index)?.scrollOffset
  );
  const alignEndOffset = Math.max(
    0,
    catchBounds.get(index + 1)?.scrollOffset - containerSize
  );

  // 是否需要进行平滑滚动 => smart
  if (alignWay === "smart") {
    if (
      containerOffset >= alignEndOffset &&
      containerOffset <= alignStartOffset
    ) {
      // 说明目标项在可视区域内，不需要调整为居中对齐
      alignWay = "auto";
    } else {
      // 说明目标项不在可视区域内，需要调整为居中对齐
      alignWay = "center";
    }
  }

  // 根据对齐方式返回目标项的偏移量
  switch (alignWay) {
    case "start":
      return Math.min(maxOffset, alignStartOffset);
    case "end":
      return alignEndOffset;
    case "center":
      // 冗余空间的一半
      const halfSpace = (containerSize - lastItemSize) / 2;
      const middleOffset = Math.round(halfSpace + alignEndOffset);
      // 判断目标项靠近头部还是底部
      if (middleOffset < Math.ceil(containerSize / 2)) {
        return 0;
      } else if (middleOffset > maxOffset) {
        return maxOffset;
      } else {
        return middleOffset;
      }
    case "auto":
    default:
      if (
        containerOffset >= alignEndOffset &&
        containerOffset <= alignStartOffset
      ) {
        return containerOffset;
      } else if (containerOffset < alignEndOffset) {
        return alignEndOffset;
      } else {
        return alignStartOffset;
      }
  }
}
