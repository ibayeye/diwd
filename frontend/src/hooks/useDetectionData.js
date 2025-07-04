import { useState, useEffect } from "react";
import socket from "../utils/socket.js";
import { universalStorage, deviceDetector } from "../utils/storage.js";
// Pastikan helper universalStorage & deviceDetector dipindah ke /utils/storage.js biar reusable

export default function useDetectionData() {
    const [detectedEarthquake, setDetectedEarthquake] = useState(new Set());
    const [detectedError, setDetectedError] = useState(new Set());
    const [isReady, setIsReady] = useState(false);
    const [storageType, setStorageType] = useState("");

    // Listen socket current-state
    useEffect(() => {
        const handleInitialState = (payload) => {
            // console.log("📥 Initial state received:", payload);
            const earthquakes = payload.earthquakes || [];
            const errors = payload.errors || [];

            setDetectedEarthquake(new Set(earthquakes));
            setDetectedError(new Set(errors));
            setIsReady(true);
        };

        socket.on("current-state", handleInitialState);

        // Baru minta state manual
        socket.emit("request-current-state");

        return () => {
            socket.off("current-state", handleInitialState);
        };
    }, []);

    // Load dari storage
    useEffect(() => {
        const initializeData = async () => {
            try {
                setStorageType(
                    deviceDetector.isMobileChrome()
                        ? "IndexedDB (Mobile)"
                        : "localStorage (Desktop)"
                );

                const savedEarthquake = await universalStorage.getItem("detectedEarthquake");
                const savedError = await universalStorage.getItem("detectedError");

                if (savedEarthquake) {
                    const parsed = JSON.parse(savedEarthquake);
                    setDetectedEarthquake(new Set(parsed));
                    // console.log("Loaded detectedEarthquake:", parsed.length, "items");
                }

                if (savedError) {
                    const parsed = JSON.parse(savedError);
                    setDetectedError(new Set(parsed));
                    // console.log("Loaded detectedError:", parsed.length, "items");
                }
            } catch (error) {
                console.warn("Error initializing data from storage:", error);
            }
        };
        initializeData();
    }, []);



    // Listen earthquake-alert
    useEffect(() => {
        const handleEarthquake = (payload) => {
            console.log("🌍 Earthquake alert:", payload);
            setDetectedEarthquake((prev) => {
                const newSet = new Set(prev);
                newSet.add(payload.deviceId);
                return newSet;
            });
        };

        socket.on("earthquake-alert", handleEarthquake);
        return () => socket.off("earthquake-alert", handleEarthquake);
    }, []);

    // Listen error-alert
    useEffect(() => {
        const handleError = (payload) => {
            console.log("⚠️ Error alert:", payload);
            setDetectedError((prev) => {
                const newSet = new Set(prev);
                newSet.add(payload.deviceId);
                return newSet;
            });
        };

        socket.on("error-alert", handleError);
        return () => socket.off("error-alert", handleError);
    }, []);

    // Debounce save detectedEarthquake
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            await universalStorage.setItem(
                "detectedEarthquake",
                JSON.stringify([...detectedEarthquake])
            );
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [detectedEarthquake]);

    // Debounce save detectedError
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            await universalStorage.setItem(
                "detectedError",
                JSON.stringify([...detectedError])
            );
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [detectedError]);

    // Clear all
    const clearDetectedData = async () => {
        setDetectedEarthquake(new Set());
        setDetectedError(new Set());
        await universalStorage.removeItem("detectedEarthquake");
        await universalStorage.removeItem("detectedError");
    };

    return {
        detectedEarthquake,
        detectedError,
        isReady,
        storageType,
        clearDetectedData,
    };
}
