import React, { useState, useMemo, useEffect } from 'react';
import { ProjectInputs } from './components/ProjectInputs';
import { Dashboard } from './components/Dashboard';
import { GeminiAnalysis } from './components/GeminiAnalysis';
import { ServiceCatalogManager } from './components/ServiceCatalogManager';
import { PPECatalogManager } from './components/PPECatalogManager';
import { ShippingRegionManager } from './components/ShippingRegionManager';
import { SavedProjectsManager } from './components/SavedProjectsManager';
import { ProjectData, FinancialResults, ServiceCatalogItem, PPECatalogItem, ShippingRegion, AccommodationItem, SavedProject } from './types';
import { Calculator, LayoutGrid, Settings, HardHat, MapPin, Download, FileText, Save, FolderOpen, Users, Upload, X } from 'lucide-react';

// Dados Iniciais do Catálogo (Valores em Euro)
const INITIAL_SERVICE_CATALOG: ServiceCatalogItem[] = [
  { id: 'aislador', name: 'Aislador Termicos / Aislador Trazador', defaultPrice: 30, defaultCost: 15, category: 'Isolamento' },
  { id: 'ayudante', name: 'Ayudante', defaultPrice: 27, defaultCost: 15, category: 'Apoio' },
  { id: 'cald_mont', name: 'Calderero / Montador', defaultPrice: 30, defaultCost: 15, category: 'Caldeiraria' },
  { id: 'cald_elec', name: 'Calderero / Soldador Electrodo', defaultPrice: 30, defaultCost: 15, category: 'Caldeiraria' },
  { id: 'cald_mig', name: 'Calderero / Soldador MIG-MAG', defaultPrice: 30, defaultCost: 15, category: 'Caldeiraria' },
  { id: 'cald_tig', name: 'Calderero / Soldador TIG', defaultPrice: 35, defaultCost: 15, category: 'Caldeiraria' },
  { id: 'cald_fab', name: 'Calderero de fabricación', defaultPrice: 31, defaultCost: 15, category: 'Caldeiraria' },
  { id: 'elect', name: 'Electricista', defaultPrice: 30, defaultCost: 15, category: 'Elétrica' },
  { id: 'electromec', name: 'Electromecánico', defaultPrice: 35, defaultCost: 15, category: 'Mecânica' },
  { id: 'enc_elec', name: 'Encargado electricista', defaultPrice: 33, defaultCost: 15, category: 'Gestão' },
  { id: 'enc_sold', name: 'Encargado soldadura', defaultPrice: 33, defaultCost: 15, category: 'Gestão' },
  { id: 'enc_tub', name: 'Encargado tubería', defaultPrice: 33, defaultCost: 15, category: 'Gestão' },
  { id: 'fres_cnc', name: 'Fresador CNC', defaultPrice: 31, defaultCost: 15, category: 'Usinagem' },
  { id: 'granalla', name: 'Granalladores (Arenadores)', defaultPrice: 30, defaultCost: 15, category: 'Tratamento' },
  { id: 'ing_cal', name: 'Ingeniero de Calidad / Ingeniero de Soldadura', defaultPrice: 38, defaultCost: 15, category: 'Engenharia' },
  { id: 'insp_qaqc', name: 'Inspectores de Calidad de Soldadura QA/QC', defaultPrice: 33, defaultCost: 15, category: 'Qualidade' },
  { id: 'mec_ind', name: 'Mecánico Industrial', defaultPrice: 30, defaultCost: 15, category: 'Mecânica' },
  { id: 'mec_mont', name: 'Mecánico Montador', defaultPrice: 30, defaultCost: 15, category: 'Mecânica' },
  { id: 'mont_elec', name: 'Montador / Armador soldadura Electrodo', defaultPrice: 30, defaultCost: 15, category: 'Montagem' },
  { id: 'mont_mig', name: 'Montador / Armador soldadura MIG', defaultPrice: 30, defaultCost: 15, category: 'Montagem' },
  { id: 'mont_tig', name: 'Montador / Armador soldadura TIG', defaultPrice: 30, defaultCost: 15, category: 'Montagem' },
  { id: 'mont_estr_obra', name: 'Montador de estructura metálica (OBRA)', defaultPrice: 30, defaultCost: 15, category: 'Estruturas' },
  { id: 'mont_estr_taller', name: 'Montador de estructura metálica (TALLER)', defaultPrice: 30, defaultCost: 15, category: 'Estruturas' },
  { id: 'pintores', name: 'Pintores', defaultPrice: 28, defaultCost: 15, category: 'Pintura' },
  { id: 'sold_3p', name: 'Soldador 3P (SMAW, GMAW y TIG)', defaultPrice: 30, defaultCost: 15, category: 'Soldadura' },
  { id: 'sold_mig', name: 'Soldador MIG-MAG', defaultPrice: 30, defaultCost: 15, category: 'Soldadura' },
  { id: 'sold_mig_elec', name: 'Soldador MIG-MAG / Electrodo', defaultPrice: 31, defaultCost: 15, category: 'Soldadura' },
  { id: 'sold_mig_tig', name: 'Soldador MIG-MAG / TIG', defaultPrice: 30, defaultCost: 15, category: 'Soldadura' },
  { id: 'sold_orbital', name: 'Soldador ORBITAL', defaultPrice: 35, defaultCost: 15, category: 'Soldadura Esp.' },
  { id: 'sold_plast', name: 'Soldador PLÁSTICO', defaultPrice: 35, defaultCost: 15, category: 'Soldadura Esp.' },
  { id: 'sold_saw', name: 'Soldador SAW (Arco-Sumergido)', defaultPrice: 31, defaultCost: 15, category: 'Soldadura Esp.' },
  { id: 'sold_smaw', name: 'Soldador SMAW (Electrodo Revestida)', defaultPrice: 30, defaultCost: 15, category: 'Soldadura' },
  { id: 'sold_tig', name: 'Soldador TIG', defaultPrice: 30, defaultCost: 15, category: 'Soldadura' },
  { id: 'sold_tig_inox', name: 'Soldador TIG (Inoxidable/Aluminio)', defaultPrice: 33, defaultCost: 15, category: 'Soldadura Esp.' },
  { id: 'sold_tig_elec', name: 'Soldador TIG / Electrodo', defaultPrice: 30, defaultCost: 15, category: 'Soldadura' },
  { id: 'sold_tig_mont', name: 'Soldador TIG / Montador', defaultPrice: 31, defaultCost: 15, category: 'Soldadura' },
  { id: 'torn_cnc', name: 'Tornero CNC', defaultPrice: 31, defaultCost: 15, category: 'Usinagem' },
  { id: 'torn_cnc_fres', name: 'Tornero CNC / Fresador y todo CNC', defaultPrice: 31, defaultCost: 15, category: 'Usinagem' },
  { id: 'torn_conv', name: 'Tornero Convencional (Torno manual)', defaultPrice: 30, defaultCost: 15, category: 'Usinagem' },
  { id: 'tuberos', name: 'Tuberos', defaultPrice: 30, defaultCost: 15, category: 'Tubulação' },
  { id: 'frigorista', name: 'Frigorista', defaultPrice: 33, defaultCost: 15, category: 'Climatização' },
];

