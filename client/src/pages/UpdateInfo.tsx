import React, { useState } from 'react';
import { useLocation } from 'wouter';
import SBCSidebar from '@/components/SBCSidebar';
import SBCStepper from '@/components/SBCStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ArrowRight, X } from 'lucide-react';

const UpdateInfo = () => {
  const [location] = useLocation();
  
  // Extract service name from query params or default to a generic title
  const searchParams = new URLSearchParams(window.location.search);
  const serviceName = searchParams.get('service') || 'تحديث بيانات الخدمة';
  const requestId = searchParams.get('id') || 'ECR100138';

  const steps = [
    { id: 1, label: 'بيانات مالك المؤسسة', status: 'current' as const },
    { id: 2, label: 'بيانات الاسم التجاري و الأنشطة', status: 'upcoming' as const },
    { id: 3, label: 'بيانات الوقف', status: 'upcoming' as const },
    { id: 4, label: 'عنوان وبيانات اتصال المؤسسة', status: 'upcoming' as const },
    { id: 5, label: 'بيانات المديرين', status: 'upcoming' as const },
    { id: 6, label: 'ملخص الطلب', status: 'upcoming' as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
      {/* Top Navigation Bar (Simplified for this page) */}
      <header className="bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <img src="/images/sbc-logo.png" alt="Saudi Business Center" className="h-12" />
          <a href="/" className="text-sm text-gray-600 hover:text-green-600 font-medium">الرئيسية</a>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <SBCSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-8 text-right">{serviceName}</h1>

            {/* Stepper */}
            <div className="mb-8">
              <SBCStepper steps={steps} />
            </div>

            {/* Request Info Bar */}
            <div className="bg-blue-50 rounded-lg p-4 mb-8 flex justify-between items-center text-sm">
              <div className="flex gap-8">
                <div>
                  <span className="text-gray-500 ml-2">رقم الطلب</span>
                  <span className="font-bold text-gray-800">{requestId}</span>
                </div>
                <div>
                  <span className="text-gray-500 ml-2">حالة الطلب</span>
                  <span className="font-bold text-gray-800">مسودة</span>
                </div>
                <div>
                  <span className="text-gray-500 ml-2">تاريخ الطلب</span>
                  <span className="font-bold text-gray-800">2025-04-24</span>
                </div>
              </div>
            </div>

            {/* Owner Data Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 border-r-4 border-green-500 pr-3">
                <h2 className="text-lg font-bold text-gray-800">بيانات مالك المؤسسة</h2>
              </div>
              
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6 grid grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الاسم بالعربي</Label>
                    <Input placeholder="محمد عبدالله أحمد" className="font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الاسم بالإنجليزي</Label>
                    <Input placeholder="Mohammed Abdullah Ahmed" className="font-bold text-gray-800 text-left placeholder:font-normal placeholder:text-gray-400" dir="ltr" />
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الجنسية</Label>
                    <Input placeholder="المملكة العربية السعودية" className="font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">نوع المالك</Label>
                    <Input placeholder="سعودي" className="font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">رقم الهوية الوطنية</Label>
                    <Input placeholder="1012345678" className="font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">تاريخ الميلاد</Label>
                    <Input placeholder="1985-10-25" className="font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الجنس</Label>
                    <Input placeholder="ذكر" className="font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 border-r-4 border-green-500 pr-3">
                <h2 className="text-lg font-bold text-gray-800">عنوان وبيانات اتصال مالك المؤسسة</h2>
              </div>

              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6 space-y-6">
                  {/* Mobile Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                      <Label className="text-gray-700 mb-2 block">رقم الجوال</Label>
                      <div className="flex gap-2" dir="ltr">
                        <div className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600 font-medium">
                          966
                        </div>
                        <Input 
                          type="tel" 
                          placeholder="5xxxxxxxx" 
                          className="text-right placeholder:font-normal placeholder:text-gray-400"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">يجب أن يكون بصيغة 05xxxxxxxx</p>
                    </div>
                    <div>
                      <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-50">
                        التحقق من رقم الجوال
                      </Button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                      <Label className="text-gray-700 mb-2 block">البريد الإلكتروني</Label>
                      <Input 
                        type="email" 
                        placeholder="someone@example.org" 
                        className="text-left placeholder:font-normal placeholder:text-gray-400"
                        />
                      <p className="text-xs text-gray-400 mt-1 text-right">يجب أن يكون بصيغة someone@example.org</p>
                    </div>
                    <div>
                      <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-50">
                        التحقق من البريد الإلكتروني
                      </Button>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label className="text-gray-700 mb-2 block">إضافة العنوان</Label>
                    <Button variant="outline" className="w-full md:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      عنوان داخل المملكة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
              <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2">
                <X className="w-4 h-4" />
                إلغاء الطلب
              </Button>
              
              <Button className="bg-[#483D8B] hover:bg-[#3a316f] text-white px-8 gap-2">
                استمرار
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Button>
            </div>

          </div>
        </main>

        </div>
    </div>
  );
};

export default UpdateInfo;
