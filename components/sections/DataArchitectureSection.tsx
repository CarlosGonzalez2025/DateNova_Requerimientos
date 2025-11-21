import React from 'react';
import { DiscoveryData, Entity, EntityAttribute } from '../../types';
import { Input, SectionHeader, Button, IconButton } from '../ui/Common';
import { Plus, Trash2, Database, Layers } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  data: DiscoveryData;
  update: (data: Partial<DiscoveryData>) => void;
}

const DataArchitectureSection: React.FC<Props> = ({ data, update }) => {
  
  const addEntity = () => {
    const newEntity: Entity = {
      id: uuidv4(),
      name: '',
      attributes: []
    };
    update({ entities: [...data.entities, newEntity] });
  };

  const removeEntity = (id: string) => {
    update({ entities: data.entities.filter(e => e.id !== id) });
  };

  const updateEntityName = (id: string, name: string) => {
    const newEntities = data.entities.map(e => e.id === id ? { ...e, name } : e);
    update({ entities: newEntities });
  };

  const addAttribute = (entityId: string) => {
    const newAttr: EntityAttribute = {
      id: uuidv4(),
      name: '',
      type: 'Texto',
      required: true,
      validations: '',
      source: 'Usuario'
    };
    const newEntities = data.entities.map(e => 
      e.id === entityId ? { ...e, attributes: [...e.attributes, newAttr] } : e
    );
    update({ entities: newEntities });
  };

  const removeAttribute = (entityId: string, attrId: string) => {
    const newEntities = data.entities.map(e => 
      e.id === entityId ? { ...e, attributes: e.attributes.filter(a => a.id !== attrId) } : e
    );
    update({ entities: newEntities });
  };

  const updateAttribute = (entityId: string, attrId: string, field: keyof EntityAttribute, value: any) => {
    const newEntities = data.entities.map(e => 
      e.id === entityId ? { 
        ...e, 
        attributes: e.attributes.map(a => a.id === attrId ? { ...a, [field]: value } : a) 
      } : e
    );
    update({ entities: newEntities });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionHeader 
        title="2. Arquitectura de Datos (Entidades)" 
        description="Liste los 'Objetos de Negocio'. No piense en pantallas, piense en datos (Ej: Pedidos, Clientes, Productos)."
      />

      {data.entities.map((entity, index) => (
        <div key={entity.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center flex-1 gap-3">
              <Database className="text-secondary w-5 h-5" />
              <input 
                className="bg-transparent font-semibold text-lg text-slate-800 focus:outline-none focus:border-b-2 focus:border-secondary w-full max-w-xs"
                placeholder={`Nombre Entidad ${index + 1} (Ej: Clientes)`}
                value={entity.name}
                onChange={(e) => updateEntityName(entity.id, e.target.value)}
              />
            </div>
            <IconButton icon={<Trash2 className="w-5 h-5 text-red-500" />} onClick={() => removeEntity(entity.id)} />
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 font-medium">
                <tr>
                  <th className="px-3 py-2 rounded-l-md">Campo / Atributo</th>
                  <th className="px-3 py-2">Tipo de Dato</th>
                  <th className="px-3 py-2 text-center">Obligatorio</th>
                  <th className="px-3 py-2">Validaciones</th>
                  <th className="px-3 py-2">Origen (Quién)</th>
                  <th className="px-3 py-2 rounded-r-md w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entity.attributes.map(attr => (
                  <tr key={attr.id}>
                    <td className="p-2">
                      <input 
                        className="w-full border-slate-300 rounded p-1 text-sm focus:ring-1 focus:ring-secondary" 
                        placeholder="Ej: Estado"
                        value={attr.name}
                        onChange={(e) => updateAttribute(entity.id, attr.id, 'name', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <select 
                        className="w-full border-slate-300 rounded p-1 text-sm bg-white"
                        value={attr.type}
                        onChange={(e) => updateAttribute(entity.id, attr.id, 'type', e.target.value)}
                      >
                        <option value="Texto">Texto</option>
                        <option value="Número">Número</option>
                        <option value="Moneda">Moneda</option>
                        <option value="Fecha">Fecha</option>
                        <option value="Archivo">Archivo</option>
                        <option value="Booleano">Booleano (Si/No)</option>
                        <option value="Lista">Lista Desplegable</option>
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-secondary focus:ring-secondary"
                        checked={attr.required}
                        onChange={(e) => updateAttribute(entity.id, attr.id, 'required', e.target.checked)}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        className="w-full border-slate-300 rounded p-1 text-sm" 
                        placeholder="Ej: > 0, Único"
                        value={attr.validations}
                        onChange={(e) => updateAttribute(entity.id, attr.id, 'validations', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        className="w-full border-slate-300 rounded p-1 text-sm" 
                        placeholder="Ej: Usuario/Sistema"
                        value={attr.source}
                        onChange={(e) => updateAttribute(entity.id, attr.id, 'source', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <button onClick={() => removeAttribute(entity.id, attr.id)} className="text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="outline" onClick={() => addAttribute(entity.id)} className="mt-3 text-xs w-full border-dashed">
              <Plus className="w-4 h-4 mr-2" /> Agregar Campo a {entity.name || 'Entidad'}
            </Button>
          </div>
        </div>
      ))}

      <Button onClick={addEntity} className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-secondary hover:bg-slate-50 text-slate-500 font-semibold">
        <Plus className="w-5 h-5 mr-2" /> Agregar Nueva Entidad Principal
      </Button>
    </div>
  );
};

export default DataArchitectureSection;