const INITIAL_PPE_CATALOG: PPECatalogItem[] = [
    { id: 'ppe_camisa', name: 'Camisa', unitCost: 16.92 },
    { id: 'ppe_pantalon', name: 'Calça (Pantalón)', unitCost: 10.95 },
    { id: 'ppe_casco', name: 'Capacete (Casco)', unitCost: 2.93 },
    { id: 'ppe_chaleco', name: 'Colete Refletivo', unitCost: 1.17 },
    { id: 'ppe_gafas', name: 'Óculos de Proteção', unitCost: 1.82 },
    { id: 'ppe_tapao', name: 'Protetor Auricular', unitCost: 4.51 },
    { id: 'ppe_guant_c', name: 'Luvas Curtas', unitCost: 8.59 },
    { id: 'ppe_guant_l', name: 'Luvas Longas', unitCost: 9.92 },
    { id: 'ppe_delantal', name: 'Avental de Soldador', unitCost: 1.58 },
    { id: 'ppe_manga', name: 'Manga de Soldador', unitCost: 0.90 },
];

const INITIAL_REGIONS: ShippingRegion[] = [
    { id: 'reg_araba', name: 'Araba/Álava', price: 10.00 },
    { id: 'reg_albacete', name: 'Albacete', price: 10.00 },
    { id: 'reg_alicante', name: 'Alicante', price: 10.00 },
    { id: 'reg_almeria', name: 'Almería', price: 10.00 },
    { id: 'reg_avila', name: 'Ávila', price: 10.00 },
    { id: 'reg_badajoz', name: 'Badajoz', price: 12.00 },
    { id: 'reg_balears', name: 'Balears - (isla)', price: 40.00 },
    { id: 'reg_barcelona', name: 'Barcelona', price: 8.00 },
    { id: 'reg_burgos', name: 'Burgos', price: 10.00 },
    { id: 'reg_caceres', name: 'Cáceres', price: 12.00 },
    { id: 'reg_cadiz', name: 'Cádiz', price: 12.00 },
    { id: 'reg_castellon', name: 'Castellón', price: 8.00 },
    { id: 'reg_ciudadreal', name: 'Ciudad Real', price: 10.00 },
    { id: 'reg_cordoba', name: 'Córdoba', price: 12.00 },
    { id: 'reg_acoruna', name: 'A Coruña', price: 12.00 },
    { id: 'reg_cuenca', name: 'Cuenca', price: 8.00 },
    { id: 'reg_gerona', name: 'Gerona', price: 8.00 },
    { id: 'reg_granada', name: 'Granada', price: 12.00 },
    { id: 'reg_guadalajara', name: 'Guadalajara', price: 10.00 },
    { id: 'reg_gipuzkoa', name: 'Gipuzkoa', price: 10.00 },
    { id: 'reg_huelva', name: 'Huelva', price: 12.00 },
    { id: 'reg_huesca', name: 'Huesca', price: 8.00 },
    { id: 'reg_jaen', name: 'Jaén', price: 10.00 },
    { id: 'reg_leon', name: 'León', price: 12.00 },
    { id: 'reg_lleida', name: 'Lleida/Lérida', price: 8.00 },
    { id: 'reg_larioja', name: 'La Rioja', price: 10.00 },
    { id: 'reg_lugo', name: 'Lugo', price: 12.00 },
    { id: 'reg_madrid', name: 'Madrid', price: 10.00 },
    { id: 'reg_malaga', name: 'Málaga', price: 12.00 },
    { id: 'reg_murcia', name: 'Murcia', price: 10.00 },
    { id: 'reg_navarra', name: 'Navarra', price: 8.00 },
    { id: 'reg_ourense', name: 'Ourense', price: 12.00 },
    { id: 'reg_asturias', name: 'Asturias', price: 12.00 },
    { id: 'reg_palencia', name: 'Palencia', price: 10.00 },
    { id: 'reg_laspalmas', name: 'Las Palmas - (isla)', price: 40.00 },
    { id: 'reg_pontevedra', name: 'Pontevedra', price: 12.00 },
    { id: 'reg_salamanca', name: 'Salamanca', price: 12.00 },
    { id: 'reg_tenerife', name: 'Tenerife - (isla)', price: 40.00 },
    { id: 'reg_cantabria', name: 'Cantabria', price: 10.00 },
    { id: 'reg_segovia', name: 'Segovia', price: 10.00 },
    { id: 'reg_sevilla', name: 'Sevilla', price: 12.00 },
    { id: 'reg_soria', name: 'Soria', price: 8.00 },
    { id: 'reg_tarragona', name: 'Tarragona', price: 8.00 },
    { id: 'reg_teruel', name: 'Teruel', price: 8.00 },
    { id: 'reg_toledo', name: 'Toledo', price: 10.00 },
    { id: 'reg_valencia', name: 'Valencia', price: 8.00 },
    { id: 'reg_valladolid', name: 'Valladolid', price: 10.00 },
    { id: 'reg_bizkaia', name: 'Bizkaia/Vizcaya', price: 10.00 },
    { id: 'reg_zamora', name: 'Zamora', price: 10.00 },
    { id: 'reg_zaragoza', name: 'Zaragoza', price: 8.00 },
    { id: 'reg_ceuta', name: 'Ceuta - (ferry)', price: 40.00 },
    { id: 'reg_melilla', name: 'Melilla - (ferry)', price: 40.00 },
];

