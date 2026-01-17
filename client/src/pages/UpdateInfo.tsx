import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Check, ChevronLeft, Calendar as CalendarIcon, Upload, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import SBCStepper from '@/components/SBCStepper';

const UpdateInfo = () => {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/service/:id');
  const serviceId = params?.id;

  // Mock service data - in a real app this would come from an API or context
  const getServiceName = (id: string) => {
    const services: Record<string, string> = {
      '1': 'إصدار سجل تجاري',
      '2': 'تجديد سجل تجاري',
      '3': 'تعديل سجل تجاري',
      '4': 'حجز اسم تجاري',
      '5': 'إصدار رخصة فورية',
      '6': 'شطب سجل تجاري',
      '7': 'نقل ملكية سجل تجاري',
      '8': 'تحويل مؤسسة إلى شركة',
      '9': 'إصدار شهادة انتساب',
      '10': 'تجديد اشتراك الغرفة التجارية',
      '11': 'تصديق الوثائق',
      '12': 'الاستفسار عن المخالفات التجارية',
      '13': 'الاعتراض على المخالفات',
      '14': 'إصدار ترخيص صناعي',
      '15': 'تجديد ترخيص صناعي',
      '16': 'تعديل ترخيص صناعي',
      '17': 'الإعفاء الجمركي',
      '18': 'فسح المواد الكيميائية',
      '19': 'تسجيل علامة تجارية',
      '20': 'نشر العلامات التجارية',
      '21': 'تجديد علامة تجارية',
      '22': 'نقل ملكية علامة تجارية',
      '23': 'رهن علامة تجارية',
      '24': 'ترخيص استخدام علامة تجارية',
      '25': 'تعديل بيانات علامة تجارية',
      '26': 'شطب علامة تجارية',
      '27': 'الاستعلام عن العلامات التجارية',
      '28': 'إصدار شهادة إيداع قوائم مالية',
      '29': 'مستخرج سجل تجاري / الإفادة التجارية',
    };
    return services[id] || 'تحديث البيانات';
  };

  const serviceName = serviceId ? getServiceName(serviceId) : 'تحديث البيانات';

  // Generate random request number
  const [requestNumber] = useState(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    const numbers = Math.floor(100000 + Math.random() * 900000);
    return result + numbers;
  });

  // State for form fields
  const [arabicName, setArabicName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [nationality, setNationality] = useState('saudi');
  const [gender, setGender] = useState('male');
  const [nationalId, setNationalId] = useState('');
  const [nationalIdError, setNationalIdError] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [address, setAddress] = useState('');
  
  // State for Commercial Activities
  const [generalActivity, setGeneralActivity] = useState('');
  const [specialActivity, setSpecialActivity] = useState('');
  const [capitalAmount, setCapitalAmount] = useState('');
  const [ownerType, setOwnerType] = useState('');
  
  // Commercial Name State
  const [nameType, setNameType] = useState('triple');
  const [nameParts, setNameParts] = useState({ first: '', second: '', third: '', fourth: '' });
  
  // Trademark Name State
  const [trademarkArabicName, setTrademarkArabicName] = useState('');
  const [trademarkEnglishName, setTrademarkEnglishName] = useState('');
  const [trademarkImage, setTrademarkImage] = useState<File | null>(null);
  const [addManagers, setAddManagers] = useState(false);
  const [managers, setManagers] = useState([{ id: 1, type: '', name: '' }]);
  const [crNumber, setCrNumber] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [calendarType, setCalendarType] = useState<'gregorian' | 'hijri'>('gregorian');
  const [hijriDate, setHijriDate] = useState({ day: '', month: '', year: '' });
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate max date for 18 years old
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  // Hijri Data
  const hijriMonths = [
    { value: '1', label: 'محرم' },
    { value: '2', label: 'صفر' },
    { value: '3', label: 'ربيع الأول' },
    { value: '4', label: 'ربيع الآخر' },
    { value: '5', label: 'جمادى الأولى' },
    { value: '6', label: 'جمادى الآخرة' },
    { value: '7', label: 'رجب' },
    { value: '8', label: 'شعبان' },
    { value: '9', label: 'رمضان' },
    { value: '10', label: 'شوال' },
    { value: '11', label: 'ذو القعدة' },
    { value: '12', label: 'ذو الحجة' },
  ];

  const currentHijriYear = 1446;
  const minHijriAge = 18;
  const maxHijriYear = currentHijriYear - minHijriAge;
  const hijriYears = Array.from({ length: 100 }, (_, i) => maxHijriYear - i);
  const hijriDays = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  // Activities Data
  const activitiesData: Record<string, { value: string; label: string }[]> = {
    trade: [
      { value: "retail", label: "البيع بالتجزئة" },
      { value: "wholesale", label: "البيع بالجملة" },
      { value: "import_export", label: "الاستيراد والتصدير" },
      { value: "e_commerce", label: "التجارة الإلكترونية" },
    ],
    contracting: [
      { value: "building_construction", label: "تشييد المباني" },
      { value: "finishing", label: "أعمال التشطيبات" },
      { value: "electrical_works", label: "الأعمال الكهربائية" },
      { value: "plumbing", label: "أعمال السباكة" },
      { value: "roads", label: "إنشاء الطرق" },
    ],
    services: [
      { value: "cleaning", label: "خدمات التنظيف" },
      { value: "maintenance", label: "خدمات الصيانة" },
      { value: "logistics", label: "الخدمات اللوجستية" },
      { value: "consulting", label: "الاستشارات الإدارية" },
      { value: "marketing", label: "التسويق والدعاية" },
    ],
    industry: [
      { value: "food_industry", label: "الصناعات الغذائية" },
      { value: "textile", label: "صناعة المنسوجات" },
      { value: "chemical", label: "الصناعات الكيميائية" },
      { value: "metal", label: "الصناعات المعدنية" },
      { value: "plastic", label: "صناعة البلاستيك" },
    ],
    agriculture: [
      { value: "farming", label: "زراعة المحاصيل" },
      { value: "livestock", label: "تربية المواشي" },
      { value: "fishing", label: "صيد الأسماك" },
      { value: "greenhouses", label: "البيوت المحمية" },
    ],
    education: [
      { value: "schools", label: "المدارس الأهلية" },
      { value: "training_centers", label: "مراكز التدريب" },
      { value: "universities", label: "الجامعات والكليات" },
      { value: "kindergartens", label: "رياض الأطفال" },
      { value: "educational_consulting", label: "الاستشارات التعليمية" },
    ],
    health: [
      { value: "hospitals", label: "المستشفيات" },
      { value: "clinics", label: "المجمعات الطبية" },
      { value: "pharmacies", label: "الصيدليات" },
      { value: "laboratories", label: "المختبرات الطبية" },
      { value: "medical_equipment", label: "المعدات الطبية" },
    ],
    technology: [
      { value: "software_development", label: "تطوير البرمجيات" },
      { value: "it_consulting", label: "استشارات تقنية المعلومات" },
      { value: "cybersecurity", label: "الأمن السيبراني" },
      { value: "data_analysis", label: "تحليل البيانات" },
      { value: "cloud_services", label: "الخدمات السحابية" },
    ],
    tourism: [
      { value: "hotels", label: "الفنادق والشقق المفروشة" },
      { value: "travel_agencies", label: "وكالات السفر والسياحة" },
      { value: "event_management", label: "تنظيم الفعاليات والمؤتمرات" },
      { value: "tour_guides", label: "الإرشاد السياحي" },
      { value: "entertainment_centers", label: "المراكز الترفيهية" },
    ],
    transport: [
      { value: "land_transport", label: "النقل البري للبضائع" },
      { value: "passenger_transport", label: "نقل الركاب" },
      { value: "car_rental", label: "تأجير السيارات" },
      { value: "delivery_services", label: "خدمات التوصيل" },
      { value: "warehousing", label: "التخزين والمستودعات" },
    ],
    real_estate: [
      { value: "property_management", label: "إدارة الأملاك" },
      { value: "real_estate_development", label: "التطوير العقاري" },
      { value: "brokerage", label: "الوساطة العقارية" },
      { value: "valuation", label: "التقييم العقاري" },
    ],
    finance: [
      { value: "financial_consulting", label: "الاستشارات المالية" },
      { value: "insurance_brokerage", label: "الوساطة في التأمين" },
      { value: "fintech", label: "التقنية المالية" },
      { value: "accounting", label: "المحاسبة والمراجعة" },
    ],
    media: [
      { value: "advertising", label: "الدعاية والإعلان" },
      { value: "publishing", label: "النشر والتوزيع" },
      { value: "production", label: "الإنتاج الفني والمرئي" },
      { value: "digital_marketing", label: "التسويق الرقمي" },
    ],
    entertainment: [
      { value: "theme_parks", label: "مدن الملاهي" },
      { value: "cinemas", label: "دور السينما" },
      { value: "sports_clubs", label: "الأندية الرياضية" },
      { value: "gaming_centers", label: "مراكز الألعاب الإلكترونية" },
    ],
    energy: [
      { value: "renewable_energy", label: "الطاقة المتجددة" },
      { value: "oil_gas_services", label: "خدمات النفط والغاز" },
      { value: "electricity", label: "توليد ونقل الكهرباء" },
      { value: "mining", label: "التعدين" },
    ],
    consulting: [
      { value: "legal_consulting", label: "الاستشارات القانونية" },
      { value: "engineering_consulting", label: "الاستشارات الهندسية" },
      { value: "hr_consulting", label: "استشارات الموارد البشرية" },
      { value: "safety_consulting", label: "استشارات السلامة" },
    ],
    security: [
      { value: "security_guards", label: "الحراسات الأمنية" },
      { value: "security_systems", label: "الأنظمة الأمنية" },
      { value: "cyber_security_services", label: "خدمات الأمن السيبراني" },
    ],
    environment: [
      { value: "waste_management", label: "إدارة النفايات" },
      { value: "recycling", label: "إعادة التدوير" },
      { value: "environmental_consulting", label: "الاستشارات البيئية" },
      { value: "landscaping", label: "تنسيق الحدائق" },
    ],
  };

  // Validation Handlers
  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setNationalId(value);
      if (value.length === 10) {
        setNationalIdError('');
      }
    }
  };

  const handleNationalIdBlur = () => {
    if (nationalId.length !== 10) {
      setNationalIdError('رقم الهوية يجب أن يتكون من 10 أرقام');
    } else {
      setNationalIdError('');
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 9) {
      setMobileNumber(value);
      if (value.length === 9) {
        setMobileNumberError('');
      }
    }
  };

  const handleMobileBlur = () => {
    if (mobileNumber.length !== 9) {
      setMobileNumberError('رقم الجوال يجب أن يتكون من 9 أرقام');
    } else {
      setMobileNumberError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleEmailBlur = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('البريد الإلكتروني غير صحيح');
    } else {
      setEmailError('');
    }
  };

  const handleNamePartChange = (part: keyof typeof nameParts, value: string) => {
    setNameParts(prev => ({ ...prev, [part]: value }));
    if (validationErrors[`nameParts${part.charAt(0).toUpperCase() + part.slice(1)}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`nameParts${part.charAt(0).toUpperCase() + part.slice(1)}`];
        return newErrors;
      });
    }
  };

  // CR Number Blur Handler
  const handleCrNumberBlur = () => {
    if (crNumber && crNumber.length !== 10) {
      setValidationErrors(prev => ({
        ...prev,
        crNumber: 'يجب أن يتكون رقم السجل التجاري من 10 أرقام'
      }));
    }
  };

  // Trademark Name Handlers
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

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!generalActivity) errors.generalActivity = 'مطلوب';
    if (!specialActivity) errors.specialActivity = 'مطلوب';
    if (!capitalAmount) errors.capitalAmount = 'مطلوب';
    if (!ownerType) errors.ownerType = 'مطلوب';
    
    // Validate CR Number if visible
    if ((serviceName === 'تجديد سجل تجاري' || serviceName === 'تعديل سجل تجاري' || serviceName === 'مستخرج سجل تجاري / الإفادة التجارية') && (!crNumber || crNumber.length !== 10)) {
      errors.crNumber = 'يجب إدخال رقم السجل التجاري (10 أرقام)';
    }

    if (serviceName === 'تسجيل علامة تجارية') {
      if (!trademarkArabicName) errors.trademarkArabicName = 'مطلوب';
      if (!trademarkEnglishName) errors.trademarkEnglishName = 'مطلوب';
    } else {
      if (!nameType) errors.nameType = 'مطلوب';
      if (!nameParts.first) errors.namePartsFirst = 'مطلوب';
      if (!nameParts.second) errors.namePartsSecond = 'مطلوب';
      if (!nameParts.third) errors.namePartsThird = 'مطلوب';
      if (nameType === 'quadruple' && !nameParts.fourth) errors.namePartsFourth = 'مطلوب';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Proceed with save
      console.log('Form valid, saving...');
      // Mark current step as completed
      setCompletedSteps(prev => [...prev, 4]);
      // Navigate to next page or show success
      setLocation('/service-summary');
    } else {
      console.log('Form invalid', validationErrors);
    }
  };

  // Generate Approved Commercial Name
  const getApprovedName = () => {
    if (serviceName === 'تسجيل علامة تجارية') {
      return `${trademarkArabicName || '---'} ${trademarkEnglishName || '---'}`;
    }

    const parts = [nameParts.first, nameParts.second, nameParts.third];
    if (nameType === 'quadruple') parts.push(nameParts.fourth);
    
    const fullName = parts.filter(p => p).join(' ');
    
    let suffix = 'للتجارة';
    if (generalActivity === 'contracting') suffix = 'للمقاولات';
    else if (generalActivity === 'services') suffix = 'للخدمات العامة';
    else if (generalActivity === 'industry') suffix = 'للصناعة';
    else if (generalActivity === 'agriculture') suffix = 'للزراعة';
    else if (generalActivity === 'education') suffix = 'للتعليم والتدريب';
    else if (generalActivity === 'health') suffix = 'للصحة والأنشطة الطبية';
    else if (generalActivity === 'technology') suffix = 'لتقنية المعلومات';
    else if (generalActivity === 'tourism') suffix = 'للسياحة والسفر';
    else if (generalActivity === 'transport') suffix = 'للنقل والخدمات اللوجستية';
    else if (generalActivity === 'real_estate') suffix = 'للعقارات';
    else if (generalActivity === 'finance') suffix = 'للخدمات المالية';
    else if (generalActivity === 'media') suffix = 'للإعلام والنشر';
    else if (generalActivity === 'entertainment') suffix = 'للترفيه';
    else if (generalActivity === 'energy') suffix = 'للطاقة';
    else if (generalActivity === 'consulting') suffix = 'للاستشارات';
    else if (generalActivity === 'security') suffix = 'للخدمات الأمنية';
    else if (generalActivity === 'environment') suffix = 'للخدمات البيئية';
    
    return fullName ? `مؤسسة ${fullName} ${suffix}` : 'مؤسسة ........................................';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo.svg" alt="SBC Logo" className="h-10" />
            <div className="hidden md:block h-6 w-px bg-gray-200"></div>
            <h1 className="hidden md:block text-lg font-bold text-gray-800">المركز السعودي للأعمال</h1>
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
        <SBCStepper currentStep={4} />

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
                          onChange={handleMobileChange}
                          onBlur={handleMobileBlur}
                          placeholder="5XXXXXXXX" 
                          className={`bg-white border-gray-200 h-10 flex-1 font-mono ${mobileNumberError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                      </div>
                      {mobileNumberError && <p className="text-xs text-red-500 mt-1 text-right">{mobileNumberError}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">البريد الإلكتروني <span className="text-red-500">*</span></Label>
                      <Input 
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        placeholder="example@domain.com" 
                        className={`bg-white border-gray-200 h-10 text-left ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        dir="ltr"
                      />
                      {emailError && <p className="text-xs text-red-500 mt-1 text-right">{emailError}</p>}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <Label className="text-gray-500 text-xs mb-1 block text-right">العنوان الوطني (تلقائي)</Label>
                      <div className="relative">
                        <Input 
                          value="الرياض - حي الملز - شارع صلاح الدين الأيوبي - مبنى 1234" 
                          readOnly 
                          className="bg-gray-50 border-gray-200 h-10 text-right text-gray-500 pr-10"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      </div>
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
                      <Select value={generalActivity} onValueChange={(val) => {
                        setGeneralActivity(val);
                        setSpecialActivity(''); // Reset special activity when general changes
                      }}>
                        <SelectTrigger className={`bg-gray-50 border-gray-200 h-10 text-right flex-row-reverse w-full justify-between ${validationErrors.generalActivity ? 'border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder="اختر النشاط العام" />
                        </SelectTrigger>
                        {validationErrors.generalActivity && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.generalActivity}</p>}
                        <SelectContent align="end" side="bottom" sideOffset={4} avoidCollisions={false} className="w-[var(--radix-select-trigger-width)] max-h-[300px]" dir="rtl">
                          <SelectItem value="trade" className="text-right justify-start cursor-pointer pr-8">التجارة</SelectItem>
                          <SelectItem value="contracting" className="text-right justify-start cursor-pointer pr-8">المقاولات</SelectItem>
                          <SelectItem value="services" className="text-right justify-start cursor-pointer pr-8">الخدمات</SelectItem>
                          <SelectItem value="industry" className="text-right justify-start cursor-pointer pr-8">الصناعة</SelectItem>
                          <SelectItem value="agriculture" className="text-right justify-start cursor-pointer pr-8">الزراعة</SelectItem>
                          <SelectItem value="education" className="text-right justify-start cursor-pointer pr-8">التعليم</SelectItem>
                          <SelectItem value="health" className="text-right justify-start cursor-pointer pr-8">الصحة</SelectItem>
                          <SelectItem value="technology" className="text-right justify-start cursor-pointer pr-8">التقنية</SelectItem>
                          <SelectItem value="tourism" className="text-right justify-start cursor-pointer pr-8">السياحة</SelectItem>
                          <SelectItem value="transport" className="text-right justify-start cursor-pointer pr-8">النقل</SelectItem>
                          <SelectItem value="real_estate" className="text-right justify-start cursor-pointer pr-8">العقارات</SelectItem>
                          <SelectItem value="finance" className="text-right justify-start cursor-pointer pr-8">المالية</SelectItem>
                          <SelectItem value="media" className="text-right justify-start cursor-pointer pr-8">الإعلام والنشر</SelectItem>
                          <SelectItem value="entertainment" className="text-right justify-start cursor-pointer pr-8">الترفيه</SelectItem>
                          <SelectItem value="energy" className="text-right justify-start cursor-pointer pr-8">الطاقة</SelectItem>
                          <SelectItem value="consulting" className="text-right justify-start cursor-pointer pr-8">الاستشارات</SelectItem>
                          <SelectItem value="security" className="text-right justify-start cursor-pointer pr-8">الأمن</SelectItem>
                          <SelectItem value="environment" className="text-right justify-start cursor-pointer pr-8">البيئة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Special Activity */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">النشاط الخاص</Label>
                      <Select value={specialActivity} onValueChange={setSpecialActivity} disabled={!generalActivity}>
                        <SelectTrigger className={`bg-gray-50 border-gray-200 h-10 text-right flex-row-reverse w-full justify-between ${validationErrors.specialActivity ? 'border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder="اختر النشاط الخاص" />
                        </SelectTrigger>
                        {validationErrors.specialActivity && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.specialActivity}</p>}
                        <SelectContent align="end" side="bottom" sideOffset={4} avoidCollisions={false} className="w-[var(--radix-select-trigger-width)]" dir="rtl">
                          {generalActivity && activitiesData[generalActivity]?.map((activity) => (
                            <SelectItem key={activity.value} value={activity.value} className="text-right justify-start cursor-pointer pr-8">
                              {activity.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Capital Amount */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">رأس المال</Label>
                      <Input 
                        type="number"
                        value={capitalAmount}
                        onChange={(e) => setCapitalAmount(e.target.value)}
                        placeholder="1000" 
                        className={`bg-gray-50 border-gray-200 h-10 text-right placeholder:text-gray-400 ${validationErrors.capitalAmount ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                      {validationErrors.capitalAmount && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.capitalAmount}</p>}
                    </div>

                    {/* Currency */}
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block text-right">العملة</Label>
                      <Select defaultValue="sar" disabled>
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-10 text-right flex-row-reverse w-full justify-between text-gray-500">
                          <SelectValue placeholder="ريال سعودي" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          <SelectItem value="sar">ريال سعودي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                    <div className="mt-0.5 text-blue-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      أقل قيمة لرأس المال: 1.00 ريال سعودي
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commercial Name Data Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 border-r-4 border-green-500 pr-3">
                <h2 className="text-lg font-bold text-gray-800">
                  {serviceName === 'تسجيل علامة تجارية' ? 'بيانات العلامة التجارية' : 'بيانات الاسم التجاري'}
                </h2>
              </div>
              
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                  {/* Styled Header Bar */}
                  <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden mb-6 h-12 relative bg-gray-50">
                    {/* Right Panel (Main Activities) */}
                    <div className="w-1/2 h-full bg-white flex items-center justify-center text-sm font-bold text-gray-700">
                      {serviceName === 'تسجيل علامة تجارية' ? 'اسم العلامة التجارية بالعربي' : 'نوع الاسم التجاري'}
                    </div>
                    
                    {/* Left Panel (Commercial Activity Name) */}
                    <div className="w-1/2 h-full bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-500">
                      {serviceName === 'تسجيل علامة تجارية' ? 'اسم العلامة التجارية بالانجليزي' : 'الاسم التجاري'}
                    </div>

                    {/* The Arrow Overlay - Centered */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-full z-10 h-full">
                      <svg width="24" height="100%" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block h-full">
                        <path d="M24 0L0 24L24 48" fill="white" />
                        <path d="M24 0L0 24L24 48" stroke="#E5E7EB" strokeWidth="1" fill="none" />
                      </svg>
                    </div>
                  </div>

                  {/* CR Number Field - Conditionally Rendered */}
                  {(serviceName === 'تجديد سجل تجاري' || serviceName === 'تعديل سجل تجاري' || serviceName === 'مستخرج سجل تجاري / الإفادة التجارية') && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      <div className="md:col-span-1">
                        <Label className="text-gray-500 text-xs mb-1 block text-right">رقم السجل التجاري</Label>
                        <Input 
                          value={crNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) setCrNumber(val);
                            if (val.length === 10 && validationErrors.crNumber) {
                              setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.crNumber;
                                return newErrors;
                              });
                            }
                          }}
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

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3 mb-6">
                    <div className="mt-0.5 text-blue-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      <span className="font-bold ml-1">الاسم التجاري المعتمد</span>
                      <span className="text-gray-900 font-bold">{getApprovedName()}</span>
                    </p>
                  </div>

                  {/* Managers Section or Trademark Image Upload */}
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    {serviceName === 'تسجيل علامة تجارية' ? (
                      <div className="space-y-4">
                        <Label className="text-sm font-bold text-gray-700 block text-right">
                          صورة العلامة التجارية <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setTrademarkImage(e.target.files[0]);
                              }
                            }}
                          />
                          <div className="flex flex-col items-center justify-center gap-2">
                            {trademarkImage ? (
                              <>
                                <div className="text-green-600 font-medium">{trademarkImage.name}</div>
                                <div className="text-xs text-gray-500">انقر لتغيير الصورة</div>
                              </>
                            ) : (
                              <>
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17 8L12 3L7 8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 3V15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                                <div className="text-sm text-gray-600 font-medium">اضغط هنا لرفع الصورة</div>
                                <div className="text-xs text-gray-400">PNG, JPG, GIF حتى 5 ميجابايت</div>
                              </>
                            )}
                          </div>
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
                                      <SelectItem value="general_manager">مدير عام</SelectItem>
                                      <SelectItem value="executive_manager">مدير تنفيذي</SelectItem>
                                      <SelectItem value="financial_manager">مدير مالي</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-xs mb-1 block text-right">اسم المدير {managers.length > 1 ? index + 1 : ''}</Label>
                                  <Input 
                                    value={manager.name}
                                    onChange={(e) => {
                                      const newManagers = [...managers];
                                      newManagers[index].name = e.target.value;
                                      setManagers(newManagers);
                                    }}
                                    placeholder="اسم المدير" 
                                    className="bg-gray-50 border-gray-200 h-9 text-right placeholder:text-gray-400"
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
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setManagers([...managers, { id: Date.now(), type: '', name: '' }])}
                              className="mt-2 text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Plus className="h-4 w-4 ml-2" />
                              إضافة مدير آخر
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8">
              <Button 
                variant="outline" 
                className="h-12 px-8 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                onClick={() => setLocation('/service-selection')}
              >
                رجوع
              </Button>
              <Button 
                className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                onClick={handleSave}
              >
                حفظ
              </Button>
            </div>
          </div>

          {/* Left Column - Summary/Help */}
          <div className="lg:col-span-4 space-y-6">
            {/* Help Card */}
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">تحتاج مساعدة؟</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  فريق الدعم لدينا جاهز لمساعدتك في أي وقت. يمكنك التواصل معنا عبر القنوات التالية.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 16.92V19.92C22.0011 20.1986 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.4019C21.1468 21.5901 20.9046 21.733 20.6411 21.8212C20.3776 21.9093 20.0987 21.9408 19.823 21.913C16.7661 21.5806 13.8271 20.5342 11.19 18.86C8.71897 17.3167 6.68326 15.281 5.13998 12.81C3.46577 10.1729 2.41938 7.23394 2.08698 4.17703C2.05918 3.90134 2.09068 3.62243 2.17886 3.35891C2.26704 3.09539 2.40993 2.85317 2.59814 2.64793C2.78635 2.44269 3.01545 2.27912 3.27065 2.16753C3.52585 2.05594 3.80144 1.99893 4.08002 2.00003H7.08002C7.56582 1.99612 8.03539 2.17316 8.40277 2.4988C8.77015 2.82444 8.99998 3.26632 9.05002 3.75003C9.14324 4.65654 9.36537 5.54672 9.71002 6.39003C9.84714 6.72288 9.87629 7.09146 9.79328 7.44186C9.71027 7.79226 9.51945 8.10638 9.24902 8.33803L7.97902 9.60803C9.40253 12.1115 11.4765 14.1855 13.98 15.609L15.25 14.339C15.4817 14.0686 15.7958 13.8778 16.1462 13.7948C16.4966 13.7118 16.8652 13.7409 17.198 13.878C18.0413 14.2227 18.9315 14.4448 19.838 14.538C20.3255 14.5886 20.7699 14.8217 21.0955 15.1936C21.4211 15.5655 21.5969 16.0398 21.59 16.53V16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>19900</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
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
                    <span>يمكنك حفظ الطلب كمسودة والعودة إليه لاحقاً.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>راجع الأنشطة التجارية المختارة بعناية لتجنب رفض الطلب.</span>
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
