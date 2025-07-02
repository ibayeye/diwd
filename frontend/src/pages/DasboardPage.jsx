import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Maps from "../components/Maps";
import { ReactComponent as Loc } from "../assets/Icons/locD.svg";
import { ReactComponent as IUser } from "../assets/Icons/iUser.svg";
import { ReactComponent as IDetected } from "../assets/Icons/idetected.svg";
import { ReactComponent as IEarthquake } from "../assets/Icons/iEarthquake.svg";
import socket from "../utils/socket";
import { RxHamburgerMenu } from "react-icons/rx";

// IndexedDB helper untuk mobile
const indexedDBHelper = {
  dbName: "EarthquakeDetectionDB",
  version: 1,
  storeName: "detectionData",

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "key" });
        }
      };
    });
  },

  async setItem(key, value) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      
      const data = {
        key: key,
        value: value,
        timestamp: Date.now()
      };
      
      return new Promise((resolve, reject) => {
        const request = store.put(data);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn("IndexedDB setItem error:", error);
      return false;
    }
  },

  async getItem(key) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn("IndexedDB getItem error:", error);
      return null;
    }
  },

  async removeItem(key) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn("IndexedDB removeItem error:", error);
      return false;
    }
  }
};

// Detect device type
const deviceDetector = {
  isMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
           window.innerWidth <= 768 ||
           ('ontouchstart' in window);
  },

  isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  },

  isMobileChrome() {
    return this.isMobile() && this.isChrome();
  }
};

