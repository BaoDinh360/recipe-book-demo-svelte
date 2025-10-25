<script lang="ts">
	import { goto } from "$app/navigation";
	import RecipeFilter from "$lib/components/RecipeFilter.svelte";
	import { type FilterCriteria, type Recipe } from "$lib/types";
	import { fetchAllRecipes } from "$lib/utils/recipe-service";
	import { onMount } from "svelte";

    // load the data from external
    let recipeList = $state<Recipe[]>([]);

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
        //recipeList = await fetchAllRecipes();
    })
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
    <div class="grid grid-cols-1 md:grid-cols-9 gap-8">
        <div class="md:col-span-5">
            <h2 class="text-2xl font-bold text-indigo-700 mb-2 pb-2 text-center">Recipe List</h2>
            <RecipeFilter onFilterChange={onFilterRecipe}/>
            <!-- <RecipeList recipeList={filteredRecipeList}
                onEdit={onOpenEditForm} 
                onDelete={onDeleteRecipe}/> -->
        </div>
        <div class="md:col-span-4">
            
        </div>
    </div>
</main>

<style>

</style>
