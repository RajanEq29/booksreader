import { ArrowRight, X, User, FileText, Phone, MessageSquare } from 'lucide-react';
import thiad from '../../assets/image/thiad.jpeg'
import sec from '../../assets/image/sec.png'
import chair1 from '../../assets/image/first.png'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/image/Group 1171282670.png'
import { useState, useEffect } from 'react';

export default function FurnitureHeritageUI() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    content: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const submitted = localStorage.getItem('book_form_submitted');
    if (submitted === 'true') {
      setIsSubmitted(true);
    }
  }, []);

  const handleCardClick = (id: number) => {
    if (isSubmitted) {
      navigate(`/home/${id}`);
    } else {
      setSelectedId(id);
      setShowForm(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please fill in the required fields.");
      return;
    }

    // Save to localStorage
    localStorage.setItem('book_form_submitted', 'true');
    localStorage.setItem('book_user_data', JSON.stringify(formData));
    setIsSubmitted(true);
    setShowForm(false);

    if (selectedId) {
      navigate(`/home/${selectedId}`);
    }
  };

  const books = [
    { id: 1, title: "Living Rooms", image: chair1, description: "Masterpieces of modern comfort." },
    { id: 2, title: "Chairs", image: sec, description: "Minimalist designs for every space." },
    { id: 3, title: "Living Rooms", image: thiad, description: "Timeless heritage in every thread." },
    { id: 4, title: "Living Rooms", image: chair1, description: "Masterpieces of modern comfort." },
    { id: 5, title: "Chairs", image: sec, description: "Minimalist designs for every space." },
    { id: 6, title: "Living Rooms", image: thiad, description: "Timeless heritage in every thread." },
    { id: 7, title: "Living Rooms", image: chair1, description: "Masterpieces of modern comfort." },
    { id: 8, title: "Chairs", image: sec, description: "Minimalist designs for every space." },
    { id: 9, title: "Living Rooms", image: thiad, description: "Timeless heritage in every thread." },
  ];

  return (
    <div className="min-h-screen w-full bg-white font-sans text-[#2C2C2C] overflow-x-hidden">
      {/* Hero Section with Peach Background */}
      <div className="w-full bg-[#FED6A8] pb-60 pt-6 md:pt-10 h-auto min-h-[50vh] md:min-h-[75vh] rounded-b-[35px] md:rounded-b-[40px] relative">
        <nav className="max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-3 items-center px-6 md:px-8 py-4">
          {/* Logo Container */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className=" p-2.5 ">
              <img src={logo} alt="" />
            </div>

          </div>

          {/* Desktop Navigation */}
          {/* <div className="hidden md:flex justify-center items-center gap-12 text-sm font-medium text-[#2C2C2C]">
            <a href="#" className="hover:text-[#8D5B41] transition-colors">Home</a>
            <a href="#" className="hover:text-[#8D5B41] transition-colors">Books</a>
            <a href="#" className="hover:text-[#8D5B41] transition-colors">About</a>
          </div> */}

          {/* Login Button */}
          {/* <div className="flex justify-end">
            <button className="bg-[#8D5B41] text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-sm font-semibold hover:bg-[#744933] transition-all shadow-md active:scale-95">
              Login
            </button>
          </div> */}
        </nav>

        {/* Hero Text */}
        <section className="max-w-6xl mx-auto w-full px-6 pt-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 text-[#1A1A1A] tracking-tight leading-[1.1]">
            Masterpiece  Craftsmanship
            {/* <br className="hidden md:block" /> */}
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#2C2C2C]/70 leading-relaxed font-normal px-4">
            Browse our heritage collection. Each book is a curated journey through physical catalogs designed for timeless spaces.
          </p>
        </section>
      </div>

      {/* Grid Section - Responsive Overlap */}
      <section className="relative w-full -mt-50 md:-mt-79 lg:-mt-90 z-10">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-20">
            {books.map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer flex flex-col w-full"
                onClick={() => handleCardClick(item.id)}
              >
                {/* Book Cover Container with fixed aspect ratio */}
                <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-[24px] md:rounded-[32px] flex items-center justify-center transition-all duration-500 bg-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:shadow-[0_40px_80px_rgba(141,91,65,0.25)] group-hover:-translate-y-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Subtle paper texture overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                </div>

                {/* Details Container */}
                <div className="mt-6 md:mt-8 px-2 md:px-1">
                  <div className="flex justify-between items-center border-b border-transparent group-hover:border-gray-200 pb-2 transition-all">
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1A1A1A]">
                      {item.title}
                    </h3>
                    <div className="bg-[#8D5B41]/0 group-hover:bg-[#8D5B41]/10 p-2 rounded-full transition-all">
                      <ArrowRight className="w-5 h-5 text-[#2C2C2C]/40 group-hover:text-[#8D5B41] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  <p className="text-sm md:text-[15px] text-gray-400 font-medium mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-[#F3EBE3] py-16 md:py-24 flex flex-col items-center rounded-t-[35px] md:rounded-t-[40px]">
        {/* Footer Logo */}
        <div className="flex flex-col items-center mb-12">

          <div className=" p-2.5 ">
            <img src={logo} alt="" />
          </div>


        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-24 text-[13px] font-semibold text-[#2C2C2C]/60">
          <a href="#" className="hover:text-[#8D5B41] transition-colors tracking-wide underline-offset-4 hover:underline">About</a>
          <a href="#" className="hover:text-[#8D5B41] transition-colors tracking-wide underline-offset-4 hover:underline">Contact</a>
          <a href="#" className="hover:text-[#8D5B41] transition-colors tracking-wide underline-offset-4 hover:underline">Privacy Policy</a>
        </div>

        <div className="mt-16 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          © Heritage furniture brand. all right reserved.
        </div>
      </footer>

      {/* Modern Lead Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop with sophisticated blur */}
          <div
            className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-md animate-backdrop-in"
            onClick={() => setShowForm(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.25)] overflow-hidden animate-modal-in">
            {/* Header with Peach Background */}
            <div className="bg-[#FED6A8] p-8 md:p-10 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 p-2 bg-white/50 hover:bg-white rounded-full transition-colors active:scale-90"
              >
                <X className="w-5 h-5 text-[#8D5B41]" />
              </button>

              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <FileText className="w-8 h-8 text-[#8D5B41]" />
              </div>

              <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-3">
                Unlock Heritage Catalog
              </h2>
              <p className="text-[#2C2C2C]/70 text-sm leading-relaxed max-w-xs">
                Please provide your details to view our curated collection and masterpieces.
              </p>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-8 md:p-10 bg-white space-y-5">
              <div className="space-y-4">
                {/* Name Field */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#8D5B41] text-[#2C2C2C]/30">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FED6A8] focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                  />
                </div>

                {/* Mobile Number Field */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#8D5B41] text-[#2C2C2C]/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FED6A8] focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                  />
                </div>

                {/* Content Field (Ambiguous - as requested) */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#8D5B41] text-[#2C2C2C]/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Content / Subject"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FED6A8] focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                  />
                </div>

                {/* Message Field */}
                <div className="relative group">
                  <div className="absolute left-4 top-5 transition-colors group-focus-within:text-[#8D5B41] text-[#2C2C2C]/30">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <textarea
                    placeholder="Message (Optional)"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FED6A8] focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8D5B41] hover:bg-[#744933] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-[#8D5B41]/20 mt-4 group"
              >
                Access Catalog
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}