
import React, { useState } from 'react';
import { Card, Input, Button, Badge } from '../components/UI';
import { Search, UserPlus, Phone, ChevronRight, X } from 'lucide-react';
import { formatPhone } from '../utils/format';
import { Customer } from '../types';

interface CustomersProps {
  customers: Customer[];
  addCustomer: (c: any) => void;
  getStatus: (id: string) => string;
}

const Customers: React.FC<CustomersProps> = ({ customers, addCustomer, getStatus }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    addCustomer({ name: newName, phone: newPhone });
    setNewName('');
    setNewPhone('');
    setIsAdding(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'devedor': return 'rose';
      case 'pendente': return 'amber';
      case 'em dia': return 'emerald';
      default: return 'gray';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            placeholder="Buscar cliente..."
            className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-rose-500 text-white p-3 rounded-2xl shadow-sm active:scale-95 transition-all"
        >
          <UserPlus size={20} />
        </button>
      </div>

      {isAdding && (
        <Card className="flex flex-col gap-4 relative">
          <button onClick={() => setIsAdding(false)} className="absolute right-4 top-4 text-gray-400"><X size={20} /></button>
          <h3 className="font-bold text-lg">Novo Cliente</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Nome Completo" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: Maria Silva" />
            <Input label="WhatsApp" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="DD 99999-9999" type="tel" />
            <Button type="submit">Cadastrar Cliente</Button>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 italic">Nenhum cliente encontrado.</div>
        ) : (
          filtered.map(customer => {
            const status = getStatus(customer.id);
            return (
              <Card key={customer.id} className="flex items-center gap-4 py-4 active:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center font-bold text-lg">
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-gray-800 truncate">{customer.name}</h4>
                    <Badge color={getStatusColor(status)}>{status}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                    <Phone size={12} />
                    <span>{formatPhone(customer.phone)}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Customers;
