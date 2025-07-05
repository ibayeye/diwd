// utils/storage.js

// Device detector
export const deviceDetector = {
    isMobile() {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        "mobile",
        "android",
        "iphone",
        "ipad",
        "ipod",
        "blackberry",
        "windows phone",
      ];
      return (
        mobileKeywords.some((keyword) => userAgent.includes(keyword)) ||
        window.innerWidth <= 768 ||
        "ontouchstart" in window
      );
    },
  
    isChrome() {
      return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    },
  
    isMobileChrome() {
      return this.isMobile() && this.isChrome();
    },
  };
  
  // IndexedDB helper
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
            db.createObjectStore(this.storeName, { keyPath: "key" });
          }
        };
      });
    },
  
    async setItem(key, value) {
      try {
        const db = await this.openDB();
        const tx = db.transaction([this.storeName], "readwrite");
        const store = tx.objectStore(this.storeName);
        const data = { key, value, timestamp: Date.now() };
  
        return new Promise((resolve, reject) => {
          const req = store.put(data);
          req.onsuccess = () => resolve(true);
          req.onerror = () => reject(req.error);
        });
      } catch (err) {
        console.warn("IndexedDB setItem error:", err);
        return false;
      }
    },
  
    async getItem(key) {
      try {
        const db = await this.openDB();
        const tx = db.transaction([this.storeName], "readonly");
        const store = tx.objectStore(this.storeName);
  
        return new Promise((resolve, reject) => {
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result ? req.result.value : null);
          req.onerror = () => reject(req.error);
        });
      } catch (err) {
        console.warn("IndexedDB getItem error:", err);
        return null;
      }
    },
  
    async removeItem(key) {
      try {
        const db = await this.openDB();
        const tx = db.transaction([this.storeName], "readwrite");
        const store = tx.objectStore(this.storeName);
  
        return new Promise((resolve, reject) => {
          const req = store.delete(key);
          req.onsuccess = () => resolve(true);
          req.onerror = () => reject(req.error);
        });
      } catch (err) {
        console.warn("IndexedDB removeItem error:", err);
        return false;
      }
    },
  };
  
  // Universal storage (smart wrapper)
  export const universalStorage = {
    useMobileStorage: deviceDetector.isMobileChrome(),
  
    async setItem(key, value) {
      try {
        const stringValue = typeof value === "string" ? value : JSON.stringify(value);
  
        if (this.useMobileStorage) {
          console.log("Using IndexedDB");
          return await indexedDBHelper.setItem(key, stringValue);
        }
  
        if (typeof Storage !== "undefined" && localStorage) {
          localStorage.setItem(key, stringValue);
          return true;
        }
  
        return false;
      } catch (err) {
        console.warn("universalStorage setItem error:", err);
  
        // Fallback ke sessionStorage
        try {
          if (sessionStorage) {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
          }
        } catch (fallbackErr) {
          console.warn("Fallback sessionStorage error:", fallbackErr);
        }
  
        return false;
      }
    },
  
    async getItem(key) {
      try {
        if (this.useMobileStorage) {
          return await indexedDBHelper.getItem(key);
        }
  
        if (typeof Storage !== "undefined" && localStorage) {
          return localStorage.getItem(key);
        }
  
        return null;
      } catch (err) {
        console.warn("universalStorage getItem error:", err);
  
        // Fallback ke sessionStorage
        try {
          if (sessionStorage) {
            return sessionStorage.getItem(key);
          }
        } catch (fallbackErr) {
          console.warn("Fallback sessionStorage getItem error:", fallbackErr);
        }
  
        return null;
      }
    },
  
    async removeItem(key) {
      try {
        if (this.useMobileStorage) {
          return await indexedDBHelper.removeItem(key);
        }
  
        if (typeof Storage !== "undefined" && localStorage) {
          localStorage.removeItem(key);
          return true;
        }
  
        return false;
      } catch (err) {
        console.warn("universalStorage removeItem error:", err);
        return false;
      }
    },
  };
  