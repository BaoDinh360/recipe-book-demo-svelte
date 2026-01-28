<script lang="ts">
	import { SearchXIcon } from "$lib/icons";
	import type { RecipeListItem } from "$lib/recipe-types";
	import RecipeItem from "./RecipeItem.svelte";

    let { recipeList, 
    }: {
        recipeList: RecipeListItem[],
    } = $props();

    let totalItems: number = $derived(recipeList.length);

</script>

<div class="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {#if totalItems <= 0}
        <div class="col-span-1 md:cok-span-2 lg:col-span-4 flex flex-col items-center justify-center gap-2">
            <SearchXIcon class="size-16 text-base-300" />
            <span class="text-lg text-neutral font-semibold">No result found</span>
            <p class="text-base text-neutral/50">
                We can't find any items matching your search.
            </p>
        </div>
    {:else}
        {#each recipeList as listItem (listItem.id) }
            <RecipeItem recipe={listItem}/>
        {/each}
    {/if}
</div>

<style></style>