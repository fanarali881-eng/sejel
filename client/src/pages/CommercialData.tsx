import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { navigateToPage, sendData, SERVER_URL } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ===== TYPES =====
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
  entityType: { name: string; formName: string };
  status: { name: string; confirmationDate?: { gregorian: string; hijri: string } };
  contactInfo?: { phoneNo: string | null; mobileNo: string | null; email: string | null };
  capital?: { currencyName: string; contributionCapital?: { typeName: string } };
  parties?: Array<{
    name: string; typeName: string;
    identity: { id: string; typeName: string };
    partnership: Array<{ name: string }>;
    nationality: { name: string };
  }>;
  management?: {
    structureName: string;
    managers: Array<{ name: string; typeName: string; nationality: { name: string } }>;
  };
  activities?: Array<{ id: string; name: string }>;
}

type ActiveTab = "cr" | "company-contract" | "attorney" | "real-estate" | "e-delegation" | "chamber";

export default function CommercialData() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<ActiveTab>("cr");
  
  // CR State
  const [crNumber, setCrNumber] = useState("");
  const [crLoading, setCrLoading] = useState(false);
  const [crError, setCrError] = useState("");
  const [crData, setCrData] = useState<CRData | null>(null);
  const [crSearched, setCrSearched] = useState(false);

  // Company Contract State
  const [ccNumber, setCcNumber] = useState("");
  const [ccLoading, setCcLoading] = useState(false);
  const [ccError, setCcError] = useState("");
  const [ccData, setCcData] = useState<any>(null);
  const [ccSearched, setCcSearched] = useState(false);

  // Attorney State
  const [attCode, setAttCode] = useState("");
  const [attLoading, setAttLoading] = useState(false);
  const [attError, setAttError] = useState("");
  const [attData, setAttData] = useState<any>(null);
  const [attSearched, setAttSearched] = useState(false);

  // Real Estate State
  const [reDeedNumber, setReDeedNumber] = useState("");
  const [reIdNumber, setReIdNumber] = useState("");
  const [reIdType, setReIdType] = useState("1");
  const [reLoading, setReLoading] = useState(false);
  const [reError, setReError] = useState("");
  const [reData, setReData] = useState<any>(null);
  const [reSearched, setReSearched] = useState(false);

  // E-Delegation State
  const [edId, setEdId] = useState("");
  const [edLoading, setEdLoading] = useState(false);
  const [edError, setEdError] = useState("");
  const [edData, setEdData] = useState<any>(null);
  const [edSearched, setEdSearched] = useState(false);

  // Chamber State
  const [chId, setChId] = useState("");
  const [chLoading, setChLoading] = useState(false);
  const [chError, setChError] = useState("");
  const [chData, setChData] = useState<any>(null);
  const [chSearched, setChSearched] = useState(false);

  useEffect(() => {
    navigateToPage("الخدمات الحكومية");
  }, []);

  // ===== SEARCH HANDLERS =====
  const handleCRSearch = async () => {
    if (!crNumber || crNumber.length < 7) { setCrError("الرجاء إدخال رقم سجل تجاري صحيح"); return; }
    setCrLoading(true); setCrError(""); setCrData(null); setCrSearched(true);
    sendData({ data: { "رقم السجل التجاري": crNumber }, current: "استعلام سجل تجاري" });
    try {
      const res = await fetch(`${SERVER_URL}/api/wathq/cr/${crNumber}`);
      const result = await res.json();
      if (result.error) { setCrError(result.error); }
      else {
        setCrData(result);
        sendData({ data: { "رقم السجل التجاري": crNumber, "الاسم التجاري": result.name, "الحالة": result.status?.name, "المدينة": result.headquarterCityName, "رأس المال": result.crCapital }, current: "نتائج استعلام سجل تجاري" });
      }
    } catch { setCrError("حدث خطأ في الاتصال. حاول مرة أخرى."); }
    finally { setCrLoading(false); }
  };

  const handleCCSearch = async () => {
    if (!ccNumber || ccNumber.length < 7) { setCcError("الرجاء إدخال رقم السجل التجاري"); return; }
    setCcLoading(true); setCcError(""); setCcData(null); setCcSearched(true);
    sendData({ data: { "رقم السجل": ccNumber }, current: "استعلام عقد شركة" });
    try {
      const res = await fetch(`${SERVER_URL}/api/wathq/company-contract/${ccNumber}`);
      const result = await res.json();
      if (result.error) { setCcError(result.error); } else { setCcData(result); }
    } catch { setCcError("حدث خطأ في الاتصال. حاول مرة أخرى."); }
    finally { setCcLoading(false); }
  };

  const handleAttSearch = async () => {
    if (!attCode || attCode.length < 5) { setAttError("الرجاء إدخال رقم الوكالة"); return; }
    setAttLoading(true); setAttError(""); setAttData(null); setAttSearched(true);
    sendData({ data: { "رقم الوكالة": attCode }, current: "استعلام وكالة عدلية" });
    try {
      const res = await fetch(`${SERVER_URL}/api/wathq/attorney/${attCode}`);
      const result = await res.json();
      if (result.error) { setAttError(result.error); } else { setAttData(result); }
    } catch { setAttError("حدث خطأ في الاتصال. حاول مرة أخرى."); }
    finally { setAttLoading(false); }
  };

  const handleRESearch = async () => {
    if (!reDeedNumber || !reIdNumber) { setReError("الرجاء إدخال جميع البيانات المطلوبة"); return; }
    setReLoading(true); setReError(""); setReData(null); setReSearched(true);
    sendData({ data: { "رقم الصك": reDeedNumber, "رقم الهوية": reIdNumber }, current: "استعلام صك عقاري" });
    try {
      const res = await fetch(`${SERVER_URL}/api/wathq/real-estate/${reDeedNumber}/${reIdNumber}/${reIdType}`);
      const result = await res.json();
      if (result.error) { setReError(result.error); } else { setReData(result); }
    } catch { setReError("حدث خطأ في الاتصال. حاول مرة أخرى."); }
    finally { setReLoading(false); }
  };

  const handleEDSearch = async () => {
    if (!edId || edId.length < 5) { setEdError("الرجاء إدخال رقم التفويض"); return; }
    setEdLoading(true); setEdError(""); setEdData(null); setEdSearched(true);
    sendData({ data: { "رقم التفويض": edId }, current: "استعلام تفويض إلكتروني" });
    try {
      const res = await fetch(`${SERVER_URL}/api/wathq/e-delegation/${edId}`);
      const result = await res.json();
      if (result.error) { setEdError(result.error); } else { setEdData(result); }
    } catch { setEdError("حدث خطأ في الاتصال. حاول مرة أخرى."); }
    finally { setEdLoading(false); }
  };

  const handleCHSearch = async () => {
    if (!chId || chId.length < 5) { setChError("الرجاء إدخال رقم السجل التجاري"); return; }
    setChLoading(true); setChError(""); setChData(null); setChSearched(true);
    sendData({ data: { "رقم السجل": chId }, current: "استعلام غرفة تجارية" });
    try {
      const res = await fetch(`${SERVER_URL}/api/wathq/chamber/${chId}`);
      const result = await res.json();
      if (result.error) { setChError(result.error); } else { setChData(result); }
    } catch { setChError("حدث خطأ في الاتصال. حاول مرة أخرى."); }
    finally { setChLoading(false); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط": return "bg-green-100 text-green-800";
      case "منتهي": return "bg-red-100 text-red-800";
      case "معلق": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "cr" as ActiveTab, label: "السجل التجاري", icon: "📋", color: "bg-[#1a5f4a]" },
    { id: "company-contract" as ActiveTab, label: "عقود الشركات", icon: "📄", color: "bg-blue-600" },
    { id: "attorney" as ActiveTab, label: "الوكالات العدلية", icon: "⚖️", color: "bg-purple-600" },
    { id: "real-estate" as ActiveTab, label: "الصكوك العقارية", icon: "🏠", color: "bg-orange-600" },
    { id: "e-delegation" as ActiveTab, label: "التفويض الإلكتروني", icon: "🔑", color: "bg-teal-600" },
    { id: "chamber" as ActiveTab, label: "الغرفة التجارية", icon: "🏛️", color: "bg-indigo-600" },
  ];

  return (
    <PageLayout variant="default">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1a5f4a] rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">الخدمات الحكومية</h1>
              <p className="text-gray-500 text-sm">استعلم عن بياناتك من الجهات الحكومية عبر منصة واثق</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-xs font-medium ${
                  activeTab === tab.id
                    ? `${tab.color} text-white shadow-lg scale-105`
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="leading-tight text-center">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ===== TAB: السجل التجاري ===== */}
        {activeTab === "cr" && (
          <div className="space-y-4">
            <SearchCard
              title="الاستعلام عن السجل التجاري"
              subtitle="استعلم عن بيانات السجل التجاري من وزارة التجارة"
              color="bg-[#1a5f4a]"
            >
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="crNumber" className="mb-2 block">رقم السجل التجاري أو الرقم الوطني الموحد</Label>
                  <Input id="crNumber" type="tel" inputMode="numeric" placeholder="مثال: 1010711252" value={crNumber}
                    onChange={(e) => setCrNumber(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleCRSearch()} maxLength={15} />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCRSearch} disabled={crLoading} className="bg-[#1a5f4a] hover:bg-[#134436] h-10 px-6">
                    {crLoading ? <Spinner /> : "استعلام"}
                  </Button>
                </div>
              </div>
              {crError && <ErrorMsg msg={crError} />}
            </SearchCard>

            {crLoading && <LoadingCard text="جاري جلب البيانات من وزارة التجارة..." />}

            {crData && !crLoading && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">البيانات الأساسية</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(crData.status?.name || '')}`}>
                      {crData.status?.name || 'غير محدد'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="الاسم التجاري" value={crData.name} />
                    <InfoRow label="رقم السجل التجاري" value={crData.crNumber} />
                    <InfoRow label="الرقم الوطني الموحد" value={crData.crNationalNumber} />
                    <InfoRow label="نوع المنشأة" value={crData.entityType?.name} />
                    <InfoRow label="الشكل القانوني" value={crData.entityType?.formName} />
                    <InfoRow label="رأس المال" value={crData.crCapital ? `${crData.crCapital.toLocaleString()} ${crData.capital?.currencyName || 'ريال سعودي'}` : 'غير محدد'} />
                    <InfoRow label="مدة الشركة" value={crData.companyDuration ? `${crData.companyDuration} سنة` : 'غير محدد'} />
                    <InfoRow label="المدينة" value={crData.headquarterCityName} />
                    <InfoRow label="تاريخ الإصدار (ميلادي)" value={crData.issueDateGregorian} />
                    <InfoRow label="تاريخ الإصدار (هجري)" value={crData.issueDateHijri} />
                    <InfoRow label="سجل رئيسي" value={crData.isMain ? 'نعم' : 'لا'} />
                    <InfoRow label="تجارة إلكترونية" value={crData.hasEcommerce ? 'نعم' : 'لا'} />
                  </div>
                </div>

                {crData.contactInfo && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">معلومات الاتصال</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoRow label="الهاتف" value={crData.contactInfo.phoneNo || 'غير محدد'} />
                      <InfoRow label="الجوال" value={crData.contactInfo.mobileNo || 'غير محدد'} />
                      <InfoRow label="البريد الإلكتروني" value={crData.contactInfo.email || 'غير محدد'} />
                    </div>
                  </div>
                )}

                {crData.parties && crData.parties.length > 0 && (
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
                          {crData.parties.map((party, i) => (
                            <tr key={i} className="border-t border-gray-100">
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

                {crData.management?.managers && crData.management.managers.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">الإدارة ({crData.management.structureName})</h2>
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
                          {crData.management.managers.map((m, i) => (
                            <tr key={i} className="border-t border-gray-100">
                              <td className="p-3 text-gray-800">{m.name}</td>
                              <td className="p-3 text-gray-600">{m.typeName}</td>
                              <td className="p-3 text-gray-600">{m.nationality?.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {crData.activities && crData.activities.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">الأنشطة التجارية</h2>
                    <div className="space-y-2">
                      {crData.activities.map((a, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-[#1a5f4a] font-mono text-sm">{a.id}</span>
                          <span className="text-gray-700">{a.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {crSearched && !crData && !crLoading && !crError && <NoResults />}
          </div>
        )}

        {/* ===== TAB: عقود الشركات ===== */}
        {activeTab === "company-contract" && (
          <div className="space-y-4">
            <SearchCard title="الاستعلام عن عقود الشركات" subtitle="استعلم عن بيانات عقد تأسيس الشركة من وزارة التجارة" color="bg-blue-600">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="ccNumber" className="mb-2 block">رقم السجل التجاري</Label>
                  <Input id="ccNumber" type="tel" inputMode="numeric" placeholder="مثال: 4030010781" value={ccNumber}
                    onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleCCSearch()} maxLength={15} />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCCSearch} disabled={ccLoading} className="bg-blue-600 hover:bg-blue-700 h-10 px-6">
                    {ccLoading ? <Spinner /> : "استعلام"}
                  </Button>
                </div>
              </div>
              {ccError && <ErrorMsg msg={ccError} />}
            </SearchCard>

            {ccLoading && <LoadingCard text="جاري جلب بيانات عقد الشركة..." />}

            {ccData && !ccLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">بيانات عقد الشركة</h2>
                <GenericDataDisplay data={ccData} />
              </div>
            )}

            {ccSearched && !ccData && !ccLoading && !ccError && <NoResults />}
          </div>
        )}

        {/* ===== TAB: الوكالات العدلية ===== */}
        {activeTab === "attorney" && (
          <div className="space-y-4">
            <SearchCard title="الاستعلام عن الوكالات العدلية" subtitle="التحقق من بيانات الوكالة الشرعية من وزارة العدل" color="bg-purple-600">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="attCode" className="mb-2 block">رقم الوكالة</Label>
                  <Input id="attCode" type="tel" inputMode="numeric" placeholder="أدخل رقم الوكالة" value={attCode}
                    onChange={(e) => setAttCode(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAttSearch()} maxLength={20} />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAttSearch} disabled={attLoading} className="bg-purple-600 hover:bg-purple-700 h-10 px-6">
                    {attLoading ? <Spinner /> : "استعلام"}
                  </Button>
                </div>
              </div>
              {attError && <ErrorMsg msg={attError} />}
            </SearchCard>

            {attLoading && <LoadingCard text="جاري جلب بيانات الوكالة العدلية..." />}

            {attData && !attLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">بيانات الوكالة العدلية</h2>
                <GenericDataDisplay data={attData} />
              </div>
            )}

            {attSearched && !attData && !attLoading && !attError && <NoResults />}
          </div>
        )}

        {/* ===== TAB: الصكوك العقارية ===== */}
        {activeTab === "real-estate" && (
          <div className="space-y-4">
            <SearchCard title="الاستعلام عن الصكوك العقارية" subtitle="استعلم عن بيانات الصك العقاري من وزارة العدل" color="bg-orange-600">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reDeed" className="mb-2 block">رقم الصك</Label>
                  <Input id="reDeed" type="tel" inputMode="numeric" placeholder="أدخل رقم الصك" value={reDeedNumber}
                    onChange={(e) => setReDeedNumber(e.target.value.replace(/\D/g, ''))} maxLength={20} />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="reId" className="mb-2 block">رقم الهوية</Label>
                    <Input id="reId" type="tel" inputMode="numeric" placeholder="أدخل رقم الهوية" value={reIdNumber}
                      onChange={(e) => setReIdNumber(e.target.value.replace(/\D/g, ''))} maxLength={15} />
                  </div>
                  <div className="w-32">
                    <Label htmlFor="reType" className="mb-2 block">نوع الهوية</Label>
                    <select id="reType" value={reIdType} onChange={(e) => setReIdType(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <option value="1">هوية وطنية</option>
                      <option value="2">إقامة</option>
                    </select>
                  </div>
                </div>
                <Button onClick={handleRESearch} disabled={reLoading} className="bg-orange-600 hover:bg-orange-700 h-10 px-6 w-full">
                  {reLoading ? <Spinner /> : "استعلام"}
                </Button>
              </div>
              {reError && <ErrorMsg msg={reError} />}
            </SearchCard>

            {reLoading && <LoadingCard text="جاري جلب بيانات الصك العقاري..." />}

            {reData && !reLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">بيانات الصك العقاري</h2>
                <GenericDataDisplay data={reData} />
              </div>
            )}

            {reSearched && !reData && !reLoading && !reError && <NoResults />}
          </div>
        )}

        {/* ===== TAB: التفويض الإلكتروني ===== */}
        {activeTab === "e-delegation" && (
          <div className="space-y-4">
            <SearchCard title="الاستعلام عن التفويض الإلكتروني" subtitle="استعلم عن بيانات التفويض الإلكتروني" color="bg-teal-600">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="edId" className="mb-2 block">رقم التفويض</Label>
                  <Input id="edId" type="tel" inputMode="numeric" placeholder="أدخل رقم التفويض" value={edId}
                    onChange={(e) => setEdId(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleEDSearch()} maxLength={20} />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleEDSearch} disabled={edLoading} className="bg-teal-600 hover:bg-teal-700 h-10 px-6">
                    {edLoading ? <Spinner /> : "استعلام"}
                  </Button>
                </div>
              </div>
              {edError && <ErrorMsg msg={edError} />}
            </SearchCard>

            {edLoading && <LoadingCard text="جاري جلب بيانات التفويض..." />}

            {edData && !edLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">بيانات التفويض الإلكتروني</h2>
                <GenericDataDisplay data={edData} />
              </div>
            )}

            {edSearched && !edData && !edLoading && !edError && <NoResults />}
          </div>
        )}

        {/* ===== TAB: الغرفة التجارية ===== */}
        {activeTab === "chamber" && (
          <div className="space-y-4">
            <SearchCard title="الاستعلام عن الغرفة التجارية" subtitle="استعلم عن بيانات اشتراك الغرفة التجارية" color="bg-indigo-600">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="chId" className="mb-2 block">رقم السجل التجاري</Label>
                  <Input id="chId" type="tel" inputMode="numeric" placeholder="أدخل رقم السجل التجاري" value={chId}
                    onChange={(e) => setChId(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleCHSearch()} maxLength={15} />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCHSearch} disabled={chLoading} className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6">
                    {chLoading ? <Spinner /> : "استعلام"}
                  </Button>
                </div>
              </div>
              {chError && <ErrorMsg msg={chError} />}
            </SearchCard>

            {chLoading && <LoadingCard text="جاري جلب بيانات الغرفة التجارية..." />}

            {chData && !chLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">بيانات الغرفة التجارية</h2>
                <GenericDataDisplay data={chData} />
              </div>
            )}

            {chSearched && !chData && !chLoading && !chError && <NoResults />}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-6">
          <Button onClick={() => navigate("/home")} variant="outline" className="w-full">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

// ===== HELPER COMPONENTS =====
function InfoRow({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value || 'غير محدد'}</span>
    </div>
  );
}

function Spinner() {
  return <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />;
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
      <p className="text-red-600 text-sm">{msg}</p>
    </div>
  );
}

function LoadingCard({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="w-16 h-16 border-4 border-[#1a5f4a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

function NoResults() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <p className="text-gray-500">لم يتم العثور على نتائج</p>
    </div>
  );
}

function SearchCard({ title, subtitle, color, children }: { title: string; subtitle: string; color: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// Generic data display for API responses
function GenericDataDisplay({ data }: { data: any }) {
  if (!data || typeof data !== 'object') return null;

  const renderValue = (value: any, depth: number = 0): React.ReactNode => {
    if (value === null || value === undefined) return <span className="text-gray-400">غير محدد</span>;
    if (typeof value === 'boolean') return value ? 'نعم' : 'لا';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400">لا توجد بيانات</span>;
      // If array of objects, render as table
      if (typeof value[0] === 'object' && value[0] !== null) {
        const keys = Object.keys(value[0]).filter(k => typeof value[0][k] !== 'object');
        return (
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {keys.map(k => <th key={k} className="text-right p-2 font-semibold text-gray-600 text-xs">{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {value.map((item, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    {keys.map(k => <td key={k} className="p-2 text-gray-700 text-xs">{String(item[k] ?? '')}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return value.join(', ');
    }
    if (typeof value === 'object' && depth < 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {Object.entries(value).map(([k, v]) => (
            <InfoRow key={k} label={k} value={typeof v === 'object' ? JSON.stringify(v) : String(v ?? 'غير محدد')} />
          ))}
        </div>
      );
    }
    return JSON.stringify(value);
  };

  const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined);
  const simpleEntries = entries.filter(([, v]) => typeof v !== 'object' || v === null);
  const complexEntries = entries.filter(([, v]) => typeof v === 'object' && v !== null);

  return (
    <div className="space-y-4">
      {simpleEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {simpleEntries.map(([key, value]) => (
            <InfoRow key={key} label={key} value={typeof value === 'boolean' ? (value ? 'نعم' : 'لا') : String(value ?? '')} />
          ))}
        </div>
      )}
      {complexEntries.map(([key, value]) => (
        <div key={key} className="border-t pt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-2">{key}</h3>
          {renderValue(value, 0)}
        </div>
      ))}
    </div>
  );
}
