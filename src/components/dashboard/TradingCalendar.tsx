import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { 
  format, startOfMonth, endOfMonth, isToday, addMonths, subMonths, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addDays 
} from "date-fns";
import { es } from "date-fns/locale";
import { dashboardService } from "@/lib/api";

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const TradingCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState<Record<string, { pnl: number; trades: number }>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMonthData = async () => {
      setLoading(true);
      try {
        const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
        const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
        
        const { data } = await dashboardService.getCalendarMetrics(start, end);
        
        const map: Record<string, { pnl: number; trades: number }> = {};
        (data.data || []).forEach((item) => {
          const dateKey = item.date.split('T')[0];
          map[dateKey] = {
            pnl: Number(item.total_pnl),
            trades: item.trade_count
          };
        });
        setMonthlyData(map);
      } catch (error) {
        console.error("Error cargando calendario", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthData();
  }, [currentMonth]);

  const getDayData = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    return monthlyData[key];
  };

  // --- LÓGICA DE SEMANAS ---
  // Generamos las semanas completas para la vista (incluyendo días de mes previo/siguiente)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { locale: es });
  const endDate = endOfWeek(monthEnd, { locale: es });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Agrupar días en arrays de 7 (Semanas)
  const weeks: Date[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Calcular Stats de la Semana
  const getWeeklyStats = (weekDays: Date[]) => {
    let weeklyPnL = 0;
    let activeDays = 0;
    
    weekDays.forEach(day => {
      // Solo sumamos si el día pertenece al mes actual 
      if (isSameMonth(day, currentMonth)) {
        const data = getDayData(day);
        if (data) {
          weeklyPnL += data.pnl;
          activeDays += 1; // Contamos días operados
        }
      }
    });

    return { weeklyPnL, activeDays };
  };

  // Estilos
  const getDayStyle = (dayData: { pnl: number; trades: number } | undefined, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return "opacity-30 grayscale"; // Días de otros meses
    if (!dayData) return "bg-card/20 border-border/30 hover:border-border";
    if (dayData.pnl > 0) return "bg-profit/10 border-profit/40 shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:bg-profit/20";
    if (dayData.pnl < 0) return "bg-loss/10 border-loss/40 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:bg-loss/20";
    return "bg-gold/10 border-gold/40 hover:bg-gold/20";
  };

  // Totales Mensuales
  const values = Object.values(monthlyData);
  const totalPnL = values.reduce((acc, day) => acc + day.pnl, 0);
  const totalTrades = values.reduce((acc, day) => acc + day.trades, 0);
  const winningDays = values.filter(day => day.pnl > 0).length;
  const losingDays = values.filter(day => day.pnl < 0).length;

  return (
    <div className="w-full mx-auto">
      {/* Header Stats */}
      <motion.div
        key={currentMonth.toISOString()} 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: "P&L Mensual", value: totalPnL, isCurrency: true },
          { label: "Trades Totales", value: totalTrades, isCurrency: false, color: "text-gold" },
          { label: "Días Ganadores", value: winningDays, isCurrency: false, color: "text-profit" },
          { label: "Días Perdedores", value: losingDays, isCurrency: false, color: "text-loss" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center shadow-sm relative overflow-hidden"
          >
             <div className="relative z-10">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{stat.label}</p>
                {loading ? (
                  <div className="h-8 flex items-center justify-center"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground"/></div>
                ) : (
                  <p className={`text-2xl font-bold font-mono ${
                    stat.isCurrency 
                      ? (stat.value as number) >= 0 ? "text-profit" : "text-loss"
                      : stat.color
                  }`}>
                    {stat.isCurrency 
                      ? `${(stat.value as number) >= 0 ? "+" : ""}$${(stat.value as number).toFixed(2)}`
                      : stat.value}
                  </p>
                )}
            </div>
            <div className={`absolute inset-0 opacity-5 ${
                 stat.isCurrency ? ((stat.value as number) >= 0 ? "bg-profit" : "bg-loss") : "bg-primary"
            }`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Calendar Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/20 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl relative"
      >
        <AnimatePresence>
            {loading && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-background/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl"
                >
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </motion.div>
            )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <motion.button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg bg-card/50 border border-border hover:border-gold/50 transition-colors"><ChevronLeft className="w-5 h-5 text-gold" /></motion.button>
          <h2 className="text-3xl font-bold text-foreground capitalize font-display">{format(currentMonth, "MMMM yyyy", { locale: es })}</h2>
          <motion.button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg bg-card/50 border border-border hover:border-gold/50 transition-colors"><ChevronRight className="w-5 h-5 text-gold" /></motion.button>
        </div>

        {/* --- GRID PRINCIPAL --- */}
        <div className="flex flex-col gap-2">
          
          {/* Header Row */}
          <div className="flex gap-2">
             {/* 7 Columnas de Días */}
             <div className="grid grid-cols-7 gap-2 flex-1">
                {weekDays.map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2 uppercase tracking-widest">
                    {day}
                    </div>
                ))}
             </div>
             {/* Espacio para la columna de 'Semana' */}
             <div className="w-24 md:w-32 text-center text-xs font-bold text-muted-foreground py-2 uppercase tracking-widest hidden sm:block">
                Resumen
             </div>
          </div>

          {/* Filas de Semanas */}
          {weeks.map((week, weekIndex) => {
            const { weeklyPnL, activeDays } = getWeeklyStats(week);
            
            return (
              <div key={weekIndex} className="flex gap-2 items-stretch h-24 md:h-28">
                
                {/* 1. La Grid de 7 Días */}
                <div className="grid grid-cols-7 gap-2 flex-1">
                  {week.map((day) => {
                    const dayData = getDayData(day);
                    const isCurrentDay = isToday(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);

                    return (
                      <div
                        key={day.toISOString()}
                        className={`
                          relative rounded-xl border flex flex-col items-center justify-center gap-1 overflow-hidden group transition-all
                          ${getDayStyle(dayData, isCurrentMonth)}
                          ${isCurrentDay ? "ring-2 ring-gold ring-offset-2 ring-offset-background" : ""}
                        `}
                      >
                         <span className={`text-xs md:text-sm font-semibold ${isCurrentDay ? "text-gold" : "text-foreground/60"}`}>
                            {format(day, "d")}
                         </span>

                         {dayData && isCurrentMonth && (
                            <>
                                <div className="flex flex-col items-center">
                                    <span className={`text-[10px] sm:text-xs font-bold font-mono ${dayData.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                                        ${Math.abs(dayData.pnl).toFixed(0)}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground/70 hidden md:block">
                                        {dayData.trades} op
                                    </span>
                                </div>
                            </>
                         )}
                      </div>
                    );
                  })}
                </div>

                {/* 2. La Tarjeta de Resumen Semanal */}
                <div className="w-24 md:w-32 hidden sm:flex flex-col rounded-xl bg-card/30 border border-border/50 p-2 justify-center items-center text-center">
                    <span className="text-[10px] text-muted-foreground uppercase mb-1">Semana {weekIndex + 1}</span>
                    <span className={`text-sm md:text-base font-bold font-mono ${weeklyPnL >= 0 ? "text-profit" : "text-loss"}`}>
                        {weeklyPnL >= 0 ? "+" : "-"}${Math.abs(weeklyPnL).toFixed(0)}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                        {activeDays} días op.
                    </span>
                </div>
              </div>
            );
          })}
        </div>

      </motion.div>
    </div>
  );
};

export default TradingCalendar;