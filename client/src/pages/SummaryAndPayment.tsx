import { useState, useEffect } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SummaryAndPayment() {
  const [serviceName, setServiceName] = useState('');
  const [requestId, setRequestId] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  
  const [personalInfo, setPersonalInfo] = useState({
    arabicName: '',
    englishName: '',
    nationality: 'saudi',
    gender: 'male',
    nationalId: '',
    dateOfBirth: '',
    mobileNumber: '',
    countryCode: '+966',
    email: '',
    address: '',
    buildingNumber: '',
    floor: ''
  });

  // Load data from localStorage (passed from BusinessCenterInfo)
  useEffect(() => {
    // Load personal info
    const savedData = localStorage.getItem('businessCenterPersonalInfo');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setPersonalInfo(data);
      } catch (error) {
        console.error('Error loading personal info:', error);
      }
    }

    // Load service name and request ID from URL params
    const searchParams = new URLSearchParams(window.location.search);
    const service = searchParams.get('service') || 'الخدمة';
    const id = searchParams.get('id') || 'ABC123456';
    setServiceName(service);
    setRequestId(id);

    // Update time
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        calendar: 'islamic-umalqura',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setCurrentTime(now.toLocaleString('ar-SA-u-ca-islamic-umalqura', options).replace('،', ''));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGenderLabel = (value: string) => {
    return value === 'male' ? 'ذكر' : 'أنثى';
  };

  const getNationalityLabel = (value: string) => {
    return value === 'saudi' ? 'سعودي' : 'غير سعودي';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans" dir="rtl">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">الملخص والدفع</h1>
            <p className="text-gray-600">مراجعة المعلومات الشخصية قبل إتمام العملية</p>
          </div>

          {/* Service Info Header */}
          <Card className="border-none shadow-sm bg-gradient-to-l from-green-50 to-white mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Service Name */}
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">اسم الخدمة</p>
                  <p className="text-gray-800 font-bold">{serviceName}</p>
                </div>

                {/* Request ID */}
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">رقم الطلب</p>
                  <p className="text-gray-800 font-bold">{requestId}</p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">التاريخ</p>
                  <p className="text-gray-800 font-bold text-sm">{currentTime.split(' ')[0]}</p>
                </div>

                {/* Time */}
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">الوقت</p>
                  <p className="text-gray-800 font-bold text-sm">{currentTime.split(' ').slice(1).join(' ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Section */}
          <Card className="border-none shadow-sm bg-white mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6 border-r-4 border-green-500 pr-3">
                <h2 className="text-lg font-bold text-gray-800">
                  المعلومات الشخصية
                </h2>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Arabic Name */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">الاسم العربي</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{personalInfo.arabicName || '-'}</p>
                  </div>
                </div>

                {/* English Name */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">الاسم الإنجليزي</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{personalInfo.englishName || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Nationality and Gender */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Nationality */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">الجنسية</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{getNationalityLabel(personalInfo.nationality)}</p>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">الجنس</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{getGenderLabel(personalInfo.gender)}</p>
                  </div>
                </div>
              </div>

              {/* National ID and Date of Birth */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* National ID */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">رقم الهوية</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{personalInfo.nationalId || '-'}</p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">تاريخ الميلاد</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{personalInfo.dateOfBirth || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Mobile Number and Email */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Mobile Number */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">رقم الجوال</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{personalInfo.countryCode}{personalInfo.mobileNumber || '-'}</p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">البريد الإلكتروني</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800 text-sm">{personalInfo.email || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="text-gray-700 text-sm font-medium mb-2 block">العنوان</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-12 flex items-center">
                  <p className="text-gray-800">{personalInfo.address || '-'}</p>
                </div>
              </div>

              {/* Building Number and Floor */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Building Number */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">رقم المبنى</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{personalInfo.buildingNumber || '-'}</p>
                  </div>
                </div>

                {/* Floor */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">الدور</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{personalInfo.floor || '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mb-8">
            <Button 
              className="px-8 bg-green-600 hover:bg-green-700 min-w-[120px]"
            >
              متابعة الدفع
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
