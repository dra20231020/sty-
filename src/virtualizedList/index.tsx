import React, { useRef, useEffect, useCallback } from "react";
import { useVirtualizer } from "../hooks/useVirtualizer";
const Grid = () => {
  const data = Array.from({ length: 1000 }, (_, index) => `条目 ${index}`);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleResize = useCallback(
    (size: { height: number; width: number }) => {
      if (!containerRef.current) return;
      containerRef.current.style.height = `${size.height}px`;
    },
    [containerRef]
  );
  const obj = useVirtualizer({
    containerEle: containerRef.current,
    itemCount: data.length,
    direction: "vertical",
    defaultContainerSize: 800,
    itemSize: 30,
    estimatedItemSize: 50,
    overScanCount: 2,
    onResize: handleResize,
  });
  useEffect(() => {
    const box = document.getElementById("box");
    if (!box) return;
    const handleScroll = () => {
      const scrollTop = box.scrollTop;
      obj.onScroll(scrollTop);
    };
    box.addEventListener("scroll", handleScroll);
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
        height: 600,
        overflow: "auto",
        position: "relative",
        border: "1px solid red",
      }}
    >
      <div style={{ height: obj.getEstimatedHeight() }} />
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
            lineHeight:'30px',
            width: "100%",
            borderBottom: "1px solid blue",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
export default Grid;
