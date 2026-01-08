
import React, { useState, useMemo } from 'react';
import { Card, Input, Button, Badge } from '../components/UI';
import { ShoppingCart, User, Plus, Minus, Trash2, ArrowLeft, CheckCircle2, Search, X, ChevronRight } from 'lucide-react';
import { formatCurrency, formatPhone } from '../utils/format';
import { Customer, Product, SaleItem, View } from '../types';
import { useStore } from '../store/useStore';

interface NewSaleProps {
  customers: Customer[];
  products: Product[];
  createSale: (sale: any) => void;
  setView: (view: View) => void;
}

const NewSale: React.FC<NewSaleProps> = ({ customers, products, createSale, setView }) => {
  const { getCustomerStatus } = useStore();
  const [step, setStep] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cash' | 'credit_card' | 'debit_card'>('pix');
  const [installments, setInstallments] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const total = useMemo(() => cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0), [cartItems]);

  const selectedCustomer = useMemo(() => 
    customers.find(c => c.id === selectedCustomerId), 
  [customers, selectedCustomerId]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [customers, customerSearch]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'devedor': return 'rose';
      case 'pendente': return 'amber';
      case 'em dia': return 'emerald';
      default: return 'gray';
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center gap-4">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold dark:text-slate-100">Venda Realizada!</h2>
        <p className="text-gray-500 dark:text-slate-400">O estoque foi atualizado e as parcelas geradas.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Steps Header */}
      <div className="flex justify-between items-center px-6 relative">
        <div className="absolute top-4 left-10 right-10 h-0.5 bg-gray-100 dark:bg-slate-800 -z-0"></div>
        {[1, 2, 3].map(s => (
          <div key={s} className="flex flex-col items-center gap-1 z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
              step === s ? 'bg-rose-500 text-white ring-4 ring-rose-100 dark:ring-rose-900/30 scale-110' : 
              step > s ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400'
            }`}>
              {step > s ? <CheckCircle2 size={16} /> : s}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Customer Selection */}
      {step === 1 && (
        <section className="flex flex-col gap-5 animate-fade-in">
          <div className="flex flex-col gap-1 px-1">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Para quem é a venda?</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wider">Identifique sua cliente para começar</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 px-1">Selecione a Cliente</label>
            <button 
              onClick={() => setIsSelectorOpen(true)}
              className="w-full bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-2xl px-5 py-4 flex items-center justify-between text-left active:scale-[0.98] transition-all hover:border-rose-100 dark:hover:border-rose-900/30 group"
            >
              {selectedCustomer ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-xl flex items-center justify-center font-bold">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedCustomer.name}</p>
                    <Badge color={getStatusColor(getCustomerStatus(selectedCustomer.id))}>
                      {getCustomerStatus(selectedCustomer.id)}
                    </Badge>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 dark:text-slate-600 font-medium">Escolha um cliente...</span>
              )}
              <ChevronRight className="text-gray-300 group-hover:text-rose-400 transition-colors" />
            </button>
          </div>

          {/* Modal / Overlay Seletor de Cliente - Ajustado para cobrir toda a altura disponível até o fundo */}
          {isSelectorOpen && (
            <div className="fixed inset-0 z-[100] flex flex-col">
              <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in"
                onClick={() => setIsSelectorOpen(false)}
              ></div>
              <div className="relative mt-auto bg-white dark:bg-[#0f172a] rounded-t-[32px] h-full max-h-[100dvh] flex flex-col shadow-2xl animate-fade-in border-t border-rose-100 dark:border-rose-900/30 overflow-hidden">
                <div className="p-6 flex flex-col gap-4 bg-white dark:bg-[#0f172a] sticky top-0 z-10">
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full mx-auto mb-2 opacity-50"></div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-bold dark:text-slate-100">Selecionar Cliente</h4>
                    <button onClick={() => setIsSelectorOpen(false)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      placeholder="Buscar por nome ou celular..." 
                      className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      value={customerSearch}
                      onChange={e => setCustomerSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-32 beauty-scroll">
                  <div className="flex flex-col gap-2">
                    {filteredCustomers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-400 italic gap-2">
                        <User size={32} strokeWidth={1} />
                        <p>Nenhum cliente encontrado.</p>
                      </div>
                    ) : (
                      filteredCustomers.map(c => {
                        const status = getCustomerStatus(c.id);
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              setSelectedCustomerId(c.id);
                              setIsSelectorOpen(false);
                            }}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                              selectedCustomerId === c.id 
                                ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 shadow-sm' 
                                : 'bg-white dark:bg-slate-900/40 border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                              selectedCustomerId === c.id ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'
                            }`}>
                              {c.name.charAt(0)}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-bold text-slate-800 dark:text-slate-100">{c.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge color={getStatusColor(status)}>{status}</Badge>
                                <span className="text-[10px] text-gray-400 font-medium">{formatPhone(c.phone)}</span>
                              </div>
                            </div>
                            {selectedCustomerId === c.id && <CheckCircle2 className="text-rose-500" size={20} />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <Button 
              fullWidth 
              disabled={!selectedCustomerId} 
              onClick={() => setStep(2)}
              className="py-4 text-lg"
            >
              Continuar para Produtos
            </Button>
          </div>
        </section>
      )}

      {/* Step 2: Product Selection */}
      {step === 2 && (
        <section className="flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xl font-bold dark:text-slate-100">Adicionar Produtos</h3>
            <span className="text-rose-500 dark:text-rose-400 font-black text-xl">{formatCurrency(total)}</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[35vh] overflow-y-auto pr-1 beauty-scroll">
            {products.map(p => {
              const inCart = cartItems.find(i => i.productId === p.id);
              return (
                <div key={p.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                  <div className="flex-1 overflow-hidden pr-2">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">{p.category} • {p.stock} em estoque</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-500 pr-2">{formatCurrency(p.price)}</span>
                    <button 
                      disabled={p.stock <= 0}
                      onClick={() => addToCart(p)}
                      className="p-2.5 bg-rose-500 text-white rounded-xl active:scale-90 disabled:opacity-30 shadow-sm"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">Sacola ({cartItems.length})</h4>
              {cartItems.length > 0 && <button onClick={() => setCartItems([])} className="text-[10px] font-bold text-rose-400 underline uppercase tracking-widest">Limpar</button>}
            </div>
            
            {cartItems.length === 0 ? (
              <div className="py-8 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-gray-300 dark:text-slate-700">
                <ShoppingCart size={32} strokeWidth={1.5} />
                <p className="text-xs font-medium mt-2 uppercase tracking-wider">Sua sacola está vazia</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {cartItems.map(item => {
                  const p = products.find(prod => prod.prodId === item.productId || prod.id === item.productId);
                  return (
                    <div key={item.productId} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-transparent dark:border-slate-800">
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold dark:text-slate-200 truncate">{p?.name}</p>
                        <p className="text-xs text-rose-500 font-black">{formatCurrency(item.unitPrice * item.quantity)}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1 rounded-xl border border-gray-100 dark:border-slate-700">
                        <button onClick={() => updateQuantity(item.productId, -1)} className="p-1.5 text-gray-400 active:text-rose-500"><Minus size={14} /></button>
                        <span className="font-bold text-xs w-4 text-center dark:text-slate-200">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, 1)} className="p-1.5 text-gray-400 active:text-rose-500"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="p-2 text-rose-300 active:text-rose-600"><Trash2 size={16} /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setStep(1)} className="px-6"><ArrowLeft size={18} /></Button>
            <Button fullWidth disabled={cartItems.length === 0} onClick={() => setStep(3)} className="py-4 font-bold tracking-tight">
              Revisar Pagamento
            </Button>
          </div>
        </section>
      )}

      {/* Step 3: Payment & Installments */}
      {step === 3 && (
        <section className="flex flex-col gap-5 animate-fade-in">
          <div className="flex flex-col gap-1 px-1">
            <h3 className="text-2xl font-bold dark:text-slate-100">Finalizar Venda</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wider">Defina como sua cliente irá pagar</p>
          </div>
          
          <Card className="flex flex-col gap-4 border-2 border-rose-50 dark:border-rose-900/20 shadow-xl shadow-rose-100/20 dark:shadow-none">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600 dark:text-slate-400">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {id: 'pix', label: 'PIX'}, 
                    {id: 'cash', label: 'Dinheiro'},
                    {id: 'credit_card', label: 'Crédito'},
                    {id: 'debit_card', label: 'Débito'}
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${
                        paymentMethod === method.id 
                          ? 'bg-rose-500 border-rose-500 text-white shadow-md' 
                          : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600 dark:text-slate-400">Parcelamento</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <button
                      key={n}
                      onClick={() => setInstallments(n)}
                      className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${
                        installments === n 
                          ? 'bg-slate-800 dark:bg-rose-500 border-slate-800 dark:border-rose-500 text-white shadow-md' 
                          : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400'
                      }`}
                    >
                      {n === 1 ? 'À vista' : `${n}x`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900 dark:bg-[#1e293b] border-none text-white p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
              <div className="flex flex-col">
                <span className="text-xs text-white/50 font-bold uppercase tracking-widest">Total da Venda</span>
                <span className="text-2xl font-black">{formatCurrency(total)}</span>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl">
                <ShoppingCart className="text-rose-400" />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Plano de Pagamento</span>
                <span className="text-sm font-bold text-rose-300">
                  {installments === 1 ? 'Pagamento único' : `${installments} parcelas de ${formatCurrency(total / installments)}`}
                </span>
              </div>
              <Badge color="rose">Revisado</Badge>
            </div>
          </Card>

          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setStep(2)} className="px-6"><ArrowLeft size={18} /></Button>
            <Button fullWidth variant="primary" onClick={handleFinish} className="py-4 text-lg font-black tracking-tight">
              Confirmar e Gerar Dívida
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewSale;
