import { Heart, Mail, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface ServiceHeroProps {
  serviceId?: string | null;
}

export default function ServiceHero({ serviceId }: ServiceHeroProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const getServiceTitle = () => {
    switch (serviceId) {
      case 'renew-cr':
        return 'تجديد سجل تجاري';
      case 'reserve-name':
        return 'حجز اسم تجاري';
      case 'edit-cr':
        return 'تعديل سجل تجاري';
      case 'commercial-extract':
        return 'مستخرج سجل تجاري / الإفادة التجارية';
      case 'issue-license':
        return 'إصدار رخصة تجارية';
      case 'register-trademark':
        return 'تسجيل علامة تجارية';
      case 'renew-license':
        return 'تجديد رخصة تجارية';
      case 'renew-passport':
        return 'تجديد الجواز السعودي';
      case 'issue-driving-license':
        return 'إصدار رخصة قيادة';
      case 'renew-national-id':
        return 'تجديد الهوية الوطنية';
      case 'new-cr':
      default:
        return 'قيد سجل تجاري لمؤسسة فردية';
    }
  };

  const getServiceDescription = () => {
    switch (serviceId) {
      case 'renew-cr':
        return 'خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين تجديد السجل التجاري، دون الحاجة إلى زيارة مراكز الخدمة.';
      case 'reserve-name':
        return 'خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين حجز اسم تجاري، خلال مدة أقصاها (60) يومًا؛ لحين إصدار السجل التجاري ودون الحاجة إلى زيارة مراكز الخدمة.';
      case 'edit-cr':
        return 'خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين تعديل بيانات السجل التجاري الحالي، دون الحاجة إلى زيارة مراكز الخدمة.';
      case 'commercial-extract':
        return 'خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين طلب مستخرج يحتوي على معلومات أي سجل تجاري، كما تتيح له التقديم على طلب إفادة عن إجراء معين؛ بهدف الحصول على مستند يتضمن تأكيدًا من الوزارة بحدوث هذا الإجراء، لتقديمه إلى من يهمه الأمر، دون الحاجة إلى زيارة مراكز الخدمة.';
      case 'issue-license':
        return 'خدمة إلكترونية تقدم في منصة بلدي يمكن من خلالها البدء بممارسة العمل التجاري من خلال إصدار رخصة نشاط تجاري بالإضافة إلى تصريح السلامة الصادر من المديرية العامة للدفاع المدني لجميع الأنشطة التجارية المعتمدة لدى وزارة البلديات والإسكان دون الحاجة لمراجعة الجهة.';
      case 'register-trademark':
        return 'خدمة تقدم الكترونيا تتيح للمستخدم طلب تسجيل العلامة التجارية. العلامات التجارية هي الإبداعات التي تكون على شكل أسماء، كلمات ، إمضاءات، حروف، رموز، وأرقام، عناوين، وأختام، وكذلك التصميمات والرسوم والصور، والنقوش المميزة، أو طريقة تغليف عناصر تصويرية؛ أو أشكال، أو لون أو مجموعة ألوان أو مزيج من ذلك أو أية إشارة أو مجموعة إشارات إذا كانت تستخدم أو يراد استخدامها في تمييز سلع أو خدمات منشأة ما.';
      case 'renew-license':
        return 'من خلال هذه الخدمة الإلكترونية يمكنك تعزيز استمرارية عملك التجاري حيث تمكنك هذه الخدمة من تجديد رخصتك التجارية، كما يمكنك تجديد مع تعديل بيانات الرخصة.';
      case 'renew-passport':
        return 'خدمة إلكترونية تمكن المواطن من تجديد جواز السفر السعودي له أو لأحد أفراد أسرته إلكترونياً.';
      case 'issue-driving-license':
        return 'خدمة إلكترونية تمكن المواطن والمقيم من إصدار رخصة قيادة خاصة أو عامة بعد إتمام المتطلبات اللازمة.';
      case 'renew-national-id':
        return 'تتيح هذه الخدمة للمواطنين والمواطنات تجديد الهوية الوطنية إلكترونيًا باستخدام أحدث تقنيات التعرف على الوجه، مع طلب توصيل الوثيقة إلى عنوان المستفيد المسجل دون الحاجة لمراجعة مكاتب الأحوال المدنية.';
      case 'new-cr':
      default:
        return 'خدمة إلكترونية تقدمها وزارة التجارة عبر منصة المركز السعودي للأعمال، تتيح للمستفيدين البدء في مُمارسة النشاط التجاري، دون الحاجة إلى زيارة مراكز الخدمة.';
    }
  };

  const handleStartService = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/login");
    }, 3000);
  };

  return (
    <div className="bg-[#f8f9fa] py-12 relative">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Right Side: Content */}
          <div className="flex flex-col items-start text-right flex-1 md:pl-12 w-full">
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#004d30] mb-3">
              {getServiceTitle()}
            </h1>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              <span className="bg-[#e6f2ff] text-[#0075c9] text-xs font-bold px-3 py-1 rounded">
                {serviceId === 'issue-license' || serviceId === 'renew-license' ? 'الهيئة الملكية لمحافظة العلا' : serviceId === 'register-trademark' ? 'الهيئة السعودية للملكية الفكرية' : serviceId === 'renew-passport' ? 'المديرية العامة للجوازات' : serviceId === 'issue-driving-license' ? 'الإدارة العامة للمرور' : serviceId === 'renew-national-id' ? 'وكالة وزارة الداخلية للأحوال المدنية' : 'وزارة التجارة'}
              </span>
              <span className="bg-[#e6fffa] text-[#006c35] text-xs font-bold px-3 py-1 rounded">
                الاكثر استخداما
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-800 mb-2 max-w-3xl leading-relaxed text-base font-medium">
              {getServiceDescription()}
            </p>

            {/* SLA Link */}
            <a href="#" className="text-[#006c35] font-bold hover:underline text-sm mb-6 flex items-center gap-1">
              اتفاقية مستوى الخدمة
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-start gap-3 w-full">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded flex items-center gap-2 hover:bg-gray-50 transition-colors font-bold text-sm">
                <span>تفضيل الصفحة</span>
                <Heart className="w-4 h-4" />
              </button>
              <button 
                onClick={handleStartService}
                disabled={isLoading}
                className="bg-[#006c35] text-white px-8 py-2 rounded font-bold hover:bg-[#005c2d] transition-colors text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px] justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "ابدأ الخدمة"
                )}
              </button>
            </div>

          </div>

          {/* Left Side: Share Box */}
          <div className="w-full md:w-auto mt-8 md:mt-0">
            <div className="bg-[#f0fdf4] p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-[#006c35] text-center font-bold mb-3 text-sm">مشاركة الصفحة</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-[#006c35] rounded text-white flex items-center justify-center hover:bg-[#005c2d]">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-[#006c35] rounded text-white flex items-center justify-center hover:bg-[#005c2d]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.66C14.25 3.66 16.31 4.5 17.87 6.07C19.42 7.63 20.28 9.7 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.66 12.05 3.66Z" /></svg>
                </button>
                <button className="w-8 h-8 bg-[#006c35] rounded text-white flex items-center justify-center hover:bg-[#005c2d]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" /></svg>
                </button>
                <button className="w-8 h-8 bg-[#006c35] rounded text-white flex items-center justify-center hover:bg-[#005c2d]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" /></svg>
                </button>
                <button className="w-8 h-8 bg-[#006c35] rounded text-white flex items-center justify-center hover:bg-[#005c2d]">
                  <span className="font-bold text-sm">𝕏</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
