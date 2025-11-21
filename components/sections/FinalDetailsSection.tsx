import React from 'react';
import { DiscoveryData, LegacyData, Indicator } from '../../types';
import { SectionHeader, Button, Input } from '../ui/Common';
import { Plus, Trash2, BarChart, PieChart, TrendingUp, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  data: DiscoveryData;
  update: (data: Partial<DiscoveryData>) => void;
}

const FinalDetailsSection: React.FC<Props> = ({ data, update }) => {
  
  // Migration
  const addLegacy = () => {
    const item: LegacyData = { id: uuidv4(), source: '', format: '', quality: 5, action: '' };
    update({ legacyData: [...data.legacyData, item] });
  };
  const updateLegacy = (id: string, field: keyof LegacyData, val: any) => {
    update({ legacyData: data.legacyData.map(i => i.id === id ? { ...i, [field]: val } : i) });
  };
  const removeLegacy = (id: string) => update({ legacyData: data.legacyData.filter(i => i.id !== id) });

  // Indicators
  const updateIndicator = (id: string, field: keyof Indicator, val: string) => {
    update({ indicators: data.indicators.map(i => i.id === id ? { ...i, [field]: val } : i) });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* MIGRATION */}
      <div>
        <SectionHeader title="6. Migración de Datos" description="Si existe información previa, ¿cómo la llevamos al nuevo sistema?" />
        <div className="space-y-4">
          {data.legacyData.map(item => (
             <div key={item.id} className="bg-white p-4 rounded border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-1">
                   <label className="text-xs font-semibold text-slate-600">Fuente Actual</label>
                   <input className="w-full p-2 border border-slate-300 rounded text-sm" placeholder="Ej: Excel" value={item.source} onChange={e => updateLegacy(item.id, 'source', e.target.value)} />
                </div>
                <div className="md:col-span-1">
                   <label className="text-xs font-semibold text-slate-600">Formato</label>
                   <input className="w-full p-2 border border-slate-300 rounded text-sm" placeholder="Ej: .csv" value={item.format} onChange={e => updateLegacy(item.id, 'format', e.target.value)} />
                </div>
                <div className="md:col-span-1">
                   <label className="text-xs font-semibold text-slate-600">Calidad (1-10)</label>
                   <input type="number" min="1" max="10" className="w-full p-2 border border-slate-300 rounded text-sm" value={item.quality} onChange={e => updateLegacy(item.id, 'quality', parseInt(e.target.value))} />
                </div>
                 <div className="md:col-span-1 flex gap-2">
                   <div className="flex-1">
                       <label className="text-xs font-semibold text-slate-600">Acción</label>
                       <input className="w-full p-2 border border-slate-300 rounded text-sm" placeholder="Ej: Importar" value={item.action} onChange={e => updateLegacy(item.id, 'action', e.target.value)} />
                   </div>
                   <button onClick={() => removeLegacy(item.id)} className="mb-1 text-red-500"><Trash2/></button>
                </div>
             </div>
          ))}
          <Button onClick={addLegacy} variant="outline" className="w-full border-dashed"><Plus className="w-4 h-4 mr-2"/> Agregar Fuente de Datos Legacy</Button>
        </div>
      </div>

      {/* BI & ANALYTICS */}
      <div>
        <SectionHeader title="7. Inteligencia de Negocios (BI)" description="Estrategia de Datos y Métricas." />
        
        {/* Data Strategy Controls */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nivel de Analítica Requerido</label>
                  <div className="space-y-2">
                      {[
                        { val: 'operational', label: 'Operativa (Listados y Exportación Excel)', icon: <FileText className="w-4 h-4"/> },
                        { val: 'bi', label: 'Táctica (Dashboards Interactivos)', icon: <BarChart className="w-4 h-4"/> },
                        { val: 'predictive', label: 'Estratégica / IA (Predicciones)', icon: <TrendingUp className="w-4 h-4"/> },
                      ].map(opt => (
                          <label key={opt.val} className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${data.analyticsLevel === opt.val ? 'bg-white border-secondary ring-1 ring-secondary' : 'bg-slate-100 border-transparent hover:bg-white hover:border-slate-300'}`}>
                              <input type="radio" name="analyticsLevel" className="hidden" checked={data.analyticsLevel === opt.val} onChange={() => update({ analyticsLevel: opt.val })} />
                              <div className={`p-2 rounded-full ${data.analyticsLevel === opt.val ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-500'}`}>
                                  {opt.icon}
                              </div>
                              <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                          </label>
                      ))}
                  </div>
              </div>

              <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Herramienta de Visualización</label>
                   <p className="text-xs text-slate-500 mb-3">¿Dónde deben visualizarse los datos?</p>
                   <select 
                      className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-secondary outline-none bg-white"
                      value={data.preferredBiTool}
                      onChange={(e) => update({ preferredBiTool: e.target.value })}
                   >
                      <option value="">Seleccionar herramienta...</option>
                      <option value="looker">Google Looker Studio (Ideal para G-Suite)</option>
                      <option value="powerbi">Microsoft Power BI (Ideal para Microsoft 365)</option>
                      <option value="tableau">Tableau</option>
                      <option value="custom">Dashboard a la Medida (React/Web)</option>
                      <option value="excel">Solo Excel / Sheets</option>
                   </select>

                   {data.preferredBiTool && (
                     <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                        {data.preferredBiTool === 'looker' && "✅ Excelente opción gratuita y nativa de Google."}
                        {data.preferredBiTool === 'powerbi' && "✅ El estándar del mercado corporativo. Requiere licencias Pro."}
                        {data.preferredBiTool === 'custom' && "✅ Flexibilidad total, pero mayor tiempo de desarrollo."}
                     </div>
                   )}
              </div>
           </div>
        </div>

        {/* KPI Inputs */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-secondary"/> Indicadores Clave (KPIs)</h4>
            <div className="space-y-4">
                {data.indicators.map((ind, idx) => (
                    <div key={ind.id} className="flex gap-4 items-center">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold shrink-0">
                            {idx + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Nombre del Indicador" placeholder="Ej: Ventas Totales" value={ind.name} onChange={e => updateIndicator(ind.id, 'name', e.target.value)} className="mb-0"/>
                            <Input label="Fórmula de Cálculo" placeholder="Ej: Suma(Pedidos) - Devoluciones" value={ind.formula} onChange={e => updateIndicator(ind.id, 'formula', e.target.value)} className="mb-0" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
         <label className="block font-bold text-slate-700 mb-2">Notas Adicionales</label>
         <textarea 
            className="w-full border border-slate-300 rounded-md p-3 h-32" 
            placeholder="Cualquier otro requerimiento..."
            value={data.additionalNotes}
            onChange={e => update({ additionalNotes: e.target.value })}
         />
      </div>

    </div>
  );
};

export default FinalDetailsSection;