// Universal storage helper yang memilih antara IndexedDB dan localStorage
const universalStorage = {
  useMobileStorage: deviceDetector.isMobileChrome(),

  async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      
      if (this.useMobileStorage) {
        console.log("Using IndexedDB for mobile storage");
        return await indexedDBHelper.setItem(key, stringValue);
      } else {
        console.log("Using localStorage for desktop storage");
        if (typeof Storage !== "undefined" && localStorage) {
          localStorage.setItem(key, stringValue);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.warn("Universal storage setItem error:", error);
      // Fallback ke sessionStorage
      try {
        if (sessionStorage) {
          sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
          return true;
        }
      } catch (fallbackError) {
        console.warn("Fallback storage error:", fallbackError);
      }
      return false;
    }
  },

  async getItem(key) {
    try {
      if (this.useMobileStorage) {
        const value = await indexedDBHelper.getItem(key);
        return value;
      } else {
        if (typeof Storage !== "undefined" && localStorage) {
          return localStorage.getItem(key);
        }
        return null;
      }
    } catch (error) {
      console.warn("Universal storage getItem error:", error);
      // Fallback ke sessionStorage
      try {
        if (sessionStorage) {
          return sessionStorage.getItem(key);
        }
      } catch (fallbackError) {
        console.warn("Fallback storage getItem error:", fallbackError);
      }
      return null;
    }
  },

  async removeItem(key) {
    try {
      if (this.useMobileStorage) {
        return await indexedDBHelper.removeItem(key);
      } else {
        if (typeof Storage !== "undefined" && localStorage) {
          localStorage.removeItem(key);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.warn("Universal storage removeItem error:", error);
      return false;
    }
  }
};

const Dashboard = () => {
  const [totalDevice, setTotalDevice] = useState(0);
  const [totalDeviceFailure, setTotalDeviceFailure] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState({
    devices: true,
    failures: true,
    users: true,
  });
  const [error, setError] = useState(null);
  const [storageType, setStorageType] = useState("");
  
  // State initialization
  const [detectedEarthquake, setDetectedEarthquake] = useState(new Set());
  const [detectedError, setDetectedError] = useState(new Set());

  // Initialize data from storage
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Set storage type info
        setStorageType(deviceDetector.isMobileChrome() ? "IndexedDB (Mobile)" : "localStorage (Desktop)");
        
        // Load detectedEarthquake
        const savedEarthquake = await universalStorage.getItem("detectedEarthquake");
        if (savedEarthquake) {
          try {
            const parsed = JSON.parse(savedEarthquake);
            setDetectedEarthquake(new Set(parsed));
            console.log("Loaded detectedEarthquake:", parsed.length, "items");
          } catch (parseError) {
            console.warn("Error parsing detectedEarthquake:", parseError);
          }
        }

        // Load detectedError
        const savedError = await universalStorage.getItem("detectedError");
        if (savedError) {
          try {
            const parsed = JSON.parse(savedError);
            setDetectedError(new Set(parsed));
            console.log("Loaded detectedError:", parsed.length, "items");
          } catch (parseError) {
            console.warn("Error parsing detectedError:", parseError);
          }
        }
      } catch (error) {
        console.warn("Error initializing data from storage:", error);
      }
    };

    initializeData();
  }, []);

  // Save detectedEarthquake dengan debouncing
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        const success = await universalStorage.setItem(
          "detectedEarthquake",
          JSON.stringify([...detectedEarthquake])
        );
        if (success) {
          console.log("✅ Saved detectedEarthquake:", detectedEarthquake.size, "items");
        } else {
          console.warn("❌ Failed to save detectedEarthquake");
        }
      } catch (error) {
        console.warn("Error saving detectedEarthquake:", error);
      }
    }, 1000); // Debounce 1 detik

    return () => clearTimeout(timeoutId);
  }, [detectedEarthquake]);

  // Save detectedError dengan debouncing
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        const success = await universalStorage.setItem(
          "detectedError",
          JSON.stringify([...detectedError])
        );
        if (success) {
          console.log("✅ Saved detectedError:", detectedError.size, "items");
        } else {
          console.warn("❌ Failed to save detectedError");
        }
      } catch (error) {
        console.warn("Error saving detectedError:", error);
      }
    }, 1000); // Debounce 1 detik

    return () => clearTimeout(timeoutId);
  }, [detectedError]);

  useEffect(() => {
    const handleEarthquake = (payload) => {
      console.log("🌍 Earthquake alert received:", payload);
      setDetectedEarthquake((prev) => {
        const newSet = new Set(prev);
        newSet.add(payload.deviceId);
        console.log("Updated earthquake detection count:", newSet.size);
        return newSet;
      });
    };

    socket.on("earthquake-alert", handleEarthquake);

    return () => {
      socket.off("earthquake-alert", handleEarthquake);
    };
  }, []);

  useEffect(() => {
    const handleError = (payload) => {
      console.log("⚠️ Error alert received:", payload);
      setDetectedError((prev) => {
        const newSet = new Set(prev);
        newSet.add(payload.deviceId);
        console.log("Updated error detection count:", newSet.size);
        return newSet;
      });
    };

    socket.on("error-alert", handleError);

    return () => {
      socket.off("error-alert", handleError);
    };
  }, []);

  // Clear all detected data
  const clearDetectedData = async () => {
    try {
      setDetectedEarthquake(new Set());
      setDetectedError(new Set());
      
      await Promise.all([
        universalStorage.removeItem("detectedEarthquake"),
        universalStorage.removeItem("detectedError")
      ]);
      
      console.log("🗑️ Cleared all detected data");
    } catch (error) {
      console.warn("Error clearing detected data:", error);
    }
  };

  // Test storage functionality
  const testStorage = async () => {
    try {
      const testKey = 'storage_test_' + Date.now();
      const testValue = 'test_value_' + Math.random();
      
      console.log("🧪 Testing storage...");
      const setSuccess = await universalStorage.setItem(testKey, testValue);
      console.log("Set result:", setSuccess);
      
      const retrievedValue = await universalStorage.getItem(testKey);
      console.log("Retrieved value:", retrievedValue);
      
      const removeSuccess = await universalStorage.removeItem(testKey);
      console.log("Remove result:", removeSuccess);
      
      if (setSuccess && retrievedValue === testValue && removeSuccess) {
        console.log("✅ Storage test passed!");
        alert("Storage berfungsi dengan baik!");
      } else {
        console.log("❌ Storage test failed!");
        alert("Storage mengalami masalah!");
      }
    } catch (error) {
      console.warn("Storage test error:", error);
      alert("Storage test error: " + error.message);
    }
  };

  const fetchData = async (url, setter, loadingkey) => {
    setLoading((prev) => ({ ...prev, [loadingkey]: true }));
    setError(null);

    try {
      // Prioritas: localStorage -> sessionStorage -> cookies
      let token = await universalStorage.getItem("token");
      if (!token && sessionStorage) {
        token = localStorage.getItem("token");
      }
      if (!token) {
        token = localStorage.getItem("token");
      }
      
      if (!token) {
        throw new Error("token tidak ditemukan");
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      
      if (response.data) {
        setter(
          response.data.totalDevice ||
            response.data.totaldata ||
            response.data.totaldeviceFailure ||
            0
        );
      } else {
        throw new Error("Data yang diterima tidak valid");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setter(0);
    } finally {
      setLoading((prev) => ({ ...prev, [loadingkey]: false }));
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(
          "https://server.diwd.cloud/api/v1/getDevice",
          setTotalDevice,
          "devices"
        ),
        fetchData(
          "https://server.diwd.cloud/api/v1/auth/pengguna",
          setTotalUsers,
          "users"
        ),
      ]);
    };

    fetchAllData();
  }, []);

  const borderColors = {
    red: "border-b border-red-500",
    blue: "border-blue-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
  };

  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4">
        <DataCard
          title="Total Perangkat"
          value={loading.devices ? "Loading..." : totalDevice}
          Icon={Loc}
          borderColor={borderColors.blue}
        />
        <DataCard
          title="Kegagalan Perangkat Terdeteksi"
          value={detectedError.size}
          Icon={IDetected}
          borderColor={borderColors.yellow}
        />
        <DataCard
          title={
            loading.users
              ? "Loading Users..."
              : `Terdapat ${totalUsers || 0} Pengguna Dalam Sistem`
          }
          value={loading.users ? "Loading..." : totalUsers}
          Icon={IUser}
          borderColor={borderColors.red}
        />
        <DataCard
          title="Earthquake detection devices"
          value={detectedEarthquake.size}
          Icon={IEarthquake}
          borderColor={borderColors.green}
        />
      </div>
      
      {/* Debug info dan controls */}
      {/* <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-bold mb-2">Storage Info:</h3>
            <p>📱 Device: {deviceDetector.isMobile() ? "Mobile" : "Desktop"}</p>
            <p>🌐 Browser: {deviceDetector.isChrome() ? "Chrome" : "Other"}</p>
            <p>💾 Storage: {storageType}</p>
            <p>📊 Screen: {window.innerWidth} x {window.innerHeight}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Detection Data:</h3>
            <p>🌍 Earthquakes: {detectedEarthquake.size}</p>
            <p>⚠️ Errors: {detectedError.size}</p>
            <p>🔄 Using: {universalStorage.useMobileStorage ? "IndexedDB" : "localStorage"}</p>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2 flex-wrap">
          <button 
            onClick={clearDetectedData}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            🗑️ Clear All Data
          </button>
          <button 
            onClick={testStorage}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            🧪 Test Storage
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            🔄 Reload Page
          </button>
        </div>
      </div> */}
      
      {error && (
        <div className="text-red-500 mt-4 p-3 bg-red-50 rounded">
          <p>❌ Error: {error}</p>
        </div>
      )}
      
      <Maps />
    </div>
  );
};

const DataCard = ({ title, value, Icon, borderColor }) => (
  <div
    className={`border-b-2 ${borderColor} h-28 bg-white rounded-lg p-2 flex flex-row shadow-sm`}
  >
    <div className="w-20 h-20 bg-gray-300 rounded-full flex justify-center items-center my-auto mr-4">
      <Icon className="w-8 h-8" />
    </div>
    <div className="flex flex-col my-auto">
      <span className="text-2xl font-bold">{value}</span>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  </div>
);

export default Dashboard;