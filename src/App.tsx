import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Pending from "./pages/Pending";
import Profile from "./pages/Profiles";     
import UsersAdmin from "./pages/Users";  
import NotFound from "./pages/NotFound";
import Journal from "./pages/Journal";
import Stats from "./pages/Stats";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pending" element={<Pending />} />  
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;