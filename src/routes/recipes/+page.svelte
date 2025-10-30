<script lang="ts">
	import Pagination from "$lib/components/Pagination.svelte";
	import RecipeFilter from "$lib/components/RecipeFilter.svelte";
	import RecipeList from "$lib/components/RecipeList.svelte";
	import type { RecipeFilterCriteria } from "$lib/recipe-types";
	import type { PageProps } from "./$types";
	
    // /recipes/index

    // must import the correct level of './$ypes to get the correct ts types'
    let { data }: PageProps = $props();
    let recipeFilters: RecipeFilterCriteria = $derived.by(() => {
        let result: RecipeFilterCriteria = {
            text: undefined,
            category: undefined,
            prepTimeMin: undefined,
            sortBy: undefined
        };
        if(data.recipeFilters) {
            result = data.recipeFilters;
        }
        return result;
    })
    
</script>

<RecipeFilter {recipeFilters}/>

<Pagination 
    currentPage={data.currentPage}
    itemsPerPage={data.itemsPerPage}
    totalPages={data.totalPages}
    totalItems={data.totalItems}/>

<RecipeList recipeList={data.recipeListData}/>

<style>

</style>