
import React, { useState, useEffect } from 'react';
import { DiscoveryData, INITIAL_DATA, STEPS } from './types';
import VisionSection from './components/sections/VisionSection';
import DataArchitectureSection from './components/sections/DataArchitectureSection';
import ProcessFlowsSection from './components/sections/ProcessFlowsSection';
import TechnicalSection from './components/sections/TechnicalSection';
import FinalDetailsSection from './components/sections/FinalDetailsSection';
import { Button, Input } from './components/ui/Common';
import { ChevronLeft, ChevronRight, CheckCircle, Download, Database, ShieldCheck, Rocket, LogOut, User, ArrowRight, Search, Wifi, Server, Activity, Loader2, Cloud } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { saveProjectToDB, getProjectsFromDB, signIn, signOut, getCurrentSession } from './services/supabaseClient';

// --- VIEW COMPONENTS ---

const LandingPage = ({ onStartClient, onStartAdmin }: { onStartClient: () => void, onStartAdmin: () => void }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Rocket className="w-12 h-12 text-secondary" />
        <h1 className="text-4xl font-bold text-slate-900">DateNova Solutions</h1>
      </div>
      <p className="text-slate-600 text-lg max-w-xl mx-auto">
        Plataforma de descubrimiento de requerimientos. Selecciona tu rol para continuar.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
      <div 
        onClick={onStartClient}
        className="bg-white p-8 rounded-xl border-2 border-slate-200 hover:border-secondary cursor-pointer transition-all shadow-sm hover:shadow-md group text-center"
      >
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
          <User className="w-8 h-8 text-secondary" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Soy Cliente</h3>
        <p className="text-slate-500">Iniciar un nuevo proyecto o continuar uno existente.</p>
        <Button className="mt-6 w-full">Iniciar Discovery</Button>
      </div>

      <div 
        onClick={onStartAdmin}
        className="bg-white p-8 rounded-xl border-2 border-slate-200 hover:border-slate-800 cursor-pointer transition-all shadow-sm hover:shadow-md group text-center"
      >
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-200 transition-colors">
          <ShieldCheck className="w-8 h-8 text-slate-700" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Equipo DateNova</h3>
        <p className="text-slate-500">Acceso administrativo para revisar requerimientos.</p>
        <Button variant="secondary" className="mt-6 w-full">Acceso Admin</Button>
      </div>
    </div>
  </div>
);

