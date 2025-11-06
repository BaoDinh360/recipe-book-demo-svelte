<script lang="ts">
	import type { RecipeListItem } from "$lib/recipe-types";
	import RecipeItem from "./RecipeItem.svelte";

    let { recipeList, 
    }: {
        recipeList: RecipeListItem[],
    } = $props();

    let totalItems: number = $derived(recipeList.length);

</script>

<div class="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#if totalItems <= 0}
        <p class="md:col-span-2 text-gray-500 mt-1 text-lg text-center">
            No recipe data
        </p>
    {:else}
        {#each recipeList as listItem (listItem.id) }
            <RecipeItem recipe={listItem}/>
        {/each}
    {/if}
</div>

<style>

</style>