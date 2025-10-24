import { isUpdateRecipeDataType, type CreateRecipeData, type RecipeDetail, type RecipeFormSubmissionData, type RecipeListItem, type RecipePbRecord, type UpdateRecipeData, type UpsertRecipePbRecord } from '$lib/recipe-types';
import { type Recipe } from '$lib/types';
import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'http://127.0.0.1:8090';

const pb: PocketBase = new PocketBase(POCKETBASE_URL);
const COLLECTION_NAME = 'recipes';

// get all recipes
export const fetchAllRecipes = async (): Promise<Recipe[]> => {
    try {
        const recipeRecords = await pb.collection(COLLECTION_NAME).getList<RecipePbRecord>(1, 50);
        console.log('pocketbase recipe records: ', recipeRecords);
        const recipes: Recipe[] = recipeRecords.items.map(mapPbRecordToRecipe);
        return recipes;
    } catch (error) {
        console.error('Error fetch PocketBase recipes: ', error);
        return [];
    }
};
export const getPaginatedRecipeList = async (): Promise<RecipeListItem[]> => {
    try {
        const recipeRecords = await pb.collection(COLLECTION_NAME).getList<RecipePbRecord>(1, 50);
        console.log('pocketbase recipe records: ', recipeRecords);
        const recipeListItems: RecipeListItem[] = recipeRecords.items.map(mapPbRecordToRecipeListItem);
        return recipeListItems;
    } catch (error) {
        console.error('Error fetch PocketBase recipes: ', error);
        return [];
    }
}
// get recipe by id
export const fetchRecipeById = async (id: string): Promise<RecipeDetail | null> => {
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
export const createRecipe = async (recipeData: CreateRecipeData): Promise<Recipe | null> => {
    try {
        const data: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
        // return new insert record
        const record = await pb.collection(COLLECTION_NAME).create<RecipePbRecord>(data);
        const newRecipe: Recipe = mapPbRecordToRecipe(record);
        return newRecipe;
    } catch (error) {
        console.error('Error insert PocketBase recipe: ', error);
        return null;
    }
};
// update recipe by id
export const updateRecipe = async (recipeData: UpdateRecipeData): Promise<Recipe | null> => {
    const id = recipeData.id;
    try {
        const data: UpsertRecipePbRecord = mapRecipeDataToUpsertPbRecord(recipeData);
        const record = await pb.collection(COLLECTION_NAME).update<RecipePbRecord>(id, data);
        const updatedRecipe: Recipe = mapPbRecordToRecipe(record);
        return updatedRecipe;
    } catch (error) {
        console.error('Error update PocketBase recipe {id}: ', id, error);
        return null;
    }
};
// delete recipe by id
export const deleteRecipe = async (id: string): Promise<void> => {
    try {
        await pb.collection(COLLECTION_NAME).delete(id);
    } catch (error) {
        console.error('Error delete PocketBase recipe {id}: ', id, error);
    }
};

// mapping helper
const mapPbRecordToRecipe = (pbRecord: RecipePbRecord): Recipe => {
    const { collectionId, collectionName, ...included  } = pbRecord;
    return {
        ... included,
        dateCreated: new Date(included.created)
    };
}
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