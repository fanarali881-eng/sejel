import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useState } from "react";

export default function SummaryPayment() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans" dir="rtl">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">الملخص والدفع</h1>
          
          {/* Content placeholder */}
          <div className="bg-white rounded-lg shadow p-6 min-h-[300px]">
            <p className="text-gray-500 text-center mt-10">محتوى صفحة الملخص والدفع</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
