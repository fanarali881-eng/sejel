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
                      className="bg-gray-50 border-gray-200 h-11 text-right" 
                      placeholder="الاسم بالعربي" 
                    />
                    <p className="text-xs text-gray-400 mt-1 text-left">يجب أن يكون باللغة العربية</p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الاسم بالإنجليزي</Label>
                    <Input 
                      value={englishName}
                      onChange={handleEnglishNameChange}
                      className="bg-gray-50 border-gray-200 h-11 text-left" 
                      placeholder="English Name" 
                      dir="ltr"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-left">يجب أن يكون باللغة الإنجليزية</p>
                  </div>

                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الجنسية</Label>
                    <Select value={nationality} onValueChange={setNationality}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 h-11 text-right flex-row-reverse">
                        <SelectValue placeholder="اختر الجنسية" />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalityCountries.map((country) => (
                          <SelectItem key={country.value} value={country.value} className="text-right flex-row-reverse justify-end">
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">الجنس</Label>
                    <div className="flex gap-4">
                      <div 
                        className={cn(
                          "flex-1 h-11 flex items-center justify-center border rounded-md cursor-pointer transition-colors",
                          gender === 'male' 
                            ? "bg-green-50 border-green-500 text-green-700" 
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                        )}
                        onClick={() => setGender('male')}
                      >
                        ذكر
                      </div>
                      <div 
                        className={cn(
                          "flex-1 h-11 flex items-center justify-center border rounded-md cursor-pointer transition-colors",
                          gender === 'female' 
                            ? "bg-green-50 border-green-500 text-green-700" 
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                        )}
                        onClick={() => setGender('female')}
                      >
                        أنثى
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">رقم الهوية / الإقامة</Label>
                    <Input 
                      value={nationalId}
                      onChange={handleNationalIdChange}
                      className={cn(
                        "bg-gray-50 border-gray-200 h-11 text-right",
                        nationalIdError ? "border-red-500 focus-visible:ring-red-500" : ""
                      )}
                      placeholder="1xxxxxxxxx" 
                    />
                    {nationalIdError ? (
                      <p className="text-xs text-red-500 mt-1 text-left">{nationalIdError}</p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1 text-left">يجب أن يكون 10 أرقام ويبدأ بـ 1 أو 2</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">تاريخ الميلاد</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-11 justify-start text-right font-normal bg-gray-50 border-gray-200 hover:bg-gray-100",
                            !dateOfBirth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {dateOfBirth ? dateOfBirth.toLocaleDateString('en-US') : <span>اختر التاريخ</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={setDateOfBirth}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-gray-400 mt-1 text-left">التاريخ الميلادي</p>
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
                <CardContent className="p-6 grid grid-cols-12 gap-6">
                  {/* Map Section - Left Side (5 columns) */}
                  <div className="col-span-5 h-full min-h-[300px] rounded-lg overflow-hidden border border-gray-200">
                    <MapView 
                      onMapReady={(map) => {
                        mapRef.current = map;
                      }}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Inputs Section - Right Side (7 columns) */}
                  <div className="col-span-7 flex flex-col gap-6">
                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block">رقم الجوال</Label>
                      <div className="flex gap-2" dir="ltr">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-[110px] bg-gray-50 border-gray-200 h-10">
                            <SelectValue>
                              <div className="flex items-center gap-2">
                                {selectedCountry && (
                                  <>
                                    <img 
                                      src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                                      srcSet={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`}
                                      width="20"
                                      height="15"
                                      alt={selectedCountry.name}
                                      className="object-contain"
                                    />
                                    <span>{selectedCountry.dial_code}</span>
                                  </>
                                )}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.dial_code}>
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                                    width="20"
                                    height="15"
                                    alt={country.name}
                                    className="object-contain"
                                  />
                                  <span>{country.name}</span>
                                  <span className="text-gray-400 text-xs ml-auto">{country.dial_code}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input 
                          value={mobileNumber}
                          onChange={handleMobileNumberChange}
                          className={cn(
                            "flex-1 bg-gray-50 border-gray-200 h-10 text-left",
                            mobileNumberError ? "border-red-500 focus-visible:ring-red-500" : ""
                          )}
                          placeholder="5xxxxxxxx" 
                        />
                      </div>
                      {mobileNumberError ? (
                        <p className="text-xs text-red-500 mt-1 text-right" dir="rtl">{mobileNumberError}</p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1 text-right" dir="rtl">يجب أن يكون بصيغة 05xxxxxxxx</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block">البريد الإلكتروني</Label>
                      <Input 
                        value={email}
                        onChange={handleEmailChange}
                        className={cn(
                          "bg-gray-50 border-gray-200 h-11 text-left",
                          emailError ? "border-red-500 focus-visible:ring-red-500" : ""
                        )}
                        placeholder="someone@example.org" 
                        dir="ltr"
                      />
                      {emailError ? (
                        <p className="text-xs text-red-500 mt-1 text-right" dir="rtl">{emailError}</p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1 text-right" dir="rtl">يجب أن يكون بصيغة someone@example.org</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-gray-500 text-xs mb-1 block">عنوان داخل المملكة</Label>
                      <div className="relative">
                        <Input 
                          value={address}
                          onChange={handleAddressChange}
                          className="bg-gray-50 border-gray-200 h-11 text-right pr-10" 
                          placeholder="ابحث عن العنوان..." 
                        />
                        <MapPin className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                      </div>
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
                <CardContent className="p-6 grid grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">النشاط العام</Label>
                    <Select value={generalActivity} onValueChange={handleGeneralActivityChange}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 h-11 text-right flex-row-reverse">
                        <SelectValue placeholder="اختر النشاط العام" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trade" className="text-right flex-row-reverse justify-end">التجارة</SelectItem>
                        <SelectItem value="contracting" className="text-right flex-row-reverse justify-end">المقاولات</SelectItem>
                        <SelectItem value="services" className="text-right flex-row-reverse justify-end">الخدمات</SelectItem>
                        <SelectItem value="industry" className="text-right flex-row-reverse justify-end">الصناعة</SelectItem>
                        <SelectItem value="agriculture" className="text-right flex-row-reverse justify-end">الزراعة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-500 text-xs mb-1 block">النشاط الخاص</Label>
                    <Select value={specialActivity} onValueChange={setSpecialActivity} disabled={!generalActivity}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 h-11 text-right flex-row-reverse">
                        <SelectValue placeholder={generalActivity ? "اختر النشاط الخاص" : "اختر النشاط العام أولاً"} />
                      </SelectTrigger>
                      <SelectContent>
                        {generalActivity && activitiesData[generalActivity]?.map((activity) => (
                          <SelectItem key={activity.value} value={activity.value} className="text-right flex-row-reverse justify-end">
                            {activity.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <div className="flex gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 h-11">
                  حفظ
                </Button>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 px-8 h-11">
                  إلغاء
                </Button>
              </div>
              
              <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                رجوع
              </Button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateInfo;
