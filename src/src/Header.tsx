// import { useState, useEffect, type ChangeEvent } from "react";
import logo from '../assets/image/logo.png'

// interface StoredData {
//   image: string | null;
//   pdfFile: string | null;
// }

// interface HeaderProps {
//   setStoredData: (data: StoredData) => void;
// }

export default function Header() {
  // const [image, setImage] = useState<string | null>(null);
  // const [pdfFile, setPdfFile] = useState<string | null>(null);

  // useEffect(() => {
  //   const savedDataStr = localStorage.getItem("homeData");
  //   if (savedDataStr) {
  //     try {
  //       const savedData: StoredData = JSON.parse(savedDataStr);
  //       setImage(savedData.image);
  //       // Only set PDF if it's not a blob URL, or handle it as session-only
  //       if (savedData.pdfFile && !savedData.pdfFile.startsWith('blob:')) {
  //         setPdfFile(savedData.pdfFile);
  //       } else {
  //         savedData.pdfFile = null;
  //       }
  //       setStoredData(savedData);
  //     } catch (e) {
  //       console.error("Failed to parse stored data", e);
  //     }
  //   }
  // }, [setStoredData]);

  // const saveData = (newImage: string | null, newPdf: string | null) => {
  //   const data: StoredData = {
  //     image: newImage ?? image,
  //     pdfFile: newPdf ?? pdfFile,
  //   };
  //   // Note: Storing blob URLs in localStorage is temporary and will not persist across sessions reliably.
  //   // For a real app, consider using IndexedDB or re-uploading on session start.
  //   localStorage.setItem("homeData", JSON.stringify(data));
  //   setStoredData(data);
  // };

  // const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const imgUrl = URL.createObjectURL(file);
  //     setImage(imgUrl);
  //     saveData(imgUrl, null);
  //   }
  // };

  // const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file && file.type === "application/pdf") {
  //     const pdfUrl = URL.createObjectURL(file);
  //     setPdfFile(pdfUrl);
  //     saveData(null, pdfUrl);
  //   } else {
  //     alert("Please upload a valid PDF");
  //   }
  // };

  return (
    <header className="w-full bg-[#FED6A8] ">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="">
          <img src={logo} alt=""
           className="h-20 md:h-15 lg:h-20 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-6">

          {/* PDF Upload Button */}
          {/* <label className="group relative bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 overflow-hidden">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <span className="relative z-10 font-medium text-sm">Upload Book</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="hidden"
            />
          </label> */}

          {/* Profile Image */}
          {/* <label className="cursor-pointer relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
            <img
              src={
                image
                  ? image
                  : "https://ui-avatars.com/api/?name=Reader&background=1e1b4b&color=c7d2fe"
              }
              alt="Profile"
              className="relative w-10 h-10 rounded-full border-2 border-gray-900 object-cover transition-transform group-hover:scale-105"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label> */}

        </div>
      </div>
    </header>
  );
}
