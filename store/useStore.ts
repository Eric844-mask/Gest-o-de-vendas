
import { useState, useEffect, useCallback } from 'react';
import { AppData, Customer, Product, Sale, Installment, UserProfile, View } from '../types';

const STORAGE_KEY = 'bellagestao_v1';

const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const SEED_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Maria Oliveira', phone: '00000000000', createdAt: Date.now() },
  { id: 'c2', name: 'Ana Beatriz Silva', phone: '00000000000', createdAt: Date.now() },
  { id: 'c3', name: 'João Pedro Santos', phone: '00000000000', createdAt: Date.now() },
  { id: 'c4', name: 'Carla Ferreira', phone: '00000000000', createdAt: Date.now() },
  { id: 'c5', name: 'Ricardo Almeida', phone: '00000000000', createdAt: Date.now() },
  { id: 'c6', name: 'Juliana Costa', phone: '00000000000', createdAt: Date.now() },
  { id: 'c7', name: 'Lucas Pereira', phone: '00000000000', createdAt: Date.now() },
  { id: 'c8', name: 'Beatriz Lima', phone: '00000000000', createdAt: Date.now() },
  { id: 'c9', name: 'Fernanda Gomes', phone: '00000000000', createdAt: Date.now() },
  { id: 'c10', name: 'Camila Souza', phone: '00000000000', createdAt: Date.now() },
];

const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Perfume Malbec 100ml', category: 'Fragrâncias', price: 189.90, stock: 5, minStock: 2 },
  { id: 'p2', name: 'Lily Eau de Parfum 75ml', category: 'Fragrâncias', price: 249.90, stock: 3, minStock: 2 },
  { id: 'p3', name: 'Batom Matte Velvet Rose', category: 'Maquiagem', price: 45.00, stock: 12, minStock: 5 },
  { id: 'p4', name: 'Base Líquida HD Alta Cobertura', category: 'Maquiagem', price: 89.00, stock: 1, minStock: 3 },
  { id: 'p5', name: 'Sérum Facial Vitamina C', category: 'Cuidados com a Pele', price: 120.00, stock: 8, minStock: 2 },
  { id: 'p6', name: 'Protetor Solar FPS 60', category: 'Cuidados com a Pele', price: 75.50, stock: 10, minStock: 4 },
  { id: 'p7', name: 'Shampoo Reconstrução Intensa', category: 'Cabelo', price: 58.00, stock: 15, minStock: 5 },
  { id: 'p8', name: 'Condicionador Brilho Absoluto', category: 'Cabelo', price: 62.00, stock: 12, minStock: 5 },
  { id: 'p9', name: 'Óleo Capilar Argan', category: 'Cabelo', price: 45.90, stock: 4, minStock: 3 },
  { id: 'p10', name: 'Sabonete Líquido Lavanda', category: 'Corpo e Banho', price: 32.00, stock: 20, minStock: 5 },
  { id: 'p11', name: 'Hidratante Corporal Amêndoas', category: 'Corpo e Banho', price: 68.00, stock: 2, minStock: 4 },
  { id: 'p12', name: 'Máscara de Cílios Volume Máximo', category: 'Maquiagem', price: 55.00, stock: 9, minStock: 3 },
  { id: 'p13', name: 'Delineador Caneta Preto', category: 'Maquiagem', price: 39.90, stock: 6, minStock: 2 },
  { id: 'p14', name: 'Perfume Floratta Blue', category: 'Fragrâncias', price: 139.00, stock: 7, minStock: 2 },
  { id: 'p15', name: 'Creme de Mãos Karité', category: 'Corpo e Banho', price: 28.00, stock: 25, minStock: 5 },
  { id: 'p16', name: 'Esfoliante Facial Renovador', category: 'Cuidados com a Pele', price: 49.00, stock: 11, minStock: 3 },
  { id: 'p17', name: 'Paleta de Sombras Basic', category: 'Maquiagem', price: 115.00, stock: 3, minStock: 2 },
  { id: 'p18', name: 'Body Splash Morango e Leite', category: 'Corpo e Banho', price: 65.00, stock: 8, minStock: 3 },
  { id: 'p19', name: 'Kit Pincéis Profissional', category: 'Maquiagem', price: 159.00, stock: 4, minStock: 2 },
  { id: 'p20', name: 'Gel de Limpeza Facial', category: 'Cuidados com a Pele', price: 52.00, stock: 14, minStock: 4 },
];

const INITIAL_DATA: AppData = {
  customers: SEED_CUSTOMERS,
  products: SEED_PRODUCTS,
  sales: [],
  installments: [],
  profile: {
    name: 'Consultora Bella',
    businessName: 'Minha Loja Bella',
    currency: 'BRL',
    theme: undefined 
  }
};

