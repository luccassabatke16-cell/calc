import React from 'react';
import { FinancialResults } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { Percent } from 'lucide-react';

interface DashboardProps {
  results: FinancialResults;
  onUpdateBaseSalary: (val: number) => void;
  commissionPercent: number;
  onUpdateCommission: (val: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ results, onUpdateBaseSalary, commissionPercent, onUpdateCommission }) => {
  const costData = [
    { name: 'Mão de Obra', value: results.servicesDirectCost, color: '#ec4899' }, // Pink
    { name: 'Encargos', value: results.socialSecurityCost + results.insuranceCost + results.christmasBonusCost, color: '#6366f1' }, // Indigo
    { name: 'Logística', value: results.logisticsCost, color: '#f97316' }, // Orange
    { name: 'EPIs/Mat.', value: results.materialCost, color: '#eab308' }, // Yellow
    { name: 'Comissão', value: results.commissionCost, color: '#14b8a6' }, // Teal
  ].filter(item => item.value > 0);

  const profitData = [
    { name: 'Custo Total', amount: results.totalCost },
    { name: 'Receita', amount: results.totalRevenue },
  ];

  // Using pt-PT for Euro formatting with Portuguese conventions
  const formatCurrency = (val: number) => val.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight="bold">
        {formatCurrency(value)}
      </text>
    ) : null;
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase">Receita Total</p>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(results.totalRevenue)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase">Custo Total</p>
          <p className="text-2xl font-bold text-rose-600">{formatCurrency(results.totalCost)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase">Lucro Líquido</p>
          <p className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(results.netProfit)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase">Margem</p>
          <p className={`text-2xl font-bold ${results.marginPercent >= 20 ? 'text-emerald-600' : 'text-yellow-600'}`}>
            {results.marginPercent.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Commercial Commission Config */}
      <div className="bg-teal-50 rounded-xl p-4 border border-teal-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
                    <Percent className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-teal-900">Comissão Comercial</h4>
                    <p className="text-xs text-teal-600">Configurar porcentagem sobre a Receita Bruta</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-teal-200 shadow-sm">
                    <label className="text-xs font-bold text-slate-500 uppercase">Porcentagem:</label>
                    <div className="flex items-center">
                        <input 
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={commissionPercent}
                            onChange={(e) => onUpdateCommission(Number(e.target.value))}
                            className="w-16 text-sm font-bold text-teal-700 outline-none text-right bg-transparent border-b border-transparent focus:border-teal-500"
                        />
                        <span className="text-sm font-bold text-teal-700 ml-1">%</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 font-medium uppercase">Valor Comissão</span>
                    <span className="text-lg font-bold text-teal-700">{formatCurrency(results.commissionCost)}</span>
                </div>
            </div>
      </div>

      {/* Tax Breakdown Section */}
      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
            <h4 className="text-sm font-bold text-indigo-900">Detalhamento de Encargos Trabalhistas</h4>
            
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-indigo-200">
                <label className="text-[10px] text-indigo-600 font-bold uppercase tracking-wide">Salário Base (€):</label>
                <input 
                    type="number"
                    min="0"
                    value={results.baseSalary}
                    onChange={(e) => onUpdateBaseSalary(Number(e.target.value))}
                    className="w-20 text-sm font-bold text-indigo-900 outline-none text-right border-b border-dashed border-indigo-300 focus:border-indigo-600 bg-transparent"
                />
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex flex-col justify-between bg-white p-2 rounded border border-indigo-100">
                <span className="text-xs text-slate-500 mb-1">Seg. Social (23.75%)</span>
                <span className="font-semibold text-indigo-700">{formatCurrency(results.socialSecurityCost)}</span>
            </div>
            <div className="flex flex-col justify-between bg-white p-2 rounded border border-indigo-100">
                <span className="text-xs text-slate-500 mb-1">Seguro Acid. (1.00%)</span>
                <span className="font-semibold text-indigo-700">{formatCurrency(results.insuranceCost)}</span>
            </div>
            <div className="flex flex-col justify-between bg-white p-2 rounded border border-indigo-100">
                <span className="text-xs text-slate-500 mb-1">Subsídio Natal (1/12)</span>
                <span className="font-semibold text-indigo-700">{formatCurrency(results.christmasBonusCost)}</span>
            </div>
        </div>
        <p className="text-[10px] text-indigo-400 mt-2 text-center md:text-right italic">
            * Valores calculados sobre o Salário Base (definido acima) por funcionário ({results.totalEmployees} func.), independente das horas de produção.
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cost Structure */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <h4 className="text-sm font-semibold text-slate-700 mb-4 text-center">Composição de Custos</h4>
          {results.totalCost > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  isAnimationActive={false}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Adicione custos para visualizar
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs mt-2">
            {costData.map(item => (
              <div key={item.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profit vs Cost */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <h4 className="text-sm font-semibold text-slate-700 mb-4 text-center">Visão Geral de Rentabilidade</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `€${val/1000}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={50} isAnimationActive={false}>
                {profitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Receita' ? '#10b981' : '#f43f5e'} />
                ))}
                <LabelList dataKey="amount" position="top" formatter={(val: number) => `€ ${val.toLocaleString('pt-PT', { maximumFractionDigits: 0})}`} style={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};