import React from 'react';
import { Card, Button } from '../components/UI';
import { ShoppingCart, UserPlus, PackagePlus, ArrowUpRight, BellRing, CheckCircle2 } from 'lucide-react';
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
        
        <Card className="bg-slate-800 dark:bg-slate-900 text-white border-none flex flex-col gap-2 shadow-xl shadow-slate-200 dark:shadow-none">
          <div className="p-2 bg-white/10 rounded-xl w-fit text-emerald-400">
            <ArrowUpRight size={20} />
          </div>
          <span className="text-xs font-medium text-white/80">A Receber</span>
          <span className="text-lg font-bold">{formatCurrency(stats.totalReceivable)}</span>
        </Card>
      </div>

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