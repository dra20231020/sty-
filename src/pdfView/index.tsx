import React from "react";
import { usePdfView } from "../hooks/usePdfView";

export const PdfView = () => {
  const { canvasRef } = usePdfView("../public/testPdf.pdf", 1);
  console.log(canvasRef.current,1);
  
  return (
    <div>
      <h1>PDF预览</h1>
      <canvas ref={canvasRef} />
    </div>
  );
};
export default PdfView;
