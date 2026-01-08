import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import AnimatedBackground from "@/components/background/AnimatedBackground";
import GoogleButton from "@/components/GoogleButton";
import TradingStats from "@/components/TradingStats";
import { Link } from "react-router-dom";
import { LineChart, Shield, Sparkles } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/dashboard");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const features = [
    { icon: LineChart, text: "Análisis detallado de trades" },
    { icon: Shield, text: "Datos seguros y privados" },
    { icon: Sparkles, text: "Insights con IA (Proximamente)" },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-profit to-profit/70 flex items-center justify-center"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <LineChart className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <motion.div
                className="absolute -inset-1 rounded-xl bg-profit/20 blur-md -z-10"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-2xl font-bold font-display text-foreground">
              TradeLog
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-display leading-tight">
              Domina tu
              <br />
              <span className="text-gradient-profit">Trading</span>
              <br />
              con Datos
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Registra, analiza y mejora cada operación. Tu diario de trading 
              inteligente para alcanzar la consistencia.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <TradingStats />
          </motion.div>
        </motion.div>

        {/* Right side - Login Card */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          {/* Glow behind card */}
          <motion.div
            className="absolute -inset-4 bg-gradient-radial from-primary/20 via-primary/5 to-transparent blur-2xl -z-10"
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* === INICIO DE LA TARJETA PRINCIPAL === */}
          <motion.div
            className="relative backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl p-8 space-y-8 overflow-hidden" 
            whileHover={{ borderColor: "hsl(var(--primary) / 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. Card header */}
            <div className="text-center space-y-2">
              <motion.h2
                className="text-2xl font-bold font-display"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Bienvenido
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Inicia sesión para acceder a tu journal
              </motion.p>
            </div> 
  
            {/* 2. Divider */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center">
                <motion.span
                  className="bg-card px-4 py-1 text-xs text-muted-foreground uppercase tracking-wider"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Acceso seguro
                </motion.span>
              </div>
            </motion.div>

            {/* 3. Google Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <GoogleButton />
            </motion.div>

            {/* 4. Terms */}
            <motion.p
              className="text-center text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Al continuar, aceptas nuestros{" "}
              <Link 
                to="/terms" 
                className="text-primary hover:underline cursor-pointer transition-colors hover:text-primary/80"
              >
                Términos de Servicio
              </Link>{" "}
              y{" "}
              <Link 
                to="/privacy" 
                className="text-primary hover:underline cursor-pointer transition-colors hover:text-primary/80"
              >
                Política de Privacidad
              </Link>
            </motion.p>


          </motion.div> 
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default Auth;
