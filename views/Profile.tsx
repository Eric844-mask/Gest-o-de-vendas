import React, { useState } from 'react';
import { Card, Input, Button } from '../components/UI';
import { UserCircle, Save, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  updateProfile: (p: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, updateProfile }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    businessName: profile.businessName
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateProfile({
      ...profile,
      name: formData.name,
      businessName: formData.businessName
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-3xl flex items-center justify-center">
          <UserCircle size={64} />
        </div>
        <h2 className="text-xl font-bold dark:text-slate-100">
          {profile.name || 'Sua Conta'}
        </h2>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest px-1">Configurações do Perfil</h3>
        <Card className="flex flex-col gap-4">
          <Input 
            label="Seu Nome" 
            placeholder="Ex: Coloque seu primeiro nome"
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          <Input 
            label="Nome da Loja" 
            placeholder="Ex: Gestão de vendas"
            value={formData.businessName} 
            onChange={e => setFormData({...formData, businessName: e.target.value})} 
          />
        </Card>
      </section>

      <div className="mt-4 flex flex-col gap-4">
        <Button 
          variant={isSaved ? "secondary" : "primary"} 
          fullWidth 
          onClick={handleSave}
          className={isSaved ? "text-emerald-500 dark:text-emerald-400" : ""}
        >
          {isSaved ? (
            <>
              <CheckCircle2 size={20} /> Alterações Salvas
            </>
          ) : (
            <>
              <Save size={20} /> Salvar Alterações
            </>
          )}
        </Button>
        
        <p className="text-center text-[10px] text-gray-400 dark:text-slate-600">
          Gestão de Vendas v1.1.0 • Foco no Sucesso
        </p>
      </div>
    </div>
  );
};

export default Profile;