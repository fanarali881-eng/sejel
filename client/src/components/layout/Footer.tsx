import { ArrowUp, MessageCircle, Eye, ZoomIn, ZoomOut, Ear } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#004d30] text-white font-sans pt-12 pb-6 relative">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-right">
          
          {/* Column 1: Overview */}
          <div>
            <h3 className="font-bold text-lg mb-6">نظرة عامة</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:underline">عن المملكة العربية السعودية</a></li>
              <li><a href="#" className="hover:underline">عن المنصة الوطنية</a></li>
              <li><a href="#" className="hover:underline">زائر جديد</a></li>
              <li><a href="#" className="hover:underline">الأخبار</a></li>
              <li><a href="#" className="hover:underline">الفعاليات</a></li>
              <li><a href="#" className="hover:underline">الملف الوطني</a></li>
              <li><a href="#" className="hover:underline">تطبيقات الجوال الحكومية</a></li>
              <li><a href="#" className="hover:underline">المشاركة الإلكترونية</a></li>
              <li><a href="#" className="hover:underline">اتفاقية مستوى الخدمة</a></li>
              <li><a href="#" className="hover:underline">ميثاق المستخدمين</a></li>
              <li><a href="#" className="hover:underline">تحديث محتوى المنصة الوطنية</a></li>
            </ul>
          </div>

          {/* Column 2: Important Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">روابط مهمة</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:underline">التقارير والبيانات</a></li>
              <li><a href="#" className="hover:underline">إحصائيات ومؤشرات المنصة</a></li>
              <li><a href="#" className="hover:underline">البيانات المفتوحة</a></li>
              <li><a href="#" className="hover:underline">التنمية المستدامة</a></li>
              <li><a href="#" className="hover:underline">منصات الحكومات الإلكترونية الخليجية</a></li>
              <li><a href="#" className="hover:underline">الخصوصية وحماية البيانات</a></li>
              <li><a href="#" className="hover:underline">الاستراتيجية الوطنية للبيانات والذكاء الاصطناعي</a></li>
              <li><a href="#" className="hover:underline">حق الحصول على المعلومة</a></li>
              <li><a href="#" className="hover:underline">الأمن السيبراني في المملكة</a></li>
              <li><a href="#" className="hover:underline">ميزانية الدولة</a></li>
              <li><a href="#" className="hover:underline">استبيان المشاركة في فعاليات الجهات الحكومية</a></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="font-bold text-lg mb-6">الدعم والمساعدة</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:underline">الدعم والمساعدة</a></li>
              <li><a href="#" className="hover:underline">تواصل معنا</a></li>
              <li><a href="#" className="hover:underline">مركز تفاعل المستفيدين آمر</a></li>
              <li><a href="#" className="hover:underline">بلاغ رقمي</a></li>
              <li><a href="#" className="hover:underline">قنوات تقديم الخدمة</a></li>
              <li><a href="#" className="hover:underline">الإبلاغ عن فساد</a></li>
              <li><a href="#" className="hover:underline">الإبلاغ عن أخبار كاذبة</a></li>
              <li><a href="#" className="hover:underline">الأسئلة الشائعة</a></li>
              <li><a href="#" className="hover:underline">سهولة الوصول</a></li>
              <li><a href="#" className="hover:underline">اشترك معنا</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Tools */}
          <div>
            <h3 className="font-bold text-lg mb-6">تواصل معنا</h3>
            <div className="flex justify-end mb-6 gap-2">
              <a href="#" className="w-10 h-10 bg-[#2d7a58] rounded flex items-center justify-center hover:bg-[#3d8a68]">
                <span className="font-bold text-xl">𝕏</span>
              </a>
            </div>

            <h3 className="font-bold text-lg mb-4">أدوات الاتاحة والوصول</h3>
            <div className="flex justify-end gap-2 mb-8">
              <button className="w-10 h-10 bg-[#2d7a58] rounded flex items-center justify-center hover:bg-[#3d8a68]" title="High Contrast">
                <Eye className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-[#2d7a58] rounded flex items-center justify-center hover:bg-[#3d8a68]" title="Zoom In">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-[#2d7a58] rounded flex items-center justify-center hover:bg-[#3d8a68]" title="Zoom Out">
                <ZoomOut className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-3 h-10 bg-[#2d7a58] rounded hover:bg-[#3d8a68]">
                <span className="text-xs font-bold">دعم لغة الاشارة الحية</span>
                <Ear className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-bold text-lg mb-4">تطبيقاتنا</h3>
            <div className="flex justify-end gap-2">
              <a href="#" className="block w-32 bg-black rounded-lg overflow-hidden border border-gray-600">
                <div className="flex items-center justify-center h-10 gap-1 px-2">
                  <div className="text-[10px] text-left leading-tight">
                    <div className="text-[8px]">GET IT ON</div>
                    <div className="font-bold">Google Play</div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                </div>
              </a>
              <a href="#" className="block w-32 bg-black rounded-lg overflow-hidden border border-gray-600">
                <div className="flex items-center justify-center h-10 gap-1 px-2">
                  <div className="text-[10px] text-left leading-tight">
                    <div className="text-[8px]">Download on the</div>
                    <div className="font-bold">App Store</div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.37 12.36,4.26 13,3.5Z" /></svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-end border-t border-[#2d7a58] pt-8 mt-8">
          
          {/* Right: Copyright & Links */}
          <div className="text-right mt-6 md:mt-0 order-2 md:order-2">
            <div className="flex justify-end gap-4 text-sm font-bold mb-2 underline">
              <a href="#">سياسة الخصوصية</a>
              <a href="#">شروط الاستخدام</a>
              <a href="#">خريطة الموقع</a>
            </div>
            <p className="text-xs mb-1">2026 © جميع الحقوق محفوظة لمنصة GOV.SA (المنصة الحكومية السعودية)</p>
            <p className="text-xs opacity-80">تطوير وتشغيل هيئة الحكومة الرقمية</p>
          </div>

          {/* Left: Logos */}
          <div className="flex items-center justify-start order-1 md:order-1">
            <img src="/images/footer-logos.png" alt="GOV.SA and Vision 2030 Logos" className="h-12 object-contain" />
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 left-8 flex flex-col gap-4 z-50">
        <button className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-[#006C35] hover:bg-gray-50 relative group">
          <MessageCircle className="w-7 h-7" />
          <span className="absolute right-full mr-3 bg-white text-[#006C35] text-xs font-bold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            آمر
          </span>
          {/* Red dot removed */}
        </button>
        <button className="w-12 h-12 bg-[#2d7a58] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#3d8a68]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </footer>
  );
}
