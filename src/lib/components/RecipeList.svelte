<script lang="ts">
	import type { RecipeListItem } from "$lib/recipe-types";
	import type { Recipe } from "$lib/types";
	import Pagination from "./Pagination.svelte";
	import RecipeItem from "./RecipeItem.svelte";

    const ITEMS_PER_PAGE = 3;
    const START_PAGE = 1;
    let { recipeList, 
    }: {
        recipeList: RecipeListItem[],
    } = $props();

    let totalItems: number = $derived(recipeList.length);

    // let currentPage: number = $state(START_PAGE);
    // let itemsPerPage: number = $state(ITEMS_PER_PAGE);
    // 
    // let totalPages: number = $derived(Math.ceil(recipeList.length / itemsPerPage));
    // let startIndex: number = $derived((currentPage - 1) * itemsPerPage);
    // let endIndex: number = $derived(startIndex + itemsPerPage);

    // let paginatedItems: Recipe[] = $derived.by(() => {
    //     // clone new array instance
    //     let result = recipeList.slice();
    //     if(result.length <= itemsPerPage) {
    //         console.log(`total items: ${result.length} <= itemsPerPage: ${itemsPerPage}`);
    //         console.log('No pagination needed');
    //     }
    //     else {
    //         result = result.slice(startIndex, endIndex);
    //     }
    //     console.log('paginated recipe items: ', $state.snapshot(result));
    //     return result;
    // });

    // const handlePageChange = (pageNum: number) => {
    //     currentPage = pageNum;
    //     console.log('currentPage: ', $state.snapshot(currentPage));
    // }
    // const handleItemsPerPageChange = (items: number) => {
    //     itemsPerPage = items;
    //     console.log('items per page: ', $state.snapshot(itemsPerPage));
    // }

</script>

<!-- <div class="container mx-auto max-w-full">
    <div class="space-y-4">
        {#if totalItems <= 0}
            <p class="text-gray-500 mt-1 text-lg text-center">
                No recipe on the list
            </p>
        {:else}
            <Pagination {currentPage} 
                {totalPages}
                {itemsPerPage}
                {totalItems}
                onPageChange={handlePageChange} 
                onItemsPerPageChange={handleItemsPerPageChange}/>
            {#each paginatedItems as recipe (recipe.id) }
                <RecipeItem {recipe} {onEdit} {onDelete} />
            {/each}
        {/if}
        {#each recipeList as recipe (recipe.id) }
            <RecipeItem {recipe} />
        {/each}
    </div>
</div> -->

<div class="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#if totalItems <= 0}
        <p class="text-gray-500 mt-1 text-lg text-center">
            No recipe on the list. Start by adding one
        </p>
    {:else}
        {#each recipeList as listItem (listItem.id) }
            <RecipeItem recipe={listItem}/>
        {/each}
    {/if}
</div>

<style>

</style>