import type { RecipesCategoryOptions, RecipesIngredientsResponse, RecipesResponse } from "./pocketbase-types";

export type RecipeCategory = RecipesCategoryOptions;

// base recipe domain type
export type RecipeBase = Omit<RecipesResponse, 'created' | 'updated' | 'category'> &
    {
        category: RecipeCategory;
        created: Date;
        updated: Date;
    };
// recipe's ingredients base upsert payload
export type RecipeIngredientPayload = Pick<RecipesIngredientsResponse, 'ingredient' | 'quantity' | 'unit'>;



// recipe list items
export type RecipeListItem = Omit<RecipeBase, 
    'collectionId' | 'collectionName' | 'instructions' | 'updated' | 'expand'>;
// recipe detail view with recipe ingredients
export type RecipeDetailItem = Omit<RecipeBase, 'collectionId' | 'collectionName' | 'instructions'> & 
    {
        instructions: string[];
        ingredients: RecipeIngredientDetail[] 
    };

// recipe's 1 ingredient detail view
export type RecipeIngredientDetail = Pick<
    RecipesIngredientsResponse, 'id' | 'ingredient' | 'quantity' | 'unit'> & 
    { recipeId: string; name: string; }

// recipe payload base upsert payload
export type RecipePayload = Omit<
    RecipeBase, 'id'| 'recipeCode' | 'collectionId' | 'collectionName' | 'created' | 'updated'| 'expand' | 'instructions'> &
    {   instructions: string[];
        ingredients: RecipeIngredientPayload[] 
    };

// create recipe payload
export type CreateRecipePayload = RecipePayload;
// update recipe payload
export type UpdateRecipePayload = RecipePayload & {
    id: string;
};

// upsert recipe payload type
export type UpsertRecipePayload = CreateRecipePayload | UpdateRecipePayload;

// recipe filter payload
export type RecipeFilterPayload = Partial<Pick<RecipeBase, 'category' | 'prepTimeMin'> & 
    { text: string; sortBy: string }>;


// recipe's ingredients form row input
export type RecipeIngredientsFormRow = RecipeIngredientPayload &
    { rowId: string };
// recipe's instructions form row input
export interface RecipeInstructionFormRow {
    rowId: string;
    instructionText: string;
}
// recipe master form state
export type RecipeFormData = Omit<RecipePayload, 'instructions' | 'ingredients' | 'category'> &
    {
        category: RecipeCategory | string,
        instructions: RecipeInstructionFormRow[],
        ingredients: RecipeIngredientsFormRow[]
    };
// recipe general info section form state
export type RecipeGeneralInfoFormData = Pick<RecipeFormData, 
    'title' | 'description' | 'category' | 'prepTimeMin'>;