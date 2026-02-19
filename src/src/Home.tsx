import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import { ArrowRight } from "lucide-react";
import frist from '../assets/pdf/Fabric_Shades_Collection FOR KIRSTY.pdf'
import frist1 from '../assets/pdf/WoodTech Spectra.pdf'
import catalogPdf from '../assets/pdf/BASICS-E-Catalog (5).pdf'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface StoredData {
  image: string | null;
  pdfFile: string | null;
}

export default function Home() {
  const { id } = useParams<{ id: string }>();
  const [storedData] = useState<StoredData | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [inputPage, setInputPage] = useState<string>("1");
  const [zoom, setZoom] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const bookRef = useRef<any>(null);

  const getPdfById = (bookId: string | undefined) => {
    const numId = parseInt(bookId || "1", 10);
    const index = (numId - 1) % 3;
    if (index === 0) return frist1;
    if (index === 1) return frist;

    return catalogPdf;
  };

  // Priority: 1. Manually uploaded PDF (only if valid in current session), 2. PDF by ID
  // Note: Blobs from localStorage are often dead after refresh.
  const pdfUrl = (storedData?.pdfFile?.startsWith('blob:') ? storedData.pdfFile : null) || getPdfById(id);

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

    const availableHeight = window.innerHeight - 10

    if (windowWidth < 1024) { // Mobile & Tablet
      return {
        width: windowWidth * 0.95,
        height: Math.min(window.innerHeight * 0.4, availableHeight + 50)
      };
    } else if (windowWidth < 1440) {
      const w = Math.min(480, windowWidth * 0.4);
      return {
        width: w,
        height: Math.min(w * 1.4, availableHeight)
      };
    } else { // Large Desktop
      const w = Math.min(600, windowWidth * 0.4);
      return {
        width: w,
        height: Math.min(w * 1.38, availableHeight)
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
    <div className="min-h-screen flex flex-col bg-[#fff7ee] text-[#2C2C2C] font-sans overflow-hidden select-none">
      <Header />

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-b from-[#fff7ee] to-[#fcecd5]">

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

        {!pdfUrl ? (
          <div className="z-10 text-center animate-pulse">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FED6A8]/30 flex items-center justify-center shadow-inner">
              <svg className="w-8 h-8 text-[#8D5B41]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-[#8D5B41] mb-2">No Book Selected</h2>
            <p className="text-gray-500">Please select a book from the catalog</p>
          </div>
        ) : (
          <div className="relative z-10 w-full flex flex-col items-center h-full justify-center">

            {/* Desktop Navigation Arrows (Floating) */}
            {!isMobile && (
              <>
                <button
                  onClick={() => bookRef.current?.pageFlip().flipPrev()}
                  className="absolute left-4 lg:left-12 z-20 p-4 bg-white/50 backdrop-blur-md hover:bg-[#8D5B41] hover:text-white text-[#8D5B41] rounded-full shadow-lg transition-all active:scale-90"
                >
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </button>
                <button
                  onClick={() => bookRef.current?.pageFlip().flipNext()}
                  className="absolute right-4 lg:right-12 z-20 p-4 bg-white/50 backdrop-blur-md hover:bg-[#8D5B41] hover:text-white text-[#8D5B41] rounded-full shadow-lg transition-all active:scale-90"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Book Reader */}
            <div
              className="transition-transform duration-300 ease-out origin-center"
              style={{ transform: `scale(${zoom})` }}
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#8D5B41] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-semibold text-[#8D5B41] uppercase tracking-widest">Opening Catalog...</span>
                  </div>
                }
                error={
                  <div className="text-red-500 p-8 border border-red-200 rounded-3xl bg-white/80 backdrop-blur-sm max-w-md text-center shadow-xl">
                    <h3 className="font-bold text-xl mb-3 font-serif">Oops!</h3>
                    <p className="text-sm text-gray-600">We couldn't open this masterpiece. The file might be corrupted.</p>
                  </div>
                }
              >
                {numPages && (
                  <HTMLFlipBook
                    width={currentWidth}
                    height={currentHeight}
                    size="fixed"
                    minWidth={200}
                    maxWidth={1900}
                    minHeight={300}
                    maxHeight={1600}
                    maxShadowOpacity={0.3}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={onFlip}
                    className="shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
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
                    {/* Pages */}
                    {Array.from({ length: numPages }, (_, index) => (
                      <div key={index} className="page bg-[#fffbf7] flex items-center justify-center">
                        <div className="h-full w-full flex flex-col shadow-[inset_0_0_40px_rgba(0,0,0,0.03)] relative overflow-hidden border-x border-gray-100/50">
                          {/* Page gradient for depth */}
                          <div className={`absolute top-0 bottom-0 w-12 pointer-events-none z-0 ${index % 2 === 0 ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/[0.04] to-transparent`}></div>

                          <div className="flex-1 flex relative z-0">
                            <Page
                              pageNumber={index + 1}
                              width={currentWidth}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              className="object-contain max-h-full max-w-full"
                              loading={
                                <div className="flex items-center justify-center h-full w-full">
                                  <div className="w-8 h-8 border-2 border-[#FED6A8] border-t-[#8D5B41] rounded-full animate-spin"></div>
                                </div>
                              }
                            />
                          </div>

                          {/* Page Footer */}
                          <div className="h-10 md:h-14 flex justify-between items-center px-8 md:px-12 text-[10px] md:text-xs text-[#8D5B41]/40 font-serif border-t border-gray-100/30 uppercase tracking-[0.2em] bg-white/40">
                            <span className="font-bold italic">Heritage Studio</span>
                            <span className="font-bold text-[#8D5B41]/70">{index + 1}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Back Cover */}
                    <div className="page page-cover bg-[#8D5B41] border-l border-[#744933] flex items-center justify-center text-[#FED6A8] shadow-inner">
                      <div className="p-8 m-4 text-center border border-[#FED6A8]/20 h-[95%] w-[92%] flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-2 border-[#FED6A8]/40 rounded-full flex items-center justify-center mb-6">
                          <span className="font-serif text-2xl font-bold italic opacity-60">F</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Heritage Studio & Co.</p>
                      </div>
                    </div>
                  </HTMLFlipBook>
                )}
              </Document>
            </div>

            <div className="">
              {numPages && (
           
                <div className="flex items-center mt-3 gap-3 px-2 py-1 bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_20px_50px_rgba(141,91,65,0.15)] z-50 transition-all hover:bg-white/90 max-w-[95vw]">


                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => bookRef.current?.pageFlip().flipPrev()}
                      className="p-3 hover:bg-[#FED6A8]/50 rounded-full text-[#8D5B41] transition active:scale-95 group"
                      title="Previous"
                    >
                      <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    <div className="h-6 w-px bg-[#8D5B41]/10 mx-1"></div>

                    {/* Page Indicator / Form */}
                    <form onSubmit={goToPage} className="flex items-center gap-3 px-2">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={inputPage}
                          onChange={(e) => setInputPage(e.target.value)}
                          className="w-10 bg-transparent text-center text-base font-black text-[#8D5B41] focus:outline-none"
                        />
                        <span className="text-[#8D5B41]/30 font-serif italic mx-1">of</span>
                        <span className="text-[#8D5B41]/60 text-base font-bold min-w-[20px]">{numPages}</span>
                      </div>
                    </form>

                    <div className="h-6 w-px bg-[#8D5B41]/10 mx-1"></div>

                    <button
                      onClick={() => bookRef.current?.pageFlip().flipNext()}
                      className="p-3 hover:bg-[#FED6A8]/50 rounded-full text-[#8D5B41] transition active:scale-95 group"
                      title="Next"
                    >
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>


                  <div className="hidden sm:flex items-center gap-1 pl-3 border-l border-[#8D5B41]/10 ml-1">
                    <button
                      onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
                      className="p-2.5 text-[#8D5B41]/60 hover:text-[#8D5B41] hover:bg-[#FED6A8]/30 rounded-full transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                    </button>
                    <span className="text-[11px] font-bold text-[#8D5B41]/40 w-12 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
                    <button
                      onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
                      className="p-2.5 text-[#8D5B41]/60 hover:text-[#8D5B41] hover:bg-[#FED6A8]/30 rounded-full transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #fff7ee; }
        ::-webkit-scrollbar-thumb { background: #decab1; border-radius: 10px; border: 2px solid #fff7ee; }
        ::-webkit-scrollbar-thumb:hover { background: #8D5B41; }

        .page {
          box-shadow: 0 0 20px rgba(0,0,0,0.02);
        }
      `}</style>
    </div>

  );
}
