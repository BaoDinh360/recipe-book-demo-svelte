<script lang="ts">
	import { goto } from "$app/navigation";
	import RecipeFilter from "$lib/components/RecipeFilter.svelte";
	import RecipeForm from "$lib/components/RecipeForm.svelte";
	import RecipeList from "$lib/components/RecipeList.svelte";
	import { isUpdateRecipeDataType, type CreateRecipeData, type RecipeFormSubmissionData, type UpdateRecipeData } from "$lib/recipe-types";
	import { type FilterCriteria, type Recipe } from "$lib/types";
	import { createRecipe, deleteRecipe, fetchAllRecipes, fetchRecipeById, updateRecipe } from "$lib/utils/recipe-service";
	import { onMount } from "svelte";

    // load the data from external
    let recipeList = $state<Recipe[]>([]);
    // recipe pass as props to RecipeForm to edit
    // control which mode RecipForm is (Add, Edit)
    let recipeEdit = $state<Recipe | null>(null);

    // state for filter, sort
    let filterBy: FilterCriteria = $state({
        category: null,
        prepTimeMin: null,
        sortBy: 'DATE_ASC'
    });

    let filteredRecipeList: Recipe[] = $derived.by(() => {
        // clone the recipeList state into a new array
        // avoid directly mutating $state
        let result = recipeList.slice();
        const { category, prepTimeMin, sortBy } = filterBy;
        // filter by category
        if(category) {
            result = result.filter(r => r.category === category);
        }
        // filter by prepTimeMin under
        if(prepTimeMin) {
            result = result.filter(r => r.prepTimeMin <= prepTimeMin);
        }
        // sorting
        if(sortBy) {
            const sortersFunc = {
                DATE_ASC: (first: Recipe, second: Recipe) => 
                    first.dateCreated.getTime() - second.dateCreated.getTime(),
                DATE_DESC: (first: Recipe, second: Recipe) => 
                    second.dateCreated.getTime() - first.dateCreated.getTime()
            };
            const sorter = sortersFunc[sortBy];
            // sort by func callback, return a new copy of arr
            if (sorter) result = result.toSorted(sorter);
        }

        return result;
    });

    onMount(async () => {
        // run code when component is mounted to DOM, run once
        // for code that run when client side rendering
        //recipeList = fetchRecipesData();
        //initCurrentIdData();

        // fetch data from api
        recipeList = await fetchAllRecipes();
    })
    
    // add + edit recipe
    const onSaveRecipe = async (recipeData: RecipeFormSubmissionData) => {
        console.log('recipe form data: ', recipeData);
        if(recipeEdit && isUpdateRecipeDataType(recipeData)) {
            // Edit recipe
            await editRecipe(recipeData);
        }
        else {
            // Add recipe
            await addRecipe(recipeData);
        }
        // reset child form state
        recipeEdit = null;
    }
    const addRecipe = async (recipeData: CreateRecipeData) => {
        // create recipe 
        const created = await createRecipe(recipeData);
        if(created !== null) {
            // push new recipe to recipe[] in client if insert success
            recipeList.push(created);
        }
    }
    const editRecipe = async (recipeData: UpdateRecipeData) => {
        // find recipe index
        const index = recipeList.findIndex(r => r.id === recipeData.id);
        if(index === -1) {
            console.error('Cannot find recipe with id: ', recipeData.id);
            return;
        }
        // update recipe
        const updated = await updateRecipe(recipeData); 
        if (updated !== null) {
            // update recipe in recipe[] in client if update success
            recipeList[index] = updated;
        }
    }
    // edit recipe (open form)
    const onOpenEditForm = (recipeId: string) => {
        console.log('recipe edit id:', recipeId);
        const recipe = recipeList.find(r => r.id === recipeId);
        if(recipe) {
            recipeEdit = recipe;
        }
        else {
            console.log('cannot found recipe by id:', recipeId);
        }
    }
    // delete recipe
    const onDeleteRecipe = async (recipeId: string) => {
        console.log('recipe delete: ', recipeId);
        const index = recipeList.findIndex(r => r.id === recipeId);
        //const recipe = await fetchRecipeById(recipeId);
        if(index === -1) {
            console.error('Cannot find recipe with id: ', recipeId);
            return;
        }
        // delete recipe from pb
        const isDeleted = await deleteRecipe(recipeId);
        if(isDeleted) {
            // remove from recipe[] in client if delete success
            recipeList.splice(index, 1);
            // re fetch all data
            //recipeList = await fetchAllRecipes();
        }
        console.log('recipe list: ', $state.snapshot(recipeList));

    }
    // filter recipe
    const onFilterRecipe = (filter: FilterCriteria) => {
        filterBy = {
            category: filter.category,
            prepTimeMin: filter.prepTimeMin,
            sortBy: filter.sortBy
        };
        console.log('master filter state: ', $state.snapshot(filterBy));
    };

</script>

<main class="container mx-auto my-12 p-6 max-w-full">
    <div>
        <button class="btn btn-primary" 
            onclick={() => goto('/recipes/create')}>
            Go to create recipe
        </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-9 gap-8">
        <div class="md:col-span-5">
            <h2 class="text-2xl font-bold text-indigo-700 mb-2 pb-2 text-center">Recipe List</h2>
            <RecipeFilter onFilterChange={onFilterRecipe}/>
            <RecipeList recipeList={filteredRecipeList}
                onEdit={onOpenEditForm} 
                onDelete={onDeleteRecipe}/>
        </div>
        <div class="md:col-span-4">
            <RecipeForm {recipeEdit} 
                {onSaveRecipe} 
                onCancelEdit={() => recipeEdit = null}/>
        </div>
    </div>
</main>

<style>

</style>
