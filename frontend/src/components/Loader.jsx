// ./components/Loader.js
import React, { createContext, useState, useContext } from "react";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">Loading...</div>}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
