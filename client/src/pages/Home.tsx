import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/service/ServiceHero";
import ServiceSteps from "@/components/service/ServiceSteps";
import ServiceInfo from "@/components/service/ServiceInfo";
import { MessageSquare, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("steps");

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans" dir="rtl">
      <Header />
      
      <main className="flex-1">
        <ServiceHero />
        
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Right Column: Main Content */}
            <div className="flex-1 order-2 lg:order-1">
              {/* Tabs-like Header */}
              <div className="flex border-b border-gray-200 mb-6">
                <button 
                  onClick={() => setActiveTab("steps")}
                  className={`px-4 py-2 text-sm font-bold transition-colors ${activeTab === "steps" ? "text-[#006C35] border-b-2 border-[#006C35]" : "text-gray-500 hover:text-[#006C35]"}`}
                >
                  الخطوات
                </button>
                <button 
                  onClick={() => setActiveTab("requirements")}
                  className={`px-4 py-2 text-sm font-bold transition-colors ${activeTab === "requirements" ? "text-[#006C35] border-b-2 border-[#006C35]" : "text-gray-500 hover:text-[#006C35]"}`}
                >
                  المتطلبات
                </button>
                <button 
                  onClick={() => setActiveTab("documents")}
                  className={`px-4 py-2 text-sm font-bold transition-colors ${activeTab === "documents" ? "text-[#006C35] border-b-2 border-[#006C35]" : "text-gray-500 hover:text-[#006C35]"}`}
                >
                  المستندات المطلوبة
                </button>
              </div>
              
              {activeTab === "steps" && <ServiceSteps />}
              
              {activeTab === "requirements" && (
                <div className="py-4 space-y-4">
                  <div className="flex items-center gap-2 text-gray-800">
                    <CheckCircle2 className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
                    <span className="text-base font-medium">ألا يقل العمر عن 18 سنة.</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-800">
                    <CheckCircle2 className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
                    <span className="text-base font-medium">ألا يكون موظفًا حكوميًا.</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-800">
                    <CheckCircle2 className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
                    <span className="text-base font-medium">ألا يكون المالك ممتلكًا سجلًا تجاريًا نشطًا لمؤسسة فردية.</span>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="py-4 text-gray-600 text-sm">
                  لا توجد مستندات مطلوبة لهذه الخدمة حالياً.
                </div>
              )}
              
              {/* Feedback Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-[#f8f9fa] p-6 rounded border border-gray-100">
                  <h3 className="font-bold text-[#006C35] mb-4 flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4" />
                    التعليقات والاقتراحات
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">لأي استفسارات أو ملاحظات، يرجى ملء المعلومات المطلوبة.</p>
                  
                  <div className="mb-6">
                    <Button variant="outline" className="text-xs h-8 bg-white border-gray-300 text-gray-600">اضافة تعليق</Button>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-bold text-gray-700 mb-2 text-sm">شاركنا رأيك، وساهم بالتحسين</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-600">هل أعجبك محتوى الصفحة ؟</span>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50">نعم</button>
                          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50">لا</button>
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400">
                        <span className="font-bold text-[#006C35] text-sm mx-1">3</span>
                        من الزوّار للموقع أعجبهم محتوى هذه الصفحة
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-left">
                  <p className="text-[10px] text-gray-400">
                    تاريخ آخر تحديث لمحتوى الصفحة : 03/09/2025 بتمام الساعة 12:19 مساء بتوقيت المملكة العربية السعودية
                  </p>
                </div>
              </div>
            </div>
            
            {/* Left Column: Sidebar Info */}
            <div className="w-full lg:w-64 order-1 lg:order-2">
              <ServiceInfo />
            </div>
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
