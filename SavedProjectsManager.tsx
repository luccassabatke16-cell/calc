import React from 'react';
import { SavedProject } from '../types';
import { Trash2, FolderOpen, Calendar, FileText, AlertTriangle } from 'lucide-react';

interface SavedProjectsManagerProps {
  projects: SavedProject[];
  onLoad: (project: SavedProject) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
}

export const SavedProjectsManager: React.FC<SavedProjectsManagerProps> = ({ projects, onLoad, onDelete, onReset }) => {
  const formatCurrency = (val: number) => val.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-600" />
            Projetos Salvos
          </h2>
          <p className="text-sm text-slate-500">Gerencie seus cálculos de projetos anteriores.</p>
        </div>
        {projects.length > 0 && (
            <button 
                onClick={onReset}
                className="text-xs flex items-center gap-1 text-red-400 hover:text-red-600 px-3 py-1 rounded hover:bg-red-50 transition"
            >
                <AlertTriangle className="w-3 h-3" /> Limpar Tudo (Reset)
            </button>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Nenhum projeto salvo ainda.</p>
            <p className="text-sm">Salve um projeto na aba Calculadora para vê-lo aqui.</p>
          </div>
        )}

        {projects.map((project) => (
          <div key={project.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition">
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{project.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${project.results.netProfit >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {project.results.marginPercent.toFixed(1)}% Margem
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <Calendar className="w-3 h-3" />
                Salvo em: {new Date(project.savedAt).toLocaleDateString()} às {new Date(project.savedAt).toLocaleTimeString().slice(0,5)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receita:</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(project.results.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lucro Líquido:</span>
                  <span className={`font-semibold ${project.results.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(project.results.netProfit)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 pt-4 border-t border-slate-200">
               <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition"
              >
                <Trash2 className="w-4 h-4" /> Excluir
              </button>
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onLoad(project);
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium transition shadow-sm"
              >
                <FileText className="w-4 h-4" /> Carregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};