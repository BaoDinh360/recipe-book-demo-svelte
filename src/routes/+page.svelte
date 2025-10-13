<script lang="ts">
	import RecipeFilter from "$lib/components/RecipeFilter.svelte";
	import RecipeForm from "$lib/components/RecipeForm.svelte";
	import RecipeList from "$lib/components/RecipeList.svelte";
	import { type FilterCriteria, type Recipe } from "$lib/types";
	import { initCurrentIdData } from "$lib/utils/id-generator";
	import { fetchRecipesData, persistRecipesData } from "$lib/utils/recipe-store";
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

    onMount(() => {
        // run code when component is mounted to DOM, run once
        // for code that run when client side rendering
        recipeList = fetchRecipesData();
        initCurrentIdData();
    })

    $effect(() => {
        // re-runs this when recipeList state changes
        persistRecipesData(recipeList);
    })
    
    // add + edit recipe
    const onSaveRecipe = (recipeData: Recipe) => {
        console.log('recipeData: ', recipeData);
        if(recipeEdit) {
            // edit mode
            // find index by id, access and modify it
            const index = recipeList.findIndex(r => r.id === recipeData.id);
            if(index === -1) {
                console.error('Cannot find recipe with id: ', recipeData.id);
                return;
            }
            recipeList[index] = recipeData;
        } else {
            // add mode
            recipeList.push(recipeData);
        }
        console.log('Recipe list: ', $state.snapshot(recipeList));
        // persist to localStorage
        //persistRecipes($state.snapshot(recipeList));

        // reset child form state
        recipeEdit = null;
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
    const onDeleteRecipe = (recipeId: string) => {
        console.log('recipe delete: ', recipeId);
        const index = recipeList.findIndex(r => r.id === recipeId);
        recipeList.splice(index, 1);
        console.log('recipe list: ', $state.snapshot(recipeList));

        // persist to localStorage
        //persistRecipes($state.snapshot(recipeList));
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
    <div class="grid grid-cols-1 md:grid-cols-8 gap-8">
        <div class="md:col-span-4">
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
