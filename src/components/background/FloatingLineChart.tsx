import { motion } from "framer-motion";
import { useMemo } from "react";

const FloatingLineChart = ({ color = "hsl(var(--profit))" }: { color?: string }) => {
  // Generamos un camino aleatorio estilo "Random Walk" para el precio
  const pathData = useMemo(() => {
    let d = "M 0 60";
    let currentY = 60;
    
    // Generamos 10 puntos de datos
    for (let i = 1; i <= 10; i++) {
      const x = i * 22; // Espaciado horizontal
      const change = (Math.random() - 0.5) * 40; 
      currentY = Math.max(10, Math.min(110, currentY + change)); // Mantener dentro de 10-110px
      d += ` L ${x} ${currentY}`;
    }
    return d;
  }, []);

  return (
    <motion.div
      className="absolute opacity-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.3, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <svg
        width="220"
        height="120"
        viewBox="0 0 220 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Línea Principal */}
        <motion.path
          d={pathData}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Sombra brillante (Glow effect) */}
        <motion.path
          d={pathData}
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ filter: "blur(4px)" }}
        />
      </svg>
    </motion.div>
  );
};

export default FloatingLineChart;