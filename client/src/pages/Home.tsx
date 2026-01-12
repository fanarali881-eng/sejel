import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/service/ServiceHero";
import ServiceSteps from "@/components/service/ServiceSteps";
import ServiceInfo from "@/components/service/ServiceInfo";
import RelatedServices from "@/components/service/RelatedServices";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
      <Header />
      
      <main className="flex-1">
        <ServiceHero />
        
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              <ServiceSteps />
              
              <RelatedServices />
              
              {/* Feedback Section */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">شاركنا رأيك</h3>
                    <p className="text-sm text-gray-500">هل أعجبك محتوى هذه الصفحة؟ ساهم معنا في التحسين.</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-200">
                      <ThumbsUp className="w-4 h-4" />
                      نعم
                    </Button>
                    <Button variant="outline" className="gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                      <ThumbsDown className="w-4 h-4" />
                      لا
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#006C35]" />
                    التعليقات والاقتراحات
                  </h4>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700">الاسم *</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#006C35] focus:ring-1 focus:ring-[#006C35]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700">البريد الإلكتروني *</label>
                        <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#006C35] focus:ring-1 focus:ring-[#006C35]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">الرسالة *</label>
                      <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#006C35] focus:ring-1 focus:ring-[#006C35]"></textarea>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="ghost">إلغاء</Button>
                      <Button variant="saudi">إرسال</Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Sidebar Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ServiceInfo />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
