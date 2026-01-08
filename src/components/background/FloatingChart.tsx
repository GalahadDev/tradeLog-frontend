import { motion } from "framer-motion";

const FloatingChart = () => {
  const candlesticks = [
    { height: 40, isUp: true, x: 0 },
    { height: 25, isUp: false, x: 20 },
    { height: 55, isUp: true, x: 40 },
    { height: 30, isUp: false, x: 60 },
    { height: 45, isUp: true, x: 80 },
    { height: 35, isUp: true, x: 100 },
    { height: 20, isUp: false, x: 120 },
    { height: 60, isUp: true, x: 140 },
    { height: 28, isUp: false, x: 160 },
    { height: 50, isUp: true, x: 180 },
  ];

  return (
    <motion.div
      className="absolute opacity-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.2, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <svg
        width="220"
        height="120"
        viewBox="0 0 220 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {candlesticks.map((candle, index) => (
          <motion.g key={index}>
            {/* Wick */}
            <motion.line
              x1={candle.x + 5}
              y1={100 - candle.height - 10}
              x2={candle.x + 5}
              y2={100 + 10}
              stroke={candle.isUp ? "hsl(142 76% 45%)" : "hsl(0 84% 60%)"}
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
            {/* Body */}
            <motion.rect
              x={candle.x}
              y={100 - candle.height}
              width="10"
              height={candle.height}
              fill={candle.isUp ? "hsl(142 76% 45%)" : "hsl(0 84% 60%)"}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
              style={{ transformOrigin: "bottom" }}
            />
          </motion.g>
        ))}
        
        {/* Trend line */}
        <motion.path
          d="M5 90 Q50 70 80 60 T150 40 T210 25"
          stroke="hsl(45 93% 58%)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
};

export default FloatingChart;
