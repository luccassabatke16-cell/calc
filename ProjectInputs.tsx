import React, { useState } from 'react';
import { ProjectData, ServiceItem, ServiceCatalogItem, PPECatalogItem, ProjectPPE, ShippingRegion, AccommodationItem, TransportItem } from '../types';
import { Plus, Trash2, Briefcase, Truck, HardHat, DollarSign, Calendar, Clock, MapPin, Home, Car } from 'lucide-react';

interface ProjectInputsProps {
  data: ProjectData;
  onChange: (newData: ProjectData) => void;
  serviceCatalog: ServiceCatalogItem[];
  ppeCatalog: PPECatalogItem[];
  regionCatalog: ShippingRegion[];
  calculatedDuration: number;
  calculatedDurationMonths: number;
  calculatedRevenue?: number;
}

export const ProjectInputs: React.FC<ProjectInputsProps> = ({ 
    data, 
    onChange, 
    serviceCatalog, 
    ppeCatalog, 
    regionCatalog, 
    calculatedDuration,
    calculatedDurationMonths,
    calculatedRevenue = 0
}) => {
  
  const updateField = <K extends keyof ProjectData>(field: K, value: ProjectData[K]) => {
    onChange({ ...data, [field]: value });
  };

  // --- Service Logic ---
  const handleServiceChange = (id: string, field: keyof ServiceItem, value: any) => {
    const newServices = data.services.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    );
    updateField('services', newServices);
  };

  const handleCatalogSelection = (id: string, catalogId: string) => {
    const catalogItem = serviceCatalog.find(i => i.id === catalogId);
    if (catalogItem) {
        const newServices = data.services.map(s => 
            s.id === id ? { 
              ...s, 
              name: catalogItem.name, 
              unitPrice: catalogItem.defaultPrice,
              unitCost: catalogItem.defaultCost,
            } : s
        );
        updateField('services', newServices);
    }
  };

  const addService = () => {
    const newService: ServiceItem = {
      id: crypto.randomUUID(),
      name: '',
      itemCount: 1,
      weeklyHours: 40,
      unitPrice: 0,
      unitCost: 0,
    };
    updateField('services', [...data.services, newService]);
  };

  const removeService = (id: string) => {
    updateField('services', data.services.filter(s => s.id !== id));
  };

  const getServiceTotalHours = (service: ServiceItem) => {
      const weeks = calculatedDuration / 7;
      return (service.itemCount * service.weeklyHours * weeks).toFixed(1);
  };

  // --- PPE Logic ---
  const addPPE = () => {
    const newPPE: ProjectPPE = {
        id: crypto.randomUUID(),
        name: '',
        quantity: 1,
        unitCost: 0
    };
    updateField('selectedPPEs', [...data.selectedPPEs, newPPE]);
  };

  const removePPE = (id: string) => {
      updateField('selectedPPEs', data.selectedPPEs.filter(p => p.id !== id));
  };

  const handlePPECatalogSelection = (id: string, catalogId: string) => {
      const catalogItem = ppeCatalog.find(i => i.id === catalogId);
      if (catalogItem) {
          const newPPEs = data.selectedPPEs.map(p => 
              p.id === id ? { ...p, name: catalogItem.name, unitCost: catalogItem.unitCost } : p
          );
          updateField('selectedPPEs', newPPEs);
      }
  };

  const handlePPEChange = (id: string, field: keyof ProjectPPE, value: string | number) => {
      const newPPEs = data.selectedPPEs.map(p => 
          p.id === id ? { ...p, [field]: value } : p
      );
      updateField('selectedPPEs', newPPEs);
  };

  // --- Accommodation Logic ---
  const addAccommodation = () => {
      const newAcc: AccommodationItem = {
          id: crypto.randomUUID(),
          name: '',
          type: 'monthly_fixed',
          cost: 0,
          quantity: 1,
          days: calculatedDuration // Default to project duration
      };
      updateField('accommodations', [...data.accommodations, newAcc]);
  };

  const removeAccommodation = (id: string) => {
      updateField('accommodations', data.accommodations.filter(a => a.id !== id));
  };

  const handleAccommodationChange = (id: string, field: keyof AccommodationItem, value: any) => {
      const newAccs = data.accommodations.map(a => 
          a.id === id ? { ...a, [field]: value } : a
      );
      updateField('accommodations', newAccs);
  };

  const getAccommodationTotal = (acc: AccommodationItem) => {
      if (acc.type === 'monthly_fixed') {
          // Monthly rent / 30 * days
          return (acc.cost / 30) * acc.days;
      } else {
          // Daily * People * Days
          return acc.cost * acc.quantity * acc.days;
      }
  };

  // --- Transport Logic ---
  const addTransport = () => {
      const newTrans: TransportItem = {
          id: crypto.randomUUID(),
          name: '',
          type: 'vehicle_rent_split',
          cost: 0,
          quantity: 1,
          days: calculatedDuration
      };
      updateField('transports', [...(data.transports || []), newTrans]);
  };

  const removeTransport = (id: string) => {
      updateField('transports', data.transports.filter(t => t.id !== id));
  };

  const handleTransportChange = (id: string, field: keyof TransportItem, value: any) => {
      const newTrans = data.transports.map(t => 
          t.id === id ? { ...t, [field]: value } : t
      );
      updateField('transports', newTrans);
  };

  const getTransportDetails = (t: TransportItem) => {
      if (t.type === 'daily_allowance') {
          const total = t.cost * t.quantity * t.days;
          return {
              totalCost: total,
              costPerPerson: total / Math.max(1, t.quantity),
              dailyPerPerson: t.cost,
              carsNeeded: 0
          };
      } else {
          // Vehicle Rent Split
          const carsNeeded = Math.ceil(t.quantity / 5);
          const monthlyTotal = carsNeeded * t.cost;
          const dailyTotal = monthlyTotal / 30;
          const projectTotal = dailyTotal * t.days;
          const companyShare = projectTotal * 0.5;
          const workerShare = projectTotal * 0.5;

          return {
              totalCost: companyShare, // What the company pays
              costPerPerson: workerShare / Math.max(1, t.quantity), // What each worker pays (total over project)
              dailyPerPerson: (workerShare / Math.max(1, t.quantity)) / Math.max(1, t.days),
              carsNeeded
          };
      }
  };

  const selectedRegionPrice = regionCatalog.find(r => r.id === data.selectedRegionId)?.price || 0;
  const totalEmployees = data.services.reduce((acc, curr) => acc + curr.itemCount, 0);

  return (
    <div className="space-y-6 pb-20">
      
      {/* General Info & Dates */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Detalhes do Projeto
        </h3>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Projeto</label>
                <input
                type="text"
                value={data.projectName}
                onChange={(e) => updateField('projectName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Data Início</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            value={data.startDate}
                            onChange={(e) => updateField('startDate', e.target.value)}
                            className="w-full pl-9 pr-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Data Fim</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            value={data.endDate}
                            min={data.startDate}
                            onChange={(e) => updateField('endDate', e.target.value)}
                            className="w-full pl-9 pr-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium">
                <Clock className="w-4 h-4" />
                <span>Duração: {calculatedDuration} dias ({calculatedDurationMonths.toFixed(1)} meses)</span>
            </div>
        </div>
      </div>

      {/* Services (Revenue & Cost) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Serviços & Mão de Obra
          </h3>
          <button 
            onClick={addService}
            className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Plus className="w-4 h-4" /> Add Serviço
          </button>
        </div>
        <div className="space-y-4">
          {data.services.map((service) => (
            <div key={service.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
              
              {/* Row 1: Selection & Name */}
              <div className="grid grid-cols-1 gap-2">
                 <select 
                    className="w-full text-sm border-slate-300 rounded-md py-1.5 focus:ring-indigo-500 focus:border-indigo-500 text-slate-600"
                    onChange={(e) => handleCatalogSelection(service.id, e.target.value)}
                    value="" 
                 >
                    <option value="" disabled selected={!service.name}>Carregar do Catálogo...</option>
                    {serviceCatalog.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                 </select>
                 <input
                  type="text"
                  value={service.name}
                  onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                  placeholder="Ou digite o nome do serviço..."
                  className="w-full bg-white px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Row 2: Quantities */}
              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-0.5">Nº Itens/Pessoas</label>
                    <input
                    type="number"
                    min="1"
                    value={service.itemCount}
                    onChange={(e) => handleServiceChange(service.id, 'itemCount', Number(e.target.value))}
                    className="w-full bg-white px-2 py-1.5 border border-slate-300 rounded text-right text-sm focus:border-indigo-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-0.5">Horas/Semana (por item)</label>
                    <input
                    type="number"
                    min="0"
                    value={service.weeklyHours}
                    onChange={(e) => handleServiceChange(service.id, 'weeklyHours', Number(e.target.value))}
                    className="w-full bg-white px-2 py-1.5 border border-slate-300 rounded text-right text-sm focus:border-indigo-500 outline-none"
                    />
                    <div className="text-[10px] text-indigo-600 font-medium text-right mt-1">
                        Total Projeto: {getServiceTotalHours(service)}h
                    </div>
                 </div>
              </div>

              {/* Row 3: Prices & Costs */}
              <div className="grid grid-cols-2 gap-3">
                
                <div className="col-span-1">
                    <label className="block text-[10px] text-emerald-600 uppercase font-bold mb-0.5">Venda (€/h)</label>
                    <div className="relative">
                        <span className="absolute left-2 top-1.5 text-xs text-slate-400">€</span>
                        <input
                        type="number"
                        min="0"
                        value={service.unitPrice}
                        onChange={(e) => handleServiceChange(service.id, 'unitPrice', Number(e.target.value))}
                        className="w-full bg-white pl-6 pr-2 py-1.5 border border-emerald-200 rounded text-right text-sm focus:border-emerald-500 outline-none text-emerald-700 font-medium"
                        />
                    </div>
                </div>

                <div className="col-span-1">
                    <label className="block text-[10px] text-rose-500 uppercase font-bold mb-0.5">
                        Custo (€/h)
                    </label>
                    <div className="relative">
                        <span className="absolute left-2 top-1.5 text-xs text-slate-400">€</span>
                        <input
                            type="number"
                            min="0"
                            value={service.unitCost}
                            onChange={(e) => handleServiceChange(service.id, 'unitCost', Number(e.target.value))}
                            className="w-full pl-6 pr-2 py-1.5 border rounded text-right text-sm outline-none font-medium bg-white text-rose-700 border-rose-200 focus:border-rose-500"
                        />
                    </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                <span className="text-xs text-slate-400">
                    Lucro Item: <span className="font-semibold text-slate-600">€ {((service.unitPrice - service.unitCost) * Number(getServiceTotalHours(service))).toFixed(0)}</span>
                </span>
                <button 
                onClick={() => removeService(service.id)}
                className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded transition"
                >
                <Trash2 className="w-3 h-3" /> Remover
                </button>
              </div>
            </div>
          ))}
          {data.services.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4 italic">Nenhum serviço adicionado.</p>
          )}
        </div>
      </div>

       {/* PPE & Materials */}
       <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <HardHat className="w-5 h-5 text-yellow-600" />
            EPIs & Materiais
          </h3>
          <button 
            onClick={addPPE}
            className="text-sm flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
        <div className="space-y-3">
             {data.selectedPPEs.map((ppe) => (
                <div key={ppe.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded border border-slate-200">
                    <div className="col-span-6">
                        <select 
                            className="w-full text-xs border-slate-300 rounded mb-1 focus:ring-yellow-500 focus:border-yellow-500"
                            onChange={(e) => handlePPECatalogSelection(ppe.id, e.target.value)}
                            value=""
                        >
                            <option value="" disabled selected={!ppe.name}>Carregar EPI...</option>
                            {ppeCatalog.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (€ {p.unitCost})</option>
                            ))}
                        </select>
                        <input 
                            type="text" 
                            value={ppe.name}
                            onChange={(e) => handlePPEChange(ppe.id, 'name', e.target.value)}
                            placeholder="Nome do Item"
                            className="w-full text-sm border-slate-300 rounded px-2 py-1"
                        />
                    </div>
                    <div className="col-span-2">
                         <label className="text-[10px] text-slate-400 uppercase font-bold">Qtd</label>
                         <input 
                            type="number"
                            min="1"
                            value={ppe.quantity}
                            onChange={(e) => handlePPEChange(ppe.id, 'quantity', Number(e.target.value))}
                            className="w-full text-sm border-slate-300 rounded px-2 py-1 text-right"
                         />
                    </div>
                    <div className="col-span-3">
                         <label className="text-[10px] text-slate-400 uppercase font-bold">Custo Unit (€)</label>
                         <input 
                            type="number"
                            min="0"
                            value={ppe.unitCost}
                            onChange={(e) => handlePPEChange(ppe.id, 'unitCost', Number(e.target.value))}
                            className="w-full text-sm border-slate-300 rounded px-2 py-1 text-right text-rose-600 font-medium"
                         />
                    </div>
                    <div className="col-span-1 flex justify-end">
                        <button onClick={() => removePPE(ppe.id)} className="text-slate-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
             ))}
             {data.selectedPPEs.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4 italic">Nenhum EPI/Material adicionado.</p>
             )}

             {/* Region Shipping Selection */}
             <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    Região de Envio dos EPIs
                </label>
                <div className="flex items-center gap-3">
                    <select 
                        value={data.selectedRegionId}
                        onChange={(e) => updateField('selectedRegionId', e.target.value)}
                        className="flex-1 text-sm border-slate-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione a região de envio...</option>
                        {regionCatalog.map(region => (
                            <option key={region.id} value={region.id}>
                                {region.name} (+ €{region.price.toFixed(2)} / pessoa)
                            </option>
                        ))}
                    </select>
                    {selectedRegionPrice > 0 && (
                        <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap border border-blue-100">
                            € {(selectedRegionPrice * totalEmployees).toFixed(2)}
                            <span className="block text-[9px] font-normal text-blue-500 text-right">(Total)</span>
                        </div>
                    )}
                </div>
                <p className="text-xs text-slate-400 mt-1 pl-1">
                    * O custo de envio será multiplicado pelo número total de trabalhadores ({totalEmployees}).
                </p>
             </div>
        </div>
      </div>


      {/* Logistics Expenses */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-6">
          
          {/* Accommodation */}
          <div>
            <div className="flex justify-between items-center mb-4">
                 <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <Home className="w-5 h-5 text-orange-600" />
                    Alojamento
                </h3>
                <button 
                    onClick={addAccommodation}
                    className="text-sm flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
                >
                    <Plus className="w-4 h-4" /> Add Alojamento
                </button>
            </div>
            
            <div className="space-y-4">
                {data.accommodations.map((acc) => {
                    const totalCost = getAccommodationTotal(acc);
                    return (
                    <div key={acc.id} className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 space-y-3">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={acc.name}
                                    onChange={(e) => handleAccommodationChange(acc.id, 'name', e.target.value)}
                                    placeholder="Nome do local (ex: Casa do Centro)"
                                    className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-sm outline-none focus:border-orange-500"
                                />
                                <select
                                    value={acc.type}
                                    onChange={(e) => handleAccommodationChange(acc.id, 'type', e.target.value)}
                                    className="text-xs bg-white border border-slate-300 rounded px-2 outline-none focus:border-orange-500"
                                >
                                    <option value="monthly_fixed">Aluguel Mensal (Fixo)</option>
                                    <option value="daily_per_person">Diária (Por Pessoa)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                             <div>
                                <label className="block text-[10px] text-slate-500 uppercase font-bold mb-0.5">
                                    {acc.type === 'monthly_fixed' ? 'Valor Mensal (€)' : 'Valor Diária (€)'}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={acc.cost}
                                    onChange={(e) => handleAccommodationChange(acc.id, 'cost', Number(e.target.value))}
                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm text-right"
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] text-slate-500 uppercase font-bold mb-0.5">Nº Pessoas</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={acc.quantity}
                                    onChange={(e) => handleAccommodationChange(acc.id, 'quantity', Number(e.target.value))}
                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm text-right"
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] text-slate-500 uppercase font-bold mb-0.5">Dias</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={acc.days}
                                    onChange={(e) => handleAccommodationChange(acc.id, 'days', Number(e.target.value))}
                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm text-right"
                                />
                             </div>
                        </div>

                        <div className="flex justify-between items-start pt-2 border-t border-orange-200/50">
                             <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-500 font-medium">
                                    Custo Total Item: <span className="text-orange-700 font-bold">€ {totalCost.toFixed(2)}</span>
                                </span>
                                
                                <div className="flex flex-col text-[10px] text-slate-400">
                                    <span>
                                        Custo Diário (Global): € { (acc.type === 'monthly_fixed' ? (acc.cost/30) : (acc.cost * acc.quantity)).toFixed(2) }
                                    </span>
                                    {acc.type === 'monthly_fixed' && (
                                        <span>
                                            Custo Mensal p/ Pessoa: € {(acc.cost / Math.max(1, acc.quantity)).toFixed(2)}
                                        </span>
                                    )}
                                    <span className="font-semibold text-orange-600 bg-orange-50 px-1 rounded w-fit mt-0.5">
                                        Custo Diário p/ Pessoa: € { (acc.type === 'monthly_fixed' ? ((acc.cost/30)/Math.max(1, acc.quantity)) : acc.cost).toFixed(2) }
                                    </span>
                                </div>
                             </div>
                             <button onClick={() => removeAccommodation(acc.id)} className="text-red-400 hover:text-red-600 mt-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )})}
                 {data.accommodations.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-2 italic">Nenhum alojamento cadastrado.</p>
                 )}
            </div>
          </div>

          {/* Transport */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <Truck className="w-5 h-5 text-sky-600" />
                    Transporte
                </h3>
                <button 
                    onClick={addTransport}
                    className="text-sm flex items-center gap-1 text-sky-600 hover:text-sky-700 font-medium"
                >
                    <Plus className="w-4 h-4" /> Add Transporte
                </button>
            </div>
            
            <div className="space-y-4">
                {(data.transports || []).map((trans) => {
                    const details = getTransportDetails(trans);
                    
                    return (
                    <div key={trans.id} className="bg-sky-50/50 p-3 rounded-lg border border-sky-100 space-y-3">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={trans.name}
                                    onChange={(e) => handleTransportChange(trans.id, 'name', e.target.value)}
                                    placeholder="Nome (ex: Carro Equipe A)"
                                    className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-sm outline-none focus:border-sky-500"
                                />
                                <select
                                    value={trans.type}
                                    onChange={(e) => handleTransportChange(trans.id, 'type', e.target.value)}
                                    className="text-xs bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-sky-500"
                                >
                                    <option value="daily_allowance">Ajuda de Custo (Diária)</option>
                                    <option value="vehicle_rent_split">Locação Veículo (50/50)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                             <div>
                                <label className="block text-[10px] text-slate-500 uppercase font-bold mb-0.5">
                                    {trans.type === 'daily_allowance' ? 'Valor Diário (€)' : 'Aluguel Mensal Carro (€)'}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={trans.cost}
                                    onChange={(e) => handleTransportChange(trans.id, 'cost', Number(e.target.value))}
                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm text-right"
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] text-slate-500 uppercase font-bold mb-0.5">Nº Pessoas</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={trans.quantity}
                                    onChange={(e) => handleTransportChange(trans.id, 'quantity', Number(e.target.value))}
                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm text-right"
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] text-slate-500 uppercase font-bold mb-0.5">Dias</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={trans.days}
                                    onChange={(e) => handleTransportChange(trans.id, 'days', Number(e.target.value))}
                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm text-right"
                                />
                             </div>
                        </div>

                        <div className="flex justify-between items-start pt-2 border-t border-sky-200/50">
                             <div className="flex flex-col gap-1 w-full">
                                <div className="flex justify-between items-center w-full pr-4">
                                     <span className="text-xs text-slate-500 font-medium">
                                        Custo Empresa: <span className="text-sky-700 font-bold">€ {details.totalCost.toFixed(2)}</span>
                                        {trans.type === 'vehicle_rent_split' && <span className="text-[10px] text-slate-400 font-normal ml-1">(50% do total)</span>}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <div className="flex flex-col text-[10px] text-slate-500 bg-white p-1 rounded border border-slate-100">
                                         <span>Custo p/ Pessoa (Total):</span>
                                         <span className="font-bold text-slate-700">€ {details.costPerPerson.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col text-[10px] text-slate-500 bg-white p-1 rounded border border-slate-100">
                                         <span>Custo p/ Pessoa (Dia):</span>
                                         <span className="font-bold text-slate-700">€ {details.dailyPerPerson.toFixed(2)}</span>
                                    </div>
                                </div>

                                {trans.type === 'vehicle_rent_split' && (
                                    <div className="flex items-center gap-1 text-[10px] text-sky-600 mt-1">
                                        <Car className="w-3 h-3" />
                                        <span>Necessários: <b>{details.carsNeeded}</b> carros (até 5 pax/carro)</span>
                                    </div>
                                )}
                             </div>
                             <button onClick={() => removeTransport(trans.id)} className="text-red-400 hover:text-red-600 mt-1 ml-2">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )})}
                 {(data.transports || []).length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-2 italic">Nenhum transporte cadastrado.</p>
                 )}
            </div>
          </div>
        </div>
    </div>
  );
};