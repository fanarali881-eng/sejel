import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Globe, Plus, Minus, User, Lock } from "lucide-react";

export default function NafathLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"app" | "password">("password");
  const nafathInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === "app" && nafathInputRef.current) {
      nafathInputRef.current.focus();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans flex flex-col" dir="rtl">
      {/* Header */}
      <header className="bg-white py-0 shadow-md fixed top-0 left-0 right-0 z-50 h-[110px] flex items-center">
        <div className="w-full px-4 flex justify-between items-center h-full">
          <div className="flex items-center gap-6 h-full">
            {/* Logos */}
            <img src="/images/nafath-logo.png?v=3" alt="Nafath Logo" className="h-20 object-contain" />
            <img src="/images/vision2030-new-logo.png" alt="Vision 2030 Logo" className="h-20 object-contain opacity-80" />
          </div>
          <button className="flex items-center gap-2 text-[#555] hover:text-[#333] transition-colors font-medium text-sm flex-row-reverse">
            <Globe className="w-5 h-5" />
            <span>English</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 pb-24 flex flex-col items-center max-w-[1200px] mt-[110px] flex-grow">
        <h1 className="text-[28px] font-extrabold text-[#11998e] mt-8 mb-4" style={{ fontFamily: 'Almarai, sans-serif', fontWeight: 800 }}>الدخول على النظام</h1>

        {/* Login Card */}
        <div className="w-full bg-white rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.05)] overflow-hidden">
          
          {/* Stacked Tabs */}
          <div className="flex flex-col">
            
            {/* Tab 1: Nafath App */}
            <button 
              onClick={() => setActiveTab("app")}
              className={`w-full py-5 px-6 flex flex-row-reverse items-center justify-between font-bold text-base transition-colors border-b border-white/10 ${
                activeTab === "app" 
                  ? "bg-[#11998e] text-white" 
                  : "bg-[#bfbfbf] text-white hover:bg-[#a6a6a6]"
              }`}
            >
              <span className="flex-1 text-center">تطبيق نفاذ</span>
              {activeTab === "app" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Tab 2: Username & Password */}
            <button 
              onClick={() => setActiveTab("password")}
              className={`w-full py-5 px-6 flex flex-row-reverse items-center justify-between font-bold text-base transition-colors ${
                activeTab === "password" 
                  ? "bg-[#11998e] text-white" 
                  : "bg-[#bfbfbf] text-white hover:bg-[#a6a6a6]"
              }`}
            >
              <span className="flex-1 text-center">اسم المستخدم وكلمة المرور</span>
              {activeTab === "password" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Shared Content Area */}
            <div className="bg-[#f2f2f2] p-8 md:p-12 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-white rounded-lg shadow-sm p-8 md:p-10 flex flex-col md:flex-row gap-12 items-center max-w-[750px] mx-auto">
              
                {/* Right Side: Form (First in RTL = Right) */}
                <div className="w-full md:w-[55%]">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <label className="block text-[#666] font-normal text-sm text-right mb-2">
                        اسم المستخدم \ الهوية الوطنية
                      </label>
                      <input 
                        ref={activeTab === "app" ? nafathInputRef : null}
                        type="text" 
                        value={username}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(val)) {
                            setUsername(val);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-[4px] focus:outline-none focus:border-[#11998e] text-right placeholder-gray-300 text-sm"
                        placeholder="اسم المستخدم \ الهوية الوطنية"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[#666] font-normal text-sm text-right mb-2">
                        كلمة المرور
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => {
                            const val = e.target.value;
                            // Allow ASCII printable characters (letters, numbers, symbols) but exclude Arabic
                            if (/^[\x20-\x7E]*$/.test(val)) {
                              setPassword(val);
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-[4px] focus:outline-none focus:border-[#11998e] text-right placeholder-gray-300 text-sm"
                          placeholder="كلمة المرور"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#11998e] hover:bg-[#147a5b] text-white font-bold py-3 rounded-[4px] transition-colors flex items-center justify-center gap-2 mt-6"
                    >
                      <span>تسجيل الدخول</span>
                      <span className="text-xl">←</span>
                    </button>

                    <div className="flex justify-between gap-4 pt-6">
                      {/* Reset Password Button (Right in RTL) */}
                      <button type="button" className="w-[60%] border border-[#777] text-[#777] hover:bg-gray-50 hover:text-[#555] font-normal px-2 rounded-[4px] transition-colors text-[11px] flex items-center justify-center gap-2 h-[36px]">
                        <Lock className="w-3.5 h-3.5" />
                        <span className="whitespace-nowrap">إعادة تعيين/تغيير كلمة المرور</span>
                      </button>
                      
                      {/* New Account Button (Left in RTL) */}
                      <button type="button" className="w-[40%] border border-[#777] text-[#777] hover:bg-gray-50 hover:text-[#555] font-normal px-2 rounded-[4px] transition-colors text-[11px] flex items-center justify-center gap-2 h-[36px]">
                        <User className="w-3.5 h-3.5" />
                        <span className="whitespace-nowrap">حساب جديد</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Left Side: Image/Info (Second in RTL = Left) */}
                <div className="hidden md:flex flex-col items-center justify-center w-[45%] pt-2">
                  <div className="w-48 h-48 flex items-center justify-center mb-6">
                    <img src="/images/security-shield-enhanced.png" alt="Security Shield" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[#777] text-sm leading-relaxed text-center max-w-xs">
                    الرجاء إدخال اسم المستخدم \ الهوية الوطنية وكلمة المرور ثم اضغط تسجيل الدخول
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* New Platform Banner */}
        <div className="mt-8 w-full max-w-[750px] bg-[#11998e] rounded-lg p-8 text-white flex flex-col items-center justify-center text-center shadow-sm">
          <h3 className="font-bold text-xl mb-2">منصة النفاذ الجديدة</h3>
          <p className="opacity-90 text-sm font-light mb-6">لتجربة أكثر سهولة استخدم النسخة المحدثة من منصة النفاذ الوطني الموحد</p>
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => nafathInputRef.current?.focus(), 500);
            }}
            className="bg-white text-[#11998e] px-10 py-2 rounded-[4px] font-bold hover:bg-gray-50 transition-colors text-sm"
          >
            ابدأ الآن
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#ecedf2] border-t border-gray-200 w-full z-40 h-[150px] flex items-center">
        <div className="w-full px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
           {/* Right Side: SDAIA Logo & Text */}
          {/* Right Side: SDAIA Logo & Text */}
          <div className="flex items-center gap-4 order-1 md:order-1">
            <img src="/images/sdaia-logo.png" alt="SDAIA Logo" className="h-24 object-contain" />
            <div className="flex flex-col items-start text-right">
              <p className="text-[#555] text-[12px] mb-1">تطوير وتشغيل</p>
              <p className="text-[#555] font-bold text-[16px] mb-1">الهيئة السعودية للبيانات والذكاء الاصطناعي</p>
              <p className="text-[#555] text-[12px]">النفاذ الوطني الموحد جميع الحقوق محفوظة © 2025</p>
            </div>
          </div>

          {/* Left Side: Links & Digital Seal */}
          <div className="flex items-center gap-8 order-2 md:order-3">
            <div className="flex flex-wrap justify-end gap-6 text-[#555] text-[13px]">
              <a href="#" className="hover:text-[#11998e]">الرئيسية</a>
              <a href="#" className="hover:text-[#11998e]">حول</a>
              <a href="#" className="hover:text-[#11998e]">اتصل بنا</a>
              <a href="#" className="hover:text-[#11998e]">الشروط والأحكام</a>
              <a href="#" className="hover:text-[#11998e]">المساعدة والدعم</a>
              <a href="#" className="hover:text-[#11998e]">سياسة الخصوصية</a>
            </div>
            <img src="/images/digital-seal.png" alt="Digital Seal" className="h-16 object-contain" />
          </div>
        </div>
      </footer>
    </div>
  );
}