const getToday = () => new Date().toISOString().split('T')[0];
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const INITIAL_DATA: ProjectData = {
  projectName: 'Projeto Exemplo Indústria',
  startDate: getToday(),
  endDate: getFutureDate(30), // 1 Mês padrão
  companyLogo: undefined,
  commercialCommissionPercent: 1, // 1% de comissão padrão
  contractSettings: {
    baseMonthlySalary: 870, // Valor padrão inicial
  },
  services: [
    { id: '1', name: 'Soldador TIG', itemCount: 2, weeklyHours: 40, unitPrice: 30, unitCost: 15 },
    { id: '2', name: 'Ayudante', itemCount: 2, weeklyHours: 40, unitPrice: 27, unitCost: 15 },
    { id: '3', name: 'Tuberos', itemCount: 2, weeklyHours: 40, unitPrice: 30, unitCost: 15 },
  ],
  selectedPPEs: [
      { id: '101', name: 'Calça (Pantalón)', quantity: 6, unitCost: 10.95 },
      { id: '102', name: 'Luvas Curtas', quantity: 12, unitCost: 8.59 }
  ],
  selectedRegionId: 'reg_madrid',
  accommodations: [
      { id: 'acc1', name: 'Casa Equipe Técnica', type: 'monthly_fixed', cost: 1200, quantity: 4, days: 30 },
      { id: 'acc2', name: 'Hotel (Supervisores)', type: 'daily_per_person', cost: 45, quantity: 2, days: 10 }
  ],
  transports: [
      { id: 'tr1', name: 'Carrinha Equipe', type: 'vehicle_rent_split', cost: 600, quantity: 6, days: 30 }
  ],
};

