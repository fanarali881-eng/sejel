import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import SBCSidebar from '@/components/SBCSidebar';
import SBCStepper from '@/components/SBCStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ArrowRight, X, CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { countries } from '@/lib/countries';
import { MapView } from '@/components/Map';

const UpdateInfo = () => {
  const [location] = useLocation();
  
  // Extract service name from query params or default to a generic title
  const searchParams = new URLSearchParams(window.location.search);
  const serviceName = searchParams.get('service') || 'تحديث بيانات الخدمة';
  const requestId = searchParams.get('id') || 'ECR100138';

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
  const [addManagers, setAddManagers] = useState(false);
  const [managers, setManagers] = useState([{ id: 1, type: '', name: '' }]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [calendarType, setCalendarType] = useState<'gregorian' | 'hijri'>('gregorian');
  const [hijriDate, setHijriDate] = useState({ day: '', month: '', year: '' });

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
      { value: "building", label: "تشييد المباني" },
      { value: "roads", label: "إنشاء الطرق" },
      { value: "electrical", label: "الأعمال الكهربائية" },
      { value: "plumbing", label: "أعمال السباكة" },
    ],
    services: [
      { value: "marketing", label: "التسويق" },
      { value: "consulting", label: "الاستشارات" },
      { value: "maintenance", label: "الصيانة" },
      { value: "cleaning", label: "النظافة" },
      { value: "it", label: "تقنية المعلومات" },
    ],
    industry: [
      { value: "food", label: "الصناعات الغذائية" },
      { value: "chemical", label: "الصناعات الكيميائية" },
      { value: "metal", label: "الصناعات المعدنية" },
      { value: "textile", label: "صناعة المنسوجات" },
    ],
    agriculture: [
      { value: "crops", label: "زراعة المحاصيل" },
      { value: "livestock", label: "تربية المواشي" },
      { value: "fishery", label: "صيد الأسماك" },
    ]
  };

  // Reset special activity when general activity changes
  const handleGeneralActivityChange = (value: string) => {
    setGeneralActivity(value);
    setSpecialActivity('');
  };

  // Capital Amount Handler
  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCapitalAmount(e.target.value);
  };

  // Owner Type Handler (Arabic Only)
  const handleOwnerTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only Arabic characters and spaces
    if (value === '' || /^[\u0600-\u06FF\s]+$/.test(value)) {
      setOwnerType(value);
    }
  };

  const handleCapitalBlur = () => {
    if (!capitalAmount) return;
    
    let value = parseInt(capitalAmount, 10);
    
    if (isNaN(value)) {
      setCapitalAmount('');
      return;
    }

    // Enforce minimum of 1000
    if (value < 1000) {
      value = 1000;
    } else {
      // Round to nearest 1000
      value = Math.round(value / 1000) * 1000;
    }

    setCapitalAmount(value.toString());
  };
  
  // Name Parts Handler (Arabic Only)
  const handleNamePartChange = (part: keyof typeof nameParts, value: string) => {
    // Allow only Arabic characters and spaces
    if (value === '' || /^[\u0600-\u06FF\s]+$/.test(value)) {
      setNameParts(prev => ({ ...prev, [part]: value }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Owner Data
    if (!arabicName) errors.arabicName = 'مطلوب';
    if (!englishName) errors.englishName = 'مطلوب';
    if (!nationality) errors.nationality = 'مطلوب';
    if (!ownerType) errors.ownerType = 'مطلوب';
    if (!nationalId) errors.nationalId = 'مطلوب';
    
    if (calendarType === 'gregorian') {
      if (!dateOfBirth) errors.dateOfBirth = 'مطلوب';
    } else {
      if (!hijriDate.day || !hijriDate.month || !hijriDate.year) {
        errors.dateOfBirth = 'مطلوب';
      }
    }

    if (!gender) errors.gender = 'مطلوب';

    // Contact Info
    if (!mobileNumber) errors.mobileNumber = 'مطلوب';
    if (!email) errors.email = 'مطلوب';
    if (!address) errors.address = 'مطلوب';

    // Commercial Activities
    if (!generalActivity) errors.generalActivity = 'مطلوب';
    if (!specialActivity) errors.specialActivity = 'مطلوب';
    if (!capitalAmount) errors.capitalAmount = 'مطلوب';

    // Commercial Name
    if (!nameType) errors.nameType = 'مطلوب';
    if (!nameParts.first) errors.namePartsFirst = 'مطلوب';
    if (!nameParts.second) errors.namePartsSecond = 'مطلوب';
    if (!nameParts.third) errors.namePartsThird = 'مطلوب';
    if (nameType === 'quadruple' && !nameParts.fourth) errors.namePartsFourth = 'مطلوب';

    if (Object.keys(errors).length > 0) {
      isValid = false;
      setValidationErrors(errors);
      
      // Scroll to top or first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setValidationErrors({});
    }

    return isValid;
  };

  // Map refs
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  // Validation handlers
  const handleArabicNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only Arabic characters and spaces
    if (value === '' || /^[\u0600-\u06FF\s]+$/.test(value)) {
      setArabicName(value);
    }
  };

  const handleEnglishNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only English characters and spaces
    if (value === '' || /^[a-zA-Z\s]+$/.test(value)) {
      setEnglishName(value);
    }
  };

  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers
    if (value !== '' && !/^\d+$/.test(value)) {
      return;
    }

    // Max length 10
    if (value.length > 10) {
      return;
    }

    // Check starting digit (must be 1 or 2) if not empty
    if (value.length > 0 && !['1', '2'].includes(value[0])) {
      return;
    }

    setNationalId(value);

    // Validate length for error message
    if (value.length > 0 && value.length < 10) {
      setNationalIdError('يجب أن يتكون رقم الهوية من 10 أرقام');
    } else {
      setNationalIdError('');
    }
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numbers
    if (value !== '' && !/^\d+$/.test(value)) {
      return;
    }

    // Validation logic based on country code
    if (countryCode === '+966') {
      // Saudi Arabia Validation
      if (value.length > 10) return; // Max length 10 for SA

      setMobileNumber(value);

      if (value.length > 0) {
        if (value.length < 10) {
          setMobileNumberError('يجب أن يتكون رقم الجوال من 10 أرقام');
        } else {
          const validPrefixes = ['050', '053', '054', '055', '056', '057', '058', '059'];
          const prefix = value.substring(0, 3);
          if (!validPrefixes.includes(prefix)) {
            setMobileNumberError('يجب أن يبدأ رقم الجوال بـ 050, 053, 054, 055, 056, 057, 058, 059');
          } else {
            setMobileNumberError('');
          }
        }
      } else {
        setMobileNumberError('');
      }
    } else {
      // International Validation (Generic)
      if (value.length > 15) return; // Max length 15 for international

      setMobileNumber(value);

      if (value.length > 0) {
        if (value.length < 7) {
          setMobileNumberError('يجب أن يتكون رقم الجوال من 7 أرقام على الأقل');
        } else {
          setMobileNumberError('');
        }
      } else {
        setMobileNumberError('');
      }
    }
  };

  // Re-validate when country code changes
  useEffect(() => {
    // Trigger validation logic with current mobile number and new country code
    // We can reuse the logic by calling a validation function, but for simplicity we'll just clear error if switching to non-SA
    if (countryCode !== '+966') {
       if (mobileNumber.length >= 7 && mobileNumber.length <= 15) {
         setMobileNumberError('');
       }
    } else {
       // Re-apply SA validation if switching back to SA
       if (mobileNumber.length > 0) {
          if (mobileNumber.length !== 10) {
             setMobileNumberError('يجب أن يتكون رقم الجوال من 10 أرقام');
          } else {
             const validPrefixes = ['050', '053', '054', '055', '056', '057', '058', '059'];
             const prefix = mobileNumber.substring(0, 3);
             if (!validPrefixes.includes(prefix)) {
                setMobileNumberError('يجب أن يبدأ رقم الجوال بـ 050, 053, 054, 055, 056, 057, 058, 059');
             } else {
                setMobileNumberError('');
             }
          }
       }
    }
  }, [countryCode]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only English characters, numbers, and standard email symbols
    if (value !== '' && !/^[a-zA-Z0-9@._-]+$/.test(value)) {
      return;
    }

    setEmail(value);

    // Validate email format
    if (value.length > 0) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(value)) {
        setEmailError('البريد الإلكتروني غير صحيح');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
  };

  // Handle address change and geocoding
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
  };

  // Debounce geocoding to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      if (address && mapRef.current && window.google) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            
            // Update map center
            mapRef.current?.setCenter(location);
            mapRef.current?.setZoom(15);

            // Remove existing marker if any
            if (markerRef.current) {
              markerRef.current.map = null;
            }

            // Add new marker
            markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
              map: mapRef.current,
              position: location,
              title: address,
              gmpDraggable: true, // Enable dragging
            });

            // Add drag end listener
            markerRef.current.addListener('dragend', async (event: any) => {
              const newLat = event.latLng.lat();
              const newLng = event.latLng.lng();
              
              // Reverse geocoding
              const geocoder = new window.google.maps.Geocoder();
              const response = await geocoder.geocode({ location: { lat: newLat, lng: newLng } });
              
              if (response.results && response.results[0]) {
                setAddress(response.results[0].formatted_address);
              }
            });
          }
        });
      }
    }, 1000); // Wait 1 second after typing stops

    return () => clearTimeout(timer);
  }, [address]);

  // Handle map click
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng && mapRef.current && window.google) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      const location = { lat: newLat, lng: newLng };

      // Remove existing marker if any
      if (markerRef.current) {
        markerRef.current.map = null;
      }

      // Add new marker
      markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: location,
        gmpDraggable: true, // Enable dragging
      });

      // Add drag end listener to the new marker
      markerRef.current.addListener('dragend', async (dragEvent: any) => {
        const dragLat = dragEvent.latLng.lat();
        const dragLng = dragEvent.latLng.lng();
        
        // Reverse geocoding
        const geocoder = new window.google.maps.Geocoder();
        const response = await geocoder.geocode({ location: { lat: dragLat, lng: dragLng } });
        
        if (response.results && response.results[0]) {
          setAddress(response.results[0].formatted_address);
        }
      });

      // Reverse geocoding for the clicked location
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: location });
      
      if (response.results && response.results[0]) {
        setAddress(response.results[0].formatted_address);
      }
    }
  };

  const steps = [
    { id: 1, label: 'بيانات مالك المؤسسة', status: 'current' as const },
    { id: 2, label: 'بيانات الاسم التجاري و الأنشطة', status: 'upcoming' as const },
    { id: 3, label: 'بيانات الوقف', status: 'upcoming' as const },
    { id: 4, label: 'عنوان وبيانات اتصال المؤسسة', status: 'upcoming' as const },
    { id: 5, label: 'بيانات المديرين', status: 'upcoming' as const },
    { id: 6, label: 'ملخص الطلب', status: 'upcoming' as const },
  ];

  // List of countries (simplified for demo, usually this would be a long list)
  const nationalityCountries = [
    { value: "saudi", label: "المملكة العربية السعودية" },
    { value: "uae", label: "الإمارات العربية المتحدة" },
    { value: "kuwait", label: "الكويت" },
    { value: "bahrain", label: "البحرين" },
    { value: "oman", label: "عمان" },
    { value: "qatar", label: "قطر" },
    { value: "egypt", label: "مصر" },
    { value: "jordan", label: "الأردن" },
    { value: "other", label: "أخرى" }
  ];

  // Helper to get selected country details
  const selectedCountry = countries.find(c => c.dial_code === countryCode);

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
              <div className="flex gap-16">
                <div>
                  <span className="text-gray-500 ml-6">رقم الطلب</span>
                  <span className="font-bold text-gray-800">{requestId}</span>
                </div>
                <div>
                  <span className="text-gray-500 ml-6">الحالة</span>
                  <span className="font-bold text-gray-800">مسودة</span>
                </div>
                <div>
                  <span className="text-gray-500 ml-6">تاريخ الطلب</span>
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
                    <Input 
                      value={arabicName}
                      onChange={handleArabicNameChange}
                      placeholder="محمد عبدالله أحمد" 
                      className={`font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400 ${validationErrors.arabicName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {validationErrors.arabicName && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.arabicName}</p>}
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الاسم بالإنجليزي</Label>
                    <Input 
                      value={englishName}
                      onChange={handleEnglishNameChange}
                      placeholder="Mohammed Abdullah Ahmed" 
                      className={`font-bold text-gray-800 text-left placeholder:font-normal placeholder:text-gray-400 ${validationErrors.englishName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      dir="ltr" 
                    />
                    {validationErrors.englishName && <p className="text-xs text-red-500 mt-1 text-left">{validationErrors.englishName}</p>}
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الجنسية</Label>
                    <Select value={nationality} onValueChange={setNationality} dir="rtl">
                      <SelectTrigger className={`font-bold text-gray-800 w-full text-right ${validationErrors.nationality ? 'border-red-500 focus:ring-red-500' : ''}`}>
                        <SelectValue placeholder="اختر الجنسية" />
                      </SelectTrigger>
                      {validationErrors.nationality && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.nationality}</p>}
                      <SelectContent>
                        {nationalityCountries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">نوع المالك</Label>
                    <Input 
                      value={ownerType}
                      onChange={handleOwnerTypeChange}
                      placeholder="سعودي" 
                      className={`font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400 ${validationErrors.ownerType ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {validationErrors.ownerType && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.ownerType}</p>}
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">رقم الهوية الوطنية</Label>
                    <Input 
                      value={nationalId}
                      onChange={handleNationalIdChange}
                      placeholder="1012345678" 
                      className={`font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400 ${nationalIdError || validationErrors.nationalId ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {(nationalIdError || validationErrors.nationalId) && (
                      <p className="text-xs text-red-500 mt-1 text-right">{nationalIdError || validationErrors.nationalId}</p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Label className="text-gray-500 text-xs block">تاريخ الميلاد</Label>
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
                              "w-full justify-start text-right font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400",
                              !dateOfBirth && "text-muted-foreground font-normal",
                              validationErrors.dateOfBirth && "border-red-500 focus-visible:ring-red-500"
                            )}
                          >
                            <CalendarIcon className="ml-2 h-4 w-4" />
                            {dateOfBirth ? dateOfBirth.toLocaleDateString('en-CA') : <span>1985-10-25</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateOfBirth}
                            onSelect={setDateOfBirth}
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={maxDate.getFullYear()}
                            disabled={(date) => date > maxDate}
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-right font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400",
                              (!hijriDate.day || !hijriDate.month || !hijriDate.year) && "text-muted-foreground font-normal",
                              validationErrors.dateOfBirth && "border-red-500 focus-visible:ring-red-500"
                            )}
                          >
                            <CalendarIcon className="ml-2 h-4 w-4" />
                            {hijriDate.day && hijriDate.month && hijriDate.year 
                              ? `${hijriDate.year}-${hijriDate.month}-${hijriDate.day}` 
                              : <span>1405-01-01</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" align="start">
                          <div className="grid grid-cols-3 gap-2 w-[300px]">
                            <Select 
                              value={hijriDate.day} 
                              onValueChange={(val) => setHijriDate(prev => ({ ...prev, day: val }))} 
                              dir="rtl"
                            >
                              <SelectTrigger className={cn(validationErrors.dateOfBirth && !hijriDate.day && "border-red-500")}>
                                <SelectValue placeholder="اليوم" />
                              </SelectTrigger>
                              <SelectContent>
                                {hijriDays.map(d => (
                                  <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Select 
                              value={hijriDate.month} 
                              onValueChange={(val) => setHijriDate(prev => ({ ...prev, month: val }))} 
                              dir="rtl"
                            >
                              <SelectTrigger className={cn(validationErrors.dateOfBirth && !hijriDate.month && "border-red-500")}>
                                <SelectValue placeholder="الشهر" />
                              </SelectTrigger>
                              <SelectContent>
                                {hijriMonths.map(m => (
                                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select 
                              value={hijriDate.year} 
                              onValueChange={(val) => setHijriDate(prev => ({ ...prev, year: val }))} 
                              dir="rtl"
                            >
                              <SelectTrigger className={cn(validationErrors.dateOfBirth && !hijriDate.year && "border-red-500")}>
                                <SelectValue placeholder="السنة" />
                              </SelectTrigger>
                              <SelectContent>
                                {hijriYears.map(y => (
                                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    {validationErrors.dateOfBirth && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.dateOfBirth}</p>}
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الجنس</Label>
                    <Select value={gender} onValueChange={setGender} dir="rtl">
                      <SelectTrigger className={`font-bold text-gray-800 w-full text-right ${validationErrors.gender ? 'border-red-500 focus:ring-red-500' : ''}`}>
                        <SelectValue placeholder="اختر الجنس" />
                      </SelectTrigger>
                      {validationErrors.gender && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.gender}</p>}
                      <SelectContent>
                        <SelectItem value="male">ذكر</SelectItem>
                        <SelectItem value="female">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
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
                    {/* Right Side: Inputs (Swapped to be first in RTL grid) */}
                    <div className="space-y-6">
                      {/* Mobile Number */}
                      <div>
                        <Label className="text-gray-700 mb-2 block">رقم الجوال</Label>
                        <div className="flex gap-2" dir="ltr">
                          <Select value={countryCode} onValueChange={setCountryCode}>
                            <SelectTrigger className="w-[120px] bg-gray-50 border-gray-300 px-3">
                              <div className="flex items-center gap-2 w-full">
                                {selectedCountry && (
                                  <>
                                    <img 
                                      src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                                      srcSet={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png 2x`}
                                      width="24"
                                      height="16"
                                      alt={selectedCountry.name}
                                      className="rounded-sm object-cover"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{selectedCountry.dial_code.replace('+', '')}</span>
                                  </>
                                )}
                              </div>
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {countries.map((country) => (
                                <SelectItem key={country.code} value={country.dial_code}>
                                  <span className="flex items-center gap-3">
                                    <img 
                                      src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                      srcSet={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
                                      width="24"
                                      height="16"
                                      alt={country.name}
                                      className="rounded-sm object-cover"
                                    />
                                    <span className="text-sm text-gray-700">{country.name}</span>
                                    <span className="text-xs text-gray-500 ml-auto">{country.dial_code}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input 
                            value={mobileNumber}
                            onChange={handleMobileNumberChange}
                            placeholder={countryCode === '+966' ? "05xxxxxxxx" : ""} 
                            className={`text-left ${mobileNumberError || validationErrors.mobileNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                        </div>
                        {(mobileNumberError || validationErrors.mobileNumber) ? (
                          <p className="text-xs text-red-500 mt-1 text-right">{mobileNumberError || validationErrors.mobileNumber}</p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1 text-right">
                            {countryCode === '+966' ? 'يجب أن يكون بصيغة 05xxxxxxxx' : ''}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <Label className="text-gray-700 mb-2 block">البريد الإلكتروني</Label>
                        <Input 
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="someone@example.org" 
                          className={`text-left ${emailError || validationErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          dir="ltr" 
                        />
                        {(emailError || validationErrors.email) ? (
                          <p className="text-xs text-red-500 mt-1 text-right">{emailError || validationErrors.email}</p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1 text-right">يجب أن يكون بصيغة someone@example.org</p>
                        )}
                      </div>

                      {/* Address Input */}
                      <div>
                        <Label className="text-gray-700 mb-2 block">عنوان داخل المملكة</Label>
                        <div className="relative">
                          <Input 
                            value={address}
                            onChange={handleAddressChange}
                            placeholder="ابحث عن العنوان..." 
                            className={`pl-10 ${validationErrors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                          {validationErrors.address && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.address}</p>}
                          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Left Side: Map (Swapped to be second in RTL grid) */}
                    <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200">
                      <MapView 
                        className="w-full h-full"
                        initialCenter={{ lat: 24.7136, lng: 46.6753 }} // Riyadh
                        initialZoom={11}
                        onMapReady={(map) => {
                          mapRef.current = map;
                          // Add click listener to the map
                          map.addListener('click', handleMapClick);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commercial Activities Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 border-r-4 border-green-500 pr-3">
                <h2 className="text-lg font-bold text-gray-800">تحديد الأنشطة التجارية ورأس المال</h2>
              </div>
              
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                  {/* Styled Header Bar */}
                  <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden mb-6 h-12 relative bg-gray-50">
                    {/* Right Panel (Main Activities) */}
                    <div className="w-1/2 h-full bg-white flex items-center justify-center text-sm font-bold text-gray-700">
                      الأنشطة الرئيسية
                    </div>
                    
                    {/* Left Panel (Commercial Activity Name) */}
                    <div className="w-1/2 h-full bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-500">
                      اسم النشاط التجاري
                    </div>

                    {/* The Arrow Overlay - Centered */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-full z-10 h-full">
                      <svg width="24" height="100%" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block h-full">
                        <path d="M24 0L0 24L24 48" fill="white" />
                        <path d="M24 0L0 24L24 48" stroke="#E5E7EB" strokeWidth="1" fill="none" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex w-full gap-0">
                    {/* Right Dropdown (General Activity) - Matches "الأنشطة الرئيسية" width */}
                    <div className="w-1/2 pl-6">
                      <Label className="text-gray-500 text-xs mb-1 block text-right">النشاط العام</Label>
                      <Select value={generalActivity} onValueChange={handleGeneralActivityChange}>
                        <SelectTrigger className={`bg-gray-50 border-gray-200 h-9 text-right flex-row-reverse w-full justify-between ${validationErrors.generalActivity ? 'border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder="اختر النشاط العام" />
                        </SelectTrigger>
                        {validationErrors.generalActivity && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.generalActivity}</p>}
                        <SelectContent align="end" side="bottom" sideOffset={4} avoidCollisions={false} className="w-[var(--radix-select-trigger-width)]" dir="rtl">
                          <SelectItem value="trade" className="text-right justify-start cursor-pointer pr-8">التجارة</SelectItem>
                          <SelectItem value="contracting" className="text-right justify-start cursor-pointer pr-8">المقاولات</SelectItem>
                          <SelectItem value="services" className="text-right justify-start cursor-pointer pr-8">الخدمات</SelectItem>
                          <SelectItem value="industry" className="text-right justify-start cursor-pointer pr-8">الصناعة</SelectItem>
                          <SelectItem value="agriculture" className="text-right justify-start cursor-pointer pr-8">الزراعة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Left Dropdown (Special Activity) - Matches "اسم النشاط التجاري" width */}
                    <div className="w-1/2 pr-6">
                      <Label className="text-gray-500 text-xs mb-1 block text-right">النشاط الخاص</Label>
                      <Select value={specialActivity} onValueChange={setSpecialActivity} disabled={!generalActivity}>
                        <SelectTrigger className={`bg-gray-50 border-gray-200 h-9 text-right flex-row-reverse w-full justify-between ${validationErrors.specialActivity ? 'border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder={generalActivity ? "اختر النشاط الخاص" : "اختر النشاط العام أولاً"} />
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
                  </div>

                  {/* Capital and Currency Section */}
                  <div className="mt-8">
                    <div className="flex w-full gap-0 mb-4">
                      {/* Right: Currency */}
                      <div className="w-1/2 pl-6">
                        <Label className="text-gray-500 text-xs mb-1 block text-right">العملة</Label>
                        <Select defaultValue="sar">
                          <SelectTrigger className="bg-gray-50 border-gray-200 h-9 text-right flex-row-reverse w-full justify-between">
                            <SelectValue placeholder="اختر العملة" />
                          </SelectTrigger>
                          <SelectContent align="end" side="bottom" sideOffset={4} avoidCollisions={false} className="w-[var(--radix-select-trigger-width)]" dir="rtl">
                            <SelectItem value="sar" className="text-right justify-start cursor-pointer pr-8">ريال سعودي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Left: Capital Amount */}
                      <div className="w-1/2 pr-6">
                        <Label className="text-gray-500 text-xs mb-1 block text-right">رأس المال</Label>
                        <Input 
                          value={capitalAmount}
                          onChange={handleCapitalChange}
                          onBlur={handleCapitalBlur}
                          placeholder="1000"
                          className={`bg-gray-50 border-gray-200 h-9 text-right placeholder:text-gray-300 ${validationErrors.capitalAmount ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          type="number"
                          step="1000"
                          min="1000"
                        />
                        {validationErrors.capitalAmount && <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.capitalAmount}</p>}
                        {/* Info Alert Bar - Moved here to be under Capital input only */}
                        <div className="bg-blue-50 rounded-md p-2 mt-2 flex items-center justify-start gap-2 text-[#374151]">
                          <div className="w-4 h-4 rounded-full border border-[#6B7280] flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-[#6B7280] leading-none">i</span>
                          </div>
                          <span className="text-xs font-medium">أقل قيمة لرأس المال: 1.00 ريال سعودي</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commercial Name Data Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 border-r-4 border-green-500 pr-3">
                <h2 className="text-lg font-bold text-gray-800">بيانات الاسم التجاري</h2>
              </div>
              
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                  {/* Styled Header Bar */}
                  <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden mb-6 h-12 relative bg-gray-50">
                    {/* Right Panel (Main Activities) */}
                    <div className="w-1/2 h-full bg-white flex items-center justify-center text-sm font-bold text-gray-700">
                      نوع الاسم التجاري
                    </div>
                    
                    {/* Left Panel (Commercial Activity Name) */}
                    <div className="w-1/2 h-full bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-500">
                      الاسم التجاري
                    </div>

                    {/* The Arrow Overlay - Centered */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-full z-10 h-full">
                      <svg width="24" height="100%" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block h-full">
                        <path d="M24 0L0 24L24 48" fill="white" />
                        <path d="M24 0L0 24L24 48" stroke="#E5E7EB" strokeWidth="1" fill="none" />
                      </svg>
                    </div>
                  </div>

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
                          generalActivity === 'services' ? 'للخدمات' :
                          generalActivity === 'industry' ? 'للصناعة' :
                          generalActivity === 'agriculture' ? 'للزراعة' : ''
                        }`.trim()}
                      </span>
                    </div>
                    
                  </div>

                  {/* Managers Section */}
                  <div className="mt-6 border-t border-gray-100 pt-4">
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
                              <Label className="text-gray-500 text-xs mb-1 block text-right">اسم المدير {managers.length > 1 ? index + 1 : ''}</Label>
                              <div className="flex gap-2 items-center">
                                <Input 
                                  value={manager.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || /^[\u0600-\u06FF\s]+$/.test(val)) {
                                      const newManagers = [...managers];
                                      newManagers[index].name = val;
                                      setManagers(newManagers);
                                    }
                                  }}
                                  placeholder="الاسم الكامل" 
                                  className="bg-gray-50 border-gray-200 h-9 text-right placeholder:text-gray-400 flex-1"
                                />
                                <button 
                                  onClick={() => {
                                    const newManagers = managers.filter((_, i) => i !== index);
                                    setManagers(newManagers);
                                    if (newManagers.length === 0) {
                                      setAddManagers(false);
                                      setManagers([{ id: Date.now(), type: '', name: '' }]);
                                    }
                                  }}
                                  className="w-9 h-9 rounded-md bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors border border-red-100 flex-shrink-0"
                                  title="حذف المدير"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add Manager Button */}
                        {managers.length < 5 && (
                          <div className="flex justify-center mt-2">
                            <button 
                              onClick={() => setManagers([...managers, { id: Date.now(), type: '', name: '' }])}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors border border-gray-300"
                              title="إضافة مدير آخر"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" className="px-8">رجوع</Button>
              <div className="flex gap-4">
                <Button variant="outline" className="px-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">إلغاء</Button>
                <Button 
                  className="px-8 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (validateForm()) {
                      // Handle save
                      console.log('Form valid, saving...');
                    }
                  }}
                >
                  حفظ
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateInfo;
