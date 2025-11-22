import React, { useState, useMemo } from 'react';
import { DiscoveryData } from '../types';
import { 
  Rocket, Target, Users, Activity, Database, ArrowRight, 
  Shield, Wifi, Smartphone, Layers, Zap, BarChart, 
  Printer, ChevronLeft, Cloud, Mail, Calendar, FileText,
  BrainCircuit, Clock, GitBranch, AlertTriangle
} from 'lucide-react';
import { Button } from './ui/Common';
import MermaidDiagram from './ui/MermaidDiagram';
import { reviewProject } from '../services/geminiService';

interface Props {
  data: DiscoveryData;
  onBack: () => void;
}

const ProjectReportView: React.FC<Props> = ({ data, onBack }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'blueprints' | 'ai'>('report');
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleAiReview = async () => {
    setLoadingAi(true);
    try {
      const report = await reviewProject(JSON.stringify(data, null, 2));
      setAiReview(report);
    } finally {
      setLoadingAi(false);
    }
  };

  // --- BLUEPRINT GENERATION LOGIC ---
  
  const erDiagram = useMemo(() => {
    if (data.entities.length === 0) return '';
    let chart = 'erDiagram\n';
    data.entities.forEach(ent => {
      const safeName = ent.name.replace(/\s+/g, '_') || 'Entidad';
      chart += `  ${safeName} {\n`;
      ent.attributes.forEach(attr => {
        const type = attr.type.replace(/\s+/g, '_');
        chart += `    ${type} ${attr.name.replace(/\s+/g, '_')}\n`;
      });
      chart += `  }\n`;
    });
    return chart;
  }, [data.entities]);

  const flowChart = useMemo(() => {
    if (data.flows.length === 0) return '';
    let chart = 'graph TD\n';
    data.flows.forEach((flow, idx) => {
      const safeTrigger = flow.trigger.replace(/["'()]/g, '') || 'Inicio';
      const safeAction = flow.action.replace(/["'()]/g, '') || 'Proceso';
      const safeResult = flow.result.replace(/["'()]/g, '') || 'Fin';
      
      chart += `  Trigger${idx}[User: ${safeTrigger}] --> Action${idx}(System: ${safeAction})\n`;
      chart += `  Action${idx} --> Result${idx}{${safeResult}}\n`;
    });
    return chart;
  }, [data.flows]);

  // --- ESTIMATION LOGIC (T-Shirt Sizing) ---
  const estimation = useMemo(() => {
    const complexityPoints = (data.entities.length * 3) + (data.flows.length * 2) + data.roles.length;
    let size = 'S (Pequeño)';
    let time = '2 - 4 Semanas';
    let color = 'text-green-600';

    if (complexityPoints > 15) {
        size = 'M (Mediano)';
        time = '1 - 2 Meses';
        color = 'text-amber-600';
    }
    if (complexityPoints > 30) {
        size = 'L (Grande)';
        time = '3+ Meses';
        color = 'text-red-600';
    }
    return { size, time, color, points: complexityPoints };
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      {/* Toolbar */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <Button variant="secondary" onClick={onBack} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Volver al Panel
        </Button>
        
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            <button 
                onClick={() => setActiveTab('report')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'report' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                Informe General
            </button>
            <button 
                onClick={() => setActiveTab('blueprints')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'blueprints' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                Planos Técnicos
            </button>
             <button 
                onClick={() => setActiveTab('ai')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                AI Architect
            </button>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2 bg-white">
            <Printer className="w-4 h-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      {/* REPORT CONTAINER */}
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:max-w-none min-h-[800px]">
        
        {/* HEADER */}
        <div className="bg-slate-900 text-white p-8 border-b-4 border-secondary relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
                  {activeTab === 'blueprints' ? 'Planos Técnicos Generados' : activeTab === 'ai' ? 'Revisión de Inteligencia Artificial' : 'Reporte de Arquitectura'}
              </div>
              <h1 className="text-4xl font-bold mb-2">{data.projectName || 'Proyecto Sin Nombre'}</h1>
              <p className="text-slate-300 max-w-2xl">{data.mvpObjective || 'Sin objetivo definido.'}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
               <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${data.status === 'submitted' ? 'bg-emerald-500 text-emerald-50' : 'bg-amber-500 text-amber-900'}`}>
                  {data.status === 'submitted' ? 'Finalizado' : 'Borrador'}
               </span>
               <div className="text-right text-xs text-slate-400">
                  <div>ID: {data.id ? data.id.slice(0, 8) : 'Draft'}...</div>
                  <div>Fecha: {data.submissionDate || 'N/A'}</div>
               </div>
            </div>
          </div>
          <Rocket className="absolute -bottom-6 -right-6 w-48 h-48 text-white/5 rotate-12" />
        </div>

        {/* --- TAB: GENERAL REPORT --- */}
        {activeTab === 'report' && (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-300">
          
          {/* Executive Summary */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Target className="w-6 h-6 text-secondary" /> Visión Estratégica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-2 text-sm uppercase">La Problemática ("The Why")</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.problem || 'No especificado.'}</p>
               </div>
               <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-2 text-sm uppercase">Criterios de Éxito (KPIs)</h3>
                  <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">{data.kpis || 'No especificado.'}</p>
               </div>
            </div>
          </section>

           {/* Technical Specs Grid */}
           <section>
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Zap className="w-6 h-6 text-accent" /> Especificaciones Técnicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold uppercase text-slate-400 mb-1">Ecosistema</div>
                    <div className="font-bold text-lg text-slate-800">
                        {data.ecosystemPreference === 'google' ? 'Google Workspace' : data.ecosystemPreference === 'microsoft' ? 'Microsoft 365' : 'Custom / AWS'}
                    </div>
                 </div>
                 <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold uppercase text-slate-400 mb-1">Conectividad</div>
                    <div className="font-bold text-lg text-slate-800">
                        {data.connectivity === 'online' ? '100% Online' : 'Offline First'}
                    </div>
                 </div>
                 <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold uppercase text-slate-400 mb-1">Dispositivos</div>
                    <div className="font-bold text-lg text-slate-800">
                        {data.devices.length > 0 ? data.devices.join(', ') : 'No definido'}
                    </div>
                 </div>
            </div>
          </section>

          {/* Data Entities Summary */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Database className="w-6 h-6 text-secondary" /> Estructura de Datos
            </h2>
            {data.entities.length === 0 ? (
                <p className="text-slate-400 italic">Sin entidades definidas.</p>
            ) : (
                <div className="grid gap-4">
                    {data.entities.map((entity) => (
                        <div key={entity.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Layers className="w-5 h-5 text-slate-500"/> 
                                <span className="font-bold text-slate-800">{entity.name}</span>
                            </div>
                            <div className="text-sm text-slate-500">
                                {entity.attributes.length} Atributos
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </section>
        </div>
        )}

        {/* --- TAB: BLUEPRINTS --- */}
        {activeTab === 'blueprints' && (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-300 bg-slate-50 h-full">
            
            {/* Estimation Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Estimación de Esfuerzo (T-Shirt Sizing)</h3>
                        <p className="text-slate-500 text-sm">Basado en {data.entities.length} entidades y {data.flows.length} flujos.</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-3xl font-black ${estimation.color}`}>{estimation.size}</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tiempo Aprox: {estimation.time}</div>
                </div>
            </div>

            {/* ER Diagram */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-secondary"/> Diagrama Entidad-Relación (ER)
                </h3>
                {data.entities.length > 0 ? (
                    <MermaidDiagram chart={erDiagram} />
                ) : (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded border border-dashed">No hay suficientes datos para generar el diagrama.</div>
                )}
                <div className="mt-4 text-xs text-slate-400 text-center">Generado automáticamente con Mermaid.js</div>
            </div>

            {/* Flows Diagram */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-secondary"/> Flujograma de Procesos
                </h3>
                {data.flows.length > 0 ? (
                    <MermaidDiagram chart={flowChart} />
                ) : (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded border border-dashed">No hay flujos definidos para generar el diagrama.</div>
                )}
            </div>
        </div>
        )}

        {/* --- TAB: AI ARCHITECT --- */}
        {activeTab === 'ai' && (
        <div className="p-8 md:p-12 animate-in fade-in duration-300 min-h-[600px] bg-slate-50">
             <div className="text-center mb-8">
                 <BrainCircuit className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                 <h2 className="text-2xl font-bold text-slate-900">AI Architect Review</h2>
                 <p className="text-slate-500 max-w-lg mx-auto mt-2">
                    Nuestro motor de IA analizará la coherencia técnica de tus requerimientos, buscando riesgos y oportunidades de optimización.
                 </p>
             </div>

             {!aiReview && (
                 <div className="flex justify-center">
                     <Button onClick={handleAiReview} disabled={loadingAi} className="px-8 py-4 text-lg bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30">
                        {loadingAi ? 'Analizando Proyecto...' : 'Ejecutar Análisis de Arquitectura'}
                     </Button>
                 </div>
             )}

             {aiReview && (
                 <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-purple-100 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
                    <h3 className="font-bold text-purple-900 text-lg mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5"/> Reporte de Hallazgos
                    </h3>
                    
                    <div 
                        className="prose prose-slate prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: aiReview }}
                    />

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <Button variant="outline" onClick={() => setAiReview(null)} className="text-xs">
                            Ejecutar Nuevo Análisis
                        </Button>
                    </div>
                 </div>
             )}
        </div>
        )}
      </div>
    </div>
  );
};

export default ProjectReportView;