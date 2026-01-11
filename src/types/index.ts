export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  is_active: boolean;
  is_verified: boolean;
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  bio?: string;
  trading_experience?: 'Beginner' | 'Intermediate' | 'Pro' | string;

  created_at: string;
}

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  direction: 'long' | 'short';
  status: 'open' | 'closed' | 'pending';
  entry_price: number;
  exit_price: number;
  size: number;
  pnl: number;
  commission: number;
  entry_date: string;
  exit_date?: string;
  notes?: string;
  screenshot_url?: string;
  tags?: string[];
  created_at: string;
}

// Métricas para el Calendario
export interface CalendarMetric {
  date: string;       // YYYY-MM-DD
  total_pnl: number;
  trade_count: number;
}

export interface TradingStats {
  // Rendimiento
  total_net_profit: string;
  total_commissions: string;
  gross_profit: string;
  gross_loss: string;
  profit_factor: string;
  recovery_factor: string;
  sharpe_ratio: string;
  expected_payoff: string;

  // Actividad
  total_trades: number;
  avg_trade_size: string;

  // Riesgo
  max_drawdown: string;

  // Efectividad
  win_rate: string;
  loss_rate: string;
  long_win_rate: string;
  short_win_rate: string;

  // Promedios
  avg_win: string;
  avg_loss: string;
  largest_win: string;
  largest_loss: string;

  // Rachas
  max_consecutive_wins: number;
  max_consecutive_profit_usd: string;
  max_consecutive_losses: number;
  max_consecutive_loss_usd: string;
}