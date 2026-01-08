'use client';
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

const TrendLine = ({ onComplete }: { onComplete: () => void }) => {
  const pathData = useMemo(() => {
    // Coordenadas numéricas puras (0 a 100)
    let d = "M -10 50"; 
    let y = 50;
    
    // Generamos 20 puntos
    for (let i = 0; i <= 20; i++) {
      const x = i * 5; 
      const change = (Math.random() - 0.5) * 35; 
      y = Math.max(15, Math.min(85, y + change)); 
      
      d += ` S ${x - 2.5} ${y + (Math.random()-0.5)*15}, ${x} ${y}`;
    }
    return d;
  }, []);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 overflow-visible"
    >
      {/* Línea Principal (Núcleo)  */}
      <motion.path
        d={pathData}
        fill="none"
        stroke="hsl(var(--gold))"
        strokeWidth="0.4" 
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: [0, 0.8, 0.8, 0] 
        }}
        transition={{ 
          duration: 8, 
          times: [0, 0.1, 0.8, 1],
          ease: "easeInOut"
        }}
        onAnimationComplete={onComplete}
      />
      
      {/* Línea de Brillo (Glow)  */}
      <motion.path
        d={pathData}
        fill="none"
        stroke="hsl(var(--gold))"
        strokeWidth="3" 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: [0, 0.15, 0.15, 0]
        }}
        transition={{ 
          duration: 8,
          times: [0, 0.1, 0.8, 1],
          ease: "easeInOut"
        }}
        style={{ filter: "blur(5px)" }} 
      />
    </svg>
  );
};

const DynamicTrendLine = () => {
  const [cycle, setCycle] = useState(0);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <TrendLine key={cycle} onComplete={() => setCycle(c => c + 1)} />
    </div>
  );
};

export default DynamicTrendLine;