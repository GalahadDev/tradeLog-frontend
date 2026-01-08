import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/background/AnimatedBackground";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-background text-foreground overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-8 hover:bg-white/5 text-muted-foreground hover:text-foreground gap-2 pl-0"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl p-8 md:p-12 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-display">Política de Privacidad</h1>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Última actualización: {new Date().toLocaleDateString()}
            </p>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">1. Introducción</h2>
              <p>
                Bienvenido a TradeLog. Esta aplicación es un proyecto de portafolio desarrollado con fines educativos y demostrativos por Samuel Llach. No somos una empresa registrada ni una entidad comercial.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">2. Recopilación de Datos</h2>
              <p>
                Para el funcionamiento básico de la aplicación, utilizamos servicios de terceros (Supabase) para la autenticación y base de datos. La información que se almacena se limita a:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Correo electrónico (para el inicio de sesión).</li>
                <li>Datos de operaciones de trading que tú ingreses voluntariamente.</li>
                <li>Información básica del perfil (nombre, experiencia).</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">3. Uso de la Información</h2>
              <p>
                La información recopilada se utiliza exclusivamente para proporcionar la funcionalidad del Diario de Trading. <strong>No vendemos, alquilamos ni compartimos tus datos con terceros</strong> con fines comerciales.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">4. Seguridad</h2>
              <p>
                Aunque nos esforzamos por proteger tus datos utilizando proveedores de confianza como Supabase, recuerda que este es un proyecto de demostración. Se recomienda no ingresar información sensible crítica o contraseñas que utilices en servicios bancarios.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">5. Contacto</h2>
              <p>
                Si tienes preguntas sobre este proyecto o cómo se manejan los datos, puedes contactarme a través de mi perfil de LinkedIn o GitHub proporcionado en el pie de página de la aplicación.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;