import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  isAdmin: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, age: number) => Promise<boolean>;
  adminLogin: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('meditrack_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulated login - replace with actual API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo user
    if (email && password) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        age: 25,
        isAdmin: false,
        createdAt: new Date(),
      };
      setUser(newUser);
      localStorage.setItem('meditrack_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string, name: string, age: number): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      age,
      isAdmin: false,
      createdAt: new Date(),
    };
    setUser(newUser);
    localStorage.setItem('meditrack_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const adminLogin = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo admin credentials
    if (phone === '7388917730' && password === 'Harsh@394') {
      const adminUser: User = {
        id: 'admin-001',
        email: 'admin@meditrack.com',
        name: 'Admin',
        age: 30,
        isAdmin: true,
        createdAt: new Date(),
      };
      setUser(adminUser);
      localStorage.setItem('meditrack_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('meditrack_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
