import { isUpdateRecipeDataType, type CreateRecipeData, type RecipeDetail, type RecipeFilterCriteria, type RecipeFormSubmissionData, type RecipeListItem, type RecipeListPagination, type RecipePbRecord, type UpdateRecipeData, type UpsertRecipePbRecord } from "$lib/recipe-types";
import { pocketbaseClient, RECIPES, RECIPES_INGREDIENTS } from "$lib/server/pocketbase-client";
import { ClientResponseError } from "pocketbase";
import { handlePocketbaseLogicError } from "./error-handler";
import type { Logger } from "winston";

const pbClient = pocketbaseClient;

// get paginated recipes, optional: filter, sort
export const getPaginatedRecipeList = async (currentPage: number, itemsPerPage: number, 
    recipeFilters: RecipeFilterCriteria, logger: Logger
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
        logger.debug('DB query param recipes', {filter: filterString, sort: sortString});
        const recipeRecords = await pbClient.collection(RECIPES).getList<RecipePbRecord>(
            currentPage, itemsPerPage, {
                filter: filterString,
                sort: sortString,
            });
        logger.debug('DB query recipes result', { page: recipeRecords.page, totalItems: recipeRecords.totalItems, totalPages: recipeRecords.totalPages }
            , );

        // destructuring
        const { page, perPage, totalPages, totalItems, items } = recipeRecords;
        const recipeListPagination: RecipeListPagination = {
            page, perPage, totalPages, totalItems,
            items: items.map(mapPbRecordToRecipeListItem)
        };
        return recipeListPagination;
    } catch (err) {
        if(err instanceof ClientResponseError) {
            handlePocketbaseLogicError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
    
}
// get recipe by id
export const getRecipeById = async (id: string, logger: Logger): Promise<RecipeDetail> => {
    
    try {
        const record = await pbClient.collection(RECIPES).getOne<RecipePbRecord>(id);
        logger.debug('DB query recipe', { recipeId: record.id });
        const recipe: RecipeDetail = mapPbRecordToRecipeDetail(record);
        return recipe;
    } catch (err) {
        // pocketbase error exception
        if(err instanceof ClientResponseError) {
            handlePocketbaseLogicError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
};
// get recipe and all ingredients
export const getRecipeByIdWithIngredients = async(id: string, logger: Logger): Promise<RecipeDetail> => {
    try {
        const record = await pbClient.collection(RECIPES).getOne<RecipePbRecord>(id);
        // get ingredients belongs to recipe
        const recipeIngredientsRecord = await pbClient.collection(RECIPES_INGREDIENTS).getFullList({
            filter: `recipe="${id}"`,
            expand: 'ingredient'
        });

        // mapping
        const { collectionId, collectionName, ...included  } = record;
        const recipe: RecipeDetail = {
            ...included,
            lastUpdatedAt: new Date(included.updated),
            createdAt: new Date(included.created),
            ingredients: recipeIngredientsRecord.map((r:any) => ({
                id: r.id,
                recipeId: included.id,
                ingredientId: r.expand.ingredient.id,
                name: r.expand.ingredient.name,
                qty: r.quantity,
                unit: r.unit !== '' ? r.unit : r.expand.ingredient.unit
            })),
        };
        logger.debug('DB query recipe', 
            { recipeId: recipe.id, totalIngredients: recipe.ingredients.length });
        return recipe;
    } catch (err) {
        // pocketbase error exception
        if(err instanceof ClientResponseError) {
            handlePocketbaseLogicError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
}

// create new recipe
export const createRecipe = async (recipeData: CreateRecipeData, logger: Logger) => {
    try {
        const data: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
        // return new insert record
        const newRecord = await pbClient.collection(RECIPES).create<RecipePbRecord>(data);
        logger.debug('DB insert recipe', { recipeId: newRecord.id });
        return {
            id: newRecord.id,
            recipeCode: newRecord.recipeCode
        };
    } catch (err) {
        // pocketbase error exception
        if(err instanceof ClientResponseError) {
            handlePocketbaseLogicError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
};
// create new recipe with ingredient list
export const createRecipeWithIngredients = async (recipeData: CreateRecipeData, logger: Logger) => {
    try {
        const recipeInsertedData: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
        // return new insert record
        const newRecipeRecord = await pbClient.collection(RECIPES).create<RecipePbRecord>
            (recipeInsertedData);
        logger.debug('DB insert recipe', { recipeId: newRecipeRecord.id });
        const recipeId = newRecipeRecord.id;
        for(const ingred of recipeData.ingredients) {
            const ingredientData = {
                recipe: recipeId,
                ingredient: ingred.ingredientId,
                quantity: ingred.qty,
                unit: ingred.unit
            };
            await pbClient.collection(RECIPES_INGREDIENTS).create(ingredientData);
        }
        logger.debug('DB insert recipe ingredients', 
            { recipeId, totalIngredients: recipeData.ingredients.length });
        return {
            id: newRecipeRecord.id,
            recipeCode: newRecipeRecord.recipeCode
        };
    } catch (err) {
        // pocketbase error exception
        if(err instanceof ClientResponseError) {
            handlePocketbaseLogicError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
}
// update recipe by id
export const updateRecipe = async (recipeData: UpdateRecipeData, logger: Logger)  => {
    try {
        // update master recipe 
        const recipeId = recipeData.id;
        const recipeCode = recipeData.recipeCode;
        const data: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
        await pbClient.collection(RECIPES).update<RecipePbRecord>(recipeId, data);
        logger.debug('DB upsert recipe', { recipeId });
        // load existing recipes_ingredients relation records
        const existedRecipeIngreLinks = await pbClient.collection(RECIPES_INGREDIENTS).getFullList({
            filter: `recipe="${recipeId}"`
        });
        // use for delete recipes_ingredients links
        const existingRecordMap = new Map(
            existedRecipeIngreLinks.map(link => [link.id, link])
        );
        const existedIdSet = new Set();

        // upsert recipes_ingredients records
        for(const ingred of recipeData.ingredients) {
            // if has id, then update
            if(ingred.id) {
                existedIdSet.add(ingred.id);
                await pbClient.collection(RECIPES_INGREDIENTS).update(ingred.id, {
                    ingredient: ingred.ingredientId,
                    quantity: ingred.qty,
                    unit: ingred.unit
                });
            } else {
                // if id undefined --> new --> create
                    const ingredientData = {
                    recipe: recipeId,
                    ingredient: ingred.ingredientId,
                    quantity: ingred.qty,
                    unit: ingred.unit
                };
                await pbClient.collection(RECIPES_INGREDIENTS)
                    .create(ingredientData);
            };
        }
        logger.debug('DB upsert recipe ingredients', 
            { recipeId, totalIngredients: recipeData.ingredients.length });
        // delete recipes_ingredients records
        for(const existedLink of existedRecipeIngreLinks) {
            // if the existedIdSet set doesn't have existed id, delete it
            if(!existedIdSet.has(existedLink.id)) {
                await pbClient.collection(RECIPES_INGREDIENTS)
                    .delete(existedLink.id);
            }
        }

        return {
            id: recipeId,
            recipeCode
        };

    } catch (err) {
        // pocketbase error exception
        if(err instanceof ClientResponseError) {
            handlePocketbaseLogicError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
};
// delete recipe by id
export const deleteRecipe = async (id: string, logger: Logger): Promise<void> => {
    try {
        await pbClient.collection(RECIPES).delete(id);
        logger.debug('DB delete recipe', { recipeId: id });
    } catch (err) {
        // pocketbase error exception
        if(err instanceof ClientResponseError) {
            handlePocketbaseLogicError(err, logger);
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
    // return only RecipeDetail, ignore recipe ingredients relation
    // exclude props
    const { collectionId, collectionName, ...included  } = pbRecord;
    return {
        ...included,
        lastUpdatedAt: new Date(included.updated),
        createdAt: new Date(included.created),
        ingredients: []
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