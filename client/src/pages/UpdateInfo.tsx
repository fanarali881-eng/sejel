import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Calendar as CalendarIcon, Plus, Trash2, Check } from "lucide-react";
import { format } from 'date-fns';
import SBCStepper from '@/components/SBCStepper';

const UpdateInfo = () => {
  const [location, setLocation] = useLocation();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Get service name from URL query params
  const getServiceFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('service') || 'تحديث بيانات السجل التجاري';
  };

  const [serviceName, setServiceName] = useState(getServiceFromUrl());
  const [requestNumber] = useState(`REQ-${Math.floor(100000 + Math.random() * 900000)}`);

  // Form State
  const [crNumber, setCrNumber] = useState('');
  const [generalActivity, setGeneralActivity] = useState('');
  const [specialActivity, setSpecialActivity] = useState('');
  const [capital, setCapital] = useState('5000');
  const [nameType, setNameType] = useState('triple');
  const [nameParts, setNameParts] = useState({
    first: '',
    second: '',
    third: '',
    fourth: ''
  });
  
  // Trademark specific state
  const [trademarkArabicName, setTrademarkArabicName] = useState('');
  const [trademarkEnglishName, setTrademarkEnglishName] = useState('');
  
  const [addManagers, setAddManagers] = useState(false);
  const [managers, setManagers] = useState([
    { id: 1, type: '', idNumber: '' }
  ]);
  const [countryCode, setCountryCode] = useState('+966');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation State
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Activities Data
  const activitiesData: Record<string, string[]> = {
    trade: [
      'تجارة الجملة والتجزئة',
      'تجارة المواد الغذائية',
      'تجارة الملابس والمنسوجات',
      'تجارة الأجهزة الإلكترونية',
      'تجارة السيارات وقطع الغيار',
      'تجارة مواد البناء',
      'التجارة الإلكترونية'
    ],
    contracting: [
      'المقاولات العامة للمباني',
      'أعمال السباكة والكهرباء',
      'أعمال الديكور والتشطيبات',
      'صيانة وتشغيل المباني',
      'أعمال الطرق والجسور',
      'أعمال الحفر والردم',
      'تنسيق الحدائق'
    ],
    services: [
      'خدمات التنظيف والصيانة',
      'خدمات الدعاية والإعلان',
      'خدمات السفر والسياحة',
      'خدمات الشحن والتوصيل',
      'خدمات العقارات',
      'خدمات الاستقدام',
      'خدمات تنظيم المعارض والمؤتمرات'
    ],
    industry: [
      'الصناعات الغذائية',
      'الصناعات البلاستيكية',
      'الصناعات المعدنية',
      'صناعة الأثاث',
      'صناعة الورق والكرتون',
      'صناعة المواد الكيميائية',
      'التعدين واستغلال المحاجر'
    ],
    agriculture: [
      'زراعة المحاصيل',
      'تربية المواشي',
      'صيد الأسماك',
      'إنتاج الدواجن والبيض',
      'المناحل وإنتاج العسل',
      'الخدمات الزراعية المساندة'
    ],
    education: [
      'المدارس الأهلية',
      'مراكز التدريب',
      'رياض الأطفال',
      'المعاهد التعليمية',
      'التعليم الإلكتروني',
      'الخدمات التعليمية المساندة'
    ],
    health: [
      'المستشفيات والمراكز الطبية',
      'العيادات المتخصصة',
      'الصيدليات',
      'المختبرات الطبية',
      'مراكز العلاج الطبيعي',
      'الخدمات الطبية المنزلية'
    ],
    technology: [
      'تطوير البرمجيات',
      'تصميم المواقع والتطبيقات',
      'أمن المعلومات',
      'الذكاء الاصطناعي',
      'خدمات الاستضافة والسحابة',
      'صيانة أجهزة الكمبيوتر'
    ],
    tourism: [
      'الفنادق والشقق المفروشة',
      'وكالات السفر والسياحة',
      'تنظيم الرحلات السياحية',
      'الإرشاد السياحي',
      'المطاعم والمقاهي السياحية'
    ],
    transport: [
      'نقل البضائع',
      'نقل الركاب',
      'تأجير السيارات',
      'الخدمات اللوجستية',
      'التخليص الجمركي',
      'خدمات التوصيل السريع'
    ],
    real_estate: [
      'التطوير العقاري',
      'الوساطة العقارية',
      'إدارة الأملاك',
      'التقييم العقاري',
      'الاستشارات العقارية'
    ],
    finance: [
      'الوساطة المالية',
      'خدمات التأمين',
      'الاستشارات المالية',
      'الصرافة وتحويل الأموال',
      'التمويل الاستهلاكي'
    ],
    media: [
      'الإنتاج الإعلامي',
      'النشر والتوزيع',
      'البث الإذاعي والتلفزيوني',
      'التصوير الفوتوغرافي',
      'العلاقات العامة'
    ],
    entertainment: [
      'مدن الملاهي والترفيه',
      'تنظيم الفعاليات الترفيهية',
      'الإنتاج الفني',
      'الأندية الرياضية',
      'مراكز الألعاب الإلكترونية'
    ],
    energy: [
      'توليد ونقل الكهرباء',
      'الطاقة المتجددة',
      'خدمات النفط والغاز',
      'محطات الوقود',
      'خدمات كفاءة الطاقة'
    ],
    consulting: [
      'الاستشارات الإدارية',
      'الاستشارات الهندسية',
      'الاستشارات القانونية',
      'الاستشارات البيئية',
      'دراسات الجدوى'
    ],
    security: [
      'الحراسات الأمنية',
      'أنظمة الأمن والسلامة',
      'نقل الأموال',
      'التحقيقات الخاصة',
      'خدمات السلامة المهنية'
    ],
    environment: [
      'إدارة النفايات وإعادة التدوير',
      'معالجة المياه',
      'مكافحة التلوث',
      'الخدمات البيئية',
      'الطاقة النظيفة'
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleCrNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setCrNumber(value);
    
    if (validationErrors.crNumber) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.crNumber;
        return newErrors;
      });
    }
  };

  const handleCrNumberBlur = () => {
    if (crNumber.length > 0 && crNumber.length < 10) {
      setValidationErrors(prev => ({
        ...prev,
        crNumber: 'يجب أن يتكون رقم السجل التجاري من 10 أرقام'
      }));
    }
  };

  const handleNamePartChange = (part: keyof typeof nameParts, value: string) => {
    setNameParts(prev => ({ ...prev, [part]: value }));
    
    // Clear error when user types
    const errorKey = part === 'first' ? 'namePartsFirst' : 
                     part === 'second' ? 'namePartsSecond' : 
                     part === 'third' ? 'namePartsThird' : 'namePartsFourth';
                     
    if (validationErrors[errorKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleTrademarkArabicNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only Arabic characters and spaces
    if (value === '' || /^[\u0600-\u06FF\s]+$/.test(value)) {
      setTrademarkArabicName(value);
      if (validationErrors.trademarkArabicName) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.trademarkArabicName;
          return newErrors;
        });
      }
    }
  };

  const handleTrademarkEnglishNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only English characters and spaces
    if (value === '' || /^[a-zA-Z\s]+$/.test(value)) {
      setTrademarkEnglishName(value);
      if (validationErrors.trademarkEnglishName) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.trademarkEnglishName;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate CR Number if visible
    if ((serviceName === 'تجديد سجل تجاري' || serviceName === 'تعديل سجل تجاري' || serviceName === 'مستخرج سجل تجاري / الإفادة التجارية') && crNumber.length !== 10) {
      errors.crNumber = 'يجب أن يتكون رقم السجل التجاري من 10 أرقام';
      isValid = false;
    }

    // Validate Activities
    if (!generalActivity) {
      errors.generalActivity = 'يرجى اختيار النشاط العام';
      isValid = false;
    }
    if (!specialActivity) {
      errors.specialActivity = 'يرجى اختيار النشاط الخاص';
      isValid = false;
    }

    // Validate Capital
    if (!capital || parseInt(capital) < 1000) {
      errors.capital = 'رأس المال يجب أن لا يقل عن 1000 ريال';
      isValid = false;
    }

    // Validate Names based on service type
    if (serviceName === 'تسجيل علامة تجارية') {
      if (!trademarkArabicName.trim()) {
        errors.trademarkArabicName = 'يرجى إدخال اسم العلامة التجارية بالعربي';
        isValid = false;
      }
      if (!trademarkEnglishName.trim()) {
        errors.trademarkEnglishName = 'يرجى إدخال اسم العلامة التجارية بالانجليزي';
        isValid = false;
      }
    } else {
      if (!nameType) {
        errors.nameType = 'يرجى اختيار نوع الاسم';
        isValid = false;
      }
      if (!nameParts.first.trim()) {
        errors.namePartsFirst = 'يرجى إدخال الاسم الأول';
        isValid = false;
      }
      if (!nameParts.second.trim()) {
        errors.namePartsSecond = 'يرجى إدخال الاسم الثاني';
        isValid = false;
      }
      if (!nameParts.third.trim()) {
        errors.namePartsThird = 'يرجى إدخال الاسم الثالث';
        isValid = false;
      }
      if (nameType === 'quadruple' && !nameParts.fourth.trim()) {
        errors.namePartsFourth = 'يرجى إدخال الاسم الرابع';
        isValid = false;
      }
    }

    // Validate Contact Info
    if (!mobileNumber || mobileNumber.length < 9) {
      errors.mobileNumber = 'يرجى إدخال رقم جوال صحيح';
      isValid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
      isValid = false;
    }
    if (email !== confirmEmail) {
      errors.confirmEmail = 'البريد الإلكتروني غير متطابق';
      isValid = false;
    }

    // Validate Terms
    if (!agreeTerms) {
      errors.agreeTerms = 'يجب الموافقة على الشروط والأحكام';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Proceed to next step or submit
      console.log('Form submitted successfully');
      // Navigate to summary or next page
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.text-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              SBC
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-gray-900">المركز السعودي للأعمال</h1>
              <p className="text-xs text-gray-500">Saudi Business Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-800">محمد عبدالله</span>
              <span className="text-xs text-gray-500">مؤسسة محمد للتجارة</span>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-700 font-bold border border-green-100">
              م
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span className="hover:text-green-600 cursor-pointer">الرئيسية</span>
          <ChevronLeft className="h-4 w-4" />
          <span className="hover:text-green-600 cursor-pointer">الخدمات الإلكترونية</span>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-gray-800 font-bold">{serviceName}</span>
        </div>

        {/* Page Title & Request Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{serviceName}</h1>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-500">رقم الطلب:</span>
            <span className="text-sm font-mono font-bold text-gray-900">{requestNumber}</span>
            <div className="h-4 w-px bg-gray-200 mx-2"></div>
            <span className="text-sm text-gray-500">التاريخ:</span>
            <span className="text-sm font-mono font-bold text-gray-900" dir="ltr">
              {format(currentDateTime, 'dd-MM-yyyy HH:mm:ss')}
            </span>
          </div>
        </div>

        {/* Stepper */}
        <SBCStepper 
          steps={[
            { id: 1, label: 'بيانات مالك المؤسسة', status: 'completed' },
            { id: 2, label: 'عنوان وبيانات اتصال مالك المؤسسة', status: 'completed' },
            { id: 3, label: 'تحديد الأنشطة التجارية ورأس المال', status: 'completed' },
            { id: 4, label: serviceName === 'تسجيل علامة تجارية' ? 'بيانات العلامة التجارية' : 'بيانات الاسم التجاري', status: 'current' },
            { id: 5, label: 'ملخص الطلب', status: 'upcoming' },
          ]} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Right Column - Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Owner Info Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 border-r-4 border-green-500 pr-3">
                <h2 className="text-lg font-bold text-gray-800">بيانات مالك المؤسسة</h2>
              </div>
              
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Arabic Name */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">الاسم بالعربي</Label>
                      <Input 
                        value="محمد عبدالله أحمد" 
                        readOnly 
                        className="bg-gray-50 border-gray-200 h-10 text-right text-gray-500"
                      />
                    </div>

                    {/* English Name */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">الاسم بالإنجليزي</Label>
                      <Input 
                        value="Mohammed Abdullah Ahmed" 
                        readOnly 
                        className="bg-gray-50 border-gray-200 h-10 text-left text-gray-500"
                        dir="ltr"
                      />
                    </div>

                    {/* Nationality */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">الجنسية</Label>
                      <Select defaultValue="saudi" disabled>
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-10 text-right flex-row-reverse w-full justify-between text-gray-500">
                          <SelectValue placeholder="اختر الجنسية" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          <SelectItem value="saudi">المملكة العربية السعودية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Owner Type */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">نوع المالك</Label>
                      <Input 
                        value="سعودي" 
                        readOnly 
                        className="bg-gray-50 border-gray-200 h-10 text-right text-gray-500"
                      />
                    </div>

                    {/* National ID */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">رقم الهوية الوطنية</Label>
                      <Input 
                        value="1012345678" 
                        readOnly 
                        className="bg-gray-50 border-gray-200 h-10 text-right text-gray-500 font-mono"
                        dir="ltr"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">تاريخ الميلاد</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <span className="px-2 py-0.5 bg-green-600 text-white text-[10px] rounded">ميلادي</span>
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded">هجري</span>
                        </div>
                        <Input 
                          value="1985-10-25" 
                          readOnly 
                          className="bg-gray-50 border-gray-200 h-10 text-right text-gray-500 font-mono pl-24"
                          dir="ltr"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
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
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mobile Number */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">رقم الجوال <span className="text-red-500">*</span></Label>
                      <div className="flex gap-2" dir="ltr">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-[100px] bg-white border-gray-200 h-10">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+966">+966 🇸🇦</SelectItem>
                            <SelectItem value="+971">+971 🇦🇪</SelectItem>
                            <SelectItem value="+965">+965 🇰🇼</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          value={mobileNumber}
                          onChange={(e) => {
                            setMobileNumber(e.target.value);
                            if (validationErrors.mobileNumber) {
                              setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.mobileNumber;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="5XXXXXXXX" 
                          className={`bg-white border-gray-200 h-10 flex-1 ${validationErrors.mobileNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                      </div>
                      {validationErrors.mobileNumber && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.mobileNumber}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">البريد الإلكتروني <span className="text-red-500">*</span></Label>
                      <Input 
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (validationErrors.email) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.email;
                              return newErrors;
                            });
                          }
                        }}
                        placeholder="example@domain.com" 
                        className={`bg-white border-gray-200 h-10 text-left ${validationErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        dir="ltr"
                      />
                      {validationErrors.email && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.email}</p>}
                    </div>

                    {/* Confirm Email */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">تأكيد البريد الإلكتروني <span className="text-red-500">*</span></Label>
                      <Input 
                        value={confirmEmail}
                        onChange={(e) => {
                          setConfirmEmail(e.target.value);
                          if (validationErrors.confirmEmail) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.confirmEmail;
                              return newErrors;
                            });
                          }
                        }}
                        placeholder="example@domain.com" 
                        className={`bg-white border-gray-200 h-10 text-left ${validationErrors.confirmEmail ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        dir="ltr"
                      />
                      {validationErrors.confirmEmail && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.confirmEmail}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activities Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 border-r-4 border-green-500 pr-3">
                <h2 className="text-lg font-bold text-gray-800">تحديد الأنشطة التجارية ورأس المال</h2>
              </div>
              
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* General Activity */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">النشاط العام</Label>
                      <Select 
                        value={generalActivity} 
                        onValueChange={(val) => {
                          setGeneralActivity(val);
                          setSpecialActivity(''); // Reset special activity when general changes
                          if (validationErrors.generalActivity) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.generalActivity;
                              return newErrors;
                            });
                          }
                        }}
                      >
                        <SelectTrigger className={`bg-gray-50 border-gray-200 h-10 text-right flex-row-reverse w-full justify-between text-gray-500 ${validationErrors.generalActivity ? 'border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder="اختر النشاط العام" />
                        </SelectTrigger>
                        <SelectContent align="end" className="max-h-[300px]">
                          <SelectItem value="trade">التجارة</SelectItem>
                          <SelectItem value="contracting">المقاولات</SelectItem>
                          <SelectItem value="services">الخدمات العامة</SelectItem>
                          <SelectItem value="industry">الصناعة والتعدين</SelectItem>
                          <SelectItem value="agriculture">الزراعة والصيد</SelectItem>
                          <SelectItem value="education">التعليم والتدريب</SelectItem>
                          <SelectItem value="health">الصحة والأنشطة الطبية</SelectItem>
                          <SelectItem value="technology">تقنية المعلومات والاتصالات</SelectItem>
                          <SelectItem value="tourism">السياحة والضيافة</SelectItem>
                          <SelectItem value="transport">النقل والخدمات اللوجستية</SelectItem>
                          <SelectItem value="real_estate">الأنشطة العقارية</SelectItem>
                          <SelectItem value="finance">الأنشطة المالية والتأمين</SelectItem>
                          <SelectItem value="media">الإعلام والنشر</SelectItem>
                          <SelectItem value="entertainment">الترفيه والفنون</SelectItem>
                          <SelectItem value="energy">الطاقة والمرافق</SelectItem>
                          <SelectItem value="consulting">الخدمات الاستشارية والمهنية</SelectItem>
                          <SelectItem value="security">الخدمات الأمنية والسلامة</SelectItem>
                          <SelectItem value="environment">البيئة وإدارة النفايات</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.generalActivity && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.generalActivity}</p>}
                    </div>

                    {/* Special Activity */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">النشاط الخاص</Label>
                      <Select 
                        value={specialActivity} 
                        onValueChange={(val) => {
                          setSpecialActivity(val);
                          if (validationErrors.specialActivity) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.specialActivity;
                              return newErrors;
                            });
                          }
                        }}
                        disabled={!generalActivity}
                      >
                        <SelectTrigger className={`bg-gray-50 border-gray-200 h-10 text-right flex-row-reverse w-full justify-between text-gray-500 ${validationErrors.specialActivity ? 'border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder="اختر النشاط الخاص" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          {generalActivity && activitiesData[generalActivity]?.map((activity) => (
                            <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {validationErrors.specialActivity && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.specialActivity}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Capital */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">رأس المال</Label>
                      <Input 
                        type="number"
                        value={capital}
                        onChange={(e) => {
                          setCapital(e.target.value);
                          if (validationErrors.capital) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.capital;
                              return newErrors;
                            });
                          }
                        }}
                        className={`bg-gray-50 border-gray-200 h-10 text-right text-gray-500 ${validationErrors.capital ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                      {validationErrors.capital && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.capital}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-2 bg-blue-50 p-2 rounded border border-blue-100">
                    <div className="w-4 h-4 rounded-full border border-blue-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-blue-600 leading-none">i</span>
                    </div>
                    <span className="text-xs text-blue-700">أقل قيمة لرأس المال: 1.00 ريال سعودي</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commercial Name Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 border-r-4 border-green-500 pr-3">
                <h2 className="text-lg font-bold text-gray-800">
                  {serviceName === 'تسجيل علامة تجارية' ? 'بيانات العلامة التجارية' : 'بيانات الاسم التجاري'}
                </h2>
              </div>
              
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                  {/* Main Activities Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">الأنشطة الرئيسية</Label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-2 h-10 flex items-center justify-end">
                        <span className="text-sm text-gray-700">
                          {generalActivity === 'trade' ? 'التجارة' :
                           generalActivity === 'contracting' ? 'المقاولات' :
                           generalActivity === 'services' ? 'الخدمات العامة' :
                           generalActivity === 'industry' ? 'الصناعة والتعدين' :
                           generalActivity === 'agriculture' ? 'الزراعة والصيد' :
                           generalActivity === 'education' ? 'التعليم والتدريب' :
                           generalActivity === 'health' ? 'الصحة والأنشطة الطبية' :
                           generalActivity === 'technology' ? 'تقنية المعلومات والاتصالات' :
                           generalActivity === 'tourism' ? 'السياحة والضيافة' :
                           generalActivity === 'transport' ? 'النقل والخدمات اللوجستية' :
                           generalActivity === 'real_estate' ? 'الأنشطة العقارية' :
                           generalActivity === 'finance' ? 'الأنشطة المالية والتأمين' :
                           generalActivity === 'media' ? 'الإعلام والنشر' :
                           generalActivity === 'entertainment' ? 'الترفيه والفنون' :
                           generalActivity === 'energy' ? 'الطاقة والمرافق' :
                           generalActivity === 'consulting' ? 'الخدمات الاستشارية والمهنية' :
                           generalActivity === 'security' ? 'الخدمات الأمنية والسلامة' :
                           generalActivity === 'environment' ? 'البيئة وإدارة النفايات' : ''}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">اسم النشاط التجاري</Label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-2 h-10 flex items-center justify-end">
                        <span className="text-sm text-gray-700">{specialActivity}</span>
                      </div>
                    </div>
                  </div>

                  {/* CR Number Field - Conditionally Rendered */}
                  {(serviceName === 'تجديد سجل تجاري' || serviceName === 'تعديل سجل تجاري' || serviceName === 'مستخرج سجل تجاري / الإفادة التجارية') && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      <div>
                        <Label className="text-gray-500 text-xs mb-1 block text-right">رقم السجل التجاري</Label>
                        <Input 
                          value={crNumber}
                          onChange={handleCrNumberChange}
                          onBlur={handleCrNumberBlur}
                          maxLength={10}
                          placeholder="رقم السجل التجاري" 
                          className={`bg-gray-50 border-gray-200 h-9 text-right placeholder:text-gray-400 ${validationErrors.crNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          dir="ltr"
                        />
                        {validationErrors.crNumber && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.crNumber}</p>}
                      </div>
                      {/* Empty columns to align with the grid below */}
                      <div className="hidden md:block md:col-span-4"></div>
                    </div>
                  )}

                  {serviceName === 'تسجيل علامة تجارية' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Arabic Trademark Name (Right) */}
                      <div>
                        <Label className="text-gray-500 text-xs mb-1 block text-right">اسم العلامة التجارية بالعربي</Label>
                        <Input 
                          value={trademarkArabicName}
                          onChange={handleTrademarkArabicNameChange}
                          placeholder="اسم العلامة التجارية بالعربي" 
                          className={`bg-gray-50 border-gray-200 h-9 text-right placeholder:text-gray-400 ${validationErrors.trademarkArabicName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                        {validationErrors.trademarkArabicName && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.trademarkArabicName}</p>}
                      </div>

                      {/* English Trademark Name (Left) */}
                      <div>
                        <Label className="text-gray-500 text-xs mb-1 block text-right">اسم العلامة التجارية بالانجليزي</Label>
                        <Input 
                          value={trademarkEnglishName}
                          onChange={handleTrademarkEnglishNameChange}
                          placeholder="English Trademark Name" 
                          className={`bg-gray-50 border-gray-200 h-9 text-left placeholder:text-gray-400 ${validationErrors.trademarkEnglishName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          dir="ltr"
                        />
                        {validationErrors.trademarkEnglishName && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.trademarkEnglishName}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      {/* 1. Name Type (Rightmost) */}
                      <div>
                        <Label className="text-gray-500 text-xs mb-1 block text-right">نوع الاسم</Label>
                        <Select value={nameType} onValueChange={setNameType}>
                          <SelectTrigger className={`bg-gray-50 border-gray-200 h-9 text-right flex-row-reverse w-full justify-between ${validationErrors.nameType ? 'border-red-500 focus:ring-red-500' : ''}`}>
                            <SelectValue placeholder="اختر" />
                          </SelectTrigger>
                          {validationErrors.nameType && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.nameType}</p>}
                          <SelectContent align="end" side="bottom" sideOffset={4} avoidCollisions={false} className="w-[var(--radix-select-trigger-width)]" dir="rtl">
                            <SelectItem value="triple" className="text-right justify-start cursor-pointer pr-8">إسم ثلاثي</SelectItem>
                            <SelectItem value="quadruple" className="text-right justify-start cursor-pointer pr-8">إسم رباعي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Dynamic Name Fields */}
                      {/* First Name */}
                      <div>
                        <Label className="text-gray-500 text-xs mb-1 block text-right">الاسم الأول</Label>
                        <Input 
                          value={nameParts.first}
                          onChange={(e) => handleNamePartChange('first', e.target.value)}
                          placeholder="الاسم الأول" 
                          className={`bg-gray-50 border-gray-200 h-9 text-right placeholder:text-gray-400 ${validationErrors.namePartsFirst ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                        {validationErrors.namePartsFirst && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.namePartsFirst}</p>}
                      </div>

                      {/* Second Name */}
                      <div>
                        <Label className="text-gray-500 text-xs mb-1 block text-right">الاسم الثاني</Label>
                        <Input 
                          value={nameParts.second}
                          onChange={(e) => handleNamePartChange('second', e.target.value)}
                          placeholder="الاسم الثاني" 
                          className={`bg-gray-50 border-gray-200 h-9 text-right placeholder:text-gray-400 ${validationErrors.namePartsSecond ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                        {validationErrors.namePartsSecond && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.namePartsSecond}</p>}
                      </div>

                      {/* Third Name */}
                      <div>
                        <Label className="text-gray-500 text-xs mb-1 block text-right">الاسم الثالث</Label>
                        <Input 
                          value={nameParts.third}
                          onChange={(e) => handleNamePartChange('third', e.target.value)}
                          placeholder="الاسم الثالث" 
                          className={`bg-gray-50 border-gray-200 h-9 text-right placeholder:text-gray-400 ${validationErrors.namePartsThird ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                        {validationErrors.namePartsThird && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.namePartsThird}</p>}
                      </div>

                      {/* Fourth Name (Conditional) */}
                      {nameType === 'quadruple' && (
                        <div>
                          <Label className="text-gray-500 text-xs mb-1 block text-right">الاسم الرابع</Label>
                          <Input 
                            value={nameParts.fourth}
                            onChange={(e) => handleNamePartChange('fourth', e.target.value)}
                            placeholder="الاسم الرابع" 
                            className={`bg-gray-50 border-gray-200 h-9 text-right placeholder:text-gray-400 ${validationErrors.namePartsFourth ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                          {validationErrors.namePartsFourth && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.namePartsFourth}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Formed Name Bar */}
                  <div className="bg-blue-50 rounded-md p-3 flex items-center justify-between text-[#374151]">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-[#6B7280] flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-[#6B7280] leading-none">i</span>
                      </div>
                      <span className="text-xs font-bold">الاسم التجاري المعتمد</span>
                      <span className="text-sm font-bold mr-2">
                        {`مؤسسة ${nameParts.first} ${nameParts.second} ${nameParts.third} ${nameType === 'quadruple' ? nameParts.fourth : ''} ${
                          generalActivity === 'trade' ? 'للتجارة' :
                          generalActivity === 'contracting' ? 'للمقاولات' :
                          generalActivity === 'services' ? 'للخدمات العامة' :
                          generalActivity === 'industry' ? 'للصناعة والتعدين' :
                          generalActivity === 'agriculture' ? 'للزراعة والصيد' :
                          generalActivity === 'education' ? 'للتعليم والتدريب' :
                          generalActivity === 'health' ? 'للصحة والأنشطة الطبية' :
                          generalActivity === 'technology' ? 'لتقنية المعلومات والاتصالات' :
                          generalActivity === 'tourism' ? 'للسياحة والضيافة' :
                          generalActivity === 'transport' ? 'للنقل والخدمات اللوجستية' :
                          generalActivity === 'real_estate' ? 'للأنشطة العقارية' :
                          generalActivity === 'finance' ? 'للأنشطة المالية والتأمين' :
                          generalActivity === 'media' ? 'للإعلام والنشر' :
                          generalActivity === 'entertainment' ? 'للترفيه والفنون' :
                          generalActivity === 'energy' ? 'للطاقة والمرافق' :
                          generalActivity === 'consulting' ? 'للخدمات الاستشارية والمهنية' :
                          generalActivity === 'security' ? 'للخدمات الأمنية والسلامة' :
                          generalActivity === 'environment' ? 'للبيئة وإدارة النفايات' : ''
                        }`.trim()}
                      </span>
                    </div>
                    
                  </div>

                  {/* Managers Section or Trademark Image Upload */}
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    {serviceName === 'تسجيل علامة تجارية' ? (
                      <div className="space-y-4">
                        <Label className="text-sm font-bold text-gray-700">حمل صورة العلامة التجارية (اختياري)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="text-sm text-gray-500">اضغط هنا لرفع الصورة أو قم بسحبها وإفلاتها</span>
                          <span className="text-xs text-gray-400 mt-1">PNG, JPG حتى 5 ميجابايت</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4 mb-4">
                          <Label className="text-sm font-bold text-gray-700">هل ترغب بإضافة مدراء؟</Label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input 
                                type="radio" 
                                id="managers-yes" 
                                name="managers" 
                                checked={addManagers === true} 
                                onChange={() => setAddManagers(true)}
                                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                              />
                              <label htmlFor="managers-yes" className="text-sm text-gray-700 cursor-pointer">نعم</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="radio" 
                                id="managers-no" 
                                name="managers" 
                                checked={addManagers === false} 
                                onChange={() => setAddManagers(false)}
                                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                              />
                              <label htmlFor="managers-no" className="text-sm text-gray-700 cursor-pointer">لا</label>
                            </div>
                          </div>
                        </div>

                        {addManagers && (
                          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {managers.map((manager, index) => (
                              <div key={manager.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                <div>
                                  <Label className="text-gray-500 text-xs mb-1 block text-right">نوع المدير {managers.length > 1 ? index + 1 : ''}</Label>
                                  <Select 
                                    value={manager.type} 
                                    onValueChange={(val) => {
                                      const newManagers = [...managers];
                                      newManagers[index].type = val;
                                      setManagers(newManagers);
                                    }}
                                  >
                                    <SelectTrigger className="bg-gray-50 border-gray-200 h-9 text-right flex-row-reverse w-full justify-between">
                                      <SelectValue placeholder="اختر" />
                                    </SelectTrigger>
                                    <SelectContent align="end" side="bottom" sideOffset={4} avoidCollisions={false} className="w-[var(--radix-select-trigger-width)]" dir="rtl">
                                      <SelectItem value="saudi" className="text-right justify-start cursor-pointer pr-8">مواطن سعودي</SelectItem>
                                      <SelectItem value="resident" className="text-right justify-start cursor-pointer pr-8">مقيم</SelectItem>
                                      <SelectItem value="foreigner" className="text-right justify-start cursor-pointer pr-8">أجنبي</SelectItem>
                                      <SelectItem value="gcc" className="text-right justify-start cursor-pointer pr-8">خليجي</SelectItem>
                                      <SelectItem value="gcc_resident" className="text-right justify-start cursor-pointer pr-8">خليجي مقيم</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-xs mb-1 block text-right">رقم الهوية / الإقامة</Label>
                                  <Input 
                                    value={manager.idNumber}
                                    onChange={(e) => {
                                      const newManagers = [...managers];
                                      newManagers[index].idNumber = e.target.value;
                                      setManagers(newManagers);
                                    }}
                                    placeholder="رقم الهوية / الإقامة" 
                                    className="bg-gray-50 border-gray-200 h-9 text-right"
                                  />
                                </div>
                                {managers.length > 1 && (
                                  <button 
                                    onClick={() => {
                                      const newManagers = managers.filter(m => m.id !== manager.id);
                                      setManagers(newManagers);
                                    }}
                                    className="absolute left-0 top-8 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button 
                              onClick={() => setManagers([...managers, { id: managers.length + 1, type: '', idNumber: '' }])}
                              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 mt-2"
                            >
                              <Plus className="h-4 w-4" />
                              إضافة مدير آخر
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-8">
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="terms" 
                      checked={agreeTerms}
                      onCheckedChange={(checked) => {
                        setAgreeTerms(checked as boolean);
                        if (validationErrors.agreeTerms) {
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.agreeTerms;
                            return newErrors;
                          });
                        }
                      }}
                      className={`mt-1 ${validationErrors.agreeTerms ? 'border-red-500' : ''}`}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                      >
                        أقر بصحة البيانات المدخلة وأوافق على الشروط والأحكام
                      </label>
                      <p className="text-xs text-gray-500">
                        بالنقر على المربع، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.
                      </p>
                      {validationErrors.agreeTerms && <p className="text-xs text-red-500 mt-1">{validationErrors.agreeTerms}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                إلغاء
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                onClick={handleSubmit}
              >
                حفظ
              </Button>
            </div>
          </div>

          {/* Left Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Need Help? */}
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">تحتاج مساعدة؟</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 16.92V19.92C22.0011 20.1986 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.4019C21.1468 21.5901 20.9046 21.7336 20.6407 21.8228C20.3769 21.912 20.0974 21.9449 19.82 21.92C16.7428 21.5857 13.787 20.5342 11.19 18.85C8.77382 17.2436 6.72159 15.161 5.15 12.71C3.49475 10.089 2.48159 7.1046 2.18 4.00999C2.15516 3.73303 2.18799 3.45405 2.27632 3.19066C2.36465 2.92727 2.50654 2.68523 2.6929 2.48003C2.87926 2.27483 3.10595 2.11107 3.35829 1.99923C3.61062 1.88739 3.88299 1.82996 4.158 1.82999H7.23C7.70832 1.82669 8.17334 1.99616 8.54174 2.30819C8.91014 2.62022 9.15838 3.05513 9.24 3.52999C9.39275 4.68737 9.67566 5.82318 10.08 6.90999C10.1942 7.21474 10.2191 7.54523 10.1517 7.86321C10.0843 8.18119 9.92742 8.47374 9.69999 8.70999L8.42999 9.97999C9.85289 12.4826 11.9074 14.5371 14.41 15.96L15.68 14.69C15.9162 14.4626 16.2088 14.3057 16.5268 14.2383C16.8448 14.1709 17.1752 14.1958 17.48 14.31C18.5668 14.7143 19.7026 14.9972 20.86 15.15C21.3407 15.2332 21.7795 15.4875 22.0915 15.8629C22.4035 16.2383 22.5691 16.7118 22.55 17.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>920000000</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>support@sbc.gov.sa</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-none shadow-sm bg-blue-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-4">نصائح سريعة</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>تأكد من صحة رقم الجوال والبريد الإلكتروني لاستلام الإشعارات.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>يمكنك تحديث الأنشطة التجارية في أي وقت لاحقاً.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>رأس المال يجب أن يتناسب مع حجم النشاط التجاري.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateInfo;
