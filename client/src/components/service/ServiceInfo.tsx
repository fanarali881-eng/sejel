import { User, Clock, Monitor, Languages, HelpCircle, ExternalLink, MapPin, FileText, Phone, Mail } from "lucide-react";

export default function ServiceInfo() {
  return (
    <div className="space-y-8 hidden lg:block text-right">
      {/* Target Audience */}
      <div className="flex items-start justify-end gap-3 text-right">
        <div className="flex flex-col items-end">
          <p className="text-base text-gray-900 font-medium mb-1">أعمال , التجار</p>
          <h3 className="text-gray-500 text-sm mb-2">الجمهور المستهدف</h3>
          <p className="text-sm text-gray-900 font-medium mb-1">كبار السن , المرأة , الشباب , الأشخاص</p>
          <p className="text-sm text-gray-900 font-medium mb-1">ذوي الإعاقة</p>
          <h3 className="text-gray-500 text-sm">صفة المستخدم</h3>
        </div>
        <User className="w-6 h-6 text-[#006C35] mt-1" strokeWidth={1.5} />
      </div>

      {/* Duration */}
      <div className="flex items-start justify-end gap-3 text-right">
        <div className="flex flex-col items-end">
          <p className="text-base text-gray-900 font-medium mb-1">فوري</p>
          <h3 className="text-gray-500 text-sm">مدة الخدمة</h3>
        </div>
        <Clock className="w-6 h-6 text-[#006C35] mt-1" strokeWidth={1.5} />
      </div>

      {/* Channels */}
      <div className="flex items-start justify-end gap-3 text-right">
        <div className="flex flex-col items-end">
          <p className="text-base text-gray-900 font-medium mb-1">بوابة إلكترونية</p>
          <h3 className="text-gray-500 text-sm">قنوات تقديم الخدمة</h3>
        </div>
        <Monitor className="w-6 h-6 text-[#006C35] mt-1" strokeWidth={1.5} />
      </div>

      {/* Language */}
      <div className="flex items-start justify-end gap-3 text-right">
        <div className="flex flex-col items-end">
          <p className="text-base text-gray-900 font-medium mb-1">إنجليزي , عربي</p>
          <h3 className="text-gray-500 text-sm">الخدمة مقدمة باللغة</h3>
        </div>
        <Languages className="w-6 h-6 text-[#006C35] mt-1" strokeWidth={1.5} />
      </div>

      {/* Cost */}
      <div className="flex items-start justify-end gap-3 text-right">
        <div className="flex flex-col items-end">
          <p className="text-lg font-bold text-gray-900 mb-1">500 <span className="text-sm font-normal text-[#006C35]">ر.س</span></p>
          <h3 className="text-gray-500 text-sm">تكلفة الخدمة</h3>
        </div>
        <div className="w-6 h-6 flex items-center justify-center mt-1">
          <span className="text-[#006C35] font-bold text-xl">﷼</span>
        </div>
      </div>

      {/* Payment Channels */}
      <div className="flex flex-col items-end gap-2 mt-4">
        <h3 className="text-gray-900 font-bold text-base mb-2">قنوات الدفع</h3>
        <div className="flex gap-2">
          <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mada_Logo.svg/1200px-Mada_Logo.svg.png" alt="Mada" className="h-full object-contain" />
          </div>
          <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Sadad_Logo.svg/2560px-Sadad_Logo.svg.png" alt="Sadad" className="h-full object-contain" />
          </div>
          <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
            <div className="w-8 h-5 bg-[#006C35] rounded-sm flex flex-col justify-between p-[2px]">
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-full h-[2px] bg-white/50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-4 pt-8 mt-4 border-t border-gray-100 w-full">
        <div className="flex items-center justify-end gap-2 text-right group cursor-pointer">
          <span className="text-sm font-bold text-gray-900 group-hover:text-[#006C35]">الأسئلة الشائعة</span>
          <HelpCircle className="w-5 h-5 text-[#006C35]" strokeWidth={1.5} />
        </div>
        <div className="flex items-center justify-end gap-2 text-right group cursor-pointer">
          <span className="text-sm font-bold text-[#006C35] underline">الاطلاع على الأسئلة الشائعة</span>
          <ExternalLink className="w-5 h-5 text-[#006C35]" strokeWidth={1.5} />
        </div>
        <div className="flex items-center justify-end gap-2 text-right group cursor-pointer">
          <span className="text-sm font-bold text-gray-900 group-hover:text-[#006C35]">رابط الفروع</span>
          <MapPin className="w-5 h-5 text-[#006C35]" strokeWidth={1.5} />
        </div>
        <div className="flex items-center justify-end gap-2 text-right group cursor-pointer">
          <span className="text-sm font-bold text-[#006C35] underline">الاطلاع على رابط الفروع</span>
          <ExternalLink className="w-5 h-5 text-[#006C35]" strokeWidth={1.5} />
        </div>
        <div className="flex items-center justify-end gap-2 text-right group cursor-pointer">
          <span className="text-sm font-bold text-gray-900 group-hover:text-[#006C35]">أوقات عمل الفروع</span>
          <Clock className="w-5 h-5 text-[#006C35]" strokeWidth={1.5} />
        </div>
        <div className="text-right pr-7">
          <p className="text-xs text-gray-500">8 صباحا - 5 مساء (من الأحد إلى الخميس)</p>
        </div>
        
        <div className="flex items-center justify-end gap-2 text-right group cursor-pointer mt-6">
          <span className="text-sm font-bold text-gray-900 group-hover:text-[#006C35]">اتصل بنا</span>
          <Phone className="w-5 h-5 text-[#006C35]" strokeWidth={1.5} />
        </div>
        <div className="text-right pr-7">
          <p className="text-sm font-bold text-[#006C35]" dir="ltr">1900</p>
        </div>

        <div className="flex items-center justify-end gap-2 text-right group cursor-pointer mt-4">
          <span className="text-sm font-bold text-gray-900 group-hover:text-[#006C35]">البريد الإلكتروني</span>
          <Mail className="w-5 h-5 text-[#006C35]" strokeWidth={1.5} />
        </div>
        <div className="text-right pr-7">
          <p className="text-sm text-[#006C35]">CS@mc.gov.sa</p>
        </div>
      </div>
    </div>
  );
}
