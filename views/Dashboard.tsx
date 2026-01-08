
import React from 'react';
import { Card, Button } from '../components/UI';
import { ShoppingCart, UserPlus, PackagePlus, ArrowUpRight, Target } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { View } from '../types';

interface DashboardProps {
  stats: any;
  setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, setView }) => {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">Bom dia, Consultora</p>
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
        <h3 className="text-sm font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest px-1">Metas e Lembretes</h3>
        <Card className="flex items-center gap-4 py-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-2xl">
            <Target size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm dark:text-slate-200">Meta Bronze</h4>
            <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-indigo-500 h-full w-[65%]"></div>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">65% concluído • Faltam R$ 450,00</p>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;