export const useStore = () => {
  const [data, setData] = useState<AppData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const systemTheme = getSystemTheme();
      
      if (!stored) {
        return {
          ...INITIAL_DATA,
          profile: { ...INITIAL_DATA.profile, theme: systemTheme }
        };
      }
      
      const parsed = JSON.parse(stored);
      const effectiveTheme = parsed.profile?.theme || systemTheme;
      
      return {
        ...INITIAL_DATA,
        ...parsed,
        profile: { 
          ...INITIAL_DATA.profile, 
          ...(parsed.profile || {}),
          theme: effectiveTheme
        }
      };
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
      return {
        ...INITIAL_DATA,
        profile: { ...INITIAL_DATA.profile, theme: getSystemTheme() }
      };
    }
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    if (data.profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const hasManualOverride = localStorage.getItem('theme_manually_set') === 'true';
      if (!hasManualOverride) {
        const newTheme = e.matches ? 'dark' : 'light';
        setData(prev => ({
          ...prev,
          profile: { ...prev.profile, theme: newTheme }
        }));
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setData(prev => {
      const newTheme = prev.profile.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme_manually_set', 'true');
      return {
        ...prev,
        profile: {
          ...prev.profile,
          theme: newTheme
        }
      };
    });
  }, []);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setData(prev => ({ ...prev, customers: [...prev.customers, newCustomer] }));
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setData(prev => ({
      ...prev,
      customers: prev.customers.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const deleteCustomer = (id: string) => {
    setData(prev => ({
      ...prev,
      customers: prev.customers.filter(c => c.id !== id),
      installments: prev.installments.filter(ins => {
        const sale = prev.sales.find(s => s.id === ins.saleId);
        return sale?.customerId !== id;
      }),
      sales: prev.sales.filter(s => s.customerId !== id)
    }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  };

  const updateProductStock = (productId: string, quantityChange: number) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.id === productId ? { ...p, stock: Math.max(0, p.stock + quantityChange) } : p
      )
    }));
  };

  const createSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    const saleId = crypto.randomUUID();
    const now = Date.now();
    const newSale: Sale = { ...saleData, id: saleId, createdAt: now };
    const newInstallments: Installment[] = [];
    const installmentAmount = saleData.total / saleData.installments;
    for (let i = 1; i <= saleData.installments; i++) {
      const dueDate = new Date(now);
      dueDate.setMonth(dueDate.getMonth() + i);
      newInstallments.push({
        id: crypto.randomUUID(),
        saleId,
        number: i,
        amount: installmentAmount,
        dueDate: dueDate.getTime()
      });
    }
    setData(prev => {
      const updatedProducts = prev.products.map(p => {
        const item = saleData.items.find(si => si.productId === p.id);
        if (item) return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        return p;
      });
      return {
        ...prev,
        sales: [...prev.sales, newSale],
        installments: [...prev.installments, ...newInstallments],
        products: updatedProducts
      };
    });
  };

  const markInstallmentAsPaid = (installmentId: string) => {
    setData(prev => ({
      ...prev,
      installments: prev.installments.map(ins => 
        ins.id === installmentId ? { ...ins, paidAt: Date.now() } : ins
      )
    }));
  };

  const updateProfile = (profile: UserProfile) => {
    setData(prev => ({ ...prev, profile }));
  };

  const getCustomerStatus = (customerId: string) => {
    const customerInstallments = data.installments.filter(ins => {
      const sale = data.sales.find(s => s.id === ins.saleId);
      return sale?.customerId === customerId;
    });
    const hasOverdue = customerInstallments.some(ins => !ins.paidAt && ins.dueDate < Date.now());
    const hasPending = customerInstallments.some(ins => !ins.paidAt);
    if (hasOverdue) return 'devedor';
    if (hasPending) return 'pendente';
    return 'em dia';
  };

  const getDashboardStats = () => {
    const dateObj = new Date();
    const today = new Date().setHours(0, 0, 0, 0);
    const thisMonthStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getTime();
    const nextMonthStart = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 1).getTime();
    
    const salesToday = data.sales.filter(s => s.createdAt >= today).reduce((acc, s) => acc + s.total, 0);
    const salesMonth = data.sales.filter(s => s.createdAt >= thisMonthStart).reduce((acc, s) => acc + s.total, 0);
    
    const pendingInstallments = data.installments.filter(ins => !ins.paidAt);
    const totalReceivable = pendingInstallments.reduce((acc, ins) => acc + ins.amount, 0);
    
    // Agrupamento mensal para projeção
    const monthlyMap: Record<string, number> = {};
    pendingInstallments.forEach(ins => {
      const d = new Date(ins.dueDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + ins.amount;
    });

    const sortedMonthKeys = Object.keys(monthlyMap).sort();
    const currentMonthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    
    const receivableThisMonth = monthlyMap[currentMonthKey] || 0;
    const receivableFuture = Object.keys(monthlyMap)
      .filter(key => key > currentMonthKey)
      .reduce((acc, key) => acc + monthlyMap[key], 0);

    const receivablesByMonth = sortedMonthKeys.map(key => ({
      key,
      label: new Date(key + '-02').toLocaleString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', ''),
      total: monthlyMap[key],
      isCurrent: key === currentMonthKey
    }));

    const furthestInstallment = pendingInstallments.length > 0 
      ? Math.max(...pendingInstallments.map(ins => ins.dueDate))
      : null;

    const activeCustomers = data.customers.length;
    const lowStockItems = data.products.filter(p => p.stock <= p.minStock).length;
    
    return { 
      salesToday, 
      salesMonth, 
      totalReceivable, 
      receivableThisMonth,
      receivableFuture,
      receivablesByMonth,
      furthestInstallment,
      activeCustomers, 
      lowStockItems 
    };
  };

  return {
    data,
    currentView,
    setCurrentView,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addProduct,
    createSale,
    markInstallmentAsPaid,
    updateProfile,
    getCustomerStatus,
    getDashboardStats,
    updateProductStock,
    toggleTheme
  };
};
