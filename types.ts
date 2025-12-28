
export enum SeverityLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum SafetyStatus {
  SAFE = 'Safe to Drive',
  CAUTION = 'Drive with Caution',
  STOP = 'Stop Immediately'
}

export enum DIYDifficulty {
  EASY = 'Easy (DIY)',
  MODERATE = 'Moderate',
  HARD = 'Professional Required'
}

export interface OBDCodeData {
  code: string;
  title: string;
  description: string;
  plainEnglish: string;
  symptoms: string[];
  causes: string[];
  severity: SeverityLevel;
  category: string;
  safetyStatus: SafetyStatus;
  repairCostEstimate: string;
  diyDifficulty: DIYDifficulty;
  similarCodes?: string[];
}

export interface SearchHistoryItem {
  code: string;
  timestamp: number;
  label?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface VinVehicleData {
  vin: string;
  year: string;
  make: string;
  model: string;
  manufacturer: string;
  vehicleType: string;
  bodyClass: string;
  engineCylinders: string;
  engineHP: string;
  engineLiters: string;
  fuelType: string;
  transmissionStyle: string;
  driveType: string;
  plantCountry: string;
  plantCity: string;
  plantState: string;
  doors: string;
  grossWeight: string;
}

export interface InsuranceFormData {
  zipCode: string;
  year: string;
  make: string;
  model: string;
  usage: 'commute' | 'pleasure' | 'business';
  annualMileage: string;
  ageGroup: '16-24' | '25-64' | '65+';
  drivingHistory: 'clean' | 'tickets' | 'accidents';
  creditTier: 'excellent' | 'good' | 'average' | 'poor';
  coverageLevel: 'state_min' | 'standard' | 'premium';
  deductible: '500' | '1000' | '2000';
}

export interface InsuranceEstimate {
  monthlyPremium: {
    min: number;
    max: number;
    avg: number;
  };
  score: 'great' | 'average' | 'expensive';
  factors: {
    label: string;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
  breakdown: {
    liability: number;
    collision: number;
    comprehensive: number;
  };
  aiAnalysis?: string;
}

export interface AffordabilityData {
  vehicle: {
    year: string;
    make: string;
    model: string;
    trim: string;
    zip: string;
  };
  finance: {
    monthlyIncome: string;
    monthlyDebt: string;
    creditScore: 'poor' | 'fair' | 'good' | 'excellent';
    downPayment: string;
    termMonths: number;
  };
}

export interface PredictionResult {
  marketValue: {
    low: number;
    high: number;
    fair: number;
    negotiationTarget: number;
  };
  affordability: {
    estimatedApr: number;
    monthlyPayment: number;
    dtiFrontEnd: number;
    dtiBackEnd: number;
    maxSafePayment: number;
    verdict: 'Affordable' | 'Stretch' | 'High Risk';
    verdictColor: string;
  };
  marketContext: string[];
}

export interface MaintenanceRequest {
  year: string;
  make: string;
  model: string;
  service: string;
  zip: string;
  quoteAmount?: string;
}

export interface MaintenanceResult {
  fairPrice: {
    low: number;
    high: number;
    average: number;
  };
  breakdown: {
    partsEst: { low: number; high: number };
    laborEst: { low: number; high: number };
    laborHours: { low: number; high: number };
    laborRate: number;
  };
  scorecard: {
    verdict: 'Fair Deal' | 'High End' | 'Overpriced' | 'Rip-Off' | 'Suspiciously Low';
    score: number;
    diffPercent: number;
  };
  aiAnalysis: string;
  negotiationTip: string;
}

export interface ValueRequest {
  year: string;
  make: string;
  model: string;
  trim: string;
  mileage: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface ValueResult {
  currentValue: {
    tradeIn: number;
    privateParty: number;
  };
  futureValue: {
    tradeIn: number;
    privateParty: number;
  };
  depreciation: {
    totalOneYear: number;
    perDay: number;
    percentDrop: number;
  };
  verdict: {
    status: 'Holding Strong' | 'Normal Depreciation' | 'Free Fall' | 'Money Pit';
    color: string;
    description: string;
  };
  marketFactors: string[];
}

export interface OwnershipRequest {
  carType: 'Sedan' | 'SUV' | 'Truck' | 'EV' | 'Hybrid';
  purchasePrice: string;
  zipCode: string;
  annualMiles: '5k' | '10k' | '15k' | '20k+';
  ownershipPeriod: '3 years' | '5 years';
}

export interface OwnershipResult {
  totalCost: number;
  monthlyAverage: number;
  breakdown: {
    depreciation: number;
    fuel: number;
    maintenance: number;
    insurance: number;
    financing: number;
  };
  expertAdditions: {
    biggestHiddenCost: string;
    costSavingInsight: string;
  };
}

export interface VanityPlateRequest {
  carModel: string;
  hobbies: string;
  vibe: 'Funny' | 'Minimalist' | 'Aggressive' | 'Intellectual' | 'Punny';
  state: string;
}

export interface VanityPlateItem {
  plate: string;
  meaning: string;
  category: string;
}

export interface WrapDesignRequest {
  vehicleType: string;
  prompt: string;
  artStyle: 'Realistic Photo' | 'Illustration' | 'Racing Livery' | 'Matte Stealth' | 'Carbon Fiber' | 'Iridescent Pearl' | 'Geometric Camo' | 'Cyberpunk Neon' | 'Retro Vintage';
}
