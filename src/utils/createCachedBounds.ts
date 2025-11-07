/**
 * @description 创建缓存对象
 */
export function createCachedBounds({
  estimatedItemSize,
  itemCount,
  itemSize,
}: {
  estimatedItemSize: number;
  itemCount: number;
  itemSize: number | undefined | ((val: any) => number);
}) {
  // 创建缓存对象
  const cache = new Map();
  const obj = {
    /**
     * @description 计算平均项目大小
     *
     * 如果缓存中存在项目，则基于最后一个缓存项目的滚动偏移量和大小计算平均值
     * 如果缓存为空，则返回预估的项目大小
     *
     * @returns {number} 平均项目大小
     */
    get averageSize() {
      const lastBounds = cache.get(cache.size - 1);
      if (lastBounds) {
        return (lastBounds?.scrollOffset + lastBounds?.size) / cache.size;
      } else {
        return estimatedItemSize;
      }
    },

    /**
     * 获取指定索引项的边界信息（大小和滚动偏移量）
     *
     * 如果索引超出项目总数，返回null。当itemSize存在时，会按需构建缓存：
     * - 如果索引不在缓存中，会从当前缓存末尾开始逐步计算直到目标索引
     * - 如果索引已在缓存中，直接返回缓存结果
     *
     * @param index - 要获取的项的索引，从0开始
     * @returns 包含size和scrollOffset的边界对象，如果索引无效则返回null
     * @throws 如果前一个边界信息不存在或索引不在缓存中时会抛出错误
     */
    get(index: number) {
      if (index >= itemCount) throw new Error("index out of range");
      if (itemSize) {
        // 索引不在缓存中
        while (cache.size < index) {
          const currentIndex = cache.size;
          const size =
            typeof itemSize === "number"
              ? itemSize
              : itemSize({ currentIndex });
          if (currentIndex === 0) {
            cache.set(currentIndex, {
              size,
              scrollOffset: 0,
            });
          } else {
            const preBounds = cache.get(currentIndex - 1);
            if (preBounds === undefined || preBounds === null) {
              throw new Error("preBounds is undefined or null");
            }
            cache.set(currentIndex, {
              size,
              scrollOffset: preBounds?.scrollOffset + preBounds?.size,
            });
          }
        }
        // 索引在缓存中
        const bounds = cache.get(index);
        try {
          if (bounds === undefined || bounds === null) {
            throw new Error("index not  in cache");
          }
        } catch (err) {
          console.error(err);
        }
        return bounds;
      } else {
        return cache.get(index);
      }
    },
    has(index: number) {
      return cache.has(index);
    },
    get length() {
      return cache.size;
    },
    /**
     * 关键假设：给缓存添加项时，假设按照顺序填充，后续只需要考虑对前面项的size进行调整后更新后续项的滚动偏移量
     * 设置指定索引项的边界信息（大小和滚动偏移量）
     *
     * 根据索引位置计算滚动偏移量：
     * - 如果索引为0，滚动偏移量为0
     * - 如果索引大于0且小于缓存大小，基于前一个边界计算
     * - 如果索引大于等于缓存大小，基于最后一个缓存项和平均大小估算
     *
     * 设置完成后，会更新后续所有项的滚动偏移量以保持一致性
     *
     * @param index - 要设置的项的索引，从0开始
     * @param size - 项的大小（高度或宽度）
     * @throws 如果前一个边界信息不存在时会抛出错误
     */
    set(index: number, size: number) {
      let scrollOffset = 0;
      let currentIndex = index;
      if (index > 0) {
        // 索引>=cache.size
        if (cache.size >= index) {
          const preBounds = cache.get(index - 1);
          if (preBounds === undefined || preBounds === null) {
            throw new Error("preBounds is undefined or null");
          }
          scrollOffset = preBounds?.scrollOffset + preBounds?.size;
        } else {
          const lastBounds = cache.get(cache.size - 1);
          if (lastBounds === undefined || lastBounds === null) {
            throw new Error("lastBounds is undefined or null");
          }
          // 得到超出cache.size的部分的滚动偏移量
          const numEstimated = index - cache.size;
          scrollOffset =
            lastBounds?.scrollOffset +
            lastBounds?.size +
            numEstimated * obj.averageSize;
        }
        cache.set(index, {
          size,
          scrollOffset,
        });
      } else {
        cache.set(index, {
          size,
          scrollOffset,
        });
      }

      while (currentIndex <= cache.size - 1) {
        const bounds = cache.get(currentIndex);
        bounds.scrollOffset = scrollOffset;
        scrollOffset += bounds.size;
        currentIndex++;
      }
    },
    print() {
      return JSON.stringify(Array.from(cache.entries()), null, 2);
    },
  };

  return obj;
}
