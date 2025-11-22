import React from 'react';
import { DiscoveryData, Flow } from '../../types';
import { SectionHeader, Button, IconButton } from '../ui/Common';
import { Plus, Trash2, ArrowRight, HelpCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  data: DiscoveryData;
  update: (data: Partial<DiscoveryData>) => void;
}

const ProcessFlowsSection: React.FC<Props> = ({ data, update }) => {
  const addFlow = () => {
    const newFlow: Flow = {
      id: uuidv4(),
      trigger: '',
      condition: '',
      action: '',
      result: ''
    };
    update({ flows: [...data.flows, newFlow] });
  };

  const removeFlow = (id: string) => {
    update({ flows: data.flows.filter(f => f.id !== id) });
  };

  const updateFlow = (id: string, field: keyof Flow, value: string) => {
    update({ flows: data.flows.map(f => f.id === id ? { ...f, [field]: value } : f) });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionHeader 
        title="3. Flujos de Proceso (Lógica de Negocio)" 
        description="Describa qué sucede 'detrás de cámaras'. Lógica Causa -> Efecto."
      />
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 text-sm text-blue-800 flex gap-3">
         <HelpCircle className="w-5 h-5 shrink-0" />
         <div>
            <strong>¿Por qué pedimos esto?</strong>
            <p>Estos flujos definen las funciones del Backend (API). Cada tarjeta aquí se convertirá en un <code>endpoint</code> o un <code>job</code> programado en el servidor.</p>
         </div>
      </div>

      <div className="grid gap-4">
        {data.flows.map((flow) => (
          <div key={flow.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative group">
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconButton icon={<Trash2 className="w-4 h-4 text-red-500" />} onClick={() => removeFlow(flow.id)} />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Evento (Trigger)</label>
                    <input 
                        className="w-full p-2 border border-slate-300 rounded mt-1 text-sm"
                        placeholder="Ej: Usuario clic en 'Pagar'"
                        value={flow.trigger}
                        onChange={(e) => updateFlow(flow.id, 'trigger', e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-secondary uppercase">Condición (Si...)</label>
                    <input 
                        className="w-full p-2 border border-slate-300 rounded mt-1 text-sm"
                        placeholder="Ej: Saldo > 0"
                        value={flow.condition}
                        onChange={(e) => updateFlow(flow.id, 'condition', e.target.value)}
                    />
                </div>
             </div>
             
             <div className="flex justify-center my-2">
                 <ArrowRight className="text-slate-300 w-5 h-5 rotate-90 md:rotate-0" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-800 uppercase">Acción del Sistema (Backend)</label>
                    <textarea 
                        className="w-full p-2 border border-slate-300 rounded mt-1 text-sm h-20"
                        placeholder="Ej: Procesar pago, descontar stock..."
                        value={flow.action}
                        onChange={(e) => updateFlow(flow.id, 'action', e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-green-600 uppercase">Resultado Esperado</label>
                    <textarea 
                        className="w-full p-2 border border-slate-300 rounded mt-1 text-sm h-20"
                        placeholder="Ej: Email enviado, Redirigir a éxito."
                        value={flow.result}
                        onChange={(e) => updateFlow(flow.id, 'result', e.target.value)}
                    />
                </div>
             </div>
          </div>
        ))}
      </div>

      <Button onClick={addFlow} variant="outline" className="w-full border-dashed py-3">
        <Plus className="w-4 h-4 mr-2" /> Agregar Flujo de Proceso
      </Button>
    </div>
  );
};

export default ProcessFlowsSection;