import { type IngredientPbRecord, type IngredientSelect } from "$lib/types/ingredient-types";
import { ClientResponseError } from "pocketbase";
import { handlePocketbaseError } from "./error-handler";
import { INGREDIENTS, pocketbaseClient } from "./pocketbase-client";

const pbClient = pocketbaseClient;
const COLLECTION_NAME = INGREDIENTS;

export const getAllIngredients = async (): Promise<IngredientSelect[]> => {
    try {
        const ingredientRecords = await pbClient.collection(COLLECTION_NAME)
            .getFullList<IngredientPbRecord>();
        console.log('Total ingredient records: ', ingredientRecords.length);
        const ingredientSelects = ingredientRecords.map(r => mapPbRecordToIngredientSelect(r));
        return ingredientSelects;
    } catch (err) {
        // pocketbase error exception
        console.error('Pocketbase Error: ', err);
        if(err instanceof ClientResponseError) {
            handlePocketbaseError(err);
        }
        // re throw / bubble up other error
        throw err;
    }
}

const mapPbRecordToIngredientSelect = (pbRecord: IngredientPbRecord): IngredientSelect => {
    const { collectionId, collectionName, created, updated, ...included } = pbRecord;
    return included;
}