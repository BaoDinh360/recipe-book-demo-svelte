<script lang="ts">
	import type { Recipe } from "$lib/types.svelte";
	import RecipeItem from "./RecipeItem.svelte";


    let { recipeList, onEdit, onDelete }: {
        recipeList: Recipe[],
        onEdit: (recipeId: string) => void,
        onDelete: (recipeId: string) => void
    } = $props();

</script>

<div class="container mx-auto max-w-full">
    <div class="space-y-4">
        {#if recipeList.length <= 0}
            <p class="text-gray-500 mt-1 text-lg text-center">
                No recipe on the list
            </p>
        {:else}
            {#each recipeList as recipe (recipe.id) }
                <RecipeItem {recipe} {onEdit} {onDelete} />
            {/each}
        {/if}
    </div>
</div>

<style>

</style>