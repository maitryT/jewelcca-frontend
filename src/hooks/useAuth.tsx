import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('jewelcca_user');
    const storedToken = localStorage.getItem('jewelcca_token');
    
    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser);
      setUser({
        ...userData,
        isAdmin: userData.role === 'ADMIN'
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { token, id, email: userEmail, firstName, lastName, role } = response.data;
      
      const userData = {
        id,
        email: userEmail,
        firstName,
        lastName,
        role,
        isAdmin: role === 'ADMIN'
      };
      
      setUser(userData);
      localStorage.setItem('jewelcca_token', token);
      localStorage.setItem('jewelcca_user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(firstName, lastName, email, password);
      const { token, id, email: userEmail, firstName: userFirstName, lastName: userLastName, role } = response.data;
      
      const userData = {
        id,
        email: userEmail,
        firstName: userFirstName,
        lastName: userLastName,
        role,
        isAdmin: role === 'ADMIN'
      };
      
      setUser(userData);
      localStorage.setItem('jewelcca_token', token);
      localStorage.setItem('jewelcca_user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jewelcca_token');
    localStorage.removeItem('jewelcca_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}