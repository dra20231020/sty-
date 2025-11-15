import { useState, useRef, useEffect, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "";

export function usePdfView(url: string, scale: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<any>(null);
  const [pdfState, setPdfState] = useState<any>({
    currentPage: 1,
    totalNum: 0,
  });
  const [loading, setLoading] = useState(false);

  const renderPdf = useCallback(
    (renderPageNUm: number, callBack: any) => {
      const canvas = canvasRef.current;
      const pdf = pdfRef.current;
      if (!canvas || !pdf) return;
      // 页面渲染
      setLoading(true);
      pdf
        .getPage(renderPageNUm)
        .then((page: any) => {
          const viewport = page.getViewport({ scale });
          const outputScale = window.devicePixelRatio || 1;
          const canvasContext = canvas.getContext("2d");
          if (!canvasContext) return;
          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          page.render({
            canvasContext,
            viewport,
          });
          if (typeof callBack === "function" && callBack) {
            callBack();
          }
          setLoading(false);
        })
        .catch((err: any) => {
          console.error(err);
        });
    },
    [scale]
  );
  useEffect(() => {
    if (!url) {
      return;
    }
    // 判断url是否为pdf文件
    if (url.indexOf(".pdf") === -1) {
      setLoading(false);
      return;
    }
    // 加载pdf文件
    pdfjsLib
      .getDocument({
        url,
      })
      .promise.then((pdf: any) => {
        pdfRef.current = pdf;
        renderPdf(1, setPdfState({ ...pdfState, totalNum: pdf.numPages }));
      });
  }, [url]);

  // 切换页面
  const handlePage = (type: "prev" | "next") => {
    let { currentPage } = pdfState;
    if (type === "prev") {
      currentPage -= 1;
      if (currentPage < 1) return;
    }
    if (type === "next") {
      currentPage += 1;
      if (currentPage > pdfState?.totalNum) return;
    }
    renderPdf(currentPage, setPdfState({ ...pdfState, currentPage }));
  };
  return {
    handlePage,
    pdfState,
    canvasRef,
    loading,
    setPdfState,
  };
}
