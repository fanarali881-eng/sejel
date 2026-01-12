import { Users, Clock, Globe, CreditCard, Phone, Mail, MapPin, Calendar, HelpCircle, FileText, ExternalLink } from "lucide-react";

export default function ServiceInfo() {
  return (
    <div className="space-y-8 border-r border-gray-100 pr-8 hidden lg:block">
      {/* Target Audience */}
      <div>
        <h3 className="text-[#006C35] font-bold text-sm mb-2">الجمهور المستهدف</h3>
        <p className="text-xs text-gray-600 mb-1">أعمال , التجار</p>
        <p className="text-[10px] text-gray-400">كبار السن , المرأة , الشباب , الأشخاص ذوي الإعاقة</p>
      </div>

      {/* User Type */}
      <div>
        <h3 className="text-[#006C35] font-bold text-sm mb-2">صفة المستخدم</h3>
        <p className="text-xs text-gray-600">فوري</p>
      </div>

      {/* Duration */}
      <div>
        <h3 className="text-[#006C35] font-bold text-sm mb-2">مدة الخدمة</h3>
        <p className="text-xs text-gray-600">بوابة إلكترونية</p>
      </div>

      {/* Channels */}
      <div>
        <h3 className="text-[#006C35] font-bold text-sm mb-2">قنوات تقديم الخدمة</h3>
        <p className="text-xs text-gray-600">بوابة إلكترونية</p>
      </div>

      {/* Language */}
      <div>
        <h3 className="text-[#006C35] font-bold text-sm mb-2">الخدمة مقدمة باللغة</h3>
        <p className="text-xs text-gray-600">إنجليزي , عربي</p>
      </div>

      {/* Cost */}
      <div>
        <h3 className="text-[#006C35] font-bold text-sm mb-2">تكلفة الخدمة</h3>
        <p className="text-lg font-bold text-[#006C35]">500 <span className="text-xs font-normal text-gray-500">ر.س</span></p>
      </div>

      {/* Payment Channels */}
      <div>
        <h3 className="text-[#006C35] font-bold text-sm mb-2">قنوات الدفع</h3>
        <div className="flex gap-2">
          <div className="w-10 h-6 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-[8px]">Mada</div>
          <div className="w-10 h-6 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-[8px]">Sadad</div>
          <div className="w-10 h-6 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-[8px]">Visa</div>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <a href="#" className="flex items-center gap-2 text-xs text-[#006C35] hover:underline">
          <HelpCircle className="w-4 h-4" />
          الأسئلة الشائعة
        </a>
        <a href="#" className="flex items-center gap-2 text-xs text-[#006C35] hover:underline">
          <ExternalLink className="w-4 h-4" />
          رابط الفروع
        </a>
        <a href="#" className="flex items-center gap-2 text-xs text-[#006C35] hover:underline">
          <MapPin className="w-4 h-4" />
          الموقع الجغرافي
        </a>
        <a href="#" className="flex items-center gap-2 text-xs text-[#006C35] hover:underline">
          <FileText className="w-4 h-4" />
          تحميل دليل المستخدم
        </a>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div>
          <h4 className="text-xs font-bold text-gray-700 mb-1">أوقات عمل الفروع</h4>
          <p className="text-[10px] text-gray-500">8 صباحا - 5 مساء (من الأحد إلى الخميس)</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-700 mb-1">الهاتف</h4>
          <p className="text-xs text-[#006C35] font-bold" dir="ltr">1900</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني</h4>
          <p className="text-xs text-[#006C35]">CS@mc.gov.sa</p>
        </div>
      </div>
    </div>
  );
}
