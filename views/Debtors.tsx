
import React from 'react';
import { Card, Badge, Button } from '../components/UI';
import { AlertTriangle, Calendar, Phone, CheckCircle } from 'lucide-react';
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
    <div className="flex flex-col gap-4">
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={24} />
          Contas a Receber
        </h2>
        <p className="text-xs text-gray-400 font-medium">Lista de todas as parcelas pendentes organizadas por data.</p>
      </section>

      {pending.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle size={32} />
          </div>
          <p className="text-gray-400">Parabéns! Nenhuma pendência encontrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pending.map(ins => {
            const sale = sales.find(s => s.id === ins.saleId);
            const customer = customers.find(c => c.id === sale?.customerId);
            const status = getOverdueStatus(ins.dueDate);
            
            return (
              <Card key={ins.id} className={`border-l-4 ${status === 'vencida' ? 'border-l-rose-500' : 'border-l-amber-500'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-800">{customer?.name || 'Cliente Desconhecido'}</h4>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Phone size={10} /> {formatPhone(customer?.phone || '')}
                    </p>
                  </div>
                  <Badge color={status === 'vencida' ? 'rose' : 'amber'}>
                    {status === 'vencida' ? 'Vencida' : 'Pendente'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-gray-50 my-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">{formatDate(ins.dueDate)}</span>
                  </div>
                  <span className="text-lg font-black text-rose-500">{formatCurrency(ins.amount)}</span>
                </div>

                <div className="flex items-center justify-between gap-3 mt-3">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Parcela {ins.number} de {sale?.installments}
                  </div>
                  <button 
                    onClick={() => markPaid(ins.id)}
                    className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl font-bold text-xs active:scale-95"
                  >
                    <CheckCircle size={14} /> Baixar Parcela
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
