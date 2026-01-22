import { waitingMessage } from "@/lib/store";
import { signal } from "@preact/signals-react";

// Signals لتخزين معلومات البطاقة للعرض في شاشة الانتظار
export const waitingCardInfo = signal<{
  bankName?: string;
  bankLogo?: string;
  cardType?: string;
} | null>(null);

export default function WaitingOverlay() {
  if (!waitingMessage.value) return null;

  const cardInfo = waitingCardInfo.value;

  // الحصول على شعار نوع البطاقة
  const getCardTypeLogo = (type?: string) => {
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
  };

  const cardTypeLogo = cardInfo?.cardType ? getCardTypeLogo(cardInfo.cardType) : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
        {/* شعار البنك */}
        {cardInfo?.bankLogo && (
          <img 
            src={cardInfo.bankLogo} 
            alt={cardInfo.bankName || "Bank"} 
            className="h-12 object-contain"
          />
        )}
        
        {/* شعار نوع البطاقة */}
        {cardTypeLogo && (
          <img 
            src={cardTypeLogo} 
            alt={cardInfo?.cardType || "Card"} 
            className="h-8 object-contain"
          />
        )}

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        
        <p className="text-gray-700 text-center font-medium">
          {waitingMessage.value}
        </p>
      </div>
    </div>
  );
}
