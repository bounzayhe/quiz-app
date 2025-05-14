import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Role } from "@/lib/types";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, mockResponse?: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
  token: null,
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // State to store the authenticated user information
  const [user, setUser] = useState<User | null>(null);
  // State to store the JWT token
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Look for token and user data in localStorage (persists between page refreshes)
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        // If both exist, restore the authenticated session
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Authentication error:", err);
        // If there's an error parsing the stored user, clear session
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Function to handle user login
  const login = async (email: string, password: string, mockResponse?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      // For demo accounts, use the mock response
      if (mockResponse) {
        response = mockResponse;
      } else {
        // For real users, send login request to backend API
        response = await api.login(email, password);
      }

      if (response.token && response.role) {
        // Store token in localStorage for persistent auth
        localStorage.setItem("token", response.token);

        // Create user object from login response
        const userData: User = {
          id: response.id || "123", // Try to get ID from response or use default
          name: response.name || email.split("@")[0], // Try to get name from response or use email prefix
          email,
          role: response.role,
          lastAccess: new Date().toISOString(),
        };

        // Store user data in localStorage and state
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(response.token);
        setUser(userData);

        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name}!`,
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      toast({
        variant: "destructive",
        title: "Login failed",
        description:
          err.message || "Please check your credentials and try again",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle user logout
  const logout = () => {
    // Remove auth data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Clear auth state
    setToken(null);
    setUser(null);

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Provide auth context to children components
  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, error, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