const AdminDashboard = ({ onExit, onLoadProject }: { onExit: () => void, onLoadProject: (p: DiscoveryData) => void }) => {
  const [projects, setProjects] = useState<DiscoveryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState('');

  // Check active session on mount
  useEffect(() => {
    const checkSession = async () => {
      setAuthLoading(true);
      try {
        const currentSession = await getCurrentSession();
        if (currentSession) {
          setSession(currentSession);
        }
      } catch (e) {
        console.error("Session check failed", e);
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, []);

  // Fetch projects when session is active
  useEffect(() => {
    const fetchProjects = async () => {
      if (session) {
        setLoading(true);
        try {
          const data = await getProjectsFromDB();
          setProjects(data);
        } catch (e) {
          console.error(e);
          setError('Error cargando proyectos de Supabase');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProjects();
  }, [session]);

  const handleLogin = async () => {
    setError('');
    setAuthLoading(true);
    try {
      const { session } = await signIn(email, password);
      setSession(session);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setSession(null);
    onExit();
  };

  if (authLoading && !session) {
     return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
           <Loader2 className="w-10 h-10 text-secondary animate-spin" />
        </div>
     );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-secondary"/> Acceso DateNova
          </h2>
          {error && <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">{error}</div>}
          <div className="space-y-4">
            <Input 
              label="Correo Electrónico" 
              placeholder="admin@datenova.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="mb-0" 
            />
            <Input 
              label="Contraseña" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mb-0" 
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={onExit} variant="outline" className="flex-1">Cancelar</Button>
            <Button onClick={handleLogin} className="flex-1" disabled={authLoading}>
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Entrar'}
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">Autenticación vía Supabase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 font-bold text-lg">
                <Rocket className="w-6 h-6" /> DateNova <span className="opacity-50 font-normal hidden sm:inline">| Admin Panel</span>
             </div>
             {/* System Status Pill */}
             <div className="hidden md:flex items-center gap-2 bg-emerald-900 px-3 py-1 rounded-full text-xs text-emerald-200 border border-emerald-700">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span>Connected to Supabase</span>
                <span className="w-px h-3 bg-emerald-600 mx-1"></span>
                <Cloud className="w-3 h-3" />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden md:block">{session.user.email}</span>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 py-1 px-3 text-xs h-8" onClick={handleLogout}>
              <LogOut className="w-3 h-3 mr-2" /> Salir
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Proyectos Recibidos</h1>
                <p className="text-slate-500 text-sm">Gestión de solicitudes de descubrimiento y arquitectura.</p>
            </div>
            <div className="flex gap-2">
                <div className="bg-white px-3 py-2 rounded border border-slate-200 text-slate-600 text-sm font-medium shadow-sm flex items-center gap-2">
                   <Activity className="w-4 h-4 text-secondary"/> Total: {projects.length}
                </div>
            </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-secondary animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700">Base de datos vacía</h3>
            <p className="text-slate-500 max-w-md mx-auto mt-1">
               No hay proyectos enviados aún en Supabase.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-secondary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-secondary transition-colors">
                        {p.projectName || 'Proyecto Sin Nombre'}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${p.status === 'submitted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.status === 'submitted' ? 'Recibido' : 'Borrador'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-3 line-clamp-1 max-w-2xl">
                     {p.problem ? `Problemática: ${p.problem}` : 'Sin descripción del problema.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Server className="w-3 h-3"/> {p.submissionDate || 'Sin fecha'}</span>
                    <span className="flex items-center gap-1"><Wifi className="w-3 h-3"/> {p.connectivity === 'online' ? '100% Online' : 'Offline First'}</span>
                    <span className="flex items-center gap-1">
                        {p.ecosystemPreference === 'google' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                        {p.ecosystemPreference === 'microsoft' && <span className="w-2 h-2 rounded-full bg-blue-700"></span>}
                        {p.ecosystemPreference === 'none' ? 'Sin Ecosistema' : p.ecosystemPreference === 'google' ? 'Google Workspace' : p.ecosystemPreference === 'microsoft' ? 'Microsoft 365' : 'AWS / Custom'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-end md:self-center">
                    <div className="text-right hidden md:block mr-2">
                        <div className="text-xs text-slate-400 font-medium uppercase">Entidades</div>
                        <div className="text-lg font-bold text-slate-700 leading-none">{p.entities?.length || 0}</div>
                    </div>
                    <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
                    <Button onClick={() => onLoadProject(p)} className="flex-shrink-0 h-10">
                    Ver Detalles <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// --- MAIN APP (Client Wizard) ---

function App() {
  const [view, setView] = useState<'landing' | 'client' | 'admin'>('landing');
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<DiscoveryData>(INITIAL_DATA);
  const [isReadOnly, setIsReadOnly] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize ID if not present
  useEffect(() => {
    if (view === 'client' && !data.id) {
       // We don't rely heavily on local storage ID now, but we generate one for internal reference
       // Supabase will eventually generate the real primary key
       const savedDraft = localStorage.getItem('currentDraft');
        if (savedDraft) {
            setData(JSON.parse(savedDraft));
        } else {
             // Generate temporary client-side ID
            setData(prev => ({ ...prev, id: uuidv4() }));
        }
    }
  }, [view]);

  // Simple local draft saving (fallback)
  useEffect(() => {
    if (view === 'client' && !isReadOnly && data.id) {
      localStorage.setItem('currentDraft', JSON.stringify(data));
    }
  }, [data, view, isReadOnly]);

  const updateData = (newData: Partial<DiscoveryData>) => {
    if (isReadOnly) return;
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
        const submittedData = {
          ...data,
          status: 'submitted' as const,
          submissionDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        };
        
        // Send to Supabase
        const result = await saveProjectToDB(submittedData);
        
        // Update local state with the returned data (which might have a new UUID from DB)
        if (result && result.content) {
             setData({ ...result.content, id: result.id, status: result.status });
        } else {
             setData(submittedData);
        }
        
        alert('¡Proyecto guardado en la nube de DateNova exitosamente!');
        localStorage.removeItem('currentDraft');
        setView('landing');
    } catch (error) {
        alert('Hubo un error al conectar con la base de datos. Por favor intente nuevamente.');
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const loadProjectForReview = (project: DiscoveryData) => {
    setData(project);
    setIsReadOnly(true);
    setView('client'); 
    setCurrentStep(0);
  };

  if (view === 'landing') return <LandingPage onStartClient={() => { setIsReadOnly(false); setData(INITIAL_DATA); setView('client'); }} onStartAdmin={() => setView('admin')} />;
  if (view === 'admin') return <AdminDashboard onExit={() => setView('landing')} onLoadProject={loadProjectForReview} />;

  // --- WIZARD UI ---
  
  const renderStep = () => {
    switch (currentStep) {
      case 0: return <VisionSection data={data} update={updateData} />;
      case 1: return <DataArchitectureSection data={data} update={updateData} />;
      case 2: return <ProcessFlowsSection data={data} update={updateData} />;
      case 3: return <TechnicalSection data={data} update={updateData} />;
      case 4: return <FinalDetailsSection data={data} update={updateData} />;
      case 5: return (
        <div className="space-y-6 animate-in fade-in">
          <div className="text-center py-10">
             <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
             <h2 className="text-3xl font-bold text-slate-800">
               {isReadOnly ? 'Revisión de Proyecto' : '¡Todo Listo!'}
             </h2>
             <p className="text-slate-600 mt-2 max-w-md mx-auto">
               {isReadOnly 
                  ? 'Estás visualizando los datos de este cliente en modo lectura.' 
                  : 'Has completado el discovery. La información se guardará de forma segura en nuestra nube.'}
             </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 max-h-[400px] overflow-y-auto font-mono text-xs text-slate-700 shadow-inner">
             <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>

          {!isReadOnly && (
            <div className="flex justify-center gap-4">
               <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 bg-secondary hover:bg-blue-700 px-8 py-3 text-lg shadow-lg shadow-blue-500/20 w-full md:w-auto justify-center">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cloud className="w-5 h-5" />}
                  {isSubmitting ? 'Guardando en Nube...' : 'Enviar a DateNova'}
               </Button>
            </div>
          )}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar / Stepper */}
      <aside className={`w-full md:w-64 flex-shrink-0 ${isReadOnly ? 'bg-slate-800' : 'bg-primary'} text-slate-300 transition-colors duration-500`}>
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 font-bold text-white text-lg">
             <span>{isReadOnly ? '🔒 Modo Admin' : '🚀 DateNova'}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{isReadOnly ? 'Revisando Proyecto' : 'Discovery Template'}</p>
        </div>
        <nav className="p-4 space-y-1">
          {STEPS.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-300 ${
                currentStep === idx 
                  ? 'bg-white/10 text-white font-medium border-l-4 border-secondary pl-3' 
                  : 'hover:bg-white/5'
              }`}
            >
               {idx < STEPS.length - 1 ? `${idx + 1}. ${step}` : step}
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t border-slate-700">
           <Button variant="outline" onClick={() => setView(isReadOnly ? 'admin' : 'landing')} className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs">
              <LogOut className="w-3 h-3 mr-2"/> {isReadOnly ? 'Volver al Dashboard' : 'Salir'}
           </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 h-screen overflow-y-auto flex flex-col">
        {isReadOnly && (
           <div className="bg-amber-50 text-amber-800 px-6 py-2 text-xs font-medium text-center border-b border-amber-100 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3"/> VISTA DE ADMINISTRADOR (SOLO LECTURA)
           </div>
        )}
        <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32 w-full flex-grow">
           {renderStep()}
        </div>
      </main>

      {/* Fixed Footer Navigation */}
      <div className={`fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-slate-200 p-4 px-8 flex justify-between items-center z-10 ${isReadOnly ? 'opacity-90' : ''}`}>
          <Button 
            variant="secondary" 
            onClick={prevStep} 
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </Button>

          <div className="text-xs text-slate-400 font-medium hidden md:block">
             Paso {currentStep + 1} de {STEPS.length}
          </div>

          <Button 
            onClick={nextStep} 
            disabled={currentStep === STEPS.length - 1}
             className="flex items-center gap-2"
          >
            {currentStep === STEPS.length - 1 ? (isReadOnly ? 'Finalizar Revisión' : 'Revisar Envío') : 'Siguiente'} 
            <ChevronRight className="w-4 h-4" />
          </Button>
      </div>
    </div>
  );
}

export default App;
