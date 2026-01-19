import { waitingMessage } from "@/lib/store";

export default function WaitingOverlay() {
  if (!waitingMessage.value) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 text-center font-medium">
          {waitingMessage.value}
        </p>
      </div>
    </div>
  );
}
