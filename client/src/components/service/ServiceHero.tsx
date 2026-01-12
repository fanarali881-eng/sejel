import { Button } from "@/components/ui/button";
import { Share2, Heart, PlayCircle } from "lucide-react";

export default function ServiceHero() {
  return (
    <section className="bg-white py-8 md:py-12 border-b border-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#006C35" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium">وزارة التجارة</span>
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md font-medium">الأكثر استخداماً</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              قيد سجل تجاري لمؤسسة فردية
            </h1>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl">
              خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين البدء في مُمارسة النشاط التجاري، دون الحاجة إلى زيارة مراكز الخدمة.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="saudi" size="lg" className="text-base px-8">
                ابدأ الخدمة
              </Button>
              <Button variant="outline" className="gap-2">
                <Heart className="w-4 h-4" />
                تفضيل الصفحة
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                مشاركة
              </Button>
              <Button variant="ghost" className="text-[#006C35] hover:text-[#005a2b] hover:bg-green-50 gap-2">
                اتفاقية مستوى الخدمة
              </Button>
            </div>
          </div>
          
          {/* Video Placeholder / Visual Element */}
          <div className="hidden lg:block w-80 h-48 bg-gray-100 rounded-xl overflow-hidden relative shadow-sm border border-gray-200 group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
              <PlayCircle className="w-12 h-12 text-[#006C35] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            </div>
            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-white text-sm font-medium">فيديو تعريفي بالخدمة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
