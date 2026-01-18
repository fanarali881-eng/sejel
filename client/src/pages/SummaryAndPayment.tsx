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
    floor: '',
    commercialRegNumber: '',
    nameParts: { first: '', second: '', third: '', fourth: '' },
    nameType: 'triple',
    generalActivity: '',
    capitalAmount: ''
  });

  // Function to load data from localStorage
  const loadDataFromLocalStorage = () => {
    // Load personal info
    const savedData = localStorage.getItem('businessCenterPersonalInfo');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setPersonalInfo({
          ...data,
          commercialRegNumber: data.commercialRegNumber || '',
          nameParts: data.nameParts || { first: '', second: '', third: '', fourth: '' },
          nameType: data.nameType || 'triple',
          generalActivity: data.generalActivity || '',
          capitalAmount: data.capitalAmount || ''
        });
      } catch (error) {
        console.error('Error loading personal info:', error);
      }
    }

    // Load service name, request ID, and time from localStorage
    const savedServiceData = localStorage.getItem('businessCenterServiceInfo');
    if (savedServiceData) {
      try {
        const data = JSON.parse(savedServiceData);
        setServiceName(data.serviceName || 'الخدمة');
        setRequestId(data.requestId || 'ABC123456');
        setCurrentTime(data.currentTime || '');
      } catch (error) {
        console.error('Error loading service info:', error);
        setServiceName('الخدمة');
        setRequestId('ABC123456');
      }
    } else {
      setServiceName('الخدمة');
      setRequestId('ABC123456');
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDataFromLocalStorage();
  }, []);

  // Refresh data when page becomes visible (user returns from another tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDataFromLocalStorage();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const getGenderLabel = (value: string) => {
    return value === 'male' ? 'ذكر' : 'أنثى';
  };

  const getNationalityLabel = (value: string) => {
    return value === 'saudi' ? 'سعودي' : 'غير سعودي';
  };

  const buildCommercialName = () => {
    if (!personalInfo.nameParts || !personalInfo.generalActivity) return '-';
    const { first, second, third, fourth } = personalInfo.nameParts;
    const nameStr = `مؤسسة ${first} ${second} ${third} ${personalInfo.nameType === 'quadruple' ? fourth : ''} `.trim();
    
    const activityLabel = personalInfo.generalActivity === 'trade' ? 'للتجارة' :
      personalInfo.generalActivity === 'contracting' ? 'للمقاولات' :
      personalInfo.generalActivity === 'services' ? 'للخدمات العامة' :
      personalInfo.generalActivity === 'industry' ? 'للصناعة والتعدين' :
      personalInfo.generalActivity === 'agriculture' ? 'للزراعة والصيد' :
      personalInfo.generalActivity === 'education' ? 'للتعليم والتدريب' :
      personalInfo.generalActivity === 'health' ? 'للصحة والأنشطة الطبية' :
      personalInfo.generalActivity === 'technology' ? 'لتقنية المعلومات والاتصالات' :
      personalInfo.generalActivity === 'tourism' ? 'للسياحة والضيافة' :
      personalInfo.generalActivity === 'transport' ? 'للنقل والخدمات اللوجستية' :
      personalInfo.generalActivity === 'real_estate' ? 'للأنشطة العقارية' :
      personalInfo.generalActivity === 'finance' ? 'للأنشطة المالية والتأمين' :
      personalInfo.generalActivity === 'media' ? 'للإعلام والنشر' :
      personalInfo.generalActivity === 'entertainment' ? 'للترفيه والفنون' :
      personalInfo.generalActivity === 'energy' ? 'للطاقة والمرافق' :
      personalInfo.generalActivity === 'consulting' ? 'للخدمات الاستشارية والمهنية' :
      personalInfo.generalActivity === 'security' ? 'للخدمات الأمنية والسلامة' :
      personalInfo.generalActivity === 'environment' ? 'للبيئة وإدارة النفايات' : '';
    
    return `${nameStr} ${activityLabel}`.trim();
  };

  const formatDateOfBirth = (date: string) => {
    if (!date) return '-';
    try {
      // If it's an ISO date string, extract just the date part
      if (date.includes('T')) {
        return date.split('T')[0];
      }
      return date;
    } catch (error) {
      return date;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans" dir="rtl">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">الملخص والدفع</h1>
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
                  المعلومات
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
                    <p className="text-gray-800">{formatDateOfBirth(personalInfo.dateOfBirth)}</p>
                  </div>
                </div>
              </div>

              {/* Mobile Number and Email */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Mobile Number */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">رقم الجوال</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{personalInfo.countryCode.replace('+', '')}{personalInfo.mobileNumber || '-'}+</p>
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

              {/* Commercial Fields */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Approved Commercial Name */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">الاسم التجاري المعتمد</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-12 flex items-center">
                    <p className="text-gray-800 text-sm">{buildCommercialName()}</p>
                  </div>
                </div>

                {/* Capital */}
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">رأس المال</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{personalInfo.capitalAmount || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Commercial Registration Number - Only show if has value */}
              {personalInfo.commercialRegNumber && (
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">رقم السجل التجاري</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-12 flex items-center">
                    <p className="text-gray-800">{personalInfo.commercialRegNumber}</p>
                  </div>
                </div>
              )}

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
