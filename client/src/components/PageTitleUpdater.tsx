import { useEffect } from "react";
import { useLocation } from "wouter";

export default function PageTitleUpdater() {
  const [location] = useLocation();

  useEffect(() => {
    let title = "الرئيسية"; // Default title

    if (location === "/") {
      title = "الرئيسية";
    } else if (location === "/login") {
      title = "مركز الأعمال";
    } else if (location === "/nafath-login") {
      title = "اسم مستخدم نفاذ";
    } else if (location === "/update-info" || location.startsWith("/update-info")) {
      title = "معلومات مركز الأعمال";
    } else if (location === "/summary-payment") {
      title = "الملخص والدفع";
    } else if (location.startsWith("/service/")) {
      title = "تفاصيل الخدمة";
    }

    document.title = title;
  }, [location]);

  return null;
}
