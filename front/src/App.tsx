
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

// Import contexts
import { AuthProvider } from "@/contexts/AuthContext";

// Import layouts
import DashboardLayout from "@/components/DashboardLayout";

// Import pages
import Login from "@/pages/Login";
import AdminsPage from "@/pages/AdminsPage";
import CompaniesPage from "@/pages/CompaniesPage";
import SurveyBuilderPage from "@/pages/SurveyBuilderPage";
import CompanyDashboardPage from "@/pages/CompanyDashboardPage";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";

// i18n initialization
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Auth route guard component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const ProtectedCompanyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'company') {
    return <Navigate to="/admins" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard layout with nested routes */}
      <Route path="/" element={<DashboardLayout />}>
        {/* Admin routes */}
        <Route 
          path="admins" 
          element={
            <ProtectedAdminRoute>
              <AdminsPage />
            </ProtectedAdminRoute>
          } 
        />
        <Route 
          path="companies" 
          element={
            <ProtectedAdminRoute>
              <CompaniesPage />
            </ProtectedAdminRoute>
          } 
        />
        <Route 
          path="survey-builder" 
          element={
            <ProtectedAdminRoute>
              <SurveyBuilderPage />
            </ProtectedAdminRoute>
          } 
        />
        
        {/* Company routes */}
        <Route 
          path="dashboard" 
          element={
            <ProtectedCompanyRoute>
              <CompanyDashboardPage />
            </ProtectedCompanyRoute>
          } 
        />
        
        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>
      
      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
