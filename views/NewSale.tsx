
import React, { useState, useMemo } from 'react';
import { Card, Input, Button, Select, Badge } from '../components/UI';
import { ShoppingCart, User, Plus, Minus, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { Customer, Product, SaleItem, View } from '../types';

interface NewSaleProps {
  customers: Customer[];
  products: Product[];
  createSale: (sale: any) => void;
  setView: (view: View) => void;
}

const NewSale: React.FC<NewSaleProps> = ({ customers, products, createSale, setView }) => {
  const [step, setStep] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cash' | 'credit_card' | 'debit_card'>('pix');
  const [installments, setInstallments] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const total = useMemo(() => cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0), [cartItems]);

  const addToCart = (product: Product) => {
    const existing = cartItems.find(i => i.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCartItems(cartItems.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      if (product.stock <= 0) return;
      setCartItems([...cartItems, { productId: product.id, quantity: 1, unitPrice: product.price }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const newQty = item.quantity + delta;
        if (newQty < 1 || (product && newQty > product.stock)) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.productId !== productId));
  };

  const handleFinish = () => {
    createSale({
      customerId: selectedCustomerId,
      items: cartItems,
      total,
      paymentMethod,
      installments
    });
    setShowSuccess(true);
    setTimeout(() => {
      setView('dashboard');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center gap-4">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold">Venda Realizada!</h2>
        <p className="text-gray-500">O estoque foi atualizado e as parcelas geradas.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Steps Header */}
      <div className="flex justify-between items-center px-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              {s}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Customer Selection */}
      {step === 1 && (
        <section className="flex flex-col gap-4 animate-fade-in">
          <h3 className="text-xl font-bold">Para quem é a venda?</h3>
          <Select 
            label="Selecione o Cliente" 
            value={selectedCustomerId} 
            onChange={e => setSelectedCustomerId(e.target.value)}
          >
            <option value="">Escolha um cliente...</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Button 
            fullWidth 
            disabled={!selectedCustomerId} 
            onClick={() => setStep(2)}
          >
            Continuar para Produtos
          </Button>
        </section>
      )}

      {/* Step 2: Product Selection */}
      {step === 2 && (
        <section className="flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Adicionar Produtos</h3>
            <span className="text-rose-500 font-bold">{formatCurrency(total)}</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1">
            {products.map(p => {
              const inCart = cartItems.find(i => i.productId === p.id);
              return (
                <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400">{formatCurrency(p.price)} • {p.stock} em estoque</p>
                  </div>
                  <button 
                    disabled={p.stock <= 0}
                    onClick={() => addToCart(p)}
                    className="p-2 bg-rose-50 text-rose-500 rounded-xl active:scale-90 disabled:opacity-30"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Sacola ({cartItems.length})</h4>
            {cartItems.map(item => {
              const p = products.find(prod => prod.id === item.productId);
              return (
                <div key={item.productId} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
                  <div className="flex-1">
                    <p className="text-sm font-bold">{p?.name}</p>
                    <p className="text-xs text-rose-500 font-bold">{formatCurrency(item.unitPrice * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 text-gray-400"><Minus size={16} /></button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 text-gray-400"><Plus size={16} /></button>
                    <button onClick={() => removeFromCart(item.productId)} className="ml-2 text-rose-300"><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setStep(1)}><ArrowLeft size={18} /></Button>
            <Button fullWidth disabled={cartItems.length === 0} onClick={() => setStep(3)}>
              Revisar Pagamento
            </Button>
          </div>
        </section>
      )}

      {/* Step 3: Payment & Installments */}
      {step === 3 && (
        <section className="flex flex-col gap-4 animate-fade-in">
          <h3 className="text-xl font-bold">Pagamento</h3>
          
          <Card className="flex flex-col gap-4">
            <Select label="Forma de Pagamento" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)}>
              <option value="pix">PIX</option>
              <option value="cash">Dinheiro</option>
              <option value="credit_card">Cartão de Crédito</option>
              <option value="debit_card">Cartão de Débito</option>
            </Select>

            <Select label="Parcelamento" value={installments} onChange={e => setInstallments(parseInt(e.target.value))}>
              <option value="1">À vista</option>
              <option value="2">2x de {formatCurrency(total / 2)}</option>
              <option value="3">3x de {formatCurrency(total / 3)}</option>
              <option value="4">4x de {formatCurrency(total / 4)}</option>
              <option value="5">5x de {formatCurrency(total / 5)}</option>
              <option value="6">6x de {formatCurrency(total / 6)}</option>
            </Select>
          </Card>

          <Card className="bg-gray-50 border-none">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Total da Venda</span>
              <span className="text-lg font-black text-gray-900">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Parcela Mensal</span>
              <span className="text-sm font-bold text-rose-500">{formatCurrency(total / installments)}</span>
            </div>
          </Card>

          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setStep(2)}><ArrowLeft size={18} /></Button>
            <Button fullWidth variant="primary" onClick={handleFinish}>
              Finalizar Venda
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewSale;
