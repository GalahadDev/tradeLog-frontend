import { motion } from "framer-motion";
import { Linkedin, Github, Heart } from "lucide-react";

export const DashboardFooter = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-auto relative z-10"
    >
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Creator info */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Creado por </span>
            <span className="font-semibold text-foreground">Samuel Llach</span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/samuelllach"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 border border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all duration-300"
            >
              <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                LinkedIn
              </span>
            </a>
            <a
              href="https://github.com/GalahadDev"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Github className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                GitHub
              </span>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TradeLog. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </motion.footer>
  );
};