import React from 'react';
import { DiscoveryData } from '../../types';
import { Input, TextArea, SectionHeader, useAiHelper } from '../ui/Common';

interface Props {
  data: DiscoveryData;
  update: (data: Partial<DiscoveryData>) => void;
}

const VisionSection: React.FC<Props> = ({ data, update }) => {
  const handleChange = (field: keyof DiscoveryData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    update({ [field]: e.target.value });
  };

  const updateField = (field: keyof DiscoveryData) => (val: string) => {
    update({ [field]: val });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <SectionHeader 
        title="1. Visión del Producto y Alcance (MVP)" 
        description="Definamos qué es el éxito para la primera versión. Evite términos técnicos si no está seguro."
      />

      <div className="grid grid-cols-1 gap-6">
        <Input 
          label="Nombre del Proyecto" 
          placeholder="Ej: Portal de Autogestión" 
          value={data.projectName} 
          onChange={handleChange('projectName')}
          onAiAssist={useAiHelper(updateField('projectName'), "Nombre creativo para el proyecto", "Visión")}
        />

        <TextArea 
          label="Problemática a Resolver (The Why)" 
          placeholder="¿Qué dolor de negocio estamos curando? Ej: Procesos manuales lentos..."
          value={data.problem}
          onChange={handleChange('problem')}
          onAiAssist={useAiHelper(updateField('problem'), "Problemática a resolver", "Visión")}
        />

        <TextArea 
          label="Objetivo del MVP" 
          placeholder="¿Qué debe hacer esta primera versión para ser funcional?"
          value={data.mvpObjective}
          onChange={handleChange('mvpObjective')}
          onAiAssist={useAiHelper(updateField('mvpObjective'), "Objetivo del MVP", "Visión")}
        />

        <Input 
          label="Usuarios (Arquetipos)" 
          placeholder="Ej: Vendedores, Administrador, Cliente Final" 
          value={data.users} 
          onChange={handleChange('users')}
          onAiAssist={useAiHelper(updateField('users'), "Arquetipos de usuario", "Visión")}
        />

        <TextArea 
          label="KPIs de Éxito" 
          placeholder="¿Cómo mediremos si funcionó? Ej: Reducir tiempo de 48h a 5 min."
          value={data.kpis}
          onChange={handleChange('kpis')}
          onAiAssist={useAiHelper(updateField('kpis'), "KPIs de éxito", "Visión")}
        />
      </div>
    </div>
  );
};

export default VisionSection;