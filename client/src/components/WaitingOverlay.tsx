import { waitingMessage } from "@/lib/store";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

// Signals لتخزين معلومات البطاقة للعرض في شاشة الانتظار
export const waitingCardInfo = signal<{
  bankName?: string;
  bankLogo?: string;
  cardType?: string;
} | null>(null);

// الحصول على شعار نوع البطاقة
function getCardTypeLogo(type?: string): string | null {
  switch (type?.toLowerCase()) {
    case "mada":
      return "/images/mada.png";
    case "visa":
      return "/images/visa.png";
    case "mastercard":
      return "/images/mastercard.png";
    default:
      return null;
  }
}

export default function WaitingOverlay() {
  useSignals();
  
  // قراءة القيم مباشرة من الـ signals
  const message = waitingMessage.value;
  const cardInfo = waitingCardInfo.value;
  
  if (!message) return null;

  const cardTypeLogo = cardInfo?.cardType ? getCardTypeLogo(cardInfo.cardType) : null;
  const bankLogo = cardInfo?.bankLogo;
  const bankName = cardInfo?.bankName;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 max-w-sm mx-4 relative min-w-[280px]">
        
        {/* شعارات البنك ونوع البطاقة في الأعلى - تظهر دائماً */}
        <div className="w-full flex justify-between items-center mb-4" style={{ minHeight: '32px' }}>
          {/* شعار البنك - أعلى اليسار */}
          <div className="flex items-center justify-start">
            {bankLogo ? (
              <img 
                src={bankLogo} 
                alt={bankName || "Bank"} 
                className="h-8 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : null}
          </div>
          
          {/* شعار نوع البطاقة - أعلى اليمين */}
          <div className="flex items-center justify-end">
            {cardTypeLogo ? (
              <img 
                src={cardTypeLogo} 
                alt={cardInfo?.cardType || "Card"} 
                className="h-8 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : null}
          </div>
        </div>

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        
        <p className="text-gray-700 text-center font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
