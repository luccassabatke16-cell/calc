

export interface ServiceItem {
  id: string;
  name: string;
  itemCount: number; // Quantidade de pessoas ou itens
  weeklyHours: number; // Horas por semana por item
  unitPrice: number; // Preço de Venda por Hora
  
  // Costing Mode
  unitCost: number;  // Usado se costMode == 'hourly'
}

export interface ServiceCatalogItem {
  id: string;
  name: string;
  defaultPrice: number;
  defaultCost: number;
  category: string;
}

export interface PPECatalogItem {
  id: string;
  name: string;
  unitCost: number;
}

export interface ProjectPPE {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

export interface ShippingRegion {
  id: string;
  name: string;
  price: number; // Custo do frete em Euro
}

export type AccommodationType = 'monthly_fixed' | 'daily_per_person';

export interface AccommodationItem {
    id: string;
    name: string;
    type: AccommodationType;
    cost: number; // Valor Mensal (se fixed) OU Valor Diária (se daily)
    quantity: number; // Nº de Pessoas
    days: number; // Duração em dias
}

export type TransportType = 'daily_allowance' | 'vehicle_rent_split';

export interface TransportItem {
    id: string;
    name: string;
    type: TransportType;
    cost: number; // Se allowance: valor diário por pessoa. Se rent: valor mensal do carro.
    quantity: number; // Nº de Pessoas utilizando
    days: number; // Duração em dias
}

export interface ProjectData {
  projectName: string;
  companyLogo?: string; // Base64 string da logo
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  commercialCommissionPercent: number; // Porcentagem de comissão sobre receita
  
  contractSettings: {
      baseMonthlySalary: number; 
  };

  // Revenue & Labor
  services: ServiceItem[];
  
  // Materials / PPEs
  selectedPPEs: ProjectPPE[];
  selectedRegionId: string; // ID da região de envio selecionada
  
  // Logistics
  accommodations: AccommodationItem[]; // Lista de alojamentos
  transports: TransportItem[]; // Lista de transportes
}

export interface FinancialResults {
  durationDays: number;
  durationMonths: number;
  totalEmployees: number; // Total de cabeças/itens
  baseSalary: number; // Salário base utilizado para cálculos
  totalRevenue: number;
  servicesDirectCost: number; // Mão de obra Base (Horas)
  socialSecurityCost: number; // 23.75% TSU sobre base
  insuranceCost: number; // 1% Seguro sobre base
  christmasBonusCost: number; // 1/12 sobre base
  commissionCost: number; // Custo da comissão comercial
  materialCost: number; // Soma dos EPIs
  shippingCost: number; // Custo de envio da região
  accommodationCost: number; // Custo total alojamento
  transportCost: number; // Custo total transporte
  logisticsCost: number; // Transport + Accommodation + Shipping
  totalCost: number;
  netProfit: number;
  marginPercent: number;
  roiPercent: number;
}

export interface SavedProject {
  id: string;
  name: string;
  savedAt: string; // ISO String date
  data: ProjectData;
  results: FinancialResults;
}