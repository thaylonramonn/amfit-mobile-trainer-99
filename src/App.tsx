import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";
import SplashScreen from "./pages/SplashScreen";
import WhoAreYou from "./pages/WhoAreYou";
import Auth from "./pages/Auth";
import EnhancedPasswordRecovery from "./components/ui/enhanced-password-recovery";
import WorkoutSession from "./pages/WorkoutSession";
import TrainerDashboard from "./pages/TrainerDashboard";
import TraineeDashboard from "./pages/TraineeDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/who-are-you" element={<WhoAreYou />} />
            <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<EnhancedPasswordRecovery />} />
          <Route path="/workout/:workoutId" element={<WorkoutSession />} />
            <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
            <Route path="/trainee-dashboard" element={<TraineeDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
