import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  return (
    <div className="min-h-screen relative flex flex-col font-sans" dir="rtl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/login-bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2b1e4d]/90 mix-blend-multiply"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-between items-start">
        <div className="flex items-center gap-2 text-white">
          <img src="/images/sbc-logo-white.png" alt="Saudi Business Center" className="h-16 object-contain" />
        </div>
        
        <div className="flex items-center gap-2 text-white cursor-pointer hover:text-gray-200 transition-colors">
          <span className="font-bold text-lg">English</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
            <path d="M2 12h20"/>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-[20px] shadow-lg w-full max-w-[760px] p-8 text-center">
          <h1 className="text-[40px] font-bold text-black mb-[30px]">تسجيل دخول</h1>
          
          <p className="text-black text-[19.2px] mb-[30px] font-bold">
            للمواطن السعودي أو المقيم الذي يحمل إقامة سعودية
          </p>
          
          <div className="flex justify-center mb-[30px]">
            <img src="/images/nafath-logo.png" alt="Nafath" className="h-[140px] object-contain" />
          </div>
          
          <p className="text-[#212529] text-[16px] mb-[44px] leading-[26px] max-w-full mx-auto font-normal">
            يمكن الدخول عن طريق "أبشر" من خلال بوابة النفاذ الوطني الموحد لكي تستفيد من الخدمات الإلكترونيه المقدمة من المركز السعودي للأعمال
          </p>
          
          <Button className="w-full bg-[#793699] hover:bg-[#4c2260] text-white text-[19.2px] font-bold py-[18px] rounded-[5px] mb-6 transition-colors shadow-none">
            الدخول بواسطة النفاذ الوطني الموحد
          </Button>
          
          <div className="bg-[#f8f9fa] rounded-md p-4 flex items-start gap-3 text-right border border-gray-100">
            <Info className="w-5 h-5 text-[#5d5a88] mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              للمستثمرين الذين لا يحملون هوية أو إقامة سعودية الرجاء <a href="#" className="text-[#198754] font-bold hover:underline decoration-2 underline-offset-4">الضغط هنا</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full p-8 flex justify-center items-center">
        <div className="flex items-center gap-4">
          <span className="text-white text-sm font-medium opacity-90">تطوير الهيئة السعودية للبيانات والذكاء الاصطناعي</span>
          <div className="h-8 w-[1px] bg-white/30 mx-2"></div>
          <img src="/images/sdaia-logo.png" alt="SDAIA" className="h-12 object-contain brightness-0 invert opacity-90" />
        </div>
      </footer>
    </div>
  );
}