const generateId = () => {
    // Robust ID generation with timestamp to ensure uniqueness even if crypto fails
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

type Tab = 'calculator' | 'catalog_services' | 'catalog_ppe' | 'catalog_regions' | 'saved_projects';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [projectData, setProjectData] = useState<ProjectData>(INITIAL_DATA);
  
  // Persistence Logic for Saved Projects
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
      try {
          const saved = localStorage.getItem('profitCalc_savedProjects');
          const parsed = saved ? JSON.parse(saved) : [];
          // Ensure it is always an array to prevent crashes
          return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
          console.error("Failed to load saved projects", e);
          return [];
      }
  });

  useEffect(() => {
      try {
        localStorage.setItem('profitCalc_savedProjects', JSON.stringify(savedProjects));
      } catch (e) {
        console.error("Failed to save to localStorage", e);
      }
  }, [savedProjects]);

  const [serviceCatalog, setServiceCatalog] = useState<ServiceCatalogItem[]>(INITIAL_SERVICE_CATALOG);
  const [ppeCatalog, setPpeCatalog] = useState<PPECatalogItem[]>(INITIAL_PPE_CATALOG);
  const [regionCatalog, setRegionCatalog] = useState<ShippingRegion[]>(INITIAL_REGIONS);
  const [isExporting, setIsExporting] = useState(false);

  const updateBaseSalary = (newSalary: number) => {
    setProjectData(prev => ({
        ...prev,
        contractSettings: {
            ...prev.contractSettings,
            baseMonthlySalary: newSalary
        }
    }));
  };

  const updateCommissionPercent = (newPercent: number) => {
      setProjectData(prev => ({ ...prev, commercialCommissionPercent: newPercent }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectData(prev => ({ ...prev, companyLogo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportPDF = () => {
      setIsExporting(true);
      const element = document.getElementById('report-section');
      const opt = {
          margin: [10, 10, 10, 10],
          filename: `${projectData.projectName.replace(/\s+/g, '_')}_Relatorio.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // @ts-ignore
      if (window.html2pdf) {
          // @ts-ignore
          window.html2pdf().set(opt).from(element).save().then(() => {
              setIsExporting(false);
          });
      } else {
          alert('Biblioteca de PDF não carregada. Tente novamente em instantes.');
          setIsExporting(false);
      }
  };

  // Derive calculations automatically
  const financialResults: FinancialResults = useMemo(() => {
    // 0. Duration Calc
    const start = new Date(projectData.startDate);
    const end = new Date(projectData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start date
    const durationWeeks = durationDays / 7;
    const durationMonths = durationDays / 30; // Aproximação para custo mensal

    // 1. Revenue & Base Labor Cost (Hourly production)
    let totalRevenue = 0;
    let servicesDirectCost = 0;
    let totalEmployees = 0;

    projectData.services.forEach(service => {
        const totalHours = service.itemCount * service.weeklyHours * durationWeeks;
        
        // Count employees/items
        totalEmployees += service.itemCount;

        // Revenue
        totalRevenue += totalHours * service.unitPrice;

        // Base Labor Cost (Hourly rate * Hours) -> Pagamento direto pelas horas
        servicesDirectCost += totalHours * service.unitCost;
    });

    // 2. Fixed Contract Taxes Calculation
    // Pega o valor configurado pelo usuário ou usa 0 se estiver vazio (embora o input seja number)
    const BASE_CONTRACT_VALUE = projectData.contractSettings?.baseMonthlySalary || 870;
    
    // Calcula a base tributável total do projeto: 
    // (Valor Base * Nº Funcionários * Duração em Meses)
    const totalTaxableBase = BASE_CONTRACT_VALUE * totalEmployees * durationMonths;

    // TSU: 23.75% sobre contrato base
    const socialSecurityCost = totalTaxableBase * 0.2375;
    
    // Seguro: 1.00% sobre contrato base
    const insuranceCost = totalTaxableBase * 0.0100;
    
    // Subsídio Natal: 1/12 (aprox 8.33%) sobre contrato base
    const christmasBonusCost = totalTaxableBase * (1/12);

    // 3. Shipping Cost
    const shippingBasePrice = regionCatalog.find(r => r.id === projectData.selectedRegionId)?.price || 0;
    // Shipping cost is now per employee/person
    const shippingCost = shippingBasePrice * totalEmployees;

    // 4. Logistics (Accommodation + Transport + Shipping)
    
    // Calculate Accommodation List
    const accommodationCost = (projectData.accommodations || []).reduce((acc, item) => {
        if (item.type === 'monthly_fixed') {
            // Custo Fixo Mensal: (Valor Mensal / 30) * Dias de Uso
            const dailyRate = item.cost / 30;
            return acc + (dailyRate * item.days);
        } else {
            // Diária por Pessoa: Valor Diária * Pessoas * Dias
            return acc + (item.cost * item.quantity * item.days);
        }
    }, 0);

    // Calculate Transport List
    const transportCost = (projectData.transports || []).reduce((acc, item) => {
        if (item.type === 'daily_allowance') {
            // Ajuda de custo Diária: Valor * Pessoas * Dias
            return acc + (item.cost * item.quantity * item.days);
        } else if (item.type === 'vehicle_rent_split') {
            // Locação Veículo:
            // 1. Quantos carros necessários? 1 carro para cada 5 pessoas.
            const carsNeeded = Math.ceil(item.quantity / 5);
            
            // 2. Custo total do aluguel proporcional aos dias
            const monthlyTotal = carsNeeded * item.cost;
            const dailyTotal = monthlyTotal / 30;
            const projectDurationCost = dailyTotal * item.days;
            
            // 3. A empresa paga 50%
            return acc + (projectDurationCost * 0.5);
        }
        return acc;
    }, 0);

    const logisticsCost = accommodationCost + transportCost + shippingCost;
    
    // PPE/Material Cost Calculation
    const materialCost = (projectData.selectedPPEs || []).reduce((sum, item) => {
        return sum + (item.quantity * item.unitCost);
    }, 0);

    // 5. Commercial Commission
    const commissionCost = totalRevenue * ((projectData.commercialCommissionPercent || 0) / 100);
    
    // Subtotal
    const totalCost = servicesDirectCost + socialSecurityCost + insuranceCost + christmasBonusCost + logisticsCost + materialCost + commissionCost;
    
    // 6. Profit
    const netProfit = totalRevenue - totalCost;
    const marginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const roiPercent = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    return {
      durationDays: Math.max(1, durationDays),
      durationMonths,
      totalEmployees,
      baseSalary: BASE_CONTRACT_VALUE,
      totalRevenue,
      servicesDirectCost,
      socialSecurityCost,
      insuranceCost,
      christmasBonusCost,
      commissionCost,
      materialCost,
      shippingCost,
      accommodationCost,
      transportCost,
      logisticsCost,
      totalCost,
      netProfit,
      marginPercent,
      roiPercent
    };
  }, [projectData, regionCatalog]);

  const handleSaveProject = () => {
    const newSavedProject: SavedProject = {
      id: generateId(),
      name: projectData.projectName,
      savedAt: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(projectData)), // Deep copy
      results: { ...financialResults }
    };
    setSavedProjects(prev => [newSavedProject, ...prev]);
    alert('Projeto salvo com sucesso! Você pode acessá-lo na aba "Projetos Salvos".');
  };

  const handleLoadProject = (saved: SavedProject) => {
    // No confirmation needed for better UX, or keep it simple
    // SAFE MERGE: Ensure new fields exist even if missing in saved data
    const safeProjectData: ProjectData = {
        ...INITIAL_DATA,
        ...saved.data,
        companyLogo: saved.data.companyLogo, // Restore logo
        contractSettings: {
            ...INITIAL_DATA.contractSettings,
            ...(saved.data.contractSettings || {})
        },
        services: saved.data.services || [],
        accommodations: saved.data.accommodations || [],
        transports: saved.data.transports || [],
        selectedPPEs: saved.data.selectedPPEs || [],
    };
    
    setProjectData(JSON.parse(JSON.stringify(safeProjectData)));
    setActiveTab('calculator');
  };

  const handleDeleteProject = (id: string) => {
      setSavedProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleResetStorage = () => {
      if (window.confirm("Isso apagará TODOS os projetos salvos e corrigirá erros de armazenamento. Continuar?")) {
          setSavedProjects([]);
          localStorage.removeItem('profitCalc_savedProjects');
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block mr-4">ProfitCalc Pro</h1>
            
            {/* Logo Uploader */}
             <div className="flex items-center">
                  {projectData.companyLogo ? (
                      <div className="relative group">
                          <img src={projectData.companyLogo} alt="Company Logo" className="h-10 w-auto object-contain bg-white border border-slate-100 rounded p-0.5" />
                          <button 
                              onClick={() => setProjectData(prev => ({ ...prev, companyLogo: undefined }))}
                              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600"
                              title="Remover Logo"
                          >
                              <X className="w-3 h-3" />
                          </button>
                      </div>
                  ) : (
                      <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 border border-dashed border-slate-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition text-slate-400 text-xs">
                          <Upload className="w-3 h-3" />
                          <span className="hidden sm:inline font-medium">Add Logo</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                  )}
              </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
              <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-none">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap ${
                    activeTab === 'calculator' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Calculadora</span>
                </button>
                <button
                  onClick={() => setActiveTab('saved_projects')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap ${
                    activeTab === 'saved_projects' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Salvos</span>
                  {savedProjects.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-600 text-xs px-1.5 rounded-full">{savedProjects.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('catalog_services')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap ${
                    activeTab === 'catalog_services' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Serviços</span>
                </button>
                <button
                  onClick={() => setActiveTab('catalog_ppe')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap ${
                    activeTab === 'catalog_ppe' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <HardHat className="w-4 h-4" />
                  <span className="hidden sm:inline">EPIs</span>
                </button>
                <button
                  onClick={() => setActiveTab('catalog_regions')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap ${
                    activeTab === 'catalog_regions' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Regiões</span>
                </button>
              </nav>

              {activeTab === 'calculator' && (
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 bg-indigo-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-800 transition shadow-sm disabled:opacity-70 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    {isExporting ? 'Gerando...' : 'Exportar PDF'}
                  </button>
              )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'calculator' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Inputs */}
            <div className="w-full lg:w-5/12 xl:w-5/12">
              <div className="sticky top-24">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Dados de Entrada</h2>
                <ProjectInputs 
                  data={projectData} 
                  onChange={setProjectData} 
                  serviceCatalog={serviceCatalog}
                  ppeCatalog={ppeCatalog}
                  regionCatalog={regionCatalog}
                  calculatedDuration={financialResults.durationDays}
                  calculatedDurationMonths={financialResults.durationMonths}
                  calculatedRevenue={financialResults.totalRevenue}
                />
              </div>
            </div>

            {/* Right Column: Results & Analysis (Printable Area) */}
            <div className="w-full lg:w-7/12 xl:w-7/12">
               <div id="report-section" className="space-y-8 bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative">
                   {/* Report Header (Visible primarily in PDF but looks good in UI too) */}
                   <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col-reverse sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-6 h-6 text-indigo-600" />
                                <h1 className="text-2xl font-bold text-slate-800">{projectData.projectName}</h1>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                                <div>
                                    <span className="font-semibold block">Período:</span>
                                    {new Date(projectData.startDate).toLocaleDateString()} a {new Date(projectData.endDate).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="font-semibold block">Duração / Equipe:</span>
                                    {financialResults.durationDays} dias / {financialResults.totalEmployees} colaboradores
                                </div>
                            </div>
                        </div>
                        {projectData.companyLogo && (
                            <div className="flex-shrink-0">
                                <img src={projectData.companyLogo} alt="Company Logo" className="h-20 object-contain max-w-[200px]" />
                            </div>
                        )}
                   </div>

                   <div>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Resumo Financeiro</h2>
                    <Dashboard 
                        results={financialResults} 
                        onUpdateBaseSalary={updateBaseSalary}
                        commissionPercent={projectData.commercialCommissionPercent}
                        onUpdateCommission={updateCommissionPercent}
                    />
                   </div>

                   {/* Detailed Resource Summary for Report */}
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
                            <Users className="w-4 h-4 text-slate-500" /> Resumo de Recursos e Escopo
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="py-2 pl-2">Serviço / Profissional</th>
                                        <th className="py-2 text-center">Qtd</th>
                                        <th className="py-2 text-right pr-2">Total Horas (Projeto)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {projectData.services.map(service => (
                                        <tr key={service.id}>
                                            <td className="py-2 pl-2 font-medium text-slate-700">{service.name || 'Sem nome'}</td>
                                            <td className="py-2 text-center text-slate-600">{service.itemCount}</td>
                                            <td className="py-2 text-right pr-2 text-slate-600">
                                                {((financialResults.durationDays / 7) * service.weeklyHours * service.itemCount).toFixed(0)}h
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-100 font-semibold">
                                        <td className="py-2 pl-2 text-slate-800">TOTAL EQUIPE</td>
                                        <td className="py-2 text-center text-indigo-600">{financialResults.totalEmployees}</td>
                                        <td className="py-2 text-right pr-2 text-indigo-600">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                   </div>
                   
                   {/* Save Button */}
                   <div className="flex justify-end pt-4 border-t border-slate-100" data-html2canvas-ignore="true">
                      <button 
                        onClick={handleSaveProject}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-sm"
                      >
                        <Save className="w-4 h-4" /> Salvar Projeto
                      </button>
                   </div>

                   <div>
                      <GeminiAnalysis data={projectData} results={financialResults} />
                   </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'saved_projects' && (
           <div className="max-w-5xl mx-auto">
              <SavedProjectsManager 
                projects={savedProjects} 
                onLoad={handleLoadProject} 
                onDelete={handleDeleteProject}
                onReset={handleResetStorage}
              />
              {savedProjects.length > 0 && (
                <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-700 flex items-center gap-3">
                  <Download className="w-5 h-5" />
                  <div>
                    <strong>Como gerar PDF de um projeto salvo?</strong>
                    <p className="opacity-80">Clique em "Carregar" no projeto desejado para abri-lo na Calculadora. Em seguida, use o botão "Exportar PDF" no topo da página.</p>
                  </div>
                </div>
              )}
           </div>
        )}

        {activeTab === 'catalog_services' && (
          <div className="max-w-4xl mx-auto">
             <ServiceCatalogManager catalog={serviceCatalog} setCatalog={setServiceCatalog} />
          </div>
        )}

        {activeTab === 'catalog_ppe' && (
          <div className="max-w-4xl mx-auto">
             <PPECatalogManager catalog={ppeCatalog} setCatalog={setPpeCatalog} />
          </div>
        )}

        {activeTab === 'catalog_regions' && (
            <div className="max-w-4xl mx-auto">
                <ShippingRegionManager catalog={regionCatalog} setCatalog={setRegionCatalog} />
            </div>
        )}

      </main>
    </div>
  );
};

export default App;