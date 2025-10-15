<script lang="ts">
	import type { Recipe } from "$lib/types";
	import Pagination from "./Pagination.svelte";
	import RecipeItem from "./RecipeItem.svelte";

    const ITEMS_PER_PAGE = 3;
    const START_PAGE = 1;
    let { recipeList, onEdit, onDelete }: {
        recipeList: Recipe[],
        onEdit: (recipeId: string) => void,
        onDelete: (recipeId: string) => void
    } = $props();

    let currentPage: number = $state(START_PAGE);
    let itemsPerPage: number = $state(ITEMS_PER_PAGE);
    let totalItems: number = $derived(recipeList.length);
    let totalPages: number = $derived(Math.ceil(recipeList.length / itemsPerPage));
    let startIndex: number = $derived((currentPage - 1) * itemsPerPage);
    let endIndex: number = $derived(startIndex + itemsPerPage);

    let paginatedItems: Recipe[] = $derived.by(() => {
        // clone new array instance
        let result = recipeList.slice();
        if(result.length <= itemsPerPage) {
            console.log(`total items: ${result.length} <= itemsPerPage: ${itemsPerPage}`);
            console.log('No pagination needed');
        }
        else {
            result = result.slice(startIndex, endIndex);
        }
        console.log('paginated recipe items: ', $state.snapshot(result));
        return result;
    });

    const handlePageChange = (pageNum: number) => {
        currentPage = pageNum;
        console.log('currentPage: ', $state.snapshot(currentPage));
    }
    const handleItemsPerPageChange = (items: number) => {
        itemsPerPage = items;
        console.log('items per page: ', $state.snapshot(itemsPerPage));
    }

</script>

<div class="container mx-auto max-w-full">
    <div class="space-y-4">
        {#if totalItems <= 0}
            <p class="text-gray-500 mt-1 text-lg text-center">
                No recipe on the list
            </p>
        {:else}
            <!-- Pagination -->
            <Pagination {currentPage} 
                {totalPages}
                {itemsPerPage}
                {totalItems}
                onPageChange={handlePageChange} 
                onItemsPerPageChange={handleItemsPerPageChange}/>
            <!-- render recipe list -->
            {#each paginatedItems as recipe (recipe.id) }
                <RecipeItem {recipe} {onEdit} {onDelete} />
            {/each}
        {/if}
    </div>
    
</div>

<style>

</style>