import { isUpdateRecipeDataType, type CreateRecipeData, type RecipeDetail, type RecipeFilterCriteria, type RecipeFormSubmissionData, type RecipeListItem, type RecipeListPagination, type RecipePbRecord, type UpdateRecipeData, type UpsertRecipePbRecord } from "$lib/recipe-types";
import { pocketbaseClient, RECIPES, RECIPES_INGREDIENTS } from "$lib/server/pocketbase-client";
import { ClientResponseError } from "pocketbase";
import { handlePocketbaseError } from "./error-handler";

const pbClient = pocketbaseClient;

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

        const recipeRecords = await pbClient.collection(RECIPES).getList<RecipePbRecord>(
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
        const record = await pbClient.collection(RECIPES).getOne<RecipePbRecord>(id);
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
// get recipe and all ingredients
export const getRecipeByIdWithIngredients = async(id: string): Promise<RecipeDetail> => {
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

        console.log(`pocketbase recipe ${id} detail`);
        console.dir(recipe, { depth: null });
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
}

// create new recipe
export const createRecipe = async (recipeData: CreateRecipeData) => {
    try {
        const data: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
        // return new insert record
        const newRecord = await pbClient.collection(RECIPES).create<RecipePbRecord>(data);
        return {
            id: newRecord.id,
            recipeCode: newRecord.recipeCode
        };
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
// create new recipe with ingredient list
export const createRecipeWithIngredients = async (recipeData: CreateRecipeData) => {
    try {
        const recipeInsertedData: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
        // return new insert record
        const newRecipeRecord = await pbClient.collection(RECIPES).create<RecipePbRecord>
            (recipeInsertedData);
        
        const createdId = [];
        const recipeId = newRecipeRecord.id;
        for(const ingred of recipeData.ingredients) {
            const ingredientData = {
                recipe: recipeId,
                ingredient: ingred.ingredientId,
                quantity: ingred.qty,
                unit: ingred.unit
            };
            const recipeIngred = await pbClient.collection(RECIPES_INGREDIENTS)
                .create(ingredientData);
            // keep track of inserted success ingredients
            createdId.push(recipeIngred.id);
        }
        console.log('recipe {id} total ingredients inserted: {total}', recipeId, createdId.length);

        return {
            id: newRecipeRecord.id,
            recipeCode: newRecipeRecord.recipeCode
        };
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
// update recipe by id
export const updateRecipe = async (recipeData: UpdateRecipeData)  => {
    try {
        // update master recipe 
        const recipeId = recipeData.id;
        const recipeCode = recipeData.recipeCode;
        const data: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
        await pbClient.collection(RECIPES)
            .update<RecipePbRecord>(recipeId, data);
        
        // load existing recipes_ingredients relation records
        const existedRecipeIngreLinks = await pbClient.collection(RECIPES_INGREDIENTS).getFullList({
            filter: `recipe="${recipeId}"`
        });
        // use for delete recipes_ingredients links
        const existingRecordMap = new Map(
            existedRecipeIngreLinks.map(link => [link.id, link])
        );
        const existedIdSet = new Set();

        const updatedId = [];
        const createdId = [];
        // upsert recipes_ingredients records
        for(const ingred of recipeData.ingredients) {
            // if has id, then update
            if(ingred.id) {
                existedIdSet.add(ingred.id);
                const updated = await pbClient.collection(RECIPES_INGREDIENTS).update(ingred.id, {
                    ingredient: ingred.ingredientId,
                    quantity: ingred.qty,
                    unit: ingred.unit
                });
                updatedId.push(updated.id);
            } else {
                // if id undefined --> new --> create
                    const ingredientData = {
                    recipe: recipeId,
                    ingredient: ingred.ingredientId,
                    quantity: ingred.qty,
                    unit: ingred.unit
                };
                const created = await pbClient.collection(RECIPES_INGREDIENTS)
                    .create(ingredientData);
                createdId.push(created.id);
            };
        }
        // delete recipes_ingredients records
        for(const existedLink of existedRecipeIngreLinks) {
            // if the existedIdSet set doesn't have existed id, delete it
            if(!existedIdSet.has(existedLink.id)) {
                await pbClient.collection(RECIPES_INGREDIENTS)
                    .delete(existedLink.id);
            }
        }
        console.log('recipe {id} ingredients updated: ', recipeId, updatedId);
        console.log('recipe {id} ingredients created: ', recipeId, createdId);

        return {
            id: recipeId,
            recipeCode
        };

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
// delete recipe by id
export const deleteRecipe = async (id: string): Promise<void> => {
    try {
        await pbClient.collection(RECIPES).delete(id);
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