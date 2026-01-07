
import React from 'react';
import { Card, Input, Button, Badge } from '../components/UI';
import { UserCircle, Settings, ShieldCheck, Share2, LogOut, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  updateProfile: (p: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, updateProfile }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center">
          <UserCircle size={64} />
        </div>
        <h2 className="text-xl font-bold">{profile.name}</h2>
        <Badge color="rose">Consultora Diamante</Badge>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Configurações do Perfil</h3>
        <Card className="flex flex-col gap-4">
          <Input label="Seu Nome" value={profile.name} onChange={e => updateProfile({...profile, name: e.target.value})} />
          <Input label="Nome da Loja" value={profile.businessName} onChange={e => updateProfile({...profile, businessName: e.target.value})} />
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Geral</h3>
        <div className="flex flex-col gap-2">
          {[
            { icon: <ShieldCheck size={20} />, label: 'Privacidade e Segurança', color: 'text-blue-500' },
            { icon: <HelpCircle size={20} />, label: 'Ajuda e Suporte', color: 'text-amber-500' },
            { icon: <Share2 size={20} />, label: 'Compartilhar Aplicativo', color: 'text-indigo-500' },
          ].map((item, idx) => (
            <Card key={idx} className="flex items-center gap-3 py-4 active:bg-gray-50 transition-colors">
              <div className={`${item.color}`}>{item.icon}</div>
              <span className="font-semibold text-sm flex-1">{item.label}</span>
            </Card>
          ))}
        </div>
      </section>

      <Button variant="danger" fullWidth className="mt-4">
        <LogOut size={20} /> Sair da Conta
      </Button>
      
      <p className="text-center text-[10px] text-gray-400 mt-4">
        BellaGestão v1.0.0 • Feito para Consultoras de Sucesso
      </p>
    </div>
  );
};

export default Profile;
