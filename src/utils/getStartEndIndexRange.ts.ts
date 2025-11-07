export function getStartEndIndexRange({
  containerScrollOffset,
  containerSize,
  itemCount,
  overScanCount,
  catchBounds,
}: {
  containerScrollOffset: number;
  containerSize: number;
  itemCount: number;
  overScanCount: number;
  catchBounds: any;
}) {
  // 初始参数
  let startIndex = 0;
  let endIndex = -1;
  let currentIndex = 0;
  let currentOffset = 0;
  const maxIndex = itemCount - 1;
  while (currentIndex < maxIndex) {
    const bounds = catchBounds.get(currentIndex);
    if (bounds) {
      currentOffset = bounds.scrollOffset + bounds.size;
    } else {
      currentOffset = catchBounds.averageSize;
    }
    if (currentOffset >= containerScrollOffset) {
      break;
    }
    currentIndex++;
  }
  startIndex = currentIndex;
  startIndex = Math.max(0, startIndex - overScanCount);

  while (currentIndex < maxIndex) {
    const bounds = catchBounds.get(currentIndex);
    if (bounds) {
      currentOffset = bounds.scrollOffset + bounds.size;
    } else {
      currentOffset = catchBounds.averageSize;
    }
    if (currentOffset >= containerScrollOffset + containerSize) {
      break;
    }
    currentIndex++;
  }
  endIndex = Math.min(currentIndex, maxIndex);
  endIndex = Math.min(maxIndex, endIndex + overScanCount);
  
  return startIndex < 0 ? [0, -1] : [startIndex, endIndex];
}
