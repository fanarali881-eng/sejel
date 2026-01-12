import { Phone, Mail, MapPin, Twitter, Facebook, Linkedin, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] border-t border-gray-200 pt-10 pb-6 font-sans">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo & Social */}
          <div>
            <div className="flex flex-col items-start mb-4">
              <span className="text-2xl font-bold text-[#006C35] tracking-tighter">GOV.SA</span>
              <span className="text-[10px] text-[#006C35] font-bold tracking-widest">المنصة الوطنية الموحدة</span>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              المنصة الوطنية الموحدة GOV.SA هي رحلة طموحة لبناء منظومة متكاملة تقدم كافة الخدمات الحكومية بجودة وكفاءة عالية.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 bg-[#006C35] text-white rounded flex items-center justify-center hover:opacity-90"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 bg-[#006C35] text-white rounded flex items-center justify-center hover:opacity-90"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 bg-[#006C35] text-white rounded flex items-center justify-center hover:opacity-90"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 bg-[#006C35] text-white rounded flex items-center justify-center hover:opacity-90"><MessageCircle className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 bg-[#006C35] text-white rounded flex items-center justify-center hover:opacity-90"><Mail className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Column 2: Important Links */}
          <div>
            <h3 className="font-bold text-[#006C35] mb-4 text-sm">روابط مهمة</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><a href="#" className="hover:text-[#006C35]">عن المنصة</a></li>
              <li><a href="#" className="hover:text-[#006C35]">الأسئلة الشائعة</a></li>
              <li><a href="#" className="hover:text-[#006C35]">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-[#006C35]">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-[#006C35]">اتفاقية مستوى الخدمة</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h3 className="font-bold text-[#006C35] mb-4 text-sm">تواصل معنا</h3>
            <ul className="space-y-3 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#006C35]" />
                <span dir="ltr" className="font-bold">199099</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#006C35]" />
                <span>support@my.gov.sa</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Apps */}
          <div>
            <h3 className="font-bold text-[#006C35] mb-4 text-sm">حمل التطبيق</h3>
            <div className="flex gap-2">
              <div className="w-24 h-8 bg-black rounded flex items-center justify-center text-white text-[10px]">App Store</div>
              <div className="w-24 h-8 bg-black rounded flex items-center justify-center text-white text-[10px]">Google Play</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500">
          <p>جميع الحقوق محفوظة للمنصة الوطنية الموحدة © 2026</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#006C35]">خريطة الموقع</a>
            <a href="#" className="hover:text-[#006C35]">إمكانية الوصول</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
