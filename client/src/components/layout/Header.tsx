import { Button } from "@/components/ui/button";
import { Search, Globe, User, Menu } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#f8f9fa] border-b border-gray-100 py-1 hidden md:block">
        <div className="container flex justify-between items-center text-xs text-gray-500">
          <div className="flex gap-4">
            <button className="hover:text-[#006C35] transition-colors">عن المملكة</button>
            <button className="hover:text-[#006C35] transition-colors">الجهات</button>
            <button className="hover:text-[#006C35] transition-colors">الخدمات</button>
            <button className="hover:text-[#006C35] transition-colors">المشاركة</button>
            <button className="hover:text-[#006C35] transition-colors">نهتم بكم</button>
            <button className="hover:text-[#006C35] transition-colors">عن المنصة</button>
          </div>
          <div className="flex gap-4 items-center">
            <button className="flex items-center gap-1 hover:text-[#006C35] transition-colors">
              <Globe className="w-3 h-3" />
              English
            </button>
            <button className="flex items-center gap-1 hover:text-[#006C35] transition-colors font-medium">
              <User className="w-3 h-3" />
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold text-[#006C35] tracking-tighter">GOV.SA</span>
              <span className="text-[10px] text-gray-500 -mt-1">المنصة الوطنية الموحدة</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-bold text-gray-800">رؤية المملكة</span>
              <span className="text-xs text-gray-500">2030</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="ابحث عن الخدمات..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:border-[#006C35] focus:ring-1 focus:ring-[#006C35] transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#006C35] transition-colors">الرئيسية</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#006C35] font-medium">الخدمات</span>
          </div>
        </div>
      </div>
    </header>
  );
}
