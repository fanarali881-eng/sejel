import { useEffect, useRef, useState } from "react";
import { updatePage } from "@/lib/store";

const SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export default function SaudiBusinessProxy() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentPath, setCurrentPath] = useState("/p/sb/Identity/Account/Login");

  useEffect(() => {
    updatePage("الصفحة الرئيسية - المركز السعودي للأعمال");
  }, []);

  // Use srcdoc approach: fetch HTML from server, inject base tag, render in iframe
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    async function loadPage() {
      setLoading(true);
      try {
        const resp = await fetch(`${SERVER_URL}${currentPath}`, {
          credentials: "include",
          redirect: "follow",
        });
        let html = await resp.text();
        
        // Inject <base> tag so all relative URLs resolve to the server
        html = html.replace(
          /<head>/i,
          `<head><base href="${SERVER_URL}/p/sb/" />`
        );
        
        // Replace all /p/ paths with full server URL
        html = html.replace(/(?:href|src|action)=(["'])\/p\//g, (match, quote) => {
          return match.replace(`${quote}/p/`, `${quote}${SERVER_URL}/p/`);
        });
        
        // Fix form actions
        html = html.replace(/action=(["'])\/p\//g, `action=$1${SERVER_URL}/p/`);
        
        if (!cancelled) {
          setHtmlContent(html);
          setLoading(false);
        }
      } catch (err) {
        console.error("Proxy fetch error:", err);
        if (!cancelled) setLoading(false);
      }
    }
    
    loadPage();
    return () => { cancelled = true; };
  }, [currentPath]);

  // Listen for navigation inside the iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "proxy-navigate") {
        setCurrentPath(e.data.path);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
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
      background: "#fff",
    }}>
      {loading && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #059669",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent || undefined}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          margin: 0,
          padding: 0,
          opacity: loading ? 0 : 1,
          transition: "opacity 0.2s",
        }}
        title="المركز السعودي للأعمال"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
      />
    </div>
  );
}
