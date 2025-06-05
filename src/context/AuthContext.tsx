import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { usePocketBase } from './PocketBaseContext';
import { CollectionNames } from '../enums/CollectionNames';

interface AuthContextProps {
    isAuthenticated: boolean;
    userId: string | null;
    login: (username: string, password: string) => Promise<string | null>; // Returns MFA ID if needed
    verifyOTP: (otp: string, otpId: string, mfaId: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const pb = usePocketBase();
    const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
    const [userId, setUserId] = useState(pb.authStore.model?.id || null);

    // Step 1: Login with username and password
    const login = async (username: string, password: string): Promise<string | null> => {
        try {
            await pb.collection(CollectionNames.APP_USERS).authWithPassword(username, password);
            setIsAuthenticated(pb.authStore.isValid);
            setUserId(pb.authStore.model?.id || null);
            return null; // No MFA required
        } catch (error: any) {
            const mfaId = error.response?.mfaId;

            if (!mfaId) {
                throw error; // Not an MFA issue -> throw error
            }
            
            // Step 2: Request OTP if MFA is required
            const result = await pb.collection(CollectionNames.APP_USERS).requestOTP(username);
            return result.otpId ? `${result.otpId}|${mfaId}` : null;
        }
    };

    // Step 3: Verify OTP
    const verifyOTP = async (otp: string, otpId: string, mfaId: string) => {
        await pb.collection(CollectionNames.APP_USERS).authWithOTP(otpId, otp, { mfaId });
        setIsAuthenticated(pb.authStore.isValid);
        setUserId(pb.authStore.model?.id || null);
    };

    const logout = () => {
        pb.authStore.clear();
        setIsAuthenticated(false);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, login, verifyOTP, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
