/**
 * @description 动态监听盒子的变化
 */
import { useMemo, useState, useLayoutEffect, type CSSProperties } from "react";
import pxToNumber from "../utils/pxTonumber";

export function useResizeObserver({
  element,
  boxOptions,
  direction,
  defaultWidth,
  defaultHeight,
  style,
}: {
  element: HTMLElement | null;
  boxOptions: ResizeObserverBoxOptions;
  direction: "horizontal" | "vertical";
  defaultWidth?: number;
  defaultHeight?: number;
  style?: CSSProperties;
}) {
  // 被观察的目标元素固定宽高，若设置了则不用开启观测
  const { styleHeight, styleWidth } = useMemo(
    () => ({
      styleHeight: pxToNumber(style?.height),
      styleWidth: pxToNumber(style?.width),
    }),
    [style?.height, style?.width]
  );
  
  // 记录被观察元素动态宽高，初始值默认为传入参数的值
  const [eleSizeState, setEleSizeState] = useState<{
    height: number | undefined;
    width: number | undefined;
  }>({
    height: defaultHeight,
    width: defaultWidth,
  });
  
  // 判断是否对该元素进行观察，若设置了宽高则不进行观察
  const disabled = useMemo(
    () =>
      (direction === "horizontal" && styleWidth !== null) ||
      (direction === "vertical" && styleHeight !== null) ||
      (styleHeight !== null && styleWidth !== null),
    [styleHeight, styleWidth, direction]
  );
  
  // 核心代码，观察目标元素尺寸变化
  useLayoutEffect(() => {
    // 判断是否需要对目标元素进行观察
    if (element === null || disabled) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { contentRect, target } = entry;
        if (element === target) {
        
          setEleSizeState((preState) => {
            if (
              preState?.height === contentRect.height &&
              preState?.width === contentRect.width
            ) {
                 
              return preState;
            }
           
            return {
              height: contentRect.height,
              width: contentRect.width,
            };
          });
        }
      }
    });
    
    
    observer.observe(element, {
      box: boxOptions,
    });
    
    
   
    
    return () => observer?.unobserve(element);
  }, [element, disabled, boxOptions, styleHeight, styleWidth]);

  const res = useMemo(
    () => ({
      height: styleHeight ?? eleSizeState.height,
      width: styleWidth ?? eleSizeState.width,
    }),
    [eleSizeState, styleHeight, styleWidth]
  );
  return res;
}

export default useResizeObserver;
