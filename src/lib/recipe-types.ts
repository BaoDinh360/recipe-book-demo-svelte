import type { RecipeCategory } from "./types";

// pocketbase full recipe record
export interface RecipePbRecord {
    id: string;
    recipeCode: string;
    title: string;
    description: string;
    instructions: string[];
    prepTimeMin: number;
    category: RecipeCategory;
    // pocketbase generated props
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
}

// pocketbase insert/update record
export interface UpsertRecipePbRecord {
    title: string;
    description: string;
    instructions: string; // json string of array
    prepTimeMin: number;
    category: RecipeCategory;
}

// recipe display item list
export interface RecipeListItem {
    id: string;
    recipeCode: string;
    title: string;
    description: string;
    prepTimeMin: number;
    category: RecipeCategory;
    createdAt: Date;
}

// recipe list items with pagination
export interface RecipeListPagination {
    page: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
    items: RecipeListItem[];
}

// recipe detail
export interface RecipeDetail {
    id: string;
    recipeCode: string;
    title: string;
    description: string;
    instructions: string[];
    prepTimeMin: number;
    category: RecipeCategory;
    createdAt: Date;
    lastUpdatedAt: Date;
}

// interface for create new recipe
export interface CreateRecipeData {
    title: string;
    description: string;
    instructions: string[];
    prepTimeMin: number;
    category: RecipeCategory;
}
// interface for update existing recipe
export interface UpdateRecipeData extends CreateRecipeData {
    id: string;
    recipeCode: string;
}
// custom union type
export type RecipeFormSubmissionData = CreateRecipeData | UpdateRecipeData;
export const isUpdateRecipeDataType = (data: RecipeFormSubmissionData): data is UpdateRecipeData => {
    // data must have id and type is string
    // to be UpdateRecipeData
    return (data as UpdateRecipeData).id !== undefined &&
        typeof(data as UpdateRecipeData).id === 'string';
}

// recipe filter
export interface RecipeFilterCriteria {
    text: string | undefined;
    category: RecipeCategory | undefined;
    prepTimeMin: number | undefined;
    sortBy: string | undefined;
}