import type { IngredientsResponse } from "./pocketbase-types";

// base ingredient domain type
export type IngredientBase = IngredientsResponse;

// ingredients dropdown select
export type IngredientSelect = Pick<IngredientBase, 'id' | 'code' | 'name' | 'unit'>;