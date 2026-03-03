
import React, { useState } from 'react';
import { ServiceCatalogItem } from '../types';
import { Plus, Trash2, Edit2, Save, X, Database } from 'lucide-react';

interface ServiceCatalogManagerProps {
  catalog: ServiceCatalogItem[];
  setCatalog: (newCatalog: ServiceCatalogItem[]) => void;
}

export const ServiceCatalogManager: React.FC<ServiceCatalogManagerProps> = ({ catalog, setCatalog }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Omit<ServiceCatalogItem, 'id'>>({
    name: '',
    category: 'Geral',
    defaultPrice: 0,
    defaultCost: 0
  });

  const handleAddItem = () => {
    if (!newItem.name) return;
    const item: ServiceCatalogItem = {
      ...newItem,
      id: crypto.randomUUID()
    };
    setCatalog([...catalog, item]);
    setNewItem({ name: '', category: 'Geral', defaultPrice: 0, defaultCost: 0 });
    setIsAdding(false);
  };

  const handleDeleteItem = (id: string) => {
    setCatalog(catalog.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Banco de Dados de Serviços
          </h2>
          <p className="text-sm text-slate-500">Gerencie os preços padrão por hora e custos de mão de obra.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4 inline mr-1" /> Novo Serviço
        </button>
      </div>

      {isAdding && (
        <div className="bg-indigo-50 p-4 border-b border-indigo-100 grid grid-cols-1 md:grid-cols-5 gap-4 items-end animate-in fade-in slide-in-from-top-2">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-indigo-900 mb-1">Categoria</label>
            <input
              type="text"
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm"
              placeholder="Ex: TI, Obras..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-indigo-900 mb-1">Nome do Serviço</label>
            <input
              type="text"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm"
              placeholder="Nome do serviço"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-indigo-900 mb-1">Venda (€/h)</label>
            <input
              type="number"
              value={newItem.defaultPrice}
              onChange={e => setNewItem({ ...newItem, defaultPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm"
            />
          </div>
          <div className="md:col-span-1 relative">
             <label className="block text-xs font-bold text-indigo-900 mb-1">Custo (€/h)</label>
            <input
              type="number"
              value={newItem.defaultCost}
              onChange={e => setNewItem({ ...newItem, defaultCost: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm"
            />
          </div>
          
          <div className="md:col-span-5 flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 text-slate-600 hover:text-slate-800 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
            >
              Salvar Item
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs">
            <tr>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Serviço</th>
              <th className="px-6 py-3 text-right text-emerald-600">Preço Venda (€/h)</th>
              <th className="px-6 py-3 text-right text-rose-600">Custo (€/h)</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {catalog.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-3 font-medium text-slate-600">{item.category}</td>
                <td className="px-6 py-3 text-slate-800">{item.name}</td>
                <td className="px-6 py-3 text-right text-slate-600">€ {item.defaultPrice.toFixed(2)}</td>
                <td className="px-6 py-3 text-right text-slate-600">€ {item.defaultCost.toFixed(2)}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {catalog.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">
                  Nenhum serviço cadastrado. Adicione um novo item acima.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
