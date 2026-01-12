import { Search, Globe, User, Menu, Eye, ZoomIn, ZoomOut } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="w-full bg-white font-sans">
      {/* Top Government Bar */}
      <div className="bg-[#f8f9fa] border-b border-gray-200 py-2 hidden lg:block">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="https://www.my.gov.sa/wps/contenthandler/dav/fs-type1/themes/GOV_SA_Theme/images/saudi-flag.png" alt="Saudi Flag" className="w-6 h-4 object-cover" />
            <span className="text-xs text-[#006C35] font-bold">موقع حكومي رسمي تابع لحكومة المملكة العربية السعودية</span>
            <a href="#" className="text-xs text-gray-500 underline mr-2">كيف تتحقق؟</a>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
              <button title="Increase Font Size"><ZoomIn className="w-3 h-3" /></button>
              <button title="Decrease Font Size"><ZoomOut className="w-3 h-3" /></button>
              <button title="High Contrast"><Eye className="w-3 h-3" /></button>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#006C35]">عن المملكة</a>
              <a href="#" className="hover:text-[#006C35]">الجهات</a>
              <a href="#" className="hover:text-[#006C35]">الخدمات</a>
              <a href="#" className="hover:text-[#006C35]">المشاركة</a>
              <a href="#" className="hover:text-[#006C35]">نهتم بكم</a>
              <a href="#" className="hover:text-[#006C35]">عن المنصة</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="container py-4 lg:py-6">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-3xl font-bold text-[#006C35] tracking-tighter leading-none">GOV.SA</span>
                <span className="text-[10px] text-[#006C35] font-bold tracking-widest">المنصة الوطنية الموحدة</span>
              </div>
              <div className="w-10 h-10 text-[#006C35]">
                {/* Placeholder for Palm Logo */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
                </svg>
              </div>
            </Link>
            
            <div className="hidden lg:block w-[1px] h-10 bg-gray-200 mx-4"></div>
            
            <div className="hidden lg:block">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 tracking-[0.2em]">VISION</span>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-gray-400">2</span>
                  <span className="text-xl font-bold text-[#006C35]">0</span>
                  <span className="text-xl font-bold text-gray-400">3</span>
                  <span className="text-xl font-bold text-gray-400">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="hidden lg:flex items-center w-full max-w-md relative">
              <input 
                type="text" 
                placeholder="البحث" 
                className="w-full bg-white border border-gray-300 rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:border-[#006C35]"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#006C35]" />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-[#006C35]">
                <Globe className="w-4 h-4" />
                English
              </button>
              <button className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-[#006C35]">
                <User className="w-4 h-4" />
                تسجيل الدخول
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Navigation Bar */}
      <div className="bg-[#006C35] text-white py-3 lg:hidden">
        <div className="container flex justify-between items-center">
          <span className="font-bold">الخدمات</span>
          <Menu className="w-6 h-6" />
        </div>
      </div>
      
      <div className="bg-[#f8f9fa] border-y border-gray-200 py-2 hidden lg:block">
        <div className="container text-xs text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#006C35]">الرئيسية</Link>
          <span>&gt;</span>
          <span className="text-[#006C35] font-bold">الخدمات</span>
        </div>
      </div>
    </header>
  );
}
