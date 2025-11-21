
import React from 'react';
import { DiscoveryData, Role } from '../../types';
import { SectionHeader, Button, Input } from '../ui/Common';
import { Plus, Trash2, Wifi, Smartphone, Database, Layers, Cloud, Mail, Calendar, FileText, Zap } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  data: DiscoveryData;
  update: (data: Partial<DiscoveryData>) => void;
}

const TechnicalSection: React.FC<Props> = ({ data, update }) => {
  
  // Roles Logic
  const addRole = () => {
    const newRole: Role = { id: uuidv4(), name: '', description: '', modules: '', restrictions: '' };
    update({ roles: [...data.roles, newRole] });
  };
  const updateRole = (id: string, field: keyof Role, val: string) => {
    update({ roles: data.roles.map(r => r.id === id ? { ...r, [field]: val } : r) });
  };
  const removeRole = (id: string) => update({ roles: data.roles.filter(r => r.id !== id) });

  // Tech Helpers
  const toggleDevice = (device: string) => {
    const devices = data.devices.includes(device) 
      ? data.devices.filter(d => d !== device)
      : [...data.devices, device];
    update({ devices });
  };

  const toggleAutomation = (need: string) => {
    const needs = data.automationNeeds.includes(need)
      ? data.automationNeeds.filter(n => n !== need)
      : [...data.automationNeeds, need];
    update({ automationNeeds: needs });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* ROLES */}
      <div>
        <SectionHeader title="4. Roles y Seguridad" description="¿Quién puede hacer qué? (RBAC)" />
        <div className="space-y-4">
          {data.roles.map(role => (
             <div key={role.id} className="flex flex-col md:flex-row gap-3 items-start bg-white p-3 rounded border shadow-sm">
                <div className="md:w-1/4">
                    <Input label="Rol" placeholder="Ej: Admin" value={role.name} onChange={e => updateRole(role.id, 'name', e.target.value)} className="mb-0" />
                </div>
                <div className="md:w-1/3">
                    <Input label="Módulos Permitidos" placeholder="Ej: Todos" value={role.modules} onChange={e => updateRole(role.id, 'modules', e.target.value)} className="mb-0" />
                </div>
                 <div className="md:w-1/3">
                    <Input label="Restricciones" placeholder="Ej: Solo lectura" value={role.restrictions} onChange={e => updateRole(role.id, 'restrictions', e.target.value)} className="mb-0" />
                </div>
                <button onClick={() => removeRole(role.id)} className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="w-5 h-5" />
                </button>
             </div>
          ))}
          <Button onClick={addRole} variant="outline" className="w-full border-dashed"><Plus className="w-4 h-4 mr-2"/> Agregar Rol</Button>
        </div>
      </div>

      {/* TECHNICAL */}
      <div>
        <SectionHeader title="5. Requerimientos Técnicos" description="Aspectos críticos de arquitectura." />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Connectivity */}
            <div className="bg-white p-4 rounded border border-slate-200">
                <div className="flex items-center gap-2 mb-3 font-semibold text-slate-700">
                    <Wifi className="w-5 h-5 text-secondary" /> Conectividad
                </div>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input type="radio" name="connectivity" checked={data.connectivity === 'online'} onChange={() => update({ connectivity: 'online'})} />
                    100% Online (Web tradicional)
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="connectivity" checked={data.connectivity === 'offline-first'} onChange={() => update({ connectivity: 'offline-first'})} />
                    Offline First (Sincronización)
                </label>
            </div>

            {/* Devices */}
            <div className="bg-white p-4 rounded border border-slate-200">
                <div className="flex items-center gap-2 mb-3 font-semibold text-slate-700">
                    <Smartphone className="w-5 h-5 text-secondary" /> Dispositivos
                </div>
                {['Computador', 'Móvil (App)', 'Tablet'].map(dev => (
                    <label key={dev} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input type="checkbox" checked={data.devices.includes(dev)} onChange={() => toggleDevice(dev)} />
                        {dev}
                    </label>
                ))}
            </div>

            {/* Volume & Brand */}
             <div className="bg-white p-4 rounded border border-slate-200 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-3 font-semibold text-slate-700">
                        <Database className="w-5 h-5 text-secondary" /> Volumen de Datos
                    </div>
                    <Input label="" placeholder="Ej: 1,000 pedidos/mes" value={data.volume} onChange={e => update({volume: e.target.value})} />
                </div>
                 <div>
                    <div className="flex items-center gap-2 mb-3 font-semibold text-slate-700">
                        <Layers className="w-5 h-5 text-secondary" /> Integraciones Externas (ERP/CRM)
                    </div>
                    <select className="w-full p-2 border border-slate-300 rounded" value={data.integrations} onChange={e => update({ integrations: e.target.value })}>
                        <option value="none">Independiente (No)</option>
                        <option value="yes">Sí (ERP, CRM, APIs)</option>
                    </select>
                </div>
            </div>
        </div>

        {/* NEW: ECOSYSTEM & AUTOMATION */}
        <div className="border-t border-slate-200 pt-8">
          <SectionHeader title="Ecosistema y Automatización" description="¿La aplicación vivirá dentro de Google o Microsoft? ¿Qué procesos automatizaremos?" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Google Card */}
              <div 
                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${data.ecosystemPreference === 'google' ? 'border-secondary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => update({ ecosystemPreference: 'google', preferredBiTool: 'looker' })}
              >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl">G</div>
                  <div className="font-bold text-slate-800">Google Workspace</div>
                  <div className="text-xs text-center text-slate-500">Gmail, Drive, Calendar, Looker</div>
              </div>

              {/* Microsoft Card */}
              <div 
                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${data.ecosystemPreference === 'microsoft' ? 'border-secondary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => update({ ecosystemPreference: 'microsoft', preferredBiTool: 'powerbi' })}
              >
                   <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl">M</div>
                  <div className="font-bold text-slate-800">Microsoft 365</div>
                  <div className="text-xs text-center text-slate-500">Outlook, OneDrive, Teams, PowerBI</div>
              </div>

               {/* Other Card */}
               <div 
                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${data.ecosystemPreference === 'other' ? 'border-secondary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => update({ ecosystemPreference: 'other', preferredBiTool: 'custom' })}
              >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600"><Cloud className="w-6 h-6" /></div>
                  <div className="font-bold text-slate-800">Independiente / AWS</div>
                  <div className="text-xs text-center text-slate-500">Infraestructura a medida</div>
              </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
             <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700">
                <Zap className="w-5 h-5 text-accent" /> Necesidades de Automatización
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'email', label: 'Notificaciones por Correo (Gmail/Outlook)', icon: <Mail className="w-4 h-4"/> },
                  { id: 'calendar', label: 'Agendamiento en Calendario', icon: <Calendar className="w-4 h-4"/> },
                  { id: 'documents', label: 'Generación de Documentos (Docs/Word)', icon: <FileText className="w-4 h-4"/> },
                  { id: 'storage', label: 'Almacenamiento de Archivos (Drive/OneDrive)', icon: <Cloud className="w-4 h-4"/> },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 p-3 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input 
                      type="checkbox" 
                      className="rounded text-secondary focus:ring-secondary"
                      checked={data.automationNeeds.includes(opt.id)}
                      onChange={() => toggleAutomation(opt.id)}
                    />
                    <span className="text-slate-500">{opt.icon}</span>
                    <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                  </label>
                ))}
             </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default TechnicalSection;
