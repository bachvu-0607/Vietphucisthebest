export type EventCategory = 'seasonal' | 'cultural' | 'life_milestone' | 'academic' | 'performance' | 'state_formal' | 'lifestyle';

export interface EventItem {
  id: string;
  name: string;
  slug: string;
  category: EventCategory | string;
  icon: string;
  description: string;
  recommendedDressCode: string;
  badge: string;
  imageUrl?: string;
  formalityLevel?: string;
  seasonWeather?: string;
}

export interface CostumeComponent {
  id: string;
  name: string;
  layerOrder: number; // 1: Model, 2: Inner, 3: Main body, 4: Outer, 5: Headwear, 6: Accessories, 7: Footwear
  isRequired: boolean;
  type: 'inner' | 'main' | 'outer' | 'headwear' | 'accessory' | 'footwear';
  description: string;
  defaultColor: string;
}

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  meaning: string;
  popularity: string;
}

export interface MaterialOption {
  id: string;
  name: string;
  textureType: string;
  origin: string;
  description: string;
}

export interface AccessoryOption {
  id: string;
  name: string;
  category: 'headwear' | 'jewelry' | 'handheld' | 'waist' | 'footwear';
  layerOrder: number;
  description: string;
  traditionalMeaning: string;
  isRecommended: boolean;
  // These are styling options; a reference outfit requires its own dated evidence.
  contextNote?: string;
}

export interface DetailOption {
  id: string;
  name: string;
  type: 'collar' | 'sleeve' | 'button' | 'hem';
  description: string;
}

export interface BackgroundSetting {
  id: string;
  name: string;
  description: string;
  aesthetic: string;
  promptDescription: string;
}

export interface StylingGuide {
  accessories: string[];
  hairstyles: string[];
  footwear: string[];
  recommendedColors: string[];
  materialsAndMotifs: string[];
  traditionalStyling: string;
  modernRemixAdvice: string;
  avoidCombinations: string[];
}

export interface SuitabilityMapping {
  eventId: string;
  score: number;
  label: 'Hoàn hảo' | 'Rất phù hợp' | 'Phù hợp' | 'Cách tân độc đáo';
  reason: string;
}

export interface ContentSource {
  id: string;
  title: string;
  author: string;
  publisher: string;
  url: string;
}

export interface ContentSourceReference {
  sourceId: string;
  scope: string;
  locator?: string;
}

export interface CostumeResearch {
  status: 'partially_reviewed' | 'needs_review';
  reviewedAt: string;
  sources: ContentSourceReference[];
  modernUse: string;
  limitations: string[];
}

export interface CostumeAIProfile {
  constructionDetails: string[];
  mandatoryFeatures: string[];
  strictProhibitions: string[];
}

export interface Costume {
  id: string;
  name: string;
  slug: string;
  era: string;
  region: string;
  gender: 'male' | 'female' | 'unisex';
  formality: 'ceremonial' | 'formal' | 'casual_refined' | 'everyday';
  coverImage: string;
  lineageCategory?: 'giao-linh' | 'vien-linh' | 'lap-linh' | 'dich-chuyen';
  lineageSubcategory?: 'ao-tac' | 'tay-chen' | 'nhat-binh' | 'tu-than' | 'ba-ba' | 'giao-linh' | 'vien-linh';
  lineageLabel?: string;
  shortDescription: string;
  historicalContext: string;
  culturalSignificance: string;
  isVerifiedHistoricalData: boolean;
  verificationNote: string;
  components: CostumeComponent[];
  colorVariants: ColorVariant[];
  materials: MaterialOption[];
  accessories: AccessoryOption[];
  details: DetailOption[];
  suitability: SuitabilityMapping[];
  usageConsiderations: string[];
  stylingGuide: StylingGuide;
  research?: CostumeResearch;
  aiProfile?: CostumeAIProfile;
}

export interface FittingDraft {
  id: string;
  title: string;
  eventId: string;
  costumeId: string;
  modelGender: 'male' | 'female';
  modelPose: string;
  selectedColorId: string;
  selectedMaterialId: string;
  selectedAccessories: string[];
  selectedHairstyle: string;
  selectedFootwear: string;
  selectedDetails: Record<string, string>;
  selectedBackgroundId: string;
  remixStyle: 'traditional' | 'subtle_modern' | 'remix_fusion';
  customPrompt: string;
  visibleLayers: Record<string, boolean>;
  sketchDataUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIJob {
  id: string;
  draftId?: string;
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'failed';
  costumeId: string;
  costumeName: string;
  eventName: string;
  remixStyle: string;
  sketchDataUrl: string;
  resultImageUrl?: string;
  promptUsed: string;
  errorMessage?: string;
  progress: number;
  createdAt: string;
  completedAt?: string;
}
