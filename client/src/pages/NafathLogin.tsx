import { useState } from "react";
import { Eye, EyeOff, Globe, Plus, Minus } from "lucide-react";

export default function NafathLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"app" | "password">("password");

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white py-4 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            {/* Placeholders for logos */}
            <div className="h-12 w-32 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">Nafath Logo</div>
            <div className="h-10 w-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded opacity-80">Vision 2030</div>
          </div>
          <button className="flex items-center gap-2 text-[#1b9c75] hover:text-[#147a5b] transition-colors font-medium text-sm">
            <Globe className="w-5 h-5" />
            <span>English</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center max-w-[1200px]">
        <h1 className="text-[28px] font-bold text-[#1b9c75] mb-10">الدخول على النظام</h1>

        {/* Login Card */}
        <div className="w-full bg-white rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.05)] overflow-hidden">
          
          {/* Accordion Style Tabs */}
          <div className="flex flex-col">
            
            {/* Tab 1: Nafath App */}
            <div className="w-full">
              <button 
                onClick={() => setActiveTab("app")}
                className={`w-full py-4 px-6 flex items-center justify-between font-bold text-lg transition-colors ${
                  activeTab === "app" 
                    ? "bg-[#1b9c75] text-white" 
                    : "bg-[#bfbfbf] text-white hover:bg-[#a6a6a6]"
                }`}
              >
                <span className="flex-1 text-center">تطبيق نفاذ</span>
                {activeTab === "app" ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
              
              {/* Content for Nafath App */}
              {activeTab === "app" && (
                <div className="p-10 md:p-16 flex flex-col md:flex-row gap-16 items-center min-h-[400px] animate-in slide-in-from-top-2 duration-300">
                  <div className="w-full text-center py-8">
                    <p className="text-gray-600 mb-8 font-medium text-lg">الرجاء فتح تطبيق نفاذ على هاتفك والموافقة على الطلب</p>
                    <div className="w-32 h-32 bg-gray-50 rounded-full mx-auto flex items-center justify-center border-4 border-[#1b9c75] text-5xl font-bold text-[#1b9c75]">
                      85
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tab 2: Username & Password */}
            <div className="w-full">
              <button 
                onClick={() => setActiveTab("password")}
                className={`w-full py-4 px-6 flex items-center justify-between font-bold text-lg transition-colors ${
                  activeTab === "password" 
                    ? "bg-[#1b9c75] text-white" 
                    : "bg-[#bfbfbf] text-white hover:bg-[#a6a6a6]"
                }`}
              >
                <span className="flex-1 text-center">اسم المستخدم وكلمة المرور</span>
                {activeTab === "password" ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>

              {/* Content for Username & Password */}
              {activeTab === "password" && (
                <div className="p-10 md:p-16 flex flex-col md:flex-row gap-16 items-start min-h-[400px] animate-in slide-in-from-top-2 duration-300">
                  
                  {/* Left Side: Image/Info (Right in RTL) */}
                  <div className="hidden md:flex flex-col items-center justify-center w-1/2 pt-10">
                    <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-8">
                      Security Image
                    </div>
                    <p className="text-[#777] text-sm leading-relaxed text-center max-w-xs">
                      الرجاء إدخال اسم المستخدم \ الهوية الوطنية وكلمة المرور ثم اضغط تسجيل الدخول
                    </p>
                  </div>

                  {/* Right Side: Form (Left in RTL) */}
                  <div className="w-full md:w-1/2">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="space-y-2">
                        <label className="block text-[#333] font-bold text-sm text-right mb-2">
                          اسم المستخدم \ الهوية الوطنية
                        </label>
                        <input 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-[4px] focus:outline-none focus:border-[#1b9c75] text-right placeholder-gray-300 text-sm"
                          placeholder="اسم المستخدم \ الهوية الوطنية"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[#333] font-bold text-sm text-right mb-2">
                          كلمة المرور
                        </label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-[4px] focus:outline-none focus:border-[#1b9c75] text-right placeholder-gray-300 text-sm"
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
                        className="w-full bg-[#1b9c75] hover:bg-[#147a5b] text-white font-bold py-3 rounded-[4px] transition-colors flex items-center justify-center gap-2 mt-8"
                      >
                        <span>تسجيل الدخول</span>
                        <span className="text-xl">←</span>
                      </button>

                      <div className="flex justify-between text-sm pt-6">
                        <a href="#" className="text-[#1b9c75] hover:underline">
                          حساب جديد
                        </a>
                        <a href="#" className="text-[#1b9c75] hover:underline">
                          إعادة تعيين/تغيير كلمة المرور
                        </a>
                      </div>
                    </form>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* New Platform Banner */}
        <div className="mt-8 w-full bg-[#1b9c75] rounded-lg p-5 text-white flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="mb-4 md:mb-0 text-center md:text-right flex-1">
            <h3 className="font-bold text-xl mb-1">منصة النفاذ الجديدة</h3>
            <p className="opacity-90 text-sm font-light">لتجربة أكثر سهولة استخدم النسخة المحدثة من منصة النفاذ الوطني الموحد</p>
          </div>
          <button className="bg-white text-[#1b9c75] px-8 py-2 rounded-full font-bold hover:bg-gray-50 transition-colors text-sm">
            ابدأ الآن
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-4 text-sm text-[#777]">
            <a href="#" className="hover:text-[#1b9c75]">سياسة الخصوصية</a>
            <a href="#" className="hover:text-[#1b9c75]">شروط الاستخدام</a>
            <a href="#" className="hover:text-[#1b9c75]">الأسئلة الشائعة</a>
            <a href="#" className="hover:text-[#1b9c75]">اتصل بنا</a>
          </div>
          <p className="text-xs text-[#999]">
            جميع الحقوق محفوظة © {new Date().getFullYear()} النفاذ الوطني الموحد
          </p>
        </div>
      </footer>
    </div>
  );
}
