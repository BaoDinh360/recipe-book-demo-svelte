import { ClientResponseError, type ListResult } from "pocketbase";
import { handlePocketbaseBatchError, handlePocketbaseLogicError, handleServiceError } from "./error-handler";
import type { Logger } from "winston";
import PocketBase from 'pocketbase';
import { Collections, type RecipesIngredientsResponse, type RecipesResponse } from "$lib/types/pocketbase-types";
import type { CreateRecipePayload, RecipeDetailItem, RecipeFilterPayload, RecipeListItem, UpdateRecipePayload } from "$lib/types/recipe-types";
import { genPocketbaseId } from "./pocketbase-client";


// get paginated recipes, optional: filter, sort
export const getPaginatedRecipeList = async (currentPage: number, itemsPerPage: number, 
    recipeFilters: RecipeFilterPayload, 
    pbClient: PocketBase, logger: Logger
): Promise<ListResult<RecipeListItem>> => {

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
        const recipeRecords = await pbClient.collection(Collections.Recipes)
            .getList<RecipesResponse>(
                currentPage, itemsPerPage, {
                filter: filterString,
                sort: sortString,
            });
        logger.debug('DB query recipes result', { page: recipeRecords.page, totalItems: recipeRecords.totalItems, totalPages: recipeRecords.totalPages }
            , );

        // destructuring
        const { page, perPage, totalPages, totalItems, items } = recipeRecords;
        
        const recipeListItems: RecipeListItem[] = items.map(mapRecipeResToItemList);
        
        return {
            page, perPage, totalPages, totalItems,
            items: recipeListItems
        };
    } catch (err) {
        // if(err instanceof ClientResponseError) {
        //     handlePocketbaseLogicError(err, logger);
        // }
        // // re throw / bubble up other error
        // throw err;
        throw handleServiceError(err, logger);
    }
    
}
// get recipe by id
// export const getRecipeById = async (id: string, 
//     pbClient: PocketBase, logger: Logger): Promise<RecipeDetailItem> => {
//     try {
//         // const record = await pbClient.collection(RECIPES).getOne<RecipePbRecord>(id);
//         const recipeRes = await pbClient.collection(Collections.Recipes)
//             .getOne<RecipesResponse>(id);
//         logger.debug('DB query recipe', { recipeId: recipeRes.id });

