import { z } from "zod";

// ============================================
// Step Type
// ============================================

export type WizardStep = 1 | 2 | 3;

// ============================================
// Product Types (from DB)
// ============================================

export interface ProductCategory {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  type: string;
  resultSource: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  categories: ProductCategory[];
}

// ============================================
// Wizard Category (union: pre-defined | custom)
// ============================================

export interface WizardCategory {
  /** Unique key for React list rendering */
  key: string;
  /** null for custom categories */
  productCategoryId: string | null;
  name: string;
  description: string | null;
  type: string;
  isCustom: boolean;
  isActive: boolean;
}

// ============================================
// Wizard State
// ============================================

export interface WizardState {
  selectedProductId: string | null;
  poolName: string;
  categories: WizardCategory[];
}

// ============================================
// Review Data
// ============================================

export interface ReviewData {
  productName: string;
  poolName: string;
  activeCategories: WizardCategory[];
}

// ============================================
// Zod Schemas (Server Action validation)
// ============================================

export const CreatePoolSchema = z.object({
  name: z.string().min(1, "Nome do bolao e obrigatorio").max(60, "Nome muito longo"),
  productId: z.string().min(1, "Produto e obrigatorio"),
  activeProductCategoryIds: z.string(), // JSON array of string IDs
  customCategoryNames: z.string(),       // JSON array of string names
});

// ============================================
// Action State Type
// ============================================

export type WizardActionState<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string }
  | null;
