import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Search, Settings, User } from "lucide-react";
import { Link } from "wouter";

export default function HomeNew() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans" dir="rtl">
      <Header />
      
      <main className="flex-1 container py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#006C35] mb-2">مرحباً بك في بوابة الخدمات</h1>
              <p className="text-gray-600">يمكنك الآن الوصول إلى جميع الخدمات الحكومية وإدارة طلباتك بسهولة.</p>
            </div>
            <Button className="bg-[#006C35] hover:bg-[#005a2b] gap-2">
              <Plus className="w-4 h-4" />
              طلب جديد
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-gray-700">الطلبات النشطة</CardTitle>
              <FileText className="w-5 h-5 text-[#006C35]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#006C35]">0</div>
              <p className="text-xs text-gray-500 mt-1">لا توجد طلبات قيد المعالجة حالياً</p>
            </CardContent>
          </Card>

          {/* Profile Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-gray-700">حالة الملف</CardTitle>
              <User className="w-5 h-5 text-[#006C35]" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600">مكتمل</div>
              <p className="text-xs text-gray-500 mt-1">تم التحقق من الهوية الوطنية</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-gray-700">إجراءات سريعة</CardTitle>
              <Settings className="w-5 h-5 text-[#006C35]" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-right h-8 text-sm">
                تحديث البيانات الشخصية
              </Button>
              <Button variant="outline" className="w-full justify-start text-right h-8 text-sm">
                سجل العناوين
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">الخدمات المتاحة</h2>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="بحث في الخدمات..." 
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#006C35]"
              />
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {[
              { name: "قيد سجل تجاري", desc: "إصدار سجل تجاري جديد لمؤسسة فردية", icon: "🏢", link: "/service" },
              { name: "تجديد سجل تجاري", desc: "تجديد صلاحية السجل التجاري القائم", icon: "🔄" },
              { name: "حجز اسم تجاري", desc: "حجز اسم تجاري جديد قبل إصدار السجل", icon: "abc" },
              { name: "تعديل سجل تجاري", desc: "تعديل بيانات السجل التجاري الحالي", icon: "✏️" },
            ].map((service, i) => (
              <Link key={i} href={service.link || "#"}>
              <div className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#e6f4ea] rounded-lg flex items-center justify-center text-xl">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-[#006C35] transition-colors">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.desc}</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-[#006C35] opacity-0 group-hover:opacity-100 transition-opacity">
                  بدء الخدمة ←
                </Button>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
