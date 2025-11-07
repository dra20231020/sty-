/**
 * @description 用来实现虚拟滚动的核心逻辑
 */
import {
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import useResizeObserver from "./useResizeObserver";
import { useCatchBounds } from "./useCatchBounds";
import { getEstimatedHeight } from "../utils/getEstimatedHeight";
import { getStartEndIndexRange } from "../utils/getStartEndIndexRange.ts";
import { getOffsetForIndex } from "../utils/getOffsetForIndex";

const DATA_ATTRIBUTE = "data-virtualizer";

export function useVirtualizer({
  containerEle,
  containerStyle,
  defaultContainerSize = 0,
  direction,
  estimatedItemSize = 50,
  itemCount,
  itemSize,
  onResize,
  overScanCount,
}: {
  containerEle: HTMLElement | null;
  containerStyle?: React.CSSProperties;
  defaultContainerSize?: number;
  direction: "horizontal" | "vertical";
  estimatedItemSize?: number;
  itemCount: number;
  itemSize: number | undefined | ((val: any) => number);
  onResize: (
    size: { height: number; width: number },
    preSize: { height: number; width: number }
  ) => void | undefined;
  overScanCount: number;
}) {
  // 初始加载的可视区域的item为0时的边界处理
  const [indexRange, setIndexRange] = useState<number[]>([0, -1]);
  const [startIndex, endIndex] = useMemo(
    (): number[] => [
      Math.min(itemCount - 1, indexRange[0]),
      Math.min(itemCount - 1, indexRange[1]),
    ],
    [itemCount, indexRange]
  );
  // 得到的容器的宽度和高度
  const { height = defaultContainerSize, width = defaultContainerSize } =
    useResizeObserver({
      element: containerEle,
      boxOptions: "content-box",
      direction,
      defaultHeight:
        direction === "vertical" ? defaultContainerSize : undefined,
      defaultWidth:
        direction === "horizontal" ? defaultContainerSize : undefined,
      style: containerStyle,
    });

  
  // 对容器的宽高进行缓存，以便后续的比较
  const preSizeRef = useRef<{
    height: number;
    width: number;
  }>({
    height: 0,
    width: 0,
  });
  // 判断容器的大小是否发生了变化
  useLayoutEffect(() => {
    if (typeof onResize === "function") {
      const preSize = preSizeRef.current;
      if (preSize.height !== height || preSize.width !== width) {
        onResize(
          {
            height,
            width,
          },
          preSize
        );
        preSizeRef.current = {
          height,
          width,
        };
      }
    }
  }, [height, width, onResize]);

  // 创建缓存对象
  const catchBounds = useCatchBounds({
    estimatedItemSize,
    itemCount,
    itemSize,
  });
  // 得到列表的估计高度
  const getEstimatedHeightUtil = useCallback(
    () =>
      getEstimatedHeight({
        itemCount,
        catchBounds,
        estimatedItemSize,
        itemSize,
      }),
    [itemCount, catchBounds, estimatedItemSize, itemSize]
  );
  // 根据滚动方向得到容器大小
  const containerSize = direction === "vertical" ? height : width;
  
  // 得到起始索引和结束索引
  const getStartEndIndexRangeUtil = useCallback(
    (containerScrollOffset: number) =>
      getStartEndIndexRange({
        containerScrollOffset,
        containerSize,
        itemCount,
        overScanCount,
        catchBounds,
      }),
    [containerSize, itemCount, overScanCount,catchBounds]
  );

  // 监听容器滚动距离
  useLayoutEffect(() => {
    const containerScrollOffset =
      direction === "vertical"
        ? (containerEle?.scrollTop ?? 0)
        : (containerEle?.scrollLeft ?? 0);
    setIndexRange(getStartEndIndexRangeUtil(containerScrollOffset));
  }, [containerEle, direction,getStartEndIndexRangeUtil]);

  // 向外暴露接口,滚动到指定索引的位置
  const scrollToIndex = useCallback(
    ({
      align = "auto",
      behavior = "auto",
      index,
      containerOffset,
    }: {
      align?: string;
      behavior?: ScrollBehavior;
      index: number;
      containerOffset: number;
    }) => {
      const scrollOffset = getOffsetForIndex({
        align,
        containerOffset,
        catchBounds,
        itemCount,
        itemSize,
        containerSize,
        index,
      });
      if (direction === "vertical") {
        containerEle?.scrollTo({
          top: scrollOffset,
          behavior: behavior || undefined,
        });
      } else {
        containerEle?.scrollTo({
          left: scrollOffset,
          behavior: behavior || undefined,
        });
      }
    },
    [containerEle, direction, catchBounds, itemCount, itemSize, containerSize]
  );
  const resizeObserverCallback = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (entries.length === 0) return null;
      for (const entry of entries) {
        const { borderBoxSize, target } = entry;
        const { inlineSize, blockSize } = borderBoxSize[0];
        const attribute = target.getAttribute(DATA_ATTRIBUTE);
        try {
          if (attribute === null || attribute === undefined) {
            throw new Error("该观测元素的自定义属性为空");
          }
        } catch (err) {
          console.error(err);
        }
        const index = parseInt(attribute as string);
        const size = direction === "vertical" ? blockSize : inlineSize;
        catchBounds.set(index, size);
      }
      // 更新起始索引和结束索引
      const containerScrollOffset =
        direction === "vertical"
          ? (containerEle?.scrollTop ?? 0)
          : (containerEle?.scrollLeft ?? 0);
      setIndexRange(getStartEndIndexRangeUtil(containerScrollOffset));
    },
    [catchBounds, direction, containerEle, getStartEndIndexRangeUtil]
  );

  // 判断itemSize是否为undefined(动态)
  const [resizeObserverObj] = useState(() => {
    if (itemSize === undefined) {
      return new ResizeObserver(resizeObserverCallback);
    }
  });

  // 对可视区的列表项尺寸变化进行监听
  useLayoutEffect(() => {
    if (!containerEle || !resizeObserverObj) return;
    const innerElement = containerEle.children[0];
    const listItemArray = Array.from(innerElement.children);
    listItemArray.forEach((item: any, index) => {
      const attribute = `${startIndex + index}`;
      item.setAttribute(DATA_ATTRIBUTE, attribute);
      resizeObserverObj.observe(item);
    });
    return () => {
      listItemArray.forEach((item: any) => {
        resizeObserverObj.unobserve(item);
        item.removeAttribute(DATA_ATTRIBUTE);
      });
    };
  }, [containerEle, resizeObserverObj, startIndex, endIndex]);

  return {
    catchBounds,
    startIndex,
    endIndex,
    scrollToIndex,
    getEstimatedHeight: getEstimatedHeightUtil,
    onScroll: (scrollOffset: number) => {
      const afterScrollIndexRange = getStartEndIndexRangeUtil(
        (scrollOffset ?? 0)
      );
      if (
        afterScrollIndexRange[0] !== indexRange[0] ||
        afterScrollIndexRange[1] !== indexRange[1]
      ) {
        setIndexRange(afterScrollIndexRange);
      }
    },
  };
}
