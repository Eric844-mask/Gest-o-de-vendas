
import React from 'react';
import { Card, Badge } from '../components/UI';
import { AlertTriangle, Calendar, Phone, CheckCircle2, User, ArrowRight } from 'lucide-react';
import { Installment, Customer, Sale, Product } from '../types';
import { formatCurrency, formatDate, formatPhone } from '../utils/format';

interface DebtorsProps {
  installments: Installment[];
  customers: Customer[];
  sales: Sale[];
  products: Product[];
  markPaid: (id: string) => void;
}

const Debtors: React.FC<DebtorsProps> = ({ installments, customers, sales, products, markPaid }) => {
  const pending = installments
    .filter(ins => !ins.paidAt)
    .sort((a, b) => a.dueDate - b.dueDate);

  const getOverdueStatus = (dueDate: number) => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (dueDate < today) return 'vencida';
    return 'pendente';
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="px-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
            <AlertTriangle size={20} />
          </div>
          <h2 className="text-xl font-bold dark:text-slate-100">Contas a Receber</h2>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">
          Acompanhe e gerencie os pagamentos pendentes dos seus clientes.
        </p>
      </section>

      {pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 rounded-full scale-150 opacity-50"></div>
            <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/10 rounded-full scale-[2] opacity-30"></div>
            <div className="relative w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-none">
              <CheckCircle2 size={40} />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-1">Tudo em dia!</h3>
          <p className="text-sm text-gray-500 dark:text-slate-500 max-w-[200px]">
            Parabéns! Nenhuma pendência encontrada para o seu negócio no momento.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">
              {pending.length} {pending.length === 1 ? 'pendência' : 'pendências'}
            </span>
          </div>
          
          {pending.map(ins => {
            const sale = sales.find(s => s.id === ins.saleId);
            const customer = customers.find(c => c.id === sale?.customerId);
            const status = getOverdueStatus(ins.dueDate);
            
            return (
              <Card 
                key={ins.id} 
                className={`group flex flex-col gap-4 p-5 transition-all active:scale-[0.98] border-l-4 ${
                  status === 'vencida' ? 'border-l-rose-500 dark:border-l-rose-600' : 'border-l-amber-500 dark:border-l-amber-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-xl flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-slate-100 leading-tight">
                        {customer?.name || 'Cliente'}
                      </h4>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {formatPhone(customer?.phone || '')}
                      </p>
                    </div>
                  </div>
                  <Badge color={status === 'vencida' ? 'rose' : 'amber'}>
                    {status === 'vencida' ? 'Vencida' : 'Pendente'}
                  </Badge>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={10} /> Vencimento
                    </span>
                    <span className="text-sm font-bold text-gray-700 dark:text-slate-300">
                      {formatDate(ins.dueDate)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 dark:text-slate-500 block mb-0.5">Valor da Parcela</span>
                    <span className={`text-xl font-black ${status === 'vencida' ? 'text-rose-500 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'}`}>
                      {formatCurrency(ins.amount)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-300 dark:text-slate-700 uppercase tracking-widest">
                    Parcela {ins.number}/{sale?.installments}
                  </span>
                  <button 
                    onClick={() => markPaid(ins.id)}
                    className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl font-bold text-xs active:scale-95 transition-all hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                  >
                    Confirmar Recebimento <ArrowRight size={14} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Debtors;
