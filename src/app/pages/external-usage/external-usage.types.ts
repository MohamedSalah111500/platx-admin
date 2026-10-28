export interface ExternalUsageRates {
  currency: string;
  whatsAppPerMessage: number;
  aiPerRequest: number;
  r2PerGbMonth: number;
  bunnyStoragePerGbMonth: number;
  bunnyStreamingPerGb: number;
  bunnyStreamingFactor: number;
}

export interface ExternalUsageService {
  key: string;
  unit: string;
  quantity: number;
  rate: number;
  cost: number;
  isStock: boolean;
  isEstimate: boolean;
}

export interface ExternalUsageRow {
  tenantId: string;
  title: string;
  isActive: boolean;
  whatsAppSent: number;
  whatsAppFailed: number;
  whatsAppFreeQuota: number;
  aiRequests: number;
  r2Gb: number;
  bunnyGb: number;
  bunnyStreamingGb: number;
  accountedStorageGb: number;
  whatsAppCost: number;
  aiCost: number;
  r2Cost: number;
  bunnyCost: number;
  bunnyStreamingCost: number;
  totalCost: number;
}

export interface ExternalUsageResult {
  days: number;
  generatedAt: string;
  rates: ExternalUsageRates;
  whatsAppSent: number;
  whatsAppFailed: number;
  whatsAppFreeQuota: number;
  aiRequests: number;
  r2Gb: number;
  bunnyGb: number;
  bunnyStreamingGb: number;
  totalCost: number;
  services: ExternalUsageService[];
  tenants: ExternalUsageRow[];
}
