import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo - in production, this would be handled by a backend
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user' as const,
  },
];

const AUTH_STORAGE_KEY = 'feedback-auth-user';
const USERS_STORAGE_KEY = 'feedback-users';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const loadUsers = (): typeof MOCK_USERS => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return MOCK_USERS;
};

const saveUsers = (users: typeof MOCK_USERS) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(loadUsers);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'user' as const,
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Auto-login the new user
    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
    
    setUser(userWithoutPassword);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return {
    user,
    login,
    signup,
    logout,
    isLoading,
  };
};

export { AuthContext };