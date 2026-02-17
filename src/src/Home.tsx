import { useState, useRef, useEffect, useCallback } from "react";
import Header from "./Header";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface StoredData {
  image: string | null;
  pdfFile: string | null;
}

export default function Home() {
  const [storedData, setStoredData] = useState<StoredData | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [inputPage, setInputPage] = useState<string>("1");
  const [zoom, setZoom] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const bookRef = useRef<any>(null);

  // Sample PDF (fallback)
  // const samplePdf = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";
  const pdfUrl = storedData?.pdfFile

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!bookRef.current || !pdfUrl) return;
      if (e.key === "ArrowRight") bookRef.current.pageFlip().flipNext();
      if (e.key === "ArrowLeft") bookRef.current.pageFlip().flipPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pdfUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setCurrentPage(0);
    setInputPage("1");
  }

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  // Sync input with current page
  useEffect(() => {
    setInputPage((currentPage + 1).toString());
  }, [currentPage]);

  const goToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage, 10);
    if (bookRef.current && numPages && pageNum >= 1 && pageNum <= numPages + 2) {
      // Validating page range (including covers)
      bookRef.current.pageFlip().flip(pageNum - 1);
    }
  };

  // Dynamic Dimensions
  // Mobile/Tablet (< 1024px): Single page (Portrait)
  // Laptop (1024px - 1440px): Double page (Landscape)
  // Desktop (> 1440px): Double page (Landscape) (Larger)
  const getDimensions = () => {
    if (windowWidth < 1024) { // Mobile & Tablet
      return {
        width: windowWidth * 0.9,
        height: window.innerHeight * 0.75
      };
    } else if (windowWidth < 1440) { // Laptop
      return {
        width: 450, // Total width 900px
        height: 650
      };
    } else { // Desktop
      return {
        width: 580, // Total width 1160px
        height: 780
      };
    }
  };

  const { width: baseWidth, height: baseHeight } = getDimensions();
  const currentWidth = baseWidth * zoom;
  const currentHeight = baseHeight * zoom;

  // Re-calculate dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] text-gray-100 font-sans overflow-hidden select-none">
      <Header setStoredData={setStoredData} />

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

        {!pdfUrl ? (
          <div className="z-10 text-center animate-pulse">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Book Selected</h2>
            <p className="text-gray-400">Please upload a PDF to start reading</p>
          </div>
        ) : (
          <div className="relative z-10 w-full flex flex-col items-center h-full justify-center">

            {/* Book Reader */}
            <div
              className="shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out origin-center"
              style={{ transform: `scale(${zoom})` }}
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-indigo-300 uppercase tracking-widest">Loading Library...</span>
                  </div>
                }
                error={
                  <div className="text-red-400 p-6 border border-red-900/50 rounded-lg bg-red-900/10 backdrop-blur-sm max-w-md text-center">
                    <h3 className="font-bold mb-2">Error Loading Document</h3>
                    <p className="text-sm opacity-80">The PDF file could not be loaded. It might be corrupted or protected.</p>
                  </div>
                }
              >
                {numPages && (
                  <HTMLFlipBook
                    width={currentWidth}
                    height={currentHeight}
                    size="fixed"
                    minWidth={200}
                    maxWidth={1000}
                    minHeight={300}
                    maxHeight={1400}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={onFlip}
                    className="shadow-2xl"
                    flippingTime={1000}
                    usePortrait={isMobile}
                    startZIndex={0}
                    autoSize={true}
                    clickEventForward={true}
                    useMouseEvents={true}
                    swipeDistance={30}
                    showPageCorners={!isMobile}
                    disableFlipByClick={false}
                    startPage={0}
                    drawShadow={true}
                    ref={bookRef}
                    style={{ margin: "auto" }}
                  >
                    {/* Front Cover */}
                    <div className="page page-cover bg-[#1e293b] border-r border-gray-700 flex items-center justify-center text-gray-300 shadow-inner group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="text-center p-8 border border-gray-600 m-3 h-[96%] w-[94%] flex flex-col justify-between bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                        </div>

                        <div className="mt-20">
                          <h1 className="text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 to-indigo-400 mb-4 font-bold tracking-tight loading-none">DOC<br />READER</h1>
                          <div className="h-0.5 w-16 bg-indigo-500 mx-auto"></div>
                        </div>

                        <div className="mb-10 text-center">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-300/60 mb-1">Interactive Viewer</p>
                          <p className="font-serif italic text-gray-500">Premium Edition</p>
                        </div>
                      </div>
                    </div>

                    {/* Pages */}
                    {Array.from({ length: numPages }, (_, index) => (
                      <div key={index} className="page bg-[#fffbf7] flex items-center justify-center">
                        <div className="h-full w-full flex flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] relative overflow-hidden">
                          {/* Page gradient for depth */}
                          <div className={`absolute top-0 bottom-0 w-8 pointer-events-none z-10 ${index % 2 === 0 ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/5 to-transparent`}></div>

                          <div className="flex-1 flex relative  z-0">
                            <Page
                              pageNumber={index + 1}
                              width={currentWidth}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              className="object-contain max-h-full max-w-full shadow-sm"
                              loading={
                                <div className="flex items-center justify-center h-full w-full">
                                  <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                                </div>
                              }
                            />
                          </div>

                          {/* Page Footer */}
                          <div className="h-8 md:h-12 flex justify-between items-center px-6 md:px-10 text-[10px] md:text-xs text-gray-400 font-serif border-t border-gray-100/50 uppercase tracking-widest bg-white/50">
                            <span>Chapter {Math.ceil((index + 1) / 10)}</span>
                            <span className="font-bold text-gray-500">{index + 1}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Back Cover */}
                    <div className="page page-cover bg-[#1e293b] border-l border-gray-700 flex items-center justify-center text-gray-300 shadow-inner">
                      <div className="p-8 m-4 text-center opacity-40">
                        <div className="w-12 h-12 border border-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="font-serif text-lg">Fin</span>
                        </div>
                      </div>
                    </div>
                  </HTMLFlipBook>
                )}
              </Document>
            </div>

            {/* Floating Control Bar */}
            {numPages && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 md:gap-4 px-2 md:px-6 py-2 md:py-3 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl z-50 transition-all hover:bg-gray-900 max-w-[95vw] md:max-w-none">

                {/* Prev */}
                <button
                  onClick={() => bookRef.current?.pageFlip().flipPrev()}
                  className="p-2 md:p-3 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition active:scale-95 group"
                  title="Previous Page"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>

                <div className="h-6 w-px bg-white/10 mx-1 md:mx-2 hidden md:block"></div>

                {/* Page Input */}
                <form onSubmit={goToPage} className="flex items-center gap-2 md:gap-4 px-2">
                  <div className="flex items-center relative">
                    <span className="text-gray-500 text-[10px] md:text-xs absolute -top-3 left-0 w-full text-center font-mono">PAGE</span>
                    <input
                      type="text"
                      value={inputPage}
                      onChange={(e) => setInputPage(e.target.value)}
                      className="w-8 md:w-12 bg-transparent text-center text-sm md:text-base font-bold text-white focus:outline-none focus:text-indigo-400 transition-colors"
                    />
                  </div>
                  <span className="text-gray-600 text-sm md:text-base font-light">/</span>
                  <span className="text-gray-400 text-sm md:text-base font-medium">{numPages}</span>
                </form>

                <div className="h-6 w-px bg-white/10 mx-1 md:mx-2 hidden md:block"></div>

                {/* Next */}
                <button
                  onClick={() => bookRef.current?.pageFlip().flipNext()}
                  className="p-2 md:p-3 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition active:scale-95 group"
                  title="Next Page"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>

                {/* Zoom Controls (Desktop only) */}
                <div className="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-white/10">
                  <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition" title="Zoom Out">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                  </button>
                  <span className="text-xs font-mono text-gray-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition" title="Zoom In">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>
    </div>
  );
}
