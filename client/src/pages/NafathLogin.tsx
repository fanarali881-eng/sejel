import { useState } from "react";
import { Link } from "wouter";
import { Eye, EyeOff, Globe } from "lucide-react";

export default function NafathLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"app" | "password">("password");

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="https://www.iam.gov.sa/authservice/resources/common/images/logo_ar.png" 
              alt="Nafath Logo" 
              className="h-12"
            />
            <img 
              src="https://www.iam.gov.sa/authservice/resources/common/images/vision_2030.png" 
              alt="Vision 2030" 
              className="h-10 opacity-80"
            />
          </div>
          <button className="flex items-center gap-2 text-[#1b9c75] hover:text-[#147a5b] transition-colors font-medium">
            <Globe className="w-5 h-5" />
            <span>English</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#1b9c75] mb-8">الدخول على النظام</h1>

        {/* Login Card */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex flex-col md:flex-row border-b border-gray-200">
            <button 
              onClick={() => setActiveTab("app")}
              className={`flex-1 py-4 text-center font-bold text-lg transition-colors ${
                activeTab === "app" 
                  ? "bg-[#1b9c75] text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              تطبيق نفاذ
            </button>
            <button 
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-4 text-center font-bold text-lg transition-colors ${
                activeTab === "password" 
                  ? "bg-[#1b9c75] text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              اسم المستخدم وكلمة المرور
            </button>
          </div>

          {/* Content Area */}
          <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
            {/* Right Side: Form */}
            <div className="flex-1 w-full">
              {activeTab === "password" ? (
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-right">
                      اسم المستخدم \ الهوية الوطنية
                    </label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b9c75] focus:border-transparent text-right"
                      placeholder="اسم المستخدم \ الهوية الوطنية"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-right">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b9c75] focus:border-transparent text-right"
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
                    className="w-full bg-[#1b9c75] hover:bg-[#147a5b] text-white font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>تسجيل الدخول</span>
                    <span className="text-xl">←</span>
                  </button>

                  <div className="flex justify-between text-sm pt-4 border-t border-gray-100">
                    <a href="#" className="text-[#1b9c75] hover:underline font-medium">
                      حساب جديد
                    </a>
                    <a href="#" className="text-[#1b9c75] hover:underline font-medium">
                      إعادة تعيين/تغيير كلمة المرور
                    </a>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">الرجاء فتح تطبيق نفاذ على هاتفك والموافقة على الطلب</p>
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-[#1b9c75]">
                    85
                  </div>
                </div>
              )}
            </div>

            {/* Left Side: Image/Info */}
            <div className="hidden md:flex flex-col items-center justify-center flex-1 border-r border-gray-100 pr-12 text-center">
              <img 
                src="https://www.iam.gov.sa/authservice/resources/common/images/login-icon.png" 
                alt="Security" 
                className="w-48 mb-6 opacity-90"
              />
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                الرجاء إدخال اسم المستخدم \ الهوية الوطنية وكلمة المرور ثم اضغط تسجيل الدخول
              </p>
            </div>
          </div>
        </div>

        {/* New Platform Banner */}
        <div className="mt-8 w-full max-w-4xl bg-[#1b9c75] rounded-lg p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-md">
          <div className="mb-4 md:mb-0 text-center md:text-right">
            <h3 className="font-bold text-xl mb-2">منصة النفاذ الجديدة</h3>
            <p className="opacity-90 text-sm">لتجربة أكثر سهولة استخدم النسخة المحدثة من منصة النفاذ الوطني الموحد</p>
          </div>
          <button className="bg-white text-[#1b9c75] px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
            ابدأ الآن
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#333] text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4 text-sm text-gray-300">
            <a href="#" className="hover:text-white">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white">شروط الاستخدام</a>
            <a href="#" className="hover:text-white">الأسئلة الشائعة</a>
            <a href="#" className="hover:text-white">اتصل بنا</a>
          </div>
          <p className="text-xs text-gray-500">
            جميع الحقوق محفوظة © {new Date().getFullYear()} النفاذ الوطني الموحد
          </p>
        </div>
      </footer>
    </div>
  );
}
