import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { 
  LogOut, LineChart, Loader2, 
  User as UserIcon, Shield, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import AnimatedBackground from "@/components/background/AnimatedBackground"; 
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/", { replace: true });
        return;
      }

      try {
        if (!userProfile) {
            const response = await api.get('/users/me');
            setUserProfile(response.data.user);
        }
      } catch (error) {
        console.error("Error validando sesión:", error);
        await supabase.auth.signOut();
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
        setLoading(true);
        await supabase.auth.signOut();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    } finally {
        localStorage.clear();
        navigate("/", { replace: true });
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-foreground flex flex-col font-sans">
      <AnimatedBackground />

      {/* HEADER GLOBAL */}
      <motion.header
        className="border-b border-border/50 backdrop-blur-xl bg-card/50 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-profit to-profit/70 flex items-center justify-center shadow-glow-sm">
              <LineChart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display hidden sm:block">TradeLog</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-3 h-auto p-2 hover:bg-white/10 hover:text-white rounded-full pr-4 transition-all group"
              >
                <div className="flex flex-col items-end text-right hidden md:flex mr-2">
                  <span className="text-sm font-medium leading-none group-hover:text-white text-foreground">
                    {userProfile?.full_name || userProfile?.email?.split('@')[0]}
                  </span>
                  <span className={`text-[10px] mt-1 font-bold ${userProfile?.role === 'admin' ? 'text-purple-400' : 'text-muted-foreground group-hover:text-gray-300'}`}>
                    {userProfile?.role === 'admin' ? 'ADMINISTRADOR' : 'TRADER'}
                  </span>
                </div>
                
                <div className="relative">
                  <img
                    src={userProfile?.avatar_url || "https://github.com/shadcn.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-primary/20 object-cover shadow-sm group-hover:border-primary/50 transition-colors"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-profit border-2 border-background rounded-full"></span>
                </div>
                
                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-white" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-card/95 border-border/50 shadow-xl text-foreground">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              
              <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer focus:bg-primary/20 focus:text-white">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>

              {userProfile?.role === 'admin' && (
                <DropdownMenuItem onClick={() => navigate("/admin/users")} className="cursor-pointer text-purple-400 focus:text-purple-300 focus:bg-purple-500/20">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Panel Admin</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-border/50" />
              
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-red-400 focus:bg-destructive/20">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      {/* CONTENIDO PRINCIPAL  */}
      <main className="flex-1 relative z-10 flex flex-col">
          {children}
      </main>
      <DashboardFooter />
    </div>
  );
};