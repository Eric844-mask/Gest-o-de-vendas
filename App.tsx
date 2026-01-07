
import React from 'react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Customers from './views/Customers';
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
    addProduct, 
    createSale, 
    markInstallmentAsPaid,
    updateProfile,
    getCustomerStatus,
    getDashboardStats 
  } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard stats={getDashboardStats()} setView={setCurrentView} />;
      case 'customers':
        return <Customers customers={data.customers} addCustomer={addCustomer} getStatus={getCustomerStatus} />;
      case 'inventory':
        return <Inventory products={data.products} addProduct={addProduct} />;
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
        return <Dashboard stats={getDashboardStats()} setView={setCurrentView} />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return data.profile.businessName;
      case 'customers': return 'Clientes';
      case 'inventory': return 'Estoque';
      case 'new-sale': return 'Nova Venda';
      case 'debtors': return 'Financeiro';
      case 'profile': return 'Meu Perfil';
      default: return 'BellaGestão';
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} title={getTitle()}>
      {renderView()}
    </Layout>
  );
};

export default App;
