import { Button } from "@/components/ui/button";
import { Share2, Heart, PlayCircle } from "lucide-react";

export default function ServiceHero() {
  return (
    <section className="bg-white py-8 md:py-10 border-b border-gray-200">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Right Side: Title & Description */}
          <div className="flex-1 max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#e6f2ff] text-[#0066cc] text-[10px] px-2 py-1 rounded font-bold">وزارة التجارة</span>
              <span className="bg-[#e6f7ee] text-[#006C35] text-[10px] px-2 py-1 rounded font-bold">الاكثر استخداما</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-[#006C35] mb-4">
              قيد سجل تجاري لمؤسسة فردية
            </h1>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-3xl">
              خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين البدء في مُمارسة النشاط التجاري، دون الحاجة إلى زيارة مراكز الخدمة.
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <a href="#" className="text-[#006C35] text-xs font-bold hover:underline flex items-center gap-1">
                اتفاقية مستوى الخدمة
              </a>
              
              <div className="flex gap-2 mr-auto md:mr-0">
                <Button variant="outline" className="h-9 px-3 text-xs border-gray-300 text-gray-600 hover:bg-gray-50 gap-1 rounded">
                  <Heart className="w-3 h-3" />
                  تفضيل الصفحة
                </Button>
                <Button className="h-9 px-6 text-xs bg-[#006C35] hover:bg-[#005a2b] text-white rounded font-bold">
                  ابدأ الخدمة
                </Button>
              </div>
            </div>
          </div>
          
          {/* Left Side: Share & Video (Hidden on mobile usually, but kept for layout match) */}
          <div className="hidden md:flex flex-col items-end gap-4">
            <div className="flex gap-2">
               {/* Social Share Icons - Small Squares */}
               <button className="w-8 h-8 bg-[#1DA1F2] text-white rounded flex items-center justify-center"><Share2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
