import { type IngredientFormData, type CreateRecipeIngredientsPbRecord, type RecipeIngredientsPbRecord } from "$lib/types/ingredient-types";
import { pocketbaseClient, RECIPES_INGRED } from "./pocketbase-client";

const pbClient = pocketbaseClient;
const COLLECTION_NAME = RECIPES_INGRED;

// recipes_ingredients relation
export const createRecipeIngredients = async(recipeIngred: IngredientFormData, recipeId: string) => {
    try {
        const data: CreateRecipeIngredientsPbRecord = {
            recipeId,
            ingredientId: recipeIngred.ingredientId,
            quantity: recipeIngred.qty,
            unit: recipeIngred.unit
        };
        const newRecord = await pbClient.collection(COLLECTION_NAME).create<RecipeIngredientsPbRecord>(data);
        return { 
            id: newRecord.id, 
            recipeId: newRecord.recipeId, 
            ingredientId: newRecord.ingredientId 
        };
    } catch (err) {
        // pocketbase error exception
        console.error('Pocketbase Error: ', err);
        
        // temp throw
        throw err;
    }
}