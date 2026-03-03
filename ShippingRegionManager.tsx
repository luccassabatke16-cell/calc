
import React, { useState } from 'react';
import { ShippingRegion } from '../types';
import { Plus, Trash2, MapPin, Package } from 'lucide-react';

interface ShippingRegionManagerProps {
  catalog: ShippingRegion[];
  setCatalog: (newCatalog: ShippingRegion[]) => void;
}

export const ShippingRegionManager: React.FC<ShippingRegionManagerProps> = ({ catalog, setCatalog }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Omit<ShippingRegion, 'id'>>({
    name: '',
    price: 0
  });

  const handleAddItem = () => {
    if (!newItem.name) return;
    const item: ShippingRegion = {
      ...newItem,
      id: crypto.randomUUID()
    };
    setCatalog([...catalog, item]);
    setNewItem({ name: '', price: 0 });
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
            <MapPin className="w-5 h-5 text-blue-600" />
            Regiões de Envio (Logística de EPIs)
          </h2>
          <p className="text-sm text-slate-500">Gerencie os custos de frete para envio de materiais por região.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4 inline mr-1" /> Nova Região
        </button>
      </div>

      {isAdding && (
        <div className="bg-blue-50 p-4 border-b border-blue-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-in fade-in slide-in-from-top-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-blue-900 mb-1">Nome da Região / Zona</label>
            <input
              type="text"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm"
              placeholder="Ex: Zona Norte, Grande Lisboa..."
            />
          </div>
          <div className="md:col-span-1 relative">
             <label className="block text-xs font-bold text-blue-900 mb-1">Custo de Envio (€)</label>
            <input
              type="number"
              min="0"
              value={newItem.price}
              onChange={e => setNewItem({ ...newItem, price: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm"
            />
          </div>
          
          <div className="md:col-span-1 flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 text-slate-600 hover:text-slate-800 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs">
            <tr>
              <th className="px-6 py-3">Região</th>
              <th className="px-6 py-3 text-right text-slate-600">Custo de Frete (€)</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {catalog.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-3 flex items-center gap-2 text-slate-800">
                    <Package className="w-4 h-4 text-slate-400" />
                    {item.name}
                </td>
                <td className="px-6 py-3 text-right text-slate-600">€ {item.price.toFixed(2)}</td>
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
                <td colSpan={3} className="px-6 py-8 text-center text-slate-400 italic">
                  Nenhuma região cadastrada. Adicione uma nova região acima.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
