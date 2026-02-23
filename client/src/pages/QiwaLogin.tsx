import { Button } from "@/components/ui/button";
import { Loader2, Monitor, FileText, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { updatePage, clientNavigate } from "@/lib/store";

export default function QiwaLogin() {
  useEffect(() => {
    updatePage("صفحة قوى - تسجيل الدخول");
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isLinkLoading, setIsLinkLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const serviceName = searchParams.get('service');
      clientNavigate(serviceName ? `/nafath-login?service=${encodeURIComponent(serviceName)}` : "/nafath-login");
    }, 3000);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLinkLoading(true);
    setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const serviceName = searchParams.get('service');
      clientNavigate(serviceName ? `/update-info?service=${encodeURIComponent(serviceName)}` : "/update-info");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-row font-sans" dir="rtl">
      {/* Left Side - Login Card */}
      <div className="w-full lg:w-1/2 bg-[#f8f9fa] flex flex-col min-h-screen">
        {/* Header with Logo and Language */}
        <div className="flex justify-between items-center p-6 pb-0">
          <img src="/images/qiwa-logo.png" alt="قوى" className="h-14 object-contain" />
          <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
              <path d="M2 12h20"/>
            </svg>
            <span className="text-sm font-medium">AR</span>
          </div>
        </div>

        {/* Card Content - Same as Business Center Login */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
          <div className="bg-white rounded-[20px] shadow-lg w-full max-w-[700px] p-8 pb-16 text-center">
            <h1 className="text-[30px] font-bold text-[#35363a] mb-[1.5rem]">تسجيل دخول</h1>
            
            <p className="text-[#3b3b3b] text-[18px] mb-[32px] font-normal leading-[32px]">
              للمواطن السعودي أو المقيم الذي يحمل إقامة سعودية
            </p>
            
            <div className="flex justify-center mb-[40px]">
              <img src="/images/nafath-logo.png" alt="Nafath" className="h-[90px] object-contain" />
            </div>
            

            
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-[#716da5] hover:bg-[#5a5684] text-white text-[16px] font-bold rounded-[7px] mb-[15px] transition-colors shadow-none h-[50px] border-[3px] border-[#716da5] flex items-center justify-center gap-2 relative disabled:opacity-70"
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 style={{ width: '42px', height: '42px' }} className="animate-spin" strokeWidth={2} />
                </div>
              ) : (
                "الدخول بواسطة النفاذ الوطني الموحد"
              )}
            </button>
            
            <div className="text-center mt-[15px]">
              <span className="text-[15px] text-[#3b3b3b]">ليس لديك حساب على قوى؟ </span>
              {isLinkLoading ? (
                <span className="inline-flex items-center gap-1 text-[15px] font-bold text-[#0066ff]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري التحميل...
                </span>
              ) : (
                <a href="/update-info" onClick={handleLinkClick} className="text-[15px] font-bold text-[#0066ff] hover:underline cursor-pointer">سجّل الآن</a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section with Background Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <img 
          src="/images/qiwa-bg2.jpg" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* Dark Blue Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2744]/30 via-[#1a2744]/50 to-[#0f1a2e]/90"></div>
        
        {/* Content - positioned at bottom */}
        <div className="relative z-10 flex flex-col justify-end px-12 py-16 text-white h-full">
          <h2 className="text-[28px] font-bold leading-[1.6] mb-10">
            تعامل بسهولة ومرونة مع متطلبات<br />
            <span className="text-[#4da8ff]">العمل و التوظيف</span>
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Monitor className="w-5 h-5 text-white/90" />
              </div>
              <p className="text-white/90 text-[15px] leading-relaxed">متوافق وسهل الاستخدام على الهواتف والأجهزة المكتبية</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white/90" />
              </div>
              <p className="text-white/90 text-[15px] leading-relaxed">تعامل سهل مع المعاملات الرسمية إلكترونياً</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-5 h-5 text-white/90" />
              </div>
              <p className="text-white/90 text-[15px] leading-relaxed">احصل على جميع مستنداتك بصورة رقمية</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
