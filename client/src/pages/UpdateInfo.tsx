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

    // Max length 10
    if (value.length > 10) {
      return;
    }

    setMobileNumber(value);

    // Validate length and prefix
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
  };

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
                    <Input 
                      value={arabicName}
                      onChange={handleArabicNameChange}
                      placeholder="محمد عبدالله أحمد" 
                      className="font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400" 
                    />
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الاسم بالإنجليزي</Label>
                    <Input 
                      value={englishName}
                      onChange={handleEnglishNameChange}
                      placeholder="Mohammed Abdullah Ahmed" 
                      className="font-bold text-gray-800 text-left placeholder:font-normal placeholder:text-gray-400" 
                      dir="ltr" 
                    />
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الجنسية</Label>
                    <Select value={nationality} onValueChange={setNationality} dir="rtl">
                      <SelectTrigger className="font-bold text-gray-800 w-full text-right">
                        <SelectValue placeholder="اختر الجنسية" />
                      </SelectTrigger>
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
                    <Input placeholder="سعودي" className="font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">رقم الهوية الوطنية</Label>
                    <Input 
                      value={nationalId}
                      onChange={handleNationalIdChange}
                      placeholder="1012345678" 
                      className={`font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400 ${nationalIdError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {nationalIdError && (
                      <p className="text-xs text-red-500 mt-1 text-right">{nationalIdError}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">تاريخ الميلاد</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-right font-bold text-gray-800 placeholder:font-normal placeholder:text-gray-400",
                            !dateOfBirth && "text-muted-foreground font-normal"
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
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الجنس</Label>
                    <Select value={gender} onValueChange={setGender} dir="rtl">
                      <SelectTrigger className="font-bold text-gray-800 w-full text-right">
                        <SelectValue placeholder="اختر الجنس" />
                      </SelectTrigger>
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
                            placeholder="5xxxxxxxx" 
                            className={`text-left ${mobileNumberError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                        </div>
                        {mobileNumberError ? (
                          <p className="text-xs text-red-500 mt-1 text-right">{mobileNumberError}</p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1 text-right">يجب أن يكون بصيغة 05xxxxxxxx</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <Label className="text-gray-700 mb-2 block">البريد الإلكتروني</Label>
                        <Input 
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="someone@example.org" 
                          className={`text-left ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          dir="ltr" 
                        />
                        {emailError ? (
                          <p className="text-xs text-red-500 mt-1 text-right">{emailError}</p>
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
                            className="pl-10"
                          />
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
                <h2 className="text-lg font-bold text-gray-800">تحديد الأنشطة التجارية</h2>
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
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-11 text-right flex-row-reverse w-full justify-between">
                          <SelectValue placeholder="اختر النشاط العام" />
                        </SelectTrigger>
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
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-11 text-right flex-row-reverse w-full justify-between">
                          <SelectValue placeholder={generalActivity ? "اختر النشاط الخاص" : "اختر النشاط العام أولاً"} />
                        </SelectTrigger>
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
                          <SelectTrigger className="bg-gray-50 border-gray-200 h-11 text-right flex-row-reverse w-full justify-between">
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
                          defaultValue="5000"
                          className="bg-gray-50 border-gray-200 h-11 text-right !h-11"
                          type="number"
                        />
                        {/* Info Alert Bar - Moved here to be under Capital input only */}
                        <div className="bg-[#F3F4F6] rounded-md p-2 mt-2 flex items-center justify-end gap-2 text-[#374151]">
                          <span className="text-xs font-medium">أقل قيمة لرأس المال: 1.00 ريال سعودي</span>
                          <div className="w-4 h-4 rounded-full border border-[#6B7280] flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-[#6B7280] leading-none">i</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" className="px-8">رجوع</Button>
              <div className="flex gap-4">
                <Button variant="outline" className="px-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">إلغاء</Button>
                <Button className="px-8 bg-green-600 hover:bg-green-700">حفظ</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateInfo;
