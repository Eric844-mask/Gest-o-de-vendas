
import React from 'react';
import { Card, Input, Button, Badge } from '../components/UI';
import { UserCircle, ShieldCheck, Share2, LogOut, HelpCircle, Moon, Sun } from 'lucide-react';
import { UserProfile } from '../types';
import { useStore } from '../store/useStore';

interface ProfileProps {
  profile: UserProfile;
  updateProfile: (p: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, updateProfile }) => {
  const { toggleTheme } = useStore();
  const isDark = profile.theme === 'dark';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-full flex items-center justify-center">
          <UserCircle size={64} />
        </div>
        <h2 className="text-xl font-bold dark:text-slate-100">{profile.name}</h2>
        <Badge color="rose">Consultora Diamante</Badge>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest px-1">Configurações do Perfil</h3>
        <Card className="flex flex-col gap-4">
          <Input label="Seu Nome" value={profile.name} onChange={e => updateProfile({...profile, name: e.target.value})} />
          <Input label="Nome da Loja" value={profile.businessName} onChange={e => updateProfile({...profile, businessName: e.target.value})} />
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest px-1">Aparência</h3>
        <Card className="flex items-center justify-between py-4 cursor-pointer" onClick={toggleTheme}>
          <div className="flex items-center gap-3">
            <div className="text-indigo-500">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span className="font-semibold text-sm dark:text-slate-200">Modo Escuro</span>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${isDark ? 'bg-rose-500' : 'bg-gray-200 dark:bg-slate-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest px-1">Geral</h3>
        <div className="flex flex-col gap-2">
          {[
            { icon: <ShieldCheck size={20} />, label: 'Privacidade e Segurança', color: 'text-blue-500' },
            { icon: <HelpCircle size={20} />, label: 'Ajuda e Suporte', color: 'text-amber-500' },
            { icon: <Share2 size={20} />, label: 'Compartilhar Aplicativo', color: 'text-indigo-500' },
          ].map((item, idx) => (
            <Card key={idx} className="flex items-center gap-3 py-4 active:bg-gray-50 dark:active:bg-slate-800 transition-colors">
              <div className={`${item.color}`}>{item.icon}</div>
              <span className="font-semibold text-sm flex-1 dark:text-slate-200">{item.label}</span>
            </Card>
          ))}
        </div>
      </section>

      <Button variant="danger" fullWidth className="mt-4">
        <LogOut size={20} /> Sair da Conta
      </Button>
      
      <p className="text-center text-[10px] text-gray-400 dark:text-slate-600 mt-4">
        Gestão de Vendas v1.1.0 • Foco no Sucesso
      </p>
    </div>
  );
};

export default Profile;