import { z } from "zod";

// ============================================
// UI Types (from Subtask V)
// ============================================

export type WizardStep = 1 | 2 | 3 | 4;

export type CategoryType = "single_choice" | "exact_score" | "free_text";

export interface Template {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  type: CategoryType;
  selected: boolean;
}

export interface ScoringRule {
  id: string;
  name: string;
  points: number;
}

export interface ScoringGroup {
  group: string;
  groupColor: "cyan" | "gold";
  rules: ScoringRule[];
}

export interface ReviewData {
  poolName: string;
  event: string;
  categoriesCount: number;
  categoriesNames: string[];
  scoringRange: string;
  rulesCount: number;
}

export interface WizardState {
  eventText: string;
  selectedTemplateId: string | null;
  categories: Category[];
  scoringRules: ScoringGroup[];
  review: ReviewData;
}

// ============================================
// AI Response Types
// ============================================

export interface AnalyzeEventResponse {
  name: string;
  eventType: string;
  categories: Array<{
    name: string;
    description: string;
    type: CategoryType;
  }>;
}

export interface SuggestCategoryResponse {
  name: string;
  description: string;
  type: CategoryType;
}

export interface GenerateScoringResponse {
  groups: Array<{
    group: string;
    groupColor: "cyan" | "gold";
    rules: Array<{
      name: string;
      points: number;
    }>;
  }>;
}

export interface RebalanceScoringResponse {
  groups: Array<{
    group: string;
    groupColor: "cyan" | "gold";
    rules: Array<{
      name: string;
      points: number;
    }>;
  }>;
}

// ============================================
// Zod Schemas (Server Action validation)
// ============================================

export const AnalyzeEventSchema = z.object({
  eventText: z.string().min(1, "Descreva o evento"),
});

export const SuggestCategorySchema = z.object({
  eventName: z.string().min(1),
  existingCategories: z.string(),
  request: z.string().min(1, "Descreva a categoria desejada"),
});

export const GenerateScoringSchema = z.object({
  eventName: z.string().min(1),
  categories: z.string().min(1),
});

export const RebalanceScoringSchema = z.object({
  eventName: z.string().min(1),
  currentRules: z.string().min(1),
  request: z.string().min(1, "Descreva o que deseja rebalancear"),
});

export const CreatePoolSchema = z.object({
  name: z.string().min(1, "Nome do bolao e obrigatorio"),
  eventType: z.string().optional(),
  categories: z.string().min(1),
  scoringRules: z.string().min(1),
});

// ============================================
// Action State Types
// ============================================

export type WizardActionState<T = undefined> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
} | null;
