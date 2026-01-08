
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Input, Button, Badge, Select } from '../components/UI';
import { Search, PackagePlus, AlertCircle, X } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/format';

interface InventoryProps {
  products: Product[];
  addProduct: (p: any) => void;
  initialIsAdding?: boolean;
}

const CATEGORIES = ['Fragrâncias', 'Maquiagem', 'Cuidados com a Pele', 'Cabelo', 'Corpo e Banho'];

const Inventory: React.FC<InventoryProps> = ({ products, addProduct, initialIsAdding = false }) => {
  const [isAdding, setIsAdding] = useState(initialIsAdding);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  
  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    price: '',
    stock: '',
    minStock: '2'
  });

  // Sincroniza o estado caso a prop mude via navegação
  useEffect(() => {
    if (initialIsAdding) setIsAdding(true);
  }, [initialIsAdding]);

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

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'Todos' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  const FilterChip = ({ label }: { label: string; key?: string }) => (
    <button
      onClick={() => setFilterCategory(label)}
      className={`px-4 py-2.5 rounded-2xl text-[11px] font-bold transition-all whitespace-nowrap border ${
        filterCategory === label 
          ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200 dark:shadow-none translate-y-[-1px]' 
          : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Busca e Botão Adicionar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
          <input
            placeholder="Buscar produto..."
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-100 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-rose-500 text-white p-3 rounded-2xl shadow-sm active:scale-95 transition-all"
        >
          <PackagePlus size={20} />
        </button>
      </div>

      {/* Container de Categorias com Rolagem Personalizada */}
      <div className="relative group">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 beauty-scroll scroll-mask px-1">
          <div className="flex gap-2.5">
            <FilterChip label="Todos" />
            {CATEGORIES.map(cat => (
              <FilterChip key={cat} label={cat} />
            ))}
          </div>
        </div>
      </div>

      {isAdding && (
        <Card className="flex flex-col gap-4 relative border-2 border-rose-100 dark:border-rose-900/50 shadow-xl animate-fade-in ring-4 ring-rose-50/50 dark:ring-rose-950/20">
          <button 
            onClick={() => setIsAdding(false)} 
            className="absolute right-4 top-4 text-gray-300 dark:text-slate-600 hover:text-gray-500 p-1 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight">Novo Produto</h3>
            <div className="h-1 w-12 bg-rose-200 dark:bg-rose-800 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
            <Input 
              label="Nome do Produto" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              placeholder="Ex: Perfume Malbec 100ml" 
              autoFocus 
            />
            
            <Select 
              label="Categoria" 
              value={form.category} 
              onChange={e => setForm({...form, category: e.target.value})}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <Input 
                label="Preço (R$)" 
                type="number" 
                step="0.01" 
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} 
                placeholder="0,00" 
              />
              <Input 
                label="Estoque Inicial" 
                type="number" 
                value={form.stock} 
                onChange={e => setForm({...form, stock: e.target.value})} 
                placeholder="0" 
              />
            </div>

            <Input 
              label="Mínimo para Alerta" 
              type="number" 
              value={form.minStock} 
              onChange={e => setForm({...form, minStock: e.target.value})} 
            />
            
            <Button type="submit" fullWidth className="py-4 text-lg">Adicionar ao Estoque</Button>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-slate-600 italic">
            {searchTerm || filterCategory !== 'Todos' ? 'Nenhum produto corresponde aos filtros.' : 'Nenhum produto em estoque.'}
          </div>
        ) : (
          filtered.map(product => (
            <Card key={product.id} className="flex flex-col gap-2 p-4 relative active:bg-gray-50 dark:active:bg-slate-800/50 transition-colors bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-slate-800">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2 overflow-hidden">
                  <h4 className="font-bold text-gray-800 dark:text-slate-100 truncate">{product.name}</h4>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">{product.category}</p>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-rose-500 dark:text-rose-400 text-base">{formatCurrency(product.price)}</span>
                  <span className={`text-xs font-bold ${product.stock <= product.minStock ? 'text-amber-500' : 'text-gray-400 dark:text-slate-500'}`}>
                    Qtd: {product.stock}
                  </span>
                </div>
              </div>
              
              {product.stock <= product.minStock && (
                <div className="mt-1 flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md w-fit border border-amber-100/50 dark:border-amber-800/50">
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
