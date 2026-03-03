import React, { useState } from 'react';
import { ProjectData, FinancialResults } from '../types';
import { analyzeProjectProfitability } from '../services/geminiService';
import { Sparkles, RefreshCw } from 'lucide-react';

interface GeminiAnalysisProps {
  data: ProjectData;
  results: FinancialResults;
}

export const GeminiAnalysis: React.FC<GeminiAnalysisProps> = ({ data, results }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeProjectProfitability(data, results);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl shadow-lg p-6 border border-indigo-700/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-100">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Consultor Financeiro IA
        </h3>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {analysis ? 'Reanalisar' : 'Analisar Projeto'}
        </button>
      </div>

      {!analysis && !loading && (
        <div className="text-indigo-200/60 text-sm italic border border-dashed border-indigo-700/50 rounded-lg p-4 text-center">
          Clique em analisar para obter uma avaliação de riscos e dicas de otimização do Gemini.
        </div>
      )}

      {loading && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-indigo-700/50 rounded w-3/4"></div>
          <div className="h-4 bg-indigo-700/50 rounded w-full"></div>
          <div className="h-4 bg-indigo-700/50 rounded w-5/6"></div>
        </div>
      )}

      {analysis && !loading && (
        <div className="prose prose-invert prose-sm max-w-none text-indigo-50">
           <div className="whitespace-pre-wrap font-light leading-relaxed">
             {analysis.split('\n').map((line, i) => {
               if (line.startsWith('**')) return <strong key={i} className="block mt-2 text-white">{line.replace(/\*\*/g, '')}</strong>;
               if (line.trim().startsWith('-')) return <li key={i} className="ml-4 text-indigo-200">{line.replace('-', '')}</li>;
               return <p key={i} className="mb-1">{line}</p>;
             })}
           </div>
        </div>
      )}
    </div>
  );
};