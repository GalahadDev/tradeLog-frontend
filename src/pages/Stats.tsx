import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { dashboardService } from "@/lib/api";
import { TradingStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, TrendingDown, BarChart3, Target, Zap, DollarSign, Activity, Percent, ArrowUpRight, ArrowDownRight, Flame, Shield, AlertTriangle } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { toast } from "sonner";

// --- 1. TOOLTIP PERSONALIZADO  ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-1">{label || payload[0].name}</p>
        <p className="text-sm text-muted-foreground font-mono">
          {payload[0].name.includes('Rate') || payload[0].name.includes('%')
            ? `${payload[0].value}%` 
            : payload[0].value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>
      </div>
    );
  }
  return null;
};

// --- 2. TARJETAS CON HOVER DINÁMICO ---

const StatCard = ({ icon: Icon, label, value, color, delay, prefix = "", suffix = "", hoverColor = "hover:border-primary/30" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Card className={`bg-card/40 border-border/50 backdrop-blur-sm ${hoverColor} transition-all duration-300 group overflow-hidden h-full`}>
      <CardContent className="p-4 relative">
        <div className="relative flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color} border border-white/5`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="text-lg font-bold font-mono text-foreground truncate">
              {prefix}{value}{suffix}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const LargeStatCard = ({ icon: Icon, label, value, color, textColor, delay, prefix = "", suffix = "", hoverColor = "hover:border-primary/30" }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Card className={`bg-card/40 border-border/50 backdrop-blur-sm ${hoverColor} transition-all duration-300 h-full`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Icon className={`w-4 h-4 ${textColor}`} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold font-mono ${textColor}`}>
          {prefix}{value}{suffix}
        </p>
        <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${color} opacity-60`} />
      </CardContent>
    </Card>
  </motion.div>
);

// --- PÁGINA PRINCIPAL ---

const Stats = () => {
  const [stats, setStats] = useState<TradingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await dashboardService.getStats();
        setStats(data.stats);
      } catch (error) {
        toast.error("Error cargando estadísticas");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) return null;

  // Datos para Gráficos
  const winLossData = [
    { name: "Ganadas", value: parseFloat(stats.win_rate), fill: "hsl(var(--profit))" },
    { name: "Perdidas", value: parseFloat(stats.loss_rate), fill: "hsl(var(--loss))" }
  ];

  const profitLossData = [
    { name: "Bruto", value: parseFloat(stats.gross_profit), fill: "hsl(var(--profit))" },
    { name: "Pérdida", value: Math.abs(parseFloat(stats.gross_loss)), fill: "hsl(var(--loss))" },
    { name: "Neto", value: parseFloat(stats.total_net_profit), fill: "hsl(var(--gold))" }
  ];

  const directionData = [
    { name: "Long", winRate: parseFloat(stats.long_win_rate) },
    { name: "Short", winRate: parseFloat(stats.short_win_rate) }
  ];

  // Helper para asignar color de hover dinámico
  const getProfitHover = (val: string) => Number(val) >= 0 ? "hover:border-profit/50" : "hover:border-loss/50";
  const getPfHover = (val: string) => Number(val) >= 1 ? "hover:border-gold/50" : "hover:border-loss/50";

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-gold/20 to-profit/20 border border-gold/30">
              <BarChart3 className="w-6 h-6 text-gold" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display">
                Estadísticas Avanzadas
              </h1>
              <p className="text-sm text-muted-foreground">
                Análisis detallado de tu rendimiento
              </p>
            </div>
          </div>
        </motion.div>

        {/* 1. KPIs Principales  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <LargeStatCard
            icon={DollarSign}
            label="Beneficio Neto Total"
            value={Number(stats.total_net_profit).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            color="from-profit to-profit/50"
            textColor={Number(stats.total_net_profit) >= 0 ? "text-profit" : "text-loss"}
            hoverColor={getProfitHover(stats.total_net_profit)} 
            delay={0.1}
          />
          <LargeStatCard
            icon={Target}
            label="Factor de Beneficio"
            value={Number(stats.profit_factor).toFixed(2)}
            color="from-gold to-gold/50"
            textColor="text-gold"
            hoverColor={getPfHover(stats.profit_factor)}
            delay={0.2}
          />
          <LargeStatCard
            icon={Percent}
            label="Win Rate Total"
            value={Number(stats.win_rate).toFixed(2)}
            color="from-chart-line to-chart-line/50"
            textColor="text-chart-line"
            hoverColor="hover:border-chart-line/50"
            delay={0.3}
            suffix="%"
          />
        </div>

        {/* 2. Gráficos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          {/* Win Rate Pie Chart */}
          <Card className="bg-card/40 border-border/50 backdrop-blur-sm hover:border-chart-line/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-chart-line" />
                Efectividad (Win Rate)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={winLossData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {winLossData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-profit" />
                  <span className="text-xs text-muted-foreground">Ganadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-loss" />
                  <span className="text-xs text-muted-foreground">Perdidas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profit vs Loss Bar Chart */}
          <Card className="bg-card/40 border-border/50 backdrop-blur-sm hover:border-gold/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gold" />
                Desglose Financiero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitLossData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} /> 
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {profitLossData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-3 mt-2 flex-wrap">
                 <span className="text-xs text-muted-foreground flex items-center gap-1"><div className="w-2 h-2 bg-profit rounded-full"></div> Bruto</span>
                 <span className="text-xs text-muted-foreground flex items-center gap-1"><div className="w-2 h-2 bg-loss rounded-full"></div> Pérdida</span>
                 <span className="text-xs text-muted-foreground flex items-center gap-1"><div className="w-2 h-2 bg-gold rounded-full"></div> Neto</span>
              </div>
            </CardContent>
          </Card>

          {/* Direction Win Rate */}
          <Card className="bg-card/40 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Win Rate por Dirección
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={directionData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="winRate" radius={[4, 4, 0, 0]} fill="hsl(var(--chart-line))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around mt-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Long</p>
                  <p className={`text-sm font-bold ${Number(stats.long_win_rate) > 50 ? 'text-profit' : 'text-muted-foreground'}`}>{Number(stats.long_win_rate).toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Short</p>
                  <p className={`text-sm font-bold ${Number(stats.short_win_rate) > 50 ? 'text-profit' : 'text-muted-foreground'}`}>{Number(stats.short_win_rate).toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Tarjetas de Detalle (Grid de 4x) */}
        
        {/* Sección: PnL Detallado */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Detalles Financieros
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={TrendingUp} label="Beneficio Bruto" value={stats.gross_profit} color="from-profit/80 to-profit/40" hoverColor="hover:border-profit/50" delay={0.5} prefix="$" />
            <StatCard icon={TrendingDown} label="Pérdida Bruta" value={stats.gross_loss} color="from-loss/80 to-loss/40" hoverColor="hover:border-loss/50" delay={0.55} prefix="$" />
            <StatCard icon={ArrowUpRight} label="Mejor Trade" value={stats.largest_win} color="from-profit/80 to-profit/40" hoverColor="hover:border-profit/50" delay={0.6} prefix="$" />
            <StatCard icon={ArrowDownRight} label="Peor Trade" value={stats.largest_loss} color="from-loss/80 to-loss/40" hoverColor="hover:border-loss/50" delay={0.65} prefix="$" />
          </div>
        </motion.div>

        {/* Sección: Rendimiento & Riesgo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-gold" /> Riesgo y Eficiencia
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Shield} label="Recovery Factor" value={Number(stats.recovery_factor).toFixed(2)} color="from-chart-line/80 to-chart-line/40" hoverColor="hover:border-chart-line/50" delay={0.75} />
            <StatCard icon={Activity} label="Sharpe Ratio" value={Number(stats.sharpe_ratio).toFixed(2)} color="from-primary/80 to-primary/40" hoverColor="hover:border-primary/50" delay={0.8} />
            <StatCard icon={DollarSign} label="Expectancy" value={stats.expected_payoff} color="from-gold/80 to-gold/40" hoverColor="hover:border-gold/50" delay={0.85} prefix="$" />
            <StatCard icon={AlertTriangle} label="Max Drawdown" value={stats.max_drawdown} color="from-loss/80 to-loss/40" hoverColor="hover:border-loss/50" delay={0.9} prefix="$" />
          </div>
        </motion.div>

        {/* Sección: Promedios y Rachas */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Flame className="w-5 h-5 text-loss" /> Rachas y Promedios
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={TrendingUp} label="Avg Win" value={stats.avg_win} color="from-profit/80 to-profit/40" hoverColor="hover:border-profit/50" delay={1.1} prefix="$" />
            <StatCard icon={TrendingDown} label="Avg Loss" value={stats.avg_loss} color="from-loss/80 to-loss/40" hoverColor="hover:border-loss/50" delay={1.15} prefix="$" />
            <StatCard icon={Flame} label="Racha Ganadora" value={`${stats.max_consecutive_wins} (${Number(stats.max_consecutive_profit_usd).toLocaleString('en-US', {style:'currency', currency:'USD'})})`} color="from-gold/80 to-gold/40" hoverColor="hover:border-gold/50" delay={1.2} />
            <StatCard icon={AlertTriangle} label="Racha Perdedora" value={`${stats.max_consecutive_losses} (${Number(stats.max_consecutive_loss_usd).toLocaleString('en-US', {style:'currency', currency:'USD'})})`} color="from-loss/80 to-loss/40" hoverColor="hover:border-loss/50" delay={1.25} />
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
};

export default Stats;