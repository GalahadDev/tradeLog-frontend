'use client';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const BottomCandleChart = () => {
  const [candles, setCandles] = useState<Array<{ 
    baseH: number; 
    targetH: number; 
    y: number; 
    isUp: boolean;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Creamos 60 velas para cubrir el ancho
    const data = Array.from({ length: 60 }).map(() => {
      const baseHeight = Math.random() * 150 + 50; // Altura base entre 50 y 200px
  
      const moveAmount = (Math.random() - 0.5) * 60; // Se moverá +/- 30px
      
      return {
        baseH: baseHeight,
        targetH: Math.max(20, baseHeight + moveAmount), // Altura destino
        y: Math.random() * 40, // Elevación del suelo
        isUp: Math.random() > 0.45,
        duration: Math.random() * 3 + 2, // Cada vela tarda entre 2 y 5 segundos en moverse 
      };
    });
    setCandles(data);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[50vh] flex items-end justify-between px-2 opacity-30 pointer-events-none gap-1">
      {candles.map((c, i) => (
        <motion.div
          key={i}
          // Animación de entrada 
          initial={{ height: 0, opacity: 0 }}
          // Animación continua (Respiración)
          animate={{ 
            height: [c.baseH, c.targetH], 
            opacity: 1 
          }}
          transition={{
            // Transición de entrada
            opacity: { duration: 0.8, delay: i * 0.02 },
            // Transición de altura
            height: {
              duration: c.duration,
              repeat: Infinity,
              repeatType: "mirror", 
              ease: "easeInOut",
            }
          }}
          className="relative w-full flex justify-center items-end"
          style={{ marginBottom: c.y }}
        >
          {/* Mecha (Línea central) */}
          <div 
            className={`absolute w-[1px] h-[120%] ${c.isUp ? 'bg-profit' : 'bg-loss'}`} 
            style={{ opacity: 0.6, bottom: "-10%" }}
          />
          
          {/* Cuerpo de la vela */}
          <div 
            className={`relative w-full ${c.isUp ? 'bg-profit' : 'bg-loss'} rounded-[1px]`}
            style={{ 
              height: "100%", // Ocupa el 100% de la altura animada del padre
              boxShadow: c.isUp ? '0 0 15px rgba(34, 197, 94, 0.4)' : '0 0 15px rgba(239, 68, 68, 0.4)'
            }} 
          />
        </motion.div>
      ))}
      
      {/* Gradiente para integrar con el fondo */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  );
};

export default BottomCandleChart;