import { Phone, Mail, MapPin, Twitter, Facebook, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] border-t border-gray-200 pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold text-[#006C35] tracking-tighter">GOV.SA</span>
                <span className="text-xs text-gray-500">المنصة الوطنية الموحدة</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                المنصة الوطنية الموحدة هي بوابتك الأولى للوصول إلى كافة الخدمات الحكومية في المملكة العربية السعودية.
              </p>
              <div className="flex gap-3 mt-2">
                <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#006C35] hover:border-[#006C35] transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#006C35] hover:border-[#006C35] transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#006C35] hover:border-[#006C35] transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#006C35] hover:border-[#006C35] transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-sm">روابط مهمة</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-[#006C35] transition-colors">عن المنصة</a></li>
              <li><a href="#" className="hover:text-[#006C35] transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="hover:text-[#006C35] transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-[#006C35] transition-colors">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-[#006C35] transition-colors">اتفاقية مستوى الخدمة</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-sm">تواصل معنا</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#006C35]" />
                <span dir="ltr">199099</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#006C35]" />
                <span>support@my.gov.sa</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#006C35] mt-1" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-sm">حمل التطبيق</h3>
            <div className="flex flex-col gap-2">
              <div className="h-10 bg-black rounded-md flex items-center justify-center text-white text-xs cursor-pointer hover:opacity-90 transition-opacity">
                App Store
              </div>
              <div className="h-10 bg-black rounded-md flex items-center justify-center text-white text-xs cursor-pointer hover:opacity-90 transition-opacity">
                Google Play
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© 2026 المنصة الوطنية الموحدة. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-600">خريطة الموقع</a>
            <a href="#" className="hover:text-gray-600">إمكانية الوصول</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
