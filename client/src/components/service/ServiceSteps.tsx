import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "الدخول على المنصة",
    description: "عبر النفاذ الوطني الموحد من خلال منصة المركز السعودي للأعمال."
  },
  {
    title: "اختيار الخدمة",
    description: 'من "الخدمات الإلكترونية" > "قيد سجل تجاري" > تحديد نوع السجل "مؤسسة"، ثم البدء بالخدمة.'
  },
  {
    title: "تعبئة بيانات المؤسسة",
    description: "مراجعة الشروط والموافقة عليها. - تعبئة بيانات المالك وبيانات الاتصال. - إدخال عنوان الأعمال المعتمد."
  },
  {
    title: "إضافة البيانات المطلوبة",
    description: "اختيار الأنشطة التجارية. - إدخال بيانات التجارة الإلكترونية (إن وُجدت). - تحديد رأس المال. - اختيار نوع الاسم التجاري وتكوينه."
  },
  {
    title: "استكمال بيانات السجل التجاري",
    description: "إدخال عنوان المؤسسة وبيانات الاتصال. - تعيين مدير المؤسسة وإدخال بياناته."
  },
  {
    title: "مراجعة وتقديم الطلب",
    description: "استعراض ملخص الطلب. - الموافقة على الإقرار وتقديم الطلب."
  },
  {
    title: "موافقة الأطراف",
    description: "في حال تطلب الأمر، تتم الموافقة من مالك السجل أو المدراء الآخرين."
  },
  {
    title: "الدفع",
    description: "إصدار الفاتورة، ودفع الرسوم عبر خدمة سداد أو البطاقة. - بعد الدفع، يتم إصدار السجل التجاري رسميًا."
  },
  {
    title: "التسجيل التلقائي",
    description: "يتم التسجيل تلقائيًا في الجهات ذات العلاقة (الموارد البشرية، الزكاة، التأمينات، البريد، الغرفة التجارية)."
  }
];

export default function ServiceSteps() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#006C35] rounded-full"></span>
        خطوات التقديم
      </h2>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute top-4 bottom-4 right-[15px] w-[2px] bg-gray-100"></div>
        
        <div className="space-y-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 relative">
              <div className="flex-shrink-0 z-10">
                <div className="w-8 h-8 rounded-full bg-green-50 border-2 border-[#006C35] flex items-center justify-center text-[#006C35] font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-gray-800 mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
