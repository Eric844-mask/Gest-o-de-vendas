
import React, { useState } from 'react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Customers from './views/Customers';
import EditCustomer from './views/EditCustomer';
import Inventory from './views/Inventory';
import NewSale from './views/NewSale';
import Debtors from './views/Debtors';
import Profile from './views/Profile';

const App: React.FC = () => {
  const { 
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
    getDashboardStats 
  } = useStore();

  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

  const handleEditCustomer = (id: string) => {
    setEditingCustomerId(id);
    setCurrentView('edit-customer');
  };

  const getTodayReminders = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return data.installments
      .filter(ins => {
        const insDate = new Date(ins.dueDate).setHours(0, 0, 0, 0);
        return insDate === today && !ins.paidAt;
      })
      .map(ins => {
        const sale = data.sales.find(s => s.id === ins.saleId);
        const customer = data.customers.find(c => c.id === sale?.customerId);
        return {
          id: ins.id,
          customerName: customer?.name || 'Cliente',
          amount: ins.amount
        };
      });
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={getDashboardStats()} 
            setView={setCurrentView} 
            userName={data.profile.name}
            reminders={getTodayReminders()}
          />
        );
      case 'customers':
        return <Customers customers={data.customers} addCustomer={addCustomer} deleteCustomer={deleteCustomer} getStatus={getCustomerStatus} onEdit={handleEditCustomer} />;
      case 'add-customer':
        return <Customers customers={data.customers} addCustomer={addCustomer} deleteCustomer={deleteCustomer} getStatus={getCustomerStatus} onEdit={handleEditCustomer} initialIsAdding={true} />;
      case 'edit-customer':
        const customerToEdit = data.customers.find(c => c.id === editingCustomerId);
        if (!customerToEdit) {
          setCurrentView('customers');
          return null;
        }
        return <EditCustomer customer={customerToEdit} updateCustomer={updateCustomer} setView={setCurrentView} />;
      case 'inventory':
        return <Inventory products={data.products} addProduct={addProduct} />;
      case 'add-product':
        return <Inventory products={data.products} addProduct={addProduct} initialIsAdding={true} />;
      case 'new-sale':
        return <NewSale customers={data.customers} products={data.products} createSale={createSale} setView={setCurrentView} />;
      case 'debtors':
        return (
          <Debtors 
            installments={data.installments} 
            customers={data.customers} 
            sales={data.sales} 
            products={data.products} 
            markPaid={markInstallmentAsPaid} 
          />
        );
      case 'profile':
        return <Profile profile={data.profile} updateProfile={updateProfile} />;
      default:
        return (
          <Dashboard 
            stats={getDashboardStats()} 
            setView={setCurrentView} 
            userName={data.profile.name} 
            reminders={getTodayReminders()}
          />
        );
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return data.profile.businessName || 'Gestão de Vendas';
      case 'customers':
      case 'add-customer':
      case 'edit-customer': return 'Clientes';
      case 'inventory':
      case 'add-product': return 'Estoque';
      case 'new-sale': return 'Nova Venda';
      case 'debtors': return 'Financeiro';
      case 'profile': return 'Meu Perfil';
      default: return 'Gestão de Vendas';
    }
  };

  const currentLayoutView = () => {
    if (currentView === 'add-customer' || currentView === 'edit-customer') return 'customers';
    if (currentView === 'add-product') return 'inventory';
    return currentView;
  };

  return (
    <Layout currentView={currentLayoutView()} setView={setCurrentView} title={getTitle()}>
      {renderView()}
    </Layout>
  );
};

export default App;
