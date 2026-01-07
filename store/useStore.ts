
import { useState, useEffect, useCallback } from 'react';
import { AppData, Customer, Product, Sale, Installment, UserProfile, View } from '../types';

const STORAGE_KEY = 'bellagestao_v1';

const INITIAL_DATA: AppData = {
  customers: [],
  products: [],
  sales: [],
  installments: [],
  profile: {
    name: 'Consultora Bella',
    businessName: 'Minha Loja de Beleza',
    currency: 'BRL'
  }
};

export const useStore = () => {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_DATA;
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setData(prev => ({ ...prev, customers: [...prev.customers, newCustomer] }));
    return newCustomer;
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
    
    const newSale: Sale = {
      ...saleData,
      id: saleId,
      createdAt: now
    };

    // Generate installments
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
      // Update stock for each item
      const updatedProducts = prev.products.map(p => {
        const item = saleData.items.find(si => si.productId === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
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

  // Helper selectors
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
    const today = new Date().setHours(0, 0, 0, 0);
    const thisMonth = new Date().setDate(1);

    const salesToday = data.sales.filter(s => s.createdAt >= today).reduce((acc, s) => acc + s.total, 0);
    const salesMonth = data.sales.filter(s => s.createdAt >= thisMonth).reduce((acc, s) => acc + s.total, 0);
    const totalReceivable = data.installments.filter(ins => !ins.paidAt).reduce((acc, ins) => acc + ins.amount, 0);
    const activeCustomers = data.customers.length;
    const lowStockItems = data.products.filter(p => p.stock <= p.minStock).length;

    return { salesToday, salesMonth, totalReceivable, activeCustomers, lowStockItems };
  };

  return {
    data,
    currentView,
    setCurrentView,
    addCustomer,
    addProduct,
    createSale,
    markInstallmentAsPaid,
    updateProfile,
    getCustomerStatus,
    getDashboardStats,
    updateProductStock
  };
};
