import React, { useContext, createContext, ReactNode } from "react";

// Correctly initialize the context with a more appropriate default or undefined to handle checks properly
export const APIContext = createContext<string | undefined>(undefined);

type APIProviderProps = {
    children: ReactNode;
};

export const APIProvider: React.FC<APIProviderProps> = ({ children }) => {
    const API = import.meta.env.VITE_REACT_API;

    // Ensure that API has a value before providing it
    if (!API) {
        throw new Error("API URL is not defined in environment variables");
    }

    return <APIContext.Provider value={API}>{children}</APIContext.Provider>;
};

export const useAPI = () => {
    const APIContextValue = useContext(APIContext);

    // Since we're now initializing with undefined, this check will correctly identify if the context is missing
    if (APIContextValue === undefined) {
        throw new Error("useAPI must be used within a APIProvider");
    }

    return APIContextValue;
};