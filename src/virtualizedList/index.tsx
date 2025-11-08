import React, { useRef, useEffect, useState, useCallback } from "react";
import { useVirtualizer } from "../hooks/useVirtualizer";
const Grid = () => {
  const [data, setData] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const sumCountRef = useRef<number>(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleResize = useCallback(
    (size: { height: number; width: number }) => {
      if (!containerRef.current) return;
      containerRef.current.style.height = `${size.height}px`;
    },
    [containerRef]
  );
  const onReachBottomLoading = useCallback(
    (callback: (val: boolean) => void, reqCount: number) => {
      if (reqCount < sumCountRef.current) {
        setData(
          Array.from(
            { length: 100 * (reqCount + 2) },
            (_, index) => `条目 ${index}`
          )
        );
        setTimeout(() => {
          callback(true);
        }, 1000);
      } else {
        callback(false);
        setHasMore(false);
      }
    },
    []
  );
  const obj = useVirtualizer({
    containerEle: containerRef.current,
    itemCount: data.length,
    direction: "vertical",
    defaultContainerSize: 800,
    itemSize: 30,
    estimatedItemSize: 50,
    overScanCount: 1,
    onResize: handleResize,
    onReachBottomLoading,
  });
  useEffect(() => {
    setData(Array.from({ length: 100 }, (_, index) => `条目 ${index}`));
  }, []);
  useEffect(() => {
    const box = document.getElementById("box");
    if (!box) return;
    const handleScroll = (event: any) => {
      if (obj.isReachBottomLoading) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const scrollTop = box.scrollTop;
      obj.onScroll(scrollTop);
    };
    box.addEventListener("scroll", handleScroll, { passive: false });
    return () => {
      box.removeEventListener("scroll", handleScroll);
    };
  }, [obj]);

  return (
    <div
      id="box"
      ref={containerRef}
      style={{
        margin: "0 auto",
        width: 500,
        height: 500,
        overflow: "auto",
        position: "relative",
        border: "1px solid red",
      pointerEvents: obj.isReachBottomLoading ? "none" : "auto",
      }}
    >
      <div style={{ height: obj.getEstimatedHeight() }}>
        {data.slice(obj.startIndex, obj.endIndex + 1).map((item, index) => (
          <div
            key={`${item}-${index}`}
            style={{
              position: "absolute",
              top:
                obj.catchBounds.get(index)?.scrollOffset +
                containerRef.current?.scrollTop,
              height: obj.catchBounds.get(index)?.size,
              textAlign: "center",
              lineHeight: "30px",
              width: "100%",
              borderBottom: "1px solid blue",
              boxSizing: "border-box",
            }}
          >
            {item}
          </div>
        ))}
      </div>
      {obj.isReachBottomLoading && (
        <div
          style={{
            position: "absolute",
            bottom: -Number(containerRef.current?.scrollTop),
            left: "45%",
          }}
        >
          加载中........
        </div>
      )}
      {!hasMore && (
        <div
          style={{
            position: "absolute",
            bottom: -Number(containerRef.current?.scrollTop),
            left: "45%",
          }}
        >
          已经到底啦！！！
        </div>
      )}
    </div>
  );
};
export default Grid;
