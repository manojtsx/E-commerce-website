import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAPI } from "./api-context";

// Define the shape of the context data
interface AuthContextType {
    token: string | null;
    storeTokenInSS: (token: string) => Promise<void>;
    logout: () => void;
    role: string | null;
    setLoginStatus: (status : boolean) => void;
    loggedIn: boolean;
    user : {
        _id : string, 
        name : string,
        address : string,
        role : string,
        username : string
    } | null;
}

// Corrected: The default value for createContext should match the AuthContextType
export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const API = useAPI();
    // Always remove token on starting the system if present
    const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(null);
    const [user,setUser] = useState(null);
    const [loggedIn, setIsLoggedIn] = useState(false);

    // Function to set Login status
    const setLoginStatus = async (status : boolean) => {
        setIsLoggedIn(status);
    }

    // Function to check whether user is admin or not
    const checkRole = async (serverToken: string | null) => {
        if (!serverToken) return;
        // Fetch user data from server
        const response = await fetch(`${API}api/auth/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${serverToken}`,
            },
        });
        const data = await response.json();
        setRole(data.user.role);
        setUser(data.user);
    };

    useEffect(() => {
        if (token === null) {
            setRole(null);
        } else {
            checkRole(token);
        }
    }, [token]);

    // Function to store token in Session Storage
    const storeTokenInSS = async (newToken: string) => {
        setToken(newToken);
        sessionStorage.setItem('token', newToken);
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setToken(null);
        setRole(null);
        setIsLoggedIn(!loggedIn);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, storeTokenInSS, logout, role, setLoginStatus, loggedIn, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
};