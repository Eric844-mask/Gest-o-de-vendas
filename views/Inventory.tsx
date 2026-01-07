
import React, { useState } from 'react';
import { Card, Input, Button, Badge, Select } from '../components/UI';
import { Search, PackagePlus, AlertCircle, X, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/format';

interface InventoryProps {
  products: Product[];
  addProduct: (p: any) => void;
}

const CATEGORIES = ['Fragrâncias', 'Maquiagem', 'Cuidados com a Pele', 'Cabelo', 'Corpo e Banho'];

const Inventory: React.FC<InventoryProps> = ({ products, addProduct }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    price: '',
    stock: '',
    minStock: '2'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) return;
    addProduct({
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      minStock: parseInt(form.minStock)
    });
    setForm({ name: '', category: CATEGORIES[0], price: '', stock: '', minStock: '2' });
    setIsAdding(false);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            placeholder="Buscar produto..."
            className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-slate-800 text-white p-3 rounded-2xl shadow-sm active:scale-95 transition-all"
        >
          <PackagePlus size={20} />
        </button>
      </div>

      {isAdding && (
        <Card className="flex flex-col gap-4 relative">
          <button onClick={() => setIsAdding(false)} className="absolute right-4 top-4 text-gray-400"><X size={20} /></button>
          <h3 className="font-bold text-lg">Novo Produto</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Nome do Produto" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ex: Perfume Malbec 100ml" />
            <Select label="Categoria" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Preço (R$)" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0,00" />
              <Input label="Estoque Inicial" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="0" />
            </div>
            <Input label="Mínimo para Alerta" type="number" value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})} />
            <Button type="submit" fullWidth>Adicionar ao Estoque</Button>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 italic">Nenhum produto em estoque.</div>
        ) : (
          filtered.map(product => (
            <Card key={product.id} className="flex flex-col gap-2 p-4 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">{product.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{product.category}</p>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-rose-500">{formatCurrency(product.price)}</span>
                  <span className={`text-xs font-bold ${product.stock <= product.minStock ? 'text-amber-500' : 'text-gray-400'}`}>
                    Qtd: {product.stock}
                  </span>
                </div>
              </div>
              
              {product.stock <= product.minStock && (
                <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg w-fit">
                  <AlertCircle size={10} />
                  ESTOQUE BAIXO
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;