//         // const recipe: RecipeDetail = mapPbRecordToRecipeDetail(record);
//         // return recipe;
//     } catch (err) {
//         // pocketbase error exception
//         if(err instanceof ClientResponseError) {
//             handlePocketbaseLogicError(err, logger);
//         }
//         // re throw / bubble up other error
//         throw err;
//     }
// };
// get recipe and all ingredients
export const getRecipeByIdWithIngredients = async(id: string, 
    pbClient: PocketBase, logger: Logger): Promise<RecipeDetailItem> => {
    try {
        const recipeRes = await pbClient.collection(Collections.Recipes).getOne<RecipesResponse>(id);
        const recipeIngredResList = await pbClient.collection(Collections.RecipesIngredients)
            .getFullList<RecipesIngredientsResponse>({
                filter: `recipe="${id}"`,
                expand: 'ingredient'
            });
        // mapping
        const recipe = mapRecipeResToRecipeDetailWithIngredients(recipeRes, recipeIngredResList);
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
// create new recipe with ingredient list
export const createRecipeWithIngredients = async (
        recipePayload: CreateRecipePayload, pbClient: PocketBase, logger: Logger) => {
    try {
        const { ingredients, ...included } = recipePayload;
        // mapping
        const payload = {
            ...included,
            instructions: JSON.stringify(included.instructions)
        };
        // batch to upsert atomically
        const batch = pbClient.createBatch();
        // batch doesn't return inserted record --> must create id on client
        const recipeId = genPocketbaseId();

        // batch upsert recipe
        batch.collection(Collections.Recipes).create({
            id: recipeId,
            ...payload
        });

        // batch upsert recipe_ingredients relation
        for (const ingr of ingredients) {
            const ingrPayload = {
                recipe: recipeId,
                ...ingr
            };
            batch.collection(Collections.RecipesIngredients).create(ingrPayload);
        }

        const batchResult = await batch.send();
        // destructuring
        const [first, ...junctionRec] = batchResult;
        const newRecipe = first as unknown as RecipesResponse;
        logger.debug('DB insert recipe', { recipeId: newRecipe.id });
        logger.debug('DB insert recipe ingredients', 
            { recipeId: newRecipe.id, totalIngredients: junctionRec });

        return {
            id: newRecipe.id,
            recipeCode: newRecipe.recipeCode
        };
    } catch (err) {
        // pocketbase error exception
        if(err instanceof ClientResponseError) {
            // handlePocketbaseLogicError(err, logger);
            handlePocketbaseBatchError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
}
// update recipe by id
export const updateRecipe = async (
    recipePayload: UpdateRecipePayload, pbClient: PocketBase, logger: Logger)  => {
    try {
        const { ingredients, ...included } = recipePayload;
        const recipeId = recipePayload.id;
        // mapping
        const payload = {
            ...included,
            instructions: JSON.stringify(included.instructions)
        };
        // batch to upsert atomically
        const batch = pbClient.createBatch();
        // update master recipe
        batch.collection(Collections.Recipes).update(recipeId, payload);
        // find existing links to delete and re-insert
        const existingLinks = await pbClient.collection(Collections.RecipesIngredients)
            .getFullList({
                filter: `recipe="${recipeId}"`
        });
        console.log('existing links: ', existingLinks);
        for (const link of existingLinks) {
            batch.collection(Collections.RecipesIngredients).delete(link.id);
        }
        // re-insert
        for(const ingr of ingredients) {
            const ingrPayload = {
                recipe: recipeId,
                ...ingr
            };
            batch.collection(Collections.RecipesIngredients).create(ingrPayload);
        }
        const batchResult = await batch.send();
        // destructuring
        const [first, ...junctionRec] = batchResult;
        const updatedRecipe = first as unknown as RecipesResponse;
        logger.debug('DB update recipe', { recipeId: updatedRecipe.id });
        logger.debug('DB update recipe ingredients', 
            { recipeId: updatedRecipe.id, totalIngredients: junctionRec });

        return {
            id: updatedRecipe.id,
            recipeCode: updatedRecipe.recipeCode
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
export const deleteRecipe = async (id: string, pbClient: PocketBase, logger: Logger): Promise<void> => {
    try {
        const batch = pbClient.createBatch();
        // find relation links ingredients
        const existingLinks = await pbClient.collection(Collections.RecipesIngredients).getFullList({
            filter: `recipe="${id}"`
        });
        logger.debug(`Recipe: ${id} ingredients found`, { total: existingLinks.length });
        // delete relation links
        if (existingLinks && existingLinks.length > 0) {
            for (const link of existingLinks) {
                batch.collection(Collections.RecipesIngredients).delete(link.id)
            }
        }
        // delete master recipe
        batch.collection(Collections.Recipes).delete(id);
        await batch.send();
        logger.debug(` DB delete recipe: ${id} ingredients records deleted`);
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
const mapRecipeResToItemList = (recipeRes: RecipesResponse): RecipeListItem => {
    const { instructions, collectionId, collectionName, expand, updated,
            ...included } = recipeRes;
    return {
        ...included,
        description: included.description.trim(),
        created: new Date(included.created)
    };
}
const mapRecipeResToRecipeDetailWithIngredients = (recipeRes: RecipesResponse, 
    recipeIngredResList: RecipesIngredientsResponse[]): RecipeDetailItem => {
    const { collectionId, collectionName, expand, ...included } = recipeRes;

    return {
        ...included,
        instructions: included.instructions as string[],
        created: new Date(included.created),
        updated: new Date(included.updated),
        // mapping recipe ingredients list
        ingredients: recipeIngredResList.map((r:any) => ({
            id: r.id,
            recipeId: included.id,
            ingredient: r.expand.ingredient.id,
            name: r.expand.ingredient.name,
            quantity: r.quantity,
            unit: r.unit !== '' ? r.unit : r.expand.ingredient.unit
        }))
    }
}
