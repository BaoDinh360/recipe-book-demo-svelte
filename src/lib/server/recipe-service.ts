import { isUpdateRecipeDataType, type CreateRecipeData, type RecipeDetail, type RecipeFilterCriteria, type RecipeFormSubmissionData, type RecipeListItem, type RecipeListPagination, type RecipePbRecord, type UpdateRecipeData, type UpsertRecipePbRecord } from "$lib/recipe-types";
import { pocketbaseClient, RECIPES } from "$lib/server/pocketbase-client";
import { ClientResponseError } from "pocketbase";
import { BusinessError } from "./business-errors";
import { handlePocketbaseError } from "./error-handler";

const pbClient = pocketbaseClient;
const COLLECTION_NAME = RECIPES;

// get paginated recipes, optional: filter, sort
export const getPaginatedRecipeList = async (currentPage: number, itemsPerPage: number, 
    recipeFilters: RecipeFilterCriteria
): Promise<RecipeListPagination> => {

    try {
        // construct pocketbase filter
        const { text, category, prepTimeMin, sortBy } = recipeFilters;

        const pbFilters: string[] = [];
        const pbSorts: string[] = [];
        // filters
        if(text) {
            // search contains text
            pbFilters.push(`(recipeCode~"${text}" || title~"${text}" || description~"${text}")`);
        }
        if(category) {
            pbFilters.push(`category="${category}"`);
        }
        if(prepTimeMin) {
            pbFilters.push(`prepTimeMin<=${prepTimeMin}`);
        }

        // sort by
        if(sortBy) {
            pbSorts.push(`${sortBy}`);
        }

        // join filters into a final string
        const filterString =  pbFilters.length > 0 ? pbFilters.join('&&') : undefined;
        const sortString = pbSorts.length > 0 ? pbSorts.join(',') : undefined;
        console.log('Recipe filter, sorts string: ', filterString, sortString);

        const recipeRecords = await pbClient.collection(COLLECTION_NAME).getList<RecipePbRecord>(
            currentPage, itemsPerPage, {
                filter: filterString,
                sort: sortString,
            });
        console.log('recipe records returned: ', recipeRecords.totalItems);

        // destructuring
        const { page, perPage, totalPages, totalItems, items } = recipeRecords;
        const recipeListPagination: RecipeListPagination = {
            page, perPage, totalPages, totalItems,
            items: items.map(mapPbRecordToRecipeListItem)
        };
        return recipeListPagination;
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
// get recipe by id
export const getRecipeById = async (id: string): Promise<RecipeDetail> => {
    try {
        const record = await pbClient.collection(COLLECTION_NAME).getOne<RecipePbRecord>(id);
        console.log('pocketbase recipe: {id} record', id, record);
        const recipe: RecipeDetail = mapPbRecordToRecipeDetail(record);
        return recipe;
    } catch (err) {
        // pocketbase error exception
        console.error('Pocketbase Error: ', err);
        if(err instanceof ClientResponseError) {
            handlePocketbaseError(err);
        }
        // re throw / bubble up other error
        throw err;
    }
};
// create new recipe
export const createRecipe = async (recipeData: CreateRecipeData): Promise<RecipePbRecord> => {
    try {
        const data: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
        // return new insert record
        const newRecord = await pbClient.collection(COLLECTION_NAME).create<RecipePbRecord>(data);
        return newRecord;
    } catch (err) {
        // pocketbase error exception
        console.error('Pocketbase Error: ', err);
        if(err instanceof ClientResponseError) {
            handlePocketbaseError(err);
        }
        // re throw / bubble up other error
        throw err;
    }
};
// update recipe by id
export const updateRecipe = async (recipeData: UpdateRecipeData): Promise<RecipePbRecord> => {
    try {
        const id = recipeData.id;
        const data: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
        const updatedRecord = await pbClient.collection(COLLECTION_NAME).update<RecipePbRecord>(id, data);
        return updatedRecord;
    } catch (err) {
        // pocketbase error exception
        console.error('Pocketbase Error: ', err);
        if(err instanceof ClientResponseError) {
            handlePocketbaseError(err);
        }
        // re throw / bubble up other error
        throw err;
    }
};

// mapper func
const mapPbRecordToRecipeListItem = (pbRecord: RecipePbRecord): RecipeListItem => {
    const { instructions, collectionId, collectionName, ...included } = pbRecord;
    return {
        ...included,
        description: included.description.trim(),
        createdAt: new Date(included.created)
    };
}
const mapPbRecordToRecipeDetail = (pbRecord: RecipePbRecord): RecipeDetail => {
    // exclude props
    const { collectionId, collectionName, ...included  } = pbRecord;
    return {
        ...included,
        lastUpdatedAt: new Date(included.updated),
        createdAt: new Date(included.created)
    };
}
const mapRecipeDataToUpsertPbRecord = 
    (recipeData: RecipeFormSubmissionData): UpsertRecipePbRecord => {
    if(isUpdateRecipeDataType(recipeData)) {
        // if update recipe data, exclude id
        // exclude id from obj using destructuring
        const { id, recipeCode, ...included } = recipeData;
        return {
            ...included,
            instructions: JSON.stringify(included.instructions)
        };
    }
    // if create recipe data, map normally
    return {
        ...recipeData,
        instructions: JSON.stringify(recipeData.instructions)
    };
}