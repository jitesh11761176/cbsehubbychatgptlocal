
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  loginWithPhone: (phone: string, otp: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock login functions
  const loginWithGoogle = () => {
    // In a real app, this would involve a popup, redirect, and API call.
    // We'll just simulate a successful login with a 'student' role.
    const mockUser: User = {
      id: 'uuid-google-123',
      email: 'student@example.com',
      displayName: 'Alex Doe',
      role: 'student',
      photoUrl: `https://api.dicebear.com/8.x/avataaars/svg?seed=alex`,
    };
    setUser(mockUser);
    // In a real app, you would store the JWT token here.
  };

  const loginWithPhone = (phone: string, otp: string) => {
    // Simulate API call to verify OTP
    console.log(`Verifying phone: ${phone} with OTP: ${otp}`);
    // We'll simulate a successful login with a 'teacher' role.
    const mockUser: User = {
      id: 'uuid-phone-456',
      phone: phone,
      displayName: 'Dr. Smith',
      role: 'teacher',
      photoUrl: `https://api.dicebear.com/8.x/avataaars/svg?seed=smith`,
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    // In a real app, you would clear auth tokens here.
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loginWithGoogle,
    loginWithPhone,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
