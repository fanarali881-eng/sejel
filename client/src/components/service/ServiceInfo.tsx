import { Users, Clock, Globe, CreditCard, Phone, Mail, MapPin, Calendar } from "lucide-react";

export default function ServiceInfo() {
  return (
    <div className="space-y-6">
      {/* Service Details Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">تفاصيل الخدمة</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[#006C35] mt-0.5" />
            <div>
              <span className="block text-xs text-gray-400 mb-1">الجمهور المستهدف</span>
              <p className="text-sm text-gray-700 font-medium">أعمال، التجار</p>
              <p className="text-xs text-gray-500 mt-1">كبار السن، المرأة، الشباب، ذوي الإعاقة</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#006C35] mt-0.5" />
            <div>
              <span className="block text-xs text-gray-400 mb-1">مدة الخدمة</span>
              <p className="text-sm text-gray-700 font-medium">فوري</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-[#006C35] mt-0.5" />
            <div>
              <span className="block text-xs text-gray-400 mb-1">اللغة</span>
              <p className="text-sm text-gray-700 font-medium">عربي، إنجليزي</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-[#006C35] mt-0.5" />
            <div>
              <span className="block text-xs text-gray-400 mb-1">تكلفة الخدمة</span>
              <p className="text-sm text-gray-700 font-medium">500 ر.س</p>
              <div className="flex gap-2 mt-2">
                <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] text-gray-500">MADA</div>
                <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] text-gray-500">SADAD</div>
                <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] text-gray-500">VISA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">معلومات التواصل</h3>
        
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-medium" dir="ltr">1900</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">CS@mc.gov.sa</span>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="block text-gray-700">أوقات العمل</span>
              <span className="text-xs text-gray-500">8 صباحاً - 5 مساءً (الأحد - الخميس)</span>
            </div>
          </div>
          
          <div className="pt-2">
            <a href="#" className="text-[#006C35] text-xs font-medium hover:underline flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              الاطلاع على مواقع الفروع
            </a>
          </div>
        </div>
      </div>
      
      {/* Last Update */}
      <div className="text-center">
        <p className="text-[10px] text-gray-400">
          آخر تحديث: 03/09/2025 - 12:19 م
        </p>
      </div>
    </div>
  );
}
