import { isUpdateRecipeDataType, type CreateRecipeData, type RecipeDetail, type RecipeFilterCriteria, type RecipeFormSubmissionData, type RecipeListItem, type RecipeListPagination, type RecipePbRecord, type UpdateRecipeData, type UpsertRecipePbRecord } from '$lib/recipe-types';
import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'http://127.0.0.1:8090';

const pb: PocketBase = new PocketBase(POCKETBASE_URL);
const COLLECTION_NAME = 'recipes';

// get paginated recipes, optional: filter, sort
export const getPaginatedRecipeList = async (currentPage: number, itemsPerPage: number, 
    recipeFilters: RecipeFilterCriteria
): 
    Promise<RecipeListPagination | undefined> => {
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

        const recipeRecords = await pb.collection(COLLECTION_NAME).getList<RecipePbRecord>(
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
    } catch (error) {
        console.error('Error fetch PocketBase recipes: ', error);
        return undefined;
    }
}
// get recipe by id
export const getRecipeById = async (id: string): Promise<RecipeDetail | null> => {
    try {
        const record = await pb.collection(COLLECTION_NAME).getOne<RecipePbRecord>(id);
        console.log('pocketbase recipe: {id} record', id, record);
        const recipe: RecipeDetail = mapPbRecordToRecipeDetail(record);
        return recipe;
    } catch (error) {
        console.error('Error fetch PocketBase recipe: ', error);
        return null;
    }
};
// create new recipe
export const createRecipe = async (recipeData: CreateRecipeData): Promise<RecipePbRecord | null> => {
    const data: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
    // return new insert record
    const newRecord = await pb.collection(COLLECTION_NAME).create<RecipePbRecord>(data);
    return newRecord;
};
// update recipe by id
export const updateRecipe = async (recipeData: UpdateRecipeData): Promise<RecipePbRecord | null> => {
    const id = recipeData.id;
    const data: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
    const updatedRecord = await pb.collection(COLLECTION_NAME).update<RecipePbRecord>(id, data);
    return updatedRecord;
};
// delete recipe by id
export const deleteRecipe = async (id: string): Promise<void> => {
    try {
        await pb.collection(COLLECTION_NAME).delete(id);
    } catch (error) {
        console.error('Exception error delete PocketBase recipe {id}: ', id, error);
    }
};

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