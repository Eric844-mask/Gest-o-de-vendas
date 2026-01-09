
import React from 'react';
import { Card, Button, Badge } from '../components/UI';
import { ShoppingCart, UserPlus, PackagePlus, ArrowUpRight, BellRing, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { View } from '../types';

interface Reminder {
  customerName: string;
  amount: number;
  id: string;
}

interface DashboardProps {
  stats: any;
  setView: (view: View) => void;
  userName: string;
  reminders: Reminder[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, setView, userName, reminders }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) return 'Boa madrugada';
    if (hour >= 6 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const displayName = userName.trim() ? userName.split(' ')[0] : 'Consultora';

  const lastMonthLabel = stats.furthestInstallment 
    ? new Date(stats.furthestInstallment).toLocaleString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '')
    : null;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
          {getGreeting()}, {displayName}
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Resumo de Hoje</h2>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-rose-500 text-white border-none flex flex-col gap-2">
          <div className="p-2 bg-white/20 rounded-xl w-fit">
            <ShoppingCart size={20} />
          </div>
          <span className="text-xs font-medium text-white/80">Vendas do Mês</span>
          <span className="text-lg font-bold">{formatCurrency(stats.salesMonth)}</span>
        </Card>
        
        <Card className="bg-slate-800 dark:bg-slate-900 text-white border-none flex flex-col gap-2 shadow-xl shadow-slate-200 dark:shadow-none relative overflow-hidden group">
          <div className="p-2 bg-white/10 rounded-xl w-fit text-emerald-400">
            <ArrowUpRight size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white/80">A Receber Total</span>
            <span className="text-lg font-bold">{formatCurrency(stats.totalReceivable)}</span>
          </div>
          {lastMonthLabel && (
            <div className="absolute top-2 right-2">
              <Badge color="emerald">até {lastMonthLabel}</Badge>
            </div>
          )}
        </Card>
      </div>

      {/* Seção de Projeção Financeira - NOVO */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">Fluxo de Recebíveis</h3>
          {lastMonthLabel && (
            <span className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md border border-rose-100 dark:border-rose-800/50">
              ATÉ {lastMonthLabel.toUpperCase()}
            </span>
          )}
        </div>
        
        <Card className="flex flex-col gap-5 p-5 border-2 border-slate-50 dark:border-slate-800/50 shadow-lg shadow-slate-200/20 dark:shadow-none">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Calendar size={10} className="text-rose-400" /> Este Mês
              </span>
              <span className="text-base font-black text-slate-800 dark:text-slate-100">{formatCurrency(stats.receivableThisMonth)}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider justify-end flex items-center gap-1">
                <TrendingUp size={10} className="text-emerald-400" /> Próximos Meses
              </span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.receivableFuture)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest">Agenda Mensal</span>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-mask pb-1">
              {stats.receivablesByMonth.length === 0 ? (
                <p className="text-[11px] text-slate-300 dark:text-slate-700 italic py-2">Nenhuma projeção futura...</p>
              ) : (
                <div className="flex gap-2.5">
                  {stats.receivablesByMonth.map((m: any) => (
                    <div 
                      key={m.key} 
                      className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all shrink-0 min-w-[75px] ${
                        m.isCurrent 
                          ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200 dark:shadow-none' 
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase ${m.isCurrent ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}>{m.label}</span>
                      <span className={`text-xs font-black ${m.isCurrent ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                        {formatCurrency(m.total).replace('R$', '').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col gap-1 items-center justify-center py-6 text-center">
          <span className="text-2xl font-black text-gray-800 dark:text-slate-100">{stats.activeCustomers}</span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">Clientes Ativos</span>
        </Card>
        <Card className={`flex flex-col gap-1 items-center justify-center py-6 text-center ${stats.lowStockItems > 0 ? 'border-amber-200 dark:border-amber-900/50' : ''}`}>
          <span className={`text-2xl font-black ${stats.lowStockItems > 0 ? 'text-amber-500' : 'text-gray-800 dark:text-slate-100'}`}>
            {stats.lowStockItems}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">Estoque Baixo</span>
        </Card>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest px-1">Ações Rápidas</h3>
        <div className="flex flex-col gap-2">
          <Button fullWidth onClick={() => setView('new-sale')}>
            <ShoppingCart size={20} /> Nova Venda
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" fullWidth onClick={() => setView('add-customer')}>
              <UserPlus size={18} /> Clientes
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setView('add-product')}>
              <PackagePlus size={18} /> Estoque
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest px-1">Lembretes</h3>
        {reminders.length > 0 ? (
          <Card 
            className="flex items-center gap-4 py-4 border-l-4 border-l-indigo-500 active:scale-[0.98] transition-transform cursor-pointer"
            onClick={() => setView('debtors')}
          >
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-2xl">
              <BellRing size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="font-bold text-sm dark:text-slate-200 truncate">Vencendo Hoje</h4>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                {reminders.length === 1 
                  ? `${reminders[0].customerName} deve ${formatCurrency(reminders[0].amount)}`
                  : `${reminders.length} clientes possuem parcelas para hoje`
                }
              </p>
            </div>
            <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
              HOJE
            </div>
          </Card>
        ) : (
          <Card className="flex items-center gap-4 py-4 border-dashed border-2 border-gray-100 dark:border-slate-800 opacity-60">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm dark:text-slate-400 text-gray-400">Tudo em dia!</h4>
              <p className="text-[10px] text-gray-300 dark:text-slate-600 mt-0.5">Nenhum pagamento pendente para hoje.</p>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
