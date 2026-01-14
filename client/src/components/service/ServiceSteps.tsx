import { useRoute } from "wouter";

const defaultSteps = [
  {
    title: "الدخول على المنصة:",
    description: "عبر النفاذ الوطني الموحد من خلال منصة المركز السعودي للأعمال."
  },
  {
    title: "اختيار الخدمة:",
    description: 'من "الخدمات الإلكترونية" > " قيد سجل تجاري" > تحديد نوع السجل "مؤسسة"، ثم البدء بالخدمة.'
  },
  {
    title: "تعبئة بيانات المؤسسة:",
    description: "مراجعة الشروط والموافقة عليها. - تعبئة بيانات المالك وبيانات الاتصال. - إدخال عنوان الأعمال المعتمد."
  },
  {
    title: "إضافة البيانات المطلوبة:",
    description: "إختيار الأنشطة التجارية. - إدخال بيانات التجارة الإلكترونية (إن وُجدت). - تحديد رأس المال. - اختيار نوع الإسم التجاري وتكوينه."
  },
  {
    title: "استكمال بيانات السجل التجاري:",
    description: "إدخال عنوان المؤسسة وبيانات الاتصال. - تعيين مدير المؤسسة وإدخال بياناته."
  },
  {
    title: "مراجعة وتقديم الطلب:",
    description: "استعراض ملخص الطلب. - الموافقة على الإقرار وتقديم الطلب."
  },
  {
    title: "موافقة الأطراف:",
    description: "في حال تطلب الأمر، تتم الموافقة من مالك السجل أو المدراء الآخرين."
  },
  {
    title: "الدفع:",
    description: "إصدار الفاتورة، ودفع الرسوم عبر خدمة سداد أو البطاقة. - بعد الدفع، يتم إصدار السجل التجاري رسميًا."
  },
  {
    title: "التسجيل التلقائي في الجهات ذات العلاقة:",
    description: "بعد إصدار السجل، يتم التسجيل تلقائيًا في: وزارة الموارد البشرية - هيئة الزكاة والضريبة والجمارك - المؤسسة العامة للتأمينات الاجتماعية - البريد السعودي (العنوان الوطني) - الغرفة التجارية."
  }
];

const reserveNameSteps = [
  {
    title: "الدخول على المنصة:",
    description: "عبر النفاذ الوطني الموحد من خلال منصة المركز السعودي للأعمال."
  },
  {
    title: "اختيار الخدمة:",
    description: 'من "ممارسة الأعمال" > "وزارة التجارة" > "حجز اسم تجاري" - أو من "الخدمات العامة" > "إدارة الأسماء التجارية المحجوزة" > "حجز اسم تجاري".'
  },
  {
    title: "بدء الخدمة:",
    description: 'الاطلاع على الشروط والمتطلبات، ثم الموافقة والضغط على "التقديم على الخدمة".'
  },
  {
    title: "إدخال البيانات:",
    description: "اختيار نوع الحجز ولغة الاسم التجاري - إدخال حتى 5 أسماء تجارية مقترحة."
  },
  {
    title: "مراجعة وتقديم الطلب:",
    description: "مراجعة ملخص الطلب، تعديل الأسماء إن لزم، ثم الموافقة على الإقرار وتقديم الطلب."
  },
  {
    title: "المعالجة والدفع:",
    description: "بعد موافقة وزارة التجارة، تُصدر الفاتورة ويتم دفعها عبر نظام المدفوعات المركزي."
  },
  {
    title: "إتمام الطلب:",
    description: 'بعد الدفع، يتم نشر الاسم التجاري وتتحول حالة الطلب إلى "مكتمل" - يمكن طباعة الطلب أو تعديله في حال الإعادة أو الرفض.'
  }
];

const commercialExtractSteps = [
  {
    title: "الدخول على المنصة:",
    description: "من خلال النفاذ الوطني الموحد عبر منصة المركز السعودي للأعمال."
  },
  {
    title: "اختيار الخدمة:",
    description: "الخدمات العامة < وزارة التجارة < مُستخرج سجل تجاري / الإفادة التجارية."
  },
  {
    title: "بدء الخدمة:",
    description: "ضغط على الاستمرار للموافقة على الشروط - الضغط على تقديم الخدمة."
  },
  {
    title: "تحديد نوع المستخرج / إفادة:",
    description: "الضغط على اختيار نوع المستخرج \\ إفادة - الضغظ على استمرار ."
  },
  {
    title: "استكمال المتطلبات:",
    description: "تسجيل بيانات المستفيد - اختيار لغة الطباعة - الضغط على استمرار ."
  },
  {
    title: "تقديم الطلب:",
    description: "مراجعة البيانات - الضغط على الموافقة على الإقرار."
  },
  {
    title: "الضغط على تقديم الطلب.",
    description: ""
  }
];

export default function ServiceSteps() {
  const [match, params] = useRoute("/service/:id?");
  const serviceId = match ? params?.id : null;

  let steps = defaultSteps;
  if (serviceId === 'reserve-name') {
    steps = reserveNameSteps;
  } else if (serviceId === 'commercial-extract') {
    steps = commercialExtractSteps;
  }
  
  // Video ID logic
  const videoId = serviceId === 'reserve-name' ? 'H4T0NCjLWJc' : 'uMDpYAV1oFA';
  const videoTitle = serviceId === 'reserve-name' ? 'شرح خدمة حجز اسم تجاري' : 'شرح خدمة قيد سجل تجاري لمؤسسة فردية';
  
  // Hide video for commercial-extract
  const showVideo = serviceId !== 'commercial-extract';

  return (
    <div className="py-4">
      {/* YouTube Video Section */}
      {showVideo && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <div className="relative pb-[56.25%] h-0 bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={videoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <ul className="space-y-3 list-none p-0 m-0">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-2 text-sm leading-relaxed text-gray-700">
            <span className="text-[#006C35] mt-1">•</span>
            <span>
              <strong className="text-[#006C35] font-bold ml-1">{step.title}</strong>
              {step.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
