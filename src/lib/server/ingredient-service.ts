import { type IngredientSelect } from "$lib/types/ingredient-types";
import { ClientResponseError } from "pocketbase";
import { handlePocketbaseLogicError } from "./error-handler";
import type { Logger } from "winston";
import PocketBase from 'pocketbase';
import { Collections, type IngredientsResponse } from "$lib/types/pocketbase-types";


export const getAllIngredientsSelect = async (pbClient: PocketBase, logger: Logger): Promise<IngredientSelect[]> => {
    try {
        const ingredientRecords = await pbClient.collection(Collections.Ingredients)
            .getFullList<IngredientsResponse>();
        logger.debug('DB query ingredients result', {total: ingredientRecords.length});
        
        const ingredientsSelect: IngredientSelect[] = ingredientRecords
            .map(ingr => mapIngredientResToSelect(ingr));
        return ingredientsSelect;
    } catch (err) {
        // pocketbase error exception
        console.error('Pocketbase Error: ', err);
        if(err instanceof ClientResponseError) {
            handlePocketbaseLogicError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
}

const mapIngredientResToSelect = (ingredientRes: IngredientsResponse): IngredientSelect => {
    const { collectionId, collectionName, created, updated, expand, 
            ...included } = ingredientRes;
    return included